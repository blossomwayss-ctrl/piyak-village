// ===== small2.js : 오늘의 소동 새 종류 3개 — 건초 받기(헛간 앞) · 오리 줄서기(목장 연못) · 무궁화 꽃이 피었습니다(큰 밭 앞길) =====
const SM2_CFG = {
  catch: { who: ['cow'], sp: { name: '헛간 앞', x: 34.5, y: 44.6 }, n: 6, warn: 1.9, gap: [1.0, 1.6], r: 13, area: [31, 44.2, 37, 47.4], miss: 22, bonk: 28 },   // 건초 6번 · 예고 1.9초 · 받는 범위 13px · 놓치면 공룡 티 +22 · 웅크리지 않고 받으면 +28
  duckline: { who: ['duck'], sp: { name: '목장 연못', x: 27.0, y: 46.6 }, path: [[25.3, 47.0], [30.9, 47.0], [30.9, 51.4], [25.3, 51.4]], spd: 22, gapPx: 13, far: 34, near: 8, farGain: 22, bump: 18, stop: [2.5, 4.5], stopFor: [.7, 1.3], loops: 1 },   // 줄 간격 13px · 34px보다 멀어지면 초당 +22 · 8px보다 붙으면 쿵 +18
  mugung: { who: ['rabbit', 'squirrel', 'hedgehog', 'pig'], sp: { name: '큰 밭 앞길', x: 19.4, y: 35.5 }, tag: [6.0, 36.7], green: [1.2, 2.4], red: [1.2, 2.0], move: 120, sway: 5, touch: 16, spdK: .6 },   // 술래 자리 · 외치는 시간 · 돌아보는 시간 · 움직이면 초당 +120 · 서 있기만 하면 꼬리가 살랑 +5(웅크리면 0) · 걷는 속도 ×0.6(살금살금)
};
Object.assign(SMALL, {
  catch: { name: '건초 받기', make: who => ({ sp: SM2_CFG.catch.sp, title: '헛간 건초 받기', intro: [L(npcName(who), '노랑아, 마침 잘 왔다! 헛간 2층에서 건초를 던질 테니 아래에서 받아 주렴~'), L('계획이', `노란 동그라미로 뛰어가서, 떨어질 때 ${KB()} 꾹! 웅크려야 살포시 받아져.`), L('먹보', '서서 받으면… 꼬리가 건초를 날려 버려. 공룡 티 팍팍.')] }) },
  duckline: { name: '오리 줄서기', make: who => ({ sp: SM2_CFG.duckline.sp, title: '꽥꽥 한 줄 산책', intro: [L(npcName(who), '꽥! 오늘은 연못 한 바퀴 줄 맞춰 산책이야. 내 뒤로 한 줄로 서~'), L('승부욕', '노랑아, 맨 뒤에 붙어! 너무 떨어져도, 너무 붙어도 안 돼.'), L('계획이', '앞이 갑자기 멈추면 너도 멈춰. 꼬리로 밀면 다 넘어져!')] }) },
  mugung: { name: '무궁화 꽃이', make: who => ({ sp: SM2_CFG.mugung.sp, title: '무궁화 꽃이 피었습니다', intro: [L(npcName(who), '오늘은 "무궁화 꽃이 피었습니다" 하자! 내가 술래~'), L('계획이', `술래가 돌아보면 멈춰야 해. 노랑이는 꼬리가 살랑거리니까 ${KB()} 꾹 눌러 웅크려!`), L('승부욕', '술래 등을 먼저 찍으면 이기는 거야. 간다!')] }) },
});
Object.assign(SMALL_WHO, { catch: SM2_CFG.catch.who, duckline: SM2_CFG.duckline.who, mugung: SM2_CFG.mugung.who });
function sm2Path(C) { const pts = C.path.map(([x, y]) => [x * T, y * T]), seg = [], n = pts.length; let L0 = 0; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, l, L0]); L0 += l; }
  return { len: L0, at: s => { s = ((s % L0) + L0) % L0; for (const [a, b, l, s0] of seg) if (s <= s0 + l) { const k = (s - s0) / l; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } return pts[0]; } }; }
Object.assign(SMALL_EP, {
  catch: { id: 'small', small: 1, steps: [
    { enter(E) { const sp = E.d.sp; E.d.setup = () => { epHold(E.d.who, 38.6 * T, 43.5 * T, -1); epMakeChicks(3); EPC.forEach((c, i) => { c.x = (30.2 + i * .7) * T; c.y = (43.4 + (i % 2) * .4) * T; c.face = 1; }); }; smallCommon(E, sp); }, tick(E) { return E.d.ready; } },
    { enter(E) { const C = SM2_CFG.catch; E.d.n = 0; E.d.got = 0; E.d.cd = 1.2; E.d.bale = null; DG.on = true; DG.onCaught = () => { DG.on = false; E.d.bale = null; smallFinish(E, false, [L(npcName(E.d.who), '어이쿠, 건초가 온 목장에 흩어졌구먼! 방금 그 꼬리는… 누구 거냐?'), L('안노랑', '삐, 삐약…?'), L('먹보', '(건초를 뒤집어쓴 노랑이. 완전 허수아비다.)')], '와르르!'); }; toast('노란 동그라미로! 떨어질 때 웅크리기'); },
      lockA: true,
      tick(E, dt) { const C = SM2_CFG.catch, n = npcById(E.d.who);
        if (!E.d.bale) { E.d.cd -= dt; if (E.d.cd > 0) return; if (E.d.n >= C.n) { if (DG.on) { DG.on = false; epPanel(2, P.x, P.y, [{ who: '병아리들', text: `${E.d.got}개나 받았어!` }], '착!'); smallFinish(E, true, [L(npcName(E.d.who), `허허, ${E.d.got}개나 받았구나! 이렇게 듬직한 병아리는 처음 본다.`), L('안노랑', '(듬직한 병아리… 후훗.)'), L('계획이', '…보통 병아리는 건초에 깔려.')], '착착!'); } return; }
          let x, y; for (let i = 0; i < 12; i++) { x = (C.area[0] + Math.random() * (C.area[2] - C.area[0])) * T; y = (C.area[1] + Math.random() * (C.area[3] - C.area[1])) * T; if (Math.hypot(x - P.x, y - P.y) > 26 && boxFree(x, y)) break; }
          E.d.n++; E.d.bale = { x, y, t: C.warn, t0: C.warn, fx: n.x, fy: n.y - 26 }; n.react = .4; floaters.push({ x: n.x, y: n.y - 46, t: 1, text: ['간다~!', '받아라~!', '하나 더!'][E.d.n % 3], col: '#fff' }); sfx('swipe'); return; }
        const b = E.d.bale; b.t -= dt; if (b.t > 0) return; E.d.bale = null; E.d.cd = C.gap[0] + Math.random() * (C.gap[1] - C.gap[0]); const inS = Math.hypot(P.x - b.x, (P.y - b.y) * 1.3) < C.r, cr = crouching(); burst(b.x, b.y - 6, '#e8c87a', 14);
        if (inS && cr) { E.d.got++; sfx('pick'); floaters.push({ x: P.x, y: P.y - 40, t: 1.1, text: '살포시!', col: '#9be37a' }); EPC.forEach(c => { c.jump = .15; setTimeout(() => c.jump = 0, 250); }); }
        else if (inS) { E.d.got++; sfx('bonk'); shake(1.5, .12); dgGain(C.bonk, 'all'); floaters.push({ x: P.x, y: P.y - 40, t: 1.2, text: '쿵! 꼬리로 쳐냈다', col: '#ff8fa3' }); }
        else { sfx('poof'); dgGain(C.miss, 'all'); floaters.push({ x: b.x, y: b.y - 24, t: 1.2, text: '놓쳤다!', col: '#ff8fa3' }); }
        if (E.d.n === 2) epPanel(1, P.x, P.y, [{ who: npcName(E.d.who), text: '받아라~!' }, { who: '안노랑', text: cr ? '(납작…!)' : '(어, 어디로…)' }], inS ? '착!' : '휙'); } },
    { tick() { return false; } }],
    props(E) { const b = E.d.bale, m = ent('ep_bale', () => { const g = grp(mesh('c', '#e8c87a', .26, .5, .26, 0, 0, 0), mesh('c', '#d9b56a', .2, .51, .2, 0, 0, 0)); g.children[0].rotation.x = g.children[1].rotation.x = Math.PI / 2; return g; }); m.visible = !!b; if (b) { const k = 1 - Math.max(0, b.t) / b.t0, x = b.fx + (b.x - b.fx) * k, y = b.fy + (b.y - b.fy) * k; m.position.set(U(x), 2.2 * (1 - k) + Math.sin(k * Math.PI) * 1.6 + .2, ZU(y) - .2); m.rotation.z = k * 9; } } },
  duckline: { id: 'small', small: 1, steps: [
    { enter(E) { const sp = E.d.sp, C = SM2_CFG.duckline; E.d.path = sm2Path(C); E.d.s = C.gapPx * 4 + 4; E.d.setup = () => { epMakeChicks(3); const [lx, ly] = E.d.path.at(E.d.s), n0 = npcById(E.d.who); if (n0 && n0.swim) { n0._sm2swim = 1; n0.swim = false; } epHold(E.d.who, lx, ly, 1); EPC.forEach((c, i) => { const [x, y] = E.d.path.at(E.d.s - (i + 1) * C.gapPx); c.x = x; c.y = y; c.face = 1; c.sp = 60; }); }; smallCommon(E, sp); }, tick(E) { return E.d.ready; } },
    { enter(E) { const C = SM2_CFG.duckline; E.d.go = C.stop[0] + Math.random() * (C.stop[1] - C.stop[0]); E.d.hold = 0; E.d.bumpCd = 0; E.d.farT = 0; E.d.s0 = E.d.s; DG.on = true; DG.onCaught = () => { DG.on = false; EPC.forEach(c => { c.jump = .3; }); smallFinish(E, false, [L(npcName(E.d.who), '꽥?! 맨 뒤에 그 커다란 건… 오리가 아닌데?'), L('안노랑', '꽥… 아니, 삐약…?'), L('승부욕', '(줄이 도미노처럼 넘어졌다.)')], '우당탕!'); }; toast('맨 뒤 병아리 바로 뒤! 점선 동그라미를 따라가요'); },
      lockA: true,
      tick(E, dt) { const C = SM2_CFG.duckline, n = npcById(E.d.who), PT = E.d.path; if (n.swim) { n._sm2swim = 1; n.swim = false; }   /* 꽥꽥이는 평소 연못에서 헤엄쳐요 → 소동 동안만 땅으로 */
        if (E.d.hold > 0) { E.d.hold -= dt; n.walking = false; } else { E.d.s += C.spd * dt; E.d.go -= dt; n.walking = true; if (E.d.go <= 0) { E.d.go = C.stop[0] + Math.random() * (C.stop[1] - C.stop[0]); E.d.hold = C.stopFor[0] + Math.random() * (C.stopFor[1] - C.stopFor[0]); floaters.push({ x: n.x, y: n.y - 40, t: .9, text: '꽥! (멈춤)', col: '#fff3b0' }); sfx('blip'); } }
        const [lx, ly] = PT.at(E.d.s), [ax, ay] = PT.at(E.d.s + 4); n.x = n.tx = lx; n.y = n.ty = ly; if (Math.abs(ax - lx) > .2) n.face = ax > lx ? 1 : -1;
        EPC.forEach((c, i) => { const [x, y] = PT.at(E.d.s - (i + 1) * C.gapPx); if (Math.abs(x - c.x) > .2) c.face = x > c.x ? 1 : -1; c.moving = !(E.d.hold > 0); if (c.moving) c.hop += dt * 12; c.x = x; c.y = y; });
        const last = EPC[EPC.length - 1], d = Math.hypot(P.x - last.x, P.y - last.y); E.d.slot = PT.at(E.d.s - (EPC.length + 1) * C.gapPx); if (E.d.bumpCd > 0) E.d.bumpCd -= dt;
        if (d > C.far) { dgGain(C.farGain * dt, 'all'); E.d.farT -= dt; if (E.d.farT <= 0) { E.d.farT = 1.4; floaters.push({ x: P.x, y: P.y - 40, t: 1, text: '줄에서 떨어졌다!', col: '#ff8fa3' }); } }
        else if (d < C.near && E.d.bumpCd <= 0) { E.d.bumpCd = .9; dgGain(C.bump, 'all'); sfx('bonk'); shake(1.2, .1); last.jump = .2; setTimeout(() => last.jump = 0, 250); floaters.push({ x: last.x, y: last.y - 30, t: 1, text: '쿵! 삐약?!', col: '#ff8fa3' }); }
        const prog = (E.d.s - E.d.s0) / (PT.len * C.loops); if (prog > .45 && !E.d.p1) { E.d.p1 = 1; epPanel(1, P.x, P.y, [{ who: npcName(E.d.who), text: '꽥, 꽥, 줄 맞춰~' }, { who: '안노랑', text: '(뒤뚱… 뒤뚱…)' }], '뒤뚱'); }
        if (prog >= 1 && DG.on) { DG.on = false; n.walking = false; epPanel(2, P.x, P.y, [{ who: '병아리들', text: '한 바퀴 끝~!' }], '꽥!'); smallFinish(E, true, [L(npcName(E.d.who), '꽥꽥! 오늘 줄 최고였어. 맨 뒤 오리도 아주 잘 따라왔고!'), L('안노랑', '(오리… 로 보였다! 후훗.)'), L('계획이', '…병아리인 척하다가 이제 오리인 척까지.')], '꽥꽥!'); } } },
    { tick() { return false; } }] },
  mugung: { id: 'small', small: 1, steps: [
    { enter(E) { const sp = E.d.sp, C = SM2_CFG.mugung; E.d.setup = () => { epHold(E.d.who, C.tag[0] * T, C.tag[1] * T, -1); epMakeChicks(4); EPC.forEach((c, i) => { c.x = (sp.x - .6 + (i % 2) * .7) * T; c.y = (36.15 + i * .32) * T; c.face = -1; c.sp = 26 + i * 3; c.tx = c.x; c.ty = c.y; }); }; smallCommon(E, sp); }, tick(E) { return E.d.ready; } },
    { enter(E) { const C = SM2_CFG.mugung; E.d.ph = 'green'; E.d.dur = E.d.t = (C.green[0] + C.green[1]) / 2; E.d.said = 0; E.d.round = 0; DG.on = true; DG.onCaught = () => { DG.on = false; const n = npcById(E.d.who); emote(n, '!', 1.5); smallFinish(E, false, [L(npcName(E.d.who), '움직였다! 거기 꼬리 흔든 병아… 병아리 맞아?'), L('안노랑', '삐약… (꼬리가 멋대로…)'), L('승부욕', '노랑이 꼬리는 술래보다 눈치가 없어.')], '움찔!'); }; toast('술래가 돌아보면 멈추고 웅크리기!'); },
      lockA: true,
      tick(E, dt) { const C = SM2_CFG.mugung, n = npcById(E.d.who), words = ['무궁화', '꽃이', '피었', '습니다!']; E.d.t -= dt;
        if (E.d.ph === 'green') { n.face = -1; const k = 1 - E.d.t / E.d.dur, w = Math.min(3, Math.floor(k * 4)); if (w >= E.d.said) { floaters.push({ x: n.x + 8, y: n.y - 40 - E.d.said * 3, t: .8, text: words[E.d.said], col: '#fff' }); E.d.said++; }
          EPC.forEach(c => { if (c.x > (C.tag[0] + 2.2) * T) { c.tx = c.x - 40; c.ty = c.y; } else c.tx = c.x; });
          if (E.d.t <= 0) { E.d.ph = 'red'; E.d.t = C.red[0] + Math.random() * (C.red[1] - C.red[0]); n.face = 1; emote(n, '!', .8); sfx('blip'); EPC.forEach(c => { c.tx = c.x; c.ty = c.y; }); E.d.round++; if (E.d.round === 2) epPanel(1, P.x, P.y, [{ who: npcName(E.d.who), text: '…피었습니다!' }, { who: '안노랑', text: crouching() ? '(납작. 꼬리도 납작.)' : '(꼬리야 제발…)' }], '휙!'); } }
        else { n.face = 1; if (P.moving) dgGain(C.move * dt, 'run'); else if (!crouching()) dgGain(C.sway * dt, 'all'); if (E.d.t <= 0) { E.d.ph = 'green'; E.d.dur = E.d.t = C.green[0] + Math.random() * (C.green[1] - C.green[0]); E.d.said = 0; } }
        if (DG.on && Math.hypot(P.x - n.x, P.y - n.y) < C.touch) { DG.on = false; epPanel(2, P.x, P.y, [{ who: '안노랑', text: '찍었다!' }], '톡!'); EPC.forEach(c => { c.jump = .2; setTimeout(() => c.jump = 0, 300); }); smallFinish(E, true, [L(npcName(E.d.who), '앗, 벌써?! 한 번도 안 걸리고 왔네!'), L('안노랑', '(멈추는 건 자신 있지. 화석처럼!)'), L('계획이', '…화석?'), L('안노랑', '아, 아니… 삐약!')], '톡!'); } } },
    { tick() { return false; } }] },
});
for (const k of ['catch', 'duckline', 'mugung']) { const base = SMALL_EP.sneak.finish, P0 = SMALL_EP[k].props; SMALL_EP[k].props = (E, dt) => { if (P0) P0(E, dt); };
  SMALL_EP[k].finish = E => { base(E); try { if (k === 'duckline' && E.d.ok && typeof HATS !== 'undefined' && HATS.beak && !hatOwned.includes('beak')) { hatOwned.push('beak'); save(); setTimeout(() => toast('🦆 노란 부리 마스크를 받았어요! 가방 > 장비 > 모자'), 2800); } } catch (e) { } }; }
// ---- 그리기: 건초 떨어질 자리 · 줄 맨 뒤 자리 · 술래 눈 (2D·3D 공통) ----
drawOverlay4 = (o => () => { try { if (EP && EP.def.small && state === 'play' && !menu && typeof h3Ell === 'function') { const d = EP.d; ctx.save();
  if (d.kind === 'catch' && d.bale) { const b = d.bale, [x, y, rx, ry] = h3Ell(b.x, b.y, SM2_CFG.catch.r + 3), k = 1 - Math.max(0, b.t) / b.t0; ctx.fillStyle = `rgba(255,214,64,${.18 + k * .3})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.29); ctx.fill(); ctx.strokeStyle = `rgba(255,240,160,${.6 + .35 * Math.sin(time * 20)})`; ctx.lineWidth = 3 * DPR; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.29); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x, y, rx * (1 - k), ry * (1 - k), 0, 0, 6.29); ctx.stroke();
    if (!(typeof USE3D !== 'undefined' && USE3D)) { const h = (1 - k) * CH * .3; ctx.fillStyle = '#e8c87a'; ctx.beginPath(); ctx.arc(x, y - h - 8, 7 * SC / 3, 0, 6.29); ctx.fill(); } }
  if (d.kind === 'duckline' && d.slot && DG.on) { const [x, y, rx, ry] = h3Ell(d.slot[0], d.slot[1], 9); ctx.setLineDash([5 * DPR, 5 * DPR]); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2.5 * DPR; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.29); ctx.stroke(); ctx.setLineDash([]); }
  if (d.kind === 'mugung' && d.ph && DG.on) { const n = npcById(d.who), [x0, y0] = fxScr(n.x, n.y - 30, 1.5), x = Math.max(44 * DPR, Math.min(CW - 44 * DPR, x0)), y = Math.max(SA.t + 130 * DPR, Math.min(CH - 60 * DPR, y0)), red = d.ph === 'red'; ctx.fillStyle = red ? '#ff5a6a' : '#9be37a'; ctx.strokeStyle = '#33222a'; ctx.lineWidth = 2 * DPR; rr(x - 34 * DPR, y - 13 * DPR, 68 * DPR, 26 * DPR, 13 * DPR); ctx.fill(); ctx.stroke(); text(red ? '👀 멈춰!' : '🌸 지금!', x, y + 1, 12 * DPR, '#fff', 'center'); }
  ctx.restore(); } } catch (e) { } o(); })(drawOverlay4);
// 무궁화: 살금살금 걷기 (속도 ×spdK)
updateTown = (o => dt => { o(dt); if (EP && EP.d && EP.d.kind === 'mugung' && DG.on) window.__spdMul = (window.__spdMul === undefined ? 1 : window.__spdMul) * SM2_CFG.mugung.spdK; })(updateTown);
// 소동이 끝나면(그만둬도) 꽥꽥이는 다시 연못으로
update = (o => dt => { o(dt); if (!EP) for (const n of NPCS) if (n._sm2swim) { n.swim = true; delete n._sm2swim; } })(update);
