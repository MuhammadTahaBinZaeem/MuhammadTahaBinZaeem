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
  await wheel(650);
  await sleep(80);
  const during = await cdp.evaluate("scrollY");
  assert.ok(
    during > before && during < before + 650 * 0.85,
    "Wheel input is interpolated, not jumped",
  );
  await until(
    `document.querySelector('.living-book').dataset.smoothing==='idle'`,
    "wheel settles",
  );
  const after = await cdp.evaluate("scrollY");
  assert.ok(
    Math.abs(after - before - 650 * 0.85) < 3,
    "Forward wheel destination is controlled",
  );
  await wheel(-650);
  await until(
    `document.querySelector('.living-book').dataset.smoothing==='idle'`,
    "reverse wheel settles",
  );
  assert.ok(
    Math.abs((await cdp.evaluate("scrollY")) - before) < 3,
    "Reverse wheel returns to same coordinate",
  );
  await wheel(750);
  await sleep(85);
  const reversalStart = await cdp.evaluate("scrollY");
  await wheel(-1100);
  await until(
    `document.querySelector('.living-book').dataset.smoothing==='idle'`,
    "mid-flight reversal settles",
  );
  assert.ok(
    (await cdp.evaluate("scrollY")) < reversalStart,
    "Opposite input reverses momentum",
  );
  const idle = await cdp.evaluate("scrollY");
  await sleep(250);
  assert.equal(await cdp.evaluate("scrollY"), idle, "No idle scroll drift");
  await wheel(750);
  await sleep(85);
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  const cancelled = await cdp.evaluate("scrollY");
  await sleep(250);
  assert.equal(await cdp.evaluate("scrollY"), cancelled, "Escape stops pending wheel momentum");
  report.checks.push(
    "Real wheel input smooths forward and backward, reverses mid-flight, reaches the requested coordinate and sleeps without idle drift; Escape cancels pending momentum.",
  );

  await seek("atlas", 0.25);
  const hovered = await cdp.evaluate(
    `(()=>{const a=[...document.querySelectorAll('.atlas-leaf')].find(e=>{const r=e.getBoundingClientRect();return r.top>0&&r.bottom<innerHeight;})||document.querySelector('.atlas-leaf-research');const r=a.getBoundingClientRect();return {id:a.getAttribute('href').slice(1),x:Math.max(50,r.left+100),y:Math.max(80,Math.min(innerHeight-150,r.top+100))};})()`,
  );
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: hovered.x,
    y: hovered.y,
  });
  await sleep(400);
  await screenshot("atlas-hover");
  const hoverApplied = await cdp.evaluate(
    `(()=>{const e=document.querySelector('.atlas-leaf:hover figure');return e&&getComputedStyle(e).translate!=='none';})()`,
  );
  assert.equal(
    hoverApplied,
    true,
    "Atlas hover moves the illustration without competing with GSAP",
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
    `(()=>{const r=document.activeElement.getBoundingClientRect();return{x:r.left+100,y:r.top+100};})()`,
  );
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", ...r });
  await sleep(400);
  await screenshot("certificate-hover");
  assert.ok(
    Number(
      await cdp.evaluate(
        `getComputedStyle(document.querySelector('#certifications .certificate-sheet img')).scale`,
      ),
    ) > 1,
    "Certificate hover is visible",
  );
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: 2,
    y: 2,
  });
  report.checks.push(
    "Contents opens and closes with Escape/focus return; atlas and certificate hover effects are visually captured and transform-tested.",
  );
}
