# base.html 안에서 딱 한 군데씩만 바꾸는 글자 패치 (이전, 이후)
PATCHES = [
    # --- 달력(cal.js): 화면 글자를 게임 달력 기준으로 ---
    ("const TIME_NAME = { auto: '실제 시간',", "const TIME_NAME = { auto: '게임 시계',"),
    ("const SEASON_NAME = { auto: '실제 계절',", "const SEASON_NAME = { auto: '게임 달력',"),
    ("desc: '실제 시간을 따라 낮과 밤이 바뀌어요'", "desc: '게임 시계를 따라 낮과 밤이 바뀌어요 (현실 1시간 = 하루)'"),
    ("desc: '실제 달력을 따라 봄·여름·가을·겨울'", "desc: '게임 달력을 따라 봄·여름·가을·겨울 (한 계절 = 7일)'"),
    ("`${gameDayNo()}일째 (${wd})`", "`${typeof calStr === 'function' ? calStr() : gameDayNo() + '일째'} (${wd})`"),
    ("name: `${+s.slice(4, 6)}월 ${+s.slice(6)}일${k == dayKey() ? ' (오늘)' : ''}`", "name: `${typeof dayLabel === 'function' ? dayLabel(k) : s}${k == dayKey() ? ' (오늘)' : ''}`"),
    ("'5일장 · 일요일 축제 · 친구 생일 · 기념일 같은 소식을 <b>하루에 한 번</b>", "'닭이 알을 낳았어요 · 작물이 자랐어요 같은 마을 소식을 <b>하루에 한 번</b>"),
    ("desc: '5일장 · 축제 · 생일을 하루 한 번 알려줘요'", "desc: '마을 소식을 하루 한 번 알려줘요'"),
    ("desc: `${m.from} · ${String(m.day).slice(4, 6)}/${String(m.day).slice(6)}${m.gift", "desc: `${m.from} · ${typeof dayLabel === 'function' ? dayLabel(m.day) : m.day}${m.gift"),
    # --- 큰 지도: 없어진 마을의 나룻배·케이블카 표시 지우기 ---
    ("  mark('🛶', '나룻배', WVP.home.x / T, WVP.home.y / T + 1, wvUnlocked()); if (CVP.home) mark('🚡', '케이블카', CVP.home.x / T, CVP.home.y / T, cvUnlocked());\n", "\n"),
    (" 닫혀요 · ●노랑 나 · ●분홍 부탁 · 🛶🚡 다른 마을'", " 닫혀요 · ●노랑 나 · ●분홍 부탁'"),
    # --- v62: 설원 전용 차가운 색 보정 (화면 후처리에 cool 값 추가 · 평소엔 0이라 다른 곳은 그대로) ---
    ("night: { value: 0 }, bloom: { value: 1 } },", "night: { value: 0 }, bloom: { value: 1 }, cool: { value: 0 } },"),
    ("uniform float bloom; varying vec2 vUv;", "uniform float bloom; uniform float cool; varying vec2 vUv;"),
    ("gl * vec3(1.0, .9, .72) * .55 * bloom", "gl * mix(vec3(1.0, .9, .72), vec3(.8, .92, 1.0), cool) * .55 * bloom"),
    ("c.rgb *= mix(vec3(1.03, 1.0, .95), vec3(1.0), bgm);", "c.rgb *= mix(mix(vec3(1.03, 1.0, .95), vec3(1.0), bgm), vec3(.98, 1.0, 1.04), cool);"),
    ("hiT = mix(vec3(1.04, 1.0, .9), vec3(1.1, .96, .78), warm);", "hiT = mix(mix(vec3(1.04, 1.0, .9), vec3(1.1, .96, .78), warm), vec3(.95, 1.0, 1.1), cool);"),
    # --- v62: 소동 중에는 노란 안내 말풍선을 공룡 티 게이지 아래로 (게이지에 가려 안 보이던 것) ---
    ("uiPanel(CW / 2 - w / 2, ty, w, U2 * 2, U2, 'rgba(255,210,63,.97)'); text(toastMsg, CW / 2, ty + U2, U2 * 1.0, UIC.ink, 'center');", "const tyE = typeof EP !== 'undefined' && EP && DG.on && !(typeof EP1 !== 'undefined' && EP.def === EP1 && EP.step === 4) ? Math.max(ty, CH * (CW < CH ? .155 : .12) + Math.max(11 * DPR, Math.min(CW, CH) / 32) * TXS() * 2.3 + 6 * DPR) : ty; uiPanel(CW / 2 - w / 2, tyE, w, U2 * 2, U2, 'rgba(255,210,63,.97)'); text(toastMsg, CW / 2, tyE + U2, U2 * 1.0, UIC.ink, 'center');"),
]
