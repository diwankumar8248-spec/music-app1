import gsap from 'gsap';

export class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;

        this.createUI();
        this.attachEvents();
    }

    createUI() {
        const playerContainer = document.createElement('div');
        playerContainer.id = 'music-player';
        playerContainer.className = 'fixed bottom-0 left-0 w-full glass-panel border-t border-white/10 p-4 transform translate-y-full transition-transform duration-500 z-50 hidden flex flex-col md:flex-row items-center justify-between gap-4';

        playerContainer.innerHTML = `
            <div class="flex items-center gap-4 w-full md:w-1/3">
                <div class="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden relative group">
                    <img id="track-art" src="https://via.placeholder.com/64" alt="Album Art" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                        <span class="text-white text-xs">View</span>
                    </div>
                </div>
                <div>
                    <h4 id="track-title" class="text-white font-bold text-sm truncate max-w-[150px] md:max-w-[200px]">Select a song</h4>
                    <p id="track-artist" class="text-gray-400 text-xs">Unknown Artist</p>
                </div>
            </div>

            <div class="flex flex-col items-center w-full md:w-1/3 gap-2">
                <div class="flex items-center gap-6">
                    <button id="prev-btn" class="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 19V5l-7 7 7 7zm9 0V5l-7 7 7 7z"/></svg>
                    </button>
                    <button id="play-btn" class="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform">
                        <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        <svg id="pause-icon" class="hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>
                    <button id="next-btn" class="text-gray-400 hover:text-white transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 19V5l7 7-7 7zm9 0V5l7 7-7 7z"/></svg>
                    </button>
                </div>
                <div class="w-full flex items-center gap-2 text-xs text-gray-400">
                    <span id="current-time">0:00</span>
                    <div class="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer group" id="progress-container">
                        <div id="progress-bar" class="h-full bg-white rounded-full w-0 group-hover:bg-green-400 transition-colors relative">
                            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                    <span id="duration">0:00</span>
                </div>
            </div>

            <div class="hidden md:flex items-center gap-2 w-1/3 justify-end">
                 <!-- Volume control could go here -->
                 <span class="text-xs text-gray-500">Powered by 3JS & Music API</span>
            </div>
        `;

        document.body.appendChild(playerContainer);

        this.dom = {
            container: playerContainer,
            title: document.getElementById('track-title'),
            artist: document.getElementById('track-artist'),
            art: document.getElementById('track-art'),
            playBtn: document.getElementById('play-btn'),
            playIcon: document.getElementById('play-icon'),
            pauseIcon: document.getElementById('pause-icon'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            progressContainer: document.getElementById('progress-container'),
            progressBar: document.getElementById('progress-bar'),
            currentTime: document.getElementById('current-time'),
            duration: document.getElementById('duration')
        };
    }

    attachEvents() {
        this.dom.playBtn.addEventListener('click', () => this.togglePlay());
        this.dom.prevBtn.addEventListener('click', () => this.prev());
        this.dom.nextBtn.addEventListener('click', () => this.next());

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('loadedmetadata', () => {
            this.dom.duration.textContent = this.formatTime(this.audio.duration);
        });

        this.dom.progressContainer.addEventListener('click', (e) => {
            const width = this.dom.progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = this.audio.duration;
            this.audio.currentTime = (clickX / width) * duration;
        });
    }

    loadPlaylist(tracks) {
        this.playlist = tracks;
        this.currentIndex = 0;
        this.loadTrack(this.currentIndex);
        this.show();
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        const track = this.playlist[index];
        this.dom.title.textContent = track.title;
        this.dom.artist.textContent = track.artist;
        this.dom.art.src = track.art || 'https://via.placeholder.com/64';

        this.audio.src = track.url;
        this.audio.load();

        if (this.isPlaying) {
            this.audio.play();
        }
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
            this.isPlaying = true;
            this.dom.playIcon.classList.add('hidden');
            this.dom.pauseIcon.classList.remove('hidden');
        } else {
            this.audio.pause();
            this.isPlaying = false;
            this.dom.playIcon.classList.remove('hidden');
            this.dom.pauseIcon.classList.add('hidden');
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentIndex);
        if (!this.isPlaying) this.togglePlay();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentIndex);
        if (!this.isPlaying) this.togglePlay();
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.dom.progressBar.style.width = `${progressPercent}%`;
        this.dom.currentTime.textContent = this.formatTime(currentTime);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    show() {
        this.dom.container.classList.remove('hidden');
        gsap.to(this.dom.container, {
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
        });
    }
}
