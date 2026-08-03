/* ==========================================================================
   AUTHENTICATION & TERMINAL BOOT SEQUENCE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const agentInput = document.getElementById('agent-id');
    const displayAgentId = document.getElementById('display-agent-id');
    
    const authScreen = document.getElementById('auth-screen');
    const bootScreen = document.getElementById('boot-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    
    const terminalLogs = document.getElementById('terminal-logs');
    const bootProgress = document.getElementById('boot-progress');

    // Boot terminal sequence messages
    const bootSequenceSteps = [
        { text: "SECURE CONNECTION ESTABLISHED", delay: 300 },
        { text: "Verifying Parent Clearance Credentials...", delay: 700 },
        { text: "Loading Agent Database & Cipher Engines", delay: 1100 },
        { text: "Decrypting Classified Mission Archives", delay: 1500 },
        { text: "Establishing HIA Headquarters Link", delay: 1900 },
        { text: "ACCESS GRANTED // WELCOME AGENT", delay: 2300, isSuccess: true }
    ];

    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Capture Parent Agent Codename
        const agentName = agentInput.value.trim() || 'AGENT PARENT';
        if (displayAgentId) {
            displayAgentId.textContent = agentName.toUpperCase();
        }

        // 2. Transition from Auth Card to Boot Terminal
        authScreen.classList.remove('active');
        authScreen.classList.add('hidden');
        bootScreen.classList.remove('hidden');
        bootScreen.classList.add('active');

        // 3. Trigger Boot Sequence Animation
        runBootSequence();
    });

    function runBootSequence() {
        terminalLogs.innerHTML = '';
        bootProgress.style.width = '0%';

        const totalSteps = bootSequenceSteps.length;

        bootSequenceSteps.forEach((step, index) => {
            setTimeout(() => {
                // Play audio blip for each line
                if (window.SoundEngine) window.SoundEngine.playBlip();

                const line = document.createElement('div');
                line.className = `terminal-line animate-in ${step.isSuccess ? 'success' : ''}`;
                
                if (step.isSuccess) {
                    line.innerHTML = `<span class="prefix">❯</span> <span>${step.text}</span>`;
                } else {
                    line.innerHTML = `<i class="fa-solid fa-check check"></i> <span>${step.text}</span>`;
                }

                terminalLogs.appendChild(line);

                // Update progress bar percentage
                const progressPct = Math.round(((index + 1) / totalSteps) * 100);
                bootProgress.style.width = `${progressPct}%`;

                // Final transition to Dashboard when sequence finishes
                if (index === totalSteps - 1) {
                    if (window.SoundEngine) window.SoundEngine.playAccessGranted();

                    setTimeout(() => {
                        bootScreen.classList.remove('active');
                        bootScreen.classList.add('hidden');
                        dashboardScreen.classList.remove('hidden');
                        dashboardScreen.classList.add('active');
                    }, 800);
                }
            }, step.delay);
        });
    }
});