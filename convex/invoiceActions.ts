"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';
import { Resend } from 'resend';
import PDFDocument from 'pdfkit';

// ─── Company Details ─────────────────────────────────────────
const COMPANY = {
  name: 'Pathfindr',
  email: 'enquiries@thepathfindr.com',
  phone: '+60 13-299 3439',
  address: '35-1 Jalan PJS 5/30, Petaling Jaya Commercial City,\n46510 Petaling Jaya, Selangor, Malaysia',
  website: 'www.thepathfindr.com',
};

const TIER_CONFIG = {
  pro: { label: 'Pro Plan (Annual)', amount: 45, applicationsLimit: 5 },
  expert: { label: 'Expert Plan (Annual)', amount: 225, applicationsLimit: 20 },
};

// ─── PDF Generation ──────────────────────────────────────────

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
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const primaryColor = '#2563EB';
    const darkText = '#111827';
    const mutedText = '#6B7280';
    const lightBg = '#F3F4F6';
    const borderColor = '#E5E7EB';

    const pageWidth = doc.page.width - 100; // content width with 50px margins on each side

    // ── Header Bar ──────────────────────────────────────────
    doc.rect(50, 40, pageWidth, 70).fill(primaryColor);

    doc
      .fillColor('#FFFFFF')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text(COMPANY.name, 70, 58);

    doc
      .fontSize(9)
      .font('Helvetica')
      .text('Your path to global educational opportunities', 70, 87);

    // ── Company Details (right side of header) ───────────────
    doc
      .fontSize(8)
      .fillColor('#DBEAFE')
      .text(COMPANY.email, 350, 50, { align: 'right', width: pageWidth - 300 })
      .text(COMPANY.phone, 350, 62, { align: 'right', width: pageWidth - 300 })
      .text(COMPANY.website, 350, 74, { align: 'right', width: pageWidth - 300 });

    doc.fillColor(darkText);

    // ── INVOICE Title ────────────────────────────────────────
    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text('INVOICE', 50, 130);

    // Invoice meta (right side)
    const metaX = 350;
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(darkText)
      .text('Invoice Number:', metaX, 130)
      .text('Issue Date:', metaX, 145)
      .text('Due Date:', metaX, 160);

    doc
      .font('Helvetica')
      .fillColor(mutedText)
      .text(data.invoiceNumber, metaX + 90, 130, { align: 'right', width: pageWidth - metaX + 50 })
      .text(formatDate(data.invoiceDate), metaX + 90, 145, { align: 'right', width: pageWidth - metaX + 50 })
      .text(formatDate(data.invoiceDate), metaX + 90, 160, { align: 'right', width: pageWidth - metaX + 50 });

    // Status badge
    doc.rect(metaX, 175, 80, 18).fill('#DCFCE7');
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor('#166534')
      .text('PAID', metaX + 27, 179);

    // ── Divider ──────────────────────────────────────────────
    doc.moveTo(50, 205).lineTo(pageWidth + 50, 205).strokeColor(borderColor).lineWidth(1).stroke();

    // ── Bill To / From ───────────────────────────────────────
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor(mutedText)
      .text('BILL TO', 50, 220)
      .text('FROM', 300, 220);

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor(darkText)
      .text(data.customerName, 50, 235)
      .text(COMPANY.name, 300, 235);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(mutedText)
      .text(data.customerEmail, 50, 250)
      .text(COMPANY.address, 300, 250, { width: 200 });

    // ── Items Table ──────────────────────────────────────────
    const tableTop = 320;

    // Table header
    doc.rect(50, tableTop, pageWidth, 28).fill(primaryColor);

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#FFFFFF')
      .text('Description', 65, tableTop + 9)
      .text('Subscription Period', 250, tableTop + 9)
      .text('Amount', pageWidth - 30, tableTop + 9, { align: 'right', width: 80 });

    // Table row
    const rowTop = tableTop + 28;
    const tierConf = TIER_CONFIG[data.tier];

    doc.rect(50, rowTop, pageWidth, 40).fill(lightBg);

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(darkText)
      .text(tierConf.label, 65, rowTop + 8);

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(mutedText)
      .text(`Up to ${tierConf.applicationsLimit} scholarship applications`, 65, rowTop + 22);

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(mutedText)
      .text(
        `${formatDate(data.periodStart)} –\n${formatDate(data.periodEnd)}`,
        250,
        rowTop + 8,
        { width: 160 }
      );

    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(darkText)
      .text(
        `${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`,
        pageWidth - 30,
        rowTop + 15,
        { align: 'right', width: 80 }
      );

    // ── Totals ────────────────────────────────────────────────
    const totalsTop = rowTop + 60;
    const totalsX = pageWidth - 110;

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(mutedText)
      .text('Subtotal', totalsX, totalsTop)
      .text(`${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`, totalsX + 60, totalsTop, { align: 'right', width: 90 });

    doc
      .moveTo(totalsX, totalsTop + 18)
      .lineTo(pageWidth + 50, totalsTop + 18)
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .stroke();

    // Total box
    doc.rect(totalsX - 10, totalsTop + 24, pageWidth - totalsX + 60, 28).fill(primaryColor);
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#FFFFFF')
      .text('TOTAL', totalsX, totalsTop + 31)
      .text(
        `${data.currency.toUpperCase()} ${data.amount.toFixed(2)}`,
        totalsX + 60,
        totalsTop + 31,
        { align: 'right', width: 90 }
      );

    // ── Notes ─────────────────────────────────────────────────
    const notesTop = totalsTop + 80;

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor(mutedText)
      .text('NOTES', 50, notesTop);

    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor(mutedText)
      .text(
        'Thank you for subscribing to Pathfindr! Your subscription is valid for one year from the issue date above. ' +
        'If you have any questions about this invoice, please contact us at enquiries@thepathfindr.com.',
        50,
        notesTop + 14,
        { width: pageWidth }
      );

    // ── Footer ────────────────────────────────────────────────
    doc
      .moveTo(50, 750)
      .lineTo(pageWidth + 50, 750)
      .strokeColor(borderColor)
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(7)
      .font('Helvetica')
      .fillColor(mutedText)
      .text(
        `${COMPANY.name}  •  ${COMPANY.email}  •  ${COMPANY.phone}  •  ${COMPANY.address.replace('\n', ', ')}`,
        50,
        758,
        { align: 'center', width: pageWidth }
      );

    doc.end();
  });
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
    // Deduplication: if we already have an invoice for this Xendit invoice, skip
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

    // Get next invoice number (atomic increment)
    const seq: number = await ctx.runMutation(api.invoices.incrementCounter, {});
    const invoiceNumber = formatInvoiceNumber(seq);

    // Create invoice record (without PDF yet)
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

    // Generate PDF
    let pdfBuffer: Buffer;
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
    } catch (err) {
      console.error('PDF generation failed:', err);
      await ctx.runMutation(api.invoices.updateInvoiceStatus, {
        invoiceId,
        status: 'failed',
      });
      return { invoiceNumber, success: false };
    }

    // Store PDF in Convex file storage for audit
    const blob = new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' });
    const pdfStorageId = await ctx.storage.store(blob);

    await ctx.runMutation(api.invoices.updateInvoiceStatus, {
      invoiceId,
      pdfStorageId,
      status: 'sent',
    });

    // Build email HTML
    const whatsappLink = 'https://chat.whatsapp.com/L8h933w4nVP8yB6jXm1T7H?mode=gi_t';
    const subject = `Your Pathfindr Invoice ${invoiceNumber} – ${tierConf.label}`;
    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F9FAFB;margin:0;padding:0;">
  <div style="max-width:600px;margin:32px auto;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <!-- Header -->
    <div style="background:#2563EB;padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Pathfindr</h1>
      <p style="color:#BFDBFE;margin:4px 0 0;font-size:13px;">Your path to global educational opportunities</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="color:#111827;font-size:18px;margin:0 0 8px;">Payment Confirmed!</h2>
      <p style="color:#4B5563;font-size:14px;margin:0 0 24px;">Hi ${user.fullName}, thank you for subscribing to Pathfindr. Your invoice is attached to this email.</p>

      <!-- Invoice Summary Card -->
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

      <!-- What you get -->
      <h3 style="color:#111827;font-size:14px;margin:0 0 12px;">Your subscription includes:</h3>
      <ul style="color:#4B5563;font-size:13px;padding-left:20px;margin:0 0 24px;">
        <li style="margin-bottom:6px;">Up to <strong>${tierConf.applicationsLimit} scholarship applications</strong></li>
        <li style="margin-bottom:6px;">Unlimited scholarship notifications</li>
        <li style="margin-bottom:6px;">Priority internship applications</li>
        <li style="margin-bottom:6px;">Exclusive career development resources</li>
      </ul>

      <!-- WhatsApp CTA -->
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="color:#166534;font-size:13px;font-weight:600;margin:0 0 8px;">Join our exclusive community</p>
        <p style="color:#4B5563;font-size:12px;margin:0 0 12px;">Connect with other students, get real-time updates and scholarship tips.</p>
        <a href="${whatsappLink}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">Join WhatsApp Group</a>
      </div>

      <p style="color:#6B7280;font-size:12px;margin:0;">If you have any questions, reply to this email or contact us at <a href="mailto:${COMPANY.email}" style="color:#2563EB;">${COMPANY.email}</a> or call ${COMPANY.phone}.</p>
    </div>

    <!-- Footer -->
    <div style="background:#F9FAFB;padding:16px 32px;border-top:1px solid #E5E7EB;text-align:center;">
      <p style="color:#9CA3AF;font-size:11px;margin:0;">${COMPANY.name} • ${COMPANY.email} • ${COMPANY.phone}</p>
      <p style="color:#9CA3AF;font-size:11px;margin:4px 0 0;">35-1 Jalan PJS 5/30, Petaling Jaya Commercial City, 46510 Petaling Jaya, Selangor, Malaysia</p>
    </div>
  </div>
</body>
</html>`;

    // Send email with PDF attachment
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Pathfindr <noreply@thepathfindr.com>',
          to: user.email,
          subject,
          html: emailHtml,
          attachments: [
            {
              filename: `${invoiceNumber}.pdf`,
              content: pdfBuffer.toString('base64'),
            },
          ],
        });

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
    } else {
      console.log(`[DEV] Invoice ${invoiceNumber} generated for ${user.email} (no RESEND_API_KEY)`);
    }

    return { invoiceNumber, success: true };
  },
});
