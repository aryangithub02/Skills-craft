"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAssessment, generateAndStoreQuestions } from "@/actions/assessment";
import { useSession, signIn } from "next-auth/react";


export default function InterviewSetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  
  const [formData, setFormData] = useState({
    industry: "",
    domain: "",
    interviewType: "mixed",
    experience: "",
    specificTopic: ""
  });
  const [initialUserData, setInitialUserData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [domainsByIndustry, setDomainsByIndustry] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define domains for each industry
  useEffect(() => {
    const domains = {
      "Technology": ["Software Development", "Data Science", "Cybersecurity", "IT Operations", "Cloud Computing", "DevOps", "Frontend Development", "Backend Development", "Full Stack Development", "Mobile Development", "QA/Testing", "AI/ML Engineering"],
      "Finance": ["Investment Banking", "Accounting", "Financial Planning", "Insurance", "Risk Management", "Wealth Management", "Corporate Finance", "Audit", "Tax Consulting"],
      "Healthcare": ["Nursing", "Medicine", "Administration", "Allied Health", "Pharmacy", "Medical Research", "Physical Therapy", "Healthcare IT"],
      "Education": ["Teaching", "Administration", "Curriculum Development", "Educational Technology", "Counseling", "Special Education", "Higher Education"],
      "Manufacturing": ["Production", "Quality Control", "Supply Chain", "Operations Management", "Process Engineering", "Industrial Design", "Safety Compliance"],
      "Retail": ["Store Management", "E-commerce", "Merchandising", "Customer Service", "Inventory Management", "Fashion Buying", "Supply Chain"],
      "Marketing": ["Digital Marketing", "Content Creation", "Product Marketing", "SEO/SEM", "Brand Management", "Social Media", "Market Research", "Influencer Marketing"],
      "Consulting": ["Management Consulting", "Strategy Analysis", "IT Consulting", "HR Consulting", "Financial Consulting", "Operations Consulting"],
      "Real Estate": ["Residential Sales", "Commercial Real Estate", "Property Management", "Real Estate Development", "Appraisal", "Mortgage Lending"],
      "Hospitality": ["Hotel Management", "Food Service", "Event Planning", "Tourism", "Customer Experience", "Travel Coordination", "Kitchen/Culinary"],
      "Transportation": ["Logistics", "Fleet Management", "Supply Chain", "Freight", "Public Transit", "Aviation Management", "Maritime Operations"],
      "Energy": ["Renewable Energy", "Oil & Gas", "Utilities", "Energy Management", "Sustainability", "Environmental Engineering", "Grid Modernization"],
      "Agriculture": ["Crop Production", "Livestock Management", "Agricultural Technology", "Farm Management", "Agribusiness", "Horticulture", "Soil Science"],
      "Media & Entertainment": ["Film & Video", "Journalism", "Broadcasting", "Digital Media", "Content Production", "Gaming", "Animation", "Sound Engineering"],
      "Legal": ["Corporate Law", "Litigation", "Intellectual Property", "Compliance", "Legal Research", "Paralegal", "Cyber Law", "Real Estate Law"],
      "Sales": ["Inside Sales", "Outside Sales", "Sales Management", "Business Development", "Account Management", "Enterprise Sales"],
      "Human Resources": ["Recruitment", "HR Generalist", "Compensation & Benefits", "Training & Development", "HR Operations", "Employee Relations"],
      "Design": ["UX/UI Design", "Graphic Design", "Product Design", "Motion Graphics", "Visual Design", "Interior Design", "Industrial Design"]
    };
    setDomainsByIndustry(domains);
  }, []);

  // Load user data and industries
  useEffect(() => {
    if (session?.user) {
      const loadUserData = async () => {
        try {
          // Fetch user data
          const userResponse = await fetch('/api/user');
          if (userResponse.ok) {
            const userData = await userResponse.json();
             // ... existing logic ... 
             // Wait, I can't just keep "..." in replacement. I need full block or specific line.
             // I'll replace just the top check.
             setInitialUserData(userData.user);
            
            // Pre-fill form with user data if available
            setFormData(prev => ({
              ...prev,
              industry: userData.user.industry || prev.industry,
              experience: userData.user.experience || prev.experience
            }));
          }
          
          // Fetch industries
          const industriesResponse = await fetch('/api/industries');
          if (industriesResponse.ok) {
            const industriesData = await industriesResponse.json();
            setIndustries(industriesData.industries || []);
          } else {
            // Fallback to a default list if API fails
            setIndustries([
              "Technology", "Finance", "Healthcare", "Education", 
              "Marketing", "Sales", "Human Resources", "Operations", "Design", "Consulting",
              "Manufacturing", "Retail", "Real Estate", "Hospitality", "Transportation",
              "Energy", "Agriculture", "Media & Entertainment", "Legal"
            ]);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          // Fallback to default industries if API fails
          setIndustries([
            "Technology", "Finance", "Healthcare", "Education", 
            "Marketing", "Sales", "Human Resources", "Operations", "Design", "Consulting",
            "Manufacturing", "Retail", "Real Estate", "Hospitality", "Transportation",
            "Energy", "Agriculture", "Media & Entertainment", "Legal"
          ]);
        } finally {
          setIsInitialized(true);
        }
      };
      
      loadUserData();
    }
  }, [session]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset domain and specific topic when industry changes
    if (field === 'industry') {
      setFormData(prev => ({
        ...prev,
        domain: "",
        specificTopic: "",
        experience: prev.experience // Keep experience
      }));
    }

    // Reset specific topic when domain changes
    if (field === 'domain') {
      setFormData(prev => ({
        ...prev,
        specificTopic: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (loadingSession) {
      return;
    }


    try {
      // Validate form
      if (!formData.industry || !formData.domain || !formData.experience) {
        throw new Error("Please fill in all required fields");
      }

      // Create assessment
      const assessmentData = {
        industry: formData.industry,
        domain: formData.domain,
        specificTopic: formData.specificTopic,
        experience: parseInt(formData.experience),
        interviewType: formData.interviewType,
        difficulty: formData.experience < 2 ? 'easy' : formData.experience < 5 ? 'medium' : 'hard'
      };

      const result = await createAssessment(assessmentData);
      if (!result.success) {
        throw new Error(result.error || "Failed to create assessment");
      }

      console.log("✅ Assessment and questions generated successfully!");

      // Navigate to interview session
      router.push(`/interview/session/${result.assessmentId}`);
    } catch (err) {
      console.error("Error setting up interview:", err);
      setError(err.message || "An error occurred while setting up the interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <div className="w-full max-w-xl">
        {session && (
          <Card className="border-muted/50 shadow-lg bg-card transition-all duration-500 hover:shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Mock Interview Setup
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Tailor-made questions for your role and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                  <span className="font-semibold">Oops!</span> {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Industry Selection */}
                <div className="space-y-2 group">
                  <Label htmlFor="industry" className="text-foreground font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                    Industry
                  </Label>
                  <Select 
                    value={formData.industry} 
                    onValueChange={(value) => handleChange('industry', value)}
                  >
                    <SelectTrigger id="industry" className="h-12 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20 hover:border-primary/50 rounded-xl">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-muted">
                      {industries.map(ind => (
                        <SelectItem key={ind} value={ind} className="rounded-lg">{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Domain Selection */}
                <div className={`space-y-2 transition-all duration-300 ${formData.industry ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-2'}`}>
                  <Label htmlFor="domain" className="text-foreground font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                    Domain
                  </Label>
                  <Select 
                    value={formData.domain} 
                    onValueChange={(value) => handleChange('domain', value)}
                    disabled={!formData.industry}
                  >
                    <SelectTrigger id="domain" className="h-12 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20 hover:border-primary/50 rounded-xl">
                      <SelectValue placeholder={
                        formData.industry 
                          ? "Select a domain" 
                          : "Select industry first"
                      } />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-muted">
                      {formData.industry && domainsByIndustry[formData.industry]?.map(domain => (
                        <SelectItem key={domain} value={domain} className="rounded-lg">{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Topic Input (New) */}
                <div className={`space-y-2 transition-all duration-300 ${formData.domain ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-2'}`}>
                  <Label htmlFor="specificTopic" className="text-foreground font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                    Specific Topic <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-wider ml-1">(Optional)</span>
                  </Label>
                  <Input
                    id="specificTopic"
                    placeholder="e.g. MongoDB, Cloud Computing, React Hooks"
                    value={formData.specificTopic}
                    onChange={(e) => handleChange('specificTopic', e.target.value)}
                    className="h-12 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20 hover:border-primary/50 rounded-xl"
                    disabled={!formData.domain}
                  />
                  <p className="text-[11px] text-muted-foreground ml-3">Focus your questions on a particular technology or concept</p>
                </div>

                {/* Interview Type */}
                <div className="space-y-3">
                  <Label className="text-foreground font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                    Interview Type
                  </Label>
                  <RadioGroup 
                    value={formData.interviewType} 
                    onValueChange={(value) => handleChange('interviewType', value)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    <div className={`flex items-center justify-between border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 ${formData.interviewType === 'technical' ? 'border-primary bg-primary/5' : 'border-muted hover:bg-muted/30'}`}>
                      <Label htmlFor="technical" className="flex items-center space-x-2 cursor-pointer w-full text-sm">
                        <RadioGroupItem value="technical" id="technical" className="border-primary text-primary" />
                        <span className="font-semibold text-foreground">Technical</span>
                      </Label>
                    </div>
                    <div className={`flex items-center justify-between border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 ${formData.interviewType === 'non-technical' ? 'border-primary bg-primary/5' : 'border-muted hover:bg-muted/30'}`}>
                      <Label htmlFor="non-technical" className="flex items-center space-x-2 cursor-pointer w-full text-sm">
                        <RadioGroupItem value="non-technical" id="non-technical" className="border-primary text-primary" />
                        <span className="font-semibold text-foreground">Behavioral</span>
                      </Label>
                    </div>
                    <div className={`flex items-center justify-between border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 ${formData.interviewType === 'mixed' ? 'border-primary bg-primary/5' : 'border-muted hover:bg-muted/30'}`}>
                      <Label htmlFor="mixed" className="flex items-center space-x-2 cursor-pointer w-full text-sm">
                        <RadioGroupItem value="mixed" id="mixed" className="border-primary text-primary" />
                        <span className="font-semibold text-foreground">Mixed</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-foreground font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g. 2"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className="h-12 bg-background border-input transition-all focus:ring-2 focus:ring-primary/20 hover:border-primary/50 rounded-xl"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-bold mt-2 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80 hover:to-primary hover:shadow-xl transition-all duration-300 rounded-xl"
                  size="lg"
                  disabled={loading || !formData.industry || !formData.domain || !formData.experience}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                      <span>Preparing interview...</span>
                    </div>
                  ) : (
                    "Start Your Interview"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {!session && (
          <Card className="border-muted/50 shadow-xl bg-card overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/80"></div>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">Ready to Level Up?</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Sign in to access your personalized mock interview setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <Button 
                onClick={() => signIn("google")}
                className="w-full max-w-xs h-12 text-base font-bold shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80 hover:to-primary transition-all duration-300 rounded-xl"
              >
                Sign In to Start
              </Button>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Get tailored questions, instant feedback, and track your progress.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

