/* ==========================================================================
   MULTI-THEME MANAGER ENGINE // REAL-TIME LOGIN & UI ADAPTER
   ========================================================================== */

const ThemeManager = {
    themes: {
        'theme-spy': {
            id: 'theme-spy',
            category: 'agent',
            mainTitle: 'HOME INTELLIGENCE AGENCY',
            subTitle: 'CLASSIFIED MISSION GENERATOR',
            badgeIcon: 'fa-solid fa-shield-halved',
            secLabel: 'SECURITY LEVEL 7 // PARENTS ONLY',
            parentIdLabel: 'PARENT AGENT CODE',
            parentIdIcon: 'fa-solid fa-user-secret',
            authBtnText: 'SCAN FINGERPRINT & ACCESS',
            authBtnIcon: 'fa-solid fa-fingerprint',
            authFooterLeft: 'AUTHORIZED PERSONNEL ONLY',
            authFooterRight: 'AES-256 ENCRYPTED',
            bootTitle: 'SECURE_BOOT_SEQUENCE.SH',
            bootLogs: [
                "SECURE CONNECTION ESTABLISHED",
                "Verifying Parent Clearance Credentials...",
                "Loading Agent Database & Cipher Engines",
                "Decrypting Classified Mission Archives",
                "Establishing HIA Headquarters Link",
                "ACCESS GRANTED // WELCOME AGENT"
            ],
            brandText: 'HIA // MISSION CONTROL',
            brandIcon: 'fa-solid fa-shield-cat',
            specTitle: 'MISSION SPECIFICATIONS',
            heroLegend: 'AGENT DOSSIER',
            heroNameLabel: 'Agent Name',
            heroCodeLabel: 'Codename',
            encLegend: 'ENCRYPTION SETTINGS',
            cipherLabel: 'Cipher Protocol',
            clueCountLabel: 'Number of Clues',
            cluesLegend: 'CLUE LOCATIONS (MESSAGES TO DECODE)',
            cluePrefix: 'Mission',
            finalClueLabel: 'Final Reward Message',
            previewTitle: 'LIVE ENCRYPTION PREVIEW',
            stampText: 'TOP SECRET',
            targetLabel: 'TARGET AGENT:',
            previewFooter: 'AUTO-ENCODED VIA HIA ENCRYPTION ENGINE',
            btnCompileText: 'COMPILE & DOWNLOAD MISSION PACK',
            // PDF Styles
            pdfFont: 'helvetica',
            pdfCoverBg: [18, 24, 36],
            pdfCoverText: [240, 244, 248],
            pdfBadgeColor: [0, 240, 255],
            pdfWatermarkColor: [220, 235, 245],
            pdfBoxBg: [245, 247, 250],
            pdfBoxBorder: [210, 215, 220],
            pdfTextPrimary: [10, 13, 18],
            pdfTextEncrypted: [0, 100, 200],
            pdfTitleText: "SECRET AGENT MISSION PACK",
            pdfInstructionsTitle: "MISSION CONTROL // PARENT INSTRUCTIONS",
            pdfNotebookTitle: "AGENT NOTEBOOK // CASE FILE"
        },
        'theme-stealth': {
            id: 'theme-stealth',
            category: 'agent',
            mainTitle: 'BLACK OPS COMMAND',
            subTitle: 'TACTICAL DECRYPTOR TERMINAL',
            badgeIcon: 'fa-solid fa-user-ninja',
            secLabel: 'DEFCON 1 // EYES ONLY',
            parentIdLabel: 'COMMANDER CALLSIGN',
            parentIdIcon: 'fa-solid fa-crosshairs',
            authBtnText: 'AUTHENTICATE BIOMETRICS',
            authBtnIcon: 'fa-solid fa-fingerprint',
            authFooterLeft: 'RESTRICTED ACCESS AREA',
            authFooterRight: 'BLACK-BOX ENCRYPTED',
            bootTitle: 'STEALTH_COMM_LINK.SH',
            bootLogs: [
                "INITIALIZING SATELLITE UPLINK...",
                "Bypassing Enemy Countermeasures...",
                "Loading Tactical Cipher Algorithms...",
                "Verifying Cryptographic Handshake...",
                "Stealth Link Established...",
                "COMMAND GRANTED // DEPLOYING TEAM"
            ],
            brandText: 'BLACK OPS // COMMAND DASHBOARD',
            brandIcon: 'fa-solid fa-crosshairs',
            specTitle: 'OPERATION PARAMETERS',
            heroLegend: 'OPERATIVE PROFILE',
            heroNameLabel: 'Operative Name',
            heroCodeLabel: 'Tactical Callsign',
            encLegend: 'TACTICAL CIPHERS',
            cipherLabel: 'Encryption Protocol',
            clueCountLabel: 'Objective Count',
            cluesLegend: 'TARGET WAYPOINTS (MESSAGES TO DECODE)',
            cluePrefix: 'Waypoint',
            finalClueLabel: 'Final Extraction Message',
            previewTitle: 'TACTICAL FEED PREVIEW',
            stampText: 'CLASSIFIED',
            targetLabel: 'OPERATIVE:',
            previewFooter: 'ENCRYPTED VIA TACTICAL COMM MATRIX',
            btnCompileText: 'COMPILE TACTICAL DOSSIER PDF',
            // PDF Styles
            pdfFont: 'helvetica',
            pdfCoverBg: [8, 5, 6],
            pdfCoverText: [255, 240, 243],
            pdfBadgeColor: [255, 51, 102],
            pdfWatermarkColor: [245, 210, 215],
            pdfBoxBg: [255, 240, 245],
            pdfBoxBorder: [255, 180, 200],
            pdfTextPrimary: [20, 10, 12],
            pdfTextEncrypted: [200, 0, 50],
            pdfTitleText: "BLACK OPS TACTICAL DOSSIER",
            pdfInstructionsTitle: "COMMAND CONTROL // FIELD GUIDE",
            pdfNotebookTitle: "FIELD OPERATIVE LOGBOOK"
        },
        'theme-dossier': {
            id: 'theme-dossier',
            category: 'agent',
            mainTitle: 'CLASSIFIED ARCHIVES',
            subTitle: 'VINTAGE DOSSIER DECODER',
            badgeIcon: 'fa-solid fa-folder-closed',
            secLabel: 'RESTRICTED FILE ARCHIVE',
            parentIdLabel: 'CHIEF ARCHIVIST CODE',
            parentIdIcon: 'fa-solid fa-file-signature',
            authBtnText: 'UNSEAL CLASSIFIED DOSSIER',
            authBtnIcon: 'fa-solid fa-stamp',
            authFooterLeft: 'PROPERTY OF THE AGENCY',
            authFooterRight: 'CONFIDENTIAL',
            bootTitle: 'ARCHIVE_INDEX_FETCH.SH',
            bootLogs: [
                "Unlocking Underground Vault Storage...",
                "Retrieving Confidential Case Files...",
                "Dusting Off Cipher Wheel Keys...",
                "Indexing Hidden Clue Records...",
                "Verifying Typewriter Stamps...",
                "DOSSIER UNSEALED // ACCESS READY"
            ],
            brandText: 'AGENCY // ARCHIVE WORKSTATION',
            brandIcon: 'fa-solid fa-box-archive',
            specTitle: 'DOSSIER SPECIFICATIONS',
            heroLegend: 'INVESTIGATOR PROFILE',
            heroNameLabel: 'Investigator Name',
            heroCodeLabel: 'Badge ID',
            encLegend: 'CIPHER WHEELS',
            cipherLabel: 'Codebook Protocol',
            clueCountLabel: 'Document Count',
            cluesLegend: 'CASE CLUES (CONFIDENTIAL LOCATIONS)',
            cluePrefix: 'Clue File',
            finalClueLabel: 'Final Vault Message',
            previewTitle: 'DOSSIER MANUSCRIPT PREVIEW',
            stampText: 'CONFIDENTIAL',
            targetLabel: 'INVESTIGATOR:',
            previewFooter: 'STAMPED & FILED VIA AGENCY ARCHIVES',
            btnCompileText: 'PRINT CLASSIFIED DOSSIER PACK',
            // PDF Styles
            pdfFont: 'courier',
            pdfCoverBg: [235, 224, 200],
            pdfCoverText: [43, 37, 32],
            pdfBadgeColor: [153, 51, 0],
            pdfWatermarkColor: [220, 205, 180],
            pdfBoxBg: [248, 243, 230],
            pdfBoxBorder: [180, 150, 110],
            pdfTextPrimary: [43, 37, 32],
            pdfTextEncrypted: [130, 40, 0],
            pdfTitleText: "CLASSIFIED DOSSIER ARCHIVE",
            pdfInstructionsTitle: "CHIEF ARCHIVIST INSTRUCTIONS",
            pdfNotebookTitle: "INVESTIGATOR CASE NOTEBOOK"
        },
        'theme-magic': {
            id: 'theme-magic',
            category: 'girl',
            mainTitle: 'ENCHANTED ACADEMY',
            subTitle: 'MAGIC SPELLBOOK & RUNE GENERATOR',
            badgeIcon: 'fa-solid fa-wand-magic-sparkles',
            secLabel: 'HIGH COUNCIL OF SORCERY',
            parentIdLabel: 'GRAND MAGE CODE',
            parentIdIcon: 'fa-solid fa-hat-wizard',
            authBtnText: 'CAST UNLOCKING CHARM',
            authBtnIcon: 'fa-solid fa-sparkles',
            authFooterLeft: 'HIGH MAGIC PERSONNEL ONLY',
            authFooterRight: 'RUNICALLY ENCHANTED',
            bootTitle: 'SPELLBOOK_INCANTATION.SH',
            bootLogs: [
                "Awakening Ancient Magical Grimoire...",
                "Channeling Starlight Energy...",
                "Translating Runic Alphabets...",
                "Summoning Hidden Potion Ingredients...",
                "Aligning Celestial Constellations...",
                "MAGIC AWAKENED // SPELLBOOK READY"
            ],
            brandText: 'ACADEMY // SANCTUM OF MAGIC',
            brandIcon: 'fa-solid fa-wand-magic-sparkles',
            specTitle: 'SPELL SPECIFICATIONS',
            heroLegend: 'WITCH / SORCERESS PROFILE',
            heroNameLabel: 'Apprentice Name',
            heroCodeLabel: 'Magical Title / Wand',
            encLegend: 'ANCIENT RUNE CIPHERS',
            cipherLabel: 'Enchantment Protocol',
            clueCountLabel: 'Scroll Count',
            cluesLegend: 'HIDDEN SPELL INGREDIENTS',
            cluePrefix: 'Spell Page',
            finalClueLabel: 'Final Potion Reward Message',
            previewTitle: 'REAL-TIME RUNIC PREVIEW',
            stampText: 'ENCHANTED',
            targetLabel: 'APPRENTICE:',
            previewFooter: 'ENCHANTED VIA ACADEMY SPELLBOOK',
            btnCompileText: 'PRINT MAGIC SPELLBOOK PDF',
            // PDF Styles
            pdfFont: 'helvetica',
            pdfCoverBg: [30, 15, 45],
            pdfCoverText: [250, 230, 255],
            pdfBadgeColor: [215, 125, 255],
            pdfWatermarkColor: [230, 210, 245],
            pdfBoxBg: [250, 240, 255],
            pdfBoxBorder: [215, 125, 255],
            pdfTextPrimary: [30, 15, 45],
            pdfTextEncrypted: [150, 20, 200],
            pdfTitleText: "ENCHANTED SPELLBOOK & QUEST PACK",
            pdfInstructionsTitle: "GRAND MAGE // PARENT GUIDE",
            pdfNotebookTitle: "APPRENTICE SPELL JOURNAL"
        },
        'theme-royal': {
            id: 'theme-royal',
            category: 'girl',
            mainTitle: 'ROYAL SECRET ORDER',
            subTitle: 'PRINCESS QUEST DECODER',
            badgeIcon: 'fa-solid fa-crown',
            secLabel: 'ROYAL DECREE // PALACE ONLY',
            parentIdLabel: 'ROYAL ENVOY CODE',
            parentIdIcon: 'fa-solid fa-chess-queen',
            authBtnText: 'UNSEAL ROYAL DECREE',
            authBtnIcon: 'fa-solid fa-gem',
            authFooterLeft: 'BY ORDER OF THE CROWN',
            authFooterRight: 'ROYAL SEAL GUARANTEED',
            bootTitle: 'ROYAL_DECREE_VERIFY.SH',
            bootLogs: [
                "Polishing Royal Wax Seals...",
                "Opening the Crown Jewel Treasury...",
                "Translating Kingdom Secret Ciphers...",
                "Mapping Castle Secret Passages...",
                "Preparing Royal Quest Decrees...",
                "ROYAL SEAL AFFIXED // QUEST READY"
            ],
            brandText: 'PALACE // ROYAL COURT CHAMBER',
            brandIcon: 'fa-solid fa-crown',
            specTitle: 'ROYAL QUEST PARAMETERS',
            heroLegend: 'ROYAL HERO PROFILE',
            heroNameLabel: 'Princess / Hero Name',
            heroCodeLabel: 'Royal Crown Title',
            encLegend: 'PALACE CIPHER CODES',
            cipherLabel: 'Royal Decree Protocol',
            clueCountLabel: 'Decree Count',
            cluesLegend: 'SECRET KINGDOM HIDEOUTS',
            cluePrefix: 'Decree',
            finalClueLabel: 'Final Royal Treasure Message',
            previewTitle: 'ROYAL SCROLL PREVIEW',
            stampText: 'ROYAL SEAL',
            targetLabel: 'ROYAL HERO:',
            previewFooter: 'AUTHENTICATED BY ROYAL COURT SEAL',
            btnCompileText: 'PRINT ROYAL QUEST PACK PDF',
            // PDF Styles
            pdfFont: 'helvetica',
            pdfCoverBg: [45, 10, 25],
            pdfCoverText: [255, 235, 242],
            pdfBadgeColor: [230, 80, 130],
            pdfWatermarkColor: [245, 210, 225],
            pdfBoxBg: [255, 242, 247],
            pdfBoxBorder: [230, 120, 160],
            pdfTextPrimary: [40, 10, 20],
            pdfTextEncrypted: [180, 20, 80],
            pdfTitleText: "ROYAL SECRET ORDER QUEST PACK",
            pdfInstructionsTitle: "ROYAL ENVOY // PARENT INSTRUCTIONS",
            pdfNotebookTitle: "PRINCESS SECRET ROYAL JOURNAL"
        },
        'theme-sleuth': {
            id: 'theme-sleuth',
            category: 'girl',
            mainTitle: 'SLEUTH SOCIETY',
            subTitle: 'DETECTIVE CLUB CODEBOOK',
            badgeIcon: 'fa-solid fa-magnifying-glass',
            secLabel: 'CASE FILE #101 // CONFIDENTIAL',
            parentIdLabel: 'LEAD DETECTIVE CODE',
            parentIdIcon: 'fa-solid fa-user-detective',
            authBtnText: 'OPEN CASE FILE NOTEBOOK',
            authBtnIcon: 'fa-solid fa-magnifying-glass-chart',
            authFooterLeft: 'SLEUTH CLUB MEMBERS ONLY',
            authFooterRight: 'CASE RECORDED',
            bootTitle: 'CASE_FILE_INDEX.SH',
            bootLogs: [
                "Inspecting Fingerprint Clues...",
                "Checking Magnifying Glass Lens...",
                "Flipping Through Detective Notebook...",
                "Connecting Red String Suspect Map...",
                "Decoding Secret Club Handshakes...",
                "CASE UNLOCKED // READY TO SOLVE"
            ],
            brandText: 'SLEUTH CLUB // HEADQUARTERS',
            brandIcon: 'fa-solid fa-magnifying-glass',
            specTitle: 'INVESTIGATION DETAILS',
            heroLegend: 'DETECTIVE DOSSIER',
            heroNameLabel: 'Sleuth Name',
            heroCodeLabel: 'Badge Number',
            encLegend: 'SECRET NOTEBOOK CODES',
            cipherLabel: 'Club Cipher Type',
            clueCountLabel: 'Clue Count',
            cluesLegend: 'MYSTERY CLUE LOCATIONS',
            cluePrefix: 'Mystery Clue',
            finalClueLabel: 'Final Case Solution Message',
            previewTitle: 'EVIDENCE PREVIEW',
            stampText: 'CASE CLOSED',
            targetLabel: 'LEAD SLEUTH:',
            previewFooter: 'VERIFIED BY SLEUTH CLUB DETECTIVES',
            btnCompileText: 'PRINT SLEUTH CASE FILE PDF',
            // PDF Styles
            pdfFont: 'helvetica',
            pdfCoverBg: [15, 35, 40],
            pdfCoverText: [230, 250, 250],
            pdfBadgeColor: [40, 190, 180],
            pdfWatermarkColor: [200, 235, 235],
            pdfBoxBg: [240, 252, 252],
            pdfBoxBorder: [100, 200, 190],
            pdfTextPrimary: [10, 30, 35],
            pdfTextEncrypted: [0, 130, 130],
            pdfTitleText: "SLEUTH SOCIETY DETECTIVE CASE PACK",
            pdfInstructionsTitle: "CHIEF DETECTIVE // PARENT GUIDE",
            pdfNotebookTitle: "SLEUTH DETECTIVE EVIDENCE LOG"
        },
        'theme-pirate': {
            id: 'theme-pirate',
            category: 'boy',
            mainTitle: 'PIRATE TREASURE HUNT',
            subTitle: 'HIGH SEAS MAP & CIPHER DECODER',
            badgeIcon: 'fa-solid fa-skull-crossbones',
            secLabel: 'CAPTAIN\'S LOG // SECRET TREASURE',
            parentIdLabel: 'CAPTAIN CALLSIGN',
            parentIdIcon: 'fa-solid fa-anchor',
            authBtnText: 'UNLOCK TREASURE CHEST',
            authBtnIcon: 'fa-solid fa-key',
            authFooterLeft: 'FOR BRAVE BUCCANEERS ONLY',
            authFooterRight: 'SEALED IN BLOOD',
            bootTitle: 'PIRATE_MAP_UNFOLD.SH',
            bootLogs: [
                "Unrolling Weathered Parchment Map...",
                "Aligning Compass Rose Stars...",
                "Translating Skull & Bones Symbols...",
                "Calculating Nautical League Distances...",
                "Marking X on the Treasure Spot...",
                "MAP UNLOCKED // AHOY CAPTAIN"
            ],
            brandText: 'BLACK SAIL // CAPTAIN\'S QUARTERS',
            brandIcon: 'fa-solid fa-ship',
            specTitle: 'TREASURE VOYAGE PARAMETERS',
            heroLegend: 'BUCCANEER PROFILE',
            heroNameLabel: 'Pirate Name',
            heroCodeLabel: 'Ship Title',
            encLegend: 'HIGH SEAS CIPHERS',
            cipherLabel: 'Pirate Code Protocol',
            clueCountLabel: 'Map Markings',
            cluesLegend: 'TREASURE MAP HIDEOUTS',
            cluePrefix: 'Map Spot',
            finalClueLabel: 'Final Gold Chest Message',
            previewTitle: 'PARCHMENT MAP PREVIEW',
            stampText: 'X MARKS SPOT',
            targetLabel: 'CAPTAIN:',
            previewFooter: 'ENCODED VIA PIRATE CODE WHEEL',
            btnCompileText: 'PRINT TREASURE MAP PACK PDF',
            // PDF Styles
            pdfFont: 'courier',
            pdfCoverBg: [35, 22, 10],
            pdfCoverText: [250, 235, 210],
            pdfBadgeColor: [220, 140, 20],
            pdfWatermarkColor: [230, 210, 180],
            pdfBoxBg: [250, 242, 225],
            pdfBoxBorder: [190, 130, 50],
            pdfTextPrimary: [35, 22, 10],
            pdfTextEncrypted: [160, 60, 0],
            pdfTitleText: "PIRATE TREASURE HUNT MAP PACK",
            pdfInstructionsTitle: "CAPTAIN\'S GUIDE // PARENT CHEAT SHEET",
            pdfNotebookTitle: "BUCCANEER VOYAGE LOG"
        },
        'theme-galaxy': {
            id: 'theme-galaxy',
            category: 'boy',
            mainTitle: 'GALACTIC SPACE FLEET',
            subTitle: 'COSMIC CODE TERMINAL',
            badgeIcon: 'fa-solid fa-rocket',
            secLabel: 'INTERSTELLAR COMMAND // DEEP SPACE',
            parentIdLabel: 'FLIGHT COMMANDER CODE',
            parentIdIcon: 'fa-solid fa-user-astronaut',
            authBtnText: 'ENGAGE HYPERDRIVE',
            authBtnIcon: 'fa-solid fa-shuttle-space',
            authFooterLeft: 'STARFLEET OFFICERS ONLY',
            authFooterRight: 'QUANTUM ENCRYPTED',
            bootTitle: 'WARP_DRIVE_CALIBRATION.SH',
            bootLogs: [
                "Charging Tachyon Propulsion Engines...",
                "Scanning Outer Rim Constellations...",
                "Translating Alien Signal Frequency...",
                "Calibrating Sub-space Transceivers...",
                "Locking Navigation Coordinates...",
                "HYPERDRIVE ACTIVE // FLEET READY"
            ],
            brandText: 'STARFLEET // BRIDGE TERMINAL',
            brandIcon: 'fa-solid fa-satellite-dish',
            specTitle: 'SPACE MISSION DATA',
            heroLegend: 'ASTRONAUT DOSSIER',
            heroNameLabel: 'Commander Name',
            heroCodeLabel: 'Starship Call ID',
            encLegend: 'COSMIC CIPHERS',
            cipherLabel: 'Sub-space Frequency',
            clueCountLabel: 'Sector Count',
            cluesLegend: 'PLANETARY HIDEOUT SECTORS',
            cluePrefix: 'Sector',
            finalClueLabel: 'Final Alien Artifact Message',
            previewTitle: 'QUANTUM SIGNAL PREVIEW',
            stampText: 'STAR COMMAND',
            targetLabel: 'COMMANDER:',
            previewFooter: 'TRANSMITTED VIA GALACTIC STAR COMM',
            btnCompileText: 'PRINT SPACE MISSION PACK PDF',
            // PDF Styles
            pdfFont: 'helvetica',
            pdfCoverBg: [10, 15, 35],
            pdfCoverText: [230, 245, 255],
            pdfBadgeColor: [0, 180, 255],
            pdfWatermarkColor: [210, 235, 255],
            pdfBoxBg: [240, 250, 255],
            pdfBoxBorder: [100, 180, 250],
            pdfTextPrimary: [10, 15, 35],
            pdfTextEncrypted: [0, 90, 220],
            pdfTitleText: "GALACTIC SPACE FLEET MISSION PACK",
            pdfInstructionsTitle: "FLIGHT COMMANDER // PARENT MANUAL",
            pdfNotebookTitle: "STARFLEET LOGBOOK & STAR MAP"
        }
    },

    currentThemeId: 'theme-spy',

    init() {
        // Sync master theme dropdowns
        const masterSelect = document.getElementById('master-theme-select');
        const headerSelect = document.getElementById('theme-switcher');

        if (masterSelect) {
            masterSelect.addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
            });
        }

        if (headerSelect) {
            headerSelect.addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
            });
        }

        // Set initial default theme
        this.applyTheme('theme-spy');
    },

    applyTheme(themeId) {
        if (!this.themes[themeId]) return;
        const theme = this.themes[themeId];
        this.currentThemeId = themeId;

        // 1. Update Body Class for CSS Overrides
        document.body.className = theme.id;

        // 2. Sync both dropdown selectors
        const masterSelect = document.getElementById('master-theme-select');
        const headerSelect = document.getElementById('theme-switcher');
        if (masterSelect) masterSelect.value = theme.id;
        if (headerSelect) headerSelect.value = theme.id;

        // 3. Update DOM Labels & Icons across Auth Screen (INSTANT LOGIN SCREEN TRANSFORM)
        const mainTitle = document.getElementById('theme-main-title');
        const subTitle = document.getElementById('theme-sub-title');
        const badgeIcon = document.getElementById('theme-badge-icon');
        const secLabel = document.getElementById('theme-security-label');
        const labelParentId = document.getElementById('label-parent-id');
        const iconParentId = document.getElementById('icon-parent-id');
        const btnAuthText = document.getElementById('btn-auth-text');
        const btnAuthIcon = document.getElementById('btn-auth-icon');
        const footerLeft = document.getElementById('footer-auth-left');
        const footerRight = document.getElementById('footer-auth-right');

        if (mainTitle) mainTitle.textContent = theme.mainTitle;
        if (subTitle) subTitle.textContent = theme.subTitle;
        if (badgeIcon) badgeIcon.className = theme.badgeIcon;
        if (secLabel) secLabel.textContent = theme.secLabel;
        if (labelParentId) labelParentId.textContent = theme.parentIdLabel;
        if (iconParentId) iconParentId.className = theme.parentIdIcon;
        if (btnAuthText) btnAuthText.textContent = theme.authBtnText;
        if (btnAuthIcon) btnAuthIcon.className = `${theme.authBtnIcon} fingerprint-icon`;
        if (footerLeft) footerLeft.textContent = theme.authFooterLeft;
        if (footerRight) footerRight.textContent = theme.authFooterRight;

        // 4. Update Terminal Title
        const termTitle = document.getElementById('terminal-title');
        if (termTitle) termTitle.textContent = theme.bootTitle;

        // 5. Update Navigation & Dashboard Panel Header
        const brandText = document.getElementById('header-brand-text');
        const brandIcon = document.getElementById('header-brand-icon');
        const specTitle = document.getElementById('panel-spec-title');
        const heroLegend = document.getElementById('legend-hero-details');
        const heroNameLabel = document.getElementById('label-hero-name');
        const heroCodeLabel = document.getElementById('label-hero-code');
        const encLegend = document.getElementById('legend-encryption');
        const cipherLabel = document.getElementById('label-cipher-protocol');
        const clueCountLabel = document.getElementById('label-clue-count');
        const cluesLegend = document.getElementById('legend-clues-header');
        const finalClueLabel = document.getElementById('label-clue-final');

        if (brandText) brandText.textContent = theme.brandText;
        if (brandIcon) brandIcon.className = theme.brandIcon;
        if (specTitle) specTitle.textContent = theme.specTitle;
        if (heroLegend) heroLegend.textContent = theme.heroLegend;
        if (heroNameLabel) heroNameLabel.textContent = theme.heroNameLabel;
        if (heroCodeLabel) heroCodeLabel.textContent = theme.heroCodeLabel;
        if (encLegend) encLegend.textContent = theme.encLegend;
        if (cipherLabel) cipherLabel.textContent = theme.cipherLabel;
        if (clueCountLabel) clueCountLabel.textContent = theme.clueCountLabel;
        if (cluesLegend) cluesLegend.textContent = theme.cluesLegend;

        // Update Clue Field Labels
        for (let i = 1; i <= 5; i++) {
            const labelEl = document.getElementById(`label-clue-${i}`);
            if (labelEl) {
                labelEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${theme.cluePrefix} ${i} Hideout`;
            }
        }
        if (finalClueLabel) {
            finalClueLabel.innerHTML = `<i class="fa-solid fa-trophy"></i> ${theme.finalClueLabel}`;
        }

        // 6. Update Preview Panel Labels
        const previewTitle = document.getElementById('panel-preview-title');
        const stampText = document.getElementById('preview-top-stamp');
        const targetLabel = document.getElementById('preview-label-target');
        const previewFooter = document.getElementById('preview-footer-note');
        const btnCompileText = document.getElementById('btn-compile-text');

        if (previewTitle) previewTitle.textContent = theme.previewTitle;
        if (stampText) stampText.textContent = theme.stampText;
        if (targetLabel) targetLabel.textContent = theme.targetLabel;
        if (previewFooter) {
            previewFooter.innerHTML = `<i class="fa-solid fa-lock"></i> ${theme.previewFooter}`;
        }
        if (btnCompileText) btnCompileText.textContent = theme.btnCompileText;

        // 7. Refresh Live Encryption Preview
        if (window.refreshLivePreview) {
            window.refreshLivePreview();
        }

        // Audio Feedback on Theme Change
        if (window.SoundEngine) {
            window.SoundEngine.playBlip();
        }
    },

    getCurrentTheme() {
        return this.themes[this.currentThemeId] || this.themes['theme-spy'];
    }
};

window.ThemeManager = ThemeManager;