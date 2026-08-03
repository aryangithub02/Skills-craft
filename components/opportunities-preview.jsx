"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Flame, 
  Trophy, 
  Code, 
  Calendar, 
  Users, 
  Layers, 
  MapPin, 
  Clock, 
  Check, 
  RefreshCw,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getOpportunities, triggerLiveSyncAction } from "@/actions/opportunities";

export default function OpportunitiesPreview() {
  const [activeTab, setActiveTab] = useState("all");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchPreview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getOpportunities({
        type: activeTab,
        limit: 6,
      });
      setOpportunities(res.opportunities || []);
    } catch (err) {
      console.error("Failed to load home opportunities preview:", err);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await triggerLiveSyncAction();
      fetchPreview();
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <section id="opportunities" className="py-24 sm:py-32 bg-[#F8FBF8] dark:bg-[#0C1412] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#E6F4EA] dark:bg-emerald-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EA] border border-[#B1D3B9] text-xs font-extrabold text-[#3F7D58]">
            <Sparkles className="w-4 h-4 text-[#3F7D58]" />
            <span>AI Career Discovery Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-[#111827] dark:text-slate-100 tracking-tight">
            Live Career Opportunities <br />
            <span className="brand-gradient-text">Personalized For You</span>
          </h2>
          <p className="text-base sm:text-lg text-[#4B5563] dark:text-slate-300 font-normal leading-relaxed">
            Automatically discover live internships, jobs, hackathons, coding contests, open-source programs, and tech events matched to your profile with zero hardcoded datasets.
          </p>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: "all", label: "All Opportunities", icon: Layers },
            { id: "internship", label: "Internships", icon: Flame },
            { id: "job", label: "Jobs", icon: Briefcase },
            { id: "hackathon", label: "Hackathons", icon: Trophy },
            { id: "contest", label: "Coding Contests", icon: Code },
            { id: "open_source", label: "Open Source", icon: Globe },
            { id: "event", label: "Tech Events", icon: Calendar },
            { id: "community", label: "Communities", icon: Users },
          ].map(cat => {
            const IconComponent = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-[#3F7D58] text-white shadow-md shadow-emerald-600/20"
                    : "bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 text-[#4B5563] dark:text-slate-300 hover:border-[#D1D5DB]"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid Preview */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="bg-white dark:bg-slate-900 border border-[#E5E7EB] rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="w-20 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="w-1/2 h-4 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
              </Card>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          /* Zero-Hardcoded Empty State */
          <div className="glass-card-white dark:bg-slate-900/90 border border-[#E5E7EB] rounded-3xl p-10 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F4EA] border border-[#B1D3B9] text-[#3F7D58] flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-[#111827] dark:text-slate-100">
                No Opportunities Synced Yet
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-1 leading-relaxed">
                Click below to fetch live opportunities directly from public APIs.
              </p>
            </div>
            <Button
              onClick={handleSync}
              disabled={syncing}
              className="bg-[#3F7D58] hover:bg-[#35694A] text-white rounded-2xl text-xs font-bold px-5 py-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${syncing ? "animate-spin" : ""}`} /> Discover Live Opportunities
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.slice(0, 6).map((opp) => (
              <Card
                key={opp.id}
                className="card-brand-surface group hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <CardHeader className="p-6 pb-3 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {opp.logoUrl ? (
                        <img src={opp.logoUrl} alt={opp.organization} className="w-10 h-10 rounded-2xl object-cover border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-[#E6F4EA] border border-[#B1D3B9] text-[#3F7D58] flex items-center justify-center font-bold text-sm">
                          {opp.organization.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#4B5563] dark:text-slate-400 truncate max-w-[130px]">
                          {opp.organization}
                        </div>
                        <div className="text-[10px] text-[#6B7280] font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#3F7D58]" /> {opp.location || "Remote"}
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-[#E6F4EA] border border-[#B1D3B9] text-[#3F7D58] text-[11px] font-extrabold shadow-xs">
                      {opp.matchScore}% Match
                    </span>
                  </div>

                  <CardTitle className="text-base font-heading font-bold text-[#111827] dark:text-slate-100 group-hover:text-[#3F7D58] transition-colors line-clamp-2">
                    {opp.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 py-0 space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {opp.isRemote && (
                      <Badge className="bg-[#E6F4EA] text-[#3F7D58] border-[#B1D3B9] font-bold text-[10px]">
                        🌐 Remote
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-[#4B5563]">
                      {opp.type}
                    </Badge>
                    <span className="text-xs font-extrabold text-[#3F7D58] ml-auto">
                      {opp.stipendOrSalary || opp.prizePool || "Free"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {(opp.matchingSkills || []).slice(0, 3).map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 text-emerald-600" /> {sk}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-4 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#3F7D58]" />
                    {opp.deadline ? `Deadline: ${new Date(opp.deadline).toLocaleDateString()}` : "Open Now"}
                  </div>

                  <Link href="/opportunities">
                    <Button
                      size="sm"
                      className="bg-[#3F7D58] hover:bg-[#35694A] text-white rounded-xl text-xs font-bold px-3 py-1.5 h-8"
                    >
                      Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* CTA to Full Career Opportunities Hub */}
        <div className="text-center pt-4">
          <Link href="/opportunities">
            <Button className="bg-[#3F7D58] hover:bg-[#35694A] text-white rounded-2xl px-8 py-6 text-sm font-extrabold shadow-lg hover:shadow-xl transition-all">
              Explore All Live Opportunities in Career Hub <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
