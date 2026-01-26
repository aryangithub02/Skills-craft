/**
 * Sub-Industry Tech Stack & Skills Mapping
 * 
 * Provides specific, relevant tech stacks and skills for each sub-industry.
 * This complements the broad industry insights with precise, actionable recommendations.
 */

export const subIndustryTechStacks = {
    // ===== TECHNOLOGY =====
    "tech-software-development": {
        name: "Software Development",
        primarySkills: ["JavaScript", "React", "Node.js", "Git", "REST APIs"],
        techStack: ["MongoDB", "Express.js", "React", "Node.js", "TypeScript", "SQL", "PostgreSQL"],
        tools: ["VS Code", "GitHub", "Docker", "Postman", "Jira"],
        frameworks: ["Next.js", "Express", "React", "Vue.js", "Angular"],
        certifications: ["AWS Certified Developer", "Meta Front-End Developer", "Google Cloud Professional"]
    },
    "tech-data-science": {
        name: "Data Science",
        primarySkills: ["Python", "Machine Learning", "Statistics", "Data Visualization", "SQL"],
        techStack: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "SQL"],
        tools: ["Jupyter Notebook", "Tableau", "Power BI", "Git", "Anaconda"],
        frameworks: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn"],
        certifications: ["Google Data Analytics", "IBM Data Science", "AWS Machine Learning"]
    },
    "tech-cybersecurity": {
        name: "Cybersecurity",
        primarySkills: ["Network Security", "Penetration Testing", "Incident Response", "SIEM", "Cryptography"],
        techStack: ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Python", "Bash"],
        tools: ["Nmap", "Splunk", "Snort", "Nessus", "CrowdStrike"],
        frameworks: ["NIST Framework", "ISO 27001", "CIS Controls"],
        certifications: ["CISSP", "CEH", "CompTIA Security+", "OSCP"]
    },
    "tech-it-operations": {
        name: "IT Operations",
        primarySkills: ["System Administration", "Network Management", "Troubleshooting", "Linux/Windows", "Active Directory"],
        techStack: ["Linux", "Windows Server", "Active Directory", "PowerShell", "Bash"],
        tools: ["ServiceNow", "Nagios", "Ansible", "VMware", "Microsoft Azure"],
        frameworks: ["ITIL", "DevOps"],
        certifications: ["CompTIA A+", "ITIL Foundation", "Microsoft Azure Administrator"]
    },
    "tech-cloud-computing": {
        name: "Cloud Computing",
        primarySkills: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "CI/CD"],
        techStack: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Jenkins"],
        tools: ["AWS Console", "Azure Portal", "Terraform", "Ansible", "CloudFormation"],
        frameworks: ["Serverless", "Microservices"],
        certifications: ["AWS Solutions Architect", "Azure Solutions Architect", "Google Cloud Professional"]
    },
    "tech-devops": {
        name: "DevOps",
        primarySkills: ["CI/CD", "Docker", "Kubernetes", "Infrastructure as Code", "Monitoring"],
        techStack: ["Docker", "Kubernetes", "Jenkins", "GitLab CI", "Terraform", "Ansible", "Prometheus"],
        tools: ["Jenkins", "GitLab", "GitHub Actions", "Grafana", "ELK Stack"],
        frameworks: ["GitOps", "Infrastructure as Code"],
        certifications: ["Docker Certified Associate", "Kubernetes Administrator (CKA)", "AWS DevOps Engineer"]
    },

    // ===== HEALTHCARE =====
    "healthcare-nursing": {
        name: "Nursing",
        primarySkills: ["Patient Care", "Clinical Assessment", "Medication Administration", "EHR Systems", "Communication"],
        techStack: ["Epic", "Cerner", "Meditech", "CPOE Systems"],
        tools: ["Electronic Health Records", "Vital Signs Monitors", "IV Pumps"],
        frameworks: ["Evidence-Based Practice", "Nursing Process"],
        certifications: ["RN License", "BLS/ACLS", "CCRN", "Specialized Nursing Certifications"]
    },
    "healthcare-medicine": {
        name: "Medicine",
        primarySkills: ["Diagnosis", "Treatment Planning", "Medical Procedures", "Clinical Research", "Patient Communication"],
        techStack: ["EMR Systems", "PACS", "Clinical Decision Support Tools"],
        tools: ["Medical Imaging Software", "Telemedicine Platforms", "Clinical Lab Systems"],
        frameworks: ["Evidence-Based Medicine", "Clinical Practice Guidelines"],
        certifications: ["MD/DO License", "Board Certification", "Specialty Certifications", "CME Credits"]
    },
    "healthcare-administration": {
        name: "Healthcare Administration",
        primarySkills: ["Healthcare Management", "Budgeting", "Compliance", "Strategic Planning", "Staff Management"],
        techStack: ["Healthcare Information Systems", "Billing Software", "Scheduling Systems"],
        tools: ["Epic", "Cerner", "Microsoft Office Suite", "Tableau"],
        frameworks: ["HIPAA Compliance", "Quality Improvement"],
        certifications: ["MHA", "FACHE", "CPHQ", "Project Management Professional"]
    },
    "healthcare-allied-health": {
        name: "Allied Health",
        primarySkills: ["Patient Assessment", "Therapeutic Techniques", "Documentation", "Equipment Operation"],
        techStack: ["Therapy Documentation Software", "Medical Imaging Systems"],
        tools: ["Rehabilitation Equipment", "Diagnostic Devices", "EHR Systems"],
        frameworks: ["Evidence-Based Practice"],
        certifications: ["Professional Licensure", "Specialty Certifications", "BLS"]
    },
    "healthcare-pharmacy": {
        name: "Pharmacy",
        primarySkills: ["Medication Therapy Management", "Drug Interactions", "Compounding", "Patient Counseling"],
        techStack: ["Pharmacy Information Systems", "E-Prescribing", "Drug Databases"],
        tools: ["Automated Dispensing", "Compounding Equipment", "Inventory Management"],
        frameworks: ["Pharmaceutical Care", "Medication Safety"],
        certifications: ["PharmD License", "Board Certification", "Immunization Certification"]
    },
    "healthcare-medical-research": {
        name: "Medical Research",
        primarySkills: ["Research Design", "Statistical Analysis", "Grant Writing", "Lab Techniques", "Clinical Trials"],
        techStack: ["R", "Python", "SPSS", "REDCap", "LabVIEW"],
        tools: ["GraphPad Prism", "EndNote", "Laboratory Equipment"],
        frameworks: ["Good Clinical Practice (GCP)", "IRB Protocols"],
        certifications: ["CCRP", "Good Clinical Practice", "Biosafety Training"]
    },

    // ===== FINANCE =====
    "finance-investment-banking": {
        name: "Investment Banking",
        primarySkills: ["Financial Modeling", "Valuation", "Excel", "Pitch Decks", "M&A Analysis"],
        techStack: ["Excel", "Bloomberg Terminal", "Capital IQ", "FactSet", "Python"],
        tools: ["Excel", "PowerPoint", "Bloomberg", "Refinitiv Eikon"],
        frameworks: ["DCF Analysis", "Comparable Company Analysis"],
        certifications: ["CFA", "Series 79", "FINRA Licenses"]
    },
    "finance-accounting": {
        name: "Accounting",
        primarySkills: ["Financial Reporting", "GAAP/IFRS", "Auditing", "Tax Preparation", "Reconciliation"],
        techStack: ["QuickBooks", "SAP", "Oracle Financial", "Excel"],
        tools: ["QuickBooks", "Xero", "SAP", "Microsoft Excel"],
        frameworks: ["GAAP", "IFRS"],
        certifications: ["CPA", "CMA", "CIA"]
    },
    "finance-financial-planning": {
        name: "Financial Planning",
        primarySkills: ["Investment Strategy", "Retirement Planning", "Tax Planning", "Estate Planning", "Client Relations"],
        techStack: ["eMoney", "MoneyGuidePro", "Morningstar", "Excel"],
        tools: ["Financial Planning Software", "CRM Systems", "Portfolio Management Tools"],
        frameworks: ["Fiduciary Standards", "Financial Planning Process"],
        certifications: ["CFP", "ChFC", "Series 7", "Series 66"]
    },
    "finance-insurance": {
        name: "Insurance",
        primarySkills: ["Risk Assessment", "Underwriting", "Claims Management", "Sales", "Actuarial Analysis"],
        techStack: ["Insurance Management Systems", "Actuarial Software", "CRM"],
        tools: ["Guidewire", "Duck Creek", "Salesforce", "Excel"],
        frameworks: ["Risk Management", "Insurance Principles"],
        certifications: ["CPCU", "CLU", "Associate of the Society of Actuaries"]
    },
    "finance-risk-management": {
        name: "Risk Management",
        primarySkills: ["Risk Analysis", "Compliance", "Internal Controls", "Regulatory Frameworks", "Data Analytics"],
        techStack: ["Risk Management Software", "Python", "R", "SQL", "Tableau"],
        tools: ["MetricStream", "Archer", "SAP GRC", "Python"],
        frameworks: ["COSO", "ISO 31000", "Basel III"],
        certifications: ["FRM", "PRM", "CISA"]
    },
    "finance-wealth-management": {
        name: "Wealth Management",
        primarySkills: ["Portfolio Management", "Client Relations", "Investment Strategy", "Financial Analysis"],
        techStack: ["Bloomberg Terminal", "Morningstar", "Black Diamond", "Excel"],
        tools: ["Portfolio Management Systems", "Financial Planning Tools", "CRM"],
        frameworks: ["Modern Portfolio Theory", "Asset Allocation"],
        certifications: ["CFA", "CFP", "CIMA"]
    },

    // ===== EDUCATION =====
    "education-teaching": {
        name: "Teaching",
        primarySkills: ["Curriculum Development", "Classroom Management", "Assessment", "Differentiated Instruction"],
        techStack: ["Google Classroom", "Canvas", "Zoom", "Microsoft Teams"],
        tools: ["Learning Management Systems", "Interactive Whiteboards", "Assessment Tools"],
        frameworks: ["Bloom's Taxonomy", "Universal Design for Learning"],
        certifications: ["Teaching License", "Subject Certifications", "Google Educator"]
    },
    "education-administration": {
        name: "Educational Administration",
        primarySkills: ["Leadership", "Budgeting", "Policy Development", "Staff Management", "Strategic Planning"],
        techStack: ["Student Information Systems", "Scheduling Software", "Data Analytics"],
        tools: ["PowerSchool", "Infinite Campus", "Tableau", "Microsoft Office"],
        frameworks: ["Educational Leadership Standards"],
        certifications: ["Educational Leadership License", "Principal Certification"]
    },
    "education-curriculum-development": {
        name: "Curriculum Development",
        primarySkills: ["Instructional Design", "Assessment Design", "Learning Standards", "Content Development"],
        techStack: ["Articulate Storyline", "Adobe Captivate", "Google Suite"],
        tools: ["Articulate 360", "Canvas", "Camtasia"],
        frameworks: ["ADDIE Model", "Backward Design"],
        certifications: ["Instructional Design Certifications", "Subject Matter Expert"]
    },
    "education-educational-technology": {
        name: "Educational Technology",
        primarySkills: ["Learning Management Systems", "Ed Tech Integration", "Training", "Technical Support"],
        techStack: ["Canvas", "Moodle", "Google Workspace", "Microsoft 365"],
        tools: ["LMS Platforms", "Video Conferencing", "Interactive Tools"],
        frameworks: ["SAMR Model", "TPACK"],
        certifications: ["Google Certified Educator", "Microsoft Certified Educator"]
    },
    "education-counseling": {
        name: "School Counseling",
        primarySkills: ["Student Counseling", "Crisis Intervention", "College Planning", "Mental Health Support"],
        techStack: ["Counseling Software", "Student Information Systems"],
        tools: ["Naviance", "Schoology", "Assessment Tools"],
        frameworks: ["ASCA National Model"],
        certifications: ["School Counseling License", "National Counselor Certification"]
    },

    // ===== MANUFACTURING =====
    "manufacturing-production": {
        name: "Production",
        primarySkills: ["Production Planning", "Quality Control", "Process Optimization", "Safety Management"],
        techStack: ["ERP Systems", "MES", "SCADA", "AutoCAD"],
        tools: ["SAP", "Oracle Manufacturing", "Siemens", "PLC Programming"],
        frameworks: ["Lean Manufacturing", "Six Sigma"],
        certifications: ["Six Sigma Green/Black Belt", "Lean Certification"]
    },
    "manufacturing-quality-control": {
        name: "Quality Control",
        primarySkills: ["Statistical Process Control", "Root Cause Analysis", "ISO Standards", "Inspection"],
        techStack: ["Quality Management Systems", "Statistical Software", "CAD"],
        tools: ["Minitab", "JMP", "QMS Software"],
        frameworks: ["ISO 9001", "Six Sigma", "TQM"],
        certifications: ["ASQ CQE", "Six Sigma", "ISO 9001 Auditor"]
    },
    "manufacturing-supply-chain": {
        name: "Supply Chain",
        primarySkills: ["Logistics", "Inventory Management", "Procurement", "Demand Planning"],
        techStack: ["SAP", "Oracle SCM", "Manhattan", "Excel"],
        tools: ["ERP Systems", "WMS", "TMS"],
        frameworks: ["SCOR Model", "Lean Supply Chain"],
        certifications: ["CSCP", "CPIM", "Six Sigma"]
    },
    "manufacturing-operations-management": {
        name: "Operations Management",
        primarySkills: ["Process Improvement", "Production Scheduling", "Team Leadership", "KPI Management"],
        techStack: ["ERP", "MES", "Business Intelligence Tools"],
        tools: ["SAP", "Tableau", "Microsoft Project"],
        frameworks: ["Lean", "Six Sigma", "Kaizen"],
        certifications: ["PMP", "Six Sigma Black Belt", "CPIM"]
    },
    "manufacturing-process-engineering": {
        name: "Process Engineering",
        primarySkills: ["Process Design", "Optimization", "Simulation", "Technical Documentation"],
        techStack: ["AutoCAD", "SolidWorks", "MATLAB", "Python"],
        tools: ["CAD Software", "Simulation Tools", "Process Modeling"],
        frameworks: ["Design for Manufacturing", "Lean"],
        certifications: ["PE License", "Six Sigma", "Manufacturing Engineering"]
    },

    // ===== RETAIL =====
    "retail-store-management": {
        name: "Store Management",
        primarySkills: ["Team Leadership", "Inventory Control", "Customer Service", "Sales Management", "Visual Merchandising"],
        techStack: ["POS Systems", "Inventory Management", "Scheduling Software"],
        tools: ["Square", "Shopify POS", "Lightspeed", "Deputy"],
        frameworks: ["Retail Operations", "Customer Experience"],
        certifications: ["Retail Management Certification", "Customer Service Excellence"]
    },
    "retail-e-commerce": {
        name: "E-commerce",
        primarySkills: ["Digital Marketing", "Platform Management", "Analytics", "SEO", "Conversion Optimization"],
        techStack: ["Shopify", "WooCommerce", "Magento", "Google Analytics"],
        tools: ["Shopify", "Amazon Seller Central", "Google Ads", "Mailchimp"],
        frameworks: ["Digital Marketing", "E-commerce Best Practices"],
        certifications: ["Google Analytics", "Shopify Certification", "Digital Marketing"]
    },
    "retail-merchandising": {
        name: "Merchandising",
        primarySkills: ["Product Selection", "Pricing Strategy", "Display Design", "Trend Analysis"],
        techStack: ["Merchandise Planning Software", "Analytics Tools"],
        tools: ["Excel", "Tableau", "Planning Tools"],
        frameworks: ["Visual Merchandising Principles"],
        certifications: ["Certified Retail Merchandiser", "Visual Merchandising"]
    },
    "retail-customer-service": {
        name: "Customer Service",
        primarySkills: ["Customer Relations", "Conflict Resolution", "Product Knowledge", "Communication"],
        techStack: ["CRM", "Help Desk Software", "Chat Platforms"],
        tools: ["Zendesk", "Salesforce", "Intercom"],
        frameworks: ["Customer Service Excellence"],
        certifications: ["Customer Service Certification", "Communication Skills"]
    },
    "retail-inventory-management": {
        name: "Inventory Management",
        primarySkills: ["Stock Control", "Forecasting", "Supply Chain", "Data Analysis"],
        techStack: ["Inventory Management Systems", "ERP", "Excel"],
        tools: ["NetSuite", "SAP", "Fishbowl", "TradeGecko"],
        frameworks: ["JIT", "ABC Analysis"],
        certifications: ["CPIM", "Inventory Management Certification"]
    },

    // ===== MARKETING =====
    "marketing-digital-marketing": {
        name: "Digital Marketing",
        primarySkills: ["SEO", "SEM", "Social Media", "Email Marketing", "Analytics"],
        techStack: ["Google Ads", "Facebook Ads", "Google Analytics", "HubSpot"],
        tools: ["SEMrush", "Ahrefs", "Mailchimp", "Hootsuite"],
        frameworks: ["Inbound Marketing", "Marketing Funnel"],
        certifications: ["Google Ads", "Google Analytics", "HubSpot", "Facebook Blueprint"]
    },
    "marketing-content-creation": {
        name: "Content Creation",
        primarySkills: ["Copywriting", "Video Production", "Graphic Design", "Storytelling", "SEO Writing"],
        techStack: ["Adobe Creative Suite", "Canva", "WordPress", "Final Cut Pro"],
        tools: ["Photoshop", "Premiere Pro", "Figma", "Grammarly"],
        frameworks: ["Content Marketing"],
        certifications: ["Content Marketing Certification", "Adobe Certified"]
    },
    "marketing-product-marketing": {
        name: "Product Marketing",
        primarySkills: ["Market Research", "Positioning", "Go-to-Market Strategy", "Competitive Analysis"],
        techStack: ["CRM", "Analytics Tools", "Survey Platforms"],
        tools: ["Salesforce", "SurveyMonkey", "Tableau", "PowerPoint"],
        frameworks: ["Product-Market Fit", "Marketing Mix"],
        certifications: ["Product Marketing Alliance", "Pragmatic Marketing"]
    },
    "marketing-seo-sem": {
        name: "SEO/SEM",
        primarySkills: ["Keyword Research", "On-Page SEO", "Link Building", "PPC", "Analytics"],
        techStack: ["Google Search Console", "Google Ads", "SEMrush", "Ahrefs"],
        tools: ["SEMrush", "Moz", "Google Ads", "Google Analytics"],
        frameworks: ["SEO Best Practices", "PPC Strategy"],
        certifications: ["Google Ads", "SEMrush", "Moz"]
    },
    "marketing-brand-management": {
        name: "Brand Management",
        primarySkills: ["Brand Strategy", "Market Positioning", "Campaign Management", "Brand Guidelines"],
        techStack: ["Design Tools", "Social Media Platforms", "Analytics"],
        tools: ["Adobe Creative Suite", "Canva", "Brand Management Software"],
        frameworks: ["Brand Architecture", "Brand Equity"],
        certifications: ["Brand Management Certification", "Marketing Strategy"]
    },
    "marketing-social-media": {
        name: "Social Media Marketing",
        primarySkills: ["Social Strategy", "Community Management", "Content Planning", "Analytics", "Paid Social"],
        techStack: ["Facebook Business", "Instagram", "LinkedIn", "TikTok", "Twitter"],
        tools: ["Hootsuite", "Buffer", "Sprout Social", "Canva"],
        frameworks: ["Social Media Marketing"],
        certifications: ["Facebook Blueprint", "Hootsuite", "Social Media Marketing"]
    },

    // ===== CONSULTING =====
    "consulting-management-consulting": {
        name: "Management Consulting",
        primarySkills: ["Strategic Analysis", "Problem Solving", "Client Management", "Presentation", "Data Analysis"],
        techStack: ["Excel", "PowerPoint", "Tableau", "SQL"],
        tools: ["Microsoft Office", "Tableau", "Power BI"],
        frameworks: ["Porter's Five Forces", "SWOT", "McKinsey 7S"],
        certifications: ["CMC", "PMP", "Six Sigma"]
    },
    "consulting-strategy": {
        name: "Strategy Consulting",
        primarySkills: ["Strategic Planning", "Market Analysis", "Financial Modeling", "Competitive Analysis"],
        techStack: ["Excel", "PowerPoint", "Financial Modeling Tools"],
        tools: ["Excel", "PowerPoint", "Bloomberg"],
        frameworks: ["Blue Ocean Strategy", "Business Model Canvas"],
        certifications: ["Strategy Certifications", "MBA"]
    },
    "consulting-business-analysis": {
        name: "Business Analysis",
        primarySkills: ["Requirements Gathering", "Process Mapping", "Stakeholder Management", "Documentation"],
        techStack: ["Visio", "JIRA", "Confluence", "SQL"],
        tools: ["Microsoft Visio", "Lucidchart", "JIRA", "Excel"],
        frameworks: ["BABOK", "Agile"],
        certifications: ["CBAP", "PMI-PBA", "Agile"]
    },
    "consulting-it-consulting": {
        name: "IT Consulting",
        primarySkills: ["Systems Analysis", "Technology Stack Selection", "Project Management", "Solution Architecture"],
        techStack: ["Cloud Platforms", "Enterprise Software", "Development Tools"],
        tools: ["AWS", "Azure", "Salesforce", "ServiceNow"],
        frameworks: ["TOGAF", "ITIL"],
        certifications: ["AWS Solutions Architect", "PMP", "TOGAF"]
    },
    "consulting-hr-consulting": {
        name: "HR Consulting",
        primarySkills: ["Talent Management", "Organizational Development", "Change Management", "Compensation Design"],
        techStack: ["HRIS", "Assessment Tools", "Survey Platforms"],
        tools: ["Workday", "SAP SuccessFactors", "SurveyMonkey"],
        frameworks: ["HR Best Practices", "Change Management"],
        certifications: ["SHRM-CP", "SPHR", "Change Management"]
    },

    // Continue with remaining industries...
    // (Real Estate, Hospitality, Transportation, Energy, Agriculture, Media, Legal)

    // ===== REAL ESTATE =====
    "real-estate-residential-sales": {
        name: "Residential Sales",
        primarySkills: ["Sales", "Negotiation", "Market Analysis", "Client Relations", "Property Valuation"],
        techStack: ["CRM", "MLS Systems", "Virtual Tour Software"],
        tools: ["Zillow", "Realtor.com", "DocuSign", "MLS"],
        frameworks: ["Real Estate Sales Process"],
        certifications: ["Real Estate License", "Accredited Buyer's Representative"]
    },
    "real-estate-commercial-real-estate": {
        name: "Commercial Real Estate",
        primarySkills: ["Commercial Leasing", "Investment Analysis", "Due Diligence", "Market Research"],
        techStack: ["CoStar", "LoopNet", "Argus", "Excel"],
        tools: ["CoStar", "Argus Enterprise", "Excel"],
        frameworks: ["Investment Analysis"],
        certifications: ["CCIM", "SIOR", "Real Estate License"]
    },
    "real-estate-property-management": {
        name: "Property Management",
        primarySkills: ["Tenant Relations", "Maintenance Coordination", "Lease Management", "Budgeting"],
        techStack: ["Property Management Software", "Accounting Software"],
        tools: ["AppFolio", "Buildium", "Yardi", "QuickBooks"],
        frameworks: ["Property Management Best Practices"],
        certifications: ["CPM", "ARM", "Real Estate License"]
    },
    "real-estate-real-estate-development": {
        name: "Real Estate Development",
        primarySkills: ["Project Management", "Financial Analysis", "Zoning", "Construction Management"],
        techStack: ["Project Management Software", "CAD", "Financial Modeling"],
        tools: ["Microsoft Project", "AutoCAD", "Excel"],
        frameworks: ["Development Process"],
        certifications: ["PMP", "Real Estate Development"]
    },
    "real-estate-appraisal": {
        name: "Real Estate Appraisal",
        primarySkills: ["Property Valuation", "Market Analysis", "Report Writing", "Inspection"],
        techStack: ["Appraisal Software", "MLS", "Comparable Sales Tools"],
        tools: ["TOTAL", "ACI", "MLS Systems"],
        frameworks: ["USPAP"],
        certifications: ["Certified Appraiser", "State License"]
    },

    // ===== HOSPITALITY =====
    "hospitality-hotel-management": {
        name: "Hotel Management",
        primarySkills: ["Operations Management", "Guest Relations", "Revenue Management", "Staff Leadership"],
        techStack: ["PMS", "Booking Systems", "Revenue Management Software"],
        tools: ["Opera", "Amadeus", "IDeaS", "Revinate"],
        frameworks: ["Hospitality Operations"],
        certifications: ["CHA", "Hospitality Management"]
    },
    "hospitality-food-service": {
        name: "Food Service",
        primarySkills: ["Culinary Skills", "Menu Planning", "Food Safety", "Kitchen Management"],
        techStack: ["POS Systems", "Inventory Management", "Recipe Software"],
        tools: ["Toast POS", "ChefTec", "Square"],
        frameworks: ["HACCP", "Food Safety"],
        certifications: ["ServSafe", "Culinary Certifications"]
    },
    "hospitality-event-planning": {
        name: "Event Planning",
        primarySkills: ["Event Coordination", "Vendor Management", "Budget Management", "Client Relations"],
        techStack: ["Event Management Software", "Project Management Tools"],
        tools: ["Cvent", "Eventbrite", "Asana", "Trello"],
        frameworks: ["Event Planning Process"],
        certifications: ["CMP", "Event Planning Certifications"]
    },
    "hospitality-tourism": {
        name: "Tourism",
        primarySkills: ["Destination Marketing", "Tour Operations", "Customer Service", "Cultural Knowledge"],
        techStack: ["Booking Systems", "CRM", "Marketing Tools"],
        tools: ["TourCMS", "Rezdy", "Checkfront"],
        frameworks: ["Sustainable Tourism"],
        certifications: ["Tourism Certifications", "Tour Guide License"]
    },
    "hospitality-customer-experience": {
        name: "Customer Experience (Hospitality)",
        primarySkills: ["Guest Relations", "Service Recovery", "Quality Assurance", "Staff Training"],
        techStack: ["CRM", "Feedback Systems", "Training Platforms"],
        tools: ["Medallia", "Qualtrics", "ReviewPro"],
        frameworks: ["Service Excellence"],
        certifications: ["Customer Experience Certifications"]
    },

    // ===== TRANSPORTATION =====
    "transportation-logistics": {
        name: "Logistics",
        primarySkills: ["Route Planning", "Inventory Management", "Freight Management", "Supply Chain"],
        techStack: ["TMS", "WMS", "ERP Systems"],
        tools: ["SAP", "Oracle Transportation", "Manhattan"],
        frameworks: ["Logistics Management"],
        certifications: ["CLTD", "CSCP"]
    },
    "transportation-fleet-management": {
        name: "Fleet Management",
        primarySkills: ["Vehicle Maintenance", "Driver Management", "Route Optimization", "Compliance"],
        techStack: ["Fleet Management Systems", "Telematics", "GPS"],
        tools: ["Geotab", "Samsara", "Fleetio"],
        frameworks: ["Fleet Operations"],
        certifications: ["Fleet Management Certifications"]
    },
    "transportation-supply-chain": {
        name: "Supply Chain (Transportation)",
        primarySkills: ["Procurement", "Inventory Control", "Distribution", "Demand Planning"],
        techStack: ["SCM Software", "ERP", "Analytics Tools"],
        tools: ["SAP SCM", "Oracle SCM", "JDA"],
        frameworks: ["Supply Chain Management"],
        certifications: ["CSCP", "CPIM"]
    },
    "transportation-freight": {
        name: "Freight",
        primarySkills: ["Freight Brokerage", "Load Planning", "Carrier Relations", "Pricing"],
        techStack: ["TMS", "Load Boards", "Freight Software"],
        tools: ["DAT", "Truckstop.com", "McLeod"],
        frameworks: ["Freight Operations"],
        certifications: ["Freight Broker License"]
    },
    "transportation-public-transit": {
        name: "Public Transit",
        primarySkills: ["Transit Operations", "Scheduling", "Safety Management", "Customer Service"],
        techStack: ["Transit Management Systems", "CAD/AVL"],
        tools: ["Trapeze", "TransitMaster"],
        frameworks: ["Transit Operations"],
        certifications: ["Transit Management Certifications"]
    },

    // ===== ENERGY =====
    "energy-renewable-energy": {
        name: "Renewable Energy",
        primarySkills: ["Solar/Wind Technology", "Project Management", "Energy Analysis", "Sustainability"],
        techStack: ["PVsyst", "HOMER", "AutoCAD", "GIS"],
        tools: ["PVsyst", "SAM", "HOMER Energy"],
        frameworks: ["Renewable Energy Systems"],
        certifications: ["NABCEP", "LEED", "Energy Manager"]
    },
    "energy-oil-&-gas": {
        name: "Oil & Gas",
        primarySkills: ["Reservoir Engineering", "Drilling Operations", "Production Management", "Safety"],
        techStack: ["Petrel", "Eclipse", "SCADA"],
        tools: ["Schlumberger Petrel", "Landmark"],
        frameworks: ["Petroleum Engineering"],
        certifications: ["PE License", "Safety Certifications"]
    },
    "energy-utilities": {
        name: "Utilities",
        primarySkills: ["Grid Management", "Distribution", "Regulatory Compliance", "Maintenance"],
        techStack: ["SCADA", "GIS", "Asset Management Systems"],
        tools: ["SCADA Systems", "GIS", "Maximo"],
        frameworks: ["Utility Operations"],
        certifications: ["Electrical License", "Utility Certifications"]
    },
    "energy-energy-management": {
        name: "Energy Management",
        primarySkills: ["Energy Auditing", "Efficiency Programs", "Data Analysis", "Sustainability"],
        techStack: ["Energy Management Systems", "Analytics Tools"],
        tools: ["EnergyCAP", "Energy Star Portfolio Manager"],
        frameworks: ["ISO 50001"],
        certifications: ["CEM", "CEA", "LEED"]
    },
    "energy-sustainability": {
        name: "Sustainability (Energy)",
        primarySkills: ["Sustainability Planning", "Carbon Accounting", "ESG Reporting", "Policy"],
        techStack: ["Carbon Accounting Software", "ESG Tools"],
        tools: ["Enablon", "Workiva", "Sustainability Software"],
        frameworks: ["GRI Standards", "SASB"],
        certifications: ["LEED", "Sustainability Professional"]
    },

    // ===== AGRICULTURE =====
    "agriculture-crop-production": {
        name: "Crop Production",
        primarySkills: ["Agronomy", "Soil Management", "Pest Control", "Equipment Operation"],
        techStack: ["Precision Agriculture Tools", "GIS", "Farm Management Software"],
        tools: ["John Deere Operations Center", "Climate FieldView"],
        frameworks: ["Sustainable Agriculture"],
        certifications: ["Certified Crop Advisor", "Pesticide Applicator License"]
    },
    "agriculture-livestock": {
        name: "Livestock",
        primarySkills: ["Animal Husbandry", "Nutrition", "Health Management", "Breeding"],
        techStack: ["Livestock Management Software", "Tracking Systems"],
        tools: ["CattleMax", "Fusion", "Herdwatch"],
        frameworks: ["Animal Welfare Standards"],
        certifications: ["Livestock Certifications", "Veterinary Technician"]
    },
    "agriculture-agricultural-technology": {
        name: "Agricultural Technology",
        primarySkills: ["Precision Agriculture", "Drone Operation", "Data Analysis", "IoT Systems"],
        techStack: ["Drones", "IoT Sensors", "GIS", "Data Analytics"],
        tools: ["DJI Drones", "John Deere Tech", "Climate FieldView"],
        frameworks: ["Precision Agriculture"],
        certifications: ["Drone Pilot License", "Precision Ag Certifications"]
    },
    "agriculture-farm-management": {
        name: "Farm Management",
        primarySkills: ["Business Management", "Financial Planning", "Operations", "Marketing"],
        techStack: ["Farm Management Software", "Accounting Software"],
        tools: ["FarmLogs", "Granular", "QuickBooks"],
        frameworks: ["Farm Business Management"],
        certifications: ["Farm Management Certifications"]
    },
    "agriculture-agribusiness": {
        name: "Agribusiness",
        primarySkills: ["Supply Chain", "Marketing", "Finance", "Trade", "Commodity Markets"],
        techStack: ["ERP Systems", "Trading Platforms", "Market Data"],
        tools: ["SAP", "Barchart", "CME Group"],
        frameworks: ["Agricultural Economics"],
        certifications: ["Agribusiness Certifications", "Commodity Trading"]
    },

    // ===== MEDIA & ENTERTAINMENT =====
    "media-film-&-video": {
        name: "Film & Video Production",
        primarySkills: ["Video Editing", "Cinematography", "Directing", "Post-Production"],
        techStack: ["Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "After Effects"],
        tools: ["Premiere Pro", "Final Cut Pro", "DaVinci Resolve"],
        frameworks: ["Filmmaking Process"],
        certifications: ["Adobe Certified", "Film Production Certifications"]
    },
    "media-journalism": {
        name: "Journalism",
        primarySkills: ["Writing", "Research", "Interviewing", "Multimedia Storytelling", "Ethics"],
        techStack: ["CMS", "Social Media", "Audio/Video Tools"],
        tools: ["WordPress", "Adobe Suite", "Audio Editing"],
        frameworks: ["Journalistic Ethics"],
        certifications: ["Journalism Certifications", "Digital Media"]
    },
    "media-broadcasting": {
        name: "Broadcasting",
        primarySkills: ["On-Air Presentation", "Production", "Audio/Video Editing", "Live Streaming"],
        techStack: ["Broadcasting Equipment", "Editing Software", "Streaming Platforms"],
        tools: ["OBS Studio", "vMix", "Tricaster"],
        frameworks: ["Broadcasting Standards"],
        certifications: ["Broadcasting Certifications", "FCC License"]
    },
    "media-digital-media": {
        name: "Digital Media",
        primarySkills: ["Content Creation", "Social Media", "Analytics", "Video Production", "SEO"],
        techStack: ["Adobe Creative Suite", "WordPress", "Google Analytics"],
        tools: ["Photoshop", "Premiere Pro", "Canva", "Hootsuite"],
        frameworks: ["Digital Content Strategy"],
        certifications: ["Google Analytics", "Digital Marketing"]
    },
    "media-content-production": {
        name: "Content Production",
        primarySkills: ["Production Management", "Scriptwriting", "Editing", "Project Management"],
        techStack: ["Production Management Software", "Editing Tools"],
        tools: ["Frame.io", "Premiere Pro", "Asana"],
        frameworks: ["Content Production Pipeline"],
        certifications: ["Production Certifications"]
    },
    "media-gaming": {
        name: "Gaming",
        primarySkills: ["Game Design", "Programming", "3D Modeling", "Unity/Unreal Engine"],
        techStack: ["Unity", "Unreal Engine", "Blender", "C#", "C++"],
        tools: ["Unity", "Unreal Engine", "Blender", "Maya"],
        frameworks: ["Game Development"],
        certifications: ["Unity Certified", "Game Development Certifications"]
    },

    // ===== LEGAL =====
    "legal-corporate-law": {
        name: "Corporate Law",
        primarySkills: ["Contract Drafting", "M&A", "Corporate Governance", "Compliance", "Negotiation"],
        techStack: ["Document Management", "Legal Research Tools", "Contract Management"],
        tools: ["Westlaw", "LexisNexis", "ContractWorks", "DocuSign"],
        frameworks: ["Corporate Law Practice"],
        certifications: ["Bar License", "LLM", "Corporate Law Certifications"]
    },
    "legal-litigation": {
        name: "Litigation",
        primarySkills: ["Trial Advocacy", "Legal Research", "Motion Writing", "Discovery", "Deposition"],
        techStack: ["Case Management Software", "Legal Research"],
        tools: ["Westlaw", "LexisNexis", "Clio", "CaseMap"],
        frameworks: ["Litigation Process"],
        certifications: ["Bar License", "Trial Advocacy"]
    },
    "legal-intellectual-property": {
        name: "Intellectual Property",
        primarySkills: ["Patent Law", "Trademark", "Copyright", "IP Strategy", "Prosecution"],
        techStack: ["Patent Search Tools", "Trademark Databases"],
        tools: ["PAIR", "TESS", "Westlaw", "LexisNexis"],
        frameworks: ["IP Protection"],
        certifications: ["Bar License", "Patent Bar", "IP Certifications"]
    },
    "legal-compliance": {
        name: "Legal Compliance",
        primarySkills: ["Regulatory Compliance", "Risk Assessment", "Policy Development", "Auditing"],
        techStack: ["Compliance Software", "GRC Tools"],
        tools: ["MetricStream", "LogicManager", "Compliance 360"],
        frameworks: ["Compliance Frameworks"],
        certifications: ["CCEP", "CRCM", "Compliance Certifications"]
    },
    "legal-legal-research": {
        name: "Legal Research",
        primarySkills: ["Research Methods", "Legal Writing", "Case Analysis", "Citation"],
        techStack: ["Legal Research Databases", "Citation Tools"],
        tools: ["Westlaw", "LexisNexis", "Bloomberg Law", "Fastcase"],
        frameworks: ["Legal Research Methodologies"],
        certifications: ["Legal Research Certifications"]
    },
    "legal-paralegal": {
        name: "Paralegal",
        primarySkills: ["Legal Research", "Document Preparation", "Case Management", "Client Communication"],
        techStack: ["Case Management Software", "Document Management"],
        tools: ["Clio", "MyCase", "Westlaw", "Microsoft Office"],
        frameworks: ["Paralegal Practice"],
        certifications: ["Paralegal Certification", "NALA CP"]
    },
};

/**
 * Retrieve the tech stack object for a given formatted industry identifier.
 * @param {string} formattedIndustry - Formatted industry key (e.g., "tech-software-development").
 * @returns {object|null} The tech stack object for the given key, or `null` if the key is falsy or not found.
 */
export function getTechStack(formattedIndustry) {
    if (!formattedIndustry) return null;
    return subIndustryTechStacks[formattedIndustry] || null;
}

/**
 * Retrieve the primary skills for a given formatted industry key.
 * @param {string} formattedIndustry - The formatted industry identifier used as a key in subIndustryTechStacks.
 * @returns {string[]} The primary skills for the specified industry, or an empty array if the industry is not found.
 */
export function getPrimarySkills(formattedIndustry) {
    const stack = getTechStack(formattedIndustry);
    return stack?.primarySkills || [];
}