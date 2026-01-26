import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { updateIndustryInsights } from "@/lib/inngest/functions";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [updateIndustryInsights],
});