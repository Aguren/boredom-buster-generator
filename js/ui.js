/* ==========================================================================
   MISSION CONTROL UI ENGINE // PRESETS, RANDOMIZER, TOASTS & MODALS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initClueCountToggles();
    initLivePreview();
    initPresets();
    initRandomizers();
    initHeaderModal();
    initCopyCodesBtn();
    autoShowBriefingModal(); // Show briefing modal automatically on load
});

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type} animate-in`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warn') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

window.showToast = showToast;

/**
 * Auto-Open Briefing Modal on Page Load
 */
function autoShowBriefingModal() {
    const modal = document.getElementById('briefing-modal');
    if (modal) {
        setTimeout(() => {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }, 400); // Slight delay for smooth fade-in entry
    }
}

/**
 * 1-Click Preset Templates
 */
function initPresets() {
    const presetButtons = document.querySelectorAll('.btn-preset');
    
    const presets = {
        indoor: [
            'LOOK IN THE FRIDGE',
            'CHECK UNDER YOUR PILLOW',
            'LOOK BEHIND THE MIRROR',
            'CHECK INSIDE THE COUCH',
            'LOOK INSIDE YOUR SHOE'
        ],
        bedtime: [
            'CHECK INSIDE YOUR PJ DRAWER',
            'LOOK BEHIND YOUR BEDLAMP',
            'CHECK NEAR YOUR TOOTHBRUSH',
            'LOOK UNDER YOUR BLANKET',
            'CHECK YOUR NIGHTSTAND'
        ],
        backyard: [
            'LOOK INSIDE THE MAILBOX',
            'CHECK UNDER THE PATIO CHAIR',
            'LOOK BEHIND THE FLOWER POT',
            'CHECK NEAR THE GARDEN HOSE',
            'LOOK UNDER THE BACK DOOR MAT'
        ]
    };

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-preset');
            const list = presets[key];
            if (!list) return;

            if (window.SoundEngine) window.SoundEngine.playKeyClick();

            document.getElementById('clue-1').value = list[0];
            document.getElementById('clue-2').value = list[1];
            document.getElementById('clue-3').value = list[2];
            document.getElementById('clue-4').value = list[3];
            document.getElementById('clue-5').value = list[4];

            if (window.refreshLivePreview) {
                window.refreshLivePreview();
            }

            showToast(`Loaded ${key.toUpperCase()} Preset Clues`, 'success');
        });
    });
}

/**
 * Randomize / Shuffle Clue Button logic
 */
function initRandomizers() {
    const themeCluePools = {
        'theme-spy': [
            'CHECK UNDER THE SOFA CUSHION', 'LOOK IN THE REFRIGERATOR', 'SEARCH BEHIND THE MIRROR',
            'INSPECT INSIDE YOUR SHOE', 'EXAMINE THE MAILBOX', 'LOOK INSIDE THE TOOTHBRUSH CUP'
        ],
        'theme-magic': [
            'SEEK THE ENCHANTED MIRROR', 'SEARCH THE POTION CABINET', 'LOOK INSIDE YOUR SPELL SATCHEL',
            'CHECK BENEATH THE MAGIC BED', 'EXAMINE THE CRYSTAL SHELF', 'SEARCH THE GARDEN FLOWER POT'
        ],
        'theme-royal': [
            'SEEK THE PALACE THRONE', 'CHECK INSIDE THE JEWELRY BOX', 'SEARCH THE ROYAL GARDEN HOSE',
            'LOOK BEHIND THE VELVET DRESSER', 'CHECK UNDER THE CROWN PILLOW', 'EXAMINE THE KINGDOM MAILBOX'
        ],
        'theme-pirate': [
            'SEEK THE LOOKING GLASS MIRROR', 'CHECK THE GALLEY FRIDGE', 'LOOK INSIDE THE CAPTAIN COUCH',
            'SEARCH THE BUCCANEER SHOE', 'CHECK BENEATH THE DECK MAT', 'LOOK INSIDE THE SEA MAILBOX'
        ],
        'theme-galaxy': [
            'SCAN SECTOR REFRIGERATOR', 'CHECK SUB-SPACE PILLOW', 'LOOK BEHIND OPTICAL MIRROR',
            'INSPECT STARSHIP COUCH', 'SCAN FLEET MAILBOX POD', 'CHECK OXYGEN SHOE CHAMBER'
        ]
    };

    const buttons = document.querySelectorAll('.btn-random-clue');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;

            const currentThemeId = window.ThemeManager ? window.ThemeManager.currentThemeId : 'theme-spy';
            const pool = themeCluePools[currentThemeId] || themeCluePools['theme-spy'];

            const randomClue = pool[Math.floor(Math.random() * pool.length)];
            input.value = randomClue;

            if (window.SoundEngine) window.SoundEngine.playKeyClick();
            if (window.refreshLivePreview) window.refreshLivePreview();

            showToast("Shuffled Theme Clue", "info");
        });
    });
}

/**
 * Copy Codes to Clipboard Button
 */
function initCopyCodesBtn() {
    const btn = document.getElementById('btn-copy-code');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const listContainer = document.getElementById('preview-missions-list');
        if (!listContainer) return;

        const boxes = listContainer.querySelectorAll('.preview-mission-box');
        let textOutput = "=== ADVENTURE CODES ===\n";

        boxes.forEach(b => {
            const tag = b.querySelector('.mission-tag')?.textContent || '';
            const enc = b.querySelector('.cipher-text')?.textContent || '';
            textOutput += `${tag}: ${enc}\n`;
        });

        navigator.clipboard.writeText(textOutput).then(() => {
            if (window.SoundEngine) window.SoundEngine.playKeyClick();
            showToast("Copied Encrypted Codes to Clipboard!", "success");
        }).catch(() => {
            showToast("Failed to copy codes", "warn");
        });
    });
}

/**
 * Parent Briefing Modal Logic (Bulletproof Handler)
 */
function initHeaderModal() {
    const btnOpen = document.getElementById('btn-open-briefing');
    const modal = document.getElementById('briefing-modal');
    const btnClose = document.getElementById('btn-close-modal');
    const btnDismiss = document.getElementById('btn-dismiss-modal');

    if (!modal) return;

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        if (window.SoundEngine) window.SoundEngine.playKeyClick();
    }

    function closeModal(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (window.SoundEngine) window.SoundEngine.playKeyClick();
    }

    if (btnOpen) {
        btnOpen.onclick = openModal;
    }

    if (btnClose) {
        btnClose.onclick = closeModal;
    }

    if (btnDismiss) {
        btnDismiss.onclick = closeModal;
    }

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal(e);
        }
    };
}

/**
 * Handles 3, 4, or 5 clue toggle button logic
 */
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

/**
 * Text Scrambler Effect for dynamic cipher feedback
 */
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

/**
 * Listens for user input to keep ALL mission clues updated in real time
 */
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