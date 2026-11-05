window.NOLLGAMES_GAMES = [
  {
    id: "nollpang",
    title: "NOLLPANG",
    genre: "Casual Puzzle Game",
    platforms: ["Android", "iOS"],
    image: "./templates/instagram/nollpang_post-1080x1350.png",
    description: "모으고, 터뜨리고, 도전하라!\n매일 즐거움이 팡팡 터지는 퍼즐, 놀팡!",
    links: {
      // Real Play package of the shipped app (ProjectSettings applicationIdentifier).
      googlePlay: "https://play.google.com/store/apps/details?id=com.ewenter.EggWingCrushX",
      appStore: "#",
      detail: "#latest",
      // The game app opens pages under nollpang/ directly (AppConst.LegalPagesBaseUrl); keep those file names stable.
      legal: "./nollpang/legal.html"
    }
  },
  {
    id: "metarace2",
    title: "MetaRace v2",
    genre: "Casual Racing Game",
    // iOS service is paused; add "iOS" and links.appStore again when it resumes.
    platforms: ["Android"],
    image: "./images/games/metarace2-keyart-1200x675.jpg",
    description: "달리고, 쏘고, 점프하라!\n아이템으로 역전하는 캐주얼 레이싱, 메타레이스 v2!",
    links: {
      googlePlay: "https://play.google.com/store/apps/details?id=com.ewenter.MetaRace2",
      // The game app opens pages under metarace2/ directly; keep those file names stable.
      legal: "./metarace2/legal.html"
    }
  }
];