export const industries = [
    {
        id: "tech",
        name: "Technology",
        subIndustries: [
            { name: "Software Development", slug: "software-development", growth: 14, demand: "High" },
            { name: "Data Science", slug: "data-science", growth: 18, demand: "High" },
            { name: "Cybersecurity", slug: "cybersecurity", growth: 22, demand: "High" },
            { name: "IT Operations", slug: "it-operations", growth: 6, demand: "Medium" },
            { name: "Cloud Computing", slug: "cloud-computing", growth: 16, demand: "High" },
            { name: "DevOps", slug: "devops", growth: 15, demand: "High" }
        ],
    },
    {
        id: "healthcare",
        name: "Healthcare",
        subIndustries: [
            { name: "Nursing", slug: "nursing", growth: 9, demand: "High" },
            { name: "Medicine", slug: "medicine", growth: 7, demand: "High" },
            { name: "Administration", slug: "healthcare-administration", growth: 12, demand: "Medium" },
            { name: "Allied Health", slug: "allied-health", growth: 11, demand: "High" },
            { name: "Pharmacy", slug: "pharmacy", growth: 5, demand: "Medium" },
            { name: "Medical Research", slug: "medical-research", growth: 8, demand: "Medium" }
        ],
    },
    {
        id: "finance",
        name: "Finance",
        subIndustries: [
            { name: "Investment Banking", slug: "investment-banking", growth: 4, demand: "High" },
            { name: "Accounting", slug: "accounting", growth: 5, demand: "Medium" },
            { name: "Financial Planning", slug: "financial-planning", growth: 10, demand: "High" },
            { name: "Insurance", slug: "insurance", growth: 3, demand: "Medium" },
            { name: "Risk Management", slug: "risk-management", growth: 9, demand: "High" },
            { name: "Wealth Management", slug: "wealth-management", growth: 8, demand: "High" }
        ],
    },
    {
        id: "education",
        name: "Education",
        subIndustries: [
            { name: "Teaching", slug: "teaching", growth: 4, demand: "Medium" },
            { name: "Administration", slug: "education-administration", growth: 3, demand: "Medium" },
            { name: "Curriculum Development", slug: "curriculum-development", growth: 7, demand: "High" },
            { name: "Educational Technology", slug: "educational-technology", growth: 15, demand: "High" },
            { name: "Counseling", slug: "counseling", growth: 8, demand: "High" }
        ],
    },
    {
        id: "manufacturing",
        name: "Manufacturing",
        subIndustries: [
            { name: "Production", slug: "production", growth: 2, demand: "Medium" },
            { name: "Quality Control", slug: "quality-control", growth: 4, demand: "Medium" },
            { name: "Supply Chain", slug: "supply-chain", growth: 9, demand: "High" },
            { name: "Operations Management", slug: "operations-management", growth: 6, demand: "Medium" },
            { name: "Process Engineering", slug: "process-engineering", growth: 5, demand: "Medium" }
        ],
    },
    {
        id: "retail",
        name: "Retail",
        subIndustries: [
            { name: "Store Management", slug: "store-management", growth: 2, demand: "Low" },
            { name: "E-commerce", slug: "e-commerce", growth: 12, demand: "High" },
            { name: "Merchandising", slug: "merchandising", growth: 4, demand: "Medium" },
            { name: "Customer Service", slug: "customer-service", growth: 3, demand: "Medium" },
            { name: "Inventory Management", slug: "inventory-management", growth: 5, demand: "Medium" }
        ],
    },
    {
        id: "marketing",
        name: "Marketing",
        subIndustries: [
            { name: "Digital Marketing", slug: "digital-marketing", growth: 13, demand: "High" },
            { name: "Content Creation", slug: "content-creation", growth: 10, demand: "High" },
            { name: "Product Marketing", slug: "product-marketing", growth: 8, demand: "High" },
            { name: "SEO/SEM", slug: "seo-sem", growth: 9, demand: "Medium" },
            { name: "Brand Management", slug: "brand-management", growth: 5, demand: "Medium" },
            { name: "Social Media", slug: "social-media", growth: 11, demand: "High" }
        ],
    },
    {
        id: "consulting",
        name: "Consulting",
        subIndustries: [
            { name: "Management Consulting", slug: "management-consulting", growth: 7, demand: "High" },
            { name: "Strategy", slug: "strategy", growth: 8, demand: "High" },
            { name: "Business Analysis", slug: "business-analysis", growth: 10, demand: "High" },
            { name: "IT Consulting", slug: "it-consulting", growth: 12, demand: "High" },
            { name: "HR Consulting", slug: "hr-consulting", growth: 5, demand: "Medium" }
        ],
    },
    {
        id: "real-estate",
        name: "Real Estate",
        subIndustries: [
            { name: "Residential Sales", slug: "residential-sales", growth: 3, demand: "Medium" },
            { name: "Commercial Real Estate", slug: "commercial-real-estate", growth: 4, demand: "Medium" },
            { name: "Property Management", slug: "property-management", growth: 5, demand: "Medium" },
            { name: "Real Estate Development", slug: "real-estate-development", growth: 6, demand: "High" },
            { name: "Appraisal", slug: "appraisal", growth: 2, demand: "Low" }
        ]
    },
    {
        id: "hospitality",
        name: "Hospitality",
        subIndustries: [
            { name: "Hotel Management", slug: "hotel-management", growth: 4, demand: "Medium" },
            { name: "Food Service", slug: "food-service", growth: 3, demand: "Medium" },
            { name: "Event Planning", slug: "event-planning", growth: 8, demand: "High" },
            { name: "Tourism", slug: "tourism", growth: 6, demand: "Medium" },
            { name: "Customer Experience", slug: "customer-experience", growth: 9, demand: "High" }
        ]
    },
    {
        id: "transportation",
        name: "Transportation",
        subIndustries: [
            { name: "Logistics", slug: "logistics", growth: 7, demand: "High" },
            { name: "Fleet Management", slug: "fleet-management", growth: 4, demand: "Medium" },
            { name: "Supply Chain", slug: "supply-chain-trans", growth: 8, demand: "High" },
            { name: "Freight", slug: "freight", growth: 3, demand: "Medium" },
            { name: "Public Transit", slug: "public-transit", growth: 2, demand: "Low" }
        ]
    },
    {
        id: "energy",
        name: "Energy",
        subIndustries: [
            { name: "Renewable Energy", slug: "renewable-energy", growth: 15, demand: "High" },
            { name: "Oil & Gas", slug: "oil-gas", growth: 2, demand: "Medium" },
            { name: "Utilities", slug: "utilities", growth: 3, demand: "Medium" },
            { name: "Energy Management", slug: "energy-management", growth: 8, demand: "High" },
            { name: "Sustainability", slug: "sustainability", growth: 12, demand: "High" }
        ]
    },
    {
        id: "agriculture",
        name: "Agriculture",
        subIndustries: [
            { name: "Crop Production", slug: "crop-production", growth: 2, demand: "Medium" },
            { name: "Livestock", slug: "livestock", growth: 2, demand: "Medium" },
            { name: "Agricultural Technology", slug: "agricultural-technology", growth: 10, demand: "High" },
            { name: "Farm Management", slug: "farm-management", growth: 3, demand: "Medium" },
            { name: "Agribusiness", slug: "agribusiness", growth: 5, demand: "Medium" }
        ]
    },
    {
        id: "media",
        name: "Media & Entertainment",
        subIndustries: [
            { name: "Film & Video", slug: "film-video", growth: 4, demand: "Medium" },
            { name: "Journalism", slug: "journalism", growth: -2, demand: "Low" },
            { name: "Broadcasting", slug: "broadcasting", growth: 1, demand: "Low" },
            { name: "Digital Media", slug: "digital-media", growth: 10, demand: "High" },
            { name: "Content Production", slug: "content-production", growth: 8, demand: "High" },
            { name: "Gaming", slug: "gaming", growth: 12, demand: "High" }
        ]
    },
    {
        id: "legal",
        name: "Legal",
        subIndustries: [
            { name: "Corporate Law", slug: "corporate-law", growth: 4, demand: "High" },
            { name: "Litigation", slug: "litigation", growth: 3, demand: "Medium" },
            { name: "Intellectual Property", slug: "intellectual-property", growth: 6, demand: "High" },
            { name: "Compliance", slug: "compliance", growth: 8, demand: "High" },
            { name: "Legal Research", slug: "legal-research", growth: 2, demand: "Low" },
            { name: "Paralegal", slug: "paralegal", growth: 5, demand: "Medium" }
        ]
    },
];

/**
 * Maps a formatted industry string (e.g., "tech-software-development") to its broad insight category (e.g., "Technology")
 * @param {string} formattedIndustry - Industry in format: "industryId-sub-industry"
 * @returns {string|null} - Broad category name for insights lookup, or null if not found
 */
export function getInsightCategory(formattedIndustry) {
    if (!formattedIndustry) return null;

    // Extract industry ID from formatted string (e.g., "tech-software-development" → "tech")
    const industryId = formattedIndustry.split('-')[0];

    // Find matching industry and return its name
    const industry = industries.find(i => i.id === industryId);
    return industry?.name || null;
}

