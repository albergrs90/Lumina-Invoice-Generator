import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Professional WYSIWYG PDF Export Service
 * 
 * Key principles:
 * 1. Capture element at its ACTUAL rendered width (794px = A4 at 96dpi)
 * 2. Scale image to fill A4 width (210mm) with proper margins
 * 3. Single page for short invoices, paginate only when content exceeds A4 height
 * 4. No content compression or clipping
 */
export const exportToPdf = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;
    }

    try {
        // Ensure all fonts are loaded
        await document.fonts.ready;
        // Wait a bit more for any layout shifts to settle
        await new Promise(resolve => setTimeout(resolve, 1000));

        // ─── A4 Metrics ───
        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;
        const MARGIN_MM = 10;
        const PRINT_WIDTH_MM = A4_WIDTH_MM - (MARGIN_MM * 2);

        // 96 PPI is the standard for browser rendering
        // A4 at 96 PPI is ~794px width
        const TARGET_EL_WIDTH_PX = 794;

        // ─── Capture ───
        const canvas = await html2canvas(element, {
            scale: 2, // High DPI for crisp text
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            // Force a wide viewport so Tailwind 'lg' or 'md' breakpoints don't collapse
            windowWidth: 1200,
            width: TARGET_EL_WIDTH_PX,
            // REMOVED fixed height to allow onclone overrides (min-h: auto) to work
            onclone: (clonedDoc) => {
                const el = clonedDoc.getElementById(elementId);
                if (el) {
                    // Force the element to its base size to ensure 1:1 layout
                    el.style.width = `${TARGET_EL_WIDTH_PX}px`;
                    el.style.minWidth = `${TARGET_EL_WIDTH_PX}px`;
                    el.style.maxWidth = `${TARGET_EL_WIDTH_PX}px`;
                    el.style.margin = '0';
                    el.style.padding = '40px'; // Maintain the internal padding
                    el.style.transform = 'none';
                    el.style.transition = 'none';
                    el.style.height = 'auto';
                    el.style.minHeight = 'auto';
                    el.style.overflow = 'visible';

                    // Force text rendering quality
                    el.style.textRendering = 'geometricPrecision';
                    (el.style as any).webkitFontSmoothing = 'antialiased';
                }

                // Add a style tag to the cloned document to fix potential font/overlap issues
                const style = clonedDoc.createElement('style');
                style.innerHTML = `
                    * { 
                        transition: none !important; 
                        animation: none !important; 
                        box-shadow: none !important;
                    }
                    body { background: white !important; width: 1200px !important; }
                `;
                clonedDoc.head.appendChild(style);
            }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Ratio mapping: Map the captured pixels to 190mm (printable A4 width)
        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;
        const imgHeightMm = (imgHeightPx * PRINT_WIDTH_MM) / imgWidthPx;

        // ─── Row Detection (Smart Break) ───
        const rows = element.querySelectorAll('tbody tr');
        const scaleFactor = PRINT_WIDTH_MM / TARGET_EL_WIDTH_PX;
        const elTop = element.getBoundingClientRect().top;
        const rowBottomsMm = Array.from(rows).map(row => {
            const rect = (row as HTMLElement).getBoundingClientRect();
            return (rect.bottom - elTop) * scaleFactor;
        });

        // ─── Pagination Logic ───
        const availableHeightMm = A4_HEIGHT_MM - (MARGIN_MM * 2);
        let heightLeftMm = imgHeightMm;
        let positionMm = 0;
        let pageNum = 1;

        // 🟢 RULE 1: SINGLE PAGE BYPASS
        // If it fits in roughly one page (up to 285mm), don't loop or slice.
        if (heightLeftMm <= 285) {
            pdf.addImage(
                imgData,
                'JPEG',
                MARGIN_MM,
                MARGIN_MM,
                PRINT_WIDTH_MM,
                imgHeightMm,
                undefined,
                'FAST'
            );
        } else {
            // 🔴 MULTI-PAGE LOOP
            while (heightLeftMm > 2) {
                if (pageNum > 1) pdf.addPage();

                pdf.addImage(
                    imgData,
                    'JPEG',
                    MARGIN_MM,
                    MARGIN_MM - positionMm,
                    PRINT_WIDTH_MM,
                    imgHeightMm,
                    undefined,
                    'FAST'
                );

                // White masks for clean margins
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, A4_WIDTH_MM, MARGIN_MM, 'F'); // Top
                pdf.rect(0, A4_HEIGHT_MM - MARGIN_MM, A4_WIDTH_MM, MARGIN_MM, 'F'); // Bottom
                pdf.rect(0, 0, MARGIN_MM, A4_HEIGHT_MM, 'F'); // Left
                pdf.rect(A4_WIDTH_MM - MARGIN_MM, 0, MARGIN_MM, A4_HEIGHT_MM, 'F'); // Right

                // Decision: Does the rest fit on THIS current page?
                if (heightLeftMm <= availableHeightMm + 1) {
                    break;
                }

                // Calculate next safe jump (Smart Break)
                let nextStepMm = availableHeightMm;
                const absoluteBreakTarget = positionMm + availableHeightMm;

                // Find row bottoms that fit in this page
                const validBreaks = rowBottomsMm.filter(b => b > positionMm + 30 && b <= absoluteBreakTarget);

                if (validBreaks.length > 0) {
                    const bestBreak = Math.max(...validBreaks);
                    nextStepMm = bestBreak - positionMm;
                }

                // Mask anything below the break on this page
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, MARGIN_MM + nextStepMm, A4_WIDTH_MM, A4_HEIGHT_MM - (MARGIN_MM + nextStepMm), 'F');

                heightLeftMm -= nextStepMm;
                positionMm += nextStepMm;
                pageNum++;

                if (pageNum > 20) break; // Safety
            }
        }

        pdf.save(fileName);
    } catch (error) {
        console.error('Error in PDF Generation:', error);
    }
};
