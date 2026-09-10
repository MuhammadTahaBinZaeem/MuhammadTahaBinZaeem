import assert from "node:assert/strict";

// Tests use the real native scroll position, not a mocked animation clock.
export async function runBookChecks({
  cdp,
  navigate,
  viewport,
  screenshot,
  until,
  sleep,
  report,
}) {
  const worlds = [
    "foreword",
    "atlas",
    "projects",
    "research",
    "experience",
    "education",
    "certifications",
    "achievements",
    "connect",
  ];
  async function seek(id, read = 0, turn = 0) {
    await cdp.evaluate(
      `window.dispatchEvent(new WheelEvent('wheel',{deltaY:0}))`,
    );
    await cdp.evaluate(
      `(()=>{const e=document.getElementById(${JSON.stringify(id)});scrollTo({top:Number(e.dataset.scrollStart)+Number(e.dataset.readDistance)*${read}+Number(e.dataset.turnDistance)*${turn},behavior:'instant'});})()`,
    );
    await sleep(180);
  }
  const state = () =>
    cdp.evaluate(
      `({chapter:document.querySelector('.living-book').dataset.chapter,turn:Number(document.querySelector('.living-book').dataset.turn),mode:document.querySelector('.living-book').dataset.mode,scroll:scrollY})`,
    );
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  const widths = process.env.BOOK_WIDTHS
    ? process.env.BOOK_WIDTHS.split(",").map(Number)
    : [320, 390, 768, 1440];
  for (const width of widths) {
    await viewport(width, width < 500 ? 844 : 1000);
    await navigate("");
    assert.equal((await state()).chapter, "cover");
    const coverBounds = await cdp.evaluate(
      `(()=>{const a=document.querySelector('.cover-face').getBoundingClientRect(),b=document.querySelector('.cover-invitation').getBoundingClientRect(),f=document.querySelector('.cover-foot').getBoundingClientRect();return{overlap:Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top),footInside:f.bottom<=a.bottom+10,ready:!document.querySelector('.cover-open-hit').disabled};})()`,
    );
    assert.equal(
      coverBounds.overlap,
      false,
      "Cover and invitation overlap at " + width,
    );
    assert.equal(
      coverBounds.footInside,
      true,
      "Cover typography fits at " + width,
    );
    assert.equal(coverBounds.ready, true);
    await cdp.evaluate(
      `window.__bookDocument='preserved';document.querySelector('.cover-open-hit').click()`,
    );
    await until(
      `document.querySelector('.living-book').dataset.chapter==='foreword' && scrollY>=Number(document.querySelector('.living-book').dataset.coverDistance)-3`,
      "cover opening",
    );
    await screenshot("book-open-" + width);
    for (const id of worlds) {
      await seek(id);
      assert.equal((await state()).chapter, id, id + " at " + width);
      const accessibility = await cdp.evaluate(
        `({active:[...document.querySelectorAll('.book-world')].filter(e=>!e.inert).map(e=>e.id),visible:[...document.querySelectorAll('.book-world')].filter(e=>getComputedStyle(e).visibility==='visible').map(e=>e.id),h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,overflow:document.documentElement.scrollWidth>innerWidth})`,
      );
      assert.deepEqual(accessibility.active, [id]);
      assert.deepEqual(accessibility.visible, [id]);
      assert.equal(accessibility.main, 1);
      assert.equal(accessibility.h1, 1);
      assert.equal(accessibility.overflow, false);
      await screenshot("world-" + id + "-" + width);
      if (
        width === 1440 ||
        (width === 390 &&
          ["atlas", "projects", "certifications", "achievements"].includes(id))
      ) {
        await seek(id, 0.48);
        await screenshot("reading-" + id + "-" + width);
      }
      await seek(id, 1);
      assert.ok(
        await cdp.evaluate(
          `(()=>{const r=document.querySelector('#${id} .world-last-line').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight-45;})()`,
        ),
        "Full chapter can be read before page turn: " + id + " at " + width,
      );
    }
    assert.equal(await cdp.evaluate("window.__bookDocument"), "preserved");
  }
  report.checks.push(
    `Cover and nine embedded worlds at ${widths.join("/")} pixels; one main/h1, no document overflow, only the current world is focusable, no chapter reloads; all chapter endings reachable.`,
  );

  await viewport(844, 390);
  await navigate("");
  await screenshot("cover-landscape");
  assert.equal(
    await cdp.evaluate(
      `(()=>{const a=document.querySelector('.closed-book').getBoundingClientRect(),b=document.querySelector('.cover-invitation').getBoundingClientRect();return a.right>b.left&&a.left<b.right&&a.bottom>b.top&&a.top<b.bottom;})()`,
    ),
    false,
    "Landscape cover and invitation do not overlap",
  );
  await viewport(1440, 1000);
  await navigate("");
  // Same scroll coordinate must render the same leaf angle in either direction.
  const forward = [];
  for (const turn of [0.15, 0.35, 0.55, 0.85]) {
    await seek("foreword", 1, turn);
    forward.push(
      await cdp.evaluate(
        `getComputedStyle(document.querySelector('#foreword')).transform`,
      ),
    );
    assert.ok(Math.abs((await state()).turn - turn) < 0.003);
    await screenshot("page-turn-" + turn);
  }
  for (const [i, turn] of [0.15, 0.35, 0.55, 0.85].entries()) {
    await seek("atlas");
    await seek("foreword", 1, turn);
    assert.equal(
      await cdp.evaluate(
        `getComputedStyle(document.querySelector('#foreword')).transform`,
      ),
      forward[i],
      "Reverse turn " + turn,
    );
  }
  await screenshot("page-turn-reversed");
  await seek("atlas", 0.25);
  await screenshot("atlas-in-motion");
  report.checks.push(
    "Four forward page-turn angles match their reverse-scroll render exactly; atlas leaves move with scroll.",
  );

  await cdp.evaluate(
    `document.querySelector('.atlas-leaf-achievements').click()`,
  );
  await sleep(450);
  await screenshot("chapter-jump-tearing");
  await until(
    `document.querySelector('.living-book').dataset.chapter==='achievements' && getComputedStyle(document.querySelector('.book-rift')).visibility==='hidden'`,
    "tear jump complete",
  );
  assert.equal(await cdp.evaluate("location.pathname"), "/");
  await screenshot("chapter-jump-complete");
  await cdp.evaluate("history.back()");
  await until(
    `document.querySelector('.living-book').dataset.chapter==='atlas'`,
    "browser back to atlas",
  );
  await cdp.evaluate(`document.querySelector('.atlas-leaf-connect').click()`);
  await sleep(80);
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseWheel",
    x: 700,
    y: 500,
    deltaX: 0,
    deltaY: -120,
  });
  await until(
    `getComputedStyle(document.querySelector('.book-rift')).visibility==='hidden'`,
    "native wheel cancels jump",
  );
  report.checks.push(
    "Chapter jumps tear open without route changes; browser Back works; native wheel cancels an in-flight jump.",
  );

  await navigate("#research");
  await until(
    `document.querySelector('.living-book').dataset.chapter==='research'`,
    "direct research hash",
  );
  await seek("projects");
  const initialHeight = await cdp.evaluate(
    `Number(document.getElementById('projects').dataset.readDistance)`,
  );
  await cdp.evaluate(
    `document.querySelector('#engineering details').open=true`,
  );
  await until(
    `Number(document.getElementById('projects').dataset.readDistance)>${initialHeight}`,
    "expanded content remeasured",
  );
  assert.equal((await state()).chapter, "projects");
  await cdp.evaluate(
    `document.querySelector('#engineering details').open=false;document.querySelector('#projects a[href="#repositories"]').click()`,
  );
  await until(
    `Math.abs(document.querySelector('#repositories').getBoundingClientRect().top-70)<6 && getComputedStyle(document.querySelector('.book-rift')).visibility==='hidden'`,
    "internal subsection anchor",
  );
  const setInput = (value) =>
    cdp.evaluate(
      `(()=>{const e=document.querySelector('#repo-search');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`,
    );
  await setInput("Mips_Chess_Engine");
  await until(
    `document.querySelectorAll('.repo-row').length===1`,
    "search inside book",
  );
  await setInput("no-repository-has-this-name");
  await until(`!!document.querySelector('.empty-state')`, "empty results");
  await setInput("");
  await cdp.evaluate(
    `const select=document.querySelector('#repo-kind');select.value='forks';select.dispatchEvent(new Event('change',{bubbles:true}));`,
  );
  await until(
    `[...document.querySelectorAll('.repo-meta')].length>0 && [...document.querySelectorAll('.repo-meta')].every(e=>e.textContent.includes('Fork'))`,
    "fork filter",
  );
  await screenshot("book-repository-filter");
  report.checks.push(
    "Direct hashes, subsection links, details expansion/reflow, repository search/empty state and fork filtering work inside the book.",
  );

  await seek("certifications");
  await until(
    `!document.getElementById('certifications').inert`,
    "certification chapter focusable",
  );
  await cdp.evaluate(
    `document.querySelector('#certifications .certificate-sheet a').focus({preventScroll:true})`,
  );
  const focused = await cdp.evaluate(
    `(()=>{const r=document.activeElement.getBoundingClientRect();return{top:r.top,bottom:r.bottom,chapter:document.activeElement.closest('.book-world')?.id};})()`,
  );
  assert.equal(focused.chapter, "certifications");
  assert.ok(
    focused.top >= 0 && focused.top < 900,
    "Offscreen keyboard focus scrolls its paper into view",
  );
  await screenshot("keyboard-certificate-focus");

  await seek("research", 0.3);
  await viewport(390, 844);
  await until(
    `document.querySelector('.living-book').dataset.chapter==='research' && Math.abs(document.querySelector('.book-stage').getBoundingClientRect().height-innerHeight)<2`,
    "resize keeps chapter and viewport in sync",
  );
  await seek("research", 0.3);
  await screenshot("resized-research-mobile");
  await viewport(1440, 1000);
  await sleep(250);
  await seek("experience", 0.9);
  await screenshot("experience-initiative-note");
  await seek("research", 0.48);
  const statusContrast = await cdp.evaluate(
    `(()=>{const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');function luminance(color){ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);const values=[...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return values[0]*.2126+values[1]*.7152+values[2]*.0722;}return [...document.querySelectorAll('#research .status, #experience .big-note, #connect .cv-card')].map(e=>{const s=getComputedStyle(e),a=luminance(s.color),b=luminance(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});})()`,
  );
  assert.ok(
    statusContrast.length > 0 && statusContrast.every((ratio) => ratio >= 4.5),
    "Status labels, initiative note and CV cards meet 4.5:1 text contrast",
  );
  const revision = await cdp.evaluate(
    `document.querySelector('.living-book').dataset.layoutRevision`,
  );
  await sleep(350);
  assert.equal(
    await cdp.evaluate(
      `document.querySelector('.living-book').dataset.layoutRevision`,
    ),
    revision,
    "No idle resize/rebuild loop",
  );
  report.performance = await cdp.evaluate(
    `new Promise(resolve=>{const e=document.getElementById('research'),top=Number(e.dataset.scrollStart),distance=Number(e.dataset.readDistance)+Number(e.dataset.turnDistance);let start,previous;const intervals=[],longTasks=[];const observer=new PerformanceObserver(list=>longTasks.push(...list.getEntries().map(x=>Math.round(x.duration))));observer.observe({type:'longtask'});function tick(now){start??=now;if(previous)intervals.push(now-previous);previous=now;const p=Math.min(1,(now-start)/2000);scrollTo({top:top+distance*p,behavior:'instant'});if(p<1)requestAnimationFrame(tick);else{observer.disconnect();intervals.sort((a,b)=>a-b);resolve({scope:'Local headless browser only; not field Core Web Vitals',frames:intervals.length,frameIntervalP95Ms:Math.round(intervals[Math.floor(intervals.length*.95)]),longTasksOver50Ms:longTasks,resources:performance.getEntriesByType('resource').length});}}requestAnimationFrame(tick);})`,
  );

  await seek("research", 0.3);
  await cdp.evaluate(`document.querySelector('.book-dock button').click()`);
  await until(
    `document.querySelector('.living-book').dataset.mode==='reader'`,
    "reader mode",
  );
  assert.equal(
    await cdp.evaluate(
      `document.querySelectorAll('.book-world[inert]').length`,
    ),
    0,
  );
  assert.equal(
    await cdp.evaluate(
      `getComputedStyle(document.querySelector('.book-world')).position`,
    ),
    "relative",
  );
  assert.ok(
    Math.abs(
      await cdp.evaluate(
        `document.getElementById('research').getBoundingClientRect().top`,
      ),
    ) < 5,
    "Reader mode keeps current chapter",
  );
  await screenshot("reader-mode-research");
  await cdp.evaluate(`document.querySelector('.book-dock button').click()`);
  await until(
    `document.querySelector('.living-book').dataset.mode==='book' && document.querySelector('.living-book').dataset.chapter==='research'`,
    "return to book",
  );
  await cdp.evaluate(`document.querySelector('.book-dock button').click()`);
  await navigate("");
  assert.equal((await state()).mode, "reader", "Saved reader preference");
  await cdp.evaluate(`localStorage.removeItem('mtbz:book-reader')`);
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate("");
  await until(
    `document.querySelector('.living-book').dataset.mode==='reader'`,
    "system reduced motion",
  );
  await screenshot("system-reduced-motion");
  report.checks.push(
    "Offscreen keyboard focus is brought into view; reader mode preserves the chapter, persists, and activates for system reduced-motion.",
  );
}
