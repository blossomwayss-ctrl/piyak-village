// ===== hunt3.js : 사냥터 6단계 개성 — 단계별 지형 기믹 · 보스 3마리 고유 패턴 · 세트 꼬리 무기 드롭 =====
const H3_CFG = {
  haz: {   // 단계별 지형 기믹 (1단계는 연습용이라 없어요). r = 범위(px, 16px = 1칸)
    fa2: { k: 'spore', n: 7, r: 22, slow: .6, dur: 2.4, cd: 7 },                  // 포자 버섯: 다가가면 퐁! → 2.4초 느려짐(속도 ×0.6) · 주변 몬스터도 느려져요 · 7초 뒤 다시
    fa3: { k: 'acorn', every: 3.4, r: 15, warn: 1.1, loot: 'acorn', lootP: .5 },   // 도토리 낙하: 그림자가 생기고 1.1초 뒤 쿵 · 절반 확률로 도토리가 남아요
    fa4: { k: 'mud', n: 10, r: 24, slow: .55 },                                    // 늪 웅덩이: 밟는 동안 속도 ×0.55 · 구르면 그대로 통과
    fa5: { k: 'bolt', every: 3.8, r: 20, warn: 1.2, mobDmg: 5, extra: 1 },         // 번개: 노란 원이 생기고 1.2초 뒤 낙뢰 · 몬스터도 맞아요(피해 5 + 단계)
    fa6: { k: 'gust', every: 9, warn: .9, dur: 2.2, push: 38 },                    // 눈보라 돌풍: 9초마다 2.2초 동안 한쪽으로 밀려요(초당 38px)
  },
  boss: {  // 보스 고유 패턴 (기존 내려찍기·돌진·부하 소환에 더해져요)
    fa2: { kind: 'v_ghost', k: 'blink', every: 7, fade: .7, hint: '스르륵 사라졌다가 등 뒤에서 쿵! · 사라지면 바로 굴러요' },
    fa4: { kind: 'v_mud', k: 'mud', every: 6, n: 3, r: 22, warn: 1.0, stay: 6, slow: .55, hint: '진흙 덩이를 던져요 · 갈색 원에서 벗어나요' },
    fa6: { kind: 'v_aurora', k: 'snow', every: 5, n: 3, n2: 5, spd: 120, hint: '눈덩이 세 방향! · 꼬리로 튕겨낼 수 있어요' },
  },
  drops: { fa2: ['starring', .35], fa4: ['pearl', .35], fa6: ['flakebell', .35] },   // 보스 처치: 세트 꼬리 무기 [아이템, 확률] (없을 때만 나와요)
  rare: { v_storm: ['thunder', .06] },                                                  // 전용 몬스터 희귀 드롭
  easy: 1.5,   // 느긋 모드일 때 예고 시간 · 기믹 간격 배수
  name: { spore: '포자 버섯', acorn: '도토리 낙하', mud: '늪 웅덩이', bolt: '번개', gust: '눈보라 돌풍' },
  tips: { spore: '보라 버섯에 다가가면 포자가 퐁! 몬스터를 끌고 가면 같이 느려져요', acorn: '머리 위 그림자를 조심! 도토리가 떨어져요', mud: '늪 웅덩이는 발이 푹푹 빠져요 · 구르면 휙 지나가요', bolt: '노란 원 밖으로! 번개는 몬스터도 맞아요', gust: '돌풍이 불면 한쪽으로 밀려요 · 벼랑 쪽은 막혀 있어 안전해요' },
};
const H3 = { z: {}, falls: [], pud: [], hits: [], gust: null, fT: 0, slowT: 0, slowK: 1, seen: {}, pid: 0, flash: 0, fid: '', hintT: 0, hint: '' };
function h3Scr(x, y) { return typeof USE3D !== 'undefined' && USE3D && R3 ? project3D(x, y + 1.6, .03) : [(x - cam.x) * SC, (y - cam.y) * SC]; }
function h3In(z, r) { return Math.hypot(P.x - z.x, (P.y - z.y) * 1.3) < r; }
function h3Zones(F, C) { if (H3.z[F.id]) return H3.z[F.id]; fgInit(); let s0 = 4099 * (F.tier + 5); const r = () => (s0 = (s0 * 16807) % 2147483647) / 2147483647, g = FGATE[F.id], out = [], [ex, ey] = fPx(F, F.ent[0], F.ent[1]);
  for (let i = 0; i < 400 && out.length < C.n; i++) { const [tx, ty] = F.land[Math.floor(r() * F.land.length)], x = (tx + .5) * T, y = (ty + .6) * T;
    if (Math.hypot(x - ex, y - ey) < 80 || Math.hypot(x - g.bx, y - g.by) < 64 || Math.hypot(x - g.ex, y - g.ey) < 64 || out.some(q => Math.hypot(q.x - x, q.y - y) < 60)) continue; out.push({ x, y, cd: 0, id: out.length }); }
  return H3.z[F.id] = out; }
function h3Tip(k) { if (H3.seen[k]) return; H3.seen[k] = 1; toast(H3_CFG.tips[k]); }
function h3Easy() { return typeof CFG !== 'undefined' && CFG.easy ? H3_CFG.easy : 1; }   /* 느긋 모드: 예고 시간 · 간격이 길어져요 */
function h3Fall(k, x, y, C, extra) { const f = Object.assign({ k, x, y, t: C.warn, t0: C.warn, r: C.r }, extra || {}); f.t *= h3Easy(); f.t0 = f.t; H3.falls.push(f); }
function h3Tick(dt) { H3.slowK = 1; if (H3.flash > 0) H3.flash -= dt; for (let i = H3.hits.length - 1; i >= 0; i--) if ((H3.hits[i].t -= dt) <= 0) H3.hits.splice(i, 1);
  const F = curField(); if (!F || F.id !== H3.fid) { H3.fid = F ? F.id : ''; H3.falls.length = 0; H3.pud.length = 0; H3.gust = null; H3.slowT = 0; H3.fT = 2.5; H3.hintT = 0; if (!F) return; } if (dlg || menu || state !== 'play') return; if (H3.hintT > 0) H3.hintT -= dt; const C = H3_CFG.haz[F.id], roll = P.roll > 0;
  if (C && (C.k === 'mud' || C.k === 'spore')) for (const z of h3Zones(F, C)) { if (z.cd > 0) z.cd -= dt;
    if (C.k === 'mud' && !roll && h3In(z, C.r)) { H3.slowK = Math.min(H3.slowK, C.slow); h3Tip('mud'); if (Math.random() < dt * 9) parts.push({ x: P.x + (Math.random() - .5) * 10, y: P.y, vx: (Math.random() - .5) * 30, vy: -40, t: .35, c: '#6b4a2e', g: 160 }); }
    if (C.k === 'spore' && z.cd <= 0 && h3In(z, C.r)) { z.cd = C.cd; H3.slowT = C.dur; h3Tip('spore'); sfx('poof'); burst(z.x, z.y - 8, '#c9b6ff', 22); burst(z.x, z.y - 8, '#ffffff', 8); fx({ k: 'boom', x: z.x, y: z.y - 4, r: 30, col: '#c9b6ff', d: .45 }); floaters.push({ x: P.x, y: P.y - 30, t: 1, text: '에취!', col: '#c9b6ff' });
      for (const e of enemies) if (e.fd === F.id && Math.hypot(e.x - z.x, e.y - z.y) < C.r * 1.8) e.slow = Math.max(e.slow || 0, C.dur + 1.5); } }
  if (H3.slowT > 0) { H3.slowT -= dt; H3.slowK = Math.min(H3.slowK, (C && C.slow) || .6); if (Math.random() < dt * 6) parts.push({ x: P.x + (Math.random() - .5) * 12, y: P.y - 14, vx: 0, vy: -18, t: .5, c: '#c9b6ff', g: 0 }); }
  for (let i = H3.pud.length - 1; i >= 0; i--) { const p = H3.pud[i]; p.t -= dt; if (p.t <= 0) { H3.pud.splice(i, 1); continue; } if (!roll && h3In(p, p.r)) H3.slowK = Math.min(H3.slowK, p.slow); }
  if (C && (C.k === 'acorn' || C.k === 'bolt')) { H3.fT -= dt; if (H3.fT <= 0) { H3.fT = C.every * (.75 + Math.random() * .5) * h3Easy(); h3Tip(C.k); h3Fall(C.k, P.x + (Math.random() - .5) * 20, P.y + (Math.random() - .5) * 12, C);
      for (let i = 0; i < (C.extra || 0); i++) { const a = Math.random() * 6.28, d = 34 + Math.random() * 40; h3Fall(C.k, P.x + Math.cos(a) * d, P.y + Math.sin(a) * d * .7, C, { t: C.warn + .25, t0: C.warn + .25 }); } } }
  for (let i = H3.falls.length - 1; i >= 0; i--) { const f = H3.falls[i]; f.t -= dt; if (f.t > 0) continue; H3.falls.splice(i, 1); const hitP = !roll && h3In(f, f.r);
    if (f.k === 'acorn') { sfx('bonk'); shake(1.4, .12); burst(f.x, f.y - 4, '#c98a5a', 12); fx({ k: 'boom', x: f.x, y: f.y - 2, r: 20, col: '#e6c9a0', d: .3 }); if (hitP) hurtPlayer(1, { x: f.x, y: f.y + 1 }); else if (C && Math.random() < C.lootP && ITEMS[C.loot]) pickups.push({ kind: 'item', id: C.loot, x: f.x, y: f.y - 6, vx: (Math.random() - .5) * 30, vy: -60, t: 0 }); }
    else if (f.k === 'bolt') { sfx('bonk'); sfx('pop'); shake(2.6, .2); H3.flash = .09; H3.hits.push({ x: f.x, y: f.y, t: .2 }); burst(f.x, f.y - 6, '#ffe066', 18); fx({ k: 'boom', x: f.x, y: f.y - 2, r: 30, col: '#ffe680', d: .35 }); if (hitP) hurtPlayer(1, { x: f.x, y: f.y + 1 });
      for (const e of enemies.slice()) if (e.fd === F.id && Math.hypot(e.x - f.x, (e.y - f.y) * 1.3) < f.r * 1.15 && !(e.inv > 0)) { hitEnemy(e, (C ? C.mobDmg : 5) + F.tier); e.stun = .6; } }
    else if (f.k === 'mudb') { sfx('water'); shake(1.2, .1); burst(f.x, f.y - 4, '#6b4a2e', 16); if (hitP) hurtPlayer(1, { x: f.x, y: f.y + 1 }); H3.pud.push({ x: f.x, y: f.y, r: f.r, t: f.stay, t0: f.stay, slow: f.slow, id: ++H3.pid }); } }
  if (C && C.k === 'gust') { const G = H3.gust || (H3.gust = { t: C.every * .6, warn: 0, dur: 0, a: 0 });
    if (G.dur > 0) { G.dur -= dt; const vx = Math.cos(G.a) * C.push, vy = Math.sin(G.a) * C.push * .8, nx = P.x + vx * dt, ny = P.y + vy * dt; if (boxFree(nx, P.y)) P.x = nx; if (boxFree(P.x, ny)) P.y = ny;
      for (let i = 0; i < 3; i++) if (Math.random() < dt * 40) parts.push({ x: P.x - Math.cos(G.a) * 150 + (Math.random() - .5) * 220, y: P.y - Math.sin(G.a) * 110 + (Math.random() - .5) * 160, vx: Math.cos(G.a) * 260, vy: Math.sin(G.a) * 200, t: .55, c: '#ffffff', g: 0, sz: 2 }); if (G.dur <= 0) G.t = C.every * (.8 + Math.random() * .4) * h3Easy(); }
    else if (G.warn > 0) { G.warn -= dt; if (G.warn <= 0) { G.dur = C.dur; sfx('swipe'); } }
    else if ((G.t -= dt) <= 0) { G.warn = C.warn; G.a = Math.floor(Math.random() * 8) * Math.PI / 4; h3Tip('gust'); floaters.push({ x: P.x, y: P.y - 34, t: 1, text: `휘이잉~ ${['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'][Math.round(G.a / (Math.PI / 4)) % 8]}`, col: '#dff4ff' }); } }
  h3Boss(dt, F); }
enterRoom = (o => r => { o(r); try { const F = fById(r.id), C = F && H3_CFG.haz[F.id]; if (C && bannerQ && bannerQ.title.indexOf(F.name) >= 0 && bannerQ.sub.indexOf('⚠') < 0) bannerQ.sub = `권장 Lv.${F.lv} · ⚠ ${H3_CFG.name[C.k]} · 다 잡으면 토벌 보상`; } catch (e) { } })(enterRoom);
// ---- 보스 고유 패턴 ----
fbSpawn = (o => F => { o(F); const B = H3_CFG.boss[F.id], e = enemies.find(q => q.fboss && q.fd === F.id); if (!B || !e || !ENEMY[B.kind] || e.kind === B.kind) return; e.kind = B.kind; e.max = e.hp = Math.ceil(ENEMY[B.kind].hp * F.hpK * 4 * G2CFG.boss.hpMul); if (typeof R3 !== 'undefined' && R3 && R3.ents && R3.ents.has(e)) { R3.scene.remove(R3.ents.get(e)); R3.ents.delete(e); } })(fbSpawn);
function h3Boss(dt, F) { const B = H3_CFG.boss[F.id]; if (!B) return; const e = enemies.find(q => q.fboss && q.fd === F.id); if (!e) return; const near = Math.hypot(P.x - e.x, P.y - e.y);
  if (near < 150 && !e.h3Hint) { e.h3Hint = 1; H3.hint = B.hint; H3.hintT = 7; }
  if (e.blink > 0) { e.blink -= dt; e.inv = Math.max(e.inv || 0, .2); e.kb = .1; e.vx = e.vy = 0; e.cgT = Math.max(e.cgT || 0, 1.6); e.stT = Math.max(e.stT || 0, 1.2); e.hopT = Math.max(e.hopT || 0, .3);
    if (e.blink <= 0) { const d = dirVec(); let done = false; for (const k of [26, 34, 18, -26]) { const x = P.x - d.x * k, y = P.y - d.y * k * .8; if (boxFree(x, y, 5, 3)) { e.x = x; e.y = y; done = true; break; } } burst(e.x, e.y - 8, '#c9b6ff', 22); sfx('poof'); e.warn = G2CFG.boss.warn; e.stT = G2CFG.boss.stompEvery; floaters.push({ x: e.x, y: e.y - 40, t: .8, text: done ? '뒤다!' : '쿵!?', col: '#ff6b8a' }); } return; }
  if (near > 150 || e.chg > 0 || e.wind > 0 || e.warn > 0) return; e.h3T = (e.h3T === undefined ? B.every * .6 : e.h3T) - dt; if (e.h3T > 0) return; e.h3T = B.every * h3Easy();
  if (B.k === 'blink') { e.blink = B.fade; burst(e.x, e.y - 8, '#c9b6ff', 18); sfx('poof'); floaters.push({ x: e.x, y: e.y - 40, t: .8, text: '스르륵…', col: '#c9b6ff' }); }
  else if (B.k === 'mud') { floaters.push({ x: e.x, y: e.y - 40, t: .8, text: '철퍽!', col: '#c9a06a' }); sfx('swipe'); for (let i = 0; i < B.n; i++) { const a = i * 2.1 + Math.random(), d = i ? 30 + Math.random() * 22 : 0; h3Fall('mudb', P.x + Math.cos(a) * d, P.y + Math.sin(a) * d * .7, B, { t: B.warn + i * .18, t0: B.warn + i * .18, stay: B.stay, slow: B.slow, fx0: e.x, fy0: e.y }); } }
  else if (B.k === 'snow') { floaters.push({ x: e.x, y: e.y - 40, t: .8, text: '눈덩이 받아라!', col: '#dff4ff' }); ebFire(e, { n: e.hp / e.max < .5 ? B.n2 : B.n, spd: B.spd, col: '#dff4ff' }); } }
// 사라지는 동안은 3D 모형을 숨겨요
if (typeof __SYNC3D !== 'undefined') __SYNC3D.push(() => { if (!R3 || !R3.ents) return; for (const e of enemies) if (e.fboss && e.blink !== undefined) { const m = R3.ents.get(e); if (m) m.visible = !(e.blink > 0); } });
drawEnemy = (o => e => { if (e.fboss && e.blink > 0) return; return o(e); })(drawEnemy);
// ---- 드롭: 보스 → 세트 꼬리 무기 · 전용 몬스터 희귀 드롭 ----
for (const F of FIELDS) { const u = F.mobs.map(q => typeof VARIANTS !== 'undefined' && VARIANTS[q[0]] && VARIANTS[q[0]].drop).filter(Boolean)[0]; if (u && ITEMS[u] && F.drop && !F.drop.includes(u)) F.drop.push(u); }   /* 매일 보물 상자에서도 전용 재료가 나와요 */
for (const k in H3_CFG.rare) { const [id, p] = H3_CFG.rare[k]; if (ENEMY[k] && ITEMS[id]) ENEMY[k].rare = (ENEMY[k].rare || []).concat([[id, p]]); }
killEnemy = (o => e => { const fb = e.fboss && !e.mboss && e.fd, x = e.x, y = e.y; o(e); const D = fb && H3_CFG.drops[fb]; if (!D || !ITEMS[D[0]]) return; const [id, p] = D; if (inv[id] > 0 || eqOn(ITEMS[id].slot) === id || Math.random() >= p) return;
  pickups.push({ kind: 'item', id, x, y: y - 6, vx: 0, vy: -100, t: 0 }); toast(`✨ 희귀 장비! ${ITEMS[id].name}`); sfx('star'); })(killEnemy);
// ---- 속도: 늪 · 포자 · 진흙에서 느려져요 ----
updateTown = (o => dt => { o(dt); if (state === 'play' && H3.slowK < 1) window.__spdMul = (window.__spdMul === undefined ? 1 : window.__spdMul) * H3.slowK; })(updateTown);
update = (o => dt => { o(dt); try { h3Tick(dt); } catch (e) { console.warn('hunt3', e); } })(update);
faint = (o => () => { H3.falls.length = 0; H3.pud.length = 0; H3.gust = null; H3.slowT = 0; return o(); })(faint);
// ---- 그리기: 예고 원(2D·3D 공통) · 2D 화면의 웅덩이/버섯 ----
function h3Ell(x, y, r) { const [sx, sy] = h3Scr(x, y), [sx2] = h3Scr(x + r, y), [, sy2] = h3Scr(x, y + r / 1.3); return [sx, sy, Math.abs(sx2 - sx), Math.abs(sy2 - sy)]; }
function h3Draw() { const F = curField(); if (!F || state !== 'play') return; const C = H3_CFG.haz[F.id], is3 = typeof USE3D !== 'undefined' && USE3D && R3; ctx.save();
  if (!is3) { if (C && C.k === 'mud') for (const z of h3Zones(F, C)) { const [x, y, rx, ry] = h3Ell(z.x, z.y, C.r); ctx.fillStyle = 'rgba(94,70,48,.75)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.29); ctx.fill(); ctx.fillStyle = 'rgba(70,50,34,.8)'; ctx.beginPath(); ctx.ellipse(x, y, rx * .6, ry * .6, 0, 0, 6.29); ctx.fill(); }
    if (C && C.k === 'spore') for (const z of h3Zones(F, C)) { const [x, y, rx] = h3Ell(z.x, z.y, 7); ctx.fillStyle = '#e8dcc0'; ctx.fillRect(x - rx * .3, y - rx, rx * .6, rx); ctx.fillStyle = z.cd > 0 ? '#8a7aa8' : '#a06ad9'; ctx.beginPath(); ctx.ellipse(x, y - rx, rx, rx * .7, 0, Math.PI, 0); ctx.fill(); }
    for (const p of H3.pud) { const [x, y, rx, ry] = h3Ell(p.x, p.y, p.r); ctx.globalAlpha = Math.min(1, p.t / 1.2) * .75; ctx.fillStyle = '#6b4a2e'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1; } }
  for (const f of H3.falls) { const [x, y, rx, ry] = h3Ell(f.x, f.y, f.r), k = 1 - Math.max(0, f.t) / f.t0, col = f.k === 'bolt' ? '255,214,64' : f.k === 'mudb' ? '120,84,48' : '90,60,40';
    ctx.fillStyle = `rgba(${col},${.16 + k * .3})`; ctx.beginPath(); ctx.ellipse(x, y, rx * (f.k === 'acorn' ? .35 + k * .65 : 1), ry * (f.k === 'acorn' ? .35 + k * .65 : 1), 0, 0, 6.29); ctx.fill();
    ctx.strokeStyle = `rgba(${f.k === 'bolt' ? '255,240,160' : '255,110,120'},${.5 + .4 * Math.sin(time * 22)})`; ctx.lineWidth = 2.5 * DPR; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.29); ctx.stroke();
    if (f.k !== 'bolt') { const h = (1 - k) * CH * .32, s0 = Math.max(4, rx * .28); ctx.fillStyle = f.k === 'mudb' ? '#6b4a2e' : '#a0705a'; ctx.beginPath(); ctx.arc(x, y - h - s0, s0, 0, 6.29); ctx.fill(); if (f.k === 'acorn') { ctx.fillStyle = '#6a4a2e'; ctx.beginPath(); ctx.ellipse(x, y - h - s0 * 1.7, s0 * 1.05, s0 * .55, 0, 0, 6.29); ctx.fill(); } } }
  for (const h of H3.hits) { const [x, y] = h3Scr(h.x, h.y); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5 * DPR; ctx.lineJoin = 'round'; ctx.shadowColor = '#ffe066'; ctx.shadowBlur = 18 * DPR; ctx.beginPath(); let px = x, py = y; ctx.moveTo(px, py); for (let i = 0; i < 7; i++) { px = x + (((i * 37 + Math.floor(h.x)) % 21) - 10) * 2.2 * DPR; py -= CH * .1; ctx.lineTo(px, py); } ctx.stroke(); ctx.shadowBlur = 0; }
  if (H3.hintT > 0 && enemies.some(q => q.fboss && q.fd === F.id)) { ctx.globalAlpha = Math.min(1, H3.hintT); text(H3.hint, CW / 2, SA.t + 120 * DPR, 10.5 * DPR, '#fff3e0', 'center', true); ctx.globalAlpha = 1; }
  if (H3.flash > 0) { ctx.fillStyle = `rgba(255,255,230,${Math.min(.35, H3.flash * 4)})`; ctx.fillRect(0, 0, CW, CH); }
  const G = H3.gust; if (G && (G.warn > 0 || G.dur > 0)) { const cx = CW / 2, cy = SA.t + 150 * DPR, L = 26 * DPR; ctx.translate(cx, cy); ctx.rotate(G.a); ctx.globalAlpha = G.dur > 0 ? .9 : .5 + .4 * Math.sin(time * 16); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5 * DPR; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.moveTo(L - 10 * DPR, -9 * DPR); ctx.lineTo(L, 0); ctx.lineTo(L - 10 * DPR, 9 * DPR); ctx.stroke(); }
  ctx.restore(); }
drawOverlay4 = (o => () => { try { h3Draw(); } catch (e) { } o(); })(drawOverlay4);
// ---- 3D: 늪 웅덩이 · 포자 버섯 · 보스 진흙 ----
if (typeof __SYNC3D !== 'undefined') __SYNC3D.push(() => { if (!R3) return; const F = curField(), C = F && H3_CFG.haz[F.id], Z = C && (C.k === 'mud' || C.k === 'spore') ? h3Zones(F, C) : [], key = F ? F.id + '|' + H3.pud.map(p => p.id).join(',') : '';
  if (!R3.h3G || R3.h3G.userData.k !== key) { if (R3.h3G) R3.scene.remove(R3.h3G); R3.h3G = null; if (!F) return; const g = new THREE.Group(); g.userData = { k: key, sp: [], pd: [] };
    for (const z of Z) { const X = U(z.x), Zz = ZU(z.y) - .2, rx = C.r / T;
      if (C.k === 'mud') { const a = mesh('c', M('#5e4630', { roughness: .3 }), rx, .03, rx / 1.3, X, .016, Zz), b = mesh('c', M('#4a3626', { roughness: .2 }), rx * .62, .032, rx * .62 / 1.3, X + .1, .018, Zz); a.castShadow = b.castShadow = false; g.add(a, b, mesh('s', '#7a5c40', .09, .05, .09, X - rx * .4, .04, Zz + .1), mesh('s', '#7a5c40', .06, .04, .06, X + rx * .3, .04, Zz - .2)); }
      else { const mat = new THREE.MeshStandardMaterial({ color: '#a06ad9', emissive: '#c9b6ff', emissiveIntensity: .6, roughness: .5 }), sh = grp(mesh('c', '#e8dcc0', .09, .3, .09, 0, .15, 0), mesh('hemi', mat, .3, .24, .3, 0, .26, 0), mesh('s', '#ffffff', .05, .03, .05, .12, .44, .1), mesh('s', '#ffffff', .04, .03, .04, -.13, .42, -.06), mesh('s', '#ffffff', .045, .03, .045, 0, .49, -.1)); sh.position.set(X, 0, Zz);
        const ring = new THREE.Mesh(geos().ring, new THREE.MeshBasicMaterial({ color: '#c9b6ff', transparent: true, opacity: .3, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.scale.set(rx, rx / 1.3, 1); ring.position.set(X, .03, Zz); g.add(sh, ring); g.userData.sp.push({ z, mat, sh, ring }); } }
    for (const p of H3.pud) { const mat = new THREE.MeshStandardMaterial({ color: '#6b4a2e', roughness: .3, transparent: true, opacity: .9 }), d = mesh('c', mat, p.r / T, .03, p.r / T / 1.3, U(p.x), .02, ZU(p.y) - .2); d.castShadow = false; g.add(d); g.userData.pd.push({ p, mat }); }
    R3.scene.add(g); R3.h3G = g; }
  const D = R3.h3G.userData; for (const s of D.sp) { const on = !(s.z.cd > 0); s.mat.emissiveIntensity = on ? .45 + Math.sin(time * 3 + s.z.id) * .25 : 0; s.ring.visible = on; s.sh.scale.setScalar(on ? 1 + Math.sin(time * 3 + s.z.id) * .04 : .82); } for (const q of D.pd) q.mat.opacity = Math.min(.9, q.p.t / 1.2); });
townSave = (o => () => Object.assign(o(), { h3: { seen: H3.seen } }))(townSave);
townLoad = (o => d => { o(d); if (d && d.h3 && d.h3.seen) Object.assign(H3.seen, d.h3.seen); })(townLoad);
