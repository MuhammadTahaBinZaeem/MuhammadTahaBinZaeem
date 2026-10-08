/** Shared animation vocabulary. Native document scroll always owns the input. */
export type MotionPose = {
  x: number;
  y: number;
  rotation: number;
  rotationY: number;
  scale: number;
};

const REVEAL_SELECTOR = "[data-reveal], [data-paper], [data-book-leaf]";

/** A card and its evidence share one entrance, so transforms never compound. */
export function collectRevealTargets(scope: HTMLElement): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    .filter((node) => {
      const owner = node.parentElement?.closest<HTMLElement>(REVEAL_SELECTOR);
      return !owner || !scope.contains(owner);
    });
}

export function chapterPose(
  node: HTMLElement,
  index: number,
  chapter: string,
  compact = false,
): MotionPose {
  const paper = node.hasAttribute("data-paper");
  const leaf = node.hasAttribute("data-book-leaf");
  const direction = index % 2 ? -1 : 1;
  const pose: MotionPose = { x: 0, y: 44, rotation: 0, rotationY: 0, scale: 1 };
  if (leaf) Object.assign(pose, { x: direction * 72, y: 92, rotation: direction * 5, scale: 0.93 });
  else if (chapter === "projects") Object.assign(pose, { x: paper ? 120 : -72, y: 34, rotation: paper ? 5 : 0, rotationY: paper ? -9 : 0, scale: paper ? 0.96 : 1 });
  else if (chapter === "research") Object.assign(pose, { x: direction * 44, y: 54, rotation: paper ? direction * 2 : 0, scale: paper ? 0.93 : 1 });
  else if (chapter === "experience") Object.assign(pose, { x: -86, y: 28, rotation: paper ? -4 : 0 });
  else if (chapter === "education") Object.assign(pose, { x: 0, y: paper ? 128 : 92, rotation: paper ? -3 : 0, scale: paper ? 0.94 : 1 });
  else if (chapter === "certifications") Object.assign(pose, { x: paper ? direction * 38 : 0, y: paper ? 108 : 58, rotation: paper ? direction * 4 : 0, rotationY: paper ? direction * 12 : 0, scale: paper ? 0.96 : 1 });
  else if (chapter === "achievements") Object.assign(pose, { x: paper ? direction * 28 : 0, y: paper ? 118 : 84, rotation: paper ? direction * 6 : 0, scale: paper ? 0.9 : 1 });
  else if (chapter === "connect") Object.assign(pose, { x: direction * 30, y: 72, rotation: paper ? -3 : 0 });
  else if (paper) Object.assign(pose, { x: direction * 28, y: 70, rotation: direction * 3, scale: 0.97 });

  switch (node.dataset.motionDirection) {
    case "left": pose.x = -110; pose.y = 0; break;
    case "right": pose.x = 110; pose.y = 0; break;
    case "up": pose.x = 0; pose.y = 120; break;
    case "down": pose.x = 0; pose.y = -85; break;
  }
  // Reading cards stay planar within their grid cells. In particular, rotating
  // a large certificate beneath a perspective parent can project its corners
  // over neighbouring documents; animate only a small vertical entrance.
  if (chapter === "certifications" || node.matches("article, .collaborator-card, .education-story, .credential-collection")) {
    Object.assign(pose, { x: 0, y: 46, rotation: 0, rotationY: 0, scale: 1 });
  }
  if (compact) {
    pose.x *= 0.4;
    pose.y *= 0.55;
    pose.rotation *= 0.5;
    pose.rotationY = 0;
  }
  return pose;
}

export const REST_POSE: MotionPose = { x: 0, y: 0, rotation: 0, rotationY: 0, scale: 1 };
export const PLANAR_TRANSFORM = { force3D: false, rotationX: 0, rotationY: 0, z: 0 } as const;

export type SceneLayer = {
  node: HTMLElement;
  trigger: HTMLElement;
  kind: "artwork" | "heading";
  order: number;
  from: Record<string, number | string | boolean>;
  to: Record<string, number | string | boolean>;
};

/** Scenic crops move inside fixed frames; photographs of evidence stay still. */
export function collectSceneLayers(scope: HTMLElement, chapter: string, compact = false): SceneLayer[] {
  const layers: SceneLayer[] = [];
  const directions: Record<string, [number, number]> = {
    projects: [3, 1], research: [1, 3], experience: [-2, 2],
    education: [0, 4], certifications: [2, 1], achievements: [-3, 3], connect: [2, 2],
  };
  const [x, y] = directions[chapter] || [2, 2];
  const factor = compact ? 0.55 : 1;
  scope.querySelectorAll<HTMLElement>(".chapter-atmosphere > .gallery-trigger > img, .campus-banner > .gallery-trigger > img, .collaborator-cover > .gallery-trigger > img")
    .forEach((node, order) => {
      const trigger = node.closest<HTMLElement>(".chapter-heading--illustrated, .campus-banner, .collaborator-cover");
      if (!trigger) return;
      layers.push({
        node, trigger, kind: "artwork", order,
        from: { "--scene-x": `${-x * factor}%`, "--scene-y": `${y * factor}%`, "--scene-zoom": compact ? 1.09 : 1.16 },
        to: { "--scene-x": `${x * factor}%`, "--scene-y": `${-y * factor}%`, "--scene-zoom": compact ? 1.05 : 1.1 },
      });
    });
  scope.querySelectorAll<HTMLElement>(".page-heading, .atlas-heading").forEach((heading) => {
    const copy = heading.querySelector<HTMLElement>(".chapter-heading__copy") || heading;
    Array.from(copy.children).filter((node): node is HTMLElement => node instanceof HTMLElement && node.matches(".eyebrow, .book-kicker, h1, h2, .heading-tail"))
      .forEach((node, order) => {
        // An existing reveal owner already animates this whole composition.
        if (node.closest("[data-reveal], [data-paper], [data-book-leaf]")) return;
        layers.push({
          node, trigger: heading, kind: "heading", order,
          from: { x: 0, y: (node.matches("h1,h2") ? 58 : 30) * factor, ...PLANAR_TRANSFORM },
          to: { ...REST_POSE, ...PLANAR_TRANSFORM },
        });
      });
  });
  return layers;
}

/** Attribute changes activate only decorative crop CSS, and are reversible. */
export function activateSceneLayers(layers: SceneLayer[]) {
  const originals = layers.filter((layer) => layer.kind === "artwork").map(({ node }) => ({ node, value: node.getAttribute("data-scene-image") }));
  originals.forEach(({ node }) => node.setAttribute("data-scene-image", "true"));
  return () => originals.forEach(({ node, value }) => {
    if (value === null) node.removeAttribute("data-scene-image");
    else node.setAttribute("data-scene-image", value);
  });
}

/** Adjacent columns arrive in a wave without an extra animation on children. */
export function revealColumnDelay(node: HTMLElement, scope: HTMLElement, compact = false) {
  if (compact || !node.matches("article, [data-book-leaf], .note-card, .skill-group")) return 0;
  const bounds = node.getBoundingClientRect();
  const frame = scope.getBoundingClientRect();
  return Math.max(0, Math.min(0.16, (bounds.left - frame.left) / Math.max(1, frame.width) * 0.2));
}

export type HorizontalScene = {
  scene: HTMLElement;
  viewport: HTMLElement;
  track: HTMLElement;
  travel: number;
  distance: number;
  original: { scene: string; viewport: string; track: string };
};

export function collectHorizontalScenes(scope: HTMLElement): HorizontalScene[] {
  return Array.from(scope.querySelectorAll<HTMLElement>('[data-scroll-scene="horizontal"]'))
    .flatMap((scene) => {
      const viewport = scene.querySelector<HTMLElement>("[data-scroll-viewport]");
      const track = scene.querySelector<HTMLElement>("[data-scroll-track]");
      return viewport && track ? [{ scene, viewport, track, travel: 0, distance: 0, original: { scene: scene.style.cssText, viewport: viewport.style.cssText, track: track.style.cssText } }] : [];
    });
}

export function measureHorizontalScene(item: HorizontalScene, mode: "book" | "scroll") {
  const { scene, viewport, track } = item;
  // Measure the proposed cinematic layout before deciding whether it fits.
  // Expanded evidence returns to ordinary document flow so no text is clipped.
  scene.dataset.sceneReady = mode;
  const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
  const viewportHeight = viewport.offsetHeight;
  const fits = viewportHeight <= innerHeight - 88 && Array.from(track.children).every((card) => (card as HTMLElement).scrollHeight <= viewportHeight + 4);
  const enabled = innerWidth >= 900 && travel > 8 && fits && !scene.querySelector("details[open]");
  item.travel = enabled ? travel : 0;
  item.distance = enabled ? Math.max(innerHeight * 0.75, travel * 0.9) : 0;
  scene.dataset.sceneReady = enabled ? mode : "natural";
  if (enabled) {
    scene.style.height = `${viewport.offsetHeight + item.distance}px`;
    viewport.style.position = mode === "book" ? "relative" : "sticky";
    viewport.style.top = mode === "book" ? "0px" : "10vh";
    viewport.style.overflow = "hidden";
  } else {
    scene.style.cssText = item.original.scene;
    viewport.style.cssText = item.original.viewport;
    track.style.cssText = item.original.track;
  }
}

export function resetHorizontalScenes(items: HorizontalScene[]) {
  items.forEach(({ scene, viewport, track, original }) => {
    scene.style.cssText = original.scene;
    viewport.style.cssText = original.viewport;
    track.style.cssText = original.track;
    delete scene.dataset.sceneReady;
  });
}

/** Delegated pointer tracking avoids listeners and animation loops per card. */
export function attachReactiveMotion(scope: HTMLElement) {
  const media = matchMedia("(hover: hover) and (pointer: fine)");
  if (!media.matches) return () => {};
  let current: HTMLElement | null = null;
  let frame = 0;
  let x = 0;
  let y = 0;
  const reset = () => {
    if (!current) return;
    current.style.setProperty("--tilt-x", "0deg");
    current.style.setProperty("--tilt-y", "0deg");
    current.dataset.pointerActive = "false";
    current = null;
  };
  const paint = () => {
    frame = 0;
    if (!current) return;
    const rect = current.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
    current.classList.add("motion-reactive");
    current.dataset.pointerActive = "true";
    current.style.setProperty("--pointer-x", `${(px * 100).toFixed(2)}%`);
    current.style.setProperty("--pointer-y", `${(py * 100).toFixed(2)}%`);
    current.style.setProperty("--tilt-x", `${((0.5 - py) * 7).toFixed(2)}deg`);
    current.style.setProperty("--tilt-y", `${((px - 0.5) * 9).toFixed(2)}deg`);
  };
  const move = (event: PointerEvent) => {
    const target = (event.target as Element).closest<HTMLElement>("[data-reactive], .atlas-leaf, .feature-art, .education-campus, .honor-card, .collaborator-card");
    if (!target || !scope.contains(target)) { reset(); return; }
    if (current !== target) { reset(); current = target; }
    x = event.clientX;
    y = event.clientY;
    if (!frame) frame = requestAnimationFrame(paint);
  };
  scope.addEventListener("pointermove", move, { passive: true });
  scope.addEventListener("pointerleave", reset);
  scope.addEventListener("pointercancel", reset);
  return () => {
    cancelAnimationFrame(frame);
    reset();
    scope.removeEventListener("pointermove", move);
    scope.removeEventListener("pointerleave", reset);
    scope.removeEventListener("pointercancel", reset);
    scope.querySelectorAll<HTMLElement>(".motion-reactive").forEach((node) => {
      node.classList.remove("motion-reactive");
      delete node.dataset.pointerActive;
      ["--pointer-x", "--pointer-y", "--tilt-x", "--tilt-y"].forEach((name) => node.style.removeProperty(name));
    });
  };
}
