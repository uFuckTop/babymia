var currentCode  = "";
var correctCode  = "03052023"; // ← cambia con la tua data GGMMAAAA
var audio        = document.getElementById("love-song");
var playBtn      = document.getElementById("play-pause-btn");
var playerWrapper;
var currentSlide = 0;
var slideInterval;
var iconShuffleInterval = null;
var iconShuffleInterval2 = null;

const poetryIcons = ["🌹","❤️","💋","😘","🌷","✨","🌸","🐱","🌺","💞","💐","🌶️","❤️‍🔥"];

$(document).ready(function () {

  playerWrapper = $('.music-player-wrapper');

  // Attiva subito le slide con effetto blur laterale
  updateSlides();

  // ── Apri lucchetto ──
  $('#heart-lock').click(function () {
    $('#safe-modal').fadeIn();
    $('.main-center-container').fadeOut();
  });

  // ── Chiudi lettera (se esiste il bottone) ──
  $('#close-letter').click(function () {
    $('#letter-container').fadeOut();
    clearInterval(slideInterval);
    stopMusic();
    resetSafe();
    $('.main-center-container').fadeIn();
    $('.cadeado').removeClass('fadeOutUp').addClass('pulse');
  });

  // ── Chiudi tutto ──
  $('#close-everything').click(function () {
    stopPoetryIconShuffle();
    stopMusic();
    $('#letter-container').fadeOut(600, function () {
      $('#poetry-section').hide();
      $('#slideshow-section').show();
      clearInterval(slideInterval);
      currentSlide = 0;
      document.querySelectorAll('.slide').forEach(function(s) {
        s.classList.remove('active', 'prev', 'next');
      });
      updateSlides();
      resetSafe();
      $('.main-center-container').fadeIn(600);
      $('.cadeado').removeClass('fadeOutUp').addClass('pulse');
    });
  });

  // ── Vai alla poesia ──
  $('#to-poetry-btn').click(function () {
    clearInterval(slideInterval);
    $('#slideshow-section').fadeOut(500, function () {
      $('#poetry-section').fadeIn(800, function () {
        startPoetryIconShuffle();
      });
    });
  });

  // ── Play / Pause ──
  $('#play-pause-btn').click(function () {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = "❚❚";
      playerWrapper.addClass('playing');
    } else {
      audio.pause();
      playBtn.textContent = "▶";
      playerWrapper.removeClass('playing');
    }
  });

  // ── Supporto tastiera per la cassaforte ──
  $(document).keydown(function (e) {
    if ($('#safe-modal').is(':visible')) {
      var key = e.key;
      if (key >= '0' && key <= '9')              pressKey(key);
      else if (key === 'Backspace' || key === 'Delete') pressKey('C');
      else if (key === 'Enter')                   checkPassword();
    }
  });

  createHearts();
});

// ── Tastierino ────────────────────────────────────────────
function pressKey(key) {
  var screen = $('#screen-text');
  if (key === 'C') {
    currentCode = "";
    screen.text("GG / MM / AAAA");
    return;
  }
  if (screen.text() === "GG / MM / AAAA" || screen.text() === "Ops! No 💔") {
    currentCode = "";
  }
  if (currentCode.length < 8) {
    currentCode += key;
    screen.text(currentCode);
  }
}

// ── Verifica password ─────────────────────────────────────
function checkPassword() {
  var screen = $('#screen-text');
  if (currentCode === correctCode) {
    screen.text("Che bravaaaa! ❤").css("color", "#ff4351");
    setTimeout(function () {
      $('#safe-modal').fadeOut();
      setTimeout(function () {
        $('#letter-container').fadeIn(1000, function () {
          startSlideshow();
        });
        playMusic();
      }, 500);
    }, 1000);
  } else {
    screen.text("Ops! No 💔");
    currentCode = "";
    $('.safe-inner-wrapper').addClass('animate__animated animate__shakeX');
    setTimeout(function () {
      $('.safe-inner-wrapper').removeClass('animate__animated animate__shakeX');
      screen.text("GG / MM / AAAA");
    }, 1200);
  }
}

// ── Reset cassaforte ──────────────────────────────────────
function resetSafe() {
  currentCode = "";
  $('#screen-text').text("GG / MM / AAAA").css("color", "#ff4351");
  $('#safe-modal').hide();
}

// ── Musica ────────────────────────────────────────────────
function playMusic() {
  audio.play().then(function () {
    playBtn.textContent = "❚❚";
    playerWrapper.addClass('playing');
  }).catch(function () {
    console.log("Autoplay bloccato — richiesto clic manuale.");
  });
}

function stopMusic() {
  audio.pause();
  audio.currentTime = 0;
  playBtn.textContent = "▶";
  playerWrapper.removeClass('playing');
}

// ── Slideshow con effetto blur laterale ───────────────────
function updateSlides() {
  var slides = document.querySelectorAll('.slide');
  var total  = slides.length;
  if (total === 0) return;

  slides.forEach(function (s) {
    s.classList.remove('active', 'prev', 'next');
  });

  slides[currentSlide].classList.add('active');

  if (total > 1) {
    var prevIndex = (currentSlide - 1 + total) % total;
    var nextIndex = (currentSlide + 1) % total;
    slides[prevIndex].classList.add('prev');
    slides[nextIndex].classList.add('next');
  }
}

function startSlideshow() {
  var slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;
  currentSlide = 0;
  slides.forEach(function (s) { s.classList.remove('active', 'prev', 'next'); });
  updateSlides();
  clearInterval(slideInterval);
  slideInterval = setInterval(function () {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }, 5000);
}

// ── Cuori fluttuanti ──────────────────────────────────────
function createHearts() {
  setInterval(function () {
    var heart    = $('<div class="floating-heart"></div>');
    var size     = Math.random() * 20 + 10;
    var leftPos  = (Math.random() + Math.random()) / 2 * 100;
    var duration = Math.random() * 5 + 5;
    var opacity  = Math.random() * 0.6 + 0.4;
    var color    = Math.random() > 0.5 ? '#ff4351' : '#ff9a9e';
    heart.css({
      'width':            size + 'px',
      'height':           size + 'px',
      'left':             leftPos + '%',
      'animation-duration': duration + 's',
      'background-color': color,
      'opacity':          opacity,
      'filter':           'blur(' + (Math.random() * 1) + 'px)'
    });
    $('#hearts-container').append(heart);
    setTimeout(function () { heart.remove(); }, duration * 1000);
  }, 350);
}

// ── Icone poesia ──────────────────────────────────────────
function startPoetryIconShuffle() {
  stopPoetryIconShuffle();
  var el  = document.getElementById("poetry-icon");
  var el2 = document.getElementById("poetry-icon-2");
  if (!el) return;
  iconShuffleInterval = setInterval(function () {
    var next = poetryIcons[Math.floor(Math.random() * poetryIcons.length)];
    el.textContent = next;
    if (el2) el2.textContent = poetryIcons[Math.floor(Math.random() * poetryIcons.length)];
  }, 900);
}

function stopPoetryIconShuffle() {
  if (iconShuffleInterval)  clearInterval(iconShuffleInterval);
  if (iconShuffleInterval2) clearInterval(iconShuffleInterval2);
  iconShuffleInterval  = null;
  iconShuffleInterval2 = null;
}
