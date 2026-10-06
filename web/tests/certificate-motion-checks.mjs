import assert from "node:assert/strict";

export async function runCertificateMotionChecks({ cdp, navigate, viewport, until, sleep, screenshot, report }) {
  const sample = async (name) => {
    const state = await cdp.evaluate(`(()=>{
      const rect = node => { const r=node.getBoundingClientRect(); return {left:r.left,top:r.top,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
      return {chapter:document.querySelector('.living-book')?.dataset.chapter,overflow:document.documentElement.scrollWidth>innerWidth, sheets:[...document.querySelectorAll('.certificate-sheet')].map(node=>{
        const style=getComputedStyle(node),matrix=new DOMMatrixReadOnly(style.transform),image=node.querySelector('img');
        return {id:node.id,box:rect(node),layout:{width:node.offsetWidth,height:node.offsetHeight},transform:style.transform,origin:style.transformOrigin,scaleX:Math.hypot(matrix.m11,matrix.m12,matrix.m13),scaleY:Math.hypot(matrix.m21,matrix.m22,matrix.m23),rotationTerms:[matrix.m12,matrix.m13,matrix.m21,matrix.m23,matrix.m31,matrix.m32],perspective:matrix.m34,image:image&&{box:rect(image),width:image.offsetWidth,height:image.offsetHeight,complete:image.complete,naturalWidth:image.naturalWidth}};
      })};
    })()`);
    (report.certificateMotion ||= []).push({ name, ...state });
    await screenshot(name);
    if (name.includes("-book-")) assert.equal(state.chapter, "certifications", name + " preserves the active chapter");
    assert.equal(state.overflow, false, name + " keeps the document within its viewport");
    for (const sheet of state.sheets) {
      assert.ok(sheet.scaleX <= 1.01 && sheet.scaleY <= 1.01, name + " never enlarges a certificate plane: " + sheet.id);
      assert.ok(sheet.rotationTerms.every(value => Math.abs(value) < 0.001), name + " keeps document cards planar: " + sheet.id);
      assert.ok(sheet.box.width <= sheet.layout.width + 1 && sheet.box.height <= sheet.layout.height + 1, name + " keeps the certificate within its allocated area: " + sheet.id);
      if (sheet.image) assert.ok(sheet.image.box.width <= sheet.layout.width + 1, name + " confines the certificate image to its card: " + sheet.id);
    }
  };
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  for (const [width, height] of [[1920,1080], [390,844], [320,844]]) {
    await viewport(width, height);
    await navigate("#certifications");
    await until(`document.querySelector('.living-book').dataset.chapter==='certifications'`, "Certificate book chapter");
    for (const progress of [0, 0.16, 0.45, 1]) {
      await cdp.evaluate(`(()=>{const chapter=document.getElementById('certifications');scrollTo({top:Number(chapter.dataset.scrollStart)+Number(chapter.dataset.readDistance)*${progress},behavior:'instant'})})()`);
      await sleep(220);
      await sample(`certificates-book-${width}-${progress}`);
      if (progress === 1) {
        const ending = await cdp.evaluate(`(()=>{const r=document.querySelector('#certifications .world-last-line').getBoundingClientRect();return {top:r.top,bottom:r.bottom,viewport:innerHeight};})()`);
        assert.ok(ending.top >= 0 && ending.bottom <= ending.viewport - 45, "The complete certificate archive is reachable before turning the page at " + width);
      }
    }
    await viewport(width, height - 100);
    await sleep(300);
    await sample(`certificates-book-resized-${width}`);
    await viewport(width, height);
    await navigate("certifications");
    await cdp.evaluate(`document.querySelector('.certificate-sheet').scrollIntoView({block:'center',behavior:'instant'})`);
    await sleep(1400);
    await sample(`certificates-direct-${width}`);
  }
  report.checks.push("Certificate cards remain planar within their allocated area through book scrolling and remeasurement, and in direct editions, at desktop 1920 and phone 390/320 pixels.");
}
