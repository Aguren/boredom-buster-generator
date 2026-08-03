/* ==========================================================================
   HIA MAIN APP INITIALIZER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("HIA Secret Agent Generator // Initialized");

    // Clear clearance key input on load
    const keyInput = document.getElementById('clearance-key');
    if (keyInput) {
        keyInput.value = '';
    }

    // Default focus to Parent Agent ID input
    const agentInput = document.getElementById('agent-id');
    if (agentInput) {
        agentInput.focus();
    }
});