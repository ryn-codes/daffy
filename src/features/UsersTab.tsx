"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Calendar, 
  Mail, 
  Share2, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  CornerDownRight, 
  Plus, 
  Award, 
  HelpCircle, 
  Save, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Globe, 
  Layers, 
  Settings, 
  FileText, 
  ShoppingCart, 
  RefreshCw, 
  Send, 
  Check,
  ChevronDown,
  Filter,
  UserCheck,
  Percent,
  Bookmark
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { mockEngine, UserProfile, AnalyticsEvent } from "@/lib/mockEngine";
import { useSimulation } from "@/context/SimulationContext";

export default function UsersTab() {
  const { isSimulating, totalSimulatedEvents } = useSimulation();
  // Directory & Selection States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>(mockEngine.users[0].id);

  const getDynamicUserRevenue = (user: UserProfile) => {
    if (!isSimulating) return user.revenue;
    const rate = user.tier === "Premium" ? 0.25 : user.tier === "Regular" ? 0.10 : 0.02;
    return Math.floor(user.revenue + totalSimulatedEvents * rate);
  };

  const getDynamicUserOrders = (user: UserProfile) => {
    if (!isSimulating) return user.purchaseCount;
    const rate = user.tier === "Premium" ? 0.00005 : user.tier === "Regular" ? 0.00002 : 0.000005;
    return Math.floor(user.purchaseCount + totalSimulatedEvents * rate);
  };

  const computedSelectedUser = React.useMemo(() => {
    const user = mockEngine.users.find(u => u.id === selectedUserId) || mockEngine.users[0];
    if (!isSimulating) return user;

    const rate = user.tier === "Premium" ? 0.25 : user.tier === "Regular" ? 0.10 : 0.02;
    const dynamicRevenue = Math.floor(user.revenue + totalSimulatedEvents * rate);

    const ordersRate = user.tier === "Premium" ? 0.00005 : user.tier === "Regular" ? 0.00002 : 0.000005;
    const dynamicPurchaseCount = Math.floor(user.purchaseCount + totalSimulatedEvents * ordersRate);

    // Drifts for behavior metrics
    const sessionsDelta = Math.floor(totalSimulatedEvents * 0.0001);
    const dynamicSessions = user.behavior.sessions + sessionsDelta;
    const dynamicDaysActive = user.behavior.daysActive + Math.floor(sessionsDelta / 4);
    const dynamicProductsViewed = user.behavior.productsViewed + Math.floor(totalSimulatedEvents * 0.001);
    const dynamicCartAdds = user.behavior.cartAdds + Math.floor(totalSimulatedEvents * 0.0002);
    const dynamicSearches = user.behavior.searches + Math.floor(totalSimulatedEvents * 0.0005);
    const dynamicWishlist = user.behavior.wishlist + Math.floor(totalSimulatedEvents * 0.0001);

    // Demographics Pin Code / Language wiggles
    const dynamicPinCode = isSimulating 
      ? `${user.demographics.pincode.slice(0, 5)}${Math.floor(Math.sin(totalSimulatedEvents / 1000) * 4 + 5)}`
      : user.demographics.pincode;

    // Category spend wiggles:
    const dynamicCategorySpend = user.categorySpend.map((item, idx) => {
      const wiggle = Math.sin(totalSimulatedEvents / (1000 + idx * 500)) * 1.5;
      const newPct = Math.max(1, Math.min(99, parseFloat((item.pct + wiggle).toFixed(1))));
      return { ...item, pct: newPct };
    });

    // Commerce details wiggles
    const dynamicBasketSize = Math.floor(user.commerceDetails.basketSize + Math.sin(totalSimulatedEvents / 1500) * 45);

    return {
      ...user,
      revenue: dynamicRevenue,
      purchaseCount: dynamicPurchaseCount,
      behavior: {
        ...user.behavior,
        sessions: dynamicSessions,
        daysActive: dynamicDaysActive,
        productsViewed: dynamicProductsViewed,
        cartAdds: dynamicCartAdds,
        searches: dynamicSearches,
        wishlist: dynamicWishlist
      },
      categorySpend: dynamicCategorySpend,
      commerceDetails: {
        ...user.commerceDetails,
        basketSize: dynamicBasketSize
      },
      demographics: {
        ...user.demographics,
        pincode: dynamicPinCode
      }
    };
  }, [selectedUserId, isSimulating, totalSimulatedEvents]);

  const selectedUser = computedSelectedUser;
  const setSelectedUser = (u: UserProfile) => setSelectedUserId(u.id);

  const [activeTab, setActiveTab] = useState<"Overview" | "Journey" | "Orders" | "Events" | "Properties" | "Segments" | "Notes">("Overview");
  
  // Sort and filter states
  const [sortOption, setSortOption] = useState<"name" | "ltv" | "active">("active");
  const [filterTier, setFilterTier] = useState<"All" | "Premium" | "Regular" | "New" | "At Risk">("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // Stateful notes to support adding custom comments live
  const [userNotes, setUserNotes] = useState<Record<string, UserProfile["notes"]>>({});
  const [newNoteText, setNewNoteText] = useState("");

  // Segment creation states
  const [userSegments, setUserSegments] = useState<Record<string, string[]>>({});
  const [customSegmentName, setCustomSegmentName] = useState("");

  // Retrieve current notes for selected user
  const getNotes = (userId: string) => {
    return userNotes[userId] || selectedUser.notes || [];
  };

  // Add new note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const currentNotes = getNotes(selectedUser.id);
    const newNote = {
      author: "Aryan Chandra",
      text: newNoteText.trim(),
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" })
    };

    setUserNotes({
      ...userNotes,
      [selectedUser.id]: [newNote, ...currentNotes]
    });
    setNewNoteText("");
  };

  // Retrieve active segments for selected user
  const getSegments = (userId: string) => {
    return userSegments[userId] || selectedUser.segments || [];
  };

  // Add segment membership
  const handleAddSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSegmentName.trim()) return;

    const currentSegments = getSegments(selectedUser.id);
    if (!currentSegments.includes(customSegmentName.trim())) {
      setUserSegments({
        ...userSegments,
        [selectedUser.id]: [...currentSegments, customSegmentName.trim()]
      });
    }
    setCustomSegmentName("");
  };

  // Filter and sort users list
  const filteredUsers = mockEngine.users
    .filter(u => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) || 
        u.phone.includes(query) ||
        u.id.toLowerCase().includes(query);
      
      const matchesTier = filterTier === "All" || u.tier === filterTier;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "ltv") return getDynamicUserRevenue(b) - getDynamicUserRevenue(a);
      // Sort by active: Premium tier first, then active status
      if (sortOption === "active") {
        if (a.tier === "Premium" && b.tier !== "Premium") return -1;
        if (b.tier === "Premium" && a.tier !== "Premium") return 1;
        return a.lastActive.localeCompare(b.lastActive);
      }
      return 0;
    });

  // Paginated users
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsersList = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Fetch chronological event timeline for selected user
  const getUserEvents = (userId: string): AnalyticsEvent[] => {
    return mockEngine.events
      .filter(e => e.user.id === userId)
      .reverse(); // Latest actions first
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Mobile": return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case "Tablet": return <Tablet className="w-4 h-4 text-accent-blue" />;
      default: return <Monitor className="w-4 h-4 text-text-muted" />;
    }
  };

  // Tiers and Badge Color maps
  const getTierBadge = (tier: UserProfile["tier"]) => {
    switch (tier) {
      case "Premium":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-primary">Premium</span>;
      case "Regular":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-border-subtle text-text-muted">Regular</span>;
      case "New":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">New</span>;
      case "At Risk":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-400">At Risk</span>;
      default:
        return null;
    }
  };

  // RFM classification tooltip/desc helper
  const getRFMDescription = (rfmClass: UserProfile["rfmClass"]) => {
    switch (rfmClass) {
      case "Champions": return "Recent, frequent, and big spenders. Reward them & act as brand ambassadors.";
      case "Loyal Customers": return "Spend good money regularly. Responsive to promotions.";
      case "Potential Loyalists": return "Recent customers with average frequency. Offer membership programs.";
      case "At Risk": return "Spent big, but haven't bought in a while. Run reactivation campaigns.";
      case "Lost Customers": return "Lowest recency, frequency, and monetary scores. Avoid costly targeting.";
      default: return "";
    }
  };

  const PIE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b"];

  // Helper values to show trend percentages in 4 boxes
  const getMetricTrends = (userId: string) => {
    // Rohan Verma is the primary benchmark user in design
    if (userId === "usr_10002345") {
      return { ltv: "+18.4%", orders: "+12.0%", aov: "+5.8%", repeat: "65%" };
    }
    return { ltv: "+4.2%", orders: "+2.0%", aov: "+1.5%", repeat: "52%" };
  };

  const trends = getMetricTrends(selectedUser.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-12">
      
      {/* ================= LEFT COLUMN: USER DIRECTORY ================= */}
      <div className="lg:col-span-1 glass-panel rounded-2xl p-5 flex flex-col gap-4 overflow-hidden h-fit">
        <div>
          <h2 className="text-md font-bold text-text-bright flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            User 360
          </h2>
          <p className="text-xs text-text-muted">Comprehensive view of customer behavior, journey, value, and engagement.</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by id, email, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-bright font-mono transition-colors placeholder:text-text-muted/60"
            />
          </div>

          <div className="flex gap-2">
            {/* Filter Dropdown */}
            <div className="flex-1 relative">
              <select
                value={filterTier}
                onChange={(e) => {
                  setFilterTier(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900 border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-bright cursor-pointer appearance-none"
              >
                <option value="All">All Tiers</option>
                <option value="Premium">Premium</option>
                <option value="Regular">Regular</option>
                <option value="New">New</option>
                <option value="At Risk">At Risk</option>
              </select>
              <Filter className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-text-muted" />
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex-1 relative">
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900 border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-bright cursor-pointer appearance-none"
              >
                <option value="active">Sort: Active</option>
                <option value="ltv">Sort: LTV</option>
                <option value="name">Sort: Name</option>
              </select>
              <Settings className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-text-muted" />
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Directory List Container */}
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {currentUsersList.length > 0 ? (
            currentUsersList.map((user) => {
              const isSelected = selectedUser.id === user.id;
              const hasOrders = user.purchaseCount > 0;
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setActiveTab("Overview");
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex flex-col gap-2 ${
                    isSelected 
                      ? "bg-slate-900 border-primary shadow-sm" 
                      : "bg-slate-900/30 border-border-subtle hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full bg-slate-950 border border-border-subtle p-0.5"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-text-bright flex items-center gap-1.5">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-text-muted font-mono">{user.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getTierBadge(user.tier)}
                      <span className="text-[9px] text-text-muted font-mono">{user.lastActive}</span>
                    </div>
                  </div>

                  {/* Quick Metadata Row */}
                  <div className="flex justify-between items-center text-[10px] bg-slate-950/40 p-2 rounded-lg border border-border-subtle/50">
                    <span className="text-text-muted font-semibold flex items-center gap-0.5">
                      LTV: <span className="text-emerald-400 font-bold font-mono">₹{getDynamicUserRevenue(user).toLocaleString("en-IN")}</span>
                    </span>
                    <span className="text-text-muted font-semibold font-mono">
                      Orders: <span className="text-accent-blue font-bold">{getDynamicUserOrders(user)}</span>
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                      user.riskStatus === "High Value" || user.riskStatus === "Frequent Buyer"
                        ? "bg-emerald-500/10 text-primary border border-emerald-500/20"
                        : user.riskStatus === "At Risk"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-slate-900 text-text-muted border border-border-subtle"
                    }`}>
                      {user.riskStatus}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-text-muted space-y-1">
              <Users className="w-8 h-8 mx-auto text-slate-800 animate-bounce" />
              <p className="text-xs font-semibold">No customers match your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination Strip */}
        <div className="flex justify-between items-center border-t border-border-subtle pt-3.5 mt-2">
          <span className="text-[10px] text-text-muted">
            Page <span className="font-bold text-text-bright">{currentPage}</span> of <span className="font-bold text-text-bright">{totalPages}</span>
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-900 border border-border-subtle text-xs font-bold text-text-muted hover:text-text-bright hover:border-slate-800 disabled:opacity-40 disabled:hover:text-text-muted transition-all cursor-pointer"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-slate-900 border border-border-subtle text-xs font-bold text-text-muted hover:text-text-bright hover:border-slate-800 disabled:opacity-40 disabled:hover:text-text-muted transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT MAIN PANEL: CUSTOMER 360 WORKSPACE ================= */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* 1. Header Profile Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
          {/* Header Identity Row */}
          <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatarUrl}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full bg-slate-900 border-2 border-primary/30 p-1"
              />
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-black text-text-bright tracking-tight">{selectedUser.name}</h3>
                  <div className="flex gap-1">
                    {getTierBadge(selectedUser.tier)}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
                      {selectedUser.rfmClass}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted font-semibold">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedUser.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedUser.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedUser.country}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 text-xs text-right self-stretch md:self-auto border-t md:border-t-0 border-border-subtle pt-3 md:pt-0">
              <div className="flex items-center gap-1 text-text-muted">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Last Active: <span className="font-bold text-text-bright font-mono">{selectedUser.lastActive}</span></span>
              </div>
              <span className="text-[10px] text-text-muted font-mono">Customer ID: <span className="text-primary font-bold">{selectedUser.id}</span></span>
            </div>
          </div>

          {/* 4 Core Business Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border-subtle pt-5">
            {/* LTV */}
            <div className="bg-slate-950/40 border border-border-subtle/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Life Time Value (LTV)</span>
              <p className="text-xl font-black text-emerald-400 mt-1.5 font-mono">₹{getDynamicUserRevenue(selectedUser).toLocaleString("en-IN")}</p>
              <div className="flex items-center gap-1 text-[9px] mt-1 font-semibold">
                <span className="bg-emerald-500/10 text-primary px-1 rounded">{trends.ltv}</span>
                <span className="text-text-muted">{isSimulating ? "Simulating" : "vs last month"}</span>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-slate-950/40 border border-border-subtle/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Orders</span>
              <p className="text-xl font-black text-accent-blue mt-1.5 font-mono">{getDynamicUserOrders(selectedUser)}</p>
              <div className="flex items-center gap-1 text-[9px] mt-1 font-semibold">
                <span className="bg-emerald-500/10 text-primary px-1 rounded">{trends.orders}</span>
                <span className="text-text-muted">{isSimulating ? "Simulating" : "vs last month"}</span>
              </div>
            </div>

            {/* AOV */}
            <div className="bg-slate-950/40 border border-border-subtle/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Avg Order Value (AOV)</span>
              <p className="text-xl font-black text-text-bright mt-1.5 font-mono">
                ₹{getDynamicUserOrders(selectedUser) > 0 
                  ? Math.round(getDynamicUserRevenue(selectedUser) / getDynamicUserOrders(selectedUser)).toLocaleString("en-IN")
                  : "0"}
              </p>
              <div className="flex items-center gap-1 text-[9px] mt-1 font-semibold">
                <span className="bg-emerald-500/10 text-primary px-1 rounded">{trends.aov}</span>
                <span className="text-text-muted">{isSimulating ? "Simulating" : "vs last month"}</span>
              </div>
            </div>

            {/* Repeat Rate */}
            <div className="bg-slate-950/40 border border-border-subtle/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Repeat Purchase Rate</span>
              <p className="text-xl font-black text-accent-purple mt-1.5">{trends.repeat}</p>
              <div className="flex items-center gap-1 text-[9px] mt-1 font-semibold">
                <span className="bg-emerald-500/10 text-primary px-1 rounded">+2.4%</span>
                <span className="text-text-muted">rolling avg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sub-Tabs Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-border-subtle overflow-x-auto select-none no-scrollbar">
          {(["Overview", "Journey", "Orders", "Events", "Properties", "Segments", "Notes"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4.5 py-2 text-xs font-bold rounded-lg transition-all flex-shrink-0 cursor-pointer ${
                activeTab === tab 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-text-muted hover:text-text-bright hover:bg-slate-900/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3. Sub-Tab Viewports */}
        <div className="flex-1 min-h-[360px] flex flex-col gap-6">

          {/* ================= TAB: OVERVIEW ================= */}
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col 1: Timeline */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  Behavioral Milestones
                </h4>

                <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-1">
                  {selectedUser.orders && selectedUser.orders.map((ord, index) => (
                    <div key={ord.id} className="relative pl-5 border-l border-border-subtle group">
                      <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-primary" />
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-text-bright">Order {ord.status}: {ord.id}</span>
                          <span className="text-[10px] text-text-muted font-mono">{ord.date}</span>
                        </div>
                        <p className="text-[10px] text-text-muted leading-relaxed truncate">{ord.product}</p>
                        <span className={`inline-flex px-1.5 py-0.2 rounded text-[8px] font-bold ${
                          ord.status === "Delivered"
                            ? "bg-emerald-500/10 text-primary border border-emerald-500/20"
                            : ord.status === "Shipped"
                            ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          ₹{ord.amount.toLocaleString("en-IN")} • {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* General timeline actions */}
                  <div className="relative pl-5 border-l border-border-subtle group">
                    <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-accent-purple" />
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-text-bright">Account Registration</span>
                        <span className="text-[10px] text-text-muted font-mono">{selectedUser.signupDate}</span>
                      </div>
                      <p className="text-[10px] text-text-muted">Onboarded via {selectedUser.channel}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2: Engagement & Spend */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-accent-blue" />
                  E-Commerce Footprint
                </h4>

                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Spend Share Pie */}
                  <div className="h-32 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={selectedUser.categorySpend}
                          cx="50%"
                          cy="50%"
                          innerRadius={22}
                          outerRadius={38}
                          paddingAngle={3}
                          dataKey="pct"
                        >
                          {selectedUser.categorySpend.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}
                          itemStyle={{ fontSize: "9px", color: "#f3f4f6" }}
                          formatter={(val) => [`${val}%`, "Share"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Tiny inline legend */}
                    <div className="flex flex-col gap-1.5 pl-2 select-none text-[8px] font-bold text-text-muted max-w-[100px] truncate">
                      {selectedUser.categorySpend.map((item, idx) => (
                        <div key={item.category} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                          <span className="truncate">{item.category} ({item.pct}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Channel usage */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Platform Channels</span>
                    <div className="space-y-1.5">
                      {selectedUser.channels && selectedUser.channels.map((ch, idx) => (
                        <div key={ch.name} className="space-y-0.5 text-[10px]">
                          <div className="flex justify-between font-semibold">
                            <span className="text-text-muted">{ch.name}</span>
                            <span className="text-text-bright font-mono">{ch.pct}%</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${ch.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 3: Details Panel */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-accent-purple" />
                  Demographics & Specs
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Pincode & City */}
                  <div className="space-y-1 pb-2 border-b border-border-subtle">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Demographic Profile</span>
                    <p className="text-text-bright font-bold flex justify-between">
                      <span>{selectedUser.demographics.city}</span>
                      <span className="text-text-muted font-mono">{selectedUser.demographics.pincode}</span>
                    </p>
                    <p className="text-[10px] text-text-muted">Language preference: {selectedUser.demographics.language}</p>
                  </div>

                  {/* Device Specs */}
                  <div className="space-y-1 pb-2 border-b border-border-subtle">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Device Hardware</span>
                    <p className="text-text-bright font-bold flex items-center gap-1">
                      {getDeviceIcon(selectedUser.device)}
                      <span>{selectedUser.deviceDetails.name}</span>
                    </p>
                    <p className="text-[10px] text-text-muted">{selectedUser.deviceDetails.os} • App version {selectedUser.deviceDetails.appVersion}</p>
                  </div>

                  {/* Transaction specs */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Commerce Habits</span>
                    <div className="space-y-1 text-[10px] text-text-muted font-semibold">
                      <div className="flex justify-between">
                        <span>Preferred Category:</span>
                        <span className="text-text-bright">{selectedUser.commerceDetails.preferredCat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span className="text-text-bright">{selectedUser.commerceDetails.paymentPref}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Basket Size:</span>
                        <span className="text-primary font-bold">₹{selectedUser.commerceDetails.basketSize.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return Rate:</span>
                        <span className="text-red-400 font-bold">{selectedUser.commerceDetails.returnRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: JOURNEY ================= */}
          {activeTab === "Journey" && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
              <div>
                <h4 className="text-sm font-bold text-text-bright flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-blue" />
                  E-Commerce Customer Lifecycle Map
                </h4>
                <p className="text-xs text-text-muted">Chronological representation of milestone achievement nodes.</p>
              </div>

              {/* Horizontal node flow */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 overflow-x-auto select-none">
                
                {/* Node 1: Signup */}
                <div className="flex flex-col items-center gap-2 text-center min-w-[120px]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 border-2 border-primary text-primary shadow-sm font-bold text-xs">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-text-bright">Registered</span>
                  <span className="text-[9px] text-text-muted">{selectedUser.signupDate}</span>
                </div>

                <ArrowRight className="w-5 h-5 text-text-muted/40 hidden md:block" />

                {/* Node 2: Browse */}
                <div className="flex flex-col items-center gap-2 text-center min-w-[120px]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 border-2 border-primary text-primary shadow-sm font-bold text-xs">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-text-bright">Browsed PDPs</span>
                  <span className="text-[9px] text-text-muted">{selectedUser.behavior.productsViewed} viewed</span>
                </div>

                <ArrowRight className="w-5 h-5 text-text-muted/40 hidden md:block" />

                {/* Node 3: Add to Cart */}
                <div className="flex flex-col items-center gap-2 text-center min-w-[120px]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 border-2 border-primary text-primary shadow-sm font-bold text-xs">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-text-bright">Added to Cart</span>
                  <span className="text-[9px] text-text-muted">{selectedUser.behavior.cartAdds} additions</span>
                </div>

                <ArrowRight className="w-5 h-5 text-text-muted/40 hidden md:block" />

                {/* Node 4: First Order */}
                <div className={`flex flex-col items-center gap-2 text-center min-w-[120px] ${
                  selectedUser.purchaseCount > 0 ? "opacity-100" : "opacity-30"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    selectedUser.purchaseCount > 0 
                      ? "bg-primary/20 border-2 border-primary text-primary" 
                      : "bg-slate-900 border border-border-subtle text-text-muted"
                  }`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-text-bright">First Purchase</span>
                  <span className="text-[9px] text-text-muted">
                    {selectedUser.purchaseCount > 0 ? "Delivered successfully" : "Pending Order"}
                  </span>
                </div>

                <ArrowRight className="w-5 h-5 text-text-muted/40 hidden md:block" />

                {/* Node 5: Premium Tier */}
                <div className={`flex flex-col items-center gap-2 text-center min-w-[120px] ${
                  selectedUser.tier === "Premium" ? "opacity-100" : "opacity-30"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    selectedUser.tier === "Premium" 
                      ? "bg-primary/20 border-2 border-primary text-primary" 
                      : "bg-slate-900 border border-border-subtle text-text-muted"
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-text-bright">Premium Status</span>
                  <span className="text-[9px] text-text-muted">
                    {selectedUser.tier === "Premium" ? "VIP Champions Tier" : "Ineligible LTV"}
                  </span>
                </div>

              </div>

              {/* Funnel conversion summary list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-border-subtle/80 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Sessions Engagement</span>
                  <p className="text-sm font-bold text-text-bright mt-1">
                    {selectedUser.behavior.sessions} sessions over {selectedUser.behavior.daysActive} days active
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                    Average of {Math.round(selectedUser.behavior.productsViewed / selectedUser.behavior.sessions)} products viewed per session.
                  </p>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-border-subtle/80 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Onsite Checkout Conversions</span>
                  <p className="text-sm font-bold text-text-bright mt-1">
                    {selectedUser.behavior.cartAdds} items added • {selectedUser.purchaseCount} purchases completed
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                    Cart-to-Order Conversion rate: <span className="text-primary font-bold">{selectedUser.behavior.cartAdds > 0 ? Math.round((selectedUser.purchaseCount / selectedUser.behavior.cartAdds) * 100) : 0}%</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: ORDERS ================= */}
          {activeTab === "Orders" && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-text-bright">E-Commerce Transaction Log</h4>
                <p className="text-xs text-text-muted">A dedicated data table logs history of orders paid by UPI or Credit card.</p>
              </div>

              {selectedUser.orders && selectedUser.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border-subtle text-text-muted font-bold">
                        <th className="py-2.5 pr-2">Order ID</th>
                        <th className="py-2.5 px-2">Date</th>
                        <th className="py-2.5 px-2">Product & Seller</th>
                        <th className="py-2.5 px-2">Category</th>
                        <th className="py-2.5 px-2 text-right">Amount</th>
                        <th className="py-2.5 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/40">
                      {selectedUser.orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="py-3 pr-2 font-mono text-primary font-bold">{ord.id}</td>
                          <td className="py-3 px-2 text-text-muted font-mono">{ord.date}</td>
                          <td className="py-3 px-2">
                            <span className="font-bold text-text-bright block truncate max-w-[200px]">{ord.product}</span>
                            <span className="text-[10px] text-text-muted block">{ord.seller}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-border-subtle font-semibold text-text-muted">
                              {ord.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-bold text-text-bright">₹{ord.amount.toLocaleString("en-IN")}</td>
                          <td className="py-3 pl-2 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === "Delivered"
                                ? "bg-emerald-500/10 text-primary border border-emerald-500/20"
                                : ord.status === "Shipped"
                                ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                                : ord.status === "Placed"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-text-muted space-y-1">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-800 animate-pulse" />
                  <p className="text-xs font-semibold">No transaction records found for this customer.</p>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: EVENTS ================= */}
          {activeTab === "Events" && (
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 overflow-hidden">
              <div>
                <h4 className="text-sm font-bold text-text-bright flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  Ecosystem Telemetry Streams
                </h4>
                <p className="text-xs text-text-muted">Filterable log of actions recorded by client SDKs.</p>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[320px] pr-1">
                {getUserEvents(selectedUser.id).length > 0 ? (
                  getUserEvents(selectedUser.id).map((evt) => (
                    <div key={evt.id} className="relative pl-5 border-l border-border-subtle/80 group">
                      <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-primary" />
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-text-bright">{evt.name}</span>
                          <span className="text-[10px] text-text-muted font-mono">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        
                        {/* Collapsible raw metadata */}
                        <div className="bg-slate-950/80 border border-border-subtle rounded-lg p-2.5 text-[10px] font-mono text-text-muted flex items-start gap-1">
                          <CornerDownRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <pre className="overflow-x-auto w-full text-[9px]">
                            {JSON.stringify({ product: evt.product, context: evt.context, experiment: evt.experiment, businessImpact: evt.businessImpact }, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted text-center py-10">No events found for this customer.</p>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: PROPERTIES ================= */}
          {activeTab === "Properties" && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-text-bright">User Properties Directory</h4>
                <p className="text-xs text-text-muted">Technical variables mapped under nested e-commerce schema structure.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Demographics & Device */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Demographics Schema</span>
                    <div className="bg-slate-900/40 rounded-xl p-3 border border-border-subtle space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-text-muted">city</span><span className="font-semibold text-text-bright">{selectedUser.demographics.city}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">pincode</span><span className="font-mono text-text-bright">{selectedUser.demographics.pincode}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">language</span><span className="font-semibold text-text-bright">{selectedUser.demographics.language}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">country</span><span className="font-semibold text-text-bright">{selectedUser.country}</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Device Context</span>
                    <div className="bg-slate-900/40 rounded-xl p-3 border border-border-subtle space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-text-muted">device_type</span><span className="font-semibold text-text-bright">{selectedUser.device}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">browser</span><span className="font-semibold text-text-bright">{selectedUser.browser}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">os</span><span className="font-semibold text-text-bright">{selectedUser.deviceDetails.os}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">app_version</span><span className="font-mono text-text-bright">{selectedUser.deviceDetails.appVersion}</span></div>
                    </div>
                  </div>
                </div>

                {/* Commerce & Behavior */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Commerce Attributes</span>
                    <div className="bg-slate-900/40 rounded-xl p-3 border border-border-subtle space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-text-muted">preferred_category</span><span className="font-semibold text-text-bright">{selectedUser.commerceDetails.preferredCat}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">payment_method</span><span className="font-semibold text-text-bright">{selectedUser.commerceDetails.paymentPref}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">avg_basket_size</span><span className="font-bold text-primary">₹{selectedUser.commerceDetails.basketSize.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">return_rate</span><span className="font-bold text-red-400">{selectedUser.commerceDetails.returnRate}%</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Engagement telemetry</span>
                    <div className="bg-slate-900/40 rounded-xl p-3 border border-border-subtle space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-text-muted">sessions</span><span className="font-semibold text-text-bright">{selectedUser.behavior.sessions}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">days_active</span><span className="font-semibold text-text-bright">{selectedUser.behavior.daysActive}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">wishlist_additions</span><span className="font-semibold text-text-bright">{selectedUser.behavior.wishlist}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted">coupons_used</span><span className="font-semibold text-text-bright">{selectedUser.behavior.coupons}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: SEGMENTS ================= */}
          {activeTab === "Segments" && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-text-bright">Dynamic Segment Memberships</h4>
                  <p className="text-xs text-text-muted">List of user segment properties. Add custom cohorts below.</p>
                </div>
              </div>

              {/* Cohorts Membership Grid */}
              <div className="flex flex-wrap gap-2.5 py-2">
                {getSegments(selectedUser.id).map((seg, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 border border-primary/20 text-primary shadow-sm select-none"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {seg}
                  </span>
                ))}
              </div>

              {/* Add Custom Segment Trigger Form */}
              <form onSubmit={handleAddSegment} className="flex gap-2 border-t border-border-subtle pt-5 mt-2">
                <input
                  type="text"
                  placeholder="e.g. UPI Power User, Bengaluru Techie..."
                  value={customSegmentName}
                  onChange={(e) => setCustomSegmentName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-bright"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1 select-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Associate Segment</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB: NOTES ================= */}
          {activeTab === "Notes" && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between gap-5 h-full">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-text-bright">Internal Team Logs</h4>
                  <p className="text-xs text-text-muted">Team updates regarding user issues, payments, and checkout exceptions.</p>
                </div>

                {/* Team notes timeline stream */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {getNotes(selectedUser.id).length > 0 ? (
                    getNotes(selectedUser.id).map((note, index) => (
                      <div key={index} className="p-3 bg-slate-900/60 rounded-xl border border-border-subtle flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-primary flex items-center gap-1">
                            <Bookmark className="w-3 h-3 text-primary" />
                            {note.author}
                          </span>
                          <span className="text-text-muted font-mono">{note.date}</span>
                        </div>
                        <p className="text-xs text-text-bright leading-relaxed">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-muted text-center py-6">No notes added. Start the discussion below.</p>
                  )}
                </div>
              </div>

              {/* Add Note Input Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 border-t border-border-subtle pt-4">
                <input
                  type="text"
                  placeholder="Type notes or alerts here..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-bright"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1 select-none cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Note</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* 4. Footer Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border-subtle pt-6 mt-2">
          
          {/* RFM Score card */}
          <div className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">RFM Value score</span>
                <span className="text-lg font-black text-primary font-mono mt-1 block">{selectedUser.rfm}</span>
              </div>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed mt-2">
              <span className="font-bold text-text-bright block">{selectedUser.rfmClass} Group</span>
              {getRFMDescription(selectedUser.rfmClass)}
            </p>
          </div>

          {/* Active segments checklist */}
          <div className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Active Segments</span>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {getSegments(selectedUser.id).slice(0, 3).map((seg, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-slate-900 border border-border-subtle text-text-muted truncate max-w-[120px]">
                    {seg}
                  </span>
                ))}
                {getSegments(selectedUser.id).length > 3 && (
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                    +{getSegments(selectedUser.id).length - 3} more
                  </span>
                )}
              </div>
            </div>
            <p className="text-[9px] text-text-muted mt-2 font-semibold">
              Based on real-time event analytics rules.
            </p>
          </div>

          {/* Recent notes block */}
          <div className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Recent Comment</span>
              <FileText className="w-4 h-4 text-accent-blue" />
            </div>
            <div className="mt-2 text-[10px] text-text-muted">
              {getNotes(selectedUser.id).length > 0 ? (
                <>
                  <p className="line-clamp-2 text-text-bright font-semibold">"{getNotes(selectedUser.id)[0].text}"</p>
                  <span className="text-[8px] mt-1 block font-mono text-primary font-bold">BY {getNotes(selectedUser.id)[0].author.toUpperCase()}</span>
                </>
              ) : (
                <p className="italic">No team logs registered for this customer record.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
