"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';
import { Resend } from 'resend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ─── Company Details ─────────────────────────────────────────
const COMPANY = {
  name: 'Pathfindr',
  email: 'enquiries@thepathfindr.com',
  phone: '+60 13-299 3439',
  address: '35-1 Jalan PJS 5/30, Petaling Jaya Commercial City, 46510 Petaling Jaya, Selangor, Malaysia',
  website: 'www.thepathfindr.com',
};

const TIER_CONFIG = {
  pro: { label: 'Pro Plan (Annual)', amount: 45, applicationsLimit: 5 },
  expert: { label: 'Expert Plan (Annual)', amount: 225, applicationsLimit: 20 },
};

// ─── Helpers ─────────────────────────────────────────────────

function formatInvoiceNumber(seq: number): string {
  return `INV-${String(seq).padStart(4, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function hex(h: string): [number, number, number] {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

// ─── PDF Generation (pdf-lib — no font files needed) ─────────

async function generateInvoicePdf(data: {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  tier: 'pro' | 'expert';
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
}): Promise<Buffer> {
  const tierConf = TIER_CONFIG[data.tier];

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primary = rgb(...hex('#2563EB'));
  const white = rgb(1, 1, 1);
  const dark = rgb(...hex('#111827'));
  const muted = rgb(...hex('#6B7280'));
  const lightBlue = rgb(...hex('#EFF6FF'));
  const lightGreen = rgb(...hex('#DCFCE7'));
  const green = rgb(...hex('#166534'));
  const lightGray = rgb(...hex('#F3F4F6'));
  const borderGray = rgb(...hex('#E5E7EB'));

  const margin = 50;
  const contentWidth = width - margin * 2;

  // ── Header bar ────────────────────────────────────────────
  page.drawRectangle({ x: margin, y: height - 120, width: contentWidth, height: 70, color: primary });

  page.drawText(COMPANY.name, { x: 70, y: height - 70, font: fontBold, size: 22, color: white });
  page.drawText('Your path to global educational opportunities', { x: 70, y: height - 90, font: fontRegular, size: 9, color: rgb(0.75, 0.85, 0.98) });

  page.drawText(COMPANY.email, { x: width - margin - 200, y: height - 60, font: fontRegular, size: 8, color: rgb(0.75, 0.85, 0.98) });
  page.drawText(COMPANY.phone, { x: width - margin - 200, y: height - 72, font: fontRegular, size: 8, color: rgb(0.75, 0.85, 0.98) });
  page.drawText(COMPANY.website, { x: width - margin - 200, y: height - 84, font: fontRegular, size: 8, color: rgb(0.75, 0.85, 0.98) });

  // ── INVOICE title ─────────────────────────────────────────
  page.drawText('INVOICE', { x: margin, y: height - 155, font: fontBold, size: 26, color: primary });

  // Invoice meta
  const metaLabelX = 350;
  const metaValueX = 460;
  const metaY = height - 155;

  page.drawText('Invoice Number:', { x: metaLabelX, y: metaY, font: fontBold, size: 8, color: dark });
  page.drawText('Issue Date:', { x: metaLabelX, y: metaY - 14, font: fontBold, size: 8, color: dark });
  page.drawText('Due Date:', { x: metaLabelX, y: metaY - 28, font: fontBold, size: 8, color: dark });

  page.drawText(data.invoiceNumber, { x: metaValueX, y: metaY, font: fontRegular, size: 8, color: muted });
  page.drawText(formatDate(data.invoiceDate), { x: metaValueX, y: metaY - 14, font: fontRegular, size: 8, color: muted });
  page.drawText(formatDate(data.invoiceDate), { x: metaValueX, y: metaY - 28, font: fontRegular, size: 8, color: muted });

  // PAID badge
  page.drawRectangle({ x: metaLabelX, y: metaY - 55, width: 60, height: 16, color: lightGreen });
  page.drawText('PAID', { x: metaLabelX + 17, y: metaY - 50, font: fontBold, size: 8, color: green });

  // ── Divider ───────────────────────────────────────────────
  page.drawLine({ start: { x: margin, y: height - 225 }, end: { x: width - margin, y: height - 225 }, thickness: 0.5, color: borderGray });

  // ── Bill To / From ────────────────────────────────────────
  const sectionY = height - 250;

  page.drawText('BILL TO', { x: margin, y: sectionY, font: fontBold, size: 8, color: muted });
  page.drawText('FROM', { x: 310, y: sectionY, font: fontBold, size: 8, color: muted });

  page.drawText(data.customerName, { x: margin, y: sectionY - 16, font: fontBold, size: 10, color: dark });
  page.drawText(COMPANY.name, { x: 310, y: sectionY - 16, font: fontBold, size: 10, color: dark });

  page.drawText(data.customerEmail, { x: margin, y: sectionY - 30, font: fontRegular, size: 9, color: muted });

  // Company address (two lines)
  const addrLine1 = '35-1 Jalan PJS 5/30, Petaling Jaya Commercial City,';
  const addrLine2 = '46510 Petaling Jaya, Selangor, Malaysia';
  page.drawText(addrLine1, { x: 310, y: sectionY - 30, font: fontRegular, size: 8, color: muted });
  page.drawText(addrLine2, { x: 310, y: sectionY - 42, font: fontRegular, size: 8, color: muted });

  // ── Items table ───────────────────────────────────────────
  const tableY = height - 355;
  const tableHeaderH = 24;
  const rowH = 44;

  // Header
  page.drawRectangle({ x: margin, y: tableY, width: contentWidth, height: tableHeaderH, color: primary });
  page.drawText('Description', { x: 65, y: tableY + 8, font: fontBold, size: 9, color: white });
  page.drawText('Subscription Period', { x: 260, y: tableY + 8, font: fontBold, size: 9, color: white });
  page.drawText('Amount', { x: width - margin - 70, y: tableY + 8, font: fontBold, size: 9, color: white });

  // Row
  const rowY = tableY - rowH;
  page.drawRectangle({ x: margin, y: rowY, width: contentWidth, height: rowH, color: lightGray });

  page.drawText(tierConf.label, { x: 65, y: rowY + rowH - 14, font: fontBold, size: 9, color: dark });
  page.drawText(`Up to ${tierConf.applicationsLimit} scholarship applications`, { x: 65, y: rowY + rowH - 28, font: fontRegular, size: 8, color: muted });

  page.drawText(formatDate(data.periodStart), { x: 260, y: rowY + rowH - 14, font: fontRegular, size: 8, color: muted });
  page.drawText(`to ${formatDate(data.periodEnd)}`, { x: 260, y: rowY + rowH - 26, font: fontRegular, size: 8, color: muted });

  const amountStr = `${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`;
  const amountW = fontBold.widthOfTextAtSize(amountStr, 9);
  page.drawText(amountStr, { x: width - margin - amountW, y: rowY + rowH - 20, font: fontBold, size: 9, color: dark });

  // ── Totals ────────────────────────────────────────────────
  const totalsY = rowY - 55;
  const totalsX = width - margin - 160;

  page.drawText('Subtotal', { x: totalsX, y: totalsY + 16, font: fontRegular, size: 9, color: muted });
  const subtotalStr = `${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`;
  const subtotalW = fontRegular.widthOfTextAtSize(subtotalStr, 9);
  page.drawText(subtotalStr, { x: width - margin - subtotalW, y: totalsY + 16, font: fontRegular, size: 9, color: muted });

  page.drawLine({ start: { x: totalsX, y: totalsY + 10 }, end: { x: width - margin, y: totalsY + 10 }, thickness: 0.5, color: borderGray });

  // Total box
  page.drawRectangle({ x: totalsX - 8, y: totalsY - 18, width: width - margin - totalsX + 8, height: 24, color: primary });
  page.drawText('TOTAL', { x: totalsX, y: totalsY - 12, font: fontBold, size: 10, color: white });
  const totalStr = `${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`;
  const totalW = fontBold.widthOfTextAtSize(totalStr, 10);
  page.drawText(totalStr, { x: width - margin - totalW, y: totalsY - 12, font: fontBold, size: 10, color: white });

  // ── Notes ─────────────────────────────────────────────────
  const notesY = totalsY - 60;
  page.drawText('NOTES', { x: margin, y: notesY, font: fontBold, size: 8, color: muted });
  page.drawText(
    'Thank you for subscribing to Pathfindr! Your subscription is valid for one year from the issue date.',
    { x: margin, y: notesY - 14, font: fontRegular, size: 8, color: muted }
  );
  page.drawText(
    `For any queries, contact us at ${COMPANY.email} or ${COMPANY.phone}.`,
    { x: margin, y: notesY - 26, font: fontRegular, size: 8, color: muted }
  );

  // ── Footer ────────────────────────────────────────────────
  page.drawLine({ start: { x: margin, y: 60 }, end: { x: width - margin, y: 60 }, thickness: 0.5, color: borderGray });
  const footerText = `${COMPANY.name}  •  ${COMPANY.email}  •  ${COMPANY.phone}  •  ${COMPANY.address}`;
  const footerW = fontRegular.widthOfTextAtSize(footerText, 7);
  page.drawText(footerText, { x: (width - footerW) / 2, y: 46, font: fontRegular, size: 7, color: muted });

  // Indicate the lightBlue variable is used (suppress unused var)
  void lightBlue;

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ─── Main Invoice Action ─────────────────────────────────────

export const generateAndSendInvoice = action({
  args: {
    userId: v.id('users'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
    periodStart: v.string(),
    periodEnd: v.string(),
    xenditInvoiceId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ invoiceNumber: string; success: boolean }> => {
    // Deduplication: skip if invoice already exists for this Xendit payment
    if (args.xenditInvoiceId) {
      const existing = await ctx.runQuery(api.invoices.getByXenditInvoiceId, {
        xenditInvoiceId: args.xenditInvoiceId,
      });
      if (existing) {
        return { invoiceNumber: existing.invoiceNumber, success: true };
      }
    }

    const user = await ctx.runQuery(api.auth.getCurrentUser, { userId: args.userId });
    if (!user) throw new Error('User not found');

    const resendApiKey = process.env.RESEND_API_KEY;
    const tierConf = TIER_CONFIG[args.tier];
    const now = new Date().toISOString();

    const seq: number = await ctx.runMutation(api.invoices.incrementCounter, {});
    const invoiceNumber = formatInvoiceNumber(seq);

    const invoiceId: Id<'invoices'> = await ctx.runMutation(api.invoices.createInvoice, {
      userId: args.userId,
      invoiceNumber,
      invoiceSequence: seq,
      customerName: user.fullName,
      customerEmail: user.email,
      tier: args.tier,
      amount: tierConf.amount,
      currency: 'MYR',
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      xenditInvoiceId: args.xenditInvoiceId,
      status: 'generated',
    });

    // Generate PDF — failure does NOT block the email
    let pdfBuffer: Buffer | null = null;
    let pdfStorageId: Id<'_storage'> | undefined;

    try {
      pdfBuffer = await generateInvoicePdf({
        invoiceNumber,
        invoiceDate: now,
        customerName: user.fullName,
        customerEmail: user.email,
        tier: args.tier,
        amount: tierConf.amount,
        currency: 'MYR',
        periodStart: args.periodStart,
        periodEnd: args.periodEnd,
      });

      const blob = new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' });
      pdfStorageId = await ctx.storage.store(blob);

      await ctx.runMutation(api.invoices.updateInvoiceStatus, {
        invoiceId,
        pdfStorageId,
        status: 'generated',
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      // Continue — email still goes out without attachment
    }

    if (!resendApiKey) {
      console.log(`[DEV] Invoice ${invoiceNumber} for ${user.email} — set RESEND_API_KEY to send email`);
      return { invoiceNumber, success: true };
    }

    // Build email
    const whatsappLink = 'https://chat.whatsapp.com/L8h933w4nVP8yB6jXm1T7H?mode=gi_t';
    const subject = `Your Pathfindr Invoice ${invoiceNumber} – ${tierConf.label}`;
    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F9FAFB;margin:0;padding:0;">
  <div style="max-width:600px;margin:32px auto;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:#2563EB;padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Pathfindr</h1>
      <p style="color:#BFDBFE;margin:4px 0 0;font-size:13px;">Your path to global educational opportunities</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#111827;font-size:18px;margin:0 0 8px;">Payment Confirmed!</h2>
      <p style="color:#4B5563;font-size:14px;margin:0 0 24px;">Hi ${user.fullName}, thank you for subscribing to Pathfindr. ${pdfBuffer ? 'Your invoice is attached to this email.' : 'Your invoice details are below.'}</p>
      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse;">
          <tr>
            <td style="padding:4px 0;color:#6B7280;">Invoice Number</td>
            <td style="padding:4px 0;text-align:right;font-weight:600;">${invoiceNumber}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6B7280;">Plan</td>
            <td style="padding:4px 0;text-align:right;">${tierConf.label}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6B7280;">Valid Period</td>
            <td style="padding:4px 0;text-align:right;">${formatDate(args.periodStart)} – ${formatDate(args.periodEnd)}</td>
          </tr>
          <tr style="border-top:1px solid #BFDBFE;">
            <td style="padding:10px 0 4px;font-weight:700;color:#111827;">Total Paid</td>
            <td style="padding:10px 0 4px;text-align:right;font-weight:700;color:#2563EB;font-size:16px;">MYR ${tierConf.amount.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      <h3 style="color:#111827;font-size:14px;margin:0 0 12px;">Your subscription includes:</h3>
      <ul style="color:#4B5563;font-size:13px;padding-left:20px;margin:0 0 24px;">
        <li style="margin-bottom:6px;">Up to <strong>${tierConf.applicationsLimit} scholarship applications</strong></li>
        <li style="margin-bottom:6px;">Unlimited scholarship notifications</li>
        <li style="margin-bottom:6px;">Priority internship applications</li>
        <li style="margin-bottom:6px;">Exclusive career development resources</li>
      </ul>
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="color:#166534;font-size:13px;font-weight:600;margin:0 0 8px;">Join our exclusive community</p>
        <p style="color:#4B5563;font-size:12px;margin:0 0 12px;">Connect with other students, get real-time updates and scholarship tips.</p>
        <a href="${whatsappLink}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">Join WhatsApp Group</a>
      </div>
      <p style="color:#6B7280;font-size:12px;margin:0;">Questions? Email <a href="mailto:${COMPANY.email}" style="color:#2563EB;">${COMPANY.email}</a> or call ${COMPANY.phone}.</p>
    </div>
    <div style="background:#F9FAFB;padding:16px 32px;border-top:1px solid #E5E7EB;text-align:center;">
      <p style="color:#9CA3AF;font-size:11px;margin:0;">${COMPANY.name}  •  ${COMPANY.email}  •  ${COMPANY.phone}</p>
      <p style="color:#9CA3AF;font-size:11px;margin:4px 0 0;">35-1 Jalan PJS 5/30, Petaling Jaya Commercial City, 46510 Petaling Jaya, Selangor, Malaysia</p>
    </div>
  </div>
</body>
</html>`;

    try {
      const resend = new Resend(resendApiKey);
      const emailPayload: Parameters<typeof resend.emails.send>[0] = {
        from: 'Pathfindr <noreply@thepathfindr.com>',
        to: user.email,
        subject,
        html: emailHtml,
      };

      if (pdfBuffer) {
        emailPayload.attachments = [{
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer.toString('base64'),
        }];
      }

      const sendResult = await resend.emails.send(emailPayload);
      if (sendResult.error) throw new Error(sendResult.error.message);

      await ctx.runMutation(api.invoices.updateInvoiceStatus, { invoiceId, status: 'sent' });
      await ctx.runMutation(api.emailLogs.createLog, {
        recipientEmail: user.email,
        subject,
        body: emailHtml,
        userId: args.userId,
        type: 'invoice',
        status: 'sent',
      });
    } catch (err) {
      console.error('Invoice email failed:', err);
      await ctx.runMutation(api.emailLogs.createLog, {
        recipientEmail: user.email,
        subject,
        body: 'ERROR: Failed to send',
        userId: args.userId,
        type: 'invoice',
        status: 'failed',
        error: String(err),
      });
    }

    return { invoiceNumber, success: true };
  },
});
