/* ==========================================================================
   MISSION CONTROL UI ENGINE // LIVE PREVIEW & FORM CONTROLS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Form Inputs
    const juniorAgentNameInput = document.getElementById('junior-agent-name');
    const juniorAgentCodeInput = document.getElementById('junior-agent-code');
    const cipherTypeSelect = document.getElementById('cipher-type');
    const clueCountSelector = document.getElementById('clue-count-selector');
    const clue1Input = document.getElementById('clue-1');

    // Live Preview Elements
    const previewAgentName = document.getElementById('preview-agent-name');
    const previewRawText = document.getElementById('preview-raw-text');
    const previewEncodedText = document.getElementById('preview-encoded-text');

    // Clue Wrapper Fields (Optional 4 & 5)
    const clue4Wrapper = document.getElementById('clue-4-wrapper');
    const clue5Wrapper = document.getElementById('clue-5-wrapper');
    const clue4Input = document.getElementById('clue-4');
    const clue5Input = document.getElementById('clue-5');

    // Initialize UI Event Listeners
    initClueCountToggles();
    initLivePreview();
});

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
            // Remove active status from all toggle buttons
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
        });
    });
}

/**
 * Listens for user input to keep the Live Encryption Preview updated in real time
 */
function initLivePreview() {
    const juniorAgentNameInput = document.getElementById('junior-agent-name');
    const juniorAgentCodeInput = document.getElementById('junior-agent-code');
    const cipherTypeSelect = document.getElementById('cipher-type');
    const clue1Input = document.getElementById('clue-1');

    const previewAgentName = document.getElementById('preview-agent-name');
    const previewRawText = document.getElementById('preview-raw-text');
    const previewEncodedText = document.getElementById('preview-encoded-text');

    function updatePreview() {
        // 1. Update Agent Dossier Badge Name
        const name = juniorAgentNameInput.value.trim() || 'AGENT';
        const code = juniorAgentCodeInput.value.trim() || '007';
        previewAgentName.textContent = `${name.toUpperCase()} ${code}`;

        // 2. Update Raw Clue 1 Text
        const rawMessage = clue1Input.value.trim() || 'LOOK IN THE FRIDGE';
        previewRawText.textContent = rawMessage;

        // 3. Encrypt & Render Mission 1 Output
        const selectedCipher = cipherTypeSelect.value;
        if (window.CipherEngine) {
            const encrypted = window.CipherEngine.encode(rawMessage, selectedCipher);
            previewEncodedText.textContent = encrypted || '---';
        }
    }

    // Attach real-time listeners
    juniorAgentNameInput.addEventListener('input', updatePreview);
    juniorAgentCodeInput.addEventListener('input', updatePreview);
    cipherTypeSelect.addEventListener('change', updatePreview);
    clue1Input.addEventListener('input', updatePreview);

    // Run initial calculation
    updatePreview();
}