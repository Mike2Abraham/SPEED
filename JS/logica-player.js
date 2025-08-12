document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const player = document.querySelector('.bottom-player');
    const audio = new Audio();
    const playPauseBtn = document.getElementById('play-pause');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const previousBtn = document.getElementById('previous');
    const nextBtn = document.getElementById('next');
    const muteBtn = document.getElementById('mute');
    const muteIcon = document.getElementById('mute-icon');
    const volumeSlider = document.getElementById('volume');
    const progressBar = document.getElementById('progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const addMusicBtn = document.getElementById('add-music');
    const toggleFixedBtn = document.getElementById('toggle-fixed');
    const showPlaylistBtn = document.getElementById('show-playlist');
    const playlistModal = document.getElementById('playlist-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const playlist = document.getElementById('playlist');
    const clearPlaylistBtn = document.getElementById('clear-playlist');
    const shufflePlaylistBtn = document.getElementById('shuffle-playlist');
    const fileInput = document.getElementById('file-input');
    const modalHeader = document.getElementById('modal-header');

    // Variables de estado
    let isDragging = false;
    let offsetX, offsetY;
    let isPlaying = false;
    let isMuted = false;
    let isFixed = localStorage.getItem('playerFixed') === 'true';
    let currentVolume = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')) : 0.7;
    let tracks = []; // Siempre comienza vacío
    let currentTrackIndex = 0;

    // Inicialización
    function init() {
        audio.volume = currentVolume;
        volumeSlider.value = currentVolume * 100;
        
        if (isFixed) {
            player.classList.add('fixed');
            toggleFixedBtn.querySelector('img').src = './js/pin.png';
        }
        
        // Resetear la UI
        resetPlayerUI();
    }

    // Cargar una canción
    function loadTrack(index) {
        if (tracks.length === 0 || index >= tracks.length) {
            resetPlayerUI();
            return;
        }
        
        const track = tracks[index];
        audio.src = track.url;
        trackTitle.textContent = track.title || 'Título desconocido';
        trackArtist.textContent = track.artist || 'Artista desconocido';
        
        updatePlaylistUI();
        
        if (isPlaying) {
            audio.play().catch(e => {
                console.error("Error al reproducir:", e);
                isPlaying = false;
                playPauseIcon.src = './js/play.png';
            });
        }
    }

    // Reproducir/pausar
    function togglePlay() {
        if (tracks.length === 0) return;
        
        if (isPlaying) {
            audio.pause();
            playPauseIcon.src = './js/play.png';
        } else {
            audio.play();
            playPauseIcon.src = './js/pause.png';
        }
        isPlaying = !isPlaying;
    }

    // Siguiente canción
    function nextTrack() {
        if (tracks.length === 0) return;
        
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
    }

    // Canción anterior
    function prevTrack() {
        if (tracks.length === 0) return;
        
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audio.play();
    }

    // Alternar silencio
    function toggleMute() {
        isMuted = !isMuted;
        audio.muted = isMuted;
        muteIcon.src = isMuted ? './js/m-muted.png' : './js/M.png';
    }

    // Actualizar tiempo de reproducción
    function updateProgress() {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        document.getElementById('progress-water').style.width = `${progressPercent}%`;
        
        // Formatear tiempo
        currentTimeEl.textContent = formatTime(currentTime) + ' -';
        durationEl.textContent = formatTime(duration);
    }

    // Formatear tiempo (mm:ss)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Establecer progreso al hacer clic
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Alternar posición fija
    function toggleFixedPosition() {
        isFixed = !isFixed;
        player.classList.toggle('fixed');
        localStorage.setItem('playerFixed', isFixed);
        
        // Cambiar icono
        toggleFixedBtn.querySelector('img').src = isFixed ? './js/pin.png' : './js/pin.png';
    }

    // Mostrar/ocultar lista de reproducción
    function togglePlaylistModal() {
        playlistModal.classList.toggle('show');
        
        // Bloquear scroll de fondo cuando el modal está abierto
       // document.body.style.overflow = playlistModal.classList.contains('show') ? 'hidden' : '';
    }


    //Resetear la UI del reproductor
    function resetPlayerUI() {
        audio.src = '';
        trackTitle.textContent = 'EMPEZEMOS CON ROCK!!🎵';
        trackArtist.textContent = 'HAZ SONAR ESOS PARLANTES 🔊';
        currentTimeEl.textContent = '0:00 -';
        durationEl.textContent = '0:00';
        progressBar.style.width = '0%';
        document.getElementById('progress-water').style.width = '0%';
        isPlaying = false;
        playPauseIcon.src = './js/play.png';
    }

    // Actualizar la UI de la lista de reproducción
    function updatePlaylistUI() {
        playlist.innerHTML = '';
        
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${track.title || 'Canción ' + (index + 1)} - ${track.artist || 'Desconocido'}`;
            li.className = index === currentTrackIndex && isPlaying ? 'playing' : '';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-track';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteTrack(index);
            };
            
            li.appendChild(deleteBtn);
            li.onclick = () => playTrackFromList(index);
            playlist.appendChild(li);
        });
    }

    // Reproducir canción desde la lista
    function playTrackFromList(index) {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        if (!isPlaying) {
            togglePlay();
        } else {
            audio.play();
        }
    }

    // Eliminar canción de la lista
    function deleteTrack(index) {
        tracks.splice(index, 1);
        localStorage.setItem('tracks', JSON.stringify(tracks));
        
        if (currentTrackIndex >= tracks.length) {
            currentTrackIndex = Math.max(0, tracks.length - 1);
        }
        
        if (tracks.length === 0) {
            audio.src = '';
            trackTitle.textContent = 'EMPEZEMOS CON ROCK!!🎵';
            trackArtist.textContent = 'HAZ SONAR ESOS PARLANTES 🔊';
            currentTimeEl.textContent = '0:00 -';
            durationEl.textContent = '0:00';
            progressBar.style.width = '0%';
            document.getElementById('progress-water').style.width = '0%';
            isPlaying = false;
            playPauseIcon.src = './js/play.png';
        } else {
            loadTrack(currentTrackIndex);
        }
        
        updatePlaylistUI();
    }

    // Limpiar lista de reproducción
    function clearPlaylist() {
        // Revocar todas las URLs blob para liberar memoria
        tracks.forEach(track => {
            if (track.url.startsWith('blob:')) {
                URL.revokeObjectURL(track.url);
            }
        });
        
        tracks = [];
        currentTrackIndex = 0;
        resetPlayerUI();
    }

    // Mezclar lista de reproducción
    function shufflePlaylist() {
        for (let i = tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
        }
        localStorage.setItem('tracks', JSON.stringify(tracks));
        currentTrackIndex = 0;
        loadTrack(currentTrackIndex);
        updatePlaylistUI();
    }

    // Agregar archivos de música
    function addMusicFiles() {
        fileInput.click();
    }

    // Manejar archivos seleccionados
    function handleFiles(e) {
        const files = Array.from(e.target.files);
        const newTracks = [];
        
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file);
                newTracks.push({
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: 'Desconocido',
                    url: url,
                    file: file // Guardamos la referencia al archivo
                });
            }
        });
        
        if (newTracks.length > 0) {
            tracks = newTracks; // Reemplazamos la lista completa
            currentTrackIndex = 0;
            loadTrack(currentTrackIndex);
            updatePlaylistUI();
        }
        
        e.target.value = '';
    }

    // Hacer el modal arrastrable
    function makeModalDraggable() {
        modalHeader.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', dragModal);
        document.addEventListener('mouseup', stopDrag);
    }

    function startDrag(e) {
        if (e.target === modalHeader || e.target.closest('.modal-header')) {
            isDragging = true;
            const rect = playlistModal.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            playlistModal.style.cursor = 'grabbing';
        }
    }

    function dragModal(e) {
        if (!isDragging) return;
        
        playlistModal.style.left = `${e.clientX - offsetX}px`;
        playlistModal.style.top = `${e.clientY - offsetY}px`;
        playlistModal.style.transform = 'none';
    }

    function stopDrag() {
        isDragging = false;
        playlistModal.style.cursor = 'grab';
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlay);
    previousBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
        localStorage.setItem('volume', audio.volume);
    });
    progressContainer.addEventListener('click', setProgress);
    toggleFixedBtn.addEventListener('click', toggleFixedPosition);
    showPlaylistBtn.addEventListener('click', togglePlaylistModal);
    closeModalBtn.addEventListener('click', togglePlaylistModal);
    clearPlaylistBtn.addEventListener('click', clearPlaylist);
    shufflePlaylistBtn.addEventListener('click', shufflePlaylist);
    addMusicBtn.addEventListener('click', addMusicFiles);
    fileInput.addEventListener('change', handleFiles);

    // Eventos del audio
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('loadedmetadata', updateProgress);

    // Hacer modal arrastrable
    makeModalDraggable();

    // Cerrar modal al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (playlistModal.style.display === 'block' && 
            !playlistModal.contains(e.target) && 
            e.target !== showPlaylistBtn) {
            playlistModal.style.display = 'none';
        }
    });

    // Inicializar
    init();

    // Limpiar las URLs blob al salir de la página
    window.addEventListener('beforeunload', () => {
        tracks.forEach(track => {
            if (track.url.startsWith('blob:')) {
                URL.revokeObjectURL(track.url);
            }
        });
    });
});