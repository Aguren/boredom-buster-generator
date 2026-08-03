/* ==========================================================================
   HIA PDF GENERATOR ENGINE // PRO-PROPS STYLING
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

    const agentName = document.getElementById('junior-agent-name').value.trim() || 'AGENT';
    const agentCode = document.getElementById('junior-agent-code').value.trim() || '007½';
    const cipherType = document.getElementById('cipher-type').value;
    
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

    const finalRewardClue = document.getElementById('clue-final').value.trim() || 'MISSION COMPLETE GREAT JOB AGENT';

    const btnGenerate = document.getElementById('btn-generate-pdf');
    const originalText = btnGenerate.innerHTML;
    btnGenerate.disabled = true;
    btnGenerate.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> GENERATING DOSSIER...`;

    try {
        buildCoverPage(doc, agentName, agentCode);

        doc.addPage();
        buildDecoderKeyPage(doc, cipherType);

        clues.forEach((clueText, idx) => {
            doc.addPage();
            buildMissionPage(doc, idx + 1, clueText, cipherType);
        });

        doc.addPage();
        buildMissionPage(doc, 'FINAL', finalRewardClue, cipherType);

        doc.addPage();
        buildParentInstructionsPage(doc, clues, finalRewardClue);

        doc.addPage();
        buildNotebookPage(doc, 1);

        doc.addPage();
        buildNotebookPage(doc, 2);

        const filename = `HIA_Mission_Pack_${agentName.replace(/\s+/g, '_')}.pdf`;
        doc.save(filename);

    } catch (error) {
        console.error("PDF Compilation Failed:", error);
        alert("An error occurred while compiling the PDF. Check console for details.");
    } finally {
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = originalText;
    }
}

/* Background Watermark Helper */
function addTopSecretWatermark(doc) {
    doc.saveGraphicsState();
    doc.setTextColor(240, 210, 215); // Subtle translucent red tint
    doc.setFont("helvetica", "bold");
    doc.setFontSize(55);
    
    // Angled background stamp across center page
    doc.text("TOP SECRET", 105, 160, {
        align: "center",
        angle: 35
    });
    doc.restoreGraphicsState();
}

function buildCoverPage(doc, name, code) {
    doc.setFillColor(18, 24, 36);
    doc.rect(0, 0, 210, 297, 'F');

    // Header Stamp
    doc.setDrawColor(255, 51, 102);
    doc.setLineWidth(1);
    doc.rect(140, 18, 50, 15);
    doc.setTextColor(255, 51, 102);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("TOP SECRET", 165, 28, { align: "center" });

    // Agency Badge Ring
    doc.setDrawColor(0, 240, 255);
    doc.setLineWidth(1.5);
    doc.circle(105, 85, 38, 'S');

    doc.setTextColor(255, 183, 0);
    doc.setFontSize(16);
    doc.text("AGENT", 105, 78, { align: "center" });
    doc.setFontSize(28);
    doc.text(`${code}`, 105, 90, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(0, 240, 255);
    doc.text("* CLASSIFIED *", 105, 99, { align: "center" });

    // Document Title
    doc.setTextColor(240, 244, 248);
    doc.setFontSize(20);
    doc.text("SECRET AGENT MISSION PACK", 105, 140, { align: "center" });

    // Printable Agent ID Photo Frame
    doc.setDrawColor(0, 240, 255);
    doc.setLineWidth(0.8);
    doc.rect(75, 155, 60, 70, 'S');
    doc.setDrawColor(100, 100, 100);
    doc.rect(78, 158, 54, 64, 'S');
    
    doc.setTextColor(138, 153, 173);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("[ ATTACH AGENT PHOTO HERE ]", 105, 192, { align: "center" });

    // Agent Details Footer
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`AGENT NAME: ${name.toUpperCase()}`, 105, 240, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(138, 153, 173);
    doc.text("PROPERTY OF THE HOME INTELLIGENCE AGENCY // FOR AGENT'S EYES ONLY", 105, 275, { align: "center" });
}

function buildDecoderKeyPage(doc, cipherType) {
    addTopSecretWatermark(doc);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(10, 13, 18);
    doc.text("DECODER KEY", 105, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Every letter has a secret code. Keep this handy for every mission!", 105, 33, { align: "center" });

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
        doc.setFont("helvetica", "bold");
        doc.text(`${letter} = ${encodedChar}`, x, y);
    });

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("TIP: Use '/' to mark spaces between encoded words.", 105, 265, { align: "center" });
}

function buildMissionPage(doc, missionNum, rawMessage, cipherType) {
    const isFinal = missionNum === 'FINAL';

    addTopSecretWatermark(doc);

    // Foldable Seal Banner Header
    doc.setDrawColor(180, 180, 180);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(20, 20, 190, 20);
    doc.setLineDashPattern([], 0);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    doc.text(`[ FOLD AND TAPE HERE — DO NOT OPEN UNTIL ${isFinal ? "FINAL MISSION" : "MISSION " + missionNum} ]`, 105, 16, { align: "center" });

    // Mission Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(10, 13, 18);
    doc.text(isFinal ? "FINAL MISSION" : `MISSION ${missionNum}`, 20, 38);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(isFinal ? "You've cracked every code. One last message awaits..." : "Report to headquarters and decode your next assignment.", 20, 46);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 52, 190, 52);

    // Encrypted Box
    doc.setFillColor(248, 249, 252);
    doc.rect(20, 62, 170, 70, 'F');
    doc.setDrawColor(210, 215, 220);
    doc.rect(20, 62, 170, 70, 'S');

    const encrypted = window.CipherEngine ? window.CipherEngine.encode(rawMessage, cipherType) : rawMessage;

    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 200);
    
    const splitLines = doc.splitTextToSize(encrypted, 150);
    doc.text(splitLines, 105, 92, { align: "center" });

    // Agent Answer Fill-in Area
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(10, 13, 18);
    doc.text("MY DECODED MESSAGE:", 20, 155);

    doc.setDrawColor(160, 160, 160);
    doc.line(20, 175, 190, 175);
    doc.line(20, 200, 190, 200);
}

function buildParentInstructionsPage(doc, clues, finalClue) {
    addTopSecretWatermark(doc);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(10, 13, 18);
    doc.text("MISSION CONTROL // PARENT INSTRUCTIONS", 105, 25, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 51, 102);
    doc.text("FOR PARENT EYES ONLY", 105, 32, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 38, 190, 38);

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("How this works:", 20, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const steps = [
        "1. Cut out pages for Missions 1 through " + clues.length + " and hide them in matching locations below.",
        "2. Hand your agent the Decoder Key (Page 2) to start Mission 1.",
        "3. Each cracked clue reveals the hiding spot of the next clue.",
        "4. Place a small prize (snack, sticker, extra screen time) at the final location!"
    ];
    let y = 60;
    steps.forEach(step => {
        doc.text(step, 20, y);
        y += 8;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Target Hideout Cheat Sheet:", 20, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    clues.forEach((c, idx) => {
        doc.text(`• Mission ${idx + 1}: ${c}`, 25, y);
        y += 8;
    });
    doc.text(`• Final Mission: ${finalClue}`, 25, y);
}

function buildNotebookPage(doc, pageNum) {
    addTopSecretWatermark(doc);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(10, 13, 18);
    doc.text(`AGENT NOTEBOOK // CASE FILE PAGE ${pageNum}`, 20, 25);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Date: _____________", 20, 42);
    doc.text("Case Number: _____________", 120, 42);

    doc.text("What was my mission today?", 20, 58);
    doc.line(20, 72, 190, 72);

    doc.text("What clues did I find?", 20, 88);
    doc.line(20, 102, 190, 102);

    doc.text("Draw a picture of your secret hideout or spy gadget below:", 20, 120);
    doc.rect(20, 130, 170, 130, 'S');
}