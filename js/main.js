/**
 * NOLLGAMES Official Website V2
 * Main JavaScript - Click-to-Play & Sequential Advance YouTube Player
 */

(() => {
  const config = window.NOLLGAMES_CONFIG || {};
  const games = window.NOLLGAMES_GAMES || [];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);

  // 1. 기본 정보 및 유틸리티
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 모바일 네비게이션 메뉴
  const menu = $("#navMenu");
  const menuBtn = $("#menuBtn");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => menu.classList.toggle("open"));
    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => menu.classList.remove("open"));
    });
  }

  // SNS 및 지원 링크 바인딩
  ["#heroYoutube", "#youtubeButton", "#socialYoutube"].forEach(selector => {
    const el = $(selector);
    if (el) el.href = config.youtubeUrl || "https://www.youtube.com/@NOLLPANG";
  });

  const igEl = $("#socialInstagram");
  if (igEl) igEl.href = config.instagramUrl || "https://www.instagram.com/nollpang/";

  const emailEl = $("#supportEmail");
  if (emailEl) {
    const email = config.email || "admin@nollgames.com";
    emailEl.href = `mailto:${email}`;
    emailEl.textContent = email;
  }

  // 로컬 파일(file://) 프로토콜 감지 시 안내 배너 노출
  const localBanner = $("#localServerBanner");
  if (localBanner && window.location.protocol === "file:") {
    localBanner.style.display = "flex";
  }

  // HTML 이스케이프 유틸리티
  const esc = str =>
    String(str ?? "").replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));

  // 게임 목록 렌더링
  const gamesGrid = $("#gamesGrid");
  if (gamesGrid && games.length > 0) {
    const renderLink = (url, label) =>
      url && url !== "#" ? `<a href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : "";

    gamesGrid.innerHTML = games.map(g => `
      <article class="game-card">
        <div class="game-img-wrap">
          <img src="${esc(g.image)}" alt="${esc(g.title)}" loading="lazy">
        </div>
        <div class="game-body">
          <div class="game-meta">
            ${esc(g.genre)}${g.platforms?.length ? " · " + esc(g.platforms.join(" · ")) : ""}
          </div>
          <h3>${esc(g.title)}</h3>
          <p>${esc(g.description).replace(/\n/g, "<br>")}</p>
          <div class="game-links">
            ${renderLink(g.links?.googlePlay, "Google Play")}
            ${renderLink(g.links?.appStore, "App Store")}
            ${renderLink(g.links?.detail, "자세히 보기")}
          </div>
        </div>
      </article>
    `).join("");
  }

  // =========================================================================
  // 2. 4개 YouTube 영상 플레이 및 순차 전환 엔진
  // =========================================================================

  // 기본 영상 데이터 4개 (NOLLPANG 공식 채널 영상)
  const defaultVideos = [
    {
      id: "gZqAT20TfFg",
      title: "[놀팡] 장애물 제거 미션 - 스킬 올클리어",
      desc: "막힐 땐 스킬 한 방으로 올클리어! 짜릿한 퍼즐 콤보 플레이 영상입니다.",
      tag: "퍼즐 콤보"
    },
    {
      id: "vMRLeX7-Y2U",
      title: "[놀팡] 지정블럭제거 플레이영상",
      desc: "타깃 블록을 전략적으로 제거하며 미션을 클리어하는 두뇌 플레이를 감상해보세요.",
      tag: "블록 제거"
    },
    {
      id: "hWj3mpmAm7M",
      title: "[놀팡] 탈출하기 홍보 영상",
      desc: "긴장감 넘치는 탈출 미션과 다채로운 블록 이펙트를 확인하세요!",
      tag: "탈출 미션"
    },
    {
      id: "QeJgejIkQmg",
      title: "[놀팡] 황금달걀 구출하기",
      desc: "귀여운 황금달걀을 구출하기 위한 특별한 도전 과제 플레이 영상입니다.",
      tag: "도전 과제"
    }
  ];

  // Config에서 영상 목록 가져오기
  let videos = [];
  if (Array.isArray(config.featuredVideos) && config.featuredVideos.length > 0) {
    videos = config.featuredVideos;
  } else if (Array.isArray(config.featuredYoutubeVideoIds) && config.featuredYoutubeVideoIds.length > 0) {
    videos = config.featuredYoutubeVideoIds.map((id, idx) => {
      const matched = defaultVideos.find(dv => dv.id === id);
      return matched || {
        id: id,
        title: `${config.latestVideoTitle || "NOLLGAMES Video"} #${idx + 1}`,
        desc: "새로운 게임 플레이와 소식을 영상으로 확인하세요.",
        tag: `Video 0${idx + 1}`
      };
    });
  } else {
    videos = defaultVideos;
  }

  let currentIndex = 0;
  let isPlaying = false;
  let isMuted = false;

  const iframe = $("#youtubeEmbed");
  const videoCover = $("#videoCover");
  const coverBg = $("#coverBg");
  const coverVideoTitle = $("#coverVideoTitle");
  const coverCounterBadge = $("#coverCounterBadge");
  const floatingNextBtn = $("#floatingNextBtn");
  const currentBadgeEl = $("#currentVideoBadge");
  const playerStatusText = $("#playerStatusText");
  const latestTitleEl = $("#latestTitle");
  const latestDescEl = $("#latestDesc");
  const playlistListEl = $("#playlistList");
  const prevBtn = $("#prevVideoBtn");
  const playPauseBtn = $("#playPauseBtn");
  const playPauseIcon = $("#playPauseIcon");
  const playPauseText = $("#playPauseText");
  const nextBtn = $("#nextVideoBtn");
  const soundBtn = $("#soundToggleBtn");
  const soundIcon = $("#soundIcon");
  const soundText = $("#soundText");
  const progressSegments = $$(".progress-segment");

  // YouTube postMessage 통신 헬퍼
  function sendYouTubeCommand(func, args = []) {
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: func,
            args: args
          }),
          "*"
        );
      } catch (e) {}
    }
  }

  // UI 상태 갱신 함수
  function updateUI(index) {
    const currentVideo = videos[index];
    if (!currentVideo) return;

    // 배지 번호 갱신
    if (currentBadgeEl) {
      currentBadgeEl.textContent = `VIDEO 0${index + 1} / 0${videos.length}`;
    }

    // 제목 및 설명 갱신
    if (latestTitleEl) {
      latestTitleEl.textContent = currentVideo.title;
    }
    if (latestDescEl && currentVideo.desc) {
      latestDescEl.textContent = currentVideo.desc;
    }

    // 커버 썸네일 및 텍스트 갱신
    if (coverBg) {
      coverBg.style.backgroundImage = `url('https://img.youtube.com/vi/${currentVideo.id}/hqdefault.jpg')`;
    }
    if (coverVideoTitle) {
      coverVideoTitle.textContent = currentVideo.title;
    }
    if (coverCounterBadge) {
      coverCounterBadge.textContent = `0${index + 1} / 0${videos.length}`;
    }

    // 하단 세그먼트 프로그레스 바 갱신
    progressSegments.forEach((seg, i) => {
      seg.classList.toggle("active", i === index);
    });

    // 우측 플레이리스트 카드 하이라이트 갱신
    const cards = $$(".playlist-card");
    cards.forEach((card, i) => {
      const isActive = (i === index);
      card.classList.toggle("active", isActive);
      const statusWrap = card.querySelector(".card-status");
      if (statusWrap) {
        if (isActive && isPlaying) {
          statusWrap.innerHTML = `
            <div class="eq-container" title="재생 중">
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
            </div>
          `;
        } else {
          statusWrap.innerHTML = `
            <svg class="play-arrow-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          `;
        }
      }
    });

    // 재생 상태 표시 텍스트 갱신
    if (playerStatusText) {
      playerStatusText.textContent = isPlaying
        ? `재생 중 (0${index + 1}번 영상)`
        : `재생 대기 중 (클릭하여 재생)`;
    }

    // 재생/일시정지 버튼 텍스트 갱신
    if (playPauseIcon && playPauseText) {
      if (isPlaying) {
        playPauseIcon.textContent = "⏸";
        playPauseText.textContent = "일시정지";
      } else {
        playPauseIcon.textContent = "▶";
        playPauseText.textContent = "재생";
      }
    }
  }

  // 영상 재생 시작 함수
  function startPlayback(index = currentIndex) {
    currentIndex = index;
    isPlaying = true;

    // 커버 닫고 플로팅 다음 버튼 노출
    if (videoCover) videoCover.classList.add("hidden");
    if (floatingNextBtn) floatingNextBtn.style.display = "inline-flex";

    const currentVid = videos[currentIndex];
    const muteParam = isMuted ? 1 : 0;

    // iframe 소스 로드 (autoplay=1, 소리 켬)
    if (iframe) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${currentVid.id}?autoplay=1&mute=${muteParam}&enablejsapi=1&rel=0&playsinline=1`;
    }

    updateUI(currentIndex);
  }

  // 영상 일시정지 함수
  function pausePlayback() {
    isPlaying = false;
    sendYouTubeCommand("pauseVideo");
    updateUI(currentIndex);
  }

  // 다음 영상으로 넘어가기 (순차 이동 핵심)
  function playNextVideo() {
    currentIndex = (currentIndex + 1) % videos.length;
    // 다음 영상 시작
    startPlayback(currentIndex);
  }

  // 이전 영상으로 넘어가기
  function playPrevVideo() {
    currentIndex = (currentIndex - 1 + videos.length) % videos.length;
    startPlayback(currentIndex);
  }

  // 사운드 토글
  function toggleSound() {
    isMuted = !isMuted;
    if (isMuted) {
      sendYouTubeCommand("mute");
      if (soundIcon) soundIcon.textContent = "🔇";
      if (soundText) soundText.textContent = "소리 끔";
    } else {
      sendYouTubeCommand("unMute");
      sendYouTubeCommand("setVolume", [100]);
      if (soundIcon) soundIcon.textContent = "🔊";
      if (soundText) soundText.textContent = "소리 켬";
    }
  }

  // 우측 플레이리스트 카드 목록 렌더링
  function renderPlaylist() {
    if (!playlistListEl) return;

    playlistListEl.innerHTML = videos.map((v, i) => `
      <div class="playlist-card ${i === 0 ? "active" : ""}" data-index="${i}" role="button" tabindex="0" aria-label="${esc(v.title)} 재생">
        <div class="card-thumb-wrap">
          <img src="https://img.youtube.com/vi/${esc(v.id)}/mqdefault.jpg" alt="${esc(v.title)}" loading="lazy">
          <span class="card-num-badge">0${i + 1}</span>
        </div>
        <div class="card-info">
          <div class="card-title">${esc(v.title)}</div>
          <div class="card-meta-row">
            <span class="card-tag">${esc(v.tag || `Video 0${i + 1}`)}</span>
            <span>NOLLPANG</span>
          </div>
        </div>
        <div class="card-status">
          ${i === 0 && isPlaying ? `
            <div class="eq-container" title="재생 중">
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
            </div>
          ` : `
            <svg class="play-arrow-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          `}
        </div>
      </div>
    `).join("");

    // 카드 클릭 시 즉시 해당 영상 재생 시작!
    playlistListEl.querySelectorAll(".playlist-card").forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.getAttribute("data-index"), 10);
        startPlayback(idx);
      });
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const idx = parseInt(card.getAttribute("data-index"), 10);
          startPlayback(idx);
        }
      });
    });
  }

  // =========================================================================
  // 3. 사용자 인터랙션 이벤트 바인딩
  // =========================================================================

  // ★ 1) 화면 커버 클릭 시 -> 영상 플레이 시작!
  if (videoCover) {
    videoCover.addEventListener("click", () => {
      startPlayback(currentIndex);
    });
    videoCover.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startPlayback(currentIndex);
      }
    });
  }

  // ★ 2) 재생 중 플로팅 '다음 영상' 버튼 클릭 시 -> 다음 영상으로 넘어가기!
  if (floatingNextBtn) {
    floatingNextBtn.addEventListener("click", e => {
      e.stopPropagation();
      playNextVideo();
    });
  }

  // ★ 3) 하단 [재생/일시정지] 버튼 클릭 시
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (!isPlaying) {
        startPlayback(currentIndex);
      } else {
        pausePlayback();
      }
    });
  }

  // ★ 4) 하단 [다음 영상 ▶] 버튼 클릭 시 -> 다음 영상으로 넘어가기!
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      playNextVideo();
    });
  }

  // ★ 5) 하단 [이전 영상 ◀] 버튼 클릭 시 -> 이전 영상으로 넘어가기!
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      playPrevVideo();
    });
  }

  // ★ 6) 음소거 토글 버튼
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      toggleSound();
    });
  }

  // ★ 7) 프로그레스 세그먼트 클릭 시 해당 영상으로 넘어가기
  progressSegments.forEach(seg => {
    seg.addEventListener("click", () => {
      const idx = parseInt(seg.getAttribute("data-index"), 10);
      startPlayback(idx);
    });
  });

  // =========================================================================
  // 4. YouTube 영상 종료 이벤트 감지 (끝나면 자동으로 다음 영상 재생!)
  // =========================================================================

  window.addEventListener("message", event => {
    if (!event.origin.includes("youtube")) return;

    try {
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (!data) return;

      // 영상 상태 변경 (0: ENDED) 감지 시 자동으로 다음 영상 재생!
      if (data.event === "onStateChange" && data.info === 0) {
        playNextVideo();
      } else if (data.event === "infoDelivery" && data.info && data.info.playerState === 0) {
        playNextVideo();
      }
    } catch (e) {}
  });

  // 초기 렌더링 (커버 및 메타데이터 준비)
  renderPlaylist();
  updateUI(0);
})();