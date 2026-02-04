import './style.css';
import { setupThreeScene } from './three-scene.js';
import gsap from 'gsap';
import { api } from './api.js';
import { MusicPlayer } from './player.js';
import { AuthModal } from './components/AuthModal.js';

const player = new MusicPlayer();
let currentUser = null;
let authToken = localStorage.getItem('token');

const handleLogin = (user, token) => {
  currentUser = user;
  authToken = token;
  localStorage.setItem('token', token);
  updateAuthUI();
};

const updateAuthUI = () => {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');

  if (authToken) {
    loginBtn.textContent = 'Logout';
    loginBtn.onclick = () => {
      localStorage.removeItem('token');
      authToken = null;
      currentUser = null;
      window.location.reload();
    };
    signupBtn.style.display = 'none'; // Or change to 'Profile'
  } else {
    loginBtn.textContent = 'Login';
    loginBtn.onclick = () => authModal.show();
    signupBtn.style.display = 'block';
  }
};

const authModal = new AuthModal(handleLogin);

document.querySelector('#app').innerHTML = `
  <div class="canvas-container" id="bg-canvas"></div>
  <nav class="fixed w-full z-50 p-6 flex justify-between items-center glass-panel bg-opacity-30 backdrop-blur-md border-b border-white/10">
    <h1 class="text-2xl font-bold tracking-tighter hover:text-primary transition-colors cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Mood 2 Music</h1>
    <div class="hidden md:flex gap-6">
        <button id="loginBtn" class="text-gray-300 hover:text-white transition-colors">Login</button>
        <button id="signupBtn" class="bg-primary text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-green-500/20">Get Started</button>
    </div>
  </nav>

  <main class="relative z-10 pt-32 px-6 container mx-auto">
    <section id="hero" class="min-h-[85vh] flex flex-col justify-center items-start max-w-3xl">
      <h2 class="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
        Feel the <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Rhythm</span> of your <span class="text-white">Soul</span>.
      </h2>
      <p class="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
        Select your mood and let our AI-driven engine curate the perfect soundscape for your moment. Experience music in a new dimension.
      </p>
      <button id="startBtn" class="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all shadow-xl shadow-white/10 flex items-center gap-2">
        Discover Music
        <span class="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </section>

    <!-- Mood Section -->
    <section id="mood-section" class="py-20 min-h-screen">
        <div class="text-center mb-16">
            <h3 class="text-5xl font-bold mb-4">How are you feeling?</h3>
            <p class="text-gray-400">Select a mood to generate your playlist</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="mood-grid">
            <!-- Mood Cards injected here -->
        </div>
    </section>

  </main>
`;

// Initialize Three.js Scene
setupThreeScene();

// Mood Data
const moods = [
  { name: 'Happy', color: 'from-yellow-400 to-orange-500', icon: '☀️', desc: 'Upbeat & energetic tunes' },
  { name: 'Melancholy', color: 'from-blue-700 to-purple-900', icon: '🌧️', desc: 'Deep, reflective tracks' },
  { name: 'Chill', color: 'from-green-400 to-teal-500', icon: '🍃', desc: 'Relaxing lo-fi & acoustic' },
  { name: 'Focused', color: 'from-indigo-500 to-blue-500', icon: '🧠', desc: 'Instrumental flow state' },
  { name: 'Energetic', color: 'from-red-500 to-pink-600', icon: '⚡', desc: 'High tempo workout mix' },
  { name: 'Romantic', color: 'from-pink-400 to-rose-500', icon: '💖', desc: 'Soft & dreamy melodies' },
];

const moodGrid = document.getElementById('mood-grid');
const startBtn = document.getElementById('startBtn');
const moodSection = document.getElementById('mood-section');

// Generate Mood Cards
moods.forEach((mood, index) => {
  const card = document.createElement('div');
  card.className = `mood-card relative overflow-hidden rounded-2xl p-1 cusor-pointer group hover:-translate-y-2 transition-transform duration-300`;
  card.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br ${mood.color} opacity-20 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative bg-neutral-900/90 h-full p-8 rounded-xl border border-white/5 backdrop-blur-sm group-hover:bg-transparent transition-colors">
            <div class="text-4xl mb-4 transform group-hover:scale-110 transition-transform">${mood.icon}</div>
            <h4 class="text-2xl font-bold mb-2">${mood.name}</h4>
            <p class="text-gray-400 group-hover:text-white/90 transition-colors">${mood.desc}</p>
        </div>
    `;

  card.addEventListener('click', async () => {
    // Visual feedback
    gsap.to(card, { scale: 0.95, yoyo: true, repeat: 1, duration: 0.1 });

    try {
      const recommendations = await api.getRecommendations(mood.name);
      console.log('Recommendations:', recommendations);
      if (recommendations && recommendations.length > 0) {
        player.loadPlaylist(recommendations);
        player.togglePlay(); // Auto-play
      } else {
        alert('No music found for this mood yet!');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to fetch music.');
    }
  });

  moodGrid.appendChild(card);
});

// Animations on Start
// Animations on Start
startBtn.addEventListener('click', () => {
  // Smooth scroll
  moodSection.scrollIntoView({ behavior: 'smooth' });

  // Optional: Add simple stagger animation if not already visible?
  // Use IntersectionObserver for better scroll reveal in future, 
  // but for now just animate properly.

  gsap.from('.mood-card', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    overwrite: 'auto'
  });
});

// Init Auth UI
document.getElementById('signupBtn').addEventListener('click', () => {
  authModal.isLogin = false;
  authModal.toggleMode();
  authModal.show();
});

document.getElementById('loginBtn').addEventListener('click', () => {
  if (!authToken) authModal.show();
});

// Check if already logged in (optional check to backend if needed)
if (authToken) updateAuthUI();
