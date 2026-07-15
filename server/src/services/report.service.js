const PDFDocument = require('pdfkit');

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS — premium editorial navy / gold theme
// ─────────────────────────────────────────────────────────────
const COLORS = {
  navyDeep: '#080C16',
  navy: '#0E1526',
  navySoft: '#182238',
  gold: '#C6A24D',
  goldLight: '#E8D19A',
  goldDeep: '#9A7B2E',
  ink: '#14151A',
  body: '#464A52',
  muted: '#9497A0',
  faint: '#B7B9BF',
  line: '#E9E6DC',
  lineSoft: '#F0EEE7',
  cardBg: '#FFFFFF',
  panelBg: '#FAF9F5',
  white: '#FFFFFF',
  critical: '#B23A2E',
  criticalBg: '#FBEFEC',
  high: '#C06A2C',
  highBg: '#FCF2E8',
  medium: '#A9821B',
  mediumBg: '#FAF3DE',
  low: '#5B6270',
  lowBg: '#F1F1EE',
  success: '#1D7A50',
  successBg: '#EEF7F1'
};

const SEVERITY_STYLE = {
  CRITICAL: { fg: COLORS.critical, bg: COLORS.criticalBg },
  HIGH: { fg: COLORS.high, bg: COLORS.highBg },
  MEDIUM: { fg: COLORS.medium, bg: COLORS.mediumBg },
  LOW: { fg: COLORS.low, bg: COLORS.lowBg }
};

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 52;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = 748;

// measures an outlined-badge width without drawing (used to right-align it)
function outlinedBadgeWidth(doc, text) {
  doc.font('Helvetica-Bold').fontSize(7);
  const tw = doc.widthOfString(text, { characterSpacing: 0.6 });
  return tw + 20;
}

const generatePdfReport = (review) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: MARGIN, 
        bufferPages: true, 
        size: 'LETTER',
        autoPageBreaks: false
      });

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // ── helpers ─────────────────────────────────────────
      const shadow = (x, y, w, h, r) => {
        for (let i = 3; i >= 1; i--) {
          doc.roundedRect(x - i * 0.4, y + i * 1.4, w, h, r)
            .fillOpacity(0.03 * i).fillColor('#000000').fill();
        }
        doc.fillOpacity(1);
      };

      const card = (x, y, w, h, r, fillOrGrad, stroke) => {
        shadow(x, y, w, h, r);
        doc.roundedRect(x, y, w, h, r);
        if (fillOrGrad) doc.fill(fillOrGrad); else doc.fillColor(COLORS.cardBg).fill();
        if (stroke) { doc.roundedRect(x, y, w, h, r).strokeColor(stroke).lineWidth(0.75).stroke(); }
      };

      const accentStrip = (x, y, w, h, color, radius = 6) => {
        doc.save();
        doc.roundedRect(x, y, w, h, radius).clip();
        doc.rect(x, y, 3, h).fillColor(color).fill();
        doc.restore();
      };

      const dot = (x, y, color, r = 3) => { doc.circle(x, y, r).fillColor(color).fill(); };

      const outlinedBadge = (text, x, y, color) => {
        const w = outlinedBadgeWidth(doc, text);
        const h = 15;
        doc.roundedRect(x, y, w, h, h / 2).lineWidth(0.9).strokeColor(color).stroke();
        dot(x + 10, y + h / 2, color, 2);
        doc.font('Helvetica-Bold').fontSize(7).fillColor(color).text(text, x + 16, y + 4.2, { characterSpacing: 0.6 });
        return w;
      };

      const goldGradFill = (x1, y1, x2, y2) => {
        const g = doc.linearGradient(x1, y1, x2, y2);
        g.stop(0, COLORS.goldLight).stop(1, COLORS.goldDeep);
        return g;
      };

      const progressBar = (x, y, w, h, pct, color, useGrad) => {
        doc.roundedRect(x, y, w, h, h / 2).fillColor(COLORS.lineSoft).fill();
        const fillW = Math.max((pct / 100) * w, pct > 0 ? h : 0);
        if (fillW > 0) {
          doc.save();
          doc.roundedRect(x, y, w, h, h / 2).clip();
          if (useGrad) doc.rect(x, y, fillW, h).fill(goldGradFill(x, y, x + fillW, y));
          else doc.rect(x, y, fillW, h).fillColor(color).fill();
          doc.restore();
        }
      };

      const kicker = (text, x, y, color = COLORS.gold) => {
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor(color)
          .text(text.toUpperCase(), x, y, { characterSpacing: 1.8 });
      };

      const sectionHeading = (label, y) => {
        doc.font('Times-Bold').fontSize(15).fillColor(COLORS.navy).text(label, MARGIN, y);
        const lineY = doc.y + 6;
        doc.moveTo(MARGIN, lineY).lineTo(MARGIN + 34, lineY).lineWidth(2).strokeColor(COLORS.gold).stroke();
        return lineY + 16;
      };

      let lastActivePageIndex = 0;
      const markPageActive = () => {
        lastActivePageIndex = doc._pageBuffer.length - 1;
      };

      const checkBreak = (needed, currentY, headerH = 48) => {
        if (currentY + needed > FOOTER_Y - 10) {
          if (currentY > MARGIN + headerH) {
            doc.addPage({ autoPageBreaks: false });
            markPageActive();
          }
          return MARGIN + headerH;
        }
        return currentY;
      };

      // ═══════════════════════════════════════════════════
      // PAGE 1 — COVER
      // ═══════════════════════════════════════════════════
      const coverGrad = doc.linearGradient(0, 0, PAGE_W, PAGE_H);
      coverGrad.stop(0, COLORS.navy).stop(1, COLORS.navyDeep);
      doc.rect(0, 0, PAGE_W, PAGE_H).fill(coverGrad);
      markPageActive();

      // faint corner ring motif (subtle luxury texture)
      doc.save();
      doc.circle(PAGE_W - 40, 60, 130).lineWidth(0.75).strokeColor(COLORS.gold).strokeOpacity(0.16).stroke();
      doc.circle(PAGE_W - 40, 60, 165).lineWidth(0.75).strokeColor(COLORS.gold).strokeOpacity(0.1).stroke();
      doc.strokeOpacity(1);
      doc.restore();

      // top hairline + brand
      doc.rect(MARGIN, 56, 30, 30).lineWidth(1).strokeColor(COLORS.gold).stroke();
      doc.font('Times-Bold').fontSize(15).fillColor(COLORS.gold).text('C', MARGIN, 63, { width: 30, align: 'center' });
      kicker('CodeMind', MARGIN + 42, 63);
      doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.faint)
        .text('AI-Powered Code Intelligence', MARGIN + 42, 75, { characterSpacing: 0.4 });

      // Title block
      const titleY = 300;
      doc.font('Helvetica').fontSize(9).fillColor(COLORS.goldLight)
        .text('CONFIDENTIAL AUDIT REPORT', MARGIN, titleY, { characterSpacing: 3 });
      doc.font('Times-Bold').fontSize(40).fillColor(COLORS.white)
        .text('Code Audit', MARGIN, titleY + 16, { lineGap: -4 });
      doc.font('Times-Bold').fontSize(40).fillColor(COLORS.white)
        .text('& Review Report', MARGIN);
      doc.moveDown(0.6);
      doc.font('Helvetica').fontSize(12).fillColor(COLORS.faint)
        .text(`Prepared for ${review.projectId?.name || 'Unknown Project'}`, MARGIN);

      // thin gold hairline
      const hlY = titleY + 150;
      doc.moveTo(MARGIN, hlY).lineTo(PAGE_W - MARGIN, hlY).lineWidth(0.75).strokeColor(COLORS.gold).strokeOpacity(0.5).stroke();
      doc.strokeOpacity(1);

      // meta row (left) + overall score (right)
      const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const metaY = hlY + 24;
      kicker('Audit ID', MARGIN, metaY);
      doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.white).text(review._id.toString().toUpperCase(), MARGIN, metaY + 12);
      kicker('Date Issued', MARGIN, metaY + 40);
      doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.white).text(reviewDate, MARGIN, metaY + 52);
      kicker('Engine', MARGIN, metaY + 80);
      doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.white).text('CodeMind Static + AI Analysis', MARGIN, metaY + 92);

      const scoreBoxX = PAGE_W - MARGIN - 130;
      kicker('Overall Rating', scoreBoxX, metaY, COLORS.goldLight);
      doc.font('Times-Bold').fontSize(56).fillColor(COLORS.gold)
        .text(review.overallScore.toString(), scoreBoxX, metaY + 12, { width: 130, align: 'right' });
      doc.font('Helvetica').fontSize(8).fillColor(COLORS.faint)
        .text('OUT OF 100', scoreBoxX, metaY + 78, { width: 130, align: 'right', characterSpacing: 1 });

      // footer
      doc.moveTo(MARGIN, FOOTER_Y).lineTo(PAGE_W - MARGIN, FOOTER_Y).lineWidth(0.5).strokeColor(COLORS.navySoft).stroke();
      doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.faint)
        .text('CONFIDENTIAL \u2014 FOR AUTHORIZED REVIEW ONLY', MARGIN, FOOTER_Y + 8);
      doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.faint)
        .text('codemind.ai', PAGE_W - MARGIN - 100, FOOTER_Y + 8, { width: 100, align: 'right' });

      // ═══════════════════════════════════════════════════
      // PAGE 2 — EXECUTIVE SUMMARY & METRICS
      // ═══════════════════════════════════════════════════
      doc.addPage();
      markPageActive();
      let y = MARGIN + 6;
      kicker('Section 01', MARGIN, y);
      y = sectionHeading('Executive Summary', y + 12);

      // sub-score cards row
      const cardGap = 12;
      const cardW = (CONTENT_W - cardGap * 3) / 4;
      const cardH = 92;
      const scores = [
        { label: 'Overall', value: review.overallScore, hero: true },
        { label: 'Quality', value: review.qualityScore ?? 100 },
        { label: 'Security', value: review.securityScore ?? 100 },
        { label: 'Performance', value: review.performanceScore ?? 100 }
      ];
      scores.forEach((s, i) => {
        const cx = MARGIN + i * (cardW + cardGap);
        if (s.hero) {
          card(cx, y, cardW, cardH, 8, goldGradFill(cx, y, cx, y + cardH));
          doc.font('Helvetica-Bold').fontSize(7).fillColor(COLORS.navy)
            .text('OVERALL', cx + 12, y + 14, { characterSpacing: 1 });
          doc.font('Times-Bold').fontSize(30).fillColor(COLORS.navy).text(s.value.toString(), cx + 12, y + 30);
          doc.font('Helvetica').fontSize(7).fillColor(COLORS.navySoft).text('/ 100', cx + 12, y + 68, { characterSpacing: 0.5 });
        } else {
          card(cx, y, cardW, cardH, 8, COLORS.cardBg, COLORS.line);
          doc.font('Helvetica-Bold').fontSize(7).fillColor(COLORS.muted)
            .text(s.label.toUpperCase(), cx + 12, y + 14, { characterSpacing: 1 });
          doc.font('Times-Bold').fontSize(24).fillColor(COLORS.ink).text(s.value.toString(), cx + 12, y + 30);
          doc.font('Helvetica').fontSize(7).fillColor(COLORS.faint).text('/ 100', cx + 12, y + 58, { characterSpacing: 0.5 });
          const barColor = s.label === 'Security' && s.value < 85 ? COLORS.critical : COLORS.gold;
          progressBar(cx + 12, y + cardH - 18, cardW - 24, 4, s.value, barColor);
        }
      });

      // maintainability + AI summary row
      y += cardH + 24;
      kicker('Analysis', MARGIN, y);
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.ink)
        .text('AI Executive Summary', MARGIN, y + 12);
      const mScoreX = PAGE_W - MARGIN - 160;
      doc.font('Helvetica-Bold').fontSize(7).fillColor(COLORS.muted)
        .text('MAINTAINABILITY', mScoreX, y, { width: 160, align: 'right', characterSpacing: 1 });
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink)
        .text(`${review.maintainabilityScore ?? 100}/100`, mScoreX, y + 12, { width: 160, align: 'right' });

      y += 34;
      const summaryText = review.aiSummary || '';
      const summaryH = doc.font('Helvetica').fontSize(9.5).heightOfString(summaryText, { width: CONTENT_W - 34, lineGap: 3.5 });
      const summaryBoxH = summaryH + 30;
      card(MARGIN, y, CONTENT_W, summaryBoxH, 8, COLORS.panelBg);
      accentStrip(MARGIN, y, CONTENT_W, summaryBoxH, COLORS.gold, 8);
      doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.body)
        .text(summaryText, MARGIN + 18, y + 15, { width: CONTENT_W - 34, lineGap: 3.5, align: 'justify' });

      // severity distribution
      y = y + summaryBoxH + 30;
      kicker('Section 02', MARGIN, y);
      y = sectionHeading('Issue Severity Distribution', y + 12);

      let severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
      if (review.bugs?.length) {
        review.bugs.forEach(bug => {
          const sev = (bug.severity || 'low').toLowerCase();
          if (severityCounts[sev] !== undefined) severityCounts[sev]++;
        });
      }
      const maxCount = Math.max(...Object.values(severityCounts), 1);
      const chartItems = [
        { label: 'Critical', count: severityCounts.critical, color: COLORS.critical },
        { label: 'High', count: severityCounts.high, color: COLORS.high },
        { label: 'Medium', count: severityCounts.medium, color: COLORS.medium },
        { label: 'Low', count: severityCounts.low, color: COLORS.low }
      ];
      chartItems.forEach((item, i) => {
        const itemY = y + i * 28;
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.ink).text(item.label.toUpperCase(), MARGIN, itemY, { characterSpacing: 0.5 });
        progressBar(MARGIN + 110, itemY - 1.5, CONTENT_W - 110 - 55, 8, (item.count / maxCount) * 100, item.color);
        doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.muted)
          .text(`${item.count} issue${item.count === 1 ? '' : 's'}`, PAGE_W - MARGIN - 55, itemY + 1, { width: 55, align: 'right' });
      });

      // ═══════════════════════════════════════════════════
      // PAGE 3+ — DETAILED FINDINGS
      // ═══════════════════════════════════════════════════
      if (review.bugs?.length) {
        doc.addPage({ autoPageBreaks: false });
        markPageActive();
        let cy = MARGIN + 6;
        kicker('Section 03', MARGIN, cy);
        cy = sectionHeading('Detailed Findings & Remediation', cy + 12);
        doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.muted)
          .text(`${review.bugs.length} issue${review.bugs.length === 1 ? '' : 's'} identified across the codebase, ordered by discovery.`, MARGIN, cy);
        cy += 26;

        review.bugs.forEach((bug, index) => {
          const sevUpper = (bug.severity || 'low').toUpperCase();
          const style = SEVERITY_STYLE[sevUpper] || SEVERITY_STYLE.LOW;
          const targetCode = (bug.targetCode || '').trim();
          const fixedCode = (bug.fixedCode || '').trim();
          const codePad = 18;

          // 1. Calculate heights beforehand
          const titleH = 30; // base height for title row & metadata
          const spacerH = 10; // spacer/padding between sections
          
          doc.font('Helvetica').fontSize(9);
          const descH = doc.heightOfString(bug.description || '', { width: CONTENT_W, lineGap: 2 });
          
          let impactH = 0;
          if (bug.impact) {
            doc.font('Helvetica').fontSize(8.5);
            const th = doc.heightOfString(bug.impact, { width: CONTENT_W - 32 });
            impactH = th + 20 + 14; // card box padding + offset
          }
          
          let codeBlocksH = 0;
          if (targetCode || fixedCode) {
            if (targetCode) {
              doc.font('Courier').fontSize(8);
              const th = doc.heightOfString(targetCode, { width: CONTENT_W - codePad * 2 });
              codeBlocksH += th + 28 + 10;
            }
            if (fixedCode) {
              doc.font('Courier').fontSize(8);
              const th = doc.heightOfString(fixedCode, { width: CONTENT_W - codePad * 2 });
              codeBlocksH += th + 28 + 10;
            }
          } else if (bug.fixSuggestion) {
            doc.font('Helvetica').fontSize(9);
            const th = doc.heightOfString(bug.fixSuggestion, { width: CONTENT_W - 32, lineGap: 1.5 });
            codeBlocksH += th + 26 + 10;
          }

          const totalBugHeight = titleH + spacerH + descH + impactH + codeBlocksH + 20;

          // 2. Single Check and Page Break for the entire bug card
          cy = checkBreak(totalBugHeight, cy);
          doc.y = cy;
          markPageActive();

          // 3. Draw Title Row
          doc.font('Times-Bold').fontSize(11).fillColor(COLORS.ink)
            .text(`${String(index + 1).padStart(2, '0')}`, MARGIN, cy, { continued: true, characterSpacing: 0.5 })
            .font('Helvetica').fontSize(8).fillColor(COLORS.muted).text('   ', { continued: true })
            .font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.ink).text(bug.filePath);
          doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted).text(`Line ${bug.line}`, MARGIN + 26, cy + 14);
          outlinedBadge(sevUpper, PAGE_W - MARGIN - outlinedBadgeWidth(doc, sevUpper), cy - 1, style.fg);

          cy += 30;
          doc.moveTo(MARGIN, cy - 8).lineTo(PAGE_W - MARGIN, cy - 8).lineWidth(0.5).strokeColor(COLORS.lineSoft).stroke();

          // 4. Draw Description
          doc.font('Helvetica').fontSize(9).fillColor(COLORS.body)
            .text(bug.description || '', MARGIN, cy, { width: CONTENT_W, lineGap: 2 });
          cy += descH + 14;

          // 5. Draw Impact
          if (bug.impact) {
            const textH = doc.font('Helvetica').fontSize(8.5).heightOfString(bug.impact, { width: CONTENT_W - 32 });
            const boxH = textH + 20;
            card(MARGIN, cy, CONTENT_W, boxH, 6, style.bg);
            accentStrip(MARGIN, cy, CONTENT_W, boxH, style.fg, 6);
            doc.font('Helvetica-Bold').fontSize(7.5).fillColor(style.fg).text('IMPACT', MARGIN + 16, cy + 9, { characterSpacing: 1 });
            doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.ink)
              .text(bug.impact, MARGIN + 16, cy + 20, { width: CONTENT_W - 32, lineGap: 1.5 });
            cy += boxH + 14;
          }

          // 6. Draw Code Boxes
          if (targetCode || fixedCode) {
            if (targetCode) {
              const th = doc.font('Courier').fontSize(8).heightOfString(targetCode, { width: CONTENT_W - codePad * 2 });
              const blockH = th + 28;
              card(MARGIN, cy, CONTENT_W, blockH, 6, '#FBFBFA', COLORS.line);
              accentStrip(MARGIN, cy, CONTENT_W, blockH, COLORS.critical, 6);
              doc.font('Helvetica-Bold').fontSize(7).fillColor(COLORS.muted)
                .text('ORIGINAL', MARGIN + codePad, cy + 10, { characterSpacing: 1.2 });
              doc.font('Courier').fontSize(8).fillColor(COLORS.body)
                .text(targetCode, MARGIN + codePad, cy + 23, { width: CONTENT_W - codePad * 2 });
              cy += blockH + 10;
            }
            if (fixedCode) {
              const th = doc.font('Courier').fontSize(8).heightOfString(fixedCode, { width: CONTENT_W - codePad * 2 });
              const blockH = th + 28;
              card(MARGIN, cy, CONTENT_W, blockH, 6, COLORS.successBg, '#D2E8DA');
              accentStrip(MARGIN, cy, CONTENT_W, blockH, COLORS.success, 6);
              doc.font('Helvetica-Bold').fontSize(7).fillColor(COLORS.success)
                .text('SUGGESTED CORRECTION', MARGIN + codePad, cy + 10, { characterSpacing: 1.2 });
              doc.font('Courier').fontSize(8).fillColor(COLORS.ink)
                .text(fixedCode, MARGIN + codePad, cy + 23, { width: CONTENT_W - codePad * 2 });
              cy += blockH + 10;
            }
          } else if (bug.fixSuggestion) {
            const th = doc.font('Helvetica').fontSize(9).heightOfString(bug.fixSuggestion, { width: CONTENT_W - 32, lineGap: 1.5 });
            const boxH = th + 26;
            card(MARGIN, cy, CONTENT_W, boxH, 6, COLORS.successBg, '#D2E8DA');
            accentStrip(MARGIN, cy, CONTENT_W, boxH, COLORS.success, 6);
            doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.success)
              .text('RECOMMENDED REMEDIATION', MARGIN + 16, cy + 9, { characterSpacing: 1 });
            doc.font('Helvetica').fontSize(9).fillColor(COLORS.ink)
              .text(bug.fixSuggestion, MARGIN + 16, cy + 20, { width: CONTENT_W - 32, lineGap: 1.5 });
            cy += boxH + 10;
          }

          cy = checkBreak(24, cy);
          cy += 10;
          doc.y = cy;
        });
      }

      // Cleanup trailing unused/blank pages (if any)
      while (doc._pageBuffer.length - 1 > lastActivePageIndex) {
        doc._pageBuffer.pop();
      }

      // ═══════════════════════════════════════════════════
      // HEADERS / FOOTERS on every content page (skip cover)
      // ═══════════════════════════════════════════════════
      const range = doc.bufferedPageRange();
      const totalPages = range.count;

      for (let i = 1; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.save();

        doc.rect(MARGIN, 24, 9, 9).lineWidth(0.9).strokeColor(COLORS.gold).stroke();
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.navy)
          .text('CODEMIND', MARGIN + 16, 25, { characterSpacing: 1.2 });
        doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted)
          .text((review.projectId?.name || '').toUpperCase(), 0, 25, { align: 'center', width: PAGE_W, characterSpacing: 0.5 });
        doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted)
          .text('CODE AUDIT REPORT', PAGE_W - MARGIN - 150, 25, { width: 150, align: 'right', characterSpacing: 0.5 });
        doc.moveTo(MARGIN, 40).lineTo(PAGE_W - MARGIN, 40).lineWidth(0.5).strokeColor(COLORS.line).stroke();

        doc.moveTo(MARGIN, FOOTER_Y).lineTo(PAGE_W - MARGIN, FOOTER_Y).lineWidth(0.5).strokeColor(COLORS.line).stroke();
        doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted)
          .text('CONFIDENTIAL \u2014 FOR AUTHORIZED REVIEW ONLY', MARGIN, FOOTER_Y + 8);
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.navy)
          .text(`${i + 1} / ${totalPages}`, PAGE_W - MARGIN - 60, FOOTER_Y + 8, { width: 60, align: 'right' });

        doc.restore();
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePdfReport };