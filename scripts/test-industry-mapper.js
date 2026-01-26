// Test the industry mapping utility
import { mapToInsightCategory, getIndustryDisplayName, isValidIndustry } from "../lib/industry-mapper.js";

console.log("🧪 Testing Industry Mapper\n");
console.log("=".repeat(60));

// Test cases
const testCases = [
    "tech-software-development",
    "healthcare-nursing",
    "finance-investment-banking",
    "education-teaching",
    "manufacturing-production",
    "retail-e-commerce",
    "marketing-digital-marketing",
    "consulting-management-consulting",
    "real-estate-residential-sales",
    "hospitality-hotel-management",
    "transportation-logistics",
    "energy-renewable-energy",
    "agriculture-crop-production",
    "media-film-&-video",
    "legal-corporate-law",
];

console.log("\n✅ Mapping Tests:\n");
testCases.forEach(formatted => {
    const category = mapToInsightCategory(formatted);
    const display = getIndustryDisplayName(formatted);
    const valid = isValidIndustry(formatted);

    console.log(`📌 ${formatted}`);
    console.log(`   → Insight Category: ${category || "❌ NOT FOUND"}`);
    console.log(`   → Display: ${display ? `${display.industry} - ${display.subIndustry}` : "❌ NOT FOUND"}`);
    console.log(`   → Valid: ${valid ? "✓" : "✗"}\n`);
});

// Test invalid industry
console.log("❌ Invalid Industry Test:\n");
const invalid = "invalid-industry-test";
console.log(`📌 ${invalid}`);
console.log(`   → Category: ${mapToInsightCategory(invalid) || "❌ NOT FOUND"}`);
console.log(`   → Valid: ${isValidIndustry(invalid) ? "✓" : "✗"}\n`);

console.log("=".repeat(60));
console.log("✨ All tests completed!");
