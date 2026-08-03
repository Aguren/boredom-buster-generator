/* ==========================================================================
   HIA CRYPTOGRAPHY ENGINE // EXPANDED CIPHER COLLECTION
   ========================================================================== */

const CipherEngine = {
    // Standard A=1 Mapping
    numberMap: {
        'A':'1', 'B':'2', 'C':'3', 'D':'4', 'E':'5', 'F':'6', 'G':'7', 'H':'8',
        'I':'9', 'J':'10', 'K':'11', 'L':'12', 'M':'13', 'N':'14', 'O':'15',
        'P':'16', 'Q':'17', 'R':'18', 'S':'19', 'T':'20', 'U':'21', 'V':'22',
        'W':'23', 'X':'24', 'Y':'25', 'Z':'26'
    },

    // Symbol / Rune Mapping
    symbolMap: {
        'A':'★', 'B':'♦', 'C':'▲', 'D':'✚', 'E':'✦', 'F':'✧', 'G':'⚔', 'H':'⚓',
        'I':'♠', 'J':'♣', 'K':'♥', 'L':'🌙', 'M':'☀', 'N':'⚡', 'O':'🌀',
        'P':'❄', 'Q':'🔥', 'R':'🎯', 'S':'🔮', 'T':'🗝', 'U':'👑', 'V':'🛡',
        'W':'🌌', 'X':'☣', 'Y':'💎', 'Z':'🪐'
    },

    // Pigpen / Grid Symbol Map
    pigpenMap: {
        'A':'╍', 'B':'╏', 'C':'═', 'D':'║', 'E':'╬', 'F':'┼', 'G':'┿', 'H':'╂',
        'I':'├', 'J':'┤', 'K':'┬', 'L':'┴', 'M':'┌', 'N':'┐', 'O':'└', 'P':'┘',
        'Q':'░', 'R':'▒', 'S':'▓', 'T':'█', 'U':'▲', 'V':'▼', 'W':'◀', 'X':'►',
        'Y':'◆', 'Z':'◈'
    },

    /**
     * Master Encode Function
     * @param {string} text - Raw plain text
     * @param {string} type - 'number', 'symbol', 'caesar', 'reverse', or 'pigpen'
     * @param {number} shiftAmount - Used for Caesar Shift (1 to 5)
     */
    encode(text, type = 'number', shiftAmount = 1) {
        if (!text) return '';
        const cleanText = text.toUpperCase();

        switch (type) {
            case 'number':
                return this.encodeNumber(cleanText);
            case 'symbol':
                return this.encodeSymbol(cleanText);
            case 'pigpen':
                return this.encodePigpen(cleanText);
            case 'caesar':
                return this.encodeCaesar(cleanText, parseInt(shiftAmount, 10) || 1);
            case 'reverse':
                return this.encodeReverse(cleanText);
            default:
                return this.encodeNumber(cleanText);
        }
    },

    encodeNumber(text) {
        return text.split('').map(char => {
            if (char === ' ') return ' / ';
            return this.numberMap[char] ? this.numberMap[char] + ' ' : char;
        }).join('').trim();
    },

    encodeSymbol(text) {
        return text.split('').map(char => {
            if (char === ' ') return ' / ';
            return this.symbolMap[char] ? this.symbolMap[char] + ' ' : char;
        }).join('').trim();
    },

    encodePigpen(text) {
        return text.split('').map(char => {
            if (char === ' ') return ' / ';
            return this.pigpenMap[char] ? this.pigpenMap[char] + ' ' : char;
        }).join('').trim();
    },

    encodeCaesar(text, shift) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return text.split('').map(char => {
            if (char === ' ') return ' / ';
            const idx = alphabet.indexOf(char);
            if (idx === -1) return char;
            const shiftedIdx = (idx + shift) % 26;
            return alphabet[shiftedIdx] + ' ';
        }).join('').trim();
    },

    encodeReverse(text) {
        return text.split(' ').map(word => {
            return word.split('').reverse().join('');
        }).join(' / ');
    }
};

window.CipherEngine = CipherEngine;