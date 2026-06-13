// Synthetic Analytics Data Engine for PAL (Flipkart-scale Commerce Command Center)

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: "Chrome" | "Safari" | "Firefox" | "Edge";
  channel: "Google Ads" | "Organic Search" | "Twitter/X" | "Direct" | "Newsletter";
  signupDate: string;
  revenue: number;
  purchaseCount: number;
  isActive: boolean;
  avatarUrl: string;
  // User 360 fields
  tier: "Premium" | "Regular" | "New" | "At Risk";
  lastActive: string;
  riskStatus: "High Value" | "Frequent Buyer" | "Regular" | "At Risk" | "New User";
  healthScore: number;
  rfm: string; // e.g. "5 - 5 - 4"
  rfmClass: "Champions" | "Loyal Customers" | "Potential Loyalists" | "At Risk" | "Lost Customers";
  behavior: {
    sessions: number;
    daysActive: number;
    productsViewed: number;
    wishlist: number;
    cartAdds: number;
    searches: number;
    categories: number;
    coupons: number;
  };
  categorySpend: { category: string; pct: number }[];
  channels: { name: string; pct: number }[];
  demographics: {
    city: string;
    pincode: string;
    language: string;
  };
  deviceDetails: {
    name: string;
    os: string;
    appVersion: string;
  };
  commerceDetails: {
    preferredCat: string;
    paymentPref: string;
    basketSize: number;
    returnRate: number;
  };
  segments: string[];
  notes: {
    author: string;
    text: string;
    date: string;
  }[];
  orders: {
    id: string;
    date: string;
    product: string;
    category: string;
    seller: string;
    amount: number;
    status: "Delivered" | "Shipped" | "Placed" | "Cancelled" | "Returned";
  }[];
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: string; // ISO String
  user: {
    id: string;
    name: string;
    segment: "Premium" | "Regular" | "New";
    orders: number;
    ltv: number;
  };
  product?: {
    id: string;
    name: string;
    category: string;
    price: number;
    seller: string;
  };
  context: {
    device: "Mobile" | "Desktop" | "Tablet";
    city: string;
    app_version: string;
  };
  experiment?: {
    name: string;
    variant: string;
  };
  businessImpact?: {
    influencedGMV: number;
  };
}

export interface FunnelStep {
  name: string;
  count: number;
  percentage: number; // overall conversion
  stepPercentage: number; // conversion from previous step
  dropCount: number;
}

export interface RetentionRow {
  cohort: string; // e.g. "Week of Jan 1"
  size: number;
  retention: number[]; // Index maps to Week 0, Week 1, etc. (values 0-100)
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  userCount: number;
  rules: { property: string; operator: string; value: string }[];
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  status: "Active" | "Inactive";
  rolloutPercentage: number;
  rules: string;
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  status: "Running" | "Ended";
  variants: {
    name: string;
    users: number;
    conversions: number;
    rate: number;
    uplift: number;
    isSignificant: boolean;
  }[];
}

export interface ReplaySession {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  duration: string; // MM:SS
  eventCount: number;
  events: {
    type: "click" | "input" | "pageview" | "error";
    target: string;
    timestamp: number; // relative ms
    x?: number;
    y?: number;
    value?: string;
  }[];
}

// MOCK CONSTANTS
const COUNTRIES = ["India", "United States", "Germany", "United Kingdom", "Singapore", "Canada"];
const CHANNELS = ["Direct", "Organic Search", "Google Ads", "Twitter/X", "Newsletter"];
const CITIES = ["Mumbai", "Bangalore", "Delhi", "Kolkata", "Chennai", "Hyderabad", "Pune"];

// Rohan Verma profile detail
const ROHAN_VERMA: UserProfile = {
  id: "usr_10002345",
  name: "Rohan Verma",
  email: "rohan.verma@gmail.com",
  phone: "+91 98765 43210",
  country: "India",
  device: "Mobile",
  browser: "Chrome",
  channel: "Google Ads",
  signupDate: "12 May 2023",
  revenue: 48560,
  purchaseCount: 23,
  isActive: true,
  avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=rohan",
  tier: "Premium",
  lastActive: "2 mins ago",
  riskStatus: "High Value",
  healthScore: 92,
  rfm: "5 - 5 - 4",
  rfmClass: "Champions",
  behavior: {
    sessions: 78,
    daysActive: 34,
    productsViewed: 412,
    wishlist: 18,
    cartAdds: 27,
    searches: 63,
    categories: 12,
    coupons: 7
  },
  categorySpend: [
    { category: "Electronics", pct: 54 },
    { category: "Fashion", pct: 18 },
    { category: "Home", pct: 12 },
    { category: "Beauty", pct: 8 },
    { category: "Others", pct: 8 }
  ],
  channels: [
    { name: "Android App", pct: 78 },
    { name: "Flipkart Web", pct: 16 },
    { name: "iOS App", pct: 4 },
    { name: "Flipkart Lite", pct: 2 }
  ],
  demographics: {
    city: "Mumbai, Maharashtra",
    pincode: "400001",
    language: "English"
  },
  deviceDetails: {
    name: "Xiaomi 13 Pro",
    os: "Android 14",
    appVersion: "12.4.1"
  },
  commerceDetails: {
    preferredCat: "Electronics",
    paymentPref: "UPI",
    basketSize: 3200,
    returnRate: 4.2
  },
  segments: [
    "High Value Customers",
    "Electronics Enthusiasts",
    "Frequent Buyers",
    "Mumbai Users",
    "Premium Members"
  ],
  notes: [
    {
      author: "Aryan Chandra",
      text: "User reached out for refund on order OD32874688123 due to delayed delivery.",
      date: "12 June"
    }
  ],
  orders: [
    { id: "OD328749", date: "13 June", product: "iPhone 15 (Blue, 128GB)", category: "Electronics", seller: "RetailNet", amount: 69999, status: "Delivered" },
    { id: "OD328748", date: "12 June", product: "Nike Air Max Shoes", category: "Fashion", seller: "Nike India", amount: 8499, status: "Shipped" },
    { id: "OD328747", date: "10 June", product: "Mi Smart Band 8", category: "Electronics", seller: "Xiaomi Store", amount: 2999, status: "Placed" }
  ]
};

// Generate list of users from mockup
const NAMES = [
  "Rohan Verma", "Priya Sharma", "Karthik Nair", "Nikita Iyer",
  "Arjun Mehta", "Sneha Patil", "Vivek Singh", "Ayesha Khan",
  "Michael Chen", "Emily Rodriguez", "Alex Kowalski", "Yuki Tanaka",
  "Amara Okafor", "David Miller", "Sofia Rossi", "Liam Gallagher"
];

const MOCK_USERS: UserProfile[] = NAMES.map((name, i) => {
  if (name === "Rohan Verma") return ROHAN_VERMA;
  
  const id = `usr_${10002346 + i}`;
  const first = name.trim().split(" ")[0].toLowerCase();
  const country = i % 2 === 0 ? "India" : COUNTRIES[i % COUNTRIES.length];
  const device = i % 4 === 0 ? "Tablet" : i % 4 === 1 ? "Desktop" : "Mobile";
  const channel = CHANNELS[i % CHANNELS.length] as any;
  
  const tier = i % 5 === 4 ? "At Risk" as const : i % 5 === 2 ? "New" as const : i % 5 === 0 ? "Premium" as const : "Regular" as const;
  const riskStatus = tier === "Premium" ? "High Value" as const : tier === "At Risk" ? "At Risk" as const : tier === "New" ? "New User" as const : "Regular" as const;
  const lastActive = `${(i + 1) * 3 - (i % 2)} mins ago`;
  const purchaseCount = tier === "New" ? 0 : (i % 3) * 3 + 2;
  const revenue = purchaseCount * (599 + (i % 3) * 150);

  return {
    id,
    name: name.trim(),
    email: `${first}@example.com`,
    phone: `+91 98765 ${43200 + i}`,
    country,
    device,
    browser: "Chrome",
    channel,
    signupDate: "12 May 2023",
    revenue,
    purchaseCount,
    isActive: tier !== "At Risk",
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${first}`,
    tier,
    lastActive,
    riskStatus,
    healthScore: 80 - (i % 3) * 10,
    rfm: tier === "New" ? "1 - 1 - 1" : "4 - 4 - 3",
    rfmClass: tier === "New" ? "New Customers" as any : "Loyal Customers" as any,
    behavior: {
      sessions: 40 + i * 5,
      daysActive: 15 + i * 2,
      productsViewed: 150 + i * 15,
      wishlist: 8 + i,
      cartAdds: 12 + i,
      searches: 25 + i * 3,
      categories: 6 + (i % 3),
      coupons: i % 2 === 0 ? 3 : 1
    },
    categorySpend: [
      { category: "Fashion", pct: 60 },
      { category: "Electronics", pct: 30 },
      { category: "Home", pct: 10 }
    ],
    channels: [
      { name: "Android App", pct: 90 },
      { name: "Flipkart Web", pct: 10 }
    ],
    demographics: {
      city: "Bangalore, Karnataka",
      pincode: `56000${i + 1}`,
      language: "English"
    },
    deviceDetails: {
      name: "OnePlus 11r",
      os: "Android 13",
      appVersion: "12.4.1"
    },
    commerceDetails: {
      preferredCat: "Fashion",
      paymentPref: "UPI",
      basketSize: 1500,
      returnRate: 2.1
    },
    segments: ["Electronics Enthusiasts", "Frequent Buyers"],
    notes: [
      { author: "System", text: "Customer initialized app onboarding setup.", date: "10 June" }
    ],
    orders: [
      { id: `OD32870${i}`, date: "10 June", product: "Boat Rockerz Headphones", category: "Electronics", seller: "RetailNet", amount: 1999, status: "Delivered" }
    ]
  };
});

const MOCK_COHORTS: Cohort[] = [
  {
    id: "coh_1",
    name: "German Power Buyers",
    description: "Users located in Germany with purchases > 5",
    userCount: 12,
    rules: [
      { property: "country", operator: "equals", value: "Germany" },
      { property: "purchaseCount", operator: ">", value: "5" }
    ]
  },
  {
    id: "coh_2",
    name: "Mumbai Premium Members",
    description: "Premium tier users located in Mumbai",
    userCount: 8,
    rules: [
      { property: "city", operator: "contains", value: "Mumbai" },
      { property: "tier", operator: "equals", value: "Premium" }
    ]
  }
];

const MOCK_FLAGS: FeatureFlag[] = [
  {
    id: "flag_1",
    key: "beta-checkout-flow",
    name: "Beta Checkout Flow Button",
    status: "Active",
    rolloutPercentage: 80,
    rules: "country = Germany OR device = Mobile"
  },
  {
    id: "flag_2",
    key: "search-auto-suggestions",
    name: "AI Search Auto Suggestions",
    status: "Inactive",
    rolloutPercentage: 0,
    rules: "Default Rollout"
  }
];

const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "exp_1",
    name: "UPI Quick-Verify Checkout Redesign",
    hypothesis: "Simplifying UPI input step will increase checkout completion rate",
    status: "Running",
    variants: [
      { name: "Control", users: 125000, conversions: 6250, rate: 5.0, uplift: 0, isSignificant: false },
      { name: "Variant A (Quick-Verify)", users: 125000, conversions: 7500, rate: 6.0, uplift: 20.0, isSignificant: true }
    ]
  },
  {
    id: "exp_2",
    name: "Recommended Items Placement",
    hypothesis: "Moving recommendations above checkout page list will increase AOV",
    status: "Running",
    variants: [
      { name: "Control", users: 85000, conversions: 3400, rate: 4.0, uplift: 0, isSignificant: false },
      { name: "Variant B (Above List)", users: 85000, conversions: 3570, rate: 4.2, uplift: 5.0, isSignificant: false }
    ]
  }
];

const MOCK_REPLAYS: ReplaySession[] = [
  {
    id: "rep_1",
    userId: "usr_10002345",
    userName: "Rohan Verma",
    timestamp: new Date().toISOString(),
    duration: "01:25",
    eventCount: 4,
    events: [
      { type: "pageview", target: "/home", timestamp: 100 },
      { type: "click", target: "Get Started Button", timestamp: 1500, x: 200, y: 350 },
      { type: "pageview", target: "/signup", timestamp: 3500 },
      { type: "input", target: "Email Input", timestamp: 6000, value: "rohan.verma@gmail.com" }
    ]
  },
  {
    id: "rep_2",
    userId: "usr_10002346",
    userName: "Priya Sharma",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    duration: "00:45",
    eventCount: 3,
    events: [
      { type: "pageview", target: "/home", timestamp: 200 },
      { type: "click", target: "Pricing Link", timestamp: 1200, x: 500, y: 80 },
      { type: "pageview", target: "/pricing", timestamp: 3000 }
    ]
  }
];

// Generate Synthetic Event Log
const MOCK_EVENTS: AnalyticsEvent[] = [];

MOCK_USERS.forEach((user) => {
  const baseTime = new Date("2026-06-12").getTime();
  const userSegment = user.tier === "Premium" ? "Premium" as const : user.tier === "New" ? "New" as const : "Regular" as const;
  const userCity = user.demographics.city;
  
  let t = baseTime + Math.random() * 3600 * 1000;
  
  MOCK_EVENTS.push({
    id: `evt_${Math.random().toString(36).substr(2, 9)}`,
    name: "app_opened",
    timestamp: new Date(t).toISOString(),
    user: { id: user.id, name: user.name, segment: userSegment, orders: user.purchaseCount, ltv: user.revenue },
    context: { device: user.device, city: userCity, app_version: "12.4" }
  });

  MOCK_EVENTS.push({
    id: `evt_${Math.random().toString(36).substr(2, 9)}`,
    name: "homepage_viewed",
    timestamp: new Date(t + 2000).toISOString(),
    user: { id: user.id, name: user.name, segment: userSegment, orders: user.purchaseCount, ltv: user.revenue },
    context: { device: user.device, city: userCity, app_version: "12.4" }
  });

  MOCK_EVENTS.push({
    id: `evt_${Math.random().toString(36).substr(2, 9)}`,
    name: "search_started",
    timestamp: new Date(t + 15000).toISOString(),
    user: { id: user.id, name: user.name, segment: userSegment, orders: user.purchaseCount, ltv: user.revenue },
    context: { device: user.device, city: userCity, app_version: "12.4" }
  });

  MOCK_EVENTS.push({
    id: `evt_${Math.random().toString(36).substr(2, 9)}`,
    name: "search_completed",
    timestamp: new Date(t + 18000).toISOString(),
    user: { id: user.id, name: user.name, segment: userSegment, orders: user.purchaseCount, ltv: user.revenue },
    context: { device: user.device, city: userCity, app_version: "12.4" }
  });

  if (user.isActive) {
    let t2 = baseTime + 24 * 3600 * 1000 + Math.random() * 12 * 3600 * 1000;
    
    MOCK_EVENTS.push({
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      name: "product_viewed",
      timestamp: new Date(t2).toISOString(),
      user: { id: user.id, name: user.name, segment: userSegment, orders: user.purchaseCount, ltv: user.revenue },
      product: { id: "MOB12345", name: "iPhone 15", category: "Mobile", price: 69999, seller: "RetailNet" },
      context: { device: user.device, city: userCity, app_version: "12.4" }
    });

    MOCK_EVENTS.push({
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      name: "cart_added",
      timestamp: new Date(t2 + 25000).toISOString(),
      user: { id: user.id, name: user.name, segment: userSegment, orders: user.purchaseCount, ltv: user.revenue },
      product: { id: "MOB12345", name: "iPhone 15", category: "Mobile", price: 69999, seller: "RetailNet" },
      context: { device: user.device, city: userCity, app_version: "12.4" }
    });
  }
});

MOCK_EVENTS.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

class MockAnalyticsEngine {
  users = [...MOCK_USERS];
  events = [...MOCK_EVENTS];
  cohorts = [...MOCK_COHORTS];
  flags = [...MOCK_FLAGS];
  experiments = [...MOCK_EXPERIMENTS];
  replays = [...MOCK_REPLAYS];

  getKPIMetrics(dateRange: string = "30d") {
    return {
      gmv: { value: "₹428 Cr", change: "+8.4%", trend: "up" as const, target: "₹465 Cr", pct: 92 },
      orders: { value: "18.6M", change: "+5.2%", trend: "up" as const, newPct: 32, repeatPct: 68 },
      buyers: { value: "12.8M", change: "+3.1%", trend: "up" as const },
      conversion: { value: "4.8%", change: "+0.3%", trend: "up" as const, appPct: 5.4, webPct: 3.1 },
      retention: { value: "42.6%", change: "+2.1%", trend: "up" as const },
      nps: { value: "62", change: "+4", trend: "up" as const, target: "65" }
    };
  }

  getMarketplaceFunnel() {
    return {
      steps: [
        { name: "App Open", count: 150000000, percentage: 100, stepPercentage: 100, dropCount: 0 },
        { name: "Homepage Viewed", count: 120000000, percentage: 80, stepPercentage: 80, dropCount: 30000000 },
        { name: "Search/Browse", count: 85000000, percentage: 56.7, stepPercentage: 70.8, dropCount: 35000000 },
        { name: "PDP View", count: 45000000, percentage: 30, stepPercentage: 52.9, dropCount: 40000000 },
        { name: "Add To Cart", count: 12000000, percentage: 8, stepPercentage: 26.7, dropCount: 33000000 },
        { name: "Checkout Started", count: 8000000, percentage: 5.3, stepPercentage: 66.7, dropCount: 4000000 },
        { name: "Payment Success", count: 6500000, percentage: 4.3, stepPercentage: 81.3, dropCount: 1500000 },
        { name: "Delivered", count: 6000000, percentage: 4.0, stepPercentage: 92.3, dropCount: 500000 }
      ],
      bottleneck: {
        stage: "Product View → Add To Cart",
        drop: 73,
        reason: "High Price, Low ratings, Delivery unavailable in remote pin codes"
      }
    };
  }

  getGMVIntelligence() {
    const trend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const baseGMV = 350 + i * 2.8 + Math.sin(i / 2) * 25;
      const baseOrders = 14.5 + i * 0.15 + Math.cos(i / 3) * 0.8;
      return { date, gmv: parseFloat(baseGMV.toFixed(1)), orders: parseFloat(baseOrders.toFixed(1)) };
    });

    return {
      trend,
      categorySplit: [
        { name: "Fashion", value: 32 },
        { name: "Electronics", value: 28 },
        { name: "Grocery", value: 20 },
        { name: "Beauty", value: 12 },
        { name: "Others", value: 8 }
      ]
    };
  }

  getSearchMetrics() {
    return {
      successRate: "78.4%",
      totalSearches: "480M",
      zeroResults: "6.2%",
      ctr: "42.0%",
      avgResultsClicked: 2.8,
      funnel: [
        { name: "Search Started", count: 480 },
        { name: "Results Viewed", count: 450 },
        { name: "Product Click", count: 200 },
        { name: "Purchase Completed", count: 18 }
      ]
    };
  }

  getPDPMetrics() {
    return {
      views: "450M",
      avgTime: "52 sec",
      imageInteraction: "68%",
      reviewsOpened: "35%",
      addToCartRate: "18%",
      qualityScore: { rating: 4.32, returnRate: "7.4%", negativeReviewPct: "3.2%" }
    };
  }

  getMarketplaceHealth() {
    return {
      sellers: "1.4M",
      listings: "240M",
      outOfStock: "4.8%",
      cancellation: "1.2%",
      categoryAvailability: [
        { category: "Electronics", availability: 98 },
        { category: "Fashion", availability: 94 },
        { category: "Grocery", availability: 96 }
      ]
    };
  }

  getCheckoutMetrics() {
    return {
      funnel: [
        { name: "Cart Added", count: 12.0 },
        { name: "Checkout Started", count: 8.0 },
        { name: "Address Added", count: 7.5 },
        { name: "Payment Selected", count: 7.0 },
        { name: "Payment Success", count: 6.5 }
      ],
      failures: { paymentFailure: "3.2%", codDrop: "1.8%", addressFailure: "0.4%" }
    };
  }

  getAppPerformance() {
    return { crashRate: "0.08%", apiLatency: "220ms", loadTime: "1.4s", searchLatency: "180ms" };
  }

  getExperimentSummary() {
    return {
      total: 324,
      winning: 42,
      neutral: 220,
      negative: 62,
      topExperiment: {
        name: "UPI Quick-Verify Checkout Redesign",
        uplift: "+25.0% UPI Completions",
        conversion: "+1.2% Overall Conversion"
      }
    };
  }

  getAIInsights() {
    return [
      {
        id: "ai_1",
        title: "UPI Payment Drop Warning",
        text: "Android mobile checkout conversion rate dropped by 4.2% in the last 4 hours.",
        cause: "UPI transaction failures increased by 18% on HDFC/SBI bank servers.",
        recommendation: "Roll back UPI Checkout SDK version to v4.2 stable immediately.",
        severity: "high"
      },
      {
        id: "ai_2",
        title: "Grocery Stock Out-Of-Stock Alert",
        text: "High-value grocery items in Bengaluru/Kolkata hub are out-of-stock.",
        cause: "Acquisition spikes of staple grocery categories over weekend sale.",
        recommendation: "Reallocate stock deliveries from Chennai hub buffers.",
        severity: "medium"
      }
    ];
  }

  addCustomEvent(eventName: string, userId: string, properties: Record<string, any>) {
    const user = this.users.find(u => u.id === userId) || this.users[0];
    const userSegment = user.tier === "Premium" ? "Premium" as const : user.tier === "New" ? "New" as const : "Regular" as const;
    const userCity = user.demographics.city;
    
    const newEvent: AnalyticsEvent = {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      name: eventName,
      timestamp: new Date().toISOString(),
      user: { id: user.id, name: user.name, segment: userSegment, orders: user.purchaseCount, ltv: user.revenue },
      context: { device: user.device, city: userCity, app_version: "12.4" },
      ...(properties.product_id ? {
        product: { id: properties.product_id, name: properties.product_name || "Custom Item", category: properties.category || "Electronics", price: properties.price || 1999, seller: properties.seller || "RetailNet" }
      } : {}),
      ...(properties.experiment_name ? {
        experiment: { name: properties.experiment_name, variant: properties.variant || "Control" }
      } : {}),
      ...(properties.influencedGMV ? {
        businessImpact: { influencedGMV: properties.influencedGMV }
      } : {})
    };
    
    this.events.push(newEvent);
    this.events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return newEvent;
  }

  calculateFunnel(steps: string[]) {
    if (steps.length === 0) return [];
    const results: FunnelStep[] = [];
    let activeUsers = new Set(this.users.map(u => u.id));
    const baseCount = activeUsers.size;

    steps.forEach((step, index) => {
      const usersWithEvent = new Set(this.events.filter(e => e.name === step && activeUsers.has(e.user.id)).map(e => e.user.id));
      activeUsers = usersWithEvent;
      const count = activeUsers.size;
      const percentage = parseFloat(((count / baseCount) * 100).toFixed(1));
      const stepPercentage = index === 0 ? 100 : parseFloat(((count / results[index - 1].count) * 100).toFixed(1));
      const dropCount = index === 0 ? 0 : results[index - 1].count - count;
      results.push({ name: step, count, percentage, stepPercentage, dropCount });
    });
    return results;
  }

  getRetentionMatrix() {
    const cohorts = ["May 04", "May 11", "May 18", "May 25", "Jun 01", "Jun 08"];
    return cohorts.map((cohort, index) => {
      const size = 1200 - index * 105;
      const decayBase = 60 - (index % 2) * 5;
      const retention = [100];
      for (let w = 1; w <= 6; w++) {
        const factor = Math.exp(-w / 2.8);
        const rate = Math.round(decayBase * factor + Math.sin(index + w) * 3);
        retention.push(Math.max(5, rate));
      }
      return { cohort, size, retention };
    });
  }

  createCohort(name: string, description: string, rules: { property: string; operator: string; value: string }[]) {
    const matchingUsers = this.users.filter(user => {
      return rules.every(rule => {
        const val = (user as any)[rule.property];
        if (val === undefined) return false;
        if (rule.operator === "equals") return String(val).toLowerCase() === rule.value.toLowerCase();
        if (rule.operator === ">") return Number(val) > Number(rule.value);
        if (rule.operator === "<") return Number(val) < Number(rule.value);
        if (rule.operator === "contains") return String(val).toLowerCase().includes(rule.value.toLowerCase());
        return false;
      });
    });
    const newCohort: Cohort = { id: `coh_${this.cohorts.length + 1}`, name, description, userCount: matchingUsers.length, rules };
    this.cohorts.push(newCohort);
    return newCohort;
  }

  getSegmentData(eventName: string, segmentProperty: "device" | "country" | "channel") {
    const counts: Record<string, number> = {};
    this.events.forEach(e => {
      if (eventName !== "all" && e.name !== eventName) return;
      let key = "";
      if (segmentProperty === "device") key = e.context.device;
      else if (segmentProperty === "country") {
        const user = this.users.find(u => u.id === e.user.id);
        key = user ? user.country : "India";
      } else {
        const user = this.users.find(u => u.id === e.user.id);
        key = user ? user.channel : "Direct";
      }
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  getUserJourneys() {
    return {
      nodes: [
        { name: "Organic Traffic" }, { name: "Direct Visit" }, { name: "Ads Traffic" },
        { name: "/home" }, { name: "/pricing" }, { name: "/signup" },
        { name: "/dashboard" }, { name: "/settings" }, { name: "Purchase Completed" },
        { name: "Bounced" }
      ],
      links: [
        { source: 0, target: 3, value: 5000 }, { source: 1, target: 3, value: 3000 }, { source: 2, target: 3, value: 4500 },
        { source: 3, target: 4, value: 4000 }, { source: 3, target: 9, value: 4500 }, { source: 3, target: 5, value: 4000 },
        { source: 4, target: 5, value: 2500 }, { source: 4, target: 9, value: 1500 }, { source: 5, target: 6, value: 5200 },
        { source: 5, target: 9, value: 1300 }, { source: 6, target: 8, value: 2400 }, { source: 6, target: 7, value: 1200 },
        { source: 6, target: 9, value: 1600 }
      ]
    };
  }

  getRevenueMetrics() {
    const activeSubscribers = this.users.filter(u => u.purchaseCount > 0).length;
    const mrr = activeSubscribers * 99;
    const arr = mrr * 12;
    const ltv = Math.round(this.users.reduce((acc, curr) => acc + curr.revenue, 0) / this.users.length) * 8;
    const aov = 79.5;
    const months = ["Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26"];
    const data = months.map((month, i) => {
      const growthFactor = i + 1;
      const baseRev = 15000 + growthFactor * 4200 + Math.sin(growthFactor) * 1200;
      return { month, revenue: Math.round(baseRev), subscribers: Math.round(baseRev / 99) };
    });
    return { mrr, arr, ltv, aov, data };
  }

  toggleFlag(flagId: string) {
    const flag = this.flags.find(f => f.id === flagId);
    if (flag) {
      flag.status = flag.status === "Active" ? "Inactive" : "Active";
      flag.rolloutPercentage = flag.status === "Active" ? 80 : 0;
      return flag;
    }
    return null;
  }
}

export const mockEngine = new MockAnalyticsEngine();
export default mockEngine;
