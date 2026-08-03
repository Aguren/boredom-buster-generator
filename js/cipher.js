/* ==========================================================================
   HIA CRYPTOGRAPHY ENGINE // PDF-SAFE ASCII CIPHER MAPPING
   ========================================================================== */

const CipherEngine = {
    numberMap: {
        'A':'1', 'B':'2', 'C':'3', 'D':'4', 'E':'5', 'F':'6', 'G':'7', 'H':'8',
        'I':'9', 'J':'10', 'K':'11', 'L':'12', 'M':'13', 'N':'14', 'O':'15',
        'P':'16', 'Q':'17', 'R':'18', 'S':'19', 'T':'20', 'U':'21', 'V':'22',
        'W':'23', 'X':'24', 'Y':'25', 'Z':'26'
    },

    // PDF-Safe ASCII Symbol Mapping
    symbolMap: {
        'A':'#', 'B':'@', 'C':'$', 'D':'%', 'E':'&', 'F':'*', 'G':'+', 'H':'=',
        'I':'!', 'J':'?', 'K':'~', 'L':'^', 'M':'<', 'N':'>', 'O':':',
        'P':';', 'Q':'/', 'R':'|', 'S':'#', 'T':'@', 'U':'$', 'V':'%',
        'W':'&', 'X':'*', 'Y':'+', 'Z':'='
    },

    // PDF-Safe Pigpen Code Mapping
    pigpenMap: {
        'A':'[A]', 'B':'[B]', 'C':'[C]', 'D':'[D]', 'E':'[E]', 'F':'[F]', 'G':'[G]', 'H':'[H]',
        'I':'[I]', 'J':'[J]', 'K':'[K]', 'L':'[L]', 'M':'[M]', 'N':'[N]', 'O':'[O]', 'P':'[P]',
        'Q':'[Q]', 'R':'[R]', 'S':'[S]', 'T':'[T]', 'U':'[U]', 'V':'[V]', 'W':'[W]', 'X':'[X]',
        'Y':'[Y]', 'Z':'[Z]'
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