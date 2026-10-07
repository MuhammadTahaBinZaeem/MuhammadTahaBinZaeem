import assert from "node:assert/strict";

export async function runPeopleChecks({ cdp, navigate, viewport, until, sleep, screenshot, report }) {
  const names = ["Muhammad Hamiz bin Kashif", "Alizay Hassan", "Lameea Mubashir Khan", "Idrees Babar", "Muhammad Fahad Younus", "Tooba Fatima"];
  const inspect = async () => {
    const cards = await cdp.evaluate(`Array.from(document.querySelectorAll('.collaborator')).map(card => {
      const box=card.getBoundingClientRect(),heading=card.querySelector('h3'),r=heading.getBoundingClientRect();
      const portrait=card.querySelector('.collaborator-portrait [data-gallery]'),cover=card.querySelector('.collaborator-cover [data-gallery]');
      return {id:card.id,name:heading.textContent,headingFits:r.left>=box.left&&r.right<=box.right&&r.bottom<=box.bottom,contentFits:card.scrollHeight<=card.clientHeight+2,
        projects:[...card.querySelectorAll('.collaborator-projects a')].map(a=>a.getAttribute('href')),
        portrait:portrait&&JSON.parse(portrait.dataset.gallery),background:cover&&JSON.parse(cover.dataset.gallery),
        fallback:card.querySelector('.collaborator-initials')?.textContent,
        frames:[...card.querySelectorAll('.collaborator-cover,.collaborator-portrait')].map(node=>({height:node.offsetHeight,width:node.offsetWidth})),
        linkedin:[...card.querySelectorAll('a[href*="linkedin.com/"]')].map(a=>({href:a.href,label:a.textContent,target:a.target})),
        readable:[...card.querySelectorAll('p,h3,.link-row a')].every(node=>getComputedStyle(node).visibility!=='hidden')};
    })`);
    assert.deepEqual(cards.map(card => card.name), names, "Six collaborators preserve their required order");
    assert.equal(cards.filter(card => card.portrait).length, 4, "Four confidently matched public profile pictures are displayed");
    assert.equal(cards.filter(card => card.fallback).length, 2, "Unverified profile pictures use two honest initials fallbacks");
    assert.equal(cards.reduce((total, card) => total + card.linkedin.length, 0), 3, "Three confirmed LinkedIn profiles are linked");
    assert.equal(await cdp.evaluate("document.documentElement.scrollWidth>innerWidth"), false, "People cards never create document overflow");
    const backgrounds = new Set(cards.flatMap(card => card.background?.items.map(item => item.src) || []));
    assert.equal(backgrounds.size, cards.filter(card => card.background).length, "Each illustrated collaborator has their own background");
    assert.equal(backgrounds.size, 6, "All six confirmed professional themes have distinct artwork");
    for (const card of cards) {
      assert.ok(card.id.startsWith("person-") && card.headingFits && card.contentFits && card.readable, "Every collaborator is readable inside their card: " + card.name);
      assert.ok(card.projects.length && card.projects.every(href => href.startsWith("/projects#")), "Real shared projects remain crawlable: " + card.name);
      assert.ok(card.portrait || card.fallback, "A verified profile picture or initials remain available: " + card.name);
      if (card.portrait) assert.ok(card.portrait.items.every(item => !backgrounds.has(item.src)), "Profile-picture galleries exclude conceptual art: " + card.name);
      if (card.background) {
        assert.equal(card.background.items.length, 1, "Conceptual art has its own viewer");
        assert.match(card.background.title, /conceptual/i);
      }
      for (const link of card.linkedin) {
        assert.match(link.label, /LinkedIn/);
        assert.equal(link.target, "_blank");
      }
    }
    return cards;
  };
  const key = async (name) => {
    await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: name, code: name });
    await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: name, code: name });
  };
  const view = async (selector, label, width) => {
    await key("Tab");
    await cdp.evaluate(`document.querySelector(${JSON.stringify(selector)}).focus({preventScroll:true})`);
    await sleep(200);
    if (label === "artwork") assert.equal(await cdp.evaluate(`getComputedStyle(document.querySelector(${JSON.stringify(selector)}).parentElement,'::after').borderTopWidth`), "3px", "Keyboard focus has a visible inset ring over the artwork");
    const position = await cdp.evaluate("scrollY");
    const group = await cdp.evaluate(`JSON.parse(document.querySelector(${JSON.stringify(selector)}).dataset.gallery)`);
    await cdp.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    await until(`!!document.querySelector('.image-gallery[open]')`, "People gallery opens");
    await screenshot(`people-${label}-gallery-${width}`);
    const fitted = await cdp.evaluate(`(()=>{const image=document.querySelector('.gallery-full-image'),r=image.getBoundingClientRect();return {inside:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,ratio:r.width/r.height,natural:image.naturalWidth/image.naturalHeight};})()`);
    assert.ok(fitted.inside && Math.abs(fitted.ratio - fitted.natural) < 0.02, "The complete person image fits without cropping or stretching");
    if (group.items.length > 1) {
      assert.equal(await cdp.evaluate(`document.querySelectorAll('.gallery-thumbnails button').length`), group.items.length, "Every related person photograph is included");
      await key("ArrowRight");
      await until(`document.querySelector('.gallery-full-image').src.endsWith(${JSON.stringify(group.items[1].src)})`, "The next real profile picture appears");
      await screenshot(`people-${label}-alternate-${width}`);
    }
    await key("Escape");
    await until(`!document.querySelector('.image-gallery[open]')`, "People gallery closes");
    await sleep(250);
    assert.ok(Math.abs(await cdp.evaluate("scrollY") - position) < 3, "Person gallery returns to exact reading position");
  };
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  for (const width of [320,390,768,1440]) {
    await viewport(width, width < 500 ? 844 : 1000);
    for (const route of ["experience#project-teammates", "#project-teammates"]) {
      await navigate(route);
      if (route.startsWith("experience")) await cdp.evaluate(`document.getElementById('project-teammates').scrollIntoView({block:'start',behavior:'instant'})`);
      await sleep(250);
      const cards = await inspect();
      await screenshot(`people-${route.startsWith("experience") ? "direct" : "book"}-${width}`);
      if (!route.startsWith("experience")) {
        const portrait = cards.find(card => card.portrait);
        const illustrated = cards.find(card => card.background);
        if (portrait) await view("#" + portrait.id + " .collaborator-portrait [data-gallery]", "portrait", width);
        if (illustrated) await view("#" + illustrated.id + " .collaborator-cover [data-gallery]", "artwork", width);
        await cdp.evaluate(`(()=>{const world=document.getElementById('experience');scrollTo({top:Number(world.dataset.scrollStart)+Number(world.dataset.readDistance),behavior:'instant'})})()`);
        await sleep(220);
        assert.equal(await cdp.evaluate(`(()=>{const r=document.querySelector('#experience .world-last-line').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight-45})()`), true, "Expanded people section preserves full chapter reachability");
      }
    }
  }
  await viewport(1440,1000);
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await navigate("experience#project-teammates");
  await cdp.evaluate(`document.getElementById('project-teammates').scrollIntoView({block:'start',behavior:'instant'})`);
  await inspect();
  assert.equal(await cdp.evaluate(`Array.from(document.querySelectorAll('.collaborator')).every(card=>getComputedStyle(card).transitionDuration==='0s')`), true, "Reduced motion keeps the people cards still");
  await screenshot("people-reduced-motion");
  await cdp.send("Emulation.setEmulatedMedia", { media: "print", features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await inspect();
  await screenshot("people-print");
  await cdp.send("Emulation.setEmulatedMedia", { media: "screen", features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  report.checks.push("Six people retain their order, projects and confirmed profile links; authentic profile-picture galleries remain separate from conceptual backgrounds; 320/390/768/1440 book/direct layouts, exact gallery return, chapter reachability, reduced motion and print pass.");
}
