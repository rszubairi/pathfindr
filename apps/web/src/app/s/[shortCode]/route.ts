import { api } from "@convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect, notFound } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  if (!shortCode) {
    notFound();
  }

  const targetPath = await fetchQuery(api.shortUrls.resolveShortCode, { shortCode });

  if (targetPath) {
    // Redirect to the target path (which already includes the language prefix)
    redirect(targetPath);
  } else {
    notFound();
  }
}
