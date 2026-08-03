/* ==========================================================================
   HIA & MULTI-THEME PDF GENERATOR ENGINE // SAFE COMPILER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPdfEngine();
});

function initPdfEngine() {
    const btnGenerate = document.getElementById('btn-generate-pdf');

    if (btnGenerate) {
        // Remove existing listeners to avoid duplicate bindings
        btnGenerate.replaceWith(btnGenerate.cloneNode(true));
        const newBtn = document.getElementById('btn-generate-pdf');
        newBtn.addEventListener('click', generateMissionPackPDF);
    }
}

async function generateMissionPackPDF(e) {
    if (e) e.preventDefault();

    if (window.SoundEngine && typeof window.SoundEngine.playCompileSound === 'function') {
        window.SoundEngine.playCompileSound();
    }

    const btnGenerate = document.getElementById('btn-generate-pdf');
    const originalText = btnGenerate ? btnGenerate.innerHTML : '';

    if (btnGenerate) {
        btnGenerate.disabled = true;
        btnGenerate.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> COMPILING DOSSIER...`;
    }

    try {
        // Check for jsPDF library availability
        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error("jsPDF library is not loaded. Please check your internet connection or script tags.");
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const currentTheme = (window.ThemeManager && typeof window.ThemeManager.getCurrentTheme === 'function') 
            ? window.ThemeManager.getCurrentTheme() 
            : {
                id: 'theme-spy',
                mainTitle: 'HOME INTELLIGENCE AGENCY',
                cluePrefix: 'Mission',
                pdfFont: 'helvetica',
                pdfBadgeColor: [0, 204, 255],
                pdfTextPrimary: [0, 0, 0],
                pdfTextEncrypted: [0, 150, 255],
                pdfWatermarkColor: [230, 230, 230],
                pdfBoxBg: [245, 245, 245],
                pdfBoxBorder: [180, 180, 180],
                stampText: 'CLASSIFIED'
            };

        // Extract inputs with reliable safety defaults
        const nameInput = document.getElementById('junior-agent-name');
        const codeInput = document.getElementById('junior-agent-code');
        const cipherSelect = document.getElementById('cipher-type');

        const agentName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'HERO';
        const agentCode = (codeInput && codeInput.value.trim()) ? codeInput.value.trim() : '007';
        const cipherType = cipherSelect ? cipherSelect.value : 'number';

        const includeHints = document.getElementById('opt-include-hints')?.checked ?? true;
        const includeCert = document.getElementById('opt-include-cert')?.checked ?? true;

        const awardTitleInput = document.getElementById('cert-award-title');
        const sealSelect = document.getElementById('cert-stamp-seal');

        const customAwardTitle = (awardTitleInput && awardTitleInput.value.trim()) ? awardTitleInput.value.trim() : 'MASTER DECODER';
        const customSealMark = sealSelect ? sealSelect.value : 'PASSED';

        // Extract Clues
        const clues = [];
        const c1 = document.getElementById('clue-1')?.value.trim() || document.getElementById('clue-1')?.placeholder || 'LOOK IN THE FRIDGE';
        const c2 = document.getElementById('clue-2')?.value.trim() || document.getElementById('clue-2')?.placeholder || 'CHECK UNDER YOUR PILLOW';
        const c3 = document.getElementById('clue-3')?.value.trim() || document.getElementById('clue-3')?.placeholder || 'LOOK BEHIND THE MIRROR';
        clues.push(c1, c2, c3);

        const clue4Wrapper = document.getElementById('clue-4-wrapper');
        if (clue4Wrapper && !clue4Wrapper.classList.contains('hidden')) {
            const c4 = document.getElementById('clue-4')?.value.trim() || document.getElementById('clue-4')?.placeholder || 'CHECK INSIDE THE COUCH';
            clues.push(c4);
        }

        const clue5Wrapper = document.getElementById('clue-5-wrapper');
        if (clue5Wrapper && !clue5Wrapper.classList.contains('hidden')) {
            const c5 = document.getElementById('clue-5')?.value.trim() || document.getElementById('clue-5')?.placeholder || 'LOOK INSIDE YOUR SHOE';
            clues.push(c5);
        }

        const finalRewardClue = document.getElementById('clue-final')?.value.trim() || document.getElementById('clue-final')?.placeholder || 'QUEST COMPLETE GREAT JOB';

        // --- BUILD PDF PAGES ---

        // Page 1: Cover
        buildCoverPage(doc, agentName, agentCode, currentTheme);

        // Page 2: Decoder Key
        doc.addPage();
        buildDecoderKeyPage(doc, cipherType, currentTheme);

        // Clue Pages
        clues.forEach((clueText, idx) => {
            doc.addPage();
            buildMissionPage(doc, idx + 1, clueText, cipherType, currentTheme, includeHints);
        });

        // Final Reward Page
        doc.addPage();
        buildMissionPage(doc, 'FINAL', finalRewardClue, cipherType, currentTheme, includeHints);

        // Parent Instructions & Pocket Cheat Sheet
        doc.addPage();
        buildParentInstructionsPage(doc, clues, finalRewardClue, currentTheme);

        // Logbook Page
        doc.addPage();
        buildNotebookPage(doc, 1, currentTheme);

        // Optional Victory Certificate
        if (includeCert) {
            doc.addPage();
            buildCertificatePage(doc, agentName, currentTheme, customAwardTitle, customSealMark);
        }

        // Save PDF File
        const filename = `${currentTheme.id || 'Mission'}_Pack_${agentName.replace(/\s+/g, '_')}.pdf`;
        doc.save(filename);

        if (window.showToast) {
            window.showToast("PDF Mission Pack Downloaded!", "success");
        }

    } catch (error) {
        console.error("PDF Compilation Error:", error);
        alert(`PDF Compilation Failed: ${error.message}`);
    } finally {
        if (btnGenerate) {
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = originalText;
        }
    }
}

function addTopSecretWatermark(doc, theme) {
    doc.saveGraphicsState();
    doc.setTextColor(...(theme.pdfWatermarkColor || [230, 230, 230]));
    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setFontSize(44);
    
    doc.text(theme.stampText || "TOP SECRET", 105, 225, {
        align: "center",
        angle: 15
    });
    doc.restoreGraphicsState();
}

function buildCoverPage(doc, name, code, theme) {
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(1.5);
    doc.rect(12, 12, 186, 273, 'S');

    doc.setLineWidth(0.5);
    doc.rect(15, 15, 180, 267, 'S');

    const cornerSize = 8;
    doc.setFillColor(40, 40, 40);
    doc.rect(12, 12, cornerSize, 2, 'F');
    doc.rect(12, 12, 2, cornerSize, 'F');
    doc.rect(198 - cornerSize, 12, cornerSize, 2, 'F');
    doc.rect(196, 12, 2, cornerSize, 'F');
    doc.rect(12, 285 - 2, cornerSize, 2, 'F');
    doc.rect(12, 285 - cornerSize, 2, cornerSize, 'F');
    doc.rect(198 - cornerSize, 285 - 2, cornerSize, 2, 'F');
    doc.rect(196, 285 - cornerSize, 2, cornerSize, 'F');

    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`OFFICIAL DOSSIER // REVISION 4.0`, 25, 27);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(180, 180, 180);
    doc.line(25, 30, 185, 30);

    const badgeColor = theme.pdfBadgeColor || [0, 204, 255];
    doc.setDrawColor(...badgeColor);
    doc.setLineWidth(0.8);
    doc.rect(130, 38, 55, 12, 'S');
    doc.setTextColor(...badgeColor);
    doc.setFontSize(10);
    doc.text(theme.stampText || "CLASSIFIED", 157.5, 46, { align: "center" });

    doc.setDrawColor(...badgeColor);
    doc.setLineWidth(1.2);
    doc.circle(105, 100, 38, 'S');
    doc.setLineWidth(0.4);
    doc.circle(105, 100, 35, 'S');

    doc.setTextColor(180, 130, 0);
    doc.setFontSize(11);
    doc.text("IDENTIFICATION CODE", 105, 92, { align: "center" });
    doc.setFontSize(26);
    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(`${code}`, 105, 105, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(...badgeColor);
    doc.text(`* CLEARANCE LEVEL 7 *`, 105, 113, { align: "center" });

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(22);
    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.text(theme.pdfTitleText || "ADVENTURE MISSION PACK", 105, 160, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(theme.pdfFont || 'helvetica', "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`OPERATIONAL THEME: ${theme.mainTitle || "HOME INTELLIGENCE AGENCY"}`, 105, 168, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.rect(40, 190, 130, 45, 'S');
    
    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("FIELD AGENT ASSIGNED:", 105, 202, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...(theme.pdfTextEncrypted || [0, 150, 255]));
    doc.text(name.toUpperCase(), 105, 215, { align: "center" });

    doc.setFontSize(8);
    doc.setFont(theme.pdfFont || 'helvetica', "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("STATUS: ACTIVE // AUTHORIZED TO DECODE", 105, 226, { align: "center" });

    doc.line(25, 265, 185, 265);
    doc.setFontSize(8);
    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setTextColor(120, 120, 120);
    doc.text(`STRICTLY CONFIDENTIAL // PROPERTY OF ${theme.mainTitle || "HIA"}`, 105, 272, { align: "center" });
}

function buildDecoderKeyPage(doc, cipherType, theme) {
    addTopSecretWatermark(doc, theme);

    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setFontSize(18);
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text("DECODER KEY", 105, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont(theme.pdfFont || 'helvetica', "normal");
    doc.text("Every letter has a secret code. Keep this key handy to solve every clue!", 105, 33, { align: "center" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 38, 190, 38);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    let yStart = 50;
    
    alphabet.forEach((letter, index) => {
        let col = index < 13 ? 0 : 1;
        let row = index % 13;

        let x = col === 0 ? 40 : 120;
        let y = yStart + (row * 15);

        let encodedChar = letter;
        if (window.CipherEngine && typeof window.CipherEngine.encode === 'function') {
            encodedChar = window.CipherEngine.encode(letter, cipherType);
        }

        doc.setFontSize(13);
        doc.setFont(theme.pdfFont || 'helvetica', "bold");
        doc.text(`${letter} = ${encodedChar}`, x, y);
    });

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("TIP: Use '/' to mark spaces between encoded words.", 105, 265, { align: "center" });
}

function buildMissionPage(doc, missionNum, rawMessage, cipherType, theme, includeHints) {
    const isFinal = missionNum === 'FINAL';

    addTopSecretWatermark(doc, theme);

    doc.setDrawColor(180, 180, 180);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(20, 20, 190, 20);
    doc.setLineDashPattern([], 0);

    const cluePrefix = theme.cluePrefix || 'Mission';

    doc.setFontSize(8);
    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setTextColor(120, 120, 120);
    doc.text(`[ FOLD AND SEAL HERE — DO NOT OPEN UNTIL ${isFinal ? "FINAL REWARD" : cluePrefix.toUpperCase() + " " + missionNum} ]`, 105, 16, { align: "center" });

    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setFontSize(20);
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text(isFinal ? "FINAL REWARD QUEST" : `${cluePrefix.toUpperCase()} ${missionNum}`, 20, 38);

    doc.setFontSize(10);
    doc.setFont(theme.pdfFont || 'helvetica', "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(isFinal ? "You've solved every clue. One final message awaits..." : "Decode the message below to reveal your next secret location.", 20, 46);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 52, 190, 52);

    const boxX = 20;
    const boxY = 62;
    const boxWidth = 170;
    const boxHeight = 70;

    doc.setFillColor(...(theme.pdfBoxBg || [245, 245, 245]));
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'F');
    doc.setDrawColor(...(theme.pdfBoxBorder || [180, 180, 180]));
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'S');

    let encrypted = rawMessage;
    if (window.CipherEngine && typeof window.CipherEngine.encode === 'function') {
        encrypted = window.CipherEngine.encode(rawMessage, cipherType);
    }

    doc.setFont("courier", "bold");
    let fontSize = 14;
    if (encrypted.length > 50) fontSize = 12;
    if (encrypted.length > 90) fontSize = 10;
    
    doc.setFontSize(fontSize);
    doc.setTextColor(...(theme.pdfTextEncrypted || [0, 150, 255]));
    
    const maxTextWidth = boxWidth - 20;
    const splitLines = doc.splitTextToSize(encrypted, maxTextWidth);

    const lineHeight = fontSize * 0.45;
    const totalTextHeight = splitLines.length * lineHeight;
    const startY = boxY + (boxHeight / 2) - (totalTextHeight / 2) + (lineHeight / 2);

    doc.text(splitLines, 105, startY, { align: "center" });

    doc.setFont(theme.pdfFont || 'helvetica', "bold");
    doc.setFontSize(11);
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text("MY DECODED MESSAGE:", 20, 155);

    if (includeHints) {
        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.setTextColor(140, 140, 140);

        let hintPattern = rawMessage.split('').map(c => c === ' ' ? '   ' : '_ ').join('');
        const splitHints = doc.splitTextToSize(hintPattern, 170);
        doc.text(splitHints, 20, 170);
        doc.line(20, 200, 190, 200);
    } else {
        doc.setDrawColor(160, 160, 160);
        doc.line(20, 175, 190, 175);
        doc.line(20, 200, 190, 200);
    }
}

function buildParentInstructionsPage(doc, clues, finalClue, theme) {
    addTopSecretWatermark(doc, theme);

    const font = theme.pdfFont || 'helvetica';
    const prefix = theme.cluePrefix || 'Mission';

    doc.setFont(font, "bold");
    doc.setFontSize(15);
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text(theme.pdfInstructionsTitle || "PARENT INSTRUCTIONS", 105, 22, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont(font, "normal");
    doc.setTextColor(255, 51, 102);
    doc.text("FOR PARENT EYES ONLY", 105, 27, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.line(20, 31, 190, 31);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.setFont(font, "bold");
    doc.text("How to run this adventure:", 20, 39);

    doc.setFont(font, "normal");
    doc.setFontSize(8.5);
    const steps = [
        `1. Cut out pages for ${prefix} 1 through ${clues.length} and hide them in the matching spots below.`,
        "2. Hand your child the Decoder Key (Page 2) to solve Clue 1.",
        "3. Each cracked clue reveals the hiding spot of the next clue.",
        "4. Place a small prize or treasure at the final location!"
    ];
    let y = 46;
    steps.forEach(step => {
        doc.text(step, 20, y);
        y += 5.5;
    });

    const boxX = 20;
    const boxY = y + 4;
    const boxWidth = 170;
    const totalItems = 1 + clues.length + 1;
    const itemRowHeight = 9;
    const boxHeight = 22 + (totalItems * itemRowHeight);

    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.6);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'S');
    doc.setLineDashPattern([], 0);

    doc.setFont(font, "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(0, 0, 0);
    doc.text("PARENT POCKET CHEAT SHEET (CUT OUT & KEEP WHILE HIDING)", 105, boxY + 8, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.line(25, boxY + 12, 185, boxY + 12);

    let listY = boxY + 19;
    const maxValWidth = 95;

    doc.rect(25, listY - 3, 3.5, 3.5, 'S');
    doc.setFont(font, "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text("Start / Hand to Player:", 32, listY);

    doc.setFont(font, "normal");
    const startVal = `Decoder Key + ${prefix} 1 Sheet`;
    const startValSplit = doc.splitTextToSize(startVal, maxValWidth);
    doc.text(startValSplit[0], 85, listY);
    listY += itemRowHeight;

    clues.forEach((c, idx) => {
        doc.rect(25, listY - 3, 3.5, 3.5, 'S');
        doc.setFont(font, "bold");
        doc.text(`Hide ${prefix} ${idx + 1} AT:`, 32, listY);

        doc.setFont(font, "normal");
        const clueValSplit = doc.splitTextToSize(c.toUpperCase(), maxValWidth);
        doc.text(clueValSplit[0], 85, listY);
        listY += itemRowHeight;
    });

    doc.rect(25, listY - 3, 3.5, 3.5, 'S');
    doc.setFont(font, "bold");
    doc.text("Hide Final Reward AT:", 32, listY);

    doc.setFont(font, "normal");
    const finalValSplit = doc.splitTextToSize(finalClue.toUpperCase(), maxValWidth);
    doc.text(finalValSplit[0], 85, listY);
}

function buildNotebookPage(doc, pageNum, theme) {
    addTopSecretWatermark(doc, theme);

    const font = theme.pdfFont || 'helvetica';

    doc.setFont(font, "bold");
    doc.setFontSize(16);
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text(theme.pdfNotebookTitle || "JOURNAL & LOGBOOK", 20, 25);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(10);
    doc.setFont(font, "normal");
    doc.text("Date: _____________", 20, 42);
    doc.text("Quest ID: _____________", 120, 42);

    doc.text("What was my quest today?", 20, 58);
    doc.line(20, 72, 190, 72);

    doc.text("What secret clues did I discover?", 20, 88);
    doc.line(20, 102, 190, 102);

    doc.text("Draw a picture of your secret hideout, treasure, or magical gadget below:", 20, 120);
    doc.rect(20, 130, 170, 130, 'S');
}

function buildCertificatePage(doc, name, theme, awardTitle = 'MASTER DECODER', sealMark = 'PASSED') {
    const font = theme.pdfFont || 'helvetica';
    const badgeColor = theme.pdfBadgeColor || [0, 204, 255];

    doc.setDrawColor(...badgeColor);
    doc.setLineWidth(2);
    doc.rect(15, 15, 180, 267, 'S');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(18, 18, 174, 261, 'S');

    doc.setFont(font, "bold");
    doc.setFontSize(26);
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text("CERTIFICATE OF VICTORY", 105, 50, { align: "center" });

    doc.setFontSize(11);
    doc.setFont(font, "normal");
    doc.text("THIS CERTIFIES THAT", 105, 68, { align: "center" });

    doc.setFontSize(16);
    doc.setFont(font, "bold");
    doc.setTextColor(...badgeColor);
    doc.text(awardTitle.toUpperCase(), 105, 78, { align: "center" });

    doc.setFontSize(24);
    doc.setFont(font, "bold");
    doc.setTextColor(...(theme.pdfTextEncrypted || [0, 150, 255]));
    doc.text(name.toUpperCase(), 105, 95, { align: "center" });

    doc.setFontSize(11);
    doc.setFont(font, "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`HAS SUCCESSFULLY CRACKED ALL CIPHERS AND COMPLETED THE`, 105, 112, { align: "center" });
    
    doc.setFont(font, "bold");
    doc.text(`${theme.mainTitle || "HOME INTELLIGENCE AGENCY"}`, 105, 122, { align: "center" });

    const sealCenterX = 105;
    const sealCenterY = 172;

    doc.setDrawColor(...badgeColor);
    doc.setLineWidth(1.8);
    doc.circle(sealCenterX, sealCenterY, 26, 'S');
    
    doc.setLineWidth(0.6);
    doc.circle(sealCenterX, sealCenterY, 23.5, 'S');
    doc.circle(sealCenterX, sealCenterY, 21, 'S');

    doc.setFontSize(7.5);
    doc.setFont(font, "bold");
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text("OFFICIAL SEAL OF EXCELLENCE", sealCenterX, sealCenterY - 11, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(...badgeColor);
    doc.text(`${sealMark}`, sealCenterX, sealCenterY + 2, { align: "center" });

    doc.setFontSize(7.5);
    doc.setTextColor(...(theme.pdfTextPrimary || [0, 0, 0]));
    doc.text("VERIFIED & GRANTED", sealCenterX, sealCenterY + 13, { align: "center" });

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(40, 235, 90, 235);
    doc.setFont(font, "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Parent Signature", 65, 242, { align: "center" });

    doc.line(120, 235, 170, 235);
    doc.text("Date Completed", 145, 242, { align: "center" });
}