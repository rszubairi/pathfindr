// Ambient declarations for Node.js-only packages used in Convex server actions.
// These never run in the browser — declarations exist only to satisfy the
// Next.js TypeScript compiler which follows the @convex path alias.
declare module 'pdfkit' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PDFDocument: any;
  export default PDFDocument;
}
