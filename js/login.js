/* ==========================================================================
   AUTHENTICATION & BOOT TERMINAL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initAuthEngine();
});

function initAuthEngine() {
    const loginForm = document.getElementById('login-form');
    const authScreen = document.getElementById('auth-screen');
    const bootScreen = document.getElementById('boot-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const terminalLogs = document.getElementById('terminal-logs');
    const bootProgress = document.getElementById('boot-progress');
    const displayAgentId = document.getElementById('display-agent-id');

    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const agentIdInput = document.getElementById('agent-id').value.trim() || 'AGENT COMMANDER';
        
        if (window.SoundEngine) {
            window.SoundEngine.playBlip();
        }

        // Update Dashboard Display Name
        if (displayAgentId) {
            displayAgentId.textContent = agentIdInput.toUpperCase();
        }

        // 1. Hide Auth Screen, Show Centered Boot Screen
        authScreen.classList.remove('active');
        authScreen.classList.add('hidden');
        
        bootScreen.classList.remove('hidden');
        bootScreen.classList.add('active');
        bootScreen.style.display = 'flex'; // Centered layout fix

        // 2. Start the Terminal Logs Animation
        runBootSequence(() => {
            // Callback when boot sequence completes:
            // 3. Transition from Boot Screen to Mission Control Dashboard
            setTimeout(() => {
                bootScreen.classList.remove('active');
                bootScreen.classList.add('hidden');
                bootScreen.style.display = 'none';

                dashboardScreen.classList.remove('hidden');
                dashboardScreen.classList.add('active');

                if (window.refreshLivePreview) {
                    window.refreshLivePreview();
                }

                if (window.SoundEngine) {
                    window.SoundEngine.playCompileSound();
                }

                if (window.showToast) {
                    window.showToast("Mission Control Station Online", "success");
                }
            }, 500); // Half-second pause on ACCESS GRANTED before transition
        });
    });

    /**
     * Simulates terminal boot diagnostic logs
     */
    function runBootSequence(onComplete) {
        if (!terminalLogs || !bootProgress) {
            if (onComplete) onComplete();
            return;
        }

        terminalLogs.innerHTML = '';
        bootProgress.style.width = '0%';

        const logs = [
            { text: "INITIALIZING HIA SECURITY PROTOCOLS...", delay: 200, progress: 20 },
            { text: "CONNECTING TO ENCRYPTION ENGINE (AES-256)...", delay: 500, progress: 45 },
            { text: "VERIFYING PARENT CLEARANCE KEY...", delay: 800, progress: 70 },
            { text: "LOADING MULTI-THEME ASSETS & CIPHERS...", delay: 1100, progress: 88 },
            { text: "ACCESS GRANTED // WELCOME AGENT", delay: 1400, progress: 100, isSuccess: true }
        ];

        logs.forEach((log) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = `terminal-line animate-in ${log.isSuccess ? 'success' : ''}`;
                
                if (log.isSuccess) {
                    line.innerHTML = `<span class="check"><i class="fa-solid fa-circle-check"></i></span> <span>${log.text}</span>`;
                } else {
                    line.innerHTML = `<span class="prefix">&gt;</span> <span>${log.text}</span>`;
                }

                terminalLogs.appendChild(line);
                bootProgress.style.width = `${log.progress}%`;

                if (window.SoundEngine) {
                    window.SoundEngine.playKeyClick();
                }

                // Execute complete callback on the final log line
                if (log.isSuccess && onComplete) {
                    onComplete();
                }
            }, log.delay);
        });
    }
}