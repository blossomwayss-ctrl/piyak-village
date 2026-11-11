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
]
