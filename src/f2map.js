// ===== f2map.js : 사냥터 개편 1탄 — 2단계 「으스스 버섯골」 맵 · 그래픽 =====
// 거대한 버섯 갓 위를 건너다니는 맵이에요. 세팅은 F2_CFG 한 곳에 모았어요. (좌표는 사냥터 안 칸 번호: 가로 0~61, 세로 0~25)
const F2_CFG = {
  id: 'fa2',
  pal: { v: '#221c38', l: '#8f7cb8', c: '#5b4a86', d: '#b98a5a', o: '#e2543b', vy: -6, deco: 'shroom' },   // 2D 화면 색: 바깥 · 땅 · 절벽 · 다리 · 장애물
  // 버섯 갓(섬): [가운데 x, 가운데 y, 반지름 x, 반지름 y, 색] — 0번 = 입구, 4번 = 다음 단계 문, 마지막 = 보스 무대
  caps: [[6.5, 13, 4.8, 4.4, 'violet'], [17, 7.8, 4.2, 3.6, 'teal'], [17, 18.7, 4.0, 3.4, 'rose'], [28.5, 13, 6.0, 5.4, 'violet'], [54.5, 5.5, 4.4, 3.6, 'teal'], [39.5, 7.5, 3.8, 3.4, 'rose'], [39.5, 19, 3.6, 3.2, 'teal'], [51, 17, 6.8, 6.4, 'arena']],
  // 다리(폭 2칸): ['h', 세로 칸, 가로 시작, 가로 끝] = 가로 다리 · ['v', 가로 칸, 세로 시작, 세로 끝] = 세로 다리
  bridges: [['h', 9, 8, 15], ['h', 15, 8, 16], ['v', 16, 10, 16], ['h', 8, 19, 26], ['h', 16, 19, 26], ['h', 9, 32, 38], ['h', 5, 42, 51], ['h', 16, 31, 38], ['h', 18, 42, 45], ['v', 39, 10, 17], ['v', 54, 8, 13]],
  cols: { violet: ['#8c76ba', '#5f4a92', '#d8cbf2'], teal: ['#6cb6a9', '#3f8479', '#d6f3ec'], rose: ['#d08ea9', '#9c5a7a', '#f8dde8'], arena: ['#655c9e', '#3c356e', '#c2b2ff'] },   // 갓 색: [윗면, 테두리, 점무늬]
  props: { edge: .16, inner: .04, kinds: [['tall', 4], ['glow', 3], ['stump', 2], ['puff', 2]] },   // 장애물: 가장자리 칸 16% · 안쪽 칸 4% · 종류별 비율(키 큰 버섯 · 빛나는 버섯 · 그루터기 · 포자 주머니)
  landmark: [28, 9],                                              // 가운데 갓의 대왕 등불 버섯 자리
  deco: { tiny: .12, fern: .15, dots: .2 },                       // 밟을 수 있는 꾸밈: 꼬마 버섯 · 풀 · 빛 알갱이 (칸당 확률)
  giants: { n: 64, tall: [1.4, 4.2], low: [-3.4, -.8], r: [1.3, 2.8] },   // 바깥 거대 버섯: 개수 · 높이(뒤쪽은 높게 / 앞쪽은 발밑 아래) · 갓 크기
  lamps: 12,                                                      // 보스 무대 둘레 유령 버섯 등불 수
  mood: { fog: '#4b4080', sky: '#463c78', floor: '#3a3166', hemi: .84, sun: .72, tint: '#cdbfff', cool: .3, nightCut: .6, spd: 1.6 },   // 분위기: 안개색 · 하늘색 · 빛 세기 배율 · 빛 색 · 차가운 보정 · 밤에 덜 어둡게 · 바뀌는 빠르기
  air: { spores: 90, flies: 26, box: [11, 3.4, 8] },               // 떠다니는 포자 · 반딧불 수 · 주인공 둘레 범위(칸)
  mist: [[-1.5, .7, .012, '#cbbdf7'], [-3.6, .85, -.007, '#9488d8']],   // 발밑 안개층: [높이, 진하기, 흐르는 빠르기, 색]
};
const F2S = { mood: 0, fight: 0, tex: {}, mat: {}, geo: null };
function f2Rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function f2InCap(e, lx, ly) { return ((lx + .5 - e.cx) / e.rx) ** 2 + ((ly + .5 - e.cy) / e.ry) ** 2 < 1; }

// ---------- 1) 지형 다시 만들기 (게임이 켜질 때 한 번) ----------
(function f2Terrain() { const C = F2_CFG, F = fById(C.id); if (!F) return; F.v2 = 1; F.pal = C.pal;
  for (let y = F.y - 2; y < F.y - 2 + FBAND && y < HT; y++) for (let x = 0; x < W; x++) { ground[y][x] = G_FV; solid[y][x] = true; }
  const set = (lx, ly, code, sol) => { if (lx < 0 || ly < 0 || lx >= FW || ly >= FH) return; ground[F.y + ly][F.x + lx] = code; solid[F.y + ly][F.x + lx] = sol; };
  const at = (lx, ly) => (ground[F.y + ly] || [])[F.x + lx];
  F.ell = C.caps.map(([cx, cy, rx, ry, col], k) => ({ cx, cy, rx, ry, k, col }));
  const isIn = (lx, ly) => F.ell.some(e => f2InCap(e, lx, ly)), A = F.ell[F.ell.length - 1];
  for (let ly = 0; ly < FH; ly++) for (let lx = 0; lx < FW; lx++) if (isIn(lx, ly)) set(lx, ly, G_FL, false);
  F.decks = [];
  for (const [d, a, b0, b1] of C.bridges) { const cells = []; for (let t = b0; t <= b1; t++) for (const w of [0, 1]) { const lx = d === 'h' ? t : a + w, ly = d === 'h' ? a + w : t; if (at(lx, ly) === G_FV) { set(lx, ly, G_FD, false); cells.push([lx, ly]); } }
    if (cells.length) { const xs = cells.map(c => c[0]), ys = cells.map(c => c[1]); F.decks.push({ d, x0: Math.min(...xs), x1: Math.max(...xs) + 1, y0: Math.min(...ys), y1: Math.max(...ys) + 1 }); } }
  F.ent = [Math.round(F.ell[0].cx - 1), Math.round(F.ell[0].cy)]; F.board = [F.ent[0] - 2, F.ent[1] - 2]; F.obs = [];
  const r = f2Rng(9973), tot = C.props.kinds.reduce((a, q) => a + q[1], 0), pick = () => { let t = r() * tot; for (const [k, w] of C.props.kinds) if ((t -= w) <= 0) return k; return C.props.kinds[0][0]; };
  const nearDeck = (lx, ly) => { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (at(lx + dx, ly + dy) === G_FD) return true; return false; };
  const gates = [[F.ell[0].cx - F.ell[0].rx, F.ell[0].cy], [F.ell[4].cx + F.ell[4].rx, F.ell[4].cy], [C.landmark[0] + 1, C.landmark[1]]];
  for (let ly = 1; ly < FH - 1; ly++) for (let lx = 1; lx < FW - 1; lx++) { if (at(lx, ly) !== G_FL || nearDeck(lx, ly) || f2InCap(A, lx, ly) || Math.hypot(lx - F.ent[0], ly - F.ent[1]) < 4.5 || gates.some(([gx, gy]) => Math.hypot(lx + .5 - gx, ly + .5 - gy) < 3)) continue;
    const edge = !isIn(lx - 1, ly) || !isIn(lx + 1, ly) || !isIn(lx, ly - 1) || !isIn(lx, ly + 1); if (r() < (edge ? C.props.edge : C.props.inner)) { set(lx, ly, G_FL, true); F.obs.push([lx, ly, r(), pick()]); } }
  { const [lx, ly] = C.landmark; set(lx, ly, G_FL, true); set(lx + 1, ly, G_FL, true); F.obs.push([lx, ly, .5, 'land'], [lx + 1, ly, .5, 'none']); }
  F.land = []; F.landAll = []; for (let ly = 0; ly < FH; ly++) for (let lx = 0; lx < FW; lx++) if (!solid[F.y + ly][F.x + lx] && at(lx, ly) === G_FL) { F.landAll.push([F.x + lx, F.y + ly]); if (!f2InCap(A, lx, ly)) F.land.push([F.x + lx, F.y + ly]); }
})();

// ---------- 2) 3D 모형 ----------
function f2Css(a, b, k) { return '#' + new THREE.Color(mixHex(a, b, k)).getHexString(); }
function f2Tex(key, w, h, draw) { if (F2S.tex[key]) return F2S.tex[key]; const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return F2S.tex[key] = new THREE.CanvasTexture(c); }
function f2CapTex(name) { const [top, rim, dot] = F2_CFG.cols[name]; return f2Tex('cap_' + name, 512, 512, (g, w) => { const r = f2Rng(name.length * 977 + name.charCodeAt(0)), c = w / 2;
  const gr = g.createRadialGradient(c, c, w * .04, c, c, w * .5); gr.addColorStop(0, f2Css(top, '#ffffff', .2)); gr.addColorStop(.6, top); gr.addColorStop(.9, rim); gr.addColorStop(1, rim); g.fillStyle = gr; g.fillRect(0, 0, w, w);
  for (let i = 0; i < 460; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * c; g.fillStyle = r() < .5 ? 'rgba(255,255,255,.07)' : 'rgba(30,10,50,.07)'; g.beginPath(); g.arc(c + Math.cos(a) * d, c + Math.sin(a) * d, 1.5 + r() * 4, 0, 6.283); g.fill(); }
  g.strokeStyle = 'rgba(30,10,50,.12)'; g.lineWidth = 2; for (let i = 0; i < 80; i++) { const a = i / 80 * 6.283 + r() * .05; g.beginPath(); g.moveTo(c + Math.cos(a) * c * .78, c + Math.sin(a) * c * .78); g.lineTo(c + Math.cos(a) * c * .99, c + Math.sin(a) * c * .99); g.stroke(); }
  if (name === 'arena') { g.strokeStyle = dot; g.globalAlpha = .75; g.lineWidth = 7; g.beginPath(); g.arc(c, c, c * .8, 0, 6.283); g.stroke(); g.lineWidth = 3; g.setLineDash([16, 12]); g.beginPath(); g.arc(c, c, c * .68, 0, 6.283); g.stroke(); g.setLineDash([]);
    g.beginPath(); g.arc(c, c, c * .3, 0, 6.283); g.stroke(); g.fillStyle = dot; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; g.globalAlpha = .7; g.beginPath(); g.arc(c + Math.cos(a) * c * .74, c + Math.sin(a) * c * .74, 9, 0, 6.283); g.fill(); }
    g.globalAlpha = .55; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 - 1.5708, d = c * (i % 2 ? .1 : .24); g[i ? 'lineTo' : 'moveTo'](c + Math.cos(a) * d, c + Math.sin(a) * d); } g.closePath(); g.fill(); g.globalAlpha = 1; }
  else for (let i = 0; i < 18; i++) { const a = r() * 6.283, d = (.15 + r() * .68) * c, s = 12 + r() * 22, x = c + Math.cos(a) * d, y = c + Math.sin(a) * d; g.globalAlpha = .5; g.fillStyle = dot; g.beginPath(); g.ellipse(x, y, s, s * (.7 + r() * .3), r() * 3, 0, 6.283); g.fill(); g.globalAlpha = .35; g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x - s * .2, y - s * .2, s * .45, s * .35, 0, 0, 6.283); g.fill(); g.globalAlpha = 1; } }); }
function f2GlowTex() { return f2Tex('glow', 128, 128, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 1, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); }); }
function f2MistTex() { const t = f2Tex('mist', 256, 256, (g, w) => { const r = f2Rng(4441); for (let i = 0; i < 40; i++) { const x = r() * w, y = r() * w, s = 40 + r() * 70, a = .22 + r() * .3; for (const ox of [-w, 0, w]) for (const oy of [-w, 0, w]) { const gr = g.createRadialGradient(x + ox, y + oy, 1, x + ox, y + oy, s); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x + ox - s, y + oy - s, s * 2, s * 2); } } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
function f2Glow(col, size, x, y, z, op) { const m = new THREE.Mesh(F2S.pg || (F2S.pg = new THREE.PlaneBufferGeometry(1, 1)), new THREE.MeshBasicMaterial({ map: f2GlowTex(), color: col, transparent: true, opacity: op === undefined ? .5 : op, blending: THREE.AdditiveBlending, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.scale.set(size, size, 1); m.position.set(x, y, z); m.renderOrder = 2; return m; }
function f2Prop(g, kind, X, Z, q, X2) { const m = mesh, capC = ['#d9534a', '#9a6ad0', '#3fa79a', '#e08a3c'][Math.floor(q * 4) % 4];
  if (kind === 'tall') { const h = .8 + q * .7, rc = .5 + q * .22; g.add(m('c', '#efe4cd', .13, h, .13, X, h / 2, Z), m('c', '#f6eedd', .2, .05, .2, X, h - .02, Z), m('hemi', capC, rc, rc * .62, rc, X, h, Z)); for (let i = 0; i < 4; i++) { const a = i * 1.57 + q * 5; g.add(m('sLow', '#fff6e6', .09, .05, .09, X + Math.cos(a) * rc * .55, h + rc * .44, Z + Math.sin(a) * rc * .55)); } g.add(m('sLow', '#fff6e6', .1, .05, .1, X, h + rc * .61, Z)); }
  else if (kind === 'glow') { for (let i = 0; i < 4; i++) { const a = i * 1.7 + q * 6, d = i ? .22 : 0, hh = .22 + ((i * 37 + q * 100) % 7) * .03, x = X + Math.cos(a) * d, z = Z + Math.sin(a) * d; g.add(m('c', '#d9f5ee', .035, hh, .035, x, hh / 2, z), m('hemi', F2S.mat.glowCap, .11, .09, .11, x, hh, z)); } const gl = f2Glow('#6ff2d2', 1.7, X, .05, Z, .5); g.add(gl); F2S.cur.pulse.push(gl.material); }
  else if (kind === 'stump') { g.add(m('c', '#6b4a36', .34, .34, .34, X, .17, Z), m('c', '#b79a72', .29, .02, .29, X, .345, Z), m('s', '#5f8a56', .2, .1, .16, X - .22, .1, Z + .2), m('c', '#efe4cd', .03, .14, .03, X + .2, .4, Z - .05), m('hemi', '#e2543b', .09, .07, .09, X + .2, .46, Z - .05), m('c', '#efe4cd', .025, .1, .025, X + .05, .39, Z + .14), m('hemi', '#e08a3c', .07, .05, .07, X + .05, .43, Z + .14)); }
  else if (kind === 'puff') { g.add(m('s', '#efe6d2', .3, .26, .3, X, .22, Z), m('s', '#e6dcc4', .2, .18, .2, X + .3, .15, Z + .1), m('s', '#f5eede', .16, .14, .16, X - .22, .12, Z + .18), m('sLow', '#b9a58a', .07, .03, .07, X, .47, Z), m('sLow', '#b9a58a', .05, .02, .05, X + .3, .32, Z + .1)); }
  else if (kind === 'land') { const x = X2 === undefined ? X : X2, H0 = 3.3; const st = new THREE.Mesh(new THREE.CylinderBufferGeometry(.26, .42, H0, 14), M('#efe4cd', { roughness: .9 })); st.position.set(x, H0 / 2, Z); st.castShadow = true; g.add(st);
    g.add(m('hemi', '#8f3f9a', 2.1, 1.25, 2.1, x, H0 - .1, Z), m('c', F2S.mat.lampWarm, 1.9, .06, 1.9, x, H0 - .12, Z)); for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283, d = i % 2 ? 1.25 : .7; g.add(m('sLow', F2S.mat.spotWarm, .2, .1, .2, x + Math.cos(a) * d, H0 + (i % 2 ? .62 : 1.02), Z + Math.sin(a) * d)); }
    for (let i = 0; i < 3; i++) { const a = i * 2.1 + .4, sh = m('hemi', '#c98a4a', .34, .08, .34, x + Math.cos(a) * .36, .9 + i * .7, Z + Math.sin(a) * .36); g.add(sh); }
    for (let i = 0; i < 4; i++) { const a = i * 1.57 + .8, ox = Math.cos(a) * 1.2, oz = Math.sin(a) * 1.2, len = .7 + (i % 2) * .5, orb = m('s', F2S.mat.orb, .13, .13, .13, x + ox, H0 - .2 - len, Z + oz); g.add(m('c', '#6b4a33', .012, len, .012, x + ox, H0 - .15 - len / 2, Z + oz), orb); F2S.cur.orbs.push(orb); }
    const gl = f2Glow('#ffd98a', 8.5, x, .06, Z + .6, .42); g.add(gl); F2S.cur.pulse.push(gl.material); } }
function f2Build(F) { const C = F2_CFG, S = R3.scene, g = new THREE.Group(); S.add(g); F.root = g; const zc = ly => zt(F.y + ly), r = f2Rng(31337), X = F.f2 = { pulse: [], orbs: [], mist: [], lampMat: null, ring: null }; F2S.cur = X;
  if (!F2S.geo) { const V = (x, y) => new THREE.Vector2(x, y); F2S.geo = { disc: new THREE.CircleBufferGeometry(1, 56), plane: new THREE.PlaneBufferGeometry(1, 1), skirt: new THREE.LatheBufferGeometry([V(1, 0), V(1.06, -.07), V(1.09, -.22), V(1.05, -.38), V(.92, -.47)], 48), gill: new THREE.LatheBufferGeometry([V(.92, -.47), V(.6, -.56), V(.3, -.62)], 48) };
    F2S.mat.glowCap = new THREE.MeshStandardMaterial({ color: '#8ff5dc', emissive: '#4fe0c0', emissiveIntensity: .9, roughness: .4 }); F2S.mat.lampWarm = new THREE.MeshStandardMaterial({ color: '#ffe9b0', emissive: '#ffc864', emissiveIntensity: .9, roughness: .6 }); F2S.mat.spotWarm = new THREE.MeshStandardMaterial({ color: '#fff0c8', emissive: '#ffd27a', emissiveIntensity: .7, roughness: .5 }); F2S.mat.orb = new THREE.MeshStandardMaterial({ color: '#fff3cf', emissive: '#ffcf6a', emissiveIntensity: 1.2, roughness: .3 }); }
  // 바닥(깊은 숲) · 안개층
  { const fl = new THREE.Mesh(new THREE.PlaneBufferGeometry(W + 90, FBAND + 60), new THREE.MeshBasicMaterial({ color: C.mood.floor })); fl.rotation.x = -Math.PI / 2; fl.position.set(W / 2, -7.2, zc(FH / 2)); g.add(fl);
    C.mist.forEach(([y, op, spd, col], i) => { const tex = i ? f2MistTex().clone() : f2MistTex(); tex.needsUpdate = true; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(7 + i * 2, 4 + i); const pl = new THREE.Mesh(new THREE.PlaneBufferGeometry(W + 90, FBAND + 60), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op, depthWrite: false })); pl.rotation.x = -Math.PI / 2; pl.position.set(W / 2, y, zc(FH / 2)); pl.renderOrder = 1; g.add(pl); X.mist.push([tex, spd]); }); }
  // 버섯 갓
  for (const e of F.ell) { const cx = F.x + e.cx, cz = zc(e.cy), [, rim] = C.cols[e.col], rx = e.rx + .35, rz = e.ry + .35;
    const t = new THREE.Mesh(F2S.geo.disc, new THREE.MeshStandardMaterial({ map: f2CapTex(e.col), roughness: .92 })); t.rotation.x = -Math.PI / 2; t.scale.set(rx, rz, 1); t.position.set(cx, .02, cz); t.receiveShadow = true; g.add(t);
    const sk = new THREE.Mesh(F2S.geo.skirt, M(rim, { roughness: .85, side: 2 })); sk.scale.set(rx, 1, rz); sk.position.set(cx, .02, cz); g.add(sk);
    const gl = new THREE.Mesh(F2S.geo.gill, M('#eadfca', { roughness: 1, side: 2 })); gl.scale.set(rx, 1, rz); gl.position.set(cx, .02, cz); g.add(gl);
    const sr = Math.min(rx, rz) * .3, st = new THREE.Mesh(new THREE.CylinderBufferGeometry(sr, sr * 1.25, 7, 16), M('#cfc2a8', { roughness: 1 })); st.position.set(cx, -4.05, cz); g.add(st); }
  // 다리: 널빤지 + 기둥 + 밧줄 (같은 모양은 한 번에 그려서 가볍게)
  { const planks = [], posts = [], ropes = []; for (const d of F.decks) { const x0 = F.x + d.x0, x1 = F.x + d.x1, z0 = zc(d.y0), z1 = zc(d.y1), h = d.d === 'h', len = h ? x1 - x0 : z1 - z0, n = Math.round(len * 2);
      for (let i = 0; i < n; i++) planks.push(h ? [x0 + (i + .5) * len / n, (z0 + z1) / 2, len / n * .9, z1 - z0 + .16] : [(x0 + x1) / 2, z0 + (i + .5) * len / n, x1 - x0 + .16, len / n * .9]);
      posts.push([x0, z0], [x1, z0], [x0, z1], [x1, z1]); for (const s of [0, 1]) ropes.push([h ? (x0 + x1) / 2 : (s ? x1 : x0), h ? (s ? z1 : z0) : (z0 + z1) / 2, len, h]); }
    const o = new THREE.Object3D(), col = new THREE.Color(), im = new THREE.InstancedMesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .9 }), planks.length);
    planks.forEach(([x, z, sx, sz], i) => { o.position.set(x, -.02 + r() * .02, z); o.scale.set(sx, .1, sz); o.rotation.set(0, (r() - .5) * .04, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); im.setColorAt(i, col.set(mixHex('#b98a5a', '#8a6540', r() * .7))); }); im.receiveShadow = true; g.add(im);
    const pm = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(.06, .06, .56, 8), M('#6b4a33'), posts.length), pc = new THREE.InstancedMesh(new THREE.SphereBufferGeometry(.13, 10, 6, 0, 6.283, 0, 1.5708), F2S.mat.glowCap, posts.length);
    posts.forEach(([x, z], i) => { o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); o.position.set(x, .28, z); o.updateMatrix(); pm.setMatrixAt(i, o.matrix); o.position.y = .56; o.scale.set(1, .8, 1); o.updateMatrix(); pc.setMatrixAt(i, o.matrix); }); g.add(pm, pc);
    const rm = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(.018, .018, 1, 5), M('#8a6a4a'), ropes.length); ropes.forEach(([x, z, len, h], i) => { o.position.set(x, .42, z); o.scale.set(1, len, 1); o.rotation.set(h ? 0 : Math.PI / 2, 0, h ? Math.PI / 2 : 0); o.updateMatrix(); rm.setMatrixAt(i, o.matrix); }); g.add(rm); }
  // 장애물 소품 · 랜드마크
  for (const [lx, ly, q, kind] of F.obs) { if (kind === 'none') continue; f2Prop(g, kind, F.x + lx + .5, zc(ly) + .5, q, kind === 'land' ? F.x + lx + 1 : undefined); }
  // 밟을 수 있는 꾸밈: 꼬마 버섯 · 풀 · 빛 알갱이
  { const tiny = [], fern = [], dots = []; for (const [x, y] of F.landAll) { const lx = x - F.x, ly = y - F.y, inA = f2InCap(F.ell[F.ell.length - 1], lx, ly); if (!inA && r() < C.deco.tiny) tiny.push([x + r(), zt(y) + r(), .6 + r() * .8, r()]); if (!inA && r() < C.deco.fern) fern.push([x + r(), zt(y) + r(), .7 + r() * .7]); if (r() < C.deco.dots) dots.push([x + r(), zt(y) + r(), r()]); }
    const o = new THREE.Object3D(), col = new THREE.Color(), wm = () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .85 });
    const st = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(.025, .03, .12, 6), M('#efe4cd'), tiny.length), cp = new THREE.InstancedMesh(new THREE.SphereBufferGeometry(.07, 8, 5, 0, 6.283, 0, 1.5708), wm(), tiny.length);
    tiny.forEach(([x, z, s, q], i) => { o.rotation.set(0, 0, 0); o.position.set(x, .02 + .06 * s, z); o.scale.setScalar(s); o.updateMatrix(); st.setMatrixAt(i, o.matrix); o.position.y = .02 + .12 * s; o.updateMatrix(); cp.setMatrixAt(i, o.matrix); cp.setColorAt(i, col.set(['#e2543b', '#e08a3c', '#b98ae0', '#f3e6cf'][Math.floor(q * 4) % 4])); }); g.add(st, cp);
    const fn = new THREE.InstancedMesh(new THREE.ConeBufferGeometry(.07, .26, 5), wm(), fern.length * 3); let k = 0; for (const [x, z, s] of fern) for (let j = 0; j < 3; j++) { o.position.set(x + (j - 1) * .07, .02 + .12 * s, z + (j % 2) * .05); o.scale.setScalar(s * (j === 1 ? 1 : .75)); o.rotation.set((j - 1) * .12, 0, (j - 1) * -.3); o.updateMatrix(); fn.setMatrixAt(k, o.matrix); fn.setColorAt(k++, col.set(mixHex('#4f8f7a', '#6b5fa8', (x * 7 + z * 3) % 1))); } g.add(fn);
    const dm = new THREE.InstancedMesh(new THREE.SphereBufferGeometry(.035, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' }), dots.length); o.rotation.set(0, 0, 0); dots.forEach(([x, z, q], i) => { o.position.set(x, .05, z); o.scale.setScalar(.7 + q); o.updateMatrix(); dm.setMatrixAt(i, o.matrix); dm.setColorAt(i, col.set(['#8ff5dc', '#ffd6f0', '#fff0b0', '#c9b6ff'][i % 4])); }); g.add(dm); }
  // 바깥: 깊은 숲에서 솟은 거대 버섯 (뒤쪽은 높게, 길을 가리는 앞쪽은 발밑 아래)
  { const G = C.giants, list = [], walk = (lx, ly) => { const c = (ground[F.y + ly] || [])[F.x + lx]; return c === G_FL || c === G_FD; };
    for (let i = 0; i < G.n * 6 && list.length < G.n; i++) { const lx = -9 + r() * (FW + 18), ly = -5 + r() * (FH + 10), tx = Math.floor(lx), ty = Math.floor(ly), rad = G.r[0] + r() * (G.r[1] - G.r[0]); let near = false, hide = false;
      for (let dy = -9; dy <= 6 && !near; dy++) for (let dx = -6; dx <= 6; dx++) { if (!walk(tx + dx, ty + dy)) continue; if (Math.hypot(dx, dy) < rad + 1.8) { near = true; break; } if (dy <= 0 && Math.abs(dx) < rad + 1.2) hide = true; }
      if (near || list.some(q => Math.hypot(q[0] - lx, q[1] - ly) < (q[2] + rad) * .8)) continue; const top = hide ? G.low[0] + r() * (G.low[1] - G.low[0]) : G.tall[0] + r() * (G.tall[1] - G.tall[0]); list.push([lx, ly, rad, top, r()]); }
    const o = new THREE.Object3D(), col = new THREE.Color(), n = list.length, stem = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(.8, 1, 1, 10), M('#bfb298', { roughness: 1 }), n), cap = new THREE.InstancedMesh(new THREE.SphereBufferGeometry(1, 18, 9, 0, 6.283, 0, 1.5708), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .8 }), n), und = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(1, .5, .2, 16), M('#d8cab0', { roughness: 1 }), n), spot = new THREE.InstancedMesh(new THREE.SphereBufferGeometry(1, 8, 6), M('#f1e6d2', { roughness: .9 }), n * 4);
    const cs = ['#b5484a', '#7a4fa8', '#35857c', '#c2703a', '#a34f86', '#5a5aa8'];
    list.forEach(([lx, ly, rad, top, q], i) => { const x = F.x + lx, z = zt(F.y + ly), hh = top + 7.4; o.rotation.set(0, 0, 0); o.position.set(x, top - hh / 2, z); o.scale.set(rad * .22, hh, rad * .22); o.updateMatrix(); stem.setMatrixAt(i, o.matrix);
      o.position.set(x, top - .05, z); o.scale.set(rad, rad * .6, rad); o.updateMatrix(); cap.setMatrixAt(i, o.matrix); cap.setColorAt(i, col.set(mixHex(cs[Math.floor(q * cs.length) % cs.length], '#2a2347', top < 0 ? .35 : .08)));
      o.position.set(x, top - .14, z); o.scale.set(rad * .96, 1, rad * .96); o.updateMatrix(); und.setMatrixAt(i, o.matrix);
      for (let j = 0; j < 4; j++) { const a = j * 1.57 + q * 6, d = j ? rad * .55 : 0, s = rad * (j ? .1 : .12); o.position.set(x + Math.cos(a) * d, top - .05 + rad * .6 * Math.sqrt(Math.max(0, 1 - (d / rad) ** 2)), z + Math.sin(a) * d); o.scale.set(s, s * .5, s); o.updateMatrix(); spot.setMatrixAt(i * 4 + j, o.matrix); } });
    stem.castShadow = cap.castShadow = false; g.add(stem, cap, und, spot); }
  // 보스 무대: 둘레 유령 버섯 등불 + 바닥 빛 고리
  { const A = F.ell[F.ell.length - 1], cx = F.x + A.cx, cz = zc(A.cy), list = []; X.lampMat = new THREE.MeshStandardMaterial({ color: '#bfb3e6', emissive: '#a48cff', emissiveIntensity: .1, roughness: .6 });
    const walkA = (lx, ly) => { const c = (ground[F.y + ly] || [])[F.x + lx]; return (c === G_FL || c === G_FD) && !f2InCap(A, lx, ly); };
    for (let i = 0; i < C.lamps; i++) { const a = (i + .5) / C.lamps * 6.283, llx = A.cx + Math.cos(a) * (A.rx + 1.5), lly = A.cy + Math.sin(a) * (A.ry + 1.5); let skip = false, hide = Math.sin(a) > -.15;
      for (let dy = -7; dy <= 2 && !skip; dy++) for (let dx = -2; dx <= 2; dx++) { if (!walkA(Math.floor(llx) + dx, Math.floor(lly) + dy)) continue; if (Math.hypot(dx, dy) < 2.2) { skip = true; break; } if (dy <= 0 && Math.abs(dx) < 2) hide = true; } if (skip) continue;
      list.push([F.x + llx, zc(lly), hide ? -.35 - (i % 2) * .3 : 1.3 + (i % 3) * .5]); }
    const o = new THREE.Object3D(), st = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(.12, .2, 1, 8), M('#d9d0ee', { roughness: 1 }), list.length), cp = new THREE.InstancedMesh(new THREE.SphereBufferGeometry(.55, 14, 8, 0, 6.283, 0, 1.5708), X.lampMat, list.length), un = new THREE.InstancedMesh(new THREE.CylinderBufferGeometry(.5, .5, .05, 12), M('#f3eeff'), list.length);
    list.forEach(([x, z, top], i) => { const hh = top + 7; o.position.set(x, top - hh / 2, z); o.scale.set(1, hh, 1); o.updateMatrix(); st.setMatrixAt(i, o.matrix); o.position.set(x, top, z); o.scale.set(1, .76, 1); o.updateMatrix(); cp.setMatrixAt(i, o.matrix); o.position.set(x, top - .02, z); o.scale.set(1, 1, 1); o.updateMatrix(); un.setMatrixAt(i, o.matrix); }); g.add(st, cp, un);
    X.ring = f2Glow('#b9a8ff', (A.rx + .3) * 2, cx, .05, cz, 0); X.ring.scale.set((A.rx + .3) * 2, (A.ry + .3) * 2, 1); g.add(X.ring); }
  // 공기: 떠다니는 포자 · 반딧불
  { const A = C.air, mk = (n, size, colr, vc) => { const pos = new Float32Array(n * 3), geo = new THREE.BufferGeometry(); for (let i = 0; i < n; i++) { pos[i * 3] = (r() - .5) * A.box[0]; pos[i * 3 + 1] = r() * A.box[1]; pos[i * 3 + 2] = (r() - .5) * A.box[2]; } geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); if (vc) geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
      const p = new THREE.Points(geo, new THREE.PointsMaterial({ size, map: f2GlowTex(), color: colr, transparent: true, opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: !!vc })); p.frustumCulled = false; p.renderOrder = 3; g.add(p); return p; };
    X.spores = mk(A.spores, .1, '#e6d6ff', 0); X.flies = mk(A.flies, .2, '#b8ffd9', 1); X.airInit = 0; } }
buildField3D = (o => F => { if (F.v2) { try { f2Build(F); return; } catch (e) { console.warn('f2build', e); if (F.root && R3) { R3.scene.remove(F.root); } F.root = null; F.f2 = null; F.v2 = 0; } } o(F); })(buildField3D);

// ---------- 3) 분위기 (빛 · 안개색) + 매 프레임 움직임 ----------
if (typeof applyEnv3D === 'function') applyEnv3D = (o => dt => { o(dt); try { const k0 = F2S.mood; if (k0 < .01 || !R3 || !R3.scene.fog) return; const Mo = F2_CFG.mood, sc = R3.scene, k = k0 * (1 - (typeof nightAmt === 'function' ? nightAmt() : 0) * Mo.nightCut);
  sc.fog.color.set(mixHex(sc.fog.color.getHex(), Mo.fog, k0)); if (sc.background && sc.background.isColor) sc.background.set(mixHex(sc.background.getHex(), Mo.sky, k0)); R3.hemi.intensity *= 1 - (1 - Mo.hemi) * k; R3.sun.intensity *= 1 - (1 - Mo.sun) * k; R3.hemi.color.set(mixHex(R3.hemi.color.getHex(), Mo.tint, k * .6)); } catch (e) { } })(applyEnv3D);
if (typeof __SYNC3D !== 'undefined') __SYNC3D.push(() => { const F = typeof curField === 'function' && curField(), on = F && F.v2 && state === 'play' ? 1 : 0, dt = Math.min(.05, lastDt || 0); F2S.mood += (on - F2S.mood) * Math.min(1, dt * F2_CFG.mood.spd);
  const cu = R3 && R3.postMat && R3.postMat.uniforms.cool; if (cu && F2S.mood > .01) cu.value = Math.max(cu.value, F2S.mood * F2_CFG.mood.cool); if (!on || !F.f2) return; const X = F.f2, A = F2_CFG.air, px = U(P.x), pz = ZU(P.y);
  for (const [tex, spd] of X.mist) { tex.offset.x += spd * dt; tex.offset.y += spd * .4 * dt; }
  X.pulse.forEach((m, i) => { m.opacity = (m._o || (m._o = m.opacity)) * (.8 + .2 * Math.sin(time * 1.7 + i * 1.3)); }); X.orbs.forEach((o, i) => { o.position.y += Math.sin(time * 1.4 + i * 2) * dt * .05; });
  const fight = F2S.fight > 0 ? 1 : 0; X.lampK = (X.lampK || 0) + (fight - (X.lampK || 0)) * Math.min(1, dt * 2); X.lampMat.emissiveIntensity = .1 + X.lampK * (.9 + Math.sin(time * 5) * .12); X.ring.material.opacity = X.lampK * (.3 + Math.sin(time * 2.4) * .08);
  const wrap = (p, n, up, fly) => { const a = p.geometry.attributes.position, b = a.array, hx = A.box[0] / 2, hz = A.box[2] / 2; if (!p._i) { p._i = 1; for (let i = 0; i < n; i++) { b[i * 3] += px; b[i * 3 + 2] += pz; } }
    for (let i = 0; i < n; i++) { const j = i * 3; b[j] += Math.sin(time * .7 + i * 1.9) * dt * .22; b[j + 1] += up(i) * dt; b[j + 2] += Math.cos(time * .5 + i * 2.3) * dt * .16; if (fly) b[j + 1] = Math.max(.25, Math.min(A.box[1] * .6, b[j + 1])); else if (b[j + 1] > A.box[1]) b[j + 1] = .05; if (b[j] < px - hx) b[j] += A.box[0]; else if (b[j] > px + hx) b[j] -= A.box[0]; if (b[j + 2] < pz - hz) b[j + 2] += A.box[2]; else if (b[j + 2] > pz + hz) b[j + 2] -= A.box[2]; } a.needsUpdate = true; };
  wrap(X.spores, A.spores, i => .1 + (i % 5) * .035); wrap(X.flies, A.flies, i => Math.sin(time * .9 + i * 3.1) * .25, 1);
  { const c = X.flies.geometry.attributes.color, b = c.array; for (let i = 0; i < A.flies; i++) { const v = .25 + .75 * Math.max(0, Math.sin(time * 2.2 + i * 1.7)); b[i * 3] = b[i * 3 + 1] = b[i * 3 + 2] = v; } c.needsUpdate = true; } });
