"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Briefcase, 
  Sparkles, 
  Search, 
  Filter, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  RefreshCw, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Trophy, 
  Globe, 
  Users, 
  Calendar, 
  Check, 
  X, 
  Building2, 
  DollarSign, 
  Flame, 
  BookOpen, 
  Layers,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getOpportunities, toggleSaveOpportunity, triggerLiveSyncAction } from "@/actions/opportunities";
import { toast } from "sonner";

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [isPaidOnly, setIsPaidOnly] = useState(false);

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected item for detail modal
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load opportunities from DB via server action
  const loadOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getOpportunities({
        type: activeTab,
        search: debouncedSearch,
        isRemote: isRemoteOnly,
        isPaid: isPaidOnly,
        page,
        limit: 20,
      });

      if (res.error) {
        setError(res.error);
        setOpportunities([]);
      } else {
        let currentItems = res.opportunities || [];
        let currentTotal = res.totalCount || 0;

        if (currentItems.length === 0 && activeTab === "all" && !debouncedSearch) {
          console.log("No items found on initial load, auto-triggering live API sync...");
          const syncRes = await triggerLiveSyncAction();
          if (syncRes?.success) {
            const retryRes = await getOpportunities({
              type: activeTab,
              search: debouncedSearch,
              isRemote: isRemoteOnly,
              isPaid: isPaidOnly,
              page,
              limit: 20,
            });
            currentItems = retryRes.opportunities || [];
            currentTotal = retryRes.totalCount || 0;
          }
        }

        setOpportunities(currentItems);
        setTotalPages(Math.ceil(currentTotal / 20) || 1);
        setTotalCount(currentTotal);
      }
    } catch (err) {
      console.error("Failed to load opportunities:", err);
      setError("Unable to fetch opportunities from server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch, isRemoteOnly, isPaidOnly, page]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Manual Trigger for Live Sync from Public APIs
  const handleLiveSync = async () => {
    try {
      setSyncing(true);
      toast.info("Discovering live opportunities from public APIs...");
      const res = await triggerLiveSyncAction();
      if (res.success) {
        toast.success(`Successfully discovered & synced ${res.syncedCount || 0} live opportunities!`);
        loadOpportunities();
      } else {
        toast.error(res.error || "Live sync failed.");
      }
    } catch (err) {
      toast.error("Failed to execute live API sync.");
    } finally {
      setSyncing(false);
    }
  };

  // Toggle Save / Bookmark
  const handleToggleSave = async (e, opp) => {
    e.stopPropagation();
    try {
      const newStatus = opp.isSaved ? "REMOVE" : "SAVED";
      const res = await toggleSaveOpportunity(opp.id, newStatus);
      if (res.success) {
        toast.success(res.isSaved ? "Saved to your bookmarked opportunities!" : "Removed from saved opportunities.");
        setOpportunities(prev =>
          prev.map(item =>
            item.id === opp.id
              ? { ...item, isSaved: res.isSaved, userStatus: res.status }
              : item
          )
        );
      } else {
        toast.error("Please sign in to save opportunities.");
      }
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBF8] dark:bg-[#0C1412] text-[#111827] dark:text-slate-100 p-4 sm:p-8 font-sans-ui">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* ── HEADER BANNER ── */}
        <div className="glass-card-white dark:bg-slate-900/90 border border-[#E5E7EB] dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E6F4EA] dark:bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F4EA] border border-[#B1D3B9] text-[#3F7D58] text-xs font-extrabold uppercase tracking-widest mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> AI-Powered Career Recommendation Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#111827] dark:text-slate-100 tracking-tight">
                Career Opportunities Hub
              </h1>
              <p className="text-[#4B5563] dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Discover live internships, jobs, hackathons, coding contests, open-source programs, and tech events personalized to your profile and skills.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                type="button"
                onClick={handleLiveSync}
                disabled={syncing}
                className="bg-[#3F7D58] hover:bg-[#35694A] text-white rounded-2xl px-5 py-2.5 text-xs font-bold shadow-md flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Discovering Live APIs..." : "Sync Live Opportunities"}
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, technology, hackathon name, company, or platform..."
                className="w-full pl-11 pr-4 bg-[#F8FBF8] dark:bg-slate-950 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl h-12 text-sm text-[#111827] dark:text-slate-100 placeholder:text-[#6B7280] focus:outline-none focus:border-[#3F7D58] focus:ring-2 focus:ring-[#3F7D58]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-6 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsRemoteOnly(!isRemoteOnly)}
                className={`px-4 py-3 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all ${
                  isRemoteOnly
                    ? "bg-[#E6F4EA] border-[#3F7D58] text-[#3F7D58] shadow-sm"
                    : "bg-[#F8FBF8] dark:bg-slate-950 border-[#E5E7EB] dark:border-slate-800 text-[#4B5563] dark:text-slate-300 hover:border-[#D1D5DB]"
                }`}
              >
                <Globe className="w-4 h-4" /> Remote Only
              </button>

              <button
                type="button"
                onClick={() => setIsPaidOnly(!isPaidOnly)}
                className={`px-4 py-3 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all ${
                  isPaidOnly
                    ? "bg-[#E6F4EA] border-[#3F7D58] text-[#3F7D58] shadow-sm"
                    : "bg-[#F8FBF8] dark:bg-slate-950 border-[#E5E7EB] dark:border-slate-800 text-[#4B5563] dark:text-slate-300 hover:border-[#D1D5DB]"
                }`}
              >
                <DollarSign className="w-4 h-4" /> Paid / Prize Stipend
              </button>

              <Badge variant="outline" className="ml-auto text-xs font-mono bg-[#E6F4EA] text-[#3F7D58] border-[#B1D3B9] px-3 py-1.5 rounded-full">
                {totalCount} Opportunities Found
              </Badge>
            </div>
          </div>
        </div>

        {/* ── CATEGORY TABS ── */}
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setPage(1); }} className="w-full">
          <TabsList className="bg-[#F2F7F3] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-1.5 flex flex-wrap gap-1.5 overflow-x-auto h-auto">
            <TabsTrigger value="all" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Layers className="w-3.5 h-3.5 mr-1.5" /> All Opportunities
            </TabsTrigger>
            <TabsTrigger value="internship" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Flame className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Internships
            </TabsTrigger>
            <TabsTrigger value="job" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Briefcase className="w-3.5 h-3.5 mr-1.5 text-[#3F7D58]" /> Jobs
            </TabsTrigger>
            <TabsTrigger value="hackathon" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Trophy className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Hackathons
            </TabsTrigger>
            <TabsTrigger value="contest" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Code className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Coding Contests
            </TabsTrigger>
            <TabsTrigger value="open_source" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Open Source
            </TabsTrigger>
            <TabsTrigger value="event" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-cyan-500" /> Tech Events
            </TabsTrigger>
            <TabsTrigger value="community" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2">
              <Users className="w-3.5 h-3.5 mr-1.5 text-violet-500" /> Communities
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-xl text-xs font-bold data-[state=active]:bg-[#3F7D58] data-[state=active]:text-white px-4 py-2 ml-auto">
              <Bookmark className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Saved
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* ── ERROR STATE ── */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <Button size="sm" onClick={loadOpportunities} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs">
              Retry
            </Button>
          </div>
        )}

        {/* ── LOADING SKELETON STATE ── */}
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
                <div className="flex gap-2">
                  <div className="w-16 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="w-20 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
              </Card>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          /* ── ABSOLUTE ZERO HARDCODED DATA EMPTY STATE ── */
          <div className="glass-card-white dark:bg-slate-900/90 border border-[#E5E7EB] rounded-3xl p-12 text-center space-y-5 max-w-xl mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="w-16 h-16 rounded-3xl bg-[#E6F4EA] border border-[#B1D3B9] flex items-center justify-center mx-auto text-[#3F7D58]">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-[#111827] dark:text-slate-100">
                No Matching Opportunities Found
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                We could not find live opportunities matching your exact filter criteria in our dynamic database. Try broadening your search or sync live public APIs.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => { setSearchQuery(""); setIsRemoteOnly(false); setIsPaidOnly(false); setActiveTab("all"); }}
                variant="outline"
                className="rounded-2xl border-[#E5E7EB] text-xs font-bold"
              >
                Reset Filters
              </Button>
              <Button
                onClick={handleLiveSync}
                disabled={syncing}
                className="bg-[#3F7D58] hover:bg-[#35694A] text-white rounded-2xl text-xs font-extrabold shadow-md flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} /> Discover Live APIs
              </Button>
            </div>
          </div>
        ) : (
          /* ── DYNAMIC OPPORTUNITIES GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <Card
                key={opp.id}
                onClick={() => setSelectedOpportunity(opp)}
                className="card-brand-surface group cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <CardHeader className="p-6 pb-4 space-y-3">
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
                        <div className="text-xs font-bold text-[#4B5563] dark:text-slate-400 truncate max-w-[140px]">
                          {opp.organization}
                        </div>
                        <div className="text-[10px] text-[#6B7280] font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#3F7D58]" /> {opp.location || "Remote"}
                        </div>
                      </div>
                    </div>

                    {/* AI Match Score Badge */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-1 rounded-full bg-[#E6F4EA] border border-[#B1D3B9] text-[#3F7D58] text-[11px] font-extrabold shadow-xs">
                        {opp.matchScore}% Match
                      </span>
                      <span className="text-[9px] text-[#6B7280] font-mono">AI Personalized</span>
                    </div>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-base font-heading font-bold text-[#111827] dark:text-slate-100 group-hover:text-[#3F7D58] transition-colors line-clamp-2">
                    {opp.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 py-0 space-y-3 flex-1">
                  {/* Badges & Stipend/Salary/Prize */}
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
                      {opp.stipendOrSalary || opp.prizePool || "Free Registration"}
                    </span>
                  </div>

                  {/* Skill tags matching/missing highlights */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {(opp.matchingSkills || []).map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 text-emerald-600" /> {sk}
                      </span>
                    ))}
                    {(opp.missingSkills || []).map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#6B7280]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-4 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#3F7D58]" />
                    {opp.deadline ? `Deadline: ${new Date(opp.deadline).toLocaleDateString()}` : "Open Application"}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => handleToggleSave(e, opp)}
                      className="h-8 w-8 rounded-xl hover:bg-[#E6F4EA] transition-colors"
                      title={opp.isSaved ? "Saved" : "Save opportunity"}
                    >
                      {opp.isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-[#3F7D58]" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </Button>

                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setSelectedOpportunity(opp); }}
                      className="bg-[#3F7D58] hover:bg-[#35694A] text-white rounded-xl text-xs font-bold px-3 py-1.5 h-8"
                    >
                      View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <Button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              variant="outline"
              className="rounded-xl text-xs font-bold"
            >
              Previous
            </Button>
            <span className="text-xs font-bold text-[#4B5563]">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              variant="outline"
              className="rounded-xl text-xs font-bold"
            >
              Next
            </Button>
          </div>
        )}

        {/* ── OPPORTUNITY DETAIL MODAL ── */}
        {selectedOpportunity && (
          <Dialog open={Boolean(selectedOpportunity)} onOpenChange={() => setSelectedOpportunity(null)}>
            <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6">
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {selectedOpportunity.logoUrl ? (
                      <img src={selectedOpportunity.logoUrl} alt={selectedOpportunity.organization} className="w-12 h-12 rounded-2xl object-cover border" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] border border-[#B1D3B9] text-[#3F7D58] flex items-center justify-center font-bold text-lg">
                        {selectedOpportunity.organization.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <DialogTitle className="text-xl font-heading font-bold text-[#111827] dark:text-slate-100">
                        {selectedOpportunity.title}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-[#4B5563] font-medium flex items-center gap-2 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-[#3F7D58]" /> {selectedOpportunity.organization} • {selectedOpportunity.location}
                      </DialogDescription>
                    </div>
                  </div>

                  <Badge className="bg-[#E6F4EA] border border-[#B1D3B9] text-[#3F7D58] text-xs font-extrabold px-3 py-1">
                    {selectedOpportunity.matchScore}% AI Match
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 text-xs text-[#4B5563] dark:text-slate-300">
                {/* Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F2F7F3] dark:bg-slate-950 border border-[#E5E7EB]">
                  <div>
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Format</span>
                    <span className="font-bold text-[#111827] dark:text-slate-100">{selectedOpportunity.isRemote ? "Remote" : "On-site"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Compensation</span>
                    <span className="font-bold text-[#3F7D58]">{selectedOpportunity.stipendOrSalary || selectedOpportunity.prizePool || "Free"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Platform Source</span>
                    <span className="font-bold text-[#111827] dark:text-slate-100">{selectedOpportunity.platform}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-bold text-sm text-[#111827] dark:text-slate-100 mb-1.5 font-heading">Opportunity Overview</h4>
                  <p className="leading-relaxed bg-[#F8FBF8] dark:bg-slate-950 p-4 rounded-2xl border border-[#E5E7EB]">
                    {selectedOpportunity.description}
                  </p>
                </div>

                {/* AI Skills Match & Guidance */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[#111827] dark:text-slate-100 flex items-center gap-2 font-heading">
                    <Sparkles className="w-4 h-4 text-[#3F7D58]" /> AI Preparation Tips & Skill Breakdown
                  </h4>
                  <div className="p-4 rounded-2xl bg-[#E6F4EA]/60 border border-[#B1D3B9] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3F7D58]">Matching Profile Skills:</span>
                      <span className="font-medium text-[#111827]">{(selectedOpportunity.matchingSkills || []).join(", ") || "General Domain Skills"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#4B5563]">Recommended Prep:</span>
                      <span className="font-medium text-[#4B5563]">Review SkillsCraft Resume AI & Practice Interview Questions for {selectedOpportunity.platform}.</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between pt-4 border-t border-[#E5E7EB]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleToggleSave(e, selectedOpportunity)}
                  className="rounded-2xl text-xs font-bold border-[#E5E7EB]"
                >
                  {selectedOpportunity.isSaved ? "Saved in Bookmarks" : "Save Opportunity"}
                </Button>

                <a
                  href={selectedOpportunity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3F7D58] hover:bg-[#35694A] text-white rounded-2xl px-6 py-2.5 text-xs font-extrabold shadow-md inline-flex items-center gap-2 transition-all"
                >
                  Apply Directly on {selectedOpportunity.platform} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
}
