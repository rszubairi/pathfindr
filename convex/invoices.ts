import { mutation, query, action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

// Returns the next invoice number (starting at 100, displayed as "0100")
export const incrementCounter = mutation({
  args: {},
  handler: async (ctx) => {
    const counters = await ctx.db.query('invoiceCounter').collect();
    if (counters.length === 0) {
      await ctx.db.insert('invoiceCounter', { currentNumber: 100 });
      return 100;
    }
    const counter = counters[0];
    const next = counter.currentNumber + 1;
    await ctx.db.patch(counter._id, { currentNumber: next });
    return next;
  },
});

export const getByXenditInvoiceId = query({
  args: { xenditInvoiceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('invoices')
      .withIndex('by_xendit_invoice_id', (q) => q.eq('xenditInvoiceId', args.xenditInvoiceId))
      .first();
  },
});

export const createInvoice = mutation({
  args: {
    userId: v.id('users'),
    invoiceNumber: v.string(),
    invoiceSequence: v.number(),
    customerName: v.string(),
    customerEmail: v.string(),
    tier: v.union(v.literal('pro'), v.literal('expert')),
    amount: v.number(),
    currency: v.string(),
    periodStart: v.string(),
    periodEnd: v.string(),
    xenditInvoiceId: v.optional(v.string()),
    status: v.union(v.literal('generated'), v.literal('sent'), v.literal('failed')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('invoices', {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateInvoiceStatus = mutation({
  args: {
    invoiceId: v.id('invoices'),
    pdfStorageId: v.optional(v.id('_storage')),
    status: v.union(v.literal('generated'), v.literal('sent'), v.literal('failed')),
  },
  handler: async (ctx, args) => {
    const { invoiceId, ...updates } = args;
    await ctx.db.patch(invoiceId, updates);
  },
});

export const getLatestInvoiceByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('invoices')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .order('desc')
      .first();
  },
});

export const getAllInvoicesByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('invoices')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

// Returns a signed download URL for a stored PDF
export const getInvoiceDownloadUrl = action({
  args: { userId: v.id('users') },
  handler: async (ctx, args): Promise<string | null> => {
    const invoice = await ctx.runQuery(api.invoices.getLatestInvoiceByUser, {
      userId: args.userId,
    });
    if (!invoice?.pdfStorageId) return null;
    return await ctx.storage.getUrl(invoice.pdfStorageId);
  },
});
