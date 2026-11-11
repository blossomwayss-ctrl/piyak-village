// ===== propuse.js : 꾸민 소품에 쓰임새 — 풍차 방앗간 · 우물 물 주기 · 허수아비(밭 현황 · 모자 씌우기) · 소풍 탁자 쉬기 · 오리 헤엄 =====
const PU_CFG = {
  mill: { rec: [['wheat', 'flour'], ['barley', 'misu']], max: 12, days: 1 },   // 방앗간: [넣는 것, 나오는 것] · 한 번에 최대 12개 · 게임 하루 뒤 완성
  well: { perDay: 1 },                                                        // 우물: 하루 1번, 큰 밭 전체에 물 주기
  picnic: { perDay: 1 },                                                      // 소풍 탁자: 하루 1번, 용기 가득 회복
  duck: { p: .05, dur: [7, 14], spd: 16, swimSpd: 8 },                        // 오리: 초당 5% 확률로 연못에 들어가 7~14초 헤엄 (선물이 준비되면 바로 나와요)
  r: { mill: 20, well: 18, picnic: 20, scare: 15 },                           // 말 걸 수 있는 거리(px)
};
const PU = { mill: null, well: 0, pic: 0, shat: '' };   // 방앗간 상태 · 우물/소풍을 쓴 날 · 허수아비 모자
const PU_SPOTS = [];
for (const d of SDECO) { if (d.k === 'windmill') PU_SPOTS.push({ k: 'mill', x: (d.x + d.w / 2) * T, y: (d.y + d.h + .45) * T, name: '풍차 방앗간' }); if (d.k === 'well') PU_SPOTS.push({ k: 'well', x: (d.x + .5) * T, y: (d.y + 1.5) * T, name: '우물' });
  if (d.k === 'picnic') PU_SPOTS.push({ k: 'picnic', x: (d.x + d.w / 2) * T, y: (d.y + 1.5) * T, name: '소풍 탁자' }); if (d.k === 'scare') PU_SPOTS.push({ k: 'scare', x: (d.x + .5) * T, y: (d.y + .6) * T, name: '허수아비' }); }
function puNear() { if (!curRoom || curRoom.id !== 'v1' || dlg || menu) return null; for (const s of PU_SPOTS) { if (Math.hypot(P.x - s.x, P.y - s.y) >= PU_CFG.r[s.k]) continue; if (s.k === 'scare' && plotAt(Math.floor(P.x / T), Math.floor(P.y / T))) continue; return s; } return null; }
function millReady() { return !!PU.mill && dayKey() - PU.mill.day >= PU_CFG.mill.days; }
function millBusy() { return !!PU.mill && !millReady(); }
function millEntries() { const E = [], C = PU_CFG.mill;
  if (PU.mill) { const s = PU.mill, ok = millReady(); E.push({ img: itemImg(s.out), name: `${ITEMS[s.out].name} ×${s.n} ${ok ? '완성!' : '빻는 중'}`, desc: ok ? '눌러서 꺼내요' : '풍차가 열심히 돌고 있어요 · 게임 하루 뒤 완성', tag: ok ? '꺼내기' : '진행 중', col: ok ? '#9be37a' : '#d9cbb5',
      act: () => { if (!millReady()) return pmsg('아직이에요 · 내일 다시 와요'); addItem(s.out, s.n); PU.mill = null; sfx('tada'); stat('craft'); menu = null; toast(`${ITEMS[s.out].name} ×${s.n} 완성!`); save(); } }); return E; }
  E.push({ name: '🌾 풍차 방앗간', desc: `곡식을 넣으면 하루 뒤 가루가 돼요 · 한 번에 ${C.max}개까지`, tag: '', col: '#ffe9a8', act: () => { } });
  for (const [inp, out] of C.rec) { if (!ITEMS[inp] || !ITEMS[out]) continue; const have = inv[inp] || 0, n = Math.min(C.max, have);
    E.push({ img: itemImg(inp), name: `${ITEMS[inp].name} → ${ITEMS[out].name}`, desc: `보유 ${have} · 판매가 ✦${ITEMS[inp].sell || 0} → ✦${ITEMS[out].sell || 0}`, tag: n ? `${n}개 넣기` : '없음', col: n ? '#ffd23f' : '#c8c0b4',
      act: () => { if (!n) return pmsg(`${ITEMS[inp].name}${josa(ITEMS[inp].name, '이', '가').slice(-1)} 없어요`, 1); inv[inp] -= n; if (!inv[inp]) delete inv[inp]; PU.mill = { out, n, day: dayKey() }; sfx('pick'); menu = null; toast(`${ITEMS[inp].name} ${n}개를 넣었어요 · 내일 ${ITEMS[out].name} 완성!`); save(); } }); }
  return E; }
function fieldStat() { let ripe = 0, grow = 0, dry = 0, empty = 0; for (const p of plots) { if (!p.south) continue; if (!p.seed) empty++; else if (p.stage >= SEEDS[p.seed].days) ripe++; else { grow++; if (!p.wet) dry++; } } return { ripe, grow, dry, empty }; }
function scareEntries() { const s = fieldStat(), E = [{ name: `🌾 큰 밭: 다 익음 ${s.ripe}칸 · 자라는 중 ${s.grow}칸 · 빈 밭 ${s.empty}칸`, desc: s.dry ? `목마른 밭 ${s.dry}칸 · 우물에서 한 번에 물을 줄 수 있어요` : s.grow ? '자라는 밭은 모두 촉촉해요' : '씨앗을 심어 보세요', tag: s.ripe ? '수확!' : '', col: s.ripe ? '#9be37a' : '#ffe9a8', act: () => { } }];
  E.push({ name: `허수아비 모자: ${PU.shat ? HATS[PU.shat].name : '밀짚모자 (기본)'}`, desc: '가진 모자를 골라 씌워 줄 수 있어요', tag: '', col: '#efe2c8', act: () => { } });
  E.push({ name: '밀짚모자 (기본)', desc: '원래 쓰고 있던 모자', tag: PU.shat ? '씌우기' : '착용 중', col: PU.shat ? '#ffd23f' : '#d9cbb5', act: () => { PU.shat = ''; sfx('pick'); pmsg('밀짚모자로 돌려놨어요'); save(); } });
  for (const k of hatOwned) if (HATS[k]) E.push({ img: hatImg(k), name: HATS[k].name, desc: k === 'egg' ? '노랑이랑 똑같은 모자! 가짜 노랑이 완성' : '허수아비에게 씌워요', tag: PU.shat === k ? '착용 중' : '씌우기', col: PU.shat === k ? '#d9cbb5' : '#ffd23f', act: () => { PU.shat = k; sfx('pick'); pmsg(`허수아비가 ${josa(HATS[k].name, '을', '를')} 썼어요!`); save(); } });
  return E; }
function puUse(s) { const k = dayKey();
  if (s.k === 'mill') { menu = { kind: 'pumill', title: '🌾 풍차 방앗간', tabs: ['빻기'], tab: 0, sel: 0, page: 0 }; sfx('blip'); }
  else if (s.k === 'scare') { menu = { kind: 'puscare', title: '허수아비', tabs: ['큰 밭 · 모자'], tab: 0, sel: 0, page: 0 }; sfx('blip'); }
  else if (s.k === 'well') { if (PU.well === k) return toast('두레박이 아직 젖어 있어요 · 우물은 하루에 한 번!'); const L0 = plots.filter(p => p.south && p.seed && !p.wet && p.stage < SEEDS[p.seed].days); if (!L0.length) return toast('큰 밭에 물 줄 곳이 없어요');
    PU.well = k; for (const p of L0) p.wet = true; for (let i = 0; i < Math.min(18, L0.length); i++) { const p = L0[Math.floor(i * L0.length / Math.min(18, L0.length))]; burst(p.x * T + 8, p.y * T + 8, '#7fcaf2', 5); } burst(s.x, s.y - 22, '#7fcaf2', 22); sfx('water'); shake(1, .1); emote(null, 'note', 1.2);
    floaters.push({ x: P.x, y: P.y - 30, t: 1.6, text: `두레박 물을 쫙! 큰 밭 ${L0.length}칸 촉촉`, col: '#bfe0ff' }); stat('water', L0.length); save(); }
  else if (s.k === 'picnic') { if (PU.pic === k) return toast('오늘 소풍은 끝! 내일 또 쉬어 가요'); PU.pic = k; hp = maxHp(); emote(null, 'heart', 1.6); sfx('gulp'); burst(P.x, P.y - 20, '#ffb3c6', 16); floaters.push({ x: P.x, y: P.y - 30, t: 1.6, text: '소풍 도시락 냠냠! 용기 가득', col: '#9be37a' }); save(); } }
townInteract = (o => () => { const s = puNear(); if (s) { puUse(s); return true; } return o(); })(townInteract);
townHint = (o => () => { const s = puNear(); if (s) return { x: s.x, y: s.y - (s.k === 'scare' ? 34 : 30), t: `${KA()} ${s.name}${s.k === 'mill' && millReady() ? ' (완성!)' : s.k === 'well' && PU.well !== dayKey() ? ' · 큰 밭 물 주기' : s.k === 'picnic' && PU.pic !== dayKey() ? ' · 쉬어 가기' : ''}` }; return o(); })(townHint);
panelEntries = (o => () => menu && menu.kind === 'pumill' ? millEntries() : menu && menu.kind === 'puscare' ? scareEntries() : o())(panelEntries);
if (typeof townEntries === 'function') townEntries = (o => m => m.kind === 'pumill' ? millEntries() : m.kind === 'puscare' ? scareEntries() : o(m))(townEntries);
// ---- 오리 헤엄 ----
function duckTick(dt) { if (!curRoom || curRoom.id !== 'v1') return; const P0 = SDECO_CFG.pond, C = PU_CFG.duck, inP = (x, y, k) => ((x / T - P0.cx) / (P0.rx * k)) ** 2 + ((y / T - P0.cy) / (P0.ry * k)) ** 2 < 1;
  for (const a of LIVE) { if (a.sp !== 'duck') continue; let S = a._sw;
    if (!S) { if (Math.random() < dt * C.p && !prodReady(a) && Math.hypot(a.x - P.x, a.y - P.y) > 30) a._sw = { st: 'in', t: C.dur[0] + Math.random() * (C.dur[1] - C.dur[0]), tx: P0.cx * T, ty: P0.cy * T }; continue; }
    if (S.st !== 'out') { S.t -= dt * (S.st === 'swim' ? 1 : 0); if (S.st === 'in' && inP(a.x, a.y, .75)) S.st = 'swim'; if (S.st === 'swim' && Math.hypot(S.tx - a.x, S.ty - a.y) < 3) { const an = Math.random() * 6.28, rr = Math.random() * .55; S.tx = (P0.cx + Math.cos(an) * P0.rx * rr) * T; S.ty = (P0.cy + Math.sin(an) * P0.ry * rr) * T; }
      if (S.t <= 0 || prodReady(a)) { S.st = 'out'; S.tx = Math.max((P0.cx - P0.rx) * T, Math.min((P0.cx + P0.rx) * T, a.x)); S.ty = (P0.cy - P0.ry - 1.1) * T; } }
    const dx = S.tx - a.x, dy = S.ty - a.y, d = Math.hypot(dx, dy), sp = (S.st === 'swim' ? C.swimSpd : C.spd) * dt;
    if (d > 1) { a.x += dx / d * Math.min(d, sp); a.y += dy / d * Math.min(d, sp); if (Math.abs(dx) > .5) a.face = dx > 0 ? 1 : -1; a.walking = S.st !== 'swim'; } else if (S.st === 'out') { if (boxFree(a.x, a.y, 4, 2)) { a._sw = null; a.walking = false; } else S.ty -= 6; }
    a.tx = a.hx = a.x; a.ty = a.hy = a.y; a.t = 0; } }
updateLive = (o => dt => { const sw = LIVE.filter(a => a._sw); if (!sw.length) return o(dt); const all = LIVE.slice(); LIVE.length = 0; for (const a of all) if (!a._sw) LIVE.push(a); try { o(dt); } finally { const born = LIVE.filter(a => !all.includes(a)); LIVE.length = 0; LIVE.push(...all, ...born); } })(updateLive);
update = (o => dt => { o(dt); if (state === 'play' && !dlg && !menu) try { duckTick(dt); } catch (e) { console.warn('duck', e); } })(update);
// ---- 3D: 헤엄치는 오리 높이 · 허수아비 모자 · 방앗간 완성 표시 ----
if (typeof __SYNC3D !== 'undefined') __SYNC3D.push(() => { if (!R3 || !R3.sdecoG || !R3.ents) return; for (const a of LIVE) if (a._sw && a._sw.st === 'swim') { const m = R3.ents.get(a); if (m) m.position.y = -.12 + Math.sin(time * 2.4 + a.x) * .012; }
  const A = R3.sdecoG.userData.anim; for (const m of A.sway) { if (m.userData.hatK === PU.shat) continue; m.userData.hatK = PU.shat; if (m.userData.hatG) { m.remove(m.userData.hatG); m.userData.hatG = null; } for (const i of [7, 8, 9]) if (m.children[i]) m.children[i].visible = !PU.shat;
    if (PU.shat) { try { const h = buildHat(PU.shat); h.scale.setScalar(.8); h.position.set(0, 1.56, 0); m.add(h); m.userData.hatG = h; } catch (e) { for (const i of [7, 8, 9]) if (m.children[i]) m.children[i].visible = true; } } }
  if (!R3.puDone) { const s = PU_SPOTS.find(q => q.k === 'mill'); if (s) { R3.puDone = mesh('s', '#9be37a', .12, .12, .12, s.x / T, 1.3, ZU(s.y) - .5, { emissive: '#9be37a', emissiveIntensity: .7 }); R3.scene.add(R3.puDone); } }
  if (R3.puDone) { R3.puDone.visible = curRoom.id === 'v1' && millReady(); R3.puDone.position.y = 1.3 + Math.sin(time * 4) * .06; } });
townSave = (o => () => Object.assign(o(), { pu: PU }))(townSave);
townLoad = (o => d => { o(d); if (d && d.pu) Object.assign(PU, d.pu); if (PU.shat && !HATS[PU.shat]) PU.shat = ''; for (const a of LIVE) delete a._sw; })(townLoad);
