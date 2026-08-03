/* ==========================================================================
   HIA ENCRYPTION ENGINE // CIPHER ALGORITHMS
   ========================================================================== */

const CipherEngine = {
    // 1. Symbol Lookup Table
    symbolMap: {
        'A': '★',  'B': '●',  'C': '■',  'D': '✖',  'E': '▲',
        'F': '♦',  'G': '✿',  'H': '♣',  'I': '♠',  'J': '☺',
        'K': '▲',  'L': '◆',  'M': '▼',  'N': '◉',  'O': '✪',
        'P': '✚',  'Q': '✦',  'R': '❤',  'S': '✈',  'T': '☁',
        'U': '☾',  'V': '☀',  'W': '☂',  'X': '✂',  'Y': '✎',
        'Z': '☯'
    },

    /**
     * Main encode entry point
     * @param {string} text - Raw message typed by parent
     * @param {string} cipherType - 'number' | 'symbol' | 'caesar'
     * @returns {string} Encrypted string output
     */
    encode(text, cipherType = 'number') {
        if (!text) return '';
        const sanitized = text.toUpperCase().trim();

        switch (cipherType) {
            case 'symbol':
                return this.encodeSymbol(sanitized);
            case 'caesar':
                return this.encodeCaesar(sanitized, 1);
            case 'number':
            default:
                return this.encodeNumber(sanitized);
        }
    },

    /**
     * Number Cipher: A=1, B=2 ... Z=26
     * Word spaces separated by ' / '
     */
    encodeNumber(text) {
        const words = text.split(/\s+/);
        
        return words.map(word => {
            return word
                .split('')
                .filter(char => /[A-Z]/.test(char))
                .map(char => char.charCodeAt(0) - 64)
                .join('-');
        }).filter(w => w.length > 0).join(' / ');
    },

    /**
     * Symbol Cipher: Converts letters to agent symbols
     */
    encodeSymbol(text) {
        const words = text.split(/\s+/);

        return words.map(word => {
            return word
                .split('')
                .filter(char => /[A-Z]/.test(char))
                .map(char => this.symbolMap[char] || char)
                .join('');
        }).filter(w => w.length > 0).join('   ');
    },

    /**
     * Caesar Shift Cipher (+1 Shift default)
     */
    encodeCaesar(text, shift = 1) {
        const words = text.split(/\s+/);

        return words.map(word => {
            return word
                .split('')
                .filter(char => /[A-Z]/.test(char))
                .map(char => {
                    const code = char.charCodeAt(0) - 65;
                    const shifted = (code + shift) % 26;
                    return String.fromCharCode(shifted + 65);
                })
                .join('');
        }).filter(w => w.length > 0).join(' ');
    }
};

// Global export
window.CipherEngine = CipherEngine;