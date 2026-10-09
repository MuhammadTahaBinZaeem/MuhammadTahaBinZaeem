import assert from "node:assert/strict";

export async function runPolishChecks({
  cdp,
  seek,
  navigate,
  viewport,
  until,
  sleep,
  screenshot,
  report,
  worlds,
}) {
  await viewport(1440, 1000);
  await navigate("");
  report.initialLoad = await cdp.evaluate(`(()=>{
    const entries=performance.getEntriesByType('resource');
    const documentBytes=performance.getEntriesByType('navigation')[0]?.decodedBodySize||0;
    const resourceBytes=entries.reduce((n,e)=>n+e.decodedBodySize,0);
    return {
      scope:'Local preview; decoded bytes are not network transfer or field Core Web Vitals',
      requests:entries.length,
      decodedResourceBytes:resourceBytes,
      decodedDocumentBytes:documentBytes,
      totalDecodedBytes:documentBytes+resourceBytes,
      images:entries.filter(e=>e.initiatorType==='img').map(e=>new URL(e.name).pathname),
      fonts:entries.filter(e=>e.name.includes('/fonts/')).length
    };
  })()`);
  assert.ok(
    !report.initialLoad.images.some((src) => src.includes("/frames/")),
    "No unused PNG sequence download",
  );

  await seek("foreword");
  await cdp.evaluate(`document.querySelector('.book-location').click()`);
  assert.equal(
    await cdp.evaluate(`document.querySelector('.book-chapter-menu').inert`),
    false,
  );
  await sleep(280);
  await screenshot("unified-contents-menu");
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
  });
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
  });
  assert.equal(
    await cdp.evaluate(
      `document.activeElement===document.querySelector('.book-location')`,
    ),
    true,
  );
  assert.equal(
    await cdp.evaluate(`document.querySelector('.book-chapter-menu').inert`),
    true,
  );
  assert.equal(
    await cdp.evaluate(
      `document.querySelectorAll('.book-edge-tabs,.world-marginalia,.book-world .next-chapter').length`,
    ),
    0,
  );

  for (let i = 0; i < worlds.length - 1; i++) {
    const id = worlds[i];
    await seek(id, 1, 0.45);
    const forward = await cdp.evaluate(
      `({visible:getComputedStyle(document.querySelector('.book-rift')).visibility,kind:document.querySelector('.book-rift').dataset.kind,transform:document.querySelector('.rift-left').style.transform,opacity:document.querySelector('.book-rift').style.opacity})`,
    );
    assert.equal(forward.visible, "visible");
    assert.equal(forward.kind, "turn");
    assert.equal(
      await cdp.evaluate(`[...document.querySelectorAll('.book-world')].every(e=>e.inert)`),
      true,
      "Turning paper cannot receive keyboard focus",
    );
    await screenshot("scroll-tear-" + id);
    await seek(worlds[i + 1]);
    await seek(id, 1, 0.45);
    assert.equal(
      await cdp.evaluate(
        `document.querySelector('.rift-left').style.transform`,
      ),
      forward.transform,
      "Reversible tear: " + id,
    );
    assert.equal(
      await cdp.evaluate(`document.querySelector('.book-rift').style.opacity`),
      forward.opacity,
    );
  }
  report.checks.push(
    "All eight chapter boundaries tear on normal scrolling and reproduce exactly when scrolled backward; duplicate controls and next-chapter prompts are absent.",
  );

  await seek("research", 0.12);
  const before = await cdp.evaluate("scrollY");
  const wheel = (deltaY) =>
    cdp.send("Input.dispatchMouseEvent", {
      type: "mouseWheel",
      x: 650,
      y: 450,
      deltaX: 0,
      deltaY,
    });
  assert.equal(
    await cdp.evaluate(`document.querySelector('.living-book').dataset.smoothing`),
    "native",
    "The browser owns document scrolling",
  );
  await cdp.evaluate(`window.__portfolioWheelPrevented = false; document.addEventListener('wheel', event => { window.__portfolioWheelPrevented ||= event.defaultPrevented; }, { passive: true });`);
  await wheel(650);
  await until(
    `Math.abs(scrollY - ${before + 650}) < 3`,
    "native forward wheel reaches unmodified destination",
  );
  assert.equal(
    await cdp.evaluate("window.__portfolioWheelPrevented"),
    false,
    "Portfolio motion does not prevent the native wheel event",
  );
  await wheel(-650);
  await until(
    `Math.abs(scrollY - ${before}) < 3`,
    "native reverse wheel returns to the same coordinate",
  );
  await wheel(750);
  await until(`Math.abs(scrollY - ${before + 750}) < 3`, "native forward gesture");
  await wheel(-1100);
  await until(`Math.abs(scrollY - ${before - 350}) < 3`, "native direction reversal");
  const idle = await cdp.evaluate("scrollY");
  await sleep(250);
  assert.equal(await cdp.evaluate("scrollY"), idle, "No scripted idle scroll drift");
  report.checks.push(
    "Wheel input remains native: no prevented events, no changed wheel multiplier, reversible vertical coordinates and no scripted idle drift.",
  );

  await seek("projects");
  const rail = await cdp.evaluate(`(()=>{const scene=document.querySelector('#projects [data-scroll-scene="horizontal"]');if(!scene||scene.dataset.sceneReady!=='book')return null;const body=scene.closest('.book-content'),world=scene.closest('.book-world'),viewport=scene.querySelector('[data-scroll-viewport]'),track=scene.querySelector('[data-scroll-track]');return{top:scene.getBoundingClientRect().top-body.getBoundingClientRect().top,start:Number(world.dataset.scrollStart),distance:scene.offsetHeight-viewport.offsetHeight,travel:track.scrollWidth-viewport.clientWidth};})()`);
  if (rail) {
    const at = rail.start + rail.top;
    await cdp.evaluate(`scrollTo({top:${at + rail.distance * 0.3},behavior:'instant'})`);
    await sleep(100);
    const earlier = await cdp.evaluate(`({x:new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#projects [data-scroll-track]')).transform).m41,top:document.querySelector('#projects [data-scroll-viewport]').getBoundingClientRect().top})`);
    await cdp.evaluate(`scrollTo({top:${at + rail.distance * 0.7},behavior:'instant'})`);
    await sleep(100);
    const later = await cdp.evaluate(`new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#projects [data-scroll-track]')).transform).m41`);
    assert.ok(later > earlier.x + rail.travel * 0.2, "Vertical input drives left-to-right project storytelling");
    assert.ok(Math.abs(await cdp.evaluate(`document.querySelector('#projects [data-scroll-viewport]').getBoundingClientRect().top`) - earlier.top) < 3, "Horizontal viewport holds position during the reading interval");
    await screenshot("engineering-horizontal-scene");
    report.checks.push("The engineering rail travels left-to-right while its viewport holds position, driven by ordinary vertical document scroll.");

    const detail = await cdp.evaluate(`(()=>{const node=[...document.querySelectorAll('#projects [data-scroll-track] details')].find(d=>{const r=d.querySelector('summary').getBoundingClientRect();return r.left>0&&r.right<innerWidth&&r.top>28&&r.bottom<innerHeight-100});return node?{id:node.closest('article').id,top:node.querySelector('summary').getBoundingClientRect().top}:null})()`);
    if (detail) {
      const selector = JSON.stringify("#" + detail.id + " details");
      await cdp.evaluate(`document.querySelector(${selector}).open=true`);
      await until(`document.querySelector('#projects [data-scroll-scene]').dataset.sceneReady==='natural'`, "Expanded rail evidence uses normal document flow");
      await sleep(180);
      assert.ok(Math.abs(await cdp.evaluate(`document.querySelector(${selector}).querySelector('summary').getBoundingClientRect().top`) - detail.top) < 3, "Opening rail evidence preserves its reading position");
      await cdp.evaluate(`document.querySelector(${selector}).open=false`);
      await until(`document.querySelector('#projects [data-scroll-scene]').dataset.sceneReady==='book'`, "Closing evidence restores the cinematic rail");
      assert.ok(Math.abs(await cdp.evaluate(`document.querySelector(${selector}).querySelector('summary').getBoundingClientRect().top`) - detail.top) < 3, "Closing evidence preserves its reading position");

      await navigate("projects");
      await until(`document.querySelector('[data-scroll-scene]').dataset.sceneReady==='scroll'`, "Direct chapter horizontal scene ready");
      await cdp.evaluate(`document.querySelector(${selector}).querySelector('summary').focus({preventScroll:true})`);
      await sleep(180);
      const directTop = await cdp.evaluate(`document.querySelector(${selector}).querySelector('summary').getBoundingClientRect().top`);
      await cdp.evaluate(`document.querySelector(${selector}).open=true`);
      await until(`document.querySelector('[data-scroll-scene]').dataset.sceneReady==='natural'`, "Direct chapter expanded evidence uses normal flow");
      await sleep(180);
      assert.ok(Math.abs(await cdp.evaluate(`document.querySelector(${selector}).querySelector('summary').getBoundingClientRect().top`) - directTop) < 3, "Direct chapter evidence preserves its reading position");
      await cdp.evaluate(`document.querySelector(${selector}).open=false`);
      await until(`document.querySelector('[data-scroll-scene]').dataset.sceneReady==='scroll'`, "Direct chapter evidence closes into the rail");
      const naturalRail = async (label) => {
        await until(`(()=>{const scene=document.querySelector('[data-scroll-scene]'),track=scene.querySelector('[data-scroll-track]');return !scene.dataset.sceneReady&&getComputedStyle(track).display==='grid'})()`, label + " uses a vertical project list");
        const state = await cdp.evaluate(`(()=>{const viewport=document.querySelector('[data-scroll-viewport]'),track=document.querySelector('[data-scroll-track]');return {horizontal:viewport.scrollWidth>viewport.clientWidth+1,transform:getComputedStyle(track).transform,overflow:getComputedStyle(viewport).overflowX}})()`);
        assert.equal(state.horizontal, false, label + " requires no horizontal input");
        assert.equal(state.transform, "none", label + " leaves every project in normal document flow");
        assert.equal(state.overflow, "visible", label + " does not clip the project list");
      };
      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
      await naturalRail("Direct reduced-motion edition");
      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
      await until(`document.querySelector('[data-scroll-scene]').dataset.sceneReady==='scroll'`, "Full motion restores direct project storytelling");
      await cdp.evaluate(`document.documentElement.dataset.motion='quiet'`);
      await naturalRail("Direct quiet-motion edition");
      await cdp.evaluate(`document.documentElement.dataset.motion='full'`);
      await until(`document.querySelector('[data-scroll-scene]').dataset.sceneReady==='scroll'`, "Quiet mode can return to full motion");
      await navigate("");
      report.checks.push("Expanded engineering evidence keeps its summary in view on both routes; reduced and quiet direct editions use an unclipped vertical project list and can return to full motion.");
    }
  }

  await seek("atlas", 0.25);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 2, y: 2 });
  await sleep(450);
  const hovered = await cdp.evaluate(
    `(()=>{const a=[...document.querySelectorAll('.atlas-leaf')].find(e=>{const r=e.getBoundingClientRect();return r.top>0&&r.bottom<innerHeight;})||document.querySelector('.atlas-leaf-research');const r=a.getBoundingClientRect(),style=getComputedStyle(a.querySelector('figure'));return {id:a.getAttribute('href').slice(1),x:Math.max(50,r.left+100),y:Math.max(80,Math.min(innerHeight-150,r.top+100)),initial:{translate:style.translate,rotate:style.rotate,scale:style.scale,transform:style.transform}};})()`,
  );
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: hovered.x,
    y: hovered.y,
  });
  await sleep(400);
  await screenshot("atlas-hover");
  const hoverApplied = await cdp.evaluate(
    `(()=>{const e=document.querySelector('.atlas-leaf:hover figure');if(!e)return null;const style=getComputedStyle(e);return {translate:style.translate,rotate:style.rotate,scale:style.scale,transform:style.transform};})()`,
  );
  assert.ok(
    hoverApplied && Object.keys(hovered.initial).some((key) => hoverApplied[key] !== hovered.initial[key]),
    "Atlas hover visibly changes the illustration",
  );
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: 2,
    y: 2,
  });
  await seek("certifications");
  await cdp.evaluate(
    `document.querySelector('#certifications .certificate-sheet a').focus({preventScroll:true})`,
  );
  const r = await cdp.evaluate(
    `(()=>{const r=document.activeElement.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};})()`,
  );
  await cdp.evaluate(`document.activeElement.blur()`);
  await sleep(800);
  const certificateBefore = await cdp.evaluate(`(()=>{const image=document.querySelector('#certifications .certificate-sheet img'),style=getComputedStyle(image),r=image.getBoundingClientRect();return {transform:style.transform,scale:style.scale,width:r.width,height:r.height};})()`);
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", ...r });
  await sleep(400);
  await screenshot("certificate-hover");
  const certificateAfter = await cdp.evaluate(`(()=>{const image=document.querySelector('#certifications .certificate-sheet img'),style=getComputedStyle(image),r=image.getBoundingClientRect();return {transform:style.transform,scale:style.scale,width:r.width,height:r.height};})()`);
  assert.ok(certificateAfter.transform !== certificateBefore.transform || certificateAfter.scale !== certificateBefore.scale, "Certificate hover changes its image transform");
  assert.ok(certificateAfter.width > certificateBefore.width || certificateAfter.height > certificateBefore.height, "Certificate hover visibly enlarges its image");
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: 2,
    y: 2,
  });
  report.checks.push(
    "Contents opens and closes with Escape/focus return; atlas and certificate hover effects are visually captured and transform-tested.",
  );
}
