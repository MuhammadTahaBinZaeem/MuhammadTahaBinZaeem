import assert from "node:assert/strict";

export async function runGalleryChecks({ cdp, navigate, viewport, until, sleep, screenshot, report }) {
  const isOpen = `!!document.querySelector('.image-gallery[open]')`;
  const key = async (key) => {
    await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key, code: key });
    await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code: key });
  };
  const open = async (selector) => {
    await cdp.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    await until(isOpen, "Gallery opens in place");
    await sleep(260);
  };
  const closed = async (position) => {
    await until(`!(${isOpen}) && !document.documentElement.dataset.galleryOpen`, "Gallery returns to page");
    await sleep(250);
    const actual = await cdp.evaluate("scrollY");
    assert.ok(Math.abs(actual - position) < 3, `Closing restores exact scroll position: expected ${position}, got ${actual}`);
  };
  const fits = async () => {
    const result = await cdp.evaluate(`(()=>{
      const image=document.querySelector('.gallery-full-image'), r=image.getBoundingClientRect(), surface=document.querySelector('.gallery-surface');
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight,
        ratio:r.width/r.height,natural:image.naturalWidth/image.naturalHeight,overflow:surface.scrollHeight>surface.clientHeight+1,
        active:document.querySelector('.image-gallery').contains(document.activeElement)};
    })()`);
    assert.ok(result.left >= 0 && result.right <= result.width && result.top >= 0 && result.bottom <= result.height, "Full image fits viewport");
    assert.ok(Math.abs(result.ratio - result.natural) < .02, "Image is neither cropped nor stretched");
    assert.equal(result.overflow, false, "Controls and image fit the dialog");
    assert.equal(result.active, true, "Focus remains in modal");
  };

  for (const width of [320, 390, 768, 1440]) {
    await viewport(width, width < 500 ? 844 : 1000);
    await navigate("#pocket-engineer");
    const position = await cdp.evaluate("scrollY");
    await open("#pocket-engineer .project-screenshot [data-gallery]");
    assert.equal(await cdp.evaluate(`document.querySelectorAll('.gallery-thumbnails button').length`), 4, "All four related images are available even with evidence collapsed");
    await screenshot(`gallery-pocket-${width}`);
    await fits();
    await key("ArrowRight");
    await until(`document.querySelector('.gallery-full-image').src.includes('curve-one')`, "Next arrow changes image");
    await screenshot(`gallery-pocket-next-${width}`);
    await fits();
    await key("ArrowLeft");
    await until(`document.querySelector('.gallery-full-image').src.includes('workbench')`, "Previous arrow restores image");
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: Math.round(width / 2), y: 350, deltaY: 500, deltaX: 0 });
    await sleep(500);
    assert.ok(Math.abs(await cdp.evaluate("scrollY") - position) < 3, "Forward wheel does not move background book");
    await key("Escape");
    await closed(position);
    assert.equal(await cdp.evaluate(`document.activeElement.matches('#pocket-engineer [data-gallery]')`), true, "Trigger regains keyboard focus");

    await open("#pocket-engineer .project-screenshot [data-gallery]");
    await sleep(300);
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: Math.round(width / 2), y: 350, deltaY: -140, deltaX: 0 });
    await closed(position);
    await open("#pocket-engineer .project-screenshot [data-gallery]");
    await cdp.evaluate("history.back()");
    await closed(position);

    await navigate("certifications#issuer-duke");
    await cdp.evaluate(`document.querySelector('#issuer-duke .gallery-trigger').scrollIntoView({block:'center',behavior:'instant'})`);
    await sleep(400);
    await screenshot(`gallery-certificate-frames-${width}`);
    const certPosition = await cdp.evaluate("scrollY");
    await open("#issuer-duke .gallery-trigger");
    assert.equal(await cdp.evaluate(`document.querySelectorAll('.gallery-thumbnails button').length`), 4, "Duke's four related course certificates are grouped");
    await screenshot(`gallery-duke-${width}`);
    await fits();
    await cdp.evaluate(`document.querySelector('.gallery-thumbnails button:last-child').click()`);
    await until(`document.querySelector('.gallery-count').textContent==='4 / 4'`, "Thumbnail chooses exact image");
    await cdp.evaluate(`document.querySelector('.gallery-close').click()`);
    await closed(certPosition);

    await navigate("achievements#achievement-sempec-junior-hardware-runner-up");
    await cdp.evaluate(`document.querySelector('#achievement-sempec-junior-hardware-runner-up').scrollIntoView({block:'start',behavior:'instant'})`);
    await sleep(400);
    await screenshot(`gallery-achievement-frames-${width}`);
    const awardPosition = await cdp.evaluate("scrollY");
    await open("#achievement-sempec-junior-hardware-runner-up .gallery-trigger");
    assert.equal(await cdp.evaluate(`document.querySelectorAll('.gallery-thumbnails button').length`), 2, "Both SEMPEC photos are accessible");
    await key("ArrowRight");
    await screenshot(`gallery-sempec-second-${width}`);
    await fits();
    await key("Escape");
    await closed(awardPosition);

    await navigate("experience#project-teammates");
    await cdp.evaluate(`document.querySelector('#project-teammates').scrollIntoView({block:'start',behavior:'instant'})`);
    await sleep(600);
    await screenshot(`collaborators-${width}`);
    assert.equal(await cdp.evaluate(`document.querySelectorAll('.collaborator').length`), 5);
    assert.equal(await cdp.evaluate(`document.documentElement.scrollWidth>innerWidth`), false);
  }
  // A real touch gesture on mobile navigates within the gallery, then closes it.
  await viewport(390, 844);
  await navigate("#pocket-engineer");
  const touchPosition = await cdp.evaluate("scrollY");
  await open("#pocket-engineer .gallery-trigger");
  for (const [type, x, y] of [["touchStart",300,350],["touchMove",180,355],["touchEnd",0,0]])
    await cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{x,y}] });
  await until(`document.querySelector('.gallery-count').textContent==='2 / 4'`, "Swipe advances gallery");
  for (const [type, x, y] of [["touchStart",190,280],["touchMove",190,480],["touchEnd",0,0]])
    await cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{x,y}] });
  await closed(touchPosition);
  await viewport(1440, 1000);
  await navigate("projects#paretoco");
  await cdp.evaluate(`document.querySelector('#paretoco').scrollIntoView({block:'start',behavior:'instant'})`);
  await sleep(400);
  const singlePosition = await cdp.evaluate("scrollY");
  await open("#paretoco .gallery-trigger");
  assert.equal(await cdp.evaluate(`document.querySelectorAll('.gallery-arrow,.gallery-thumbnails').length`), 0, "Single-image viewer has no redundant controls");
  await screenshot("gallery-ink-study");
  await fits();
  assert.equal(await cdp.evaluate(`getComputedStyle(document.querySelector('.gallery-full-image')).backgroundColor`), "rgb(243, 238, 223)", "Transparent ink is legible on paper");
  for (let i=0;i<5;i++) {
    await cdp.send("Input.dispatchKeyEvent", {type:"keyDown",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});
    await cdp.send("Input.dispatchKeyEvent", {type:"keyUp",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});
    assert.equal(await cdp.evaluate(`document.querySelector('.image-gallery').contains(document.activeElement)`), true, "Tab is contained in the modal");
  }
  await key("Escape");
  await closed(singlePosition);
  await cdp.send("Emulation.setEmulatedMedia", {features:[{name:"prefers-reduced-motion",value:"reduce"}]});
  await open("#paretoco .gallery-trigger");
  assert.equal(await cdp.evaluate(`getComputedStyle(document.querySelector('.gallery-full-image')).animationName`), "none");
  await screenshot("gallery-reduced-motion");
  await key("Escape");
  await closed(singlePosition);
  await cdp.send("Emulation.setEmulatedMedia", {features:[]});
  report.checks.push("Galleries at 320/390/768/1440: complete related groups, uncropped images, keyboard and thumbnails, scroll/Back/Escape/Close return to exact reading position, trapped focus, locked background, real mobile swipe navigation and dismissal; five credited collaborators fit.");
}
