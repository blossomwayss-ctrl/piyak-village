// ===== cal.js : 게임 달력 — 계절 · 요일 · 명절 · 생일을 게임 날짜로 (한 계절 = 7일, 1년 = 28일) =====
// 게임 하루 = 현실 1시간(gametime.js)이라, 한 계절 = 현실 7시간 · 1년 = 현실 28시간이에요.
const CAL_CFG = {
  seasonDays: 7,                                       // 한 계절의 게임 일수 (14면 한 계절 = 현실 14시간)
  order: ['spring', 'summer', 'autumn', 'winter'],     // 1일째는 봄 1일부터 시작
  weekStart: 1,                                        // 계절 1일의 요일 (0=일 · 1=월). 1이면 7일이 일요일 = 계절 축제 날
  holi: { halloween: ['autumn', 4, 5], pepero: ['autumn', 6, 6], xmas: ['winter', 2, 3], seollal: ['winter', 6, 7] },   // 명절: [계절, 시작일, 끝일]
};
const CALS = { sk: '', bmail: 0, hello: 0 };   // 마지막으로 알린 계절 · 생일 편지를 보낸 날 · 달력 안내 편지 여부
function calLen() { return CAL_CFG.seasonDays * CAL_CFG.order.length; }
function calAt(i) { const L0 = calLen(), yd = ((i % L0) + L0) % L0, si = Math.floor(yd / CAL_CFG.seasonDays); return { year: Math.floor(i / L0) + 1, si, sk: CAL_CFG.order[si], day: yd % CAL_CFG.seasonDays + 1, yd }; }
function calNow(off = 0) { return calAt(gameDayNo() - 1 + off); }
function calStr(c) { c = c || calNow(); return `${SEASON_NAME[c.sk]} ${c.day}일`; }
function calOfKey(k) { return k >= 300000000 ? calAt(k - 300000000 - (GT.start === null ? gameDay() : GT.start)) : null; }
function dayLabel(k) { const c = calOfKey(+k); if (c) return calStr(c); const s = String(k); return `${+s.slice(4, 6)}월 ${+s.slice(6)}일`; }
function calWd(off = 0) { return '일월화수목금토'[(((gameDayNo() - 1 + off + CAL_CFG.weekStart) % 7) + 7) % 7]; }
// ---- 계절 · 요일 · 주 ----
envSeason = (o => () => CFG.season !== 'auto' ? o() : calNow().sk)(envSeason);
gameWeekday = () => (((gameDayNo() - 1 + CAL_CFG.weekStart) % 7) + 7) % 7;
if (typeof weekKey === 'function') weekKey = () => 'cw' + Math.floor((gameDayNo() - 1) / 7);
function daysToSeason() { return CAL_CFG.seasonDays - calNow().day + 1; }   /* 다음 계절까지 남은 일수 */
// ---- 생일: 원래 [월, 일] → 그 달이 속한 계절의 며칠째로 옮겨요 ----
function calOfMD(md) { const m = md[0], si = m >= 3 && m <= 5 ? 0 : m >= 6 && m <= 8 ? 1 : m >= 9 && m <= 11 ? 2 : 3, p = ((m % 3) * 30 + md[1] - 1) / 92, S = CAL_CFG.seasonDays; return { si, day: Math.max(1, Math.min(S, 1 + Math.floor(p * S))) }; }
function mdStr(md) { const c = calOfMD(md); return `${SEASON_NAME[CAL_CFG.order[c.si]]} ${c.day}일`; }
function mdToday(md) { const c = calOfMD(md), n = calNow(); return c.si === n.si && c.day === n.day; }
isBday = id => { const b = BDAY[id]; return !!b && mdToday(b); };
daysUntil = md => { const c = calOfMD(md), L0 = calLen(), t = c.si * CAL_CFG.seasonDays + c.day - 1; return (((t - calNow().yd) % L0) + L0) % L0; };
// ---- 명절 ----
function holiSpan(h) { const c = CAL_CFG.holi[h.id]; return c ? `${SEASON_NAME[c[0]]} ${c[1]}${c[2] > c[1] ? '~' + c[2] : ''}일` : ''; }
function holiIn(h) { const c = CAL_CFG.holi[h.id]; if (!c) return 99; const L0 = calLen(), t = CAL_CFG.order.indexOf(c[0]) * CAL_CFG.seasonDays + c[1] - 1; return (((t - calNow().yd) % L0) + L0) % L0; }   /* 시작까지 남은 일수 */
holiday = () => { if (CFG.holi) return HOLI.find(h => h.id === CFG.holi) || null; const n = calNow(); return HOLI.find(h => { const c = CAL_CFG.holi[h.id]; return !!c && c[0] === n.sk && n.day >= c[1] && n.day <= c[2]; }) || null; };
holiRec = h => { const k = 'gy' + calNow().year + '_' + h.id; return HOLI_REC[k] || (HOLI_REC[k] = { got: {}, claimed: 0 }); };
holiEntries = (o => () => { const E = o(), h = holiday();
  if (!h) { if (E[0]) E[0].desc = HOLI.slice().sort((a, b) => holiIn(a) - holiIn(b)).map(q => `${q.name} ${holiSpan(q)}`).join(' · '); }
  else if (E[0]) E[0].desc = E[0].desc.replace(/ · \d+\/\d+~\d+\/\d+$/, ` · ${holiSpan(h)}`);
  return E; })(holiEntries);
// 현실 날짜에 맞춰 보내던 알림 문구는 게임 달력과 어긋나서, 날짜와 상관없는 마을 소식만 보내요
notiMsg = d => { const R = [['🥚 닭들이 새 알을 낳았어요', '오늘도 농장에 들러 줄래요? 병아리 3총사가 기다려요'], ['🌱 밭의 작물이 쑥쑥 자랐어요', '물 주고 수확하러 가 볼까요?'], ['🐣 삐약! 노랑이 어디 갔지?', '계획이·먹보·승부욕이 노랑이를 찾고 있어요'], ['🍂 삐약마을 계절이 바뀌었을지도 몰라요', '새 계절엔 새 씨앗 · 새 곤충 · 새 물고기가 나와요']]; const r = R[Math.floor(d.getTime() / 864e5) % R.length]; return { t: r[0], b: r[1] }; };
// ---- 화면: 아침 브리핑 · 광장 게시판 달력 ----
const SEASON_TIP = { spring: '봄 씨앗 · 나비 · 올챙이가 나와요', summer: '블루베리 · 매미 · 메기가 나와요', autumn: '호박 · 고추잠자리 · 귀뚜라미가 나와요', winter: '빙어 · 눈꽃나방 · 눈사람의 계절이에요' };
briefEntries = (o => () => { const E = o(); try { const c = calNow();
  if (E[0]) { const tail = E[0].name.split(' · ').slice(2).join(' · '); E[0].name = `${c.year}년째 ${calStr(c)} (${calWd()})${tail ? ' · ' + tail : ''}`; E[0].desc = `좋은 아침이야, 노랑아! · 다음 계절까지 ${daysToSeason()}일`; }
  const f = E.find(q => q.name.indexOf('축제: ') === 0); if (f) { const df = (7 - gameWeekday()) % 7; f.desc = `${df}일 뒤 일요일`; f.tag = `D-${df}`; }
  const hs = HOLI.map(h => [holiIn(h), h]).filter(q => q[0] > 0 && q[0] <= 3).sort((a, b) => a[0] - b[0])[0]; if (hs && !holiday()) E.push({ name: `곧 ${hs[1].name}`, desc: `${holiSpan(hs[1])} · 친구들에게 말 걸고 ${hs[1].itemName} 모으기`, tag: `D-${hs[0]}`, col: '#efe2c8', act: () => { } });
} catch (e) { } return E; })(briefEntries);
festEntries = (o => m => { const E = o(m); try { if (m.tabs[m.tab] !== '달력') return E; const c = calNow(), nx = calAt(gameDayNo() - 1 + daysToSeason()), X = [];
  X.push({ name: `📅 오늘: ${c.year}년째 ${calStr(c)} (${calWd()}요일)`, desc: `한 계절 = ${CAL_CFG.seasonDays}일 · 1년 = ${calLen()}일 · 게임 하루 = 현실 ${GT_CFG.dayMin}분`, tag: SEASON_NAME[c.sk], col: '#ffd23f', act: () => { } });
  X.push({ name: `다음 계절: ${SEASON_NAME[nx.sk]}`, desc: SEASON_TIP[nx.sk], tag: `D-${daysToSeason()}`, col: '#efe2c8', act: () => { } });
  const hl = HOLI.slice().sort((a, b) => holiIn(a) - holiIn(b)), hn = holiday(); X.push({ name: hn ? `🎉 지금 ${hn.name}!` : `다가오는 명절: ${hl[0].name}`, desc: hl.map(q => `${q.name} ${holiSpan(q)}`).join(' · '), tag: hn ? '오늘' : `D-${holiIn(hl[0])}`, col: hn ? '#ff8fa3' : '#efe2c8', act: () => { } });
  const bd = Object.keys(BDAY).filter(id => npcById(id)).map(id => ({ id, d: daysUntil(BDAY[id]) })).sort((a, b) => a.d - b.d).slice(0, 4);
  if (bd.length) X.push({ name: `🎂 생일: ${bd.map(q => `${npcById(q.id).name} ${q.d ? 'D-' + q.d : '오늘!'}`).join(' · ')}`, desc: bd.map(q => `${npcById(q.id).name} ${mdStr(BDAY[q.id])}`).join(' · '), tag: bd[0].d ? `D-${bd[0].d}` : '오늘', col: bd[0].d ? '#efe2c8' : '#ff8fa3', act: () => { } });
  return X.concat(E); } catch (e) { return E; } })(festEntries);
// ---- 매일: 계절이 바뀌면 알림 · 생일 편지 · 처음 한 번 달력 안내 편지 ----
function calTick() { if (state !== 'play' || dlg || menu || window.__noAuto || curRoom.dungeon) return; const c = calNow();
  if (!CALS.hello) { CALS.hello = 1; CALS.sk = c.sk; try { lfAddMail({ from: '계획이', title: '📅 삐약마을 달력 보는 법', body: ['노랑아! 삐약마을 달력을 알려 줄게.', `한 계절은 ${CAL_CFG.seasonDays}일, 1년은 ${calLen()}일이야. 오늘은 ${c.year}년째 ${calStr(c)}!`, '계절마다 씨앗 · 곤충 · 물고기가 달라지고, 매 계절 7일(일요일)엔 축제가 열려.', '명절이랑 친구 생일도 광장 게시판 달력에서 볼 수 있어. 삐약!'], gift: null }); } catch (e) { } save(); return; }
  if (CALS.sk !== c.sk) { CALS.sk = c.sk; banner(`${{ spring: '🌸', summer: '🌻', autumn: '🍂', winter: '❄️' }[c.sk]} ${SEASON_NAME[c.sk]}이 왔어요!`, SEASON_TIP[c.sk], { spring: '#ffb3c6', summer: '#9be37a', autumn: '#f0a04a', winter: '#bfe0ff' }[c.sk]); sfx('star'); save(); return; }
  const k = dayKey(); if (CALS.bmail !== k) { CALS.bmail = k; try { for (const id in BDAY) { const n = npcById(id); if (n && isBday(id)) lfAddMail({ from: '계획이', title: `🎂 오늘은 ${n.name} 생일!`, body: [`노랑아! 오늘(${calStr(c)})은 ${n.name}의 생일이야.`, typeof FAVE !== 'undefined' && FAVE[id] && ITEMS[FAVE[id]] ? `${josa(ITEMS[FAVE[id]].name, '을', '를')} 제일 좋아한대. 선물하러 가 볼까?` : '축하해 주러 가 볼까?'], gift: null }); }
    for (const nm in CHICK_BDAY) if (mdToday(CHICK_BDAY[nm])) lfAddMail({ from: nm, title: `🎂 오늘은 내 생일이야! 삐약!`, body: [`노랑아, 오늘은 나 ${nm}의 생일이야!`, '같이 놀아 줘서 고마워. 같이 먹으려고 케이크를 넣어 뒀어. 삐약삐약!'], gift: ITEMS.cake ? { cake: 1 } : null }); } catch (e) { } save(); } }
update = (o => dt => { o(dt); try { calTick(); } catch (e) { console.warn('cal', e); } })(update);
townSave = (o => () => Object.assign(o(), { cal: CALS }))(townSave);
townLoad = (o => d => { o(d); if (d && d.cal) Object.assign(CALS, d.cal); })(townLoad);
// 날씨: '이틀 연속 비는 없어요' 계산이 게임 날짜에서도 맞게 (어제 = 오늘 - 1)
prevDayKey = (o => d => d >= 300000000 ? d - 1 : o(d))(prevDayKey);
