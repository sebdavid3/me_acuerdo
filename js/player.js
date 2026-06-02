// ♫ Reproductor de música — Me acuerdo
(function() {
  'use strict';

  const playlist = [
    { name: 'Theme of Love',       file: 'Final Fantasy IV DS- Theme of Love.mp3',                              game: 'Final Fantasy IV' },
    { name: 'Dearly Beloved',      file: 'Kingdom Hearts Dearly Beloved (Original Version).mp3',                game: 'Kingdom Hearts' },
    { name: 'Love Theme',          file: 'MOTHER 3 Love Theme - MOTHER 3 OST.mp3',                              game: 'Mother 3' },
    { name: "Zelda's Theme",       file: "Zelda's Theme - The Legend of Zelda_ Ocarina of Time OST.mp3",        game: 'Ocarina of Time' },
  ];

  const audio      = document.getElementById('playerAudio');
  const playBtn    = document.getElementById('playBtn');
  const playBtnImg = document.getElementById('playBtnImg');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');
  const trackName  = document.getElementById('trackName');
  const trackGame  = document.getElementById('trackGame');
  const listEl     = document.getElementById('playlistItems');
  const marquee    = document.getElementById('playerMarquee');

  let currentIndex = 0;
  let isPlaying = false;

  /* ---------- helpers ---------- */
  function loadTrack(index) {
    currentIndex = (index + playlist.length) % playlist.length;
    const t = playlist[currentIndex];
    audio.src = 'assets/audio/' + encodeURIComponent(t.file);
    audio.load();
    trackName.textContent = t.name;
    trackGame.textContent = t.game;
    marquee.textContent = '♫ Now Playing: ' + t.name + ' — ' + t.game;
    highlightActive();
  }

  function play() {
    audio.play().then(() => {
      isPlaying = true;
      playBtnImg.src = 'assets/buttons/Pixel Buttons/Pause_Idle.png';
      playBtn.title = 'Pausar';
    }).catch(() => { /* browser bloqueó autoplay */ });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    playBtnImg.src = 'assets/buttons/Pixel Buttons/Play_Idle.png';
    playBtn.title = 'Reproducir';
  }

  function togglePlay() {
    audio.paused ? play() : pause();
  }

  function next() {
    loadTrack(currentIndex + 1);
    if (isPlaying) play();
  }

  function prev() {
    loadTrack(currentIndex - 1);
    if (isPlaying) play();
  }

  function highlightActive() {
    const items = listEl.querySelectorAll('.player-playlist-item');
    items.forEach((el, i) => el.classList.toggle('active', i === currentIndex));
  }

  /* ---------- build playlist UI ---------- */
  playlist.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'player-playlist-item';
    li.innerHTML = '<span class="player-playlist-name">' + t.name + '</span>' +
                   '<span class="player-playlist-game">' + t.game + '</span>';
    li.addEventListener('click', function() {
      const wasPlaying = isPlaying;
      loadTrack(i);
      if (wasPlaying) play();
    });
    listEl.appendChild(li);
  });

  /* ---------- events ---------- */
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  audio.addEventListener('ended', next);

  /* ---------- init ---------- */
  loadTrack(0);

  /* arrancar en la primera interacción (posterga autoplay) */
  let started = false;
  document.addEventListener('click', function firstClick() {
    if (!started) {
      started = true;
      // si el botón de play no se clickeó directamente, arrancamos igual
      if (audio.paused) play();
    }
  }, { once: true });

})();
