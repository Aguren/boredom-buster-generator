/**
 * Parent Instructions Page with Fit-to-Bounds Pocket Cheat Sheet
 */
function buildParentInstructionsPage(doc, clues, finalClue, theme) {
    addTopSecretWatermark(doc, theme);

    // Title
    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(15);
    doc.setTextColor(...theme.pdfTextPrimary);
    doc.text(theme.pdfInstructionsTitle || "PARENT INSTRUCTIONS", 105, 22, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont(theme.pdfFont, "normal");
    doc.setTextColor(255, 51, 102);
    doc.text("FOR PARENT EYES ONLY", 105, 27, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.line(20, 31, 190, 31);

    // Steps Overview
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.setFont(theme.pdfFont, "bold");
    doc.text("How to run this adventure:", 20, 39);

    doc.setFont(theme.pdfFont, "normal");
    doc.setFontSize(8.5);
    const steps = [
        `1. Cut out pages for ${theme.cluePrefix} 1 through ${clues.length} and hide them in the matching spots below.`,
        "2. Hand your child the Decoder Key (Page 2) to solve Clue 1.",
        "3. Each cracked clue reveals the hiding spot of the next clue.",
        "4. Place a small prize or treasure at the final location!"
    ];
    let y = 46;
    steps.forEach(step => {
        doc.text(step, 20, y);
        y += 5.5;
    });

    // Pocket Cheat Sheet Box (Calculated to stay fully inside margins)
    const boxX = 20;
    const boxY = y + 4;
    const boxWidth = 170;
    // Calculate total items: Start + N clues + Final Reward
    const totalItems = 1 + clues.length + 1;
    const itemRowHeight = 9;
    const boxHeight = 22 + (totalItems * itemRowHeight);

    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.6);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'S'); // Cutout dashed box
    doc.setLineDashPattern([], 0);

    // Header inside cheat sheet box
    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(0, 0, 0);
    doc.text("PARENT POCKET CHEAT SHEET (CUT OUT & KEEP WHILE HIDING)", 105, boxY + 8, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.line(25, boxY + 12, 185, boxY + 12);

    let listY = boxY + 19;
    const maxValWidth = 95; // Maximum width in mm for right-column hideout text to prevent page spillage

    // 1. Hand to Player
    doc.rect(25, listY - 3, 3.5, 3.5, 'S'); // Checkbox square
    doc.setFont(theme.pdfFont, "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text("Start / Hand to Player:", 32, listY);

    doc.setFont(theme.pdfFont, "normal");
    const startVal = `Decoder Key + ${theme.cluePrefix} 1 Sheet`;
    const startValSplit = doc.splitTextToSize(startVal, maxValWidth);
    doc.text(startValSplit[0], 85, listY);
    listY += itemRowHeight;

    // 2. Hide Clues
    clues.forEach((c, idx) => {
        doc.rect(25, listY - 3, 3.5, 3.5, 'S');
        doc.setFont(theme.pdfFont, "bold");
        doc.text(`Hide ${theme.cluePrefix} ${idx + 1} AT:`, 32, listY);

        doc.setFont(theme.pdfFont, "normal");
        const clueValSplit = doc.splitTextToSize(c.toUpperCase(), maxValWidth);
        doc.text(clueValSplit[0], 85, listY);
        listY += itemRowHeight;
    });

    // 3. Final Reward Location
    doc.rect(25, listY - 3, 3.5, 3.5, 'S');
    doc.setFont(theme.pdfFont, "bold");
    doc.text("Hide Final Reward AT:", 32, listY);

    doc.setFont(theme.pdfFont, "normal");
    const finalValSplit = doc.splitTextToSize(finalClue.toUpperCase(), maxValWidth);
    doc.text(finalValSplit[0], 85, listY);
}