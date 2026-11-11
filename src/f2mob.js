// ===== f2mob.js : 사냥터 개편 1탄 — 2단계 「으스스 버섯골」 몬스터 · 보스 · 타격 효과 =====
// 세팅은 F2M_CFG 한 곳에 모았어요. 거리 단위는 px(1칸 = 16px), 시간은 초.
const F2M_CFG = {
  scale: { mob: 1.5, elite: 1.25 },                    // 몬스터 크기 배율 · 엘리트는 여기에 더 곱해요
  hit: { mob: 3, boss: 14 }, touch: { mob: 12 },       // 꼬리가 닿는 거리 덤 · 몸에 닿아 다치는 거리
  ai: { shroom: 'hide', jelly: 'leap', v_ghost: 'blink', seedflower: 'lob' },   // 몬스터 → 행동 (돌진 멧돼지는 원래 하던 돌진 그대로)
  hide: { wake: 46, pop: .45, spd: 2.6, hop: .3, rest: .42, lose: 150, loseT: 4 },                 // 숨었다 튀어나오기: 46px 안에 오면 튀어나옴 · 150px 밖으로 4초 벗어나면 다시 숨음
  leap: { range: 92, aim: .7, air: .55, r: 17, rest: .9, cd: 3.2, walk: .8, h: 1.3 },               // 점프 덮치기: 92px 안에서 0.7초 조준 → 0.55초 날아 반경 17px 덮침 → 0.9초 납작(빈틈) · 3.2초마다
  blink: { every: [3.6, 5], fade: .4, dist: [52, 72], aim: .45, shot: { n: 3, spd: 95, col: '#c9b6ff' }, drift: .6 },   // 순간이동 + 세 갈래 쏘기: 3.6~5초마다 주인공 52~72px 옆으로
  lob: { range: 135, every: 2.6, fly: .9, r: 14, h: 1.6 },                                           // 포물선 던지기: 135px 안 · 2.6초마다 · 0.9초 뒤 반경 14px에 떨어짐
  boss: { on: 1, scale: 2.8, touch: 20, intro: 2, move: .55, p2: .5, gap: [1.6, 1.0], rage: 1.1, leave: 2.5,   // 크기 · 닿는 거리 · 등장 연출 2초 · 체력 50%에 2페이즈 · 패턴 사이 쉬는 시간(1·2페이즈)
    slam: { fade: .55, warn: [.85, .6], r: 44, times: [1, 2], rest: .7 },                              // 내려찍기: 사라졌다가 머리 위에서 쿵 (예고 0.85초 → 2페이즈 0.6초, 2번 연속) · 반경 44px
    rain: { n: [5, 8], r: 15, fly: 1.0, gapT: .16, spread: 70, wind: .5 },                             // 포자 비: 5개 → 8개 · 주인공 둘레 70px 안에 떨어짐
    ring: { n: [10, 14], spd: [78, 98], waves: [1, 2], gapT: .55, wind: .6 },                          // 포자 탄막: 사방으로 10발 → 14발 2번
    hint: '사라지면 머리 위에서 쿵! 바닥 동그라미를 피하고, 쿵 뒤 빈틈에 꼬리!' },
};
const F2M = { lobs: [], rings: [] };
function f2E() { return typeof h3Easy === 'function' ? h3Easy() : 1; }
function f2Move(e, vx, vy, dt) { const nx = e.x + vx * dt, ny = e.y + vy * dt; if (boxFree(nx, e.y, 4, 2)) e.x = nx; if (boxFree(e.x, ny, 4, 2)) e.y = ny; }
function f2Pre(e, dt, hidden) { const D = ENEMY[e.kind]; e.t += dt; if (e.inv > 0) e.inv -= dt; if (e.flash > 0) e.flash -= dt; if (e.slow > 0) e.slow -= dt; if (e.aim > 0) e.aim -= dt;
  const dP = Math.hypot(P.x - e.x, P.y - e.y); if (!hidden && e.aw === 0 && typeof notice === 'function' && dP < (typeof noticeR === 'function' ? noticeR(e) : 46)) notice(e);
  if (e.kb > 0) { e.kb -= dt; f2Move(e, e.vx, e.vy, dt); return null; } if (e.stun > 0) { e.stun -= dt; return null; } if (e.alert > 0) { e.alert -= dt; return null; } if (!hidden && e.aw === 0 && e.zz) return null;
  return { D, dP, sp: (D.spd || 0) * (e.slow > 0 ? .45 : 1), agro: e.aw !== 0 && dP < 160 }; }
function f2Home(e, q, dt) { const dx = e.hx - e.x, dy = e.hy - e.y, d = Math.hypot(dx, dy); if (d > 26) f2Move(e, dx / d * q.sp * .5, dy / d * q.sp * .5, dt); }
function f2Lob(x0, y0, tx, ty, o) { F2M.lobs.push(Object.assign({ x0, y0, tx, ty, t: 0, T: .9, r: 14, h: 1.6, col: '#9be37a' }, o)); }
const F2AI = {
  // 숨었다 튀어나오기 (버섯돌이)
  hide(e, dt) { const C = F2M_CFG.hide; if (!e.f2s) { e.f2s = 'hid'; e.zz = false; } const q = f2Pre(e, dt, e.f2s === 'hid'); if (!q) return;
    if (e.f2s === 'hid') { if (e.aw !== 0 || q.dP < (typeof crouching === 'function' && crouching() ? C.wake * .5 : C.wake)) { e.aw = 1; e.f2s = 'pop'; e.f2t = C.pop; floaters.push({ x: e.x, y: e.y - 26, t: .9, text: '뿅!', col: '#ff6b6b' }); sfx('pop'); burst(e.x, e.y - 4, '#d9c8a4', 8); } return; }
    if (e.f2s === 'pop') { e.f2t -= dt; if (e.f2t <= 0) { e.f2s = 'run'; e.hopT = 0; e.f2far = 0; } return; }
    e.hopT -= dt; if (e.hop > 0) { e.hop -= dt; f2Move(e, e.vx, e.vy, dt); } else if (e.hopT <= 0) { e.hopT = C.rest + C.hop; e.hop = C.hop; const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1; e.vx = dx / d * q.sp * C.spd; e.vy = dy / d * q.sp * C.spd; if (Math.abs(dx) > 1) e.face = dx > 0 ? 1 : -1; }
    e.f2far = q.dP > C.lose ? (e.f2far || 0) + dt : 0; if (e.f2far > C.loseT) { e.f2s = 'hid'; e.aw = 0; e.hop = 0; burst(e.x, e.y - 4, '#d9c8a4', 6); return; }
    if (q.dP < F2M_CFG.touch.mob) hurtPlayer(q.D.atk, e); },
  // 점프 덮치기 (말랑 젤리)
  leap(e, dt) { const C = F2M_CFG.leap, q = f2Pre(e, dt); if (!q) return; e.f2s = e.f2s || 'walk'; e.f2cd = (e.f2cd === undefined ? 1 + Math.random() * 2 : e.f2cd) - dt;
    if (e.f2s === 'walk') { if (q.agro) { const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1; f2Move(e, dx / d * q.sp * C.walk, dy / d * q.sp * C.walk, dt); if (Math.abs(dx) > 1) e.face = dx > 0 ? 1 : -1; if (d < C.range && e.f2cd <= 0) { e.f2s = 'aim'; e.f2t = C.aim * f2E(); e.f2T = e.f2t; e.tx = P.x; e.ty = P.y; sfx('blip'); } } else f2Home(e, q, dt); if (q.dP < F2M_CFG.touch.mob) hurtPlayer(q.D.atk, e); return; }
    if (e.f2s === 'aim') { e.f2t -= dt; if (e.f2t <= 0) { e.f2s = 'air'; e.f2t = C.air; e.sx = e.x; e.sy = e.y; e.inv = Math.max(e.inv || 0, C.air); sfx('swipe'); } return; }
    if (e.f2s === 'air') { e.f2t -= dt; const k = 1 - Math.max(0, e.f2t) / C.air; e.x = e.sx + (e.tx - e.sx) * k; e.y = e.sy + (e.ty - e.sy) * k; e.f2h = Math.sin(k * Math.PI) * C.h;
      if (e.f2t <= 0) { e.f2h = 0; e.f2s = 'rest'; e.f2t = C.rest; e.f2cd = C.cd * f2E(); shake(1.4, .12); burst(e.x, e.y - 2, '#bfe8c8', 12); sfx('bonk'); F2M.rings.push({ x: e.x, y: e.y, r: C.r, t: 0, T: .35, col: '#bfe8c8' }); if (Math.hypot(P.x - e.x, (P.y - e.y) * 1.3) < C.r) hurtPlayer(q.D.atk, e); } return; }
    e.f2t -= dt; if (e.f2t <= 0) e.f2s = 'walk'; },
  // 순간이동 + 세 갈래 쏘기 (유령 젤리)
  blink(e, dt) { const C = F2M_CFG.blink, q = f2Pre(e, dt); if (!q) return; e.f2s = e.f2s || 'drift';
    if (e.f2s === 'drift') { e.f2cd = (e.f2cd === undefined ? 1 + Math.random() * 2 : e.f2cd) - dt; e.f2a = 1; if (q.agro) { const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1; if (d > 40) f2Move(e, dx / d * q.sp * C.drift, dy / d * q.sp * C.drift, dt); if (Math.abs(dx) > 1) e.face = dx > 0 ? 1 : -1; if (e.f2cd <= 0) { e.f2s = 'out'; e.f2t = C.fade; sfx('poof'); } } else f2Home(e, q, dt); if (q.dP < F2M_CFG.touch.mob) hurtPlayer(q.D.atk, e); return; }
    if (e.f2s === 'out') { e.f2t -= dt; e.f2a = Math.max(0, e.f2t / C.fade); e.inv = Math.max(e.inv || 0, .1); if (e.f2t <= 0) { for (let i = 0; i < 14; i++) { const a = Math.random() * 6.283, d = C.dist[0] + Math.random() * (C.dist[1] - C.dist[0]), x = P.x + Math.cos(a) * d, y = P.y + Math.sin(a) * d * .8; if (boxFree(x, y, 5, 3)) { e.x = x; e.y = y; break; } } e.f2s = 'in'; e.f2t = C.fade; burst(e.x, e.y - 6, '#c9b6ff', 10); } return; }
    if (e.f2s === 'in') { e.f2t -= dt; e.f2a = 1 - Math.max(0, e.f2t / C.fade); e.inv = Math.max(e.inv || 0, .05); if (e.f2t <= 0) { e.f2a = 1; e.f2s = 'aim'; e.f2t = C.aim * f2E(); e.aim = e.f2t; } return; }
    e.f2t -= dt; if (Math.abs(P.x - e.x) > 1) e.face = P.x > e.x ? 1 : -1; if (e.f2t <= 0) { ebFire(e, C.shot); e.f2s = 'drift'; e.f2cd = (C.every[0] + Math.random() * (C.every[1] - C.every[0])) * f2E(); } },
  // 포물선 던지기 (씨앗 뱉는 꽃)
  lob(e, dt) { const C = F2M_CFG.lob, q = f2Pre(e, dt); if (!q) return; if (Math.abs(P.x - e.x) > 2) e.face = P.x > e.x ? 1 : -1; e.f2cd = (e.f2cd === undefined ? 1 + Math.random() : e.f2cd) - dt * (e.slow > 0 ? .5 : 1);
    if (e.aw !== 0 && q.dP < C.range && e.f2cd <= 0) { e.f2cd = C.every * f2E(); e.aim = .3; f2Lob(e.x, e.y - 8, P.x, P.y, { T: C.fly * f2E(), r: C.r, h: C.h }); sfx('blip'); }
    if (q.dP < 10) hurtPlayer(q.D.atk, e); },
};
function f2Lobs(dt) { for (let i = F2M.lobs.length - 1; i >= 0; i--) { const b = F2M.lobs[i]; b.t += dt; if (b.t < b.T) continue; F2M.lobs.splice(i, 1); burst(b.tx, b.ty - 2, b.col, 10); sfx('pop'); F2M.rings.push({ x: b.tx, y: b.ty, r: b.r, t: 0, T: .3, col: b.col }); if (Math.hypot(P.x - b.tx, (P.y - b.ty) * 1.3) < b.r) hurtPlayer(1, { x: b.tx, y: b.ty }); }
  for (let i = F2M.rings.length - 1; i >= 0; i--) { const r = F2M.rings[i]; r.t += dt; if (r.t >= r.T) F2M.rings.splice(i, 1); } }

// ---------- 보스: 버섯골의 유령 왕 ----------
function f2Arena(F, x, y, k) { const A = F.ell[F.ell.length - 1], cx = (F.x + A.cx) * T, cy = (F.y + A.cy) * T, dx = (x - cx) / (A.rx * T), dy = (y - cy) / (A.ry * T), d = Math.hypot(dx, dy); if (k === undefined) return d; if (d <= k) return [x, y]; return [cx + dx / d * k * A.rx * T, cy + dy / d * k * A.ry * T]; }
function f2Boss(e, dt, F) { const C = F2M_CFG.boss, D = ENEMY[e.kind], ph = e.bp === 2 ? 1 : 0; e.t += dt; if (e.inv > 0) e.inv -= dt; if (e.flash > 0) e.flash -= dt; if (e.slow > 0) e.slow -= dt; e.stT = e.cgT = e.h3T = 99; e.aw = 1; e.zz = false;
  const dP = Math.hypot(P.x - e.x, P.y - e.y), inA = f2Arena(F, P.x, P.y), A = F.ell[F.ell.length - 1], cx = (F.x + A.cx) * T, cy = (F.y + A.cy) * T, sp = (D.spd || 30) * (e.slow > 0 ? .45 : 1);
  if (e.kb > 0) { e.kb -= dt; if (e.kb <= 0) { e.vx = e.vy = 0; } }
  if (!e.bs) { e.bs = 'sleep'; e.f2k = 1; e.f2h = 0; }
  if (e.bs === 'sleep') { F2S.fight = 0; const dx = cx - e.x, dy = cy - e.y, d = Math.hypot(dx, dy); if (d > 3) { e.x += dx / d * Math.min(d, 40 * dt); e.y += dy / d * Math.min(d, 40 * dt); }
    if (e.bhp === undefined) e.bhp = e.hp; if (inA < 1.02 || e.hp < e.bhp) { e.bs = 'intro'; e.bt = e.bseen ? .8 : C.intro; e.bT = e.bt; e.bseen = 1; banner(`👑 ${e.bname || '유령 왕'}`, C.hint, '#c9b6ff'); shake(2.6, .5); sfx('roar'); burst(e.x, e.y - 10, '#c9b6ff', 24); } return; }
  F2S.fight = 1;
  if (e.bs === 'intro') { e.bt -= dt; e.inv = Math.max(e.inv || 0, .2); e.f2k = .45 + .55 * (1 - Math.max(0, e.bt) / e.bT); if (e.bt <= 0) { e.f2k = 1; e.bs = 'idle'; e.bt = C.gap[ph]; e.bfar = 0; } return; }
  if (e.bp !== 2 && e.hp / e.max < C.p2 && e.bs === 'idle') { e.bp = 2; e.bs = 'rage'; e.bt = C.rage; banner('💢 유령 왕이 화났어요!', '패턴이 빨라지고 두 번씩 와요', '#ff6b8a'); shake(3, .5); sfx('roar'); burst(e.x, e.y - 12, '#ff8fb5', 30); return; }
  if (e.bs === 'rage') { e.bt -= dt; e.inv = Math.max(e.inv || 0, .2); if (e.bt <= 0) { e.bs = 'idle'; e.bt = .5; } return; }
  if (e.bs === 'idle') { e.f2k = 1; e.f2h = 0; if (dP > 26) { const dx = P.x - e.x, dy = P.y - e.y; const [nx, ny] = f2Arena(F, e.x + dx / dP * sp * C.move * dt, e.y + dy / dP * sp * C.move * dt, .9); e.x = nx; e.y = ny; if (Math.abs(dx) > 1) e.face = dx > 0 ? 1 : -1; }
    e.bfar = inA > 1.35 ? (e.bfar || 0) + dt : 0; if (e.bfar > C.leave) { e.bs = 'sleep'; e.bhp = e.hp; return; } if (dP < C.touch) hurtPlayer(D.atk, e);
    e.bt -= dt; if (e.bt <= 0 && inA < 1.2) { const seq = ['slam', 'rain', 'ring']; e.bi = (e.bi === undefined ? 0 : e.bi + 1) % seq.length; e.bs = seq[e.bi]; e.bq = 0; e.bn = 0; e.bt = 0; } return; }
  if (e.bs === 'slam') { const S = C.slam;
    if (e.bq === 0) { e.bq = 1; e.bt = e.bn ? S.fade * .55 : S.fade; e.bT = e.bt; sfx('poof'); floaters.push({ x: e.x, y: e.y - 44, t: .8, text: '스르륵…', col: '#c9b6ff' }); }
    if (e.bq === 1) { e.bt -= dt; e.inv = Math.max(e.inv || 0, .2); e.f2k = Math.max(0, e.bt / e.bT); if (e.bt <= 0) { const [tx, ty] = f2Arena(F, P.x, P.y, .88); e.x = e.tx = tx; e.y = e.ty = ty; e.bq = 2; e.bt = S.warn[ph] * f2E(); e.bT = e.bt; } return; }
    if (e.bq === 2) { e.bt -= dt; e.inv = Math.max(e.inv || 0, .2); const k = 1 - Math.max(0, e.bt) / e.bT; e.f2k = Math.min(1, k * 2.5); e.f2h = 2.6 * (k < .8 ? 1 : 1 - (k - .8) / .2);
      if (e.bt <= 0) { e.f2h = 0; e.f2k = 1; shake(3.2, .3); sfx('bonk'); burst(e.x, e.y - 4, '#c9b6ff', 26); F2M.rings.push({ x: e.x, y: e.y, r: S.r, t: 0, T: .4, col: '#c9b6ff' }); if (Math.hypot(P.x - e.x, (P.y - e.y) * 1.3) < S.r) hurtPlayer(1, e); e.bn++; if (e.bn < S.times[ph]) { e.bq = 0; } else { e.bs = 'idle'; e.bt = S.rest + C.gap[ph]; } } return; } return; }
  if (e.bs === 'rain') { const R = C.rain;
    if (e.bq === 0) { e.bq = 1; e.bt = R.wind; e.aim = R.wind; floaters.push({ x: e.x, y: e.y - 44, t: .8, text: '포자 비!', col: '#9be37a' }); sfx('blip'); }
    e.bt -= dt; if (e.bq === 1 && e.bt <= 0) { e.bq = 2; e.bt = 0; }
    if (e.bq === 2 && e.bt <= 0) { const a = Math.random() * 6.283, d = e.bn ? 18 + Math.random() * (R.spread - 18) : 0, [tx, ty] = f2Arena(F, P.x + Math.cos(a) * d, P.y + Math.sin(a) * d * .8, .96); f2Lob(e.x, e.y - 20, tx, ty, { T: R.fly * f2E(), r: R.r, h: 2.4, col: '#9be37a' }); e.bn++; e.bt = R.gapT; if (e.bn >= R.n[ph]) { e.bs = 'idle'; e.bt = C.gap[ph] + .4; } } if (dP < C.touch) hurtPlayer(D.atk, e); return; }
  if (e.bs === 'ring') { const R = C.ring;
    if (e.bq === 0) { e.bq = 1; e.bt = R.wind * f2E(); e.aim = e.bt; floaters.push({ x: e.x, y: e.y - 44, t: .8, text: '후우우…', col: '#c9b6ff' }); }
    e.bt -= dt; if (e.bt <= 0) { const n = R.n[ph], off = e.bn * Math.PI / n + e.t; for (let i = 0; i < n; i++) { const a = off + i / n * 6.283; EBUL.push({ x: e.x, y: e.y - 6, vx: Math.cos(a) * R.spd[ph], vy: Math.sin(a) * R.spd[ph] * .8, left: 170, col: '#c9b6ff', room: e.room }); } sfx('swipe'); shake(1.2, .1); e.bn++; e.bt = R.gapT; if (e.bn >= R.waves[ph]) { e.bs = 'idle'; e.bt = C.gap[ph]; } } if (dP < C.touch) hurtPlayer(D.atk, e); return; } }

// ---------- 기본 이동 대신 새 행동으로 ----------
updateEnemies = (o => dt => { const F = typeof curField === 'function' && curField(), mine = []; if (F && F.v2) for (let i = enemies.length - 1; i >= 0; i--) { const e = enemies[i]; if (e.fd === F.id && (e.fboss ? F2M_CFG.boss.on && !e.mboss : F2M_CFG.ai[e.kind])) mine.push(enemies.splice(i, 1)[0]); }
  try { o(dt); } finally { enemies.push(...mine.reverse()); }
  if (dlg || menu || state !== 'play' || (P.hold && P.hold.t > 0)) return; let boss = false;
  for (const e of mine) { if (!enemies.includes(e)) continue; try { if (e.fboss) { boss = true; f2Boss(e, dt, F); } else F2AI[F2M_CFG.ai[e.kind]](e, dt); } catch (err) { console.warn('f2ai', err); } }
  if (!boss) F2S.fight = 0; if (F && F.v2) f2Lobs(dt); else if (F2M.lobs.length || F2M.rings.length) { F2M.lobs.length = 0; F2M.rings.length = 0; } })(updateEnemies);
// 큰 몸집에 맞게 꼬리가 닿는 거리 늘리기
smack = (o => (x, y, R, heartP, dmg) => { const F = typeof curField === 'function' && curField(), ext = []; if (F && F.v2) for (const e of enemies) { if (e.fd !== F.id || !(e.inv <= 0)) continue; const d = Math.hypot(e.x - x, e.y - 6 - y), b = e.fboss ? F2M_CFG.hit.boss : F2M_CFG.hit.mob; if (d >= R + 6 && d < R + 6 + b) ext.push(e); }
  o(x, y, R, heartP, dmg); for (const e of ext) if (enemies.includes(e) && e.inv <= 0) hitEnemy(e, dmg === undefined ? atkOf() : dmg); })(smack);
// 타격 효과: 흰 고리 + 별 조각
hitEnemy = (o => (e, dmg) => { const F = typeof curField === 'function' && curField(), v2 = F && F.v2 && e.fd === F.id, x = e.x, y = e.y, big = e.fboss; o(e, dmg); if (!v2) return; F2M.rings.push({ x, y: y - 6, r: big ? 28 : 14, t: 0, T: .22, col: '#ffffff' });
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + Math.random(); parts.push({ x, y: y - 8, vx: Math.cos(a) * 75, vy: Math.sin(a) * 50 - 25, t: .32, c: i % 2 ? '#ffe066' : '#ffffff', g: 70, sz: 3 }); } })(hitEnemy);
if (typeof H3_CFG !== 'undefined' && H3_CFG.boss.fa2) H3_CFG.boss.fa2.hint = F2M_CFG.boss.hint;

// ---------- 모형: 유령 젤리(전용 몬스터) 새 모형 · 유령 왕 왕관과 도깨비불 ----------
function f2GhostModel() { const g = new THREE.Group(), b = new THREE.Group(), m = mesh; g.add(b); const mk = (c, o, x) => new THREE.MeshStandardMaterial(Object.assign({ color: c, transparent: true, opacity: o, roughness: .5 }, x || {}));
  const body = mk('#d9ccff', .82, { roughness: .25, emissive: '#9a7cff', emissiveIntensity: .35 }), core = mk('#fff6ff', .9, { emissive: '#ffd0ff', emissiveIntensity: .9 }), hat = mk('#7a4fc0', 1, { roughness: .7 }), dark = mk('#2b1d3a', 1), wht = mk('#ffffff', 1);
  b.add(m('s', body, .22, .2, .2, 0, .24, 0)); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; b.add(m('sLow', body, .08, .09, .08, Math.cos(a) * .15, .08, Math.sin(a) * .13)); }
  b.add(m('sLow', core, .07, .07, .07, 0, .22, .02), m('sLow', dark, .03, .02, .02, 0, .2, .19)); for (const s of [-1, 1]) b.add(m('sLow', dark, .04, .055, .03, s * .08, .27, .17), m('sLow', wht, .014, .018, .01, s * .08 + .01, .295, .195), m('sLow', mk('#ffb7e0', .8), .035, .02, .02, s * .14, .22, .15));
  b.add(m('c', wht, .045, .05, .045, 0, .42, 0), m('hemi', hat, .17, .12, .17, 0, .43, 0)); for (let i = 0; i < 4; i++) { const a = i * 1.57 + .5; b.add(m('sLow', wht, .03, .018, .03, Math.cos(a) * .1, .51, Math.sin(a) * .1)); }
  const tail = m('co', body, .07, .16, .07, 0, .07, -.2); tail.rotation.x = -1.9; b.add(tail); g.userData.b = b; g.userData.mats = [[body, .82], [core, .9], [hat, 1], [dark, 1], [wht, 1]]; return g; }
buildMob = (o => kind => { if (kind === 'v_ghost') { try { return f2GhostModel(); } catch (e) { console.warn('f2model', e); } } const g = o(kind);
  if (kind === 'b_ghost') { try { const b = g.userData.b || g, gold = M('#ffd23f', { roughness: .35, metalness: .3 }); b.add(mesh('c', gold, .13, .04, .13, 0, .655, 0)); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; b.add(mesh('co', gold, .034, .09, .034, Math.cos(a) * .105, .72, Math.sin(a) * .105)); }
      const orb = new THREE.Group(), wm = new THREE.MeshStandardMaterial({ color: '#f1e9ff', emissive: '#b9a8ff', emissiveIntensity: 1.1 }); for (let i = 0; i < 3; i++) { const a = i / 3 * 6.283; orb.add(mesh('sLow', wm, .05, .05, .05, Math.cos(a) * .44, .26 + i * .08, Math.sin(a) * .44)); } g.add(orb); g.userData.orbit = orb; g.userData.wisp = wm;
      g.traverse(q => { if (q.isMesh && q.material.emissive && q.material.emissive.getHexString() === 'a88cff') g.userData.skin = q.material; }); if (typeof f2Glow === 'function') g.add(f2Glow('#b9a8ff', 1.5, 0, .03, 0, .45)); } catch (e) { console.warn('f2boss', e); } } return g; })(buildMob);

// ---------- 3D: 크기 · 동작 ----------
if (typeof __SYNC3D !== 'undefined') __SYNC3D.push(() => { const F = typeof curField === 'function' && curField(); if (!F || !F.v2 || !R3 || !R3.ents) return; const S = F2M_CFG.scale;
  for (const e of enemies) { if (e.fd !== F.id) continue; const m = R3.ents.get(e); if (!m) continue; const b = m.userData.b, base = e.fboss && !e.mboss ? F2M_CFG.boss.scale : S.mob * (e.elite ? S.elite : 1), k = base * (e.f2k === undefined ? 1 : e.f2k); m.scale.setScalar(Math.max(.001, k)); const st = e.f2s;
    if (st === 'hid') { m.position.y = -.3 * base; if (b) { b.scale.set(1, 1, 1); b.rotation.z = Math.sin(time * 2 + e.x) * .04; } }
    else if (st === 'pop') { const q = 1 - Math.max(0, e.f2t) / F2M_CFG.hide.pop; m.position.y = Math.sin(q * Math.PI) * .7 - .3 * base * (1 - q); m.rotation.y += lastDt * 14; }
    else if (st === 'aim' && b && F2M_CFG.ai[e.kind] === 'leap') { const w = Math.sin(time * 50) * .04; b.scale.set(1.25 + w, .62, 1.25 - w); }
    else if (st === 'air' && b) b.scale.set(.85, 1.25, .85);
    else if (st === 'rest' && b) { const q = Math.max(0, e.f2t) / F2M_CFG.leap.rest; b.scale.set(1 + .35 * q, 1 - .45 * q, 1 + .35 * q); }
    if (e.aim > 0 && b && st !== 'air') { const w = 1 + Math.sin(time * 30) * .06; b.scale.multiplyScalar(w); }
    if (e.cst === 'wind' && b) b.scale.set(1.2, .82, 1.2);
    if (e.f2h) m.position.y += e.f2h;
    if (m.userData.mats) { const a = e.f2a === undefined ? 1 : e.f2a; for (const [mt, o0] of m.userData.mats) mt.opacity = o0 * a; m.position.y += .12 + Math.sin(e.t * 3) * .05; }
    if (e.fboss && !e.mboss) { if (m.userData.orbit) { m.userData.orbit.rotation.y = time * (e.bp === 2 ? 3.2 : 1.6); } if (e.bs !== 'slam') m.position.y += .18 + Math.sin(time * 2.2) * .08; if (e.bs === 'intro' || e.bs === 'rage') m.rotation.y += lastDt * 10;
      const sk = m.userData.skin, hot = e.bp === 2; if (sk && sk._hot !== hot) { sk._hot = hot; sk.emissive.set(hot ? '#ff5f9e' : '#a88cff'); sk.emissiveIntensity = hot ? .6 : .28; if (m.userData.wisp) m.userData.wisp.emissive.set(hot ? '#ff8fb5' : '#b9a8ff'); } } } });

// ---------- 화면 위 예고 표시 (3D · 2D 공통) ----------
function f2Scr(x, y, h) { return typeof fxScr === 'function' ? fxScr(x, y, h) : h3Scr(x, y); }
function f2Warn(x, y, r, k, col) { const [sx, sy, rx, ry] = h3Ell(x, y, r); ctx.fillStyle = col; ctx.globalAlpha = .16 + .08 * Math.sin(time * 14); ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, 0, 6.283); ctx.fill(); ctx.globalAlpha = .42; ctx.beginPath(); ctx.ellipse(sx, sy, rx * k, ry * k, 0, 0, 6.283); ctx.fill(); ctx.globalAlpha = .95; ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, rx * .07); ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
function f2Draw() { const F = typeof curField === 'function' && curField(); if (!F || !F.v2 || state !== 'play') return; ctx.save();
  for (const e of enemies) { if (e.fd !== F.id) continue;
    if (F2M_CFG.ai[e.kind] === 'leap' && (e.f2s === 'aim' || e.f2s === 'air')) f2Warn(e.tx, e.ty, F2M_CFG.leap.r, e.f2s === 'air' ? 1 : 1 - Math.max(0, e.f2t) / (e.f2T || 1), '#ff6b6b');
    if (e.fboss && e.bs === 'slam' && e.bq === 2) f2Warn(e.tx, e.ty, F2M_CFG.boss.slam.r, 1 - Math.max(0, e.bt) / (e.bT || 1), '#ff6b8a'); }
  for (const b of F2M.lobs) { const k = Math.min(1, b.t / b.T); f2Warn(b.tx, b.ty, b.r, k, '#ff8a5a'); const x = b.x0 + (b.tx - b.x0) * k, y = b.y0 + (b.ty - b.y0) * k, [sx, sy] = f2Scr(x, y, .25 + Math.sin(k * Math.PI) * b.h), rr = Math.max(3, h3Ell(x, y, 4)[2]); ctx.fillStyle = b.col; ctx.strokeStyle = '#3b2a2f'; ctx.lineWidth = Math.max(1.5, rr * .22); ctx.beginPath(); ctx.arc(sx, sy, rr, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(sx - rr * .3, sy - rr * .3, rr * .3, 0, 6.283); ctx.fill(); }
  for (const r of F2M.rings) { const k = r.t / r.T, [sx, sy, rx, ry] = h3Ell(r.x, r.y, r.r * (.4 + .8 * k)); ctx.globalAlpha = 1 - k; ctx.strokeStyle = r.col; ctx.lineWidth = Math.max(2, rx * .14 * (1 - k)); ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.restore(); }
drawOverlay4 = (o => () => { try { f2Draw(); } catch (e) { } o(); })(drawOverlay4);
