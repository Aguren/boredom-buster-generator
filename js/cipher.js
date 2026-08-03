/* ==========================================================================
   HIA CRYPTOGRAPHY ENGINE // ENCRYPTED PIGPEN GRID & SYMBOL CIPHERS
   ========================================================================== */

const CipherEngine = {
    numberMap: {
        'A':'1', 'B':'2', 'C':'3', 'D':'4', 'E':'5', 'F':'6', 'G':'7', 'H':'8',
        'I':'9', 'J':'10', 'K':'11', 'L':'12', 'M':'13', 'N':'14', 'O':'15',
        'P':'16', 'Q':'17', 'R':'18', 'S':'19', 'T':'20', 'U':'21', 'V':'22',
        'W':'23', 'X':'24', 'Y':'25', 'Z':'26'
    },

    // PDF-Safe Symbol Mapping
    symbolMap: {
        'A':'#1', 'B':'@2', 'C':'$3', 'D':'%4', 'E':'&5', 'F':'*6', 'G':'+7', 'H':'=8',
        'I':'!9', 'J':'?0', 'K':'~1', 'L':'^2', 'M':'<3', 'N':'>4', 'O':':5',
        'P':';6', 'Q':'/7', 'R':'|8', 'S':'#9', 'T':'@0', 'U':'$1', 'V':'%2',
        'W':'&3', 'X':'*4', 'Y':'+5', 'Z':'=6'
    },

    // Encrypted Grid Coordinate Cipher (Replaces Plain Brackets)
    pigpenMap: {
        'A':'|1', 'B':'|2', 'C':'|3', 'D':'-1', 'E':'+2', 'F':'-3', 'G':'/1', 'H':'/2', 'I':'/3',
        'J':'#1', 'K':'#2', 'L':'#3', 'M':'*1', 'N':'*2', 'O':'*3', 'P':'=1', 'Q':'=2', 'R':'=3',
        'S':'^1', 'T':'^2', 'U':'^3', 'V':':1', 'W':':2', 'X':':3', 'Y':'~1', 'Z':'~2'
    },

    encode(text, type = 'number') {
        if (!text) return '';
        const cleanText = text.toUpperCase();

        switch (type) {
            case 'number':
                return this.encodeNumber(cleanText);
            case 'symbol':
                return this.encodeSymbol(cleanText);
            case 'pigpen':
                return this.encodePigpen(cleanText);
            case 'reverse':
                return this.encodeReverse(cleanText);
            case 'caesar':
                return this.encodeCaesar(cleanText, 1);
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

    encodeCaesar(text, shift = 1) {
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