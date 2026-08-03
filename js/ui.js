/* ==========================================================================
   MISSION CONTROL UI ENGINE // MULTI-THEME LIVE PREVIEW & TEXT SCRAMBLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initClueCountToggles();
    initLivePreview();
});

function initClueCountToggles() {
    const clueButtons = document.querySelectorAll('#clue-count-selector .btn-toggle');
    const clue4Wrapper = document.getElementById('clue-4-wrapper');
    const clue5Wrapper = document.getElementById('clue-5-wrapper');
    const clue4Input = document.getElementById('clue-4');
    const clue5Input = document.getElementById('clue-5');

    clueButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.SoundEngine) window.SoundEngine.playKeyClick();
            
            clueButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const count = parseInt(btn.getAttribute('data-clues'), 10);

            if (count === 3) {
                clue4Wrapper.classList.add('hidden');
                clue5Wrapper.classList.add('hidden');
                clue4Input.required = false;
                clue5Input.required = false;
            } else if (count === 4) {
                clue4Wrapper.classList.remove('hidden');
                clue5Wrapper.classList.add('hidden');
                clue4Input.required = true;
                clue5Input.required = false;
            } else if (count === 5) {
                clue4Wrapper.classList.remove('hidden');
                clue5Wrapper.classList.remove('hidden');
                clue4Input.required = true;
                clue5Input.required = true;
            }

            if (window.refreshLivePreview) {
                window.refreshLivePreview();
            }
        });
    });
}

function scrambleText(targetElement, finalString) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/★♦▲✚✦✧⚔️⚓';
    let iterations = 0;
    const maxIterations = 8;

    const interval = setInterval(() => {
        targetElement.textContent = finalString
            .split('')
            .map((char, idx) => {
                if (char === ' ' || char === '/') return char;
                if (idx < iterations) return finalString[idx];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        if (iterations >= finalString.length || iterations >= maxIterations) {
            targetElement.textContent = finalString;
            clearInterval(interval);
        }
        iterations++;
    }, 25);
}

function initLivePreview() {
    const juniorAgentNameInput = document.getElementById('junior-agent-name');
    const juniorAgentCodeInput = document.getElementById('junior-agent-code');
    const cipherTypeSelect = document.getElementById('cipher-type');
    const previewAgentName = document.getElementById('preview-agent-name');
    const previewMissionsContainer = document.getElementById('preview-missions-list');

    function updatePreview(isCipherChange = false) {
        const currentTheme = window.ThemeManager ? window.ThemeManager.getCurrentTheme() : {};
        const prefix = currentTheme.cluePrefix || 'Mission';

        const name = juniorAgentNameInput.value.trim() || 'HERO';
        const code = juniorAgentCodeInput.value.trim() || '007';
        previewAgentName.textContent = `${name.toUpperCase()} (${code})`;

        const activeClues = [];
        const clue1 = document.getElementById('clue-1');
        const clue2 = document.getElementById('clue-2');
        const clue3 = document.getElementById('clue-3');
        const clue4 = document.getElementById('clue-4');
        const clue5 = document.getElementById('clue-5');
        const clueFinal = document.getElementById('clue-final');

        if (clue1) activeClues.push({ title: `${prefix.toUpperCase()} 1`, element: clue1, defaultText: 'LOOK IN THE FRIDGE' });
        if (clue2) activeClues.push({ title: `${prefix.toUpperCase()} 2`, element: clue2, defaultText: 'CHECK UNDER YOUR PILLOW' });
        if (clue3) activeClues.push({ title: `${prefix.toUpperCase()} 3`, element: clue3, defaultText: 'LOOK BEHIND THE MIRROR' });

        const clue4Wrapper = document.getElementById('clue-4-wrapper');
        if (clue4Wrapper && !clue4Wrapper.classList.contains('hidden') && clue4) {
            activeClues.push({ title: `${prefix.toUpperCase()} 4`, element: clue4, defaultText: 'CHECK INSIDE THE COUCH' });
        }

        const clue5Wrapper = document.getElementById('clue-5-wrapper');
        if (clue5Wrapper && !clue5Wrapper.classList.contains('hidden') && clue5) {
            activeClues.push({ title: `${prefix.toUpperCase()} 5`, element: clue5, defaultText: 'LOOK INSIDE YOUR SHOE' });
        }

        if (clueFinal) activeClues.push({ title: 'FINAL REWARD', element: clueFinal, defaultText: 'MISSION COMPLETE GREAT JOB' });

        previewMissionsContainer.innerHTML = '';
        const selectedCipher = cipherTypeSelect.value;

        activeClues.forEach(item => {
            const rawMessage = item.element.value.trim() || item.defaultText;
            const encrypted = window.CipherEngine ? window.CipherEngine.encode(rawMessage, selectedCipher) : rawMessage;

            const box = document.createElement('div');
            box.className = 'preview-mission-box';
            
            const cipherDiv = document.createElement('div');
            cipherDiv.className = 'cipher-text';
            
            box.innerHTML = `
                <span class="mission-tag">${item.title}</span>
                <div class="raw-text">${rawMessage}</div>
            `;
            box.appendChild(cipherDiv);

            if (isCipherChange) {
                scrambleText(cipherDiv, encrypted || '---');
            } else {
                cipherDiv.textContent = encrypted || '---';
            }

            previewMissionsContainer.appendChild(box);
        });
    }

    window.refreshLivePreview = updatePreview;

    const allInputs = document.querySelectorAll('.config-panel input');
    allInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            if (window.SoundEngine && e.inputType !== 'deleteContentBackward') {
                window.SoundEngine.playKeyClick();
            }
            updatePreview(false);
        });
    });

    cipherTypeSelect.addEventListener('change', () => {
        if (window.SoundEngine) window.SoundEngine.playBlip();
        updatePreview(true);
    });

    updatePreview(false);
}