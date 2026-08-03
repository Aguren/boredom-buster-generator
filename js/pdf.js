/* ==========================================================================
   HIA & MULTI-THEME PDF GENERATOR ENGINE // POCKET CHEAT SHEET CHECKLIST
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const btnGenerate = document.getElementById('btn-generate-pdf');

    if (btnGenerate) {
        btnGenerate.addEventListener('click', generateMissionPackPDF);
    }
});

async function generateMissionPackPDF() {
    if (window.SoundEngine) {
        window.SoundEngine.playCompileSound();
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const currentTheme = window.ThemeManager ? window.ThemeManager.getCurrentTheme() : {};

    const agentName = document.getElementById('junior-agent-name').value.trim() || 'HERO';
    const agentCode = document.getElementById('junior-agent-code').value.trim() || '007';
    const cipherType = document.getElementById('cipher-type').value;
    
    const includeHints = document.getElementById('opt-include-hints')?.checked ?? true;
    const includeCert = document.getElementById('opt-include-cert')?.checked ?? true;

    const customAwardTitle = document.getElementById('cert-award-title')?.value.trim() || 'MASTER DECODER';
    const customSealMark = document.getElementById('cert-stamp-seal')?.value || 'PASSED';

    const clues = [];
    const clue1 = document.getElementById('clue-1').value.trim() || 'LOOK IN THE FRIDGE';
    const clue2 = document.getElementById('clue-2').value.trim() || 'CHECK UNDER YOUR PILLOW';
    const clue3 = document.getElementById('clue-3').value.trim() || 'LOOK BEHIND THE MIRROR';
    
    clues.push(clue1, clue2, clue3);

    const clue4Wrapper = document.getElementById('clue-4-wrapper');
    if (clue4Wrapper && !clue4Wrapper.classList.contains('hidden')) {
        const clue4 = document.getElementById('clue-4').value.trim() || 'CHECK INSIDE THE COUCH';
        clues.push(clue4);
    }

    const clue5Wrapper = document.getElementById('clue-5-wrapper');
    if (clue5Wrapper && !clue5Wrapper.classList.contains('hidden')) {
        const clue5 = document.getElementById('clue-5').value.trim() || 'LOOK INSIDE YOUR SHOE';
        clues.push(clue5);
    }

    const finalRewardClue = document.getElementById('clue-final').value.trim() || 'QUEST COMPLETE GREAT JOB';

    const btnGenerate = document.getElementById('btn-generate-pdf');
    const originalText = btnGenerate.innerHTML;
    btnGenerate.disabled = true;
    btnGenerate.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> COMPILING DOSSIER...`;

    try {
        buildCoverPage(doc, agentName, agentCode, currentTheme);

        doc.addPage();
        buildDecoderKeyPage(doc, cipherType, currentTheme);

        clues.forEach((clueText, idx) => {
            doc.addPage();
            buildMissionPage(doc, idx + 1, clueText, cipherType, currentTheme, includeHints);
        });

        doc.addPage();
        buildMissionPage(doc, 'FINAL', finalRewardClue, cipherType, currentTheme, includeHints);

        doc.addPage();
        buildParentInstructionsPage(doc, clues, finalRewardClue, currentTheme);

        doc.addPage();
        buildNotebookPage(doc, 1, currentTheme);

        if (includeCert) {
            doc.addPage();
            buildCertificatePage(doc, agentName, currentTheme, customAwardTitle, customSealMark);
        }

        const filename = `${currentTheme.id}_Pack_${agentName.replace(/\s+/g, '_')}.pdf`;
        doc.save(filename);

        if (window.showToast) {
            window.showToast("PDF Mission Pack Downloaded!", "success");
        }

    } catch (error) {
        console.error("PDF Compilation Failed:", error);
        alert("An error occurred while compiling the PDF pack.");
    } finally {
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = originalText;
    }
}

function addTopSecretWatermark(doc, theme) {
    doc.saveGraphicsState();
    doc.setTextColor(...theme.pdfWatermarkColor);
    doc.setFont(theme.pdfFont, "bold");
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

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`OFFICIAL DOSSIER // REVISION 4.0`, 25, 27);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(180, 180, 180);
    doc.line(25, 30, 185, 30);

    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(0.8);
    doc.rect(130, 38, 55, 12, 'S');
    doc.setTextColor(...theme.pdfBadgeColor);
    doc.setFontSize(10);
    doc.text(theme.stampText || "CLASSIFIED", 157.5, 46, { align: "center" });

    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(1.2);
    doc.circle(105, 100, 38, 'S');
    doc.setLineWidth(0.4);
    doc.circle(105, 100, 35, 'S');

    doc.setTextColor(180, 130, 0);
    doc.setFontSize(11);
    doc.text("IDENTIFICATION CODE", 105, 92, { align: "center" });
    doc.setFontSize(26);
    doc.setFont(theme.pdfFont, "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(`${code}`, 105, 105, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(...theme.pdfBadgeColor);
    doc.text(`* CLEARANCE LEVEL 7 *`, 105, 113, { align: "center" });

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(22);
    doc.setFont(theme.pdfFont, "bold");
    doc.text(theme.pdfTitleText || "ADVENTURE MISSION PACK", 105, 160, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(theme.pdfFont, "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`OPERATIONAL THEME: ${theme.mainTitle || "HOME INTELLIGENCE AGENCY"}`, 105, 168, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.rect(40, 190, 130, 45, 'S');
    
    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("FIELD AGENT ASSIGNED:", 105, 202, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...theme.pdfTextEncrypted);
    doc.text(name.toUpperCase(), 105, 215, { align: "center" });

    doc.setFontSize(8);
    doc.setFont(theme.pdfFont, "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("STATUS: ACTIVE // AUTHORIZED TO DECODE", 105, 226, { align: "center" });

    doc.line(25, 265, 185, 265);
    doc.setFontSize(8);
    doc.setFont(theme.pdfFont, "bold");
    doc.setTextColor(120, 120, 120);
    doc.text(`STRICTLY CONFIDENTIAL // PROPERTY OF ${theme.mainTitle}`, 105, 272, { align: "center" });
}

function buildDecoderKeyPage(doc, cipherType, theme) {
    addTopSecretWatermark(doc, theme);

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(18);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text("DECODER KEY", 105, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont(theme.pdfFont, "normal");
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

        let encodedChar = '';
        if (window.CipherEngine) {
            encodedChar = window.CipherEngine.encode(letter, cipherType);
        }

        doc.setFontSize(13);
        doc.setFont(theme.pdfFont, "bold");
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

    doc.setFontSize(8);
    doc.setFont(theme.pdfFont, "bold");
    doc.setTextColor(120, 120, 120);
    doc.text(`[ FOLD AND SEAL HERE — DO NOT OPEN UNTIL ${isFinal ? "FINAL REWARD" : theme.cluePrefix.toUpperCase() + " " + missionNum} ]`, 105, 16, { align: "center" });

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(20);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text(isFinal ? "FINAL REWARD QUEST" : `${theme.cluePrefix.toUpperCase()} ${missionNum}`, 20, 38);

    doc.setFontSize(10);
    doc.setFont(theme.pdfFont, "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(isFinal ? "You've solved every clue. One final message awaits..." : "Decode the message below to reveal your next secret location.", 20, 46);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 52, 190, 52);

    const boxX = 20;
    const boxY = 62;
    const boxWidth = 170;
    const boxHeight = 70;

    doc.setFillColor(...theme.pdfBoxBg);
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'F');
    doc.setDrawColor(...theme.pdfBoxBorder);
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'S');

    const encrypted = window.CipherEngine ? window.CipherEngine.encode(rawMessage, cipherType) : rawMessage;

    doc.setFont("courier", "bold");
    let fontSize = 14;
    if (encrypted.length > 50) fontSize = 12;
    if (encrypted.length > 90) fontSize = 10;
    
    doc.setFontSize(fontSize);
    doc.setTextColor(...theme.pdfTextEncrypted);
    
    const maxTextWidth = boxWidth - 20;
    const splitLines = doc.splitTextToSize(encrypted, maxTextWidth);

    const lineHeight = fontSize * 0.45;
    const totalTextHeight = splitLines.length * lineHeight;
    const startY = boxY + (boxHeight / 2) - (totalTextHeight / 2) + (lineHeight / 2);

    doc.text(splitLines, 105, startY, { align: "center" });

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(11);
    doc.setTextColor(...theme.pdfTextPrimary);
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

/**
 * Parent Instructions Page with Cut-Out Pocket Cheat Sheet Checklist
 */
function buildParentInstructionsPage(doc, clues, finalClue, theme) {
    addTopSecretWatermark(doc, theme);

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(16);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text(theme.pdfInstructionsTitle || "PARENT INSTRUCTIONS", 105, 25, { align: "center" });
    doc.setFontSize(9);
    doc.setFont(theme.pdfFont, "normal");
    doc.setTextColor(255, 51, 102);
    doc.text("FOR PARENT EYES ONLY", 105, 32, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 38, 190, 38);

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.setFont(theme.pdfFont, "bold");
    doc.text("How to run this adventure:", 20, 48);

    doc.setFont(theme.pdfFont, "normal");
    doc.setFontSize(10);
    const steps = [
        `1. Cut out pages for ${theme.cluePrefix} 1 through ${clues.length} and hide them in the matching spots below.`,
        "2. Hand your child the Decoder Key (Page 2) to solve Clue 1.",
        "3. Each cracked clue reveals the hiding spot of the next clue.",
        "4. Place a small prize or treasure at the final location!"
    ];
    let y = 56;
    steps.forEach(step => {
        doc.text(step, 20, y);
        y += 7;
    });

    // Option 2: Cut-Out Pocket Cheat Sheet Box
    y += 10;
    doc.setDrawColor(40, 40, 40);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(20, y, 170, 125, 'S'); // Cutout dashed box
    doc.setLineDashPattern([], 0);

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("✂️ PARENT POCKET CHEAT SHEET (CUT OUT & KEEP WHILE HIDING)", 105, y + 12, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(30, y + 16, 180, y + 16);

    let listY = y + 26;
    doc.setFont(theme.pdfFont, "normal");
    doc.setFontSize(10);

    // Clue 1 starts with the parent
    doc.rect(30, listY - 3, 4, 4, 'S'); // Checkbox square
    doc.setFont(theme.pdfFont, "bold");
    doc.text("Start / Hand to Player:", 38, listY);
    doc.setFont(theme.pdfFont, "normal");
    doc.text(`Decoder Key + ${theme.cluePrefix} 1 Sheet`, 90, listY);
    listY += 12;

    // Subsequent Clues
    clues.forEach((c, idx) => {
        doc.rect(30, listY - 3, 4, 4, 'S');
        doc.setFont(theme.pdfFont, "bold");
        doc.text(`Hide ${theme.cluePrefix} ${idx + 1} AT:`, 38, listY);
        doc.setFont(theme.pdfFont, "normal");
        doc.text(`${c}`, 90, listY);
        listY += 12;
    });

    // Final Reward Location
    doc.rect(30, listY - 3, 4, 4, 'S');
    doc.setFont(theme.pdfFont, "bold");
    doc.text("Hide Final Reward AT:", 38, listY);
    doc.setFont(theme.pdfFont, "normal");
    doc.text(`${finalClue}`, 90, listY);
}

function buildNotebookPage(doc, pageNum, theme) {
    addTopSecretWatermark(doc, theme);

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(16);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text(theme.pdfNotebookTitle || "JOURNAL & LOGBOOK", 20, 25);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(10);
    doc.setFont(theme.pdfFont, "normal");
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
    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(2);
    doc.rect(15, 15, 180, 267, 'S');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(18, 18, 174, 261, 'S');

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(26);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text("CERTIFICATE OF VICTORY", 105, 50, { align: "center" });

    doc.setFontSize(11);
    doc.setFont(theme.pdfFont, "normal");
    doc.text("THIS CERTIFIES THAT", 105, 68, { align: "center" });

    doc.setFontSize(16);
    doc.setFont(theme.pdfFont, "bold");
    doc.setTextColor(...theme.pdfBadgeColor);
    doc.text(awardTitle.toUpperCase(), 105, 78, { align: "center" });

    doc.setFontSize(24);
    doc.setFont(theme.pdfFont, "bold");
    doc.setTextColor(...theme.pdfTextEncrypted);
    doc.text(name.toUpperCase(), 105, 95, { align: "center" });

    doc.setFontSize(11);
    doc.setFont(theme.pdfFont, "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`HAS SUCCESSFULLY CRACKED ALL CIPHERS AND COMPLETED THE`, 105, 112, { align: "center" });
    
    doc.setFont(theme.pdfFont, "bold");
    doc.text(`${theme.mainTitle}`, 105, 122, { align: "center" });

    const sealCenterX = 105;
    const sealCenterY = 172;

    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(1.8);
    doc.circle(sealCenterX, sealCenterY, 26, 'S');
    
    doc.setLineWidth(0.6);
    doc.circle(sealCenterX, sealCenterY, 23.5, 'S');
    doc.circle(sealCenterX, sealCenterY, 21, 'S');

    doc.setFontSize(7.5);
    doc.setFont(theme.pdfFont, "bold");
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text("OFFICIAL SEAL OF EXCELLENCE", sealCenterX, sealCenterY - 11, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(...theme.pdfBadgeColor);
    doc.text(`${sealMark}`, sealCenterX, sealCenterY + 2, { align: "center" });

    doc.setFontSize(7.5);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text("VERIFIED & GRANTED", sealCenterX, sealCenterY + 13, { align: "center" });

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(40, 235, 90, 235);
    doc.setFont(theme.pdfFont, "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Parent Signature", 65, 242, { align: "center" });

    doc.line(120, 235, 170, 235);
    doc.text("Date Completed", 145, 242, { align: "center" });
}