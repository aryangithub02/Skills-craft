/**
 * Industry Mapping Usage Examples
 * 
 * This file demonstrates how to use the industry mapper utility
 */

// Example 1: Get insight category from user's formatted industry
import { mapToInsightCategory } from "@/lib/industry-mapper";

// User selected "Technology" → "Software Development" in onboarding
// Stored as: "tech-software-development"
const userIndustry = "tech-software-development";
const insightCategory = mapToInsightCategory(userIndustry);
console.log(insightCategory); // Output: "Technology"

// Now fetch insights from database
// const insights = await db.industryInsight.findUnique({
//   where: { industry: insightCategory }
// });

// Example 2: Display formatted industry name
import { getIndustryDisplayName } from "@/lib/industry-mapper";

const displayInfo = getIndustryDisplayName("tech-software-development");
console.log(displayInfo);
// Output: { industry: "Technology", subIndustry: "Software Development" }

// Example 3: Validate industry
import { isValidIndustry } from "@/lib/industry-mapper";

console.log(isValidIndustry("tech-software-development")); // true
console.log(isValidIndustry("invalid-industry")); // false

// Example 4: Get all available categories for seeding
import { getAllInsightCategories } from "@/lib/industry-mapper";

const categories = getAllInsightCategories();
console.log(categories);
// Output: ["Technology", "Healthcare", "Finance", "Education", ...]

// Example 5: Usage in Dashboard Component
//
// export default async function DashboardPage() {
//   const user = await getCurrentUser();
//   const insightCategory = mapToInsightCategory(user.industry);
//
//   const insights = await db.industryInsight.findUnique({
//     where: { industry: insightCategory }
//   });
//
//   return <IndustryInsights data={insights} />;
// }

// Example 6: Complete Mapping Flow
//
// Onboarding Form:
// - User selects: Industry "Technology" → Specialization "Software Development"
// - Saved as: "tech-software-development"
//
// Dashboard:
// - Reads user.industry: "tech-software-development"
// - Maps to category: "Technology" (using mapToInsightCategory)
// - Queries insights: WHERE industry = "Technology"
// - Displays: Salary ranges, growth rate, top skills for Technology sector
