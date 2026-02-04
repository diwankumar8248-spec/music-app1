import gsap from 'gsap';

export class AuthModal {
    constructor(onLogin) {
        this.onLogin = onLogin;
        this.createUI();
        this.attachEvents();
    }

    createUI() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'fixed inset-0 bg-black/80 z-[100] hidden flex items-center justify-center backdrop-blur-sm opacity-0';

        this.overlay.innerHTML = `
            <div class="glass-panel p-8 rounded-2xl w-full max-w-md transform scale-95 opacity-0" id="auth-box">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500" id="auth-title">Login</h2>
                    <button class="text-gray-400 hover:text-white" id="close-auth">✕</button>
                </div>
                
                <form id="auth-form" class="space-y-4">
                    <div class="hidden" id="username-field">
                        <label class="block text-sm text-gray-400 mb-1">Username</label>
                        <input type="text" name="username" class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="johndoe">
                    </div>

                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Email</label>
                        <input type="email" name="email" required class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="you@example.com">
                    </div>
                    
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Password</label>
                        <input type="password" name="password" required class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition-colors" placeholder="••••••••">
                    </div>

                    <button type="submit" class="w-full bg-primary text-black font-bold py-3 rounded-full hover:scale-105 transition-transform shadow-lg shadow-green-500/20 mt-2">
                        <span id="submit-text">Login</span>
                    </button>
                </form>

                <p class="mt-4 text-center text-gray-400 text-sm">
                    <span id="switch-text">Don't have an account?</span> 
                    <button id="switch-auth" class="text-white hover:underline ml-1">Sign Up</button>
                </p>
            </div>
        `;

        document.body.appendChild(this.overlay);

        this.authBox = this.overlay.querySelector('#auth-box');
        this.form = this.overlay.querySelector('#auth-form');
        this.usernameField = this.overlay.querySelector('#username-field');
        this.title = this.overlay.querySelector('#auth-title');
        this.submitText = this.overlay.querySelector('#submit-text');
        this.switchText = this.overlay.querySelector('#switch-text');
        this.switchBtn = this.overlay.querySelector('#switch-auth');

        this.isLogin = true;
    }

    attachEvents() {
        this.overlay.querySelector('#close-auth').addEventListener('click', () => this.hide());

        this.switchBtn.addEventListener('click', () => {
            this.isLogin = !this.isLogin;
            this.toggleMode();
        });

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            try {
                const endpoint = this.isLogin ? '/auth/login' : '/auth/register';
                const response = await fetch(`http://localhost:5000/api${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.message);

                this.onLogin(result.user, result.token);
                this.hide();
                alert(`Welcome ${result.user.username}!`);
            } catch (error) {
                alert(error.message);
            }
        });
    }

    toggleMode() {
        const tl = gsap.timeline();

        tl.to(this.authBox, { scale: 0.98, duration: 0.1 })
            .call(() => {
                if (this.isLogin) {
                    this.title.textContent = 'Login';
                    this.submitText.textContent = 'Login';
                    this.switchText.textContent = "Don't have an account?";
                    this.switchBtn.textContent = 'Sign Up';
                    this.usernameField.classList.add('hidden');
                    this.usernameField.querySelector('input').required = false;
                } else {
                    this.title.textContent = 'Create Account';
                    this.submitText.textContent = 'Sign Up';
                    this.switchText.textContent = "Already have an account?";
                    this.switchBtn.textContent = 'Login';
                    this.usernameField.classList.remove('hidden');
                    this.usernameField.querySelector('input').required = true;
                }
            })
            .to(this.authBox, { scale: 1, duration: 0.2 });
    }

    show() {
        this.overlay.classList.remove('hidden');
        gsap.to(this.overlay, { opacity: 1, duration: 0.3 });
        gsap.to(this.authBox, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
    }

    hide() {
        gsap.to(this.authBox, { opacity: 0, scale: 0.95, duration: 0.2 });
        gsap.to(this.overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => this.overlay.classList.add('hidden')
        });
    }
}
