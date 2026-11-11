// ===== uses.js : 새 재료 쓸 곳 — 새 요리 9종 · 냄비/묘약 재료 · 두 번째 취향 선물 · 공방 '만들기'(세트 장비 15종 · 가구 2종) · 연금술 · 교환 · 주간 주문 · 아이콘 =====
const USES_CFG = {
  // 새 요리: [id, 이름, 재료, 용기 회복, 판매가, [효과, 지속(초), 세기], 한마디]
  dishes: [
    ['pumpkinsoup', '호박죽', { pumpkin: 1, milk: 1 }, 11, 46, ['calm', 900, .78], '달콤 따끈'],
    ['pumpkinpie', '호박 파이', { pumpkin: 1, wheat: 1, egg: 1 }, 13, 58, ['calm', 900, .76], '가을 축제의 맛'],
    ['eggplantgrill', '가지 치즈 구이', { eggplant: 1, tomato: 1, cheese_c: 1 }, 12, 62, ['quiet', 900, .7], '치즈가 쭈욱'],
    ['bbpie', '블루베리 파이', { blueberry: 2, wheat: 1, egg: 1 }, 13, 66, ['voice', 900, 1.45], '새콤달콤'],
    ['pancake', '오리알 팬케이크', { wheat: 1, egg_duck: 1, milk: 1 }, 10, 38, ['fluff', 900, .62], '폭신폭신 세 장'],
    ['ducksand', '오리알 샌드위치', { bread: 1, dmayo: 1, cabbage: 1 }, 12, 52, ['calm', 900, .8], '목장 소풍 도시락'],
    ['trufflepasta', '송로 파스타', { wheat: 2, toil: 1, cheese_c: 1 }, 18, 150, ['calm', 1200, .68], '마을에서 가장 비싼 요리'],
    ['cheesecake', '블루베리 치즈케이크', { gcheese: 1, blueberry: 1, egg: 1 }, 14, 84, ['voice', 1200, 1.5], '산양 치즈로 만들어요'],
  ],
  bread: { wheat: 2 },           // 밀 2 → 빵 (부엌)
  // 냄비 재료표: [분류, 회복, 효과] — 냄비에 아무 재료나 넣어도 요리가 돼요
  ing: { pumpkin: ['veg', 4, 'def'], eggplant: ['veg', 3, 'quiet'], wheat: ['grain', 2], blueberry: ['fruit', 3, 'voice'], truffle: ['mush', 2, 'atk'], truffle_p: ['mush', 3, 'atk'], egg_duck: ['egg', 3, 'fluff'], egg_duck_p: ['egg', 4, 'fluff'],
    cheese_c: ['dairy', 4], gcheese: ['dairy', 4, 'quiet'], mayo_c: ['dairy', 2], dmayo: ['dairy', 3],
    moss_cap: ['mon', 0, 'def'], ghost_gel: ['mon', 0, 'quiet'], bark_chip: ['mon', 0, 'def'], mud_shell: ['mon', 0, 'def'], storm_wool: ['mon', 0, 'spd'], aurora_feather: ['mon', 0, 'fluff'], crab_shell: ['mon', 0, 'def'], spark_orb: ['mon', 0, 'atk'] },
  snack: { pumpkin: ['calm', 240, .93], eggplant: ['calm', 180, .94], blueberry: ['voice', 240, 1.15], egg_duck: ['fluff', 300, .88], egg_duck_p: ['fluff', 420, .84], cheese_c: ['quiet', 600, .78], gcheese: ['quiet', 720, .74] },
  // 두 번째 취향: 이 요리를 들고 말을 걸면 선물해요 (하루 한 번, 우정 +fav2Pts)
  fav2: { pig: 'trufflepasta', duck: 'ducksand', rabbit: 'bbpie', cow: 'cheesecake', hen: 'pancake', fox: 'eggplantgrill', squirrel: 'pumpkinpie', sheep: 'pumpkinsoup', sheep2: 'pumpkinsoup', raccoon: 'trufflepasta', owl: 'cheesecake', hedgehog: 'bbpie', d1_farmer: 'pumpkinpie', d1_bee: 'bbpie', d2_turtle: 'ducksand', d2_cat: 'pancake', d3_goat: 'cheesecake', d3_duck: 'pancake' },
  fav2Pts: 5,
  // 공방 '만들기': [결과, 재료, 별사탕] — 세트 장비는 하나씩만
  make: [
    ['hat_lotus', { mud_shell: 2, lotusleaf: 3 }, 20], ['webglove', { crab_shell: 4, cloth: 1 }, 25], ['lifevest', { bark_chip: 4, cloth: 2 }, 40], ['raincape', { mud_shell: 3, cloth: 1 }, 30], ['shellbell', { crab_shell: 5, bark_chip: 2 }, 35], ['bubblewand', { jelly: 4, mud_shell: 1 }, 35], ['scoopnet', { crab_shell: 3, wood: 4 }, 30],
    ['hat_cloud', { storm_wool: 2, cloth: 1 }, 30], ['woolglove', { storm_wool: 2, fur: 2 }, 30], ['woolsuit', { storm_wool: 4, cloth: 2 }, 50], ['cloudcape', { spark_orb: 4, cloth: 1 }, 40], ['windmill', { spark_orb: 5, storm_wool: 1 }, 45], ['rainbowwand', { spark_orb: 3, storm_wool: 2 }, 50], ['cottontail', { storm_wool: 3, honey: 1 }, 40],
    ['hat_beanie', { aurora_feather: 2, cloth: 1 }, 40], ['mitten', { aurora_feather: 2, fur: 2 }, 40], ['padding', { aurora_feather: 4, cloth: 2 }, 65], ['snowcape', { aurora_feather: 3, cloth: 2 }, 50], ['icicle', { aurora_feather: 4, snowball: 5 }, 55],
    ['furn:cushion2', { cloth: 2, fur: 1 }, 15], ['furn:teddy', { cloth: 3, fur: 2, moss_cap: 1 }, 25],
    ['furn:lotuslamp', { lotusleaf: 3, spark_orb: 1 }, 20], ['furn:cloudcushion', { storm_wool: 2, cloth: 1 }, 25], ['furn:snowglobe', { aurora_feather: 1, snowball: 5 }, 30],   // 없어진 마을의 박물관 보상이라 얻을 길이 없던 가구 3종
  ],
  setName: { water: '안개 늪 세트', cloud: '번개 구름 세트', snow: '오로라 설원 세트' },   // 다른 마을과 함께 사라졌던 세트 3개의 새 이름
  alch: [{ out: 'pot_guard', need: { bark_chip: 1, moss_cap: 1 } }, { out: 'pot_sneak', need: { ghost_gel: 2 } }, { out: 'pot_luck', need: { spark_orb: 2, f_berry: 1 } }, { out: 'pot_xp', need: { aurora_feather: 1, storm_wool: 1 } }],
  trade: [['pig', 'truffle', 1, 'ore_au', 1], ['rabbit', 'fur', 3, 'carrot', 8], ['sheep', 'cloth', 1, 'wool_p', 2], ['cow', 'cheese_c', 2, 'milk_p', 3], ['squirrel', 'moss_cap', 3, 'acorn', 10], ['owl', 'ghost_gel', 2, 'pot_xp', 1], ['hedgehog', 'bark_chip', 3, 'ore_fe', 3], ['duck', 'mud_shell', 2, 'fish_carp', 2], ['d3_goat', 'storm_wool', 2, 'ore_au', 1], ['raccoon', 'aurora_feather', 2, 'boss_gem', 1], ['fox', 'toil', 1, 'pot_rainbow', 1], ['hen', 'egg_duck', 3, 'cake', 1]],
  week: [['wheat', 20, '마을 빵 축제'], ['pumpkin', 6, '호박 등불 만들기'], ['cloth', 4, '겨울 담요 만들기'], ['cheese_c', 5, '치즈 품평회'], ['egg_duck', 10, '오리알 장조림 잔치'], ['blueberry', 10, '블루베리 잼 만들기']],
};
// ---- 1. 이름 정리 · 요리 · 냄비 재료 ----
if (ITEMS.cheese_c) { ITEMS.cheese_c.name = '숙성 치즈'; ITEMS.cheese_c.desc = '치즈 틀에서 하루 숙성 · 요리 재료'; } if (ITEMS.mayo_c) { ITEMS.mayo_c.name = '수제 마요'; ITEMS.mayo_c.desc = '마요 기계로 만든 진한 마요'; }
if (ITEMS.cloth) ITEMS.cloth.desc = '양털·토끼털로 짠 천 · 공방에서 옷과 가구를 만들어요'; if (ITEMS.toil) ITEMS.toil.desc = '향긋한 오일 · 송로 파스타 재료';
for (const k in USES_CFG.ing) if (ITEMS[k]) ING[k] = USES_CFG.ing[k];
for (const k in USES_CFG.snack) if (ITEMS[k]) SNACK[k] = USES_CFG.snack[k];
for (const [id, name, need, heal, sell, sn, say0] of USES_CFG.dishes) { if (!Object.keys(need).every(k => ITEMS[k])) continue; SNACK[id] = sn; ITEMS[id] = { name, type: 'use', heal, dish: 1, sell, spr: 'soup', desc: `${snackText(id)} · 용기 +${heal} · ${say0}` }; COOK.push({ out: id, need }); }
if (ITEMS.bread && ITEMS.wheat) COOK.push({ out: 'bread', need: USES_CFG.bread });
for (const k in USES_CFG.snack) { const it = ITEMS[k]; if (!it) continue; it.desc = `${snackText(k)} · 용기 +${it.heal || 0} · 요리 재료`; }
for (const k of ['wheat', 'truffle', 'truffle_p', 'mayo_c', 'dmayo']) if (ITEMS[k] && ING[k]) ITEMS[k].desc = `${(ITEMS[k].desc || '').split(' · ')[0]} · 요리 재료`;
for (const k of ['moss_cap', 'ghost_gel', 'bark_chip', 'mud_shell', 'storm_wool', 'aurora_feather', 'crab_shell', 'spark_orb']) if (ITEMS[k]) { const F = FX_PREFIX[ING[k][2]]; ITEMS[k].desc = `사냥터 재료 · 공방에서 장비 재료 · 곤충과 냄비에 넣으면 ${F} 묘약`; }
if (typeof QUICK_ORDER !== 'undefined') QUICK_ORDER.push('pumpkinsoup', 'pancake');
// 묘약: 사냥터 재료가 들어가면, 효과가 섞여도 흐릿해지지 않고 '가장 많은 효과'(같으면 사냥터 재료 쪽)로 정해져요
cookResult = (o => list => { const r = o(list); try { if (r && r.kind === 'elixir' && !r.fx && list.some(id => ING[id] && ING[id][0] === 'mon' && ING[id][2])) { const cnt = {}; let best = null; for (const id of list) { const g = ING[id]; if (g && g[2]) cnt[g[2]] = (cnt[g[2]] || 0) + (g[0] === 'mon' ? 1.5 : 1); } for (const k in cnt) if (!best || cnt[k] > cnt[best]) best = k;
  if (best) return Object.assign({}, r, { name: `${FX_PREFIX[best]} 묘약`, fx: best, lv: Math.max(1, Math.min(3, Math.floor(cnt[best]))), mixed: false }); } } catch (e) { } return r; })(cookResult);
// ---- 2. 두 번째 취향 선물 ----
const FAVE2 = {}; for (const id in USES_CFG.fav2) if (ITEMS[USES_CFG.fav2[id]]) FAVE2[id] = USES_CFG.fav2[id];
farmTalk = (o => n => { const r = o(n); if (r) return r; const f2 = FAVE2[n.id]; if (!f2 || !(inv[f2] > 0) || FARMD['gift_' + n.id] || n.visitor) return r; FARMD['gift_' + n.id] = 1; inv[f2]--; if (!inv[f2]) delete inv[f2];
  say([L('안노랑', `(${josa(ITEMS[f2].name, '을', '를')} 건넸다!)`), L(n.name, ['우와, 이건 처음 먹어 봐! 정말 맛있다~', '새 요리잖아! 노랑이 솜씨가 날로 느는걸?', '냠냠… 또 만들어 줄 거지? 약속!'][Math.floor(Math.random() * 3)])], () => { addFriend(n.id, USES_CFG.fav2Pts); emote(n, 'heart'); stat('gift'); save(); }); return true; })(farmTalk);
// ---- 3. 공방 '만들기' 탭 ----
for (const v in USES_CFG.setName) if (VIL[v]) VIL[v].name = USES_CFG.setName[v];
for (const [out] of USES_CFG.make) if (ITEMS[out] && ITEMS[out].type === 'eq') { ITEMS[out].hidden = 0; try { eqDesc(out); } catch (e) { } }
for (const h of ['lotus', 'cloud', 'beanie']) if (HATS[h] && ITEMS['hat_' + h]) HATS[h].desc = `외형 · ${VIL[ITEMS['hat_' + h].vil].name} · 삐약 공방에서 만들어요`;
if (typeof FURN !== 'undefined') { FURN.cushion2 = FURN.cushion2 || { name: '포근한 방석', t: [[42, 326]], price: 0, desc: '포근한 천으로 만든 방석 · 삐약 공방에서 만들어요' }; FURN.teddy = FURN.teddy || { name: '병아리 인형', t: [[43, 322]], price: 0, desc: '천과 토끼털로 만든 인형 · 삐약 공방에서 만들어요' };
  if (typeof FB !== 'undefined') { FB.cushion2 = { w: 1, h: 1, ry: 0 }; FB.teddy = { w: 1, h: 1, ry: 0 }; } }
for (const k of ['lotuslamp', 'cloudcushion', 'snowglobe']) if (typeof FURN !== 'undefined' && FURN[k]) FURN[k].desc = '삐약 공방 > 만들기에서 만들어요';
if (typeof furnModel === 'function') furnModel = (o => k => k === 'cushion2' ? grp(mesh('s', '#ffb7cf', .3, .1, .3, 0, .1, 0), mesh('s', '#fff3e0', .08, .03, .08, 0, .19, 0), mesh('s', '#ff8fb5', .31, .04, .31, 0, .08, 0))
  : k === 'teddy' ? grp(mesh('s', '#ffe066', .2, .2, .18, 0, .2, 0), mesh('s', '#ffe066', .15, .15, .14, 0, .46, 0), mesh('co', '#ff9a3a', .04, .08, .04, 0, .44, .15).rotateX(Math.PI / 2), mesh('s', '#3b2a2f', .02, .02, .02, -.06, .5, .12), mesh('s', '#3b2a2f', .02, .02, .02, .06, .5, .12), mesh('s', '#ffd23f', .07, .05, .1, -.2, .2, 0), mesh('s', '#ffd23f', .07, .05, .1, .2, .2, 0), mesh('s', '#ff8fb5', .06, .03, .03, 0, .34, .12)) : o(k))(furnModel);
function mkOwned(out) { if (out.indexOf('furn:') === 0) return !!FOWN[out.slice(5)]; const it = ITEMS[out]; if (it.hatK) return hatOwned.includes(it.hatK); return inv[out] > 0 || eqOn(it.slot) === out; }
function mkName(out) { return out.indexOf('furn:') === 0 ? FURN[out.slice(5)].name : ITEMS[out].name; }
function mkDo(out, need, cost) { if (mkOwned(out)) return pmsg('이미 가지고 있어요'); if (hearts < cost) return pmsg(`별사탕이 모자라요 (✦${cost})`, 1); for (const k in need) if ((inv[k] || 0) < need[k]) return pmsg(`${ITEMS[k].name} ${need[k] - (inv[k] || 0)}개가 더 필요해요`, 1);
  hearts -= cost; for (const k in need) { inv[k] -= need[k]; if (!inv[k]) delete inv[k]; }
  if (out.indexOf('furn:') === 0) giveFurn(out.slice(5)); else if (ITEMS[out].hatK) hatOwned.push(ITEMS[out].hatK); else addItem(out);
  sfx('tada'); burst(P.x, P.y - 20, '#ffd23f', 22); stat('craft'); pmsg(`${mkName(out)} 완성! ${out.indexOf('furn:') === 0 ? '둥지집에 놓였어요' : '가방 > 장비에서 착용해요'}`); save(); }
function mkEntries() { const E = [{ name: '🧵 만들기', desc: '사냥터 재료 + 목장 천으로 세트 장비와 가구를 만들어요 · 같은 세트 3개·5개를 입으면 보너스', tag: '', col: '#ffe9a8', act: () => { } }]; let last = '';
  for (const [out, need, cost] of USES_CFG.make) { const fr = out.indexOf('furn:') === 0, it = fr ? null : ITEMS[out]; if (fr ? !FURN[out.slice(5)] : !it) continue; if (!Object.keys(need).every(k => ITEMS[k])) continue; const sec = fr ? '가구' : VIL[it.vil] ? VIL[it.vil].name : '장비';
    if (sec !== last) { last = sec; const S = !fr && VIL[it.vil]; E.push({ name: `— ${sec} —`, desc: S ? `3개: ${bonusTxt(S.b3)} · 5개: ${bonusTxt(S.b5)}` : '둥지집을 꾸며요', tag: '', col: S ? S.col : '#ffd6e4', act: () => { } }); }
    const own = mkOwned(out), ok = !own && hearts >= cost && Object.keys(need).every(k => (inv[k] || 0) >= need[k]);
    E.push({ img: fr ? null : itemImg(out), name: `${mkName(out)}${fr ? '' : ` · ${statLine(it) || '외형'}`}`, desc: own ? `${fr ? '둥지집 가구' : SLOT_NAME[it.slot]} · 가지고 있어요` : `${haveStr(need)} · ✦${cost}`, tag: own ? '보유' : '만들기', col: own ? '#d9cbb5' : ok ? '#ffd23f' : '#efe2c8', act: () => mkDo(out, need, cost) }); }
  return E; }
openWorkshop = (o => () => { o(); if (menu && menu.kind === 'craft' && !menu.tabs.includes('만들기')) menu.tabs = menu.tabs.concat(['만들기']); })(openWorkshop);
panelEntries = (o => () => menu && menu.kind === 'craft' && menu.tabs[menu.tab] === '만들기' ? mkEntries() : o())(panelEntries);
// ---- 4. 연금술 · 물물교환 · 주간 주문 ----
for (const r of USES_CFG.alch) if (ITEMS[r.out] && Object.keys(r.need).every(k => ITEMS[k])) RECIPES.push(r);
if (typeof TRADE_POOL !== 'undefined') for (const t of USES_CFG.trade) if (ITEMS[t[1]] && ITEMS[t[3]]) TRADE_POOL.push(t);
if (typeof WEEK_POOL !== 'undefined') for (const w of USES_CFG.week) if (ITEMS[w[0]]) WEEK_POOL.push(w);
// ---- 5. 아이템 상세: 쓰는 곳 · 얻는 곳 ----
itemUse = (o => id => { let s = o(id); try { const add = []; const mk = USES_CFG.make.filter(q => q[1][id]).map(q => mkName(q[0])); if (mk.length) add.push(`공방 만들기 ${mk.slice(0, 2).join(', ')}${mk.length > 2 ? ' 외' : ''}`);
  if (typeof SMACH !== 'undefined') { const ms = Object.keys(SMACH).filter(k => SMACH[k].rec.some(r => r[0] === id)).map(k => SMACH[k].name); if (ms.length) add.push(`목장 ${ms.join(', ')}`); }
  const f2 = Object.keys(FAVE2).filter(k => FAVE2[k] === id && npcById(k)).map(npcName); if (f2.length) add.push(`${f2.slice(0, 3).join('·')}${f2.length > 3 ? ' 외' : ''}도 좋아해요`);
  if (ING[id] && !COOK.some(r => r.need[id]) && ING[id][0] !== 'mon') add.push('냄비 요리 재료'); if (add.length) s = add.join(' / ') + (s ? ' / ' + s : ''); } catch (e) { } return s; })(itemUse);
itemSrc = (o => id => { try { if (USES_CFG.make.some(q => q[0] === id)) return '삐약 공방 > 만들기'; if (typeof SMACH !== 'undefined') for (const k in SMACH) if (SMACH[k].rec.some(r => r[1] === id)) return `목장 ${SMACH[k].name}`;
  if (typeof VARIANTS !== 'undefined') for (const k in VARIANTS) if (VARIANTS[k].drop === id) { const F = FIELDS.find(f => f.mobs.some(q => q[0] === k)); return `사냥터 ${F ? F.tier + '단계 ' : ''}${VARIANTS[k].name}`; }
  if (typeof SPC !== 'undefined') for (const k in SPC) if (SPC[k].prod === id || SPC[k].prodP === id) return `목장 ${SPC[k].name}`; } catch (e) { } return o(id); })(itemSrc);
// ---- 6. 아이콘 (3D): 새 작물 · 목장 생산물 · 가공품 · 새 요리 · 사냥터 재료 ----
iconModel = (o => id => { const G = grp, m = mesh, plate = () => G(m('c', '#fff8e7', .42, .05, .42, 0, .03, 0)), bowl = c => G(m('c', '#fff8e7', .4, .18, .4, 0, .1, 0), m('c', '#e8d8c0', .3, .04, .3, 0, .02, 0), m('s', c, .35, .08, .35, 0, .2, 0));
  switch (id) {
    case 'pumpkin': return G(m('s', '#f08a24', .2, .25, .28, -.15, .26, 0), m('s', '#f08a24', .2, .25, .28, .15, .26, 0), m('s', '#f7a23e', .22, .27, .3, 0, .27, 0), m('c', '#6b8a3a', .04, .14, .04, 0, .56, 0));
    case 'eggplant': { const g = G(m('s', '#6a3d8f', .19, .34, .19, 0, .32, 0), m('s', '#7d4aa6', .14, .2, .14, 0, .16, 0), m('co', '#4e974c', .14, .12, .14, 0, .66, 0), m('c', '#4e974c', .03, .12, .03, 0, .76, 0)); g.rotation.z = .5; return g; }
    case 'wheat': { const g = new THREE.Group(); for (let i = -1; i <= 1; i++) { const s = G(m('c', '#d9b56a', .015, .6, .015, 0, .3, 0), m('s', '#e8c87a', .055, .14, .055, 0, .64, 0), m('s', '#f2d98a', .04, .06, .04, 0, .78, 0)); s.position.x = i * .13; s.rotation.z = -i * .22; g.add(s); } g.add(m('tor', '#c94a3b', .06, .06, .1, 0, .2, 0).rotateX(Math.PI / 2)); return g; }
    case 'blueberry': { const g = G(m('s', '#4e974c', .14, .03, .2, .12, .5, 0)); [[0, .2, 0], [.16, .24, .05], [-.15, .25, -.04], [.04, .38, .1], [-.05, .36, -.12], [.1, .1, -.1]].forEach(([x, y, z]) => g.add(m('s', '#4a5ec9', .12, .12, .12, x, y, z), m('s', '#2f3f8f', .03, .02, .03, x, y + .11, z))); return g; }
    case 'truffle': case 'truffle_p': { const c = id === 'truffle' ? '#5a463a' : '#3b2a24', g = G(m('s', c, .26, .2, .24, 0, .2, 0), m('s', c, .16, .14, .16, .16, .2, .1), m('s', c, .15, .13, .15, -.15, .18, -.08)); for (let i = 0; i < 5; i++) g.add(m('s', id === 'truffle' ? '#8a705a' : '#ffd23f', .03, .02, .03, Math.cos(i * 1.3) * .14, .36, Math.sin(i * 1.3) * .12)); return g; }
    case 'egg_duck': case 'egg_duck_p': { const s = id === 'egg_duck' ? 1 : 1.25; return G(m('s', '#d8efe6', .22 * s, .29 * s, .22 * s, 0, .29 * s, 0), m('s', '#ffffff', .05, .07, .02, -.07, .4 * s, .17 * s)); }
    case 'fur': case 'fur_p': { const c = id === 'fur' ? '#ffffff' : '#fff3b0', g = G(m('s', c, .28, .23, .28, 0, .25, 0)); for (let i = 0; i < 7; i++) g.add(m('s', c, .11, .1, .11, Math.cos(i * .9) * .22, .22 + (i % 3) * .08, Math.sin(i * .9) * .22)); return g; }
    case 'cheese_c': return G(m('c', '#c94a3b', .32, .22, .32, 0, .11, 0), m('c', '#ffd98a', .27, .225, .27, 0, .112, 0), m('s', '#f2b82a', .05, .02, .05, .1, .23, .06), m('s', '#f2b82a', .04, .02, .04, -.1, .23, -.08));
    case 'gcheese': return G(m('c', '#fff8e7', .3, .2, .3, 0, .1, 0), m('s', '#8fd16f', .04, .015, .04, .1, .205, .05), m('s', '#8fd16f', .035, .015, .035, -.08, .205, -.1), m('s', '#8fd16f', .03, .015, .03, -.02, .205, .13));
    case 'mayo_c': case 'dmayo': return G(m('c', M(id === 'mayo_c' ? '#fff8e7' : '#fff0b8', { roughness: .25 }), .21, .36, .21, 0, .18, 0), m('c', id === 'mayo_c' ? '#7fb4d6' : '#9be37a', .22, .08, .22, 0, .4, 0), m('b', '#ffffff', .22, .14, .02, 0, .18, .21), m('s', '#ffd23f', .05, .05, .01, 0, .18, .225));
    case 'cloth': return G(m('b', '#ffb7cf', .5, .1, .4, 0, .06, 0), m('b', '#bfe6ff', .48, .1, .38, 0, .16, 0), m('b', '#fff3e0', .46, .1, .36, 0, .26, 0), m('b', '#c9b6ff', .08, .34, .37, .12, .17, 0));
    case 'toil': return G(m('c', M('#d9a63a', { roughness: .2 }), .15, .36, .15, 0, .18, 0), m('c', M('#d9a63a', { roughness: .2 }), .06, .14, .06, 0, .43, 0), m('c', '#a0705a', .07, .06, .07, 0, .52, 0), m('b', '#fff3e0', .16, .14, .02, 0, .2, .15));
    case 'pumpkinsoup': { const g = bowl('#f59a3a'); g.add(m('tor', '#fff3e0', .1, .1, .1, 0, .27, 0).rotateX(Math.PI / 2), m('s', '#4e974c', .04, .015, .05, .12, .28, .05)); return g; }
    case 'pumpkinpie': { const g = plate(); g.add(m('c', '#d99a5a', .36, .1, .36, 0, .1, 0), m('c', '#f08a24', .3, .03, .3, 0, .155, 0), m('s', '#fff8e7', .08, .06, .08, 0, .2, 0)); return g; }
    case 'eggplantgrill': { const g = plate(); for (let i = 0; i < 4; i++) g.add(m('c', '#6a3d8f', .13, .04, .13, -.2 + i * .13, .08 + i * .02, (i % 2) * .06 - .03), m('c', '#ffd98a', .1, .02, .1, -.2 + i * .13, .11 + i * .02, (i % 2) * .06 - .03)); g.add(m('s', '#e2543b', .07, .05, .07, .22, .09, .14)); return g; }
    case 'bbpie': { const g = plate(); g.add(m('c', '#d99a5a', .36, .1, .36, 0, .1, 0), m('c', '#4a5ec9', .3, .03, .3, 0, .155, 0)); for (let i = -1; i <= 1; i++) g.add(m('b', '#e8b56a', .58, .03, .05, 0, .18, i * .15), m('b', '#e8b56a', .05, .03, .58, i * .15, .185, 0)); return g; }
    case 'pancake': { const g = plate(); for (let i = 0; i < 3; i++) g.add(m('c', '#e8b56a', .3 - i * .01, .07, .3 - i * .01, (i % 2) * .02, .09 + i * .075, 0)); g.add(m('s', '#d98a2e', .22, .03, .22, 0, .28, 0), m('b', '#ffe066', .1, .05, .1, .02, .31, .02)); return g; }
    case 'ducksand': return G(m('b', '#f2c48a', .44, .08, .44, 0, .05, 0), m('b', '#fff0b8', .42, .06, .42, 0, .12, 0), m('b', '#8fd16f', .47, .03, .47, 0, .165, 0), m('b', '#d8efe6', .4, .05, .4, 0, .2, 0), m('b', '#f2c48a', .44, .08, .44, 0, .27, 0)).rotateY(.6);
    case 'trufflepasta': { const g = plate(); g.add(m('s', '#f2d98a', .28, .14, .28, 0, .14, 0), m('tor', '#e8c46a', .16, .16, .2, 0, .2, 0).rotateX(Math.PI / 2)); for (let i = 0; i < 5; i++) g.add(m('c', '#3b2a24', .05, .012, .05, Math.cos(i * 1.4) * .12, .28, Math.sin(i * 1.4) * .12)); g.add(m('s', '#4e974c', .04, .015, .05, 0, .3, 0)); return g; }
    case 'cheesecake': { const g = plate(); g.add(m('c', '#d99a5a', .32, .05, .32, 0, .08, 0), m('c', '#fff3d0', .31, .16, .31, 0, .18, 0), m('c', '#4a5ec9', .29, .025, .29, 0, .27, 0)); for (let i = 0; i < 5; i++) g.add(m('s', '#2f3f8f', .05, .05, .05, Math.cos(i * 1.26) * .18, .31, Math.sin(i * 1.26) * .18)); return g; }
    case 'moss_cap': return G(m('c', '#e8dcc0', .1, .26, .1, 0, .13, 0), m('hemi', '#5fae52', .32, .26, .32, 0, .24, 0), m('s', '#8fd16f', .07, .04, .07, .12, .42, .08), m('s', '#8fd16f', .05, .03, .05, -.14, .4, -.05), m('s', '#8fd16f', .06, .03, .06, 0, .47, -.1));
    case 'ghost_gel': return G(m('s', M('#c9b6ff', { transparent: true, opacity: .8, roughness: .1 }), .28, .26, .28, 0, .26, 0), m('s', '#3b2a2f', .035, .05, .02, -.09, .3, .25), m('s', '#3b2a2f', .035, .05, .02, .09, .3, .25), m('s', '#ffffff', .07, .04, .04, .1, .42, .15));
    case 'bark_chip': return G(m('b', '#8a5a3c', .5, .1, .34, 0, .08, 0).rotateY(.3), m('b', '#a0705a', .36, .09, .26, .04, .18, .02).rotateY(-.4), m('s', '#5fae52', .06, .03, .06, -.1, .24, .05));
    case 'mud_shell': return G(m('hemi', '#6b5a3a', .34, .28, .3, 0, .03, 0), m('hemi', '#8a7650', .2, .2, .18, 0, .14, 0), m('s', '#4a3d28', .08, .03, .06, .18, .08, .14), m('s', '#4a3d28', .06, .03, .05, -.2, .07, -.1));
    case 'storm_wool': { const g = G(m('s', '#ffe066', .26, .22, .26, 0, .25, 0)); for (let i = 0; i < 6; i++) g.add(m('s', '#fff3b0', .11, .1, .11, Math.cos(i * 1.05) * .2, .22 + (i % 2) * .1, Math.sin(i * 1.05) * .2)); g.add(m('co', M('#ffffff', { emissive: '#ffe066', emissiveIntensity: .8 }), .05, .2, .02, .1, .5, .1).rotateZ(2.6)); return g; }
    case 'aurora_feather': { const g = G(m('s', M('#7fe8c8', { emissive: '#7fe8c8', emissiveIntensity: .25 }), .11, .34, .03, 0, .36, 0), m('s', '#c9b6ff', .07, .2, .032, 0, .44, 0), m('c', '#fff3e0', .012, .5, .012, 0, .27, 0)); g.rotation.z = -.45; return g; }
    case 'crab_shell': return G(m('hemi', '#d9774a', .32, .22, .26, 0, .04, 0), m('s', '#f2a078', .1, .04, .08, 0, .22, 0), m('s', '#d9774a', .08, .06, .06, -.3, .1, .1), m('s', '#d9774a', .08, .06, .06, .3, .1, .1));
    case 'spark_orb': return G(m('s', M('#ffe680', { emissive: '#ffd23f', emissiveIntensity: .9, roughness: .2 }), .22, .22, .22, 0, .3, 0), m('s', M('#ffffff', { transparent: true, opacity: .35 }), .3, .3, .3, 0, .3, 0), m('s', '#ffffff', .05, .05, .05, -.07, .38, .16));
  }
  return o(id); })(iconModel);
