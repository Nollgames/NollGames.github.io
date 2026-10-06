# NOLLGAMES SNS + Website V2 운영 가이드

## 1. 권장 계정명 규칙

가능하면 모든 플랫폼에서 동일한 핸들을 사용합니다.

- 회사명: `NOLLGAMES`
- 1순위 핸들: `@nollgames`
- 사용 중이면: `@nollgames_official`
- 게임별 계정은 초기에 만들지 않고 회사 공식 계정으로 통합 운영
- 프로필명 표기: `NOLLGAMES | Mobile Games`

소개 문구 예시:

> Casual mobile games made for quick fun.  
> New games, gameplay, VFX & updates.  
> Play. Pop. Blast. Have Fun.

링크는 공식 웹사이트를 가장 먼저 배치합니다.

---

## 2. YouTube 개설 규칙

채널명: `NOLLGAMES`

권장 구성:
- 프로필: NOLLGAMES 심볼/로고
- 배너: 회사 로고 + 짧은 슬로건
- 설명: 회사 소개 2~3줄 + 공식 웹사이트
- 링크: Website / Instagram / Google Play 또는 App Store
- 홈 섹션: Shorts / Gameplay / Updates

콘텐츠 카테고리:
1. 10~25초 Shorts — 콤보, 폭발, 특수블록, 보스
2. 30~90초 Gameplay — 핵심 플레이
3. Update — 신규 캐릭터, 스테이지, 기능
4. Trailer — 출시/대형 업데이트

파일:
- `templates/youtube/profile-1024.png`
- `templates/youtube/banner-2560x1440.png`
- `templates/youtube/banner-2560x1440-guide.png`
- `templates/youtube/thumbnail-3840x2160.png`

공식 YouTube 도움말 기준:
- 배너 권장: 2560×1440
- 배너 최소 업로드: 2048×1152 / 16:9
- 최소 크기 기준 텍스트·로고 안전영역: 1235×338
- 커스텀 썸네일: 현재 도움말은 3840×2160을 권장하며 최소 폭 640px

---

## 3. Instagram 개설 규칙

프로필명: `NOLLGAMES | Mobile Games`

핸들:
- `@nollgames`
- 대체: `@nollgames_official`

Bio 예시:

🎮 Casual Mobile Games  
✨ Gameplay · Characters · VFX  
🚀 New games & updates  
👇 Play & Learn More

웹사이트 링크를 Bio 링크에 연결합니다.

콘텐츠:
- Reels: 9:16 세로 플레이 영상
- Feed: 캐릭터 / 게임 소개 / 업데이트 카드
- Carousel: 게임 기능, 업데이트 상세
- Story: 개발 중 미리보기, 출시 카운트다운

파일:
- `templates/instagram/profile-1024.png`
- `templates/instagram/post-1080x1350.png`
- `templates/instagram/reel-cover-1080x1920.png`

Instagram 공식 도움말 기준:
- 사진은 폭 1080px 이상 권장
- 지원되는 사진 비율은 1.91:1~3:4
- Reels는 1.91:1~9:16을 지원
- Reels는 최소 30 FPS 및 최소 해상도 기준이 있음
- Reels 커버 도움말 권장치는 420×654

---

## 4. 주간 게시 루틴 — 심플 버전

주 3회면 충분합니다.

- 월/화: 10~20초 Gameplay/Reel/Shorts
- 목: 캐릭터 또는 게임 기능 이미지
- 토: 강한 콤보/VFX 또는 다음 업데이트 티저

같은 원본 영상을 YouTube Shorts와 Instagram Reels에 동시에 활용합니다.

---

## 5. 게시물 템플릿

### 게임 플레이

제목:
`NEW COMBO! ⚡`

본문:
`한 번에 터뜨리는 강력한 콤보!`
`새로운 플레이 영상을 확인해보세요.`

CTA:
`▶ Full gameplay / Link in bio`

### 신규 게임

제목:
`NEW GAME FROM NOLLGAMES`

본문:
`새로운 캐주얼 모바일 게임을 준비하고 있습니다.`
`Gameplay coming soon!`

CTA:
`Follow @nollgames`

### 업데이트

제목:
`NEW UPDATE`

본문:
`새로운 스테이지와 기능이 추가되었습니다.`
`지금 플레이해보세요!`

---

## 6. 웹사이트 연계

`js/site-config.js`에서 아래만 수정합니다.

- YouTube URL
- Instagram URL
- 대표 YouTube 영상 ID
- 문의 이메일

또는 `/site-editor.html`을 열어 입력하고 `site-config.js`를 다운로드한 뒤 파일을 교체합니다.

게임은 `js/games.js`에 객체 한 개를 추가하면 홈페이지 카드가 자동 생성됩니다.

---

## 7. GitHub Pages 배포

현재 GitHub Pages 저장소 루트에 V2 패키지 파일을 업로드합니다.

주요 파일:
- `index.html`
- `css/style.css`
- `js/site-config.js`
- `js/games.js`
- `js/main.js`
- `images/`
- `templates/`
- `site-editor.html`

Push 후 GitHub Pages가 새 버전을 배포합니다.

---

## 8. 추천 SNS → 웹 → 스토어 흐름

Instagram Reel / YouTube Short  
→ 프로필 또는 영상 설명의 웹사이트 링크  
→ NOLLGAMES 게임 카드  
→ Google Play / App Store

게임별 캠페인을 분석하려면 나중에 UTM 파라미터와 Analytics를 추가합니다.

---

## 9. 공식 참고 링크

YouTube:
- https://support.google.com/youtube/answer/12950272
- https://support.google.com/youtube/answer/10456525
- https://support.google.com/youtube/answer/72431

Instagram:
- https://help.instagram.com/1631821640426723/
- https://help.instagram.com/1038071743007909/
