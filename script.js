document.addEventListener("DOMContentLoaded", function () {

  // all the elements from the small player
  const playBtn = document.querySelector(".player_icon3");
  const progressBar = document.querySelector(".progress-bar");
  const currTime = document.querySelector(".curr-time");
  const volumeBar = document.querySelector(".volume-bar");
  const albumImg = document.querySelector(".album-img");
  const albumText = document.querySelector(".album-text");
  const cards = document.querySelectorAll(".card");

  // now playing panel elements
  const nowPlayingPanel = document.getElementById("nowPlayingPanel");
    const closePanel = document.getElementById("closePanel");
    const overlay = document.getElementById("overlay");
  const nowPlayingImg = document.getElementById("nowPlayingImg");
  const nowPlayingTitle = document.getElementById("nowPlayingTitle");
  const nowPlayBtn = document.getElementById("nowPlayBtn");
  const nowProgressBar = document.getElementById("nowProgressBar");
  const nowCurrTime = document.getElementById("nowCurrTime");
  const nowShuffle = document.getElementById("nowShuffle");
   const nowRepeat = document.getElementById("nowRepeat");

  let isPlaying = false;
  let timerInterval = null;
     let totalSeconds = 213;
  let currentSeconds = 0;
   let isShuffleOn = false;
  let isRepeatOn = false;

  // converts seconds to mm:ss
  function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (secs < 10) secs = "0" + secs;
    if (mins < 10) mins = "0" + mins;
    return mins + ":" + secs;
  }

  // updates both progress bars (small player + big panel) together
  function updateBothBars() {
    let percentage = (currentSeconds / totalSeconds) * 100;
    progressBar.value = percentage;
    nowProgressBar.value = percentage;
    currTime.textContent = formatTime(currentSeconds);
    nowCurrTime.textContent = formatTime(currentSeconds);
  }

  function startTimer() {
    timerInterval = setInterval(function () {
    if (currentSeconds >= totalSeconds) {
        clearInterval(timerInterval);
        isPlaying = false;
        currentSeconds = 0;
        updateBothBars();
        playBtn.src = "./assets/player_icon3.png";
        nowPlayBtn.className = "fa-solid fa-circle-play now-play-btn";
        return;
      }
      currentSeconds++;
      updateBothBars();
    }, 1000);
  }

  // this handles play pause for both buttons
  function togglePlay() {
    if (isPlaying) {
    clearInterval(timerInterval);
      isPlaying = false;
      playBtn.src = "./assets/player_icon3.png";
      nowPlayBtn.className = "fa-solid fa-circle-play now-play-btn";
    }else {
      startTimer();
      isPlaying = true;
      playBtn.src = "./assets/pause_icon.png";
      nowPlayBtn.className = "fa-solid fa-circle-pause now-play-btn";
    }
  }

  // small player play button
  playBtn.addEventListener("click", togglePlay);

  // big panel play button
nowPlayBtn.addEventListener("click", togglePlay);

  // small player progress bar drag
  progressBar.addEventListener("input", function () {
    currentSeconds = Math.floor((progressBar.value / 100) * totalSeconds);
    updateBothBars();
  });

  // big panel progress bar drag
  nowProgressBar.addEventListener("input", function () {
     currentSeconds = Math.floor((nowProgressBar.value / 100) * totalSeconds);
    updateBothBars();
  });

  // volume slider
  volumeBar.addEventListener("input", function () {
  if (volumeBar.value == 0) {
      console.log("muted");
    }
  });

  // shuffle toggle
  nowShuffle.addEventListener("click", function () {
     isShuffleOn = !isShuffleOn;
    // toggle green color
    if (isShuffleOn) {
      nowShuffle.classList.add("active");
    } else {
      nowShuffle.classList.remove("active");
    }
  });

  // repeat toggle
 nowRepeat.addEventListener("click", function () {
    isRepeatOn = !isRepeatOn;
    if (isRepeatOn) {
      nowRepeat.classList.add("active");
    } else {
      nowRepeat.classList.remove("active");
    }
  });

  // open the now playing panel
  function openPanel(imgSrc, title) {
     nowPlayingImg.src = imgSrc;
    nowPlayingTitle.textContent = title;
     nowPlayingPanel.classList.add("active");
    overlay.style.display = "block";
  }

  // close the panel
  function closeNowPlaying() {
    nowPlayingPanel.classList.remove("active");
    overlay.style.display = "none";
  }

  // down arrow closes it
   closePanel.addEventListener("click", closeNowPlaying);

  // clicking overlay also closes it
  overlay.addEventListener("click", closeNowPlaying);

  // space bar play pause
   document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    }
    // escape key closes the panel
    if (e.code === "Escape") {
      closeNowPlaying();
    }
  });

  // clicking a card opens the panel and loads that song
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      let cardImg = card.querySelector(".card-img").src;
      let cardTitle = card.querySelector(".card-title").textContent;

      // update small player
      albumImg.src = cardImg;
      albumText.textContent = cardTitle;

      // reset and start playing
      clearInterval(timerInterval);
      currentSeconds = 0;
      updateBothBars();
      isPlaying = true;
      playBtn.src = "./assets/pause_icon.png";
      nowPlayBtn.className = "fa-solid fa-circle-pause now-play-btn";
      startTimer();

      // open the big panel
      openPanel(cardImg, cardTitle);
    });
  });

  // clicking the small album image also opens the panel
  albumImg.addEventListener("click", function () {
    openPanel(albumImg.src, albumText.textContent);
  });

});
