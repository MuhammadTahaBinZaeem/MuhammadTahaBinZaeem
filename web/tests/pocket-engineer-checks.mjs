import assert from "node:assert/strict";

export async function runPocketChecks({ cdp, navigate, viewport, until, sleep, screenshot, report }) {
  for (const width of [320, 390, 1440]) {
    await viewport(width, width < 500 ? 844 : 1000);
    for (const mode of ["reader", "book"]) {
      await navigate(mode === "reader" ? "projects#pocket-engineer" : "#pocket-engineer");
      if (mode === "reader") {
        await cdp.evaluate(`document.getElementById('pocket-engineer').scrollIntoView({behavior:'instant',block:'start'})`);
        await sleep(650);
      } else {
        await until(`document.querySelector('.living-book').dataset.chapter==='projects'`, "Pocket Engineer opens inside the project chapter");
      }
      await screenshot(`pocket-engineer-${mode}-${width}`);
      const state = await cdp.evaluate(`(()=>{
        const article=document.getElementById('pocket-engineer'),heading=article.querySelector('h2').getBoundingClientRect();
        const image=article.querySelector('.project-screenshot img');
        return {count:document.querySelectorAll('.project-feature').length,overflow:document.documentElement.scrollWidth>innerWidth,left:heading.left,right:heading.right,top:heading.top,width:innerWidth,image:image.naturalWidth,href:article.querySelector('.project-screenshot a').getAttribute('href'),legacy:document.querySelectorAll('#project-algebraic-expression-solver').length};
      })()`);
      assert.equal(state.count, 4);
      assert.equal(state.overflow, false);
      assert.ok(state.left >= 0 && state.right <= state.width + 1, `Title fits ${mode} at ${width}`);
      assert.equal(state.image, 1440);
      assert.equal(state.legacy, 1);
      assert.match(state.href, /pocket-engineer-workbench[.]webp$/);
    }
  }
  const before = await cdp.evaluate(`Number(document.getElementById('projects').dataset.readDistance)`);
  await cdp.evaluate(`document.querySelector('#pocket-engineer .featured-origin').open=true`);
  await until(`Number(document.getElementById('projects').dataset.readDistance)>${before}`, "Original FOP evidence updates book height");
  await cdp.evaluate(`document.querySelector('#pocket-engineer .featured-origin summary').focus({preventScroll:true})`);
  await screenshot("pocket-engineer-original-evidence");
  await navigate("#project-algebraic-expression-solver");
  await until(`document.querySelector('.living-book').dataset.chapter==='projects' && Math.abs(document.getElementById('project-algebraic-expression-solver').getBoundingClientRect().top-70)<8`, "Legacy FOP deep link reaches the promoted project");
  await screenshot("pocket-engineer-legacy-link");
  report.checks.push("Pocket Engineer is fourth in both project views at 320/390/1440 pixels; its screenshot and title fit, original FOP evidence reflows the book, and the old deep link remains usable.");
}
