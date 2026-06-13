"use client";

import React, { useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Percent, 
  RotateCcw, 
  Smile, 
  Sparkles, 
  Search, 
  Eye, 
  Activity, 
  AlertTriangle, 
  Terminal, 
  Sliders,
  TrendingUp,
  Cpu,
  RefreshCw,
  HelpCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  BarChart, 
  Bar 
} from "recharts";
import { mockEngine } from "@/lib/mockEngine";
import { useSimulation } from "@/context/SimulationContext";

export default function OverviewTab() {
  const [dateRange, setDateRange] = useState("30d");
  const { 
    isSimulating, 
    gmvTodayOffset, 
    ordersTodayOffset, 
    buyersTodayOffset, 
    apiLatency, 
    crashRate, 
    searchLatency, 
    zeroResults 
  } = useSimulation();
  
  // Query commerce data from the scaled mock engine
  const metrics = mockEngine.getKPIMetrics(dateRange);
  const funnel = mockEngine.getMarketplaceFunnel();
  const gmvIntel = mockEngine.getGMVIntelligence();
  const searchMetrics = mockEngine.getSearchMetrics();
  const pdpMetrics = mockEngine.getPDPMetrics();
  const marketplace = mockEngine.getMarketplaceHealth();
  const checkout = mockEngine.getCheckoutMetrics();
  const appPerformance = mockEngine.getAppPerformance();
  const experiments = mockEngine.getExperimentSummary();
  const aiInsights = mockEngine.getAIInsights();

  // Dynamic live metric tickers
  const gmvValue = isSimulating 
    ? `₹${(428 + gmvTodayOffset / 1000000).toFixed(4)} Cr` 
    : metrics.gmv.value;
  const ordersValue = isSimulating 
    ? `${(18.6 + ordersTodayOffset / 1000000).toFixed(6)}M` 
    : metrics.orders.value;
  const buyersValue = isSimulating 
    ? `${(12.8 + buyersTodayOffset / 1000000).toFixed(6)}M` 
    : metrics.buyers.value;

  const PIE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b"];

  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright flex items-center gap-2">
            Commerce Intelligence Command Center <Sparkles className="w-5.5 h-5.5 text-primary" />
          </h1>
          <p className="text-xs text-text-muted">Real-time product availability, discovery pathways, cart drops, and ecosystem performance alerts.</p>
        </div>
        
        <div className="flex bg-slate-950 p-1.5 rounded-lg border border-border-subtle self-start sm:self-center">
          {["7d", "30d", "90d"].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                dateRange === range 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-text-muted hover:text-text-bright transition-colors"
              }`}
            >
              {range === "7d" ? "7d Live" : range === "30d" ? "30d Trend" : "90d Cohorts"}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1 — Executive Health Score Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* GMV Today */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden select-none border-l-2 border-l-primary">
          <div className="flex justify-between items-start text-xs text-text-muted">
            <span>GMV TODAY</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-text-bright mt-2 font-mono">{gmvValue}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="bg-emerald-500/15 text-primary px-1 rounded font-bold">{metrics.gmv.change}</span>
            <span className="text-text-muted">vs yesterday</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border-subtle flex justify-between items-center text-[10px] text-text-muted">
            <span>Target: <span className="font-bold text-text-bright">{metrics.gmv.target}</span></span>
            <span className="font-bold text-primary">{metrics.gmv.pct}% achieved</span>
          </div>
        </div>

        {/* Orders Today */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden select-none">
          <div className="flex justify-between items-start text-xs text-text-muted">
            <span>ORDERS</span>
            <ShoppingBag className="w-4 h-4 text-accent-blue" />
          </div>
          <p className="text-2xl font-black text-text-bright mt-2 font-mono">{ordersValue}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="bg-emerald-500/15 text-primary px-1 rounded font-bold">{metrics.orders.change}</span>
            <span className="text-text-muted">vs yesterday</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border-subtle flex justify-between items-center text-[10px] text-text-muted">
            <span>New: <span className="font-bold text-text-bright">{metrics.orders.newPct}%</span></span>
            <span>Repeat: <span className="font-bold text-text-bright">{metrics.orders.repeatPct}%</span></span>
          </div>
        </div>

        {/* Active Buyers */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden select-none">
          <div className="flex justify-between items-start text-xs text-text-muted">
            <span>ACTIVE BUYERS</span>
            <Users className="w-4 h-4 text-accent-purple" />
          </div>
          <p className="text-2xl font-black text-text-bright mt-2 font-mono">{buyersValue}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="bg-emerald-500/15 text-primary px-1 rounded font-bold">{metrics.buyers.change}</span>
            <span className="text-text-muted">vs yesterday</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border-subtle text-[9px] text-text-muted uppercase font-semibold">
            Product View + Add + Buy
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden select-none">
          <div className="flex justify-between items-start text-xs text-text-muted">
            <span>CONVERSION RATE</span>
            <Percent className="w-4 h-4 text-accent-pink" />
          </div>
          <p className="text-2xl font-black text-text-bright mt-2">{metrics.conversion.value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="bg-emerald-500/15 text-primary px-1 rounded font-bold">{metrics.conversion.change}</span>
            <span className="text-text-muted">vs yesterday</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border-subtle flex justify-between items-center text-[10px] text-text-muted">
            <span>App: <span className="font-bold text-primary">{metrics.conversion.appPct}%</span></span>
            <span>Web: <span className="font-bold text-text-muted">{metrics.conversion.webPct}%</span></span>
          </div>
        </div>

        {/* Customer Retention / Repeat Purchase Rate */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden select-none">
          <div className="flex justify-between items-start text-xs text-text-muted">
            <span>REPEAT BUY RATE</span>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-text-bright mt-2">{metrics.retention.value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="bg-emerald-500/15 text-primary px-1 rounded font-bold">{metrics.retention.change}</span>
            <span className="text-text-muted">vs yesterday</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border-subtle text-[9px] text-text-muted uppercase font-semibold">
            Purchase within 90 Days
          </div>
        </div>

        {/* NPS Score */}
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden select-none">
          <div className="flex justify-between items-start text-xs text-text-muted">
            <span>NET PROMOTER (NPS)</span>
            <Smile className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-text-bright mt-2">{metrics.nps.value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="bg-emerald-500/15 text-primary px-1 rounded font-bold">{metrics.nps.change}</span>
            <span className="text-text-muted">vs last month</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border-subtle flex justify-between items-center text-[10px] text-text-muted">
            <span>Target Index: <span className="font-bold text-text-bright">{metrics.nps.target}</span></span>
          </div>
        </div>
      </div>

      {/* Row 2: Customer Funnel & GMV Intelligence Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 2 — Customer Conversion Funnel */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-md font-bold text-text-bright flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-primary" />
              E-Commerce Funnel
            </h2>
            <p className="text-xs text-text-muted">Conversion steps from App Open to Delivered.</p>
          </div>

          <div className="space-y-3 mt-4 flex-1 flex flex-col justify-center">
            {funnel.steps.slice(0, 5).map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-text-bright">{step.name}</span>
                  <span className="text-text-muted">{(step.count / 1000000).toFixed(1)}M ({step.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Biggest Drop-off Bottleneck Analysis */}
          <div className="mt-4 pt-4 border-t border-border-subtle bg-red-500/5 p-3 rounded-xl border border-red-500/10">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400">
              <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
              <span>Funnel Bottleneck: {funnel.bottleneck.stage}</span>
            </div>
            <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
              Drop rate is <span className="text-red-400 font-bold font-mono">{funnel.bottleneck.drop}%</span>. Reason: {funnel.bottleneck.reason}.
            </p>
          </div>
        </div>

        {/* SECTION 3 — GMV Intelligence Trends */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-6">
          {/* GMV Daily trend Line */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h2 className="text-md font-bold text-text-bright">GMV Trend</h2>
              <p className="text-xs text-text-muted">Daily GMV & orders over the last 30 days.</p>
            </div>
            <div className="h-52 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gmvIntel.trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={9} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${val}Cr`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#f3f4f6", fontWeight: "bold", fontSize: "11px" }}
                    itemStyle={{ fontSize: "11px", color: "#9ca3af" }}
                    formatter={(val) => [`₹${val} Cr`, "GMV"]}
                  />
                  <Area type="monotone" dataKey="gmv" name="Daily GMV" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGmv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GMV Split Pie Chart */}
          <div className="w-full md:w-56 flex flex-col justify-between flex-shrink-0">
            <div>
              <h2 className="text-md font-bold text-text-bright">Category Share</h2>
              <p className="text-xs text-text-muted">GMV contribution percentages.</p>
            </div>
            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gmvIntel.categorySplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={52}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {gmvIntel.categorySplit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "10px", color: "#f3f4f6" }}
                    formatter={(val) => [`${val}%`, "GMV Share"]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "9px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Product Discovery & Product Page Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 4 — Search & Product Discovery */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-md font-bold text-text-bright flex items-center gap-1.5">
                <Search className="w-4.5 h-4.5 text-primary" />
                Search & Discovery
              </h2>
              <p className="text-xs text-text-muted">Aggregated search query parameters.</p>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Search Success Rate</span>
                <span className="font-bold text-primary">{searchMetrics.successRate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Total Searches</span>
                <span className="font-bold text-text-bright">{searchMetrics.totalSearches}/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Zero Result Queries</span>
                <span className="font-bold text-red-400">{searchMetrics.zeroResults}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Search CTR / Avg Clicked</span>
                <span className="font-bold text-accent-blue">{searchMetrics.ctr} ({searchMetrics.avgResultsClicked} clicks)</span>
              </div>
            </div>
          </div>

          {/* Search Funnel Bar chart */}
          <div className="w-full md:w-56 flex flex-col justify-between flex-shrink-0">
            <h3 className="text-xs font-bold text-text-muted uppercase">Discovery Funnel</h3>
            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={searchMetrics.funnel} layout="vertical" margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={8} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "10px", color: "#f3f4f6" }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 5 — Product Page Analytics & Quality score */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-md font-bold text-text-bright flex items-center gap-1.5">
                <Eye className="w-4.5 h-4.5 text-accent-blue" />
                Product Detail Page (PDP)
              </h2>
              <p className="text-xs text-text-muted">Visitor page health parameters.</p>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Product Views</span>
                <span className="font-bold text-text-bright">{pdpMetrics.views}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Avg Time on Product</span>
                <span className="font-bold text-text-bright">{pdpMetrics.avgTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Image Interaction</span>
                <span className="font-bold text-accent-purple">{pdpMetrics.imageInteraction}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Add-To-Cart Rate</span>
                <span className="font-bold text-primary">{pdpMetrics.addToCartRate}</span>
              </div>
            </div>
          </div>

          {/* Product Quality score card */}
          <div className="w-full md:w-56 p-4 bg-slate-900 border border-border-subtle rounded-xl flex flex-col justify-between flex-shrink-0">
            <div>
              <h4 className="text-[10px] font-bold text-text-muted uppercase">Quality Index</h4>
              <p className="text-[10px] text-text-muted leading-tight mt-0.5">Rating vs return rate.</p>
            </div>
            <div className="py-2.5 text-center">
              <span className="text-3xl font-black text-text-bright">{pdpMetrics.qualityScore.rating}</span>
              <span className="text-xs text-text-muted block mt-1">out of 5.0 stars</span>
            </div>
            <div className="text-[10px] space-y-1 pt-2 border-t border-border-subtle text-text-muted">
              <div className="flex justify-between"><span>Return Rate:</span><span className="font-bold text-red-400">{pdpMetrics.qualityScore.returnRate}</span></div>
              <div className="flex justify-between"><span>Neg Reviews:</span><span className="font-bold text-text-bright">{pdpMetrics.qualityScore.negativeReviewPct}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Marketplace Health & Checkout Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 6 — Marketplace Health */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-md font-bold text-text-bright flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-accent-purple" />
                Seller Ecosystem
              </h2>
              <p className="text-xs text-text-muted">Marketplace listings availability indicators.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
              <div className="space-y-1">
                <span className="text-text-muted block">Active Sellers</span>
                <span className="font-bold text-text-bright block">{marketplace.sellers}</span>
              </div>
              <div className="space-y-1">
                <span className="text-text-muted block">Active Listings</span>
                <span className="font-bold text-text-bright block">{marketplace.listings}</span>
              </div>
              <div className="space-y-1">
                <span className="text-text-muted block">Out of Stock (OOS)</span>
                <span className="font-bold text-red-400 block">{marketplace.outOfStock}</span>
              </div>
              <div className="space-y-1">
                <span className="text-text-muted block">Cancellation Rate</span>
                <span className="font-bold text-red-400 block">{marketplace.cancellation}</span>
              </div>
            </div>
          </div>

          {/* Category availability progress bars */}
          <div className="w-full md:w-56 flex flex-col justify-between flex-shrink-0">
            <h3 className="text-xs font-bold text-text-muted uppercase">Stock Availability</h3>
            <div className="space-y-3 mt-3">
              {marketplace.categoryAvailability.map(item => (
                <div key={item.category} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-text-muted">{item.category}</span>
                    <span className="text-primary font-mono">{item.availability}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${item.availability}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 7 — Checkout & Payments Intelligence */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-6">
          {/* Checkout Steps bar */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h2 className="text-md font-bold text-text-bright flex items-center gap-1.5">
                <Percent className="w-4.5 h-4.5 text-accent-pink" />
                Checkout Performance
              </h2>
              <p className="text-xs text-text-muted">Completed cart conversion values.</p>
            </div>
            <div className="h-44 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={checkout.funnel} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={8} tickLine={false} unit="M" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "10px", color: "#f3f4f6" }}
                  />
                  <Bar dataKey="count" fill="#ec4899" radius={[5, 5, 0, 0]} maxBarSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Failures split */}
          <div className="w-full md:w-56 p-4 bg-slate-900 border border-border-subtle rounded-xl flex flex-col justify-between flex-shrink-0">
            <div>
              <h4 className="text-[10px] font-bold text-text-muted uppercase">Checkout Failures</h4>
              <p className="text-[10px] text-text-muted mt-0.5">Critical transaction bottleneck drops.</p>
            </div>
            <div className="space-y-2.5 text-xs mt-3">
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Payment Failures</span>
                <span className="font-bold text-red-400 font-mono">{checkout.failures.paymentFailure}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">COD Cancellations</span>
                <span className="font-bold text-red-400 font-mono">{checkout.failures.codDrop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Pin code Failures</span>
                <span className="font-bold text-text-bright font-mono">{checkout.failures.addressFailure}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Experience, Experiments & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 8 & 9 — App Experience & Experiments Summary */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* App performance latency */}
          <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-border-subtle pb-4 md:pb-0 md:pr-6">
            <div>
              <h2 className="text-sm font-bold text-text-bright uppercase flex items-center gap-1">
                <Cpu className="w-4 h-4 text-primary" />
                Performance Latency
              </h2>
              <p className="text-[10px] text-text-muted">App experience metrics.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 bg-slate-900 border border-border-subtle rounded-xl text-center">
                <span className="block text-[9px] text-text-muted uppercase">Crash Rate</span>
                <span className="text-lg font-black text-primary font-mono">{isSimulating ? `${crashRate}%` : appPerformance.crashRate}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-border-subtle rounded-xl text-center">
                <span className="block text-[9px] text-text-muted uppercase">P95 Latency</span>
                <span className="text-lg font-black text-text-bright font-mono">{isSimulating ? `${apiLatency}ms` : appPerformance.apiLatency}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-border-subtle rounded-xl text-center">
                <span className="block text-[9px] text-text-muted uppercase">Load Time</span>
                <span className="text-lg font-black text-text-bright font-mono">{appPerformance.loadTime}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-border-subtle rounded-xl text-center">
                <span className="block text-[9px] text-text-muted uppercase">Search Latency</span>
                <span className="text-lg font-black text-accent-blue font-mono">{isSimulating ? `${searchLatency}ms` : appPerformance.searchLatency}</span>
              </div>
            </div>
          </div>

          {/* Active Experiments overview */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-text-bright uppercase flex items-center gap-1">
                <Sliders className="w-4 h-4 text-accent-purple" />
                Experiment Center
              </h2>
              <p className="text-[10px] text-text-muted">Active A/B testing campaigns.</p>
            </div>
            
            <div className="flex justify-between items-center text-xs mt-3 pt-2">
              <span className="text-text-muted">Active Experiments</span>
              <span className="font-bold text-accent-purple font-mono bg-accent-purple/10 px-2 py-0.5 border border-accent-purple/20 rounded">
                {experiments.total} campaigns
              </span>
            </div>

            <div className="flex gap-2 items-center text-[10px] py-2 border-b border-border-subtle">
              <span className="bg-emerald-500/10 text-primary border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">Winning: {experiments.winning}</span>
              <span className="bg-slate-900 border border-border-subtle text-text-muted px-1.5 py-0.5 rounded font-bold">Neutral: {experiments.neutral}</span>
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-bold">Negative: {experiments.negative}</span>
            </div>

            <div className="mt-2.5 p-2 bg-slate-950/60 rounded-lg border border-border-subtle space-y-0.5">
              <span className="block text-[9px] text-text-muted uppercase font-bold">Top Experiment uplift</span>
              <span className="text-xs font-semibold text-text-bright block truncate">{experiments.topExperiment.name}</span>
              <div className="flex justify-between text-[10px] font-mono font-bold pt-1 text-primary">
                <span>{experiments.topExperiment.uplift}</span>
                <span>{experiments.topExperiment.conversion}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 10 — AI Growth Assistant insights */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <div>
            <h2 className="text-md font-bold text-text-bright flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              AI Growth CoPilot
            </h2>
            <p className="text-xs text-text-muted">Automated real-time anomaly alerts.</p>
          </div>

          <div className="flex-1 space-y-3.5">
            {aiInsights.map(insight => (
              <div 
                key={insight.id}
                className={`p-3.5 rounded-xl border space-y-1.5 text-xs select-none ${
                  insight.severity === "high"
                    ? "bg-red-500/5 border-red-500/15"
                    : "bg-slate-900 border-border-subtle"
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className={insight.severity === "high" ? "text-red-400" : "text-primary"}>
                    ⚡ {insight.title}
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-1 py-0.2 rounded ${
                    insight.severity === "high" 
                      ? "bg-red-500/15 text-red-400" 
                      : "bg-slate-950 text-text-muted"
                  }`}>
                    {insight.severity}
                  </span>
                </div>
                <p className="text-text-muted leading-relaxed text-[11px]">{insight.text}</p>
                <div className="pt-2 border-t border-border-subtle/50 text-[10px] text-text-muted">
                  <span className="font-bold text-text-bright">Recommendation: </span>
                  {insight.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
