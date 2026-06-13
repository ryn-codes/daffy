"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Search, 
  Filter, 
  Plus, 
  X, 
  ChevronRight, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Database,
  Sliders,
  Sparkles,
  TrendingUp,
  Cpu,
  Clock,
  Briefcase,
  Play,
  RotateCcw,
  HelpCircle,
  Code
} from "lucide-react";
import { mockEngine, AnalyticsEvent } from "@/lib/mockEngine";

export default function EventsTab() {
  const [activeSubTab, setActiveSubTab] = useState<"explorer" | "stream" | "taxonomy" | "quality">("explorer");
  
  // Environment & filters states
  const [platformFilter, setPlatformFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<AnalyticsEvent | null>(null);

  // Advanced Filters builder
  const [filters, setFilters] = useState<{ property: string; operator: string; value: string }[]>([]);
  const [newProperty, setNewProperty] = useState("context.city");
  const [newOperator, setNewOperator] = useState("equals");
  const [newValue, setNewValue] = useState("");

  const addFilter = () => {
    if (!newProperty || !newValue) return;
    setFilters([...filters, { property: newProperty, operator: newOperator, value: newValue }]);
    setNewProperty("context.city");
    setNewValue("");
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, idx) => idx !== index));
  };

  // Simulated Live Stream Console state
  const [liveLogs, setLiveLogs] = useState<{ time: string; event: string; device: string; detail: string }[]>([
    { time: "20:30:01", event: "app_opened", device: "Android", detail: "version v12.4, city Mumbai" },
    { time: "20:30:02", event: "homepage_viewed", device: "iOS", detail: "banner: festival_sale" },
    { time: "20:30:04", event: "search_started", device: "Web", detail: "query: iPhone 15" }
  ]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Live Stream tick simulator
  useEffect(() => {
    if (activeSubTab !== "stream") return;
    
    const interval = setInterval(() => {
      const users = mockEngine.users;
      const user = users[Math.floor(Math.random() * users.length)];
      const randEvent = ["search_completed", "product_viewed", "cart_added", "payment_attempted", "payment_success"][Math.floor(Math.random() * 5)];
      
      let detail = `user: ${user.name}`;
      if (randEvent === "product_viewed") detail = `SKU: MOB12345 (iPhone 15)`;
      else if (randEvent === "cart_added") detail = `added to cart (₹69,999)`;
      else if (randEvent === "payment_success") detail = `payment UPI success (₹69,999)`;

      const log = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        event: randEvent,
        device: user.device,
        detail
      };

      setLiveLogs(prev => [...prev.slice(-30), log]); // Keep last 30
      
      // Auto Scroll
      setTimeout(() => consoleBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 1200);

    return () => clearInterval(interval);
  }, [activeSubTab]);

  // Selected Taxonomy category state
  const [activeCategory, setActiveCategory] = useState("Discovery");
  const taxonomyCategories = {
    "Acquisition": ["app_opened", "signup_completed"],
    "Discovery": ["search_started", "search_completed", "product_viewed", "product_image_clicked"],
    "Commerce": ["cart_added", "checkout_started", "order_created"],
    "Delivery": ["delivery_completed"],
    "Problems": ["payment_failed", "checkout_abandoned"],
    "Marketplace": ["seller_cancellation", "out_of_stock"]
  };

  const [activeTaxonomyEvent, setActiveTaxonomyEvent] = useState("product_viewed");

  // AI assistant chat state
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswers, setAiAnswers] = useState<string[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleAskAI = (queryText?: string) => {
    const query = queryText || aiQuery;
    if (!query) return;

    setIsAiTyping(true);
    setAiQuery("");

    setTimeout(() => {
      let answer = "Checkout conversion dropped 4.8% yesterday. Primary cause: UPI payment failures on HDFC/SBI banks affecting Android mobile users on Version 12.4. Lost influenced GMV estimated at ₹12.3 Cr. Recommended action: Rollback payment SDK version immediately.";
      if (query.toLowerCase().includes("instrumentation") || query.toLowerCase().includes("schemas")) {
        answer = "Instrumentation health is 96.8% coverage. Discovered 328 schema violations today. Major issue: checkout_started events missing payment_method property (45% impact). Please re-verify SDK trigger parameters.";
      }
      setAiAnswers(prev => [...prev, query, answer]);
      setIsAiTyping(false);
    }, 1000);
  };

  // Filter main event logs list
  const filteredEvents = mockEngine.events.filter(e => {
    // 1. Platform Filter
    if (platformFilter !== "All" && e.context.device !== platformFilter) return false;
    
    // 2. Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      e.name.toLowerCase().includes(q) ||
      e.user.name.toLowerCase().includes(q) ||
      e.context.city.toLowerCase().includes(q) ||
      (e.product && e.product.name.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // 3. Custom Advanced Filters builder match
    return filters.every(f => {
      let actualVal = (e as any)[f.property];
      
      // Property lookup adaptions
      if (f.property.startsWith("user.")) actualVal = (e.user as any)[f.property.split(".")[1]];
      else if (f.property.startsWith("context.")) actualVal = (e.context as any)[f.property.split(".")[1]];
      else if (e.product && f.property.startsWith("product.")) actualVal = (e.product as any)[f.property.split(".")[1]];

      if (actualVal === undefined) return false;

      const filterVal = f.value.toLowerCase();
      const stringVal = String(actualVal).toLowerCase();

      if (f.operator === "equals") return stringVal === filterVal;
      if (f.operator === "contains") return stringVal.includes(filterVal);
      if (f.operator === ">") return Number(actualVal) > Number(f.value);
      if (f.operator === "<") return Number(actualVal) < Number(f.value);
      return false;
    });
  }).reverse(); // Latest events first

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Mobile": return <Smartphone className="w-3.5 h-3.5" />;
      case "Tablet": return <Tablet className="w-3.5 h-3.5" />;
      default: return <Monitor className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 h-full relative">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright flex items-center gap-2">
            Event Intelligence Platform <Sparkles className="w-5.5 h-5.5 text-primary" />
          </h1>
          <p className="text-xs text-text-muted">Monitor customer behavior, instrumentation quality, and marketplace activity in real time.</p>
        </div>

        {/* Global Controls Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-border-subtle text-xs select-none">
            <span className="text-text-muted">Env:</span>
            <span className="font-bold text-primary">Production</span>
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-border-subtle rounded-lg focus:outline-none text-text-bright cursor-pointer"
          >
            <option value="All">Platform: All</option>
            <option value="Mobile">Mobile (Android/iOS)</option>
            <option value="Desktop">Desktop (Web)</option>
            <option value="Tablet">Tablet</option>
          </select>

          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-bold text-primary animate-pulse">
            ● Live Stream Connected
          </div>
        </div>
      </div>

      {/* 1. Event Health Command Center */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <span className="block text-[10px] text-text-muted uppercase">Events Today</span>
          <span className="text-xl font-bold text-text-bright mt-1 block">5.8 Billion</span>
          <span className="text-[9px] text-primary font-bold bg-primary/10 px-1 rounded block w-fit mt-1">+4.2% today</span>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <span className="block text-[10px] text-text-muted uppercase">Ingestion Rate</span>
          <span className="text-xl font-bold text-text-bright mt-1 block">68,400/sec</span>
          <span className="text-[9px] text-text-muted block mt-1.5">Load levels normal</span>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <span className="block text-[10px] text-text-muted uppercase">Tracking Coverage</span>
          <span className="text-xl font-bold text-primary mt-1 block">96.8%</span>
          <span className="text-[9px] text-primary font-semibold block mt-1.5">Healthy Ingestion</span>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <span className="block text-[10px] text-text-muted uppercase">Ingestion Errors</span>
          <span className="text-xl font-bold text-red-400 mt-1 block">12,450</span>
          <span className="text-[9px] text-red-400 font-semibold block mt-1.5">0.02% failure rate</span>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <span className="block text-[10px] text-text-muted uppercase">Schema Violations</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">328</span>
          <span className="text-[9px] text-amber-400 font-bold bg-amber-400/10 px-1 rounded block w-fit mt-1">Needs Attention</span>
        </div>
      </div>

      {/* Sub-Tabs Switcher bar */}
      <div className="flex border-b border-border-subtle gap-1 select-none">
        {[
          { id: "explorer", label: "Telemetry Explorer", icon: Database },
          { id: "stream", label: "Live Event Stream", icon: Terminal },
          { id: "taxonomy", label: "E-Commerce Taxonomy", icon: Sliders },
          { id: "quality", label: "Instrumentation Health", icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                isActive 
                  ? "border-primary text-primary" 
                  : "border-transparent text-text-muted hover:text-text-bright"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-Tab Content rendering logic */}
      <div className="flex-1 min-h-[300px]">
        {/* VIEW 1: Telemetry Explorer (Advanced filter builder + Table) */}
        {activeSubTab === "explorer" && (
          <div className="space-y-4">
            {/* Filter builder card */}
            <div className="glass-panel p-4 rounded-xl space-y-3.5">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search e-commerce actions, users, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-bright"
                  />
                </div>
                <span className="text-[10px] text-text-muted uppercase font-bold">{filteredEvents.length} events matching rules</span>
              </div>

              {/* Added rules */}
              {filters.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
                  {filters.map((rule, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-slate-900 border border-border-subtle text-primary font-semibold">
                      <span className="text-text-muted">{rule.property}</span>
                      <span className="font-mono text-text-bright font-bold">{rule.operator}</span>
                      <span>{rule.value}</span>
                      <button onClick={() => removeFilter(idx)} className="p-0.5 hover:bg-slate-800 rounded-full text-text-muted"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add rules fields */}
              <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-border-subtle text-xs">
                <select
                  value={newProperty}
                  onChange={(e) => setNewProperty(e.target.value)}
                  className="px-2 py-1 bg-slate-900 border border-border-subtle rounded focus:outline-none text-text-bright cursor-pointer text-[11px]"
                >
                  <option value="name">Event Name</option>
                  <option value="user.segment">User Segment</option>
                  <option value="user.orders">Lifetime Orders</option>
                  <option value="context.city">City</option>
                  <option value="product.price">Product Price</option>
                  <option value="product.seller">Product Seller</option>
                </select>

                <select
                  value={newOperator}
                  onChange={(e) => setNewOperator(e.target.value)}
                  className="px-2 py-1 bg-slate-900 border border-border-subtle rounded focus:outline-none text-text-bright cursor-pointer text-[11px]"
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                </select>

                <input
                  type="text"
                  placeholder="value (e.g. Bangalore)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="px-2.5 py-1 bg-slate-900 border border-border-subtle rounded focus:outline-none text-text-bright text-[11px] w-36"
                />

                <button
                  onClick={addFilter}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded text-[11px] font-bold hover:bg-primary-hover"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Rule
                </button>
              </div>
            </div>

            {/* Events logs stream grid table */}
            <div className="glass-panel rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-border-subtle text-text-muted uppercase font-bold tracking-wider">
                    <th className="px-6 py-3">Event Action</th>
                    <th className="px-6 py-3">Customer (ID)</th>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Context (City/Device)</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-text-bright">
                  {filteredEvents.map(e => (
                    <tr 
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="hover:bg-slate-900/40 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-3 font-semibold font-mono flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-primary opacity-60 group-hover:opacity-100" />
                        {e.name}
                      </td>
                      <td className="px-6 py-3 text-text-muted">{e.user.name} ({e.user.id})</td>
                      <td className="px-6 py-3 text-text-muted font-semibold">
                        {e.product ? `${e.product.name} (₹${e.product.price.toLocaleString()})` : "—"}
                      </td>
                      <td className="px-6 py-3 text-text-muted">
                        <span className="flex items-center gap-1">
                          {getDeviceIcon(e.context.device)}
                          {e.context.city} ({e.context.device})
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-primary font-bold">
                        <span className="group-hover:underline">Inspect →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2: Kafka-style Live Scrolling Logs Stream */}
        {activeSubTab === "stream" && (
          <div className="glass-panel p-4 rounded-xl bg-slate-950/80 border border-border-subtle flex flex-col justify-between">
            <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle">
              <span className="text-[10px] font-mono text-primary flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                Kafka Event Topic: pal_commerce_events_topic
              </span>
              <span className="text-[9px] text-text-muted font-mono">Ticking in real-time...</span>
            </div>

            {/* Scrolling log text block */}
            <div className="h-72 overflow-y-auto font-mono text-[11px] text-primary p-3 space-y-2 mt-3 bg-black/40 border border-border-subtle rounded-lg">
              {liveLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 leading-relaxed">
                  <span className="text-text-muted">[{log.time}]</span>
                  <span className="text-accent-blue font-bold">{log.event}</span>
                  <span className="text-accent-purple px-1 bg-slate-900 border border-border-subtle rounded text-[9px] font-bold">{log.device}</span>
                  <span className="text-text-bright">{log.detail}</span>
                </div>
              ))}
              <div ref={consoleBottomRef} />
            </div>
          </div>
        )}

        {/* VIEW 3: Event Taxonomy Category Explorer */}
        {activeSubTab === "taxonomy" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category selection */}
            <div className="md:col-span-1 glass-panel p-4 rounded-xl space-y-2.5">
              <span className="text-[10px] font-bold text-text-muted uppercase">E-Commerce Categories</span>
              <div className="space-y-1">
                {Object.entries(taxonomyCategories).map(([cat, evts]) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setActiveTaxonomyEvent(evts[0]);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex justify-between items-center transition-all ${
                        isActive 
                          ? "bg-slate-900 border border-primary text-primary" 
                          : "text-text-muted hover:text-text-bright hover:bg-slate-900/60"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-slate-950 border border-border-subtle rounded text-text-muted font-bold">
                        {evts.length} events
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Events Details list */}
            <div className="md:col-span-2 glass-panel p-5 rounded-xl flex flex-col md:flex-row gap-5 min-h-[350px]">
              {/* Event selector under category */}
              <div className="w-full md:w-48 space-y-2.5 border-b md:border-b-0 md:border-r border-border-subtle pb-4 md:pb-0 md:pr-4 flex-shrink-0">
                <span className="text-[10px] font-bold text-text-muted uppercase">Category events</span>
                <div className="space-y-1">
                  {(taxonomyCategories as any)[activeCategory].map((evtName: string) => {
                    const isSelected = activeTaxonomyEvent === evtName;
                    return (
                      <button
                        key={evtName}
                        onClick={() => setActiveTaxonomyEvent(evtName)}
                        className={`w-full text-left p-2 rounded-lg font-mono text-[10px] truncate block ${
                          isSelected 
                            ? "bg-slate-900 text-primary font-bold border border-primary/20" 
                            : "text-text-muted hover:text-text-bright hover:bg-slate-900/40"
                        }`}
                      >
                        {evtName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Definition explorer panel */}
              <div className="flex-1 flex flex-col justify-between text-xs space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-mono text-sm font-bold text-text-bright">{activeTaxonomyEvent}</span>
                    <span className="bg-emerald-500/10 text-primary border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      Healthy Status
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-text-muted block text-[10px]">Instrumentation Owner</span>
                    <span className="font-semibold text-text-bright flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary" /> Growth Platform Core Team</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-text-muted block text-[10px]">Business Meaning Definition</span>
                    <p className="text-text-bright bg-slate-900 border border-border-subtle rounded-xl p-3 leading-relaxed">
                      Triggered automatically when a customer views product parameters and metadata inside the main shopping application detail drawer.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-subtle text-[10px] text-text-muted">
                  <div><span>Instrumentation: </span><span className="font-bold text-text-bright">Schema v3</span></div>
                  <div><span>Daily Volume: </span><span className="font-bold text-primary">420M actions</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Instrumentation Quality Dashboard */}
        {activeSubTab === "quality" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-panel p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-bright flex items-center gap-1.5">
                  <Database className="w-4.5 h-4.5 text-primary" />
                  Telemetry Schema Validation Rates
                </h3>
                <p className="text-xs text-text-muted">Comparison details of expected vs actual ingestion counts.</p>
              </div>

              <div className="space-y-3.5 mt-4 flex-1 flex flex-col justify-center text-xs">
                {[
                  { name: "checkout_started", expected: 100, received: 98, pct: 98, status: "Healthy" },
                  { name: "cart_added", expected: 120, received: 114, pct: 95, status: "Healthy" },
                  { name: "search_completed", expected: 480, received: 450, pct: 93.7, status: "Healthy" }
                ].map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="font-mono">{item.name}</span>
                      <span className="text-text-muted">{item.received}M / {item.expected}M expected ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Anomalies breakdown */}
            <div className="md:col-span-1 glass-panel p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-bright">Instrumentation Quality Warnings</h3>
                <p className="text-xs text-text-muted">Detected null/duplicate anomalies.</p>
              </div>
              <div className="space-y-3 text-xs mt-3 flex-1 flex flex-col justify-center">
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-text-muted">Missing Properties:</span>
                  <span className="font-bold text-red-400 font-mono">payment_method</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-text-muted">Null/Invalid Properties:</span>
                  <span className="font-bold text-red-400 font-mono">currency=null</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Duplicate event counts:</span>
                  <span className="font-bold text-text-bright font-mono">450K logs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Event Intelligence Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm">
          {/* Overlay close */}
          <div className="absolute inset-0" onClick={() => setSelectedEvent(null)} />
          
          <div className="w-full max-w-xl bg-slate-950 border-l border-border-subtle h-full flex flex-col z-10 shadow-2xl relative p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div>
                <h3 className="text-md font-bold text-text-bright font-mono">{selectedEvent.name}</h3>
                <span className="text-[10px] text-text-muted font-mono">{selectedEvent.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 text-primary border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                  Instrument version v3
                </span>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-border-subtle hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Details panels */}
            <div className="flex-1 overflow-y-auto py-5 space-y-6 text-xs">
              
              {/* Business Impact analysis */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Business Impact</h4>
                <div className="grid grid-cols-2 gap-3.5 bg-slate-900 p-4 rounded-xl border border-border-subtle">
                  <div>
                    <span className="text-text-muted block text-[10px]"> influenced gmv</span>
                    <span className="text-md font-bold text-emerald-400">
                      ₹{selectedEvent.businessImpact?.influencedGMV ? selectedEvent.businessImpact.influencedGMV.toLocaleString() : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">Status</span>
                    <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" /> Healthy Ingest
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer context */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Customer Context</h4>
                <div className="grid grid-cols-3 gap-4 bg-slate-900 p-4 rounded-xl border border-border-subtle">
                  <div>
                    <span className="text-text-muted block text-[10px]">User Profile</span>
                    <span className="font-semibold text-text-bright block truncate">{selectedEvent.user.name}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">User Segment</span>
                    <span className="font-semibold text-text-bright block">{selectedEvent.user.segment} User</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">Lifetime LTV</span>
                    <span className="font-semibold text-text-bright block">₹{selectedEvent.user.ltv.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Product context */}
              {selectedEvent.product && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Product Context</h4>
                  <div className="grid grid-cols-4 gap-3.5 bg-slate-900 p-4 rounded-xl border border-border-subtle">
                    <div className="col-span-2">
                      <span className="text-text-muted block text-[10px]">SKU Product</span>
                      <span className="font-semibold text-accent-blue block truncate">{selectedEvent.product.name}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Category</span>
                      <span className="font-semibold text-text-bright block">{selectedEvent.product.category}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Price</span>
                      <span className="font-semibold text-text-bright block">₹{selectedEvent.product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Journey timeline reconstruction */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  User Journey Reconstruction
                </h4>
                
                <div className="space-y-3.5 pl-4 relative border-l border-border-subtle py-1">
                  {[
                    { event: "app_opened", time: "10:01:22", active: selectedEvent.name === "app_opened" },
                    { event: "homepage_viewed", time: "10:01:35", active: selectedEvent.name === "homepage_viewed" },
                    { event: "search_started", time: "10:02:12", active: selectedEvent.name === "search_started" },
                    { event: "search_completed", time: "10:02:15", active: selectedEvent.name === "search_completed" },
                    { event: "product_viewed", time: "10:04:20", active: selectedEvent.name === "product_viewed" },
                    { event: "cart_added", time: "10:06:11", active: selectedEvent.name === "cart_added" },
                    { event: "payment_success", time: "10:08:22", active: selectedEvent.name === "payment_success" }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex justify-between items-center text-[11px] group">
                      <div className={`absolute left-[-20.5px] w-2.5 h-2.5 rounded-full bg-slate-950 border-2 transition-all ${
                        step.active ? "border-primary scale-125 bg-primary" : "border-border-subtle group-hover:border-slate-500"
                      }`} />
                      <span className={`font-mono ${step.active ? "text-primary font-bold" : "text-text-bright"}`}>{step.event}</span>
                      <span className="text-[10px] text-text-muted font-mono">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Debugging assistant */}
              <div className="pt-4 border-t border-border-subtle space-y-4">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-primary animate-pulse" />
                  Ask AI Debugging CoPilot
                </h4>

                {/* AI Chat History */}
                {aiAnswers.length > 0 && (
                  <div className="space-y-3 bg-slate-900 border border-border-subtle rounded-xl p-4 leading-relaxed font-sans text-xs">
                    {aiAnswers.map((msg, index) => {
                      const isUser = index % 2 === 0;
                      return (
                        <div key={index} className={`flex gap-2 ${isUser ? "text-primary" : "text-text-bright"}`}>
                          <span className="font-bold flex-shrink-0">{isUser ? "👤 User: " : "🤖 AI CoPilot: "}</span>
                          <p className={!isUser ? "text-text-muted leading-relaxed" : ""}>{msg}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Ask Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleAskAI("Why did checkout conversion drop yesterday?")}
                    className="px-3 py-1.5 bg-slate-900 border border-border-subtle rounded-lg hover:border-primary text-text-muted hover:text-text-bright hover:bg-slate-900/60"
                  >
                    Why did checkout conversion drop?
                  </button>
                  <button
                    onClick={() => handleAskAI("Analyze telemetry schemas and quality violations.")}
                    className="px-3 py-1.5 bg-slate-900 border border-border-subtle rounded-lg hover:border-primary text-text-muted hover:text-text-bright hover:bg-slate-900/60"
                  >
                    Analyze schema violations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
