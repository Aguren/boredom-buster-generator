/* ==========================================================================
   SAAS POLISH // PRESETS, TOASTS & MODALS
   ========================================================================== */

/* Toast Container */
.toast-container {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    pointer-events: none;
}

.toast-item {
    background: rgba(18, 24, 36, 0.95);
    border: 1px solid var(--accent-cyan);
    color: var(--text-main);
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
    pointer-events: auto;
}

.toast-item.success {
    border-color: #00ff66;
    color: #e0ffe6;
}

/* Preset Bar */
.preset-bar-wrapper {
    margin-bottom: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.preset-bar-wrapper label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--accent-cyan);
    font-weight: 600;
}

.preset-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-preset {
    padding: 0.45rem 0.85rem;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--panel-border);
    color: var(--text-main);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-family: var(--font-sans);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn-preset:hover {
    border-color: var(--accent-cyan);
    background: rgba(0, 240, 255, 0.1);
}

/* Randomizer Shuffle Buttons */
.label-with-tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-random-clue {
    background: none;
    border: none;
    color: var(--accent-cyan);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    opacity: 0.85;
    transition: opacity var(--transition-fast);
}

.btn-random-clue:hover {
    opacity: 1;
}

/* Checkbox Options Row */
.pdf-options-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    cursor: pointer;
}

.checkbox-label input {
    accent-color: var(--accent-cyan);
}

/* Header Tools & Modal */
.header-right-tools {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.btn-header-tool {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--panel-border);
    color: var(--accent-cyan);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.preview-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.btn-secondary-sm {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--panel-border);
    color: var(--text-main);
    padding: 0.35rem 0.65rem;
    font-size: 0.7rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-family: var(--font-mono);
}

/* Parent Briefing Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-card {
    width: 100%;
    max-width: 650px;
    padding: 2rem;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.btn-close-modal {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
}

.step-guide {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.step-card {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--panel-border);
}

.step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--accent-cyan);
    color: #000;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
}

.step-card h4 {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
}

.step-card p {
    font-size: 0.75rem;
    color: var(--text-muted);
}