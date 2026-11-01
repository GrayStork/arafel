// Spirits: rock-art dancers with a rod, drawn in stained-glass contour lines.
// Each slot (svg.ei-spirit with data-pool) shows one pose, drifts, throws the hit,
// flickers and sometimes vanishes and gives way to the next pose in its pool.

const NS = "http://www.w3.org/2000/svg";
const HG = (a: number, b: number, c: number, d: number, wx: number, wy: number, e: number, f: number, g: number, h: number) =>
  `M${a} ${b} L${c} ${d} L${wx} ${wy} Z M${wx} ${wy} L${g} ${h} L${e} ${f} Z`;

interface Pose { name: string; h: [number, number, number]; d: string[]; orn: string; dots: [number, number][] }

export const POSES: Pose[] = [
  { name: "Third point", h: [100, 48, 11], d: [HG(82, 66, 118, 66, 100, 112, 86, 150, 114, 150), "M90 150 L76 196 L70 238", "M110 150 L126 196 L134 238", "M118 68 L142 94 L156 104", "M82 68 L62 94 L54 124", "M156 36 L156 240", "M150 44 L156 36 L162 44"], orn: "M100 22 m-6 0 a6 6 0 1 1 6 6 a3 3 0 1 1 -3 -3", dots: [[54, 128], [146, 238]] },
  { name: "Axis", h: [100, 52, 11], d: ["M100 26 L100 240", HG(82, 70, 118, 70, 100, 114, 86, 150, 114, 150), "M82 72 L66 94 L96 106", "M118 72 L134 94 L104 106", "M90 150 L70 188 L80 238", "M110 150 L130 188 L120 238"], orn: "M100 14 l-6 6 l6 6 l6 -6 z", dots: [[66, 96], [134, 96]] },
  { name: "Kneel", h: [92, 86, 10], d: [HG(76, 102, 108, 102, 92, 140, 80, 170, 104, 170), "M98 170 L132 182 L130 238", "M86 170 L74 238 L40 238", "M150 46 L150 240", "M108 104 L134 118 L150 112", "M76 104 L60 72 L66 38"], orn: "M66 26 m-5 0 a5 5 0 1 1 5 5 a2.5 2.5 0 1 1 -2.5 -2.5", dots: [[40, 238], [150, 46]] },
  { name: "Staff", h: [100, 70, 10], d: [HG(84, 88, 116, 88, 100, 130, 88, 166, 112, 166), "M84 90 L64 60 L60 36", "M116 90 L136 60 L140 36", "M18 34 L182 38", "M92 166 L62 204 L46 240", "M108 166 L138 204 L154 240"], orn: "M18 34 l-6 -6 M18 34 l-6 6 M182 38 l6 -6 M182 38 l6 6", dots: [[100, 22], [46, 240], [154, 240]] },
  { name: "Wings", h: [100, 60, 10], d: ["M42 232 L160 22", HG(84, 78, 116, 78, 100, 118, 88, 156, 112, 156), "M84 80 L52 72 L22 90", "M116 80 L148 72 L178 90", "M22 90 L12 80 M22 90 L10 96", "M178 90 L188 80 M178 90 L190 96", "M92 156 L86 200 L90 240", "M108 156 L132 182 L116 206"], orn: "M160 22 l-4 10 l10 -4 z", dots: [[90, 240], [116, 206]] },
  { name: "Lunge", h: [80, 92, 10], d: [HG(64, 110, 96, 104, 86, 146, 74, 176, 98, 172), "M96 172 L140 196 L150 240", "M78 176 L46 210 L18 240", "M56 152 L194 96", "M96 106 L126 120", "M64 112 L84 140"], orn: "M194 96 l-12 -2 l6 10 z", dots: [[18, 240], [150, 240]] },
];

function el(n: string, a: Record<string, string | number>, p?: Element) {
  const e = document.createElementNS(NS, n);
  for (const k in a) e.setAttribute(k, String(a[k]));
  p?.appendChild(e);
  return e;
}

function draw(g: Element, s: Pose) {
  for (const L of ["l1", "l2", "l3", "l4"]) {
    const lay = el("g", { class: L }, g);
    for (const d of s.d) el("path", { d }, lay);
    el("circle", { cx: s.h[0], cy: s.h[1], r: s.h[2] }, lay);
  }
}

let uid = 0;
function make(svg: SVGSVGElement, first: Pose) {
  const id = `sp${uid++}`;
  const defs = el("defs", {}, svg);
  const f = el("filter", { id: `f-${id}`, x: "-30%", y: "-20%", width: "160%", height: "140%" }, defs);
  const turb = el("feTurbulence", { type: "fractalNoise", baseFrequency: "0.02", numOctaves: 2, seed: 3 + uid * 7 }, f);
  const disp = el("feDisplacementMap", { in: "SourceGraphic", scale: 2, xChannelSelector: "R", yChannelSelector: "G" }, f);
  el("rect", { x: 0, y: 40, width: 200, height: 60 }, el("clipPath", { id: `a-${id}` }, defs));
  el("rect", { x: 0, y: 150, width: 200, height: 46 }, el("clipPath", { id: `b-${id}` }, defs));
  const spirit = el("g", { class: "sp", filter: `url(#f-${id})` }, svg) as SVGGElement;
  const main = el("g", {}, spirit);
  const gs = el("g", { class: "sp-ghost sp-s", "clip-path": `url(#a-${id})` }, spirit) as SVGGElement;
  const ge = el("g", { class: "sp-ghost sp-e", "clip-path": `url(#b-${id})` }, spirit) as SVGGElement;
  const orn = el("path", { class: "sp-orn", d: "" }, spirit);
  const dots = el("g", {}, spirit);
  const set = (s: Pose) => {
    for (const g of [main, gs, ge]) g.replaceChildren();
    draw(main, s); draw(gs, s); draw(ge, s);
    orn.setAttribute("d", s.orn);
    dots.replaceChildren();
    for (const [x, y] of s.dots) el("circle", { class: "sp-dot", cx: x, cy: y, r: 2.6 }, dots);
  };
  set(first);
  return { spirit, gs, ge, disp, turb, set };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
function rhythm(seed: number) {
  let x = seed;
  return () => { x = (x * 9301 + 49297) % 233280; const r = x / 233280; return r < 0.5 ? 700 + r * 900 : r < 0.85 ? 2000 + r * 2600 : 4500 + r * 4000; };
}

export function mountSpirits() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll<SVGSVGElement>("svg.ei-spirit").forEach((svg) => {
    if (svg.dataset.mounted) return;
    svg.dataset.mounted = "1";
    const pool = (svg.dataset.pool ?? "0").split(",").map(Number);
    const o = make(svg, POSES[pool[0]]);
    if (reduce) return;
    const next = rhythm(Number(svg.dataset.seed ?? 41));
    const hit = async () => {
      o.gs.style.opacity = "1"; o.gs.style.transform = "translateX(-4px)"; o.disp.setAttribute("scale", "9");
      await wait(70);
      o.ge.style.opacity = "1"; o.ge.style.transform = "translateX(3px)"; o.gs.style.transform = "translateX(2px)";
      await wait(70);
      o.gs.style.opacity = "0"; o.ge.style.opacity = "0"; o.disp.setAttribute("scale", "2");
    };
    const flicker = async (n: number) => {
      for (let i = 0; i < n; i++) {
        o.spirit.classList.add(i % 2 ? "is-dim" : "is-gone"); await wait(60 + ((i * 37) % 80));
        o.spirit.classList.remove("is-gone", "is-dim"); await wait(50 + ((i * 53) % 120));
      }
    };
    const drift = async (ms: number) => {
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        const t = (performance.now() - t0) / 1000;
        o.turb.setAttribute("baseFrequency", (0.02 + 0.008 * Math.sin(t * 1.3)).toFixed(4));
        await wait(90);
      }
    };
    // Dissolve: the lines melt into turbulence and fade; reform runs it backwards.
    const melt = async (out: boolean) => {
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const t = out ? i / steps : 1 - i / steps;
        o.disp.setAttribute("scale", String(2 + t * t * 46));
        o.turb.setAttribute("baseFrequency", (0.02 + t * 0.03).toFixed(4));
        o.spirit.style.opacity = String(1 - t * 0.95);
        await wait(45 + (i % 3) * 15);
      }
      if (!out) { o.spirit.style.opacity = ""; o.disp.setAttribute("scale", "2"); }
    };
    let k = 0;
    const swap = async (how: number) => {
      k = (k + 1) % pool.length;
      if (how === 0) {
        // dissolve into the fog, reform as the next pose
        await melt(true); o.set(POSES[pool[k]]); await wait(120 + (next() % 400)); await melt(false); await hit();
      } else if (how === 1) {
        // vanish on the hit, reappear as the next pose after a gap
        await hit(); o.spirit.classList.add("is-gone"); await wait(400 + (next() % 900));
        o.set(POSES[pool[k]]); o.spirit.classList.remove("is-gone"); await flicker(2); await hit();
      } else {
        // hard cut: the hit carries one pose into the next
        await flicker(2); o.set(POSES[pool[k]]); await hit(); await flicker(1);
      }
    };
    (async () => {
      await wait(600);
      for (;;) {
        await drift(Math.min(next(), 4200));
        const r = next() % 10;
        if (r < 2) await hit();
        else if (r < 3) { await hit(); await flicker(3); }
        else if (r < 6) await swap(0);
        else if (r < 8) await swap(1);
        else await swap(2);
      }
    })();
  });
}
