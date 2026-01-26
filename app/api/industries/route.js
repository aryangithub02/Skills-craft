import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { industries as canonicalIndustries } from "@/data/industries";
import { mapToInsightCategory } from "@/lib/industry-mapper";

export async function GET(request) {
  try {
    const dbIndustries = await db.industryInsight.findMany({
      select: {
        industry: true,
      },
    });

    // Extract names from DB and map slugs to proper categories
    const dbNames = dbIndustries.map(i => mapToInsightCategory(i.industry) || i.industry);

    // Combine with all canonical industries to ensure a complete list
    const canonicalNames = canonicalIndustries.map(ind => ind.name);

    // Create a unique list of clean names
    const allUniqueNames = [...new Set([...canonicalNames, ...dbNames])]
      .filter(name => {
        // Only include names that exist in our canonical list 
        // This filters out messy slugs like "tech-software-development" 
        // that failed to map or are duplicates.
        return canonicalNames.includes(name);
      })
      .sort();

    return NextResponse.json({
      industries: allUniqueNames
    });
  } catch (error) {
    console.error("Error fetching industries:", error);
    // Return all canonical industries as fallback
    return NextResponse.json({
      industries: canonicalIndustries.map(ind => ind.name).sort()
    });
  }
}
