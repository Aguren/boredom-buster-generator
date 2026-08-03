/* ==========================================================================
   HIA & MULTI-THEME PDF GENERATOR ENGINE // WITH CERTIFICATE & HINTS
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
    
    // Checkbox Options
    const includeHints = document.getElementById('opt-include-hints')?.checked ?? true;
    const includeCert = document.getElementById('opt-include-cert')?.checked ?? true;

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
            buildCertificatePage(doc, agentName, currentTheme);
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
    doc.setFillColor(...theme.pdfCoverBg);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(1);
    doc.rect(130, 18, 60, 15);
    doc.setTextColor(...theme.pdfBadgeColor);
    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(11);
    doc.text(theme.stampText || "CLASSIFIED", 160, 28, { align: "center" });

    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(1.5);
    doc.circle(105, 85, 38, 'S');

    doc.setTextColor(255, 183, 0);
    doc.setFontSize(14);
    doc.text("IDENTIFICATION", 105, 78, { align: "center" });
    doc.setFontSize(26);
    doc.text(`${code}`, 105, 90, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(...theme.pdfBadgeColor);
    doc.text(`* ${theme.stampText || "CONFIDENTIAL"} *`, 105, 99, { align: "center" });

    doc.setTextColor(...theme.pdfCoverText);
    doc.setFontSize(18);
    doc.text(theme.pdfTitleText || "ADVENTURE MISSION PACK", 105, 140, { align: "center" });

    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(0.8);
    doc.rect(75, 155, 60, 70, 'S');
    doc.setDrawColor(120, 120, 120);
    doc.rect(78, 158, 54, 64, 'S');
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont(theme.pdfFont, "normal");
    doc.text("[ ATTACH PHOTO / CREST HERE ]", 105, 192, { align: "center" });

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(12);
    doc.setTextColor(...theme.pdfCoverText);
    doc.text(`NAME: ${name.toUpperCase()}`, 105, 240, { align: "center" });
    
    doc.setFontSize(8);
    doc.text(`PROPERTY OF ${theme.mainTitle} // FOR YOUR EYES ONLY`, 105, 275, { align: "center" });
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

        doc.setFontSize(14);
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

    doc.setFillColor(...theme.pdfBoxBg);
    doc.rect(20, 62, 170, 70, 'F');
    doc.setDrawColor(...theme.pdfBoxBorder);
    doc.rect(20, 62, 170, 70, 'S');

    const encrypted = window.CipherEngine ? window.CipherEngine.encode(rawMessage, cipherType) : rawMessage;

    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...theme.pdfTextEncrypted);
    
    const splitLines = doc.splitTextToSize(encrypted, 150);
    doc.text(splitLines, 105, 92, { align: "center" });

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(11);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text("MY DECODED MESSAGE:", 20, 155);

    // Dynamic Letter Hint blanks
    if (includeHints) {
        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.setTextColor(140, 140, 140);

        let hintPattern = rawMessage.split('').map(c => c === ' ' ? '   ' : '_ ').join('');
        doc.text(hintPattern, 20, 172);
        doc.line(20, 195, 190, 195);
    } else {
        doc.setDrawColor(160, 160, 160);
        doc.line(20, 175, 190, 175);
        doc.line(20, 200, 190, 200);
    }
}

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
    doc.text("How to run this adventure:", 20, 50);

    doc.setFont(theme.pdfFont, "normal");
    doc.setFontSize(10);
    const steps = [
        `1. Cut out pages for ${theme.cluePrefix} 1 through ${clues.length} and hide them in the matching spots below.`,
        "2. Hand your child the Decoder Key (Page 2) to solve Clue 1.",
        "3. Each cracked clue reveals the hiding spot of the next clue.",
        "4. Place a small prize or treasure at the final location!"
    ];
    let y = 60;
    steps.forEach(step => {
        doc.text(step, 20, y);
        y += 8;
    });

    y += 10;
    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(11);
    doc.text("Hideout Cheat Sheet:", 20, y);

    y += 10;
    doc.setFont(theme.pdfFont, "normal");
    doc.setFontSize(10);
    clues.forEach((c, idx) => {
        doc.text(`• ${theme.cluePrefix} ${idx + 1}: ${c}`, 25, y);
        y += 8;
    });
    doc.text(`• Final Reward: ${finalClue}`, 25, y);
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

/* Bonus Printable Certificate Page */
function buildCertificatePage(doc, name, theme) {
    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.setLineWidth(2);
    doc.rect(15, 15, 180, 267, 'S');

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(18, 18, 174, 261, 'S');

    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(26);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text("CERTIFICATE OF VICTORY", 105, 55, { align: "center" });

    doc.setFontSize(12);
    doc.setFont(theme.pdfFont, "normal");
    doc.text("THIS CERTIFIES THAT MASTER DECODER", 105, 75, { align: "center" });

    doc.setFontSize(24);
    doc.setFont(theme.pdfFont, "bold");
    doc.setTextColor(...theme.pdfTextEncrypted);
    doc.text(name.toUpperCase(), 105, 95, { align: "center" });

    doc.setFontSize(12);
    doc.setFont(theme.pdfFont, "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`HAS SUCCESSFULLY CRACKED ALL CIPHERS AND COMPLETED THE`, 105, 115, { align: "center" });
    doc.setFont(theme.pdfFont, "bold");
    doc.text(`${theme.mainTitle}`, 105, 125, { align: "center" });

    doc.setDrawColor(...theme.pdfBadgeColor);
    doc.circle(105, 175, 25, 'S');
    doc.setFontSize(10);
    doc.text("OFFICIAL SEAL", 105, 173, { align: "center" });
    doc.text("★ PASSED ★", 105, 180, { align: "center" });

    doc.line(40, 235, 90, 235);
    doc.text("Parent Signature", 65, 242, { align: "center" });

    doc.line(120, 235, 170, 235);
    doc.text("Date Completed", 145, 242, { align: "center" });
}