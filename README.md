# Daffy — Enterprise Product Analytics & Revenue Intelligence Platform

**Daffy** is an enterprise-grade, high-scale Customer Analytics and Production Control Plane designed for Flipkart, Amazon, Netflix, and Shopify-level product analytics. Built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**, Daffy replaces basic remote configs and simple cohort viewers with a complete product intelligence workspace operating at millions of users and billions in transaction scale.

---

## 🚀 Key Modules & Workspace Command Centers

Daffy is divided into ten core workspaces, each optimized for different business, growth, and engineering analytics needs:

### 1. Overview Dashboard (Executive Command Center)
- **Comprehensive KPI Grid**: Displays high-level executive health indexes: GMV (₹428 Cr), Order volume (18.6M), Active Buyers (12.8M), Conversion (4.8%), Retention (42.6%), and NPS (62).
- **Interactive Funnel & Marketplace Logs**: Real-time evaluation of marketplace funnels alongside live tracking feeds.
- **Technical Health Metrics**: Renders real-time API latency (220ms), crash rates (0.08%), search latency (180ms), and Zero-Results search metrics.
- **Anomaly Alerts**: Real-time AI notifications monitoring checkout drop-off anomalies and HDFC/SBI server payment failures.

### 2. Event Explorer (Real-Time Streams)
- **High-Velocity Log Explorer**: Real-time search and filtering across millions of synthetic system events (e.g. `page_view`, `checkout_initiated`, `purchase_completed`).
- **Interactive Event Visualizer**: Responsive Recharts Area and Bar charts displaying event volume frequencies and regional splits.
- **Behavioral & Technical Insights**: Node details inspect event owners, SDK metadata, browser properties, and influenced GMV.

### 3. User 360 (Customer Analytics Workspace)
- **Directory Search**: Multi-field query filter listing customer cards with status tiers (Premium, Regular, New, At Risk).
- **Customer Identity Profiles**: Single-customer cards featuring LTV, Order volume, AOV, and Repeat Purchase Rate.
- **7 Sub-Tabs Workspace**: Explore user timeline events, interactive user journey flow charts, historical orders, properties details, segments association, and team notes.
- **Monetization Economics**: Renders RFM value scores (e.g., Champions, Potential Loyalist) and category spend distributions.

### 4. Funnel Intelligence Platform
- **Sankey Flow Chart Canvas**: Custom SVG polygon diagrams visualizing user transitions and drop-offs from *App Open* to *Payment Success*.
- **Diagnostics Drawer**: Click step cards to inspect influenced revenues, top drop-off reasons, highly affected cohorts, and AI recommendations.

### 5. Retention Intelligence Platform
- **Lifecycle heatmap**: Retention heatmaps tracking cohort return rates.
- **Net Revenue Retention (NRR)**: Tracks revenue stability (118% NRR) comparing Month-over-Month expansions (+22%), contractions (-3%), and churn (-4%).
- **Reactivation Drivers**: Diagnostic lists analyzing push notification impacts, coupon usages, and search activity.

### 6. Cohort Intelligence Workspace
- **Retention Heatmap Matrix**: Week-by-Week matrices tracking cohorts (Jun 25 - May 25) from Week 0 to Week 24. Hover popovers display active users remaining, retained rates, and revenues.
- **Decay Curves Comparison**: Recharts LineChart mapping decay rates comparing Current Cohort (solid green), Previous Month (dashed blue), and Previous Quarter (solid purple).
- **Predictive Churn Engine**: Tracks at-risk user counts (1.8M), potential revenue losses, top churn factors, and a Recharts risk score donut chart.

### 7. Segmentation Explorer
- **Query Builder Bar**: Dynamic event query builders filtering date ranges, platform segments, breakdowns, and filters (Country = India).
- **6 KPI command cards**: Tracks total events (148.7M), unique users (24.8M), events/user (6.0), top segments (Mobile), and active segments (Android).
- **Segment Comparison Mode**: Side-by-side metric comparison card comparing conversions, LTV, and revenues between Variant A and B (e.g. Android vs iOS Smartphone).
- **User Overlap**: Custom SVG Venn diagram illustrating overlapping circles for Mobile (17.9M) and Desktop (4.7M) with a highlighted center overlap indicator.

### 8. User Journey Intelligence
- **Sankey Flow Ribbon Visualizer**: Horizontal node timeline showing Bezier curved ribbon bands linking columns. Band thickness represents Path 1 (60.2%), Path 2 (28.4%), and Path 3 (11.4%).
- **Drop-off Metrics**: Tapered visual paths showing drop volumes and percentages (e.g. `50.5M (33.8% drop)`) under connectors.
- **Top Paths**: Sequence pathways lists and heatmaps representing step user densities.

### 9. Revenue Intelligence Command Center
- **Revenue Over Time**: Historical MRR area curves (solid green) and next 6 months forecast lines (dashed blue) with MRR metrics footers.
- **Revenue Composition**: Donut chart centering `$1.287M` Total MRR, detailing plan splits (Enterprise: 56.0%, Pro SaaS: 29.4%, Starter: 10.2%, Free: 4.4%).
- **MRR Movement Waterfall**: Recharts BarChart utilizing floating ranges to render waterfall bars mapping Starting MRR, New Business, Expansion, Contraction, Churn, and Ending MRR.
- **Customer details drawer**: Click top revenue accounts to open a details drawer mapping LTV, billing contact, and invoice items.

### 10. Experimentation Operating System (A/B testing Engine)
- **LifeCycle Header Timeline**: Horizontal progress timeline tracking experiment lifecycle stages (`Draft` -> `Approved` -> `Running` -> `Analysis` -> `Completed` -> `Rolled Out`).
- **North Star Metric Card**: Tracking Checkout Completion Rate (Control 5.0% vs Variant 6.2%, Lift +24.0%, Confidence 99.4%, Significant Winner).
- **Statistical significance engine**: Evaluates p-value (0.003), statistical power (95%), minimum detectable effect (5.0%), and confidence intervals (+18.0% to +30.0%).
- **AI Recommendation Engine**: Estimates annual revenue lift (₹21.6 Cr) with rollout CTAs.

### 11. Feature Flag Command Center (Production Control Plane)
- **Environment Toggles**: Switch workspace view between Dev, Test, Stage, and Prod environments.
- **Rollout Strategy workflow**: Tracks stage progress timelines (Stage 1 to 5) with schedules. Exposure slider controls.
- **Safety emergency controls**: Prominent global kill switch card ("Disable Feature Globally") that halts and rollbacks target flags.
- **Audit Logs & Dependencies**: Table tracking change histories (Aryan, Rahul) and depends on / used by client SDKs.

---

## 🛠 Tech Stack

- **Framework**: [Next.js App Router](https://nextjs.org) (React Server Components, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (utility-first CSS styles)
- **State Management**: React `useState` & Client hooks
- **Data Visualizations**: [Recharts](https://recharts.org) & Custom SVG inline curves
- **Icons**: [Lucide React](https://lucide.dev)

---

## 📦 Setup & Installation

First, clone the repository:
```bash
git clone https://github.com/ryn-codes/daffy.git
cd daffy
```

Install the dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the Daffy Analytics Dashboard.

Build for production:
```bash
npm run build
```
