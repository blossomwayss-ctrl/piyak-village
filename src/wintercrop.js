// ===== wintercrop.js : 겨울 농사 — 겨울 작물 4종 (대파 · 마늘 · 겨울무 · 보리) · 방앗간 가루 2종 · 새 요리 5종 =====
const WCROP_CFG = {
  // 작물: [id, 이름, 자라는 날, 씨앗값, 판매가, 계절, 회복, 2D 그림 번호]
  crops: [
    ['leek', '대파', 2, 2, 6, ['winter', 'spring'], 2, 54],
    ['garlic', '마늘', 4, 5, 17, ['winter'], 2, 18],
    ['radish', '겨울무', 3, 3, 10, ['winter', 'autumn'], 3, 18],
    ['barley', '보리', 3, 3, 9, ['winter', 'spring'], 2, 30],
  ],
  // 방앗간(풍차)에서 빻는 가루: [id, 이름, 판매가, 설명]
  powders: [['flour', '밀가루', 9, '풍차 방앗간에서 밀을 빻아요 · 파전·호떡 재료'], ['misu', '미숫가루', 16, '풍차 방앗간에서 보리를 빻아요 · 고소한 한 잔']],
  // 요리: [id, 이름, 재료, 용기 회복, 판매가, [효과, 초, 세기], 한마디]
  dishes: [
    ['pajeon', '파전', { leek: 2, flour: 1, egg: 1 }, 12, 52, ['calm', 900, .78], '비 오는 날엔 파전'],
    ['garlicbread', '마늘빵', { bread: 1, garlic: 1 }, 9, 36, ['quiet', 600, .8], '바삭 고소'],
    ['radishsoup', '뭇국', { radish: 1, leek: 1 }, 10, 30, ['calm', 600, .82], '시원한 국물'],
    ['barleytea', '보리차', { barley: 2 }, 5, 26, ['voice', 600, 1.3], '따끈하게 한 잔'],
    ['hotteok', '호떡', { flour: 1, honey: 1 }, 9, 44, ['voice', 900, 1.4], '겨울 간식의 왕'],
  ],
  ing: { leek: ['veg', 2], garlic: ['veg', 2, 'atk'], radish: ['veg', 3, 'calm'], barley: ['grain', 2], flour: ['grain', 3], misu: ['sweet', 3, 'voice'] },
  snack: { leek: ['calm', 180, .95], radish: ['calm', 180, .94], garlic: ['quiet', 180, .93], misu: ['voice', 480, 1.25] },
  week: [['leek', 15, '김장 준비'], ['garlic', 6, '마늘빵 잔치'], ['barley', 12, '보리차 끓이기']],
};
for (const [k, name, days, price, sell, sea, heal, tile] of WCROP_CFG.crops) { SEEDS[k] = { name, days, price, sell, sea };
  ITEMS[k] = Object.assign(ITEMS[k] || {}, { name, type: 'use', tile, heal, sell, desc: `HP ${heal} 회복 · 요리 재료 · ${sea.map(s => SEASON_NAME[s]).join('·')} 작물` });
  ITEMS['seed_' + k] = { name: `${name} 씨앗`, type: 'seed', spr: 'seed', desc: `${sea.map(s => SEASON_NAME[s]).join('·')} · ${days}일`, price, seed: k }; CROP_TILE[k] = tile; }
for (const [k, name, sell, desc] of WCROP_CFG.powders) ITEMS[k] = ITEMS[k] || { name, type: k === 'misu' ? 'use' : 'mat', sell, desc, heal: k === 'misu' ? 6 : undefined, spr: 'wool' };
for (const k in WCROP_CFG.ing) if (ITEMS[k]) ING[k] = WCROP_CFG.ing[k];
for (const k in WCROP_CFG.snack) if (ITEMS[k]) { SNACK[k] = WCROP_CFG.snack[k]; ITEMS[k].desc = `${snackText(k)} · 용기 +${ITEMS[k].heal || 0}${k === 'misu' ? ' · 풍차 방앗간에서 보리를 빻아요' : ' · 요리 재료'}`; }
for (const [id, name, need, heal, sell, sn, say0] of WCROP_CFG.dishes) { if (!Object.keys(need).every(k => ITEMS[k])) continue; SNACK[id] = sn; ITEMS[id] = { name, type: 'use', heal, dish: 1, sell, spr: 'soup', desc: `${snackText(id)} · 용기 +${heal} · ${say0}` }; COOK.push({ out: id, need }); }
if (typeof WEEK_POOL !== 'undefined') for (const w of WCROP_CFG.week) if (ITEMS[w[0]]) WEEK_POOL.push(w);
if (typeof SEASON_TIP !== 'undefined') SEASON_TIP.winter = '대파 · 마늘 · 겨울무 · 보리를 심어요 · 빙어 · 눈꽃나방';
// ---- 밭에 자란 모습 (3D) ----
if (typeof cropModel === 'function') cropModel = (o => c => {
  if (c === 'leek') { const g = new THREE.Group(); for (let i = -1; i <= 1; i++) { g.add(mesh('c', '#f4f1e8', .028, .14, .028, i * .08, .07, (i % 2) * .04), mesh('c', '#4e974c', .024, .26, .024, i * .08, .27, (i % 2) * .04)); for (const s of [-1, 1]) { const l = mesh('co', '#5aa548', .022, .18, .022, i * .08 + s * .035, .46, (i % 2) * .04); l.rotation.z = -s * .45; g.add(l); } } return g; }
  if (c === 'garlic') { const g = grp(mesh('s', '#f4efe2', .1, .085, .1, 0, .07, 0), mesh('s', '#e8dcc8', .05, .08, .05, .06, .07, .04), mesh('s', '#e8dcc8', .05, .08, .05, -.06, .07, -.03)); for (let i = 0; i < 3; i++) { const l = mesh('co', '#5aa548', .022, .26, .022, (i - 1) * .04, .27, 0); l.rotation.z = (1 - i) * .3; g.add(l); } return g; }
  if (c === 'radish') { const g = grp(mesh('c', '#ffffff', .075, .14, .075, 0, .07, 0), mesh('c', '#b9e08a', .078, .04, .078, 0, .13, 0)); for (let i = 0; i < 5; i++) { const a = i * 1.26, l = mesh('s', '#4e974c', .04, .015, .13, Math.cos(a) * .09, .2, Math.sin(a) * .09); l.rotation.y = -a + Math.PI / 2; l.rotation.x = -.5; g.add(l); } return g; }
  if (c === 'barley') { const g = new THREE.Group(); for (let i = 0; i < 7; i++) { const a = i * .9, x = Math.cos(a) * .1, z = Math.sin(a) * .1; g.add(mesh('c', '#b9c46a', .012, .36, .012, x, .18, z), mesh('s', '#d9d08a', .028, .08, .028, x, .4, z), mesh('c', '#e8e0a0', .004, .12, .004, x, .5, z)); } return g; }
  return o(c); })(cropModel);
// ---- 아이콘 (3D) ----
iconModel = (o => id => { const G = grp, m = mesh, plate = () => G(m('c', '#fff8e7', .42, .05, .42, 0, .03, 0));
  switch (id) {
    case 'leek': { const g = new THREE.Group(); for (let i = -1; i <= 1; i++) g.add(m('c', '#f4f1e8', .045, .28, .045, i * .1, .14, 0), m('c', '#4e974c', .04, .4, .04, i * .1, .48, 0), m('co', '#5aa548', .04, .16, .04, i * .1, .76, 0)); g.add(m('tor', '#c94a3b', .16, .16, .1, 0, .26, 0).rotateX(Math.PI / 2)); g.rotation.z = -.35; return g; }
    case 'garlic': return G(m('s', '#f4efe2', .26, .22, .26, 0, .22, 0), m('s', '#e8dcc8', .12, .2, .12, .15, .2, .1), m('s', '#e8dcc8', .12, .2, .12, -.15, .2, -.08), m('s', '#e8dcc8', .12, .2, .12, .02, .2, -.17), m('co', '#d9cdb5', .05, .16, .05, 0, .48, 0), m('s', '#c9a0c9', .08, .03, .02, .1, .22, .22));
    case 'radish': { const g = G(m('c', '#ffffff', .15, .5, .15, 0, .28, 0), m('s', '#ffffff', .15, .12, .15, 0, .04, 0), m('c', '#b9e08a', .155, .1, .155, 0, .5, 0)); for (let i = 0; i < 4; i++) { const l = m('s', '#4e974c', .06, .2, .03, Math.cos(i * 1.6) * .08, .72, Math.sin(i * 1.6) * .08); l.rotation.z = Math.cos(i * 1.6) * -.5; g.add(l); } g.rotation.z = .3; return g; }
    case 'barley': { const g = new THREE.Group(); for (let i = -1; i <= 1; i++) { const s = G(m('c', '#b9c46a', .015, .55, .015, 0, .28, 0), m('s', '#d9d08a', .05, .13, .05, 0, .6, 0), m('c', '#e8e0a0', .006, .2, .006, 0, .78, 0), m('c', '#e8e0a0', .006, .16, .006, .03, .74, 0)); s.position.x = i * .13; s.rotation.z = -i * .2; g.add(s); } return g; }
    case 'flour': return G(m('s', '#f4efe2', .3, .3, .24, 0, .3, 0), m('s', '#e8dcc8', .2, .08, .16, 0, .58, 0), m('tor', '#c9976a', .1, .1, .12, 0, .56, 0).rotateX(Math.PI / 2), m('b', '#e8c87a', .16, .16, .02, 0, .3, .24), m('s', '#ffffff', .1, .03, .08, .22, .04, .16));
    case 'misu': return G(m('c', M('#dff4ff', { transparent: true, opacity: .55, roughness: .1 }), .2, .42, .2, 0, .21, 0), m('c', '#d9b98a', .18, .32, .18, 0, .18, 0), m('c', '#f2e3c4', .18, .03, .18, 0, .35, 0), m('c', '#ff8fb5', .02, .5, .02, .08, .4, 0).rotateZ(-.2));
    case 'pajeon': { const g = plate(); g.add(m('c', '#e8b84a', .36, .05, .36, 0, .08, 0), m('c', '#d99a3a', .3, .052, .3, 0, .081, 0)); for (let i = 0; i < 6; i++) { const s = m('b', '#5aa548', .34, .02, .035, 0, .112, -.2 + i * .08); s.rotation.y = (i % 2 ? .25 : -.2); g.add(s); } g.add(m('s', '#e2543b', .04, .02, .04, .1, .12, .05), m('s', '#fff8e7', .06, .02, .05, -.12, .12, -.08)); return g; }
    case 'garlicbread': { const g = plate(); for (let i = 0; i < 3; i++) { const b = m('b', '#e8b56a', .2, .26, .09, -.18 + i * .18, .2, 0); b.rotation.z = -.25; b.rotation.y = .3; g.add(b, m('b', '#fff0b8', .15, .2, .092, -.18 + i * .18, .2, .002).rotateZ(-.25).rotateY(.3)); } g.add(m('s', '#5aa548', .03, .01, .03, 0, .3, .08)); return g; }
    case 'radishsoup': { const g = G(m('c', '#fff8e7', .4, .18, .4, 0, .1, 0), m('c', '#e8d8c0', .3, .04, .3, 0, .02, 0), m('s', '#f2ead0', .35, .06, .35, 0, .2, 0)); for (let i = 0; i < 4; i++) g.add(m('b', '#ffffff', .1, .05, .1, Math.cos(i * 1.6) * .14, .25, Math.sin(i * 1.6) * .14)); g.add(m('c', '#5aa548', .04, .02, .04, .02, .26, .02), m('c', '#5aa548', .035, .02, .035, -.1, .26, .1)); return g; }
    case 'barleytea': return G(m('c', M('#dff4ff', { transparent: true, opacity: .5, roughness: .1 }), .22, .36, .22, 0, .18, 0), m('c', '#b9782e', .2, .28, .2, 0, .16, 0), m('tor', M('#dff4ff', { transparent: true, opacity: .6 }), .12, .12, .14, .26, .2, 0), m('s', '#ffffff', .06, .08, .06, .04, .46, 0), m('s', '#ffffff', .05, .07, .05, -.05, .56, .02));
    case 'hotteok': { const g = plate(); for (let i = 0; i < 3; i++) g.add(m('c', '#e8a94a', .26, .06, .26, (i - 1) * .06, .09 + i * .065, (i % 2) * .05), m('c', '#c9822e', .16, .062, .16, (i - 1) * .06, .091 + i * .065, (i % 2) * .05)); g.add(m('s', '#8a4a1e', .05, .02, .05, .08, .27, .06)); return g; }
  }
  return o(id); })(iconModel);
