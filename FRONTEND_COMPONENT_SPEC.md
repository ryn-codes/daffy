Now we move from **frontend technology architecture** into the actual **product design specification**.

`FRONTEND_COMPONENT_SPEC.md` becomes the document Claude Code uses to build the frontend application.

The purpose is:

* Define every screen
* Define every component
* Define component hierarchy
* Define user interactions
* Define required data models
* Define synthetic JSON data
* Define chart types
* Define frontend states
* Define future backend API contracts

This is the point where we stop thinking "dashboard" and start thinking like a real product analytics platform.

Create:

```text
FRONTEND_COMPONENT_SPEC.md
```

---

# Product Analytics Layer (PAL)

# Frontend Component Specification

Version: 1.0

---

# 1. Objective

This document defines the complete frontend product specification for PAL.

The frontend must be developed independently using:

* Synthetic analytics data
* Mock APIs
* Local state management

Backend implementation starts only after frontend workflows are validated.

---

# 2. Frontend Product Architecture

The application is structured around five layers:

```
Application Shell

        ↓

Feature Modules

        ↓

Analytics Components

        ↓

Visualization Components

        ↓

Data Contracts

```

---

# 3. Global Application Layout

## Component

```
<AppShell/>
```

Purpose:

Main SaaS container.

Structure:

```
<AppShell>

    <Sidebar/>

    <TopNavigation/>

    <PageContainer/>

</AppShell>

```

---

# 4. Sidebar Navigation

Component:

```
<Sidebar/>
```

Navigation:

```
Overview

Events

Users

Funnels

Retention

Cohorts

Segments

Journeys

Revenue

Experiments

Feature Flags

Session Replay

Reports

Settings

```

---

## States

Collapsed:

```
icon only
```

Expanded:

```
icon + label
```

---

# 5. Global Components

## 5.1 Metric Card

Component:

```
<MetricCard/>
```

Purpose:

Display KPI.

Used in:

* Overview
* Revenue
* Retention
* Experiments

---

Props:

```typescript
{
title:string

value:number

change:number

trend:
"up"|"down"

comparison:string
}
```

---

Example:

```json
{
"title":"Daily Active Users",

"value":25000,

"change":"+12%",

"trend":"up"
}
```

---

Visual:

```
+--------------------+

DAU

25,000

↑ 12% vs yesterday

+--------------------+

```

---

# 6. Dashboard Overview

Route:

```
/dashboard
```

Purpose:

Executive product health view.

---

## Page Structure

```
DashboardPage


 ├── DateFilter

 ├── KPIGrid

 ├── GrowthChart

 ├── FunnelSnapshot

 ├── RevenueChart

 ├── UserActivityHeatmap

```

---

# Component 6.1 KPI Grid

```
<KPIGrid/>
```

Contains:

```
MetricCard

MetricCard

MetricCard

MetricCard

```

Metrics:

```
DAU

MAU

Revenue

Conversion

Retention

```

---

# Component 6.2 Growth Chart

```
<GrowthTrendChart/>
```

Chart:

```
Line Chart
```

Data:

```json
[
{
"date":"Jan 1",

"users":12000
}
]
```

---

# Component 6.3 Activity Heatmap

```
<ActivityHeatmap/>
```

Purpose:

Show engagement patterns.

Data:

```json
{
"Monday":1200,

"Tuesday":1500
}
```

---

# 7. Event Explorer

Route:

```
/events
```

Purpose:

Explore raw product events.

---

Page:

```
<EventExplorer/>

    |
    |
    ├── EventSearch

    ├── FilterBuilder

    ├── EventTable

    └── EventDetailPanel

```

---

# Event Table

Component:

```
<EventTable/>
```

Columns:

```
Event Name

User

Timestamp

Properties

Device

Country

```

---

Example:

```json
{
"event":"checkout_completed",

"user":"Aryan",

"time":"10:30",

"properties":

{
"value":2000
}

}
```

---

# Event Detail Panel

Component:

```
<EventDetailDrawer/>
```

Displays:

```
Event Metadata

Properties

User Information

Session

```

---

# 8. Funnel Analytics

Route:

```
/funnels
```

Purpose:

Analyze conversion.

---

Architecture:

```
FunnelsPage


 |

 ├── FunnelBuilder

 ├── FunnelVisualization

 ├── ConversionMetrics

 └── DropoffTable

```

---

# Funnel Builder

Component:

```
<FunnelBuilder/>
```

User creates:

```
Step 1

Signup Started


↓

Step 2

Signup Completed


↓

Step 3

Activated

```

---

Configuration:

```json
{
"name":"Signup Funnel",

"steps":[

"signup_started",

"signup_completed",

"activated"

]

}
```

---

# Funnel Visualization

Chart:

```
Funnel Chart
```

Output:

```
Visitors      10000

Signup         6000

Activated      3500

Purchased      1200

```

---

# 9. Retention Analytics

Route:

```
/retention
```

Purpose:

Measure user stickiness.

---

Structure:

```
RetentionPage


 |

 ├── CohortSelector

 ├── RetentionHeatmap

 └── RetentionSummary

```

---

# Retention Matrix

Component:

```
<RetentionMatrix/>
```

Example:

```
             Week

        0    1    2    3


Jan    100  60   40   30

Feb    100  70   45   35

```

---

Data:

```json
{
"cohort":"Jan",

"week1":60,

"week2":40
}
```

---

# 10. Cohort Builder

Route:

```
/cohorts
```

Purpose:

Create behavioral groups.

---

Structure:

```
<CohortBuilder>


 ConditionBuilder

 PreviewUsers

 SaveCohort


</CohortBuilder>

```

---

Example:

Rule:

```
WHERE

purchase_count > 5

AND

country = India

```

---

Components:

```
<ConditionRow/>

<PropertySelector/>

<OperatorSelector/>

<ValueInput/>

```

---

# 11. Segmentation Explorer

Route:

```
/segments
```

Purpose:

Compare user groups.

---

Structure:

```
SegmentPage


 ├── SegmentSelector

 ├── MetricSelector

 ├── ComparisonChart

 └── InsightsPanel

```

---

Example:

Compare:

```
Mobile Users

vs

Desktop Users

```

---

Charts:

```
Bar Chart

Line Chart

Pie Chart

```

---

# 12. User Profile Explorer

Route:

```
/users/:id
```

Purpose:

Individual user analytics.

---

Structure:

```
<UserProfile>


 Header

 Properties

 EventTimeline

 Sessions

 Cohorts


</UserProfile>

```

---

Timeline:

```
10:01

Viewed Product


10:05

Added Cart


10:10

Purchased

```

---

# 13. Dashboard Builder

Route:

```
/dashboards/new
```

Purpose:

Custom analytics dashboards.

---

Architecture:

```
DashboardCanvas


        |

 WidgetContainer


        |

 WidgetRenderer

```

---

Widget Types:

```
Metric

Line Chart

Bar Chart

Funnel

Table

Heatmap

```

---

Widget Configuration:

```json
{
"type":"line_chart",

"metric":"active_users",

"dateRange":"30_days"

}
```

---

# 14. Query Builder Component

Important for analytics.

Component:

```
<QueryBuilder/>
```

Allows:

```
Select Event

Add Filters

Choose Metric

Group By

Run Query

```

---

Example:

```
Event:

purchase_completed


Filter:

country = India


Metric:

COUNT(users)

```

---

# 15. Experiment Dashboard

Route:

```
/experiments
```

Components:

```
ExperimentList

ExperimentCard

VariantComparison

ResultsChart

```

---

Metrics:

```
Conversion

Revenue

Retention

```

---

# 16. Feature Flag UI

Route:

```
/feature-flags
```

Components:

```
FlagList

FlagEditor

TargetingRules

```

---

Example:

```
Enable New Checkout

10% Users

India Only

```

---

# 17. Session Replay UI

Route:

```
/sessions
```

Components:

```
SessionList

ReplayViewer

Timeline

EventMarkers

```

---

# 18. Global Filter System

Important shared component.

Component:

```
<AnalyticsFilterBar/>
```

Supports:

```
Date Range

Users

Countries

Devices

Events

Segments

```

---

# 19. Loading States

Every component must support:

## Loading

```
Skeleton UI

```

---

## Empty

```
No Data Available

```

---

## Error

```
Unable to Load Data

Retry

```

---

# 20. Frontend Data Contracts

Every component defines:

Example:

Component:

```
GrowthTrendChart
```

Requires:

```typescript
interface GrowthMetric {

date:string

users:number

}

```

---

Backend later implements:

```
GET /analytics/growth

```

---

# 21. Mock API Layer

Structure:

```
src/api/mock


dashboard.mock.ts

events.mock.ts

funnels.mock.ts

retention.mock.ts

```

---

Example:

```typescript
export async function getDashboardMetrics(){

return mockDashboardData

}

```

---

# 22. Component Development Order

## Sprint 1

Foundation

Build:

```
AppShell

Sidebar

Theme

UI Components

```

---

## Sprint 2

Core Analytics

Build:

```
Dashboard

Metric Cards

Charts

Events

```

---

## Sprint 3

Advanced Analytics

Build:

```
Funnels

Retention

Cohorts

Segments

```

---

## Sprint 4

Platform Features

Build:

```
Dashboards

Experiments

Feature Flags

Session Replay

```

---

# 23. Frontend Completion Criteria

Frontend phase is complete when:

```
✓ All screens implemented

✓ All components reusable

✓ Synthetic data integrated

✓ Charts functional

✓ User workflows validated

✓ API contracts documented

✓ Backend requirements extracted

```

---

# Final Frontend Architecture

```
                 Next.js


                    |

              App Router


                    |

          Feature Modules


                    |

       Analytics Components


                    |

        Visualization Layer


                    |

          Mock Data APIs


                    |

        Backend Contracts


                    |

        Real Analytics Backend

```

---

# Core Principle

The frontend is the **living specification** of PAL.

Every chart, filter, workflow, and interaction defines what the backend must eventually provide.

The backend is not designed first.

The analytics experience is designed first.

---

After this document, the next logical document is:

```text
FRONTEND_IMPLEMENTATION_PLAN.md
```

which converts this specification into actual Claude Code execution prompts:

* Create project
* Install dependencies
* Build design system
* Build every page
* Build every component
* Add mock data
* Add tests
* Run locally

This will make Claude Code operate like a frontend engineering team.
