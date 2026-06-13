For PAL (your product analytics SaaS), since you are following a **frontend-first design approach**, you should define a complete **frontend engineering stack and architecture** before building screens.

The goal is not just "build a dashboard". You are building a **complex analytics application** similar to:

* PostHog
* Amplitude
* Mixpanel

These products require:

* Complex state management
* Data visualization
* Dynamic dashboards
* Query builders
* Filters
* Tables
* Forms
* Real-time updates
* Component systems
* Testing infrastructure

I would create:

```text
FRONTEND_TECH_STACK.md
```

---

# Product Analytics Layer (PAL)

# Frontend Technology Stack & Engineering Architecture

Version: 1.0

---

# 1. Frontend Development Philosophy

PAL frontend follows:

```
Design System First

↓

Reusable Components

↓

Feature-Based Architecture

↓

Mock Data Driven Development

↓

API Contract Integration

↓

Production Backend Integration
```

The frontend should be fully functional using synthetic analytics data before backend implementation.

---

# 2. Core Frontend Stack

## Framework

## Next.js + React + TypeScript

Technology:

```
Next.js 15+

React 19

TypeScript

```

Why:

* Production-grade routing
* Server/client component model
* Good SaaS architecture
* Performance optimization
* Deployment flexibility

---

# 3. Styling System

## Tailwind CSS

Use:

```
Tailwind CSS v4
```

Purpose:

* Utility-first styling
* Rapid iteration
* Consistent design tokens

Example:

```tsx
<Card className="rounded-xl shadow-sm">
```

---

# 4. Component Library

## shadcn/ui

Use:

```
shadcn/ui
```

Architecture:

```
Your Code

↓

Radix UI primitives

↓

Tailwind styling

```

Components:

```
Button

Card

Dialog

Dropdown

Tabs

Command Menu

Table

Form

Calendar

Toast

Sheet

```

---

# 5. Design System Architecture

Create:

```
src/components/ui
```

Contains:

```
Button.tsx

Card.tsx

Input.tsx

Modal.tsx

Dropdown.tsx

```

---

Analytics-specific components:

```
src/components/analytics
```

Example:

```
MetricCard.tsx

ChartContainer.tsx

FunnelChart.tsx

RetentionMatrix.tsx

FilterBuilder.tsx

```

---

# 6. Icon System

Use:

```
Lucide React
```

Example:

```tsx
import { Users } from "lucide-react"
```

---

# 7. Charts & Visualization

Analytics platforms depend heavily on visualization.

Recommended stack:

## Primary

```
ECharts
```

or

```
Recharts
```

For PAL:

Use:

```
Apache ECharts
```

because it supports:

* Large datasets
* Heatmaps
* Sankey diagrams
* Funnel charts
* Custom rendering

---

Charts required:

## Growth

```
Line Chart

Area Chart

```

---

## Funnel

```
Funnel Chart

Step Conversion

Drop-off Chart

```

---

## Retention

```
Heatmap

Cohort Matrix

```

---

## User Journey

```
Sankey Diagram

Path Visualization

```

---

# 8. Application State Management

PAL has multiple states:

* Dashboard configuration
* Filters
* Date ranges
* Selected events
* Query builder state

Use:

## Zustand

Architecture:

```
Component

↓

Zustand Store

↓

Application State

```

Example:

```typescript
const useDashboardStore = create((set)=>({

widgets:[],

addWidget:(widget)=>{}

}))
```

---

# 9. Server State Management

For API data:

Use:

## TanStack Query

(previously React Query)

Purpose:

* API caching
* Background refresh
* Loading states
* Error handling

Example:

```typescript
useQuery({

queryKey:["metrics"],

queryFn:getMetrics

})

```

---

# 10. Form Management

Analytics applications have many forms:

* Funnel builder
* Cohort builder
* Filters
* Experiments

Use:

## React Hook Form

with:

## Zod

Example:

```typescript
const schema=z.object({

event:z.string()

})

```

---

# 11. Routing Architecture

Use:

Next.js App Router

Structure:

```
app/


dashboard/

events/

funnels/

retention/

cohorts/

segments/

experiments/

settings/

```

---

Example:

```
/dashboard

/events

/funnels/signup

/cohorts/power-users

```

---

# 12. Frontend Folder Architecture

Recommended:

```
src/


├── app

│
├── components

│   ├── ui
│   ├── charts
│   └── analytics


├── features

│
│   ├── dashboard
│   │
│   ├── events
│   │
│   ├── funnels
│   │
│   ├── retention
│   │
│   ├── cohorts
│   │
│   └── experiments


├── hooks


├── stores


├── lib


├── api


├── mock-data


└── types

```

---

# 13. Feature Architecture Pattern

Every feature follows:

```
feature-name/


components/

hooks/

api/

types.ts

mock.ts

utils.ts

```

---

Example:

```
features/funnels/


components/

    FunnelBuilder.tsx

    FunnelChart.tsx


api/

    funnel.api.ts


hooks/

    useFunnel.ts


types.ts


mock.ts

```

---

# 14. Mock Data First Architecture

Before backend:

Create:

```
src/mock-data
```

Example:

```json
{
"metric":"DAU",

"value":25000,

"trend":"+12%"
}
```

---

API layer:

Instead of:

```typescript
fetch("/api")
```

Use:

```typescript
analyticsClient.getMetrics()
```

Initially:

```
Mock API

```

Later:

```
Real API

```

No UI rewrite required.

---

# 15. Frontend Build System

Package manager:

```
pnpm
```

Why:

* Fast
* Monorepo friendly
* Used widely in modern React ecosystems

---

Build tools:

```
Next.js Compiler

Turbopack

TypeScript Compiler

ESLint

Prettier

```

---

# 16. Code Quality

## ESLint

Rules:

* React hooks validation
* TypeScript strict mode
* Import ordering

---

## Prettier

Automatic formatting.

---

## Husky

Git hooks:

Before commit:

```
Lint

Type Check

Tests

```

---

# 17. Testing Strategy

Frontend testing pyramid:

```
             E2E

          Playwright


        Integration

     React Testing Library


           Unit

          Vitest

```

---

# 18. Unit Testing

Tool:

```
Vitest
```

Test:

* Utility functions
* Data transformations
* Query builders

Example:

```
calculateConversion.test.ts
```

---

# 19. Component Testing

Tool:

```
React Testing Library
```

Test:

Example:

Metric Card:

```
renders value

renders trend

handles loading

```

---

# 20. End-to-End Testing

Tool:

```
Playwright
```

Critical flows:

## Dashboard

```
Login

Open Dashboard

Change Date

View Metrics

```

---

## Funnel

```
Create Funnel

Select Events

View Conversion

```

---

# 21. Storybook

Recommended.

Purpose:

Build components independently.

Example:

```
MetricCard.stories.tsx

FunnelChart.stories.tsx

```

---

# 22. Analytics Design System

Create:

```
PAL Design System

```

Components:

## Data Display

```
MetricCard

KPIGrid

ChartCard

DataTable

```

---

## Filters

```
DatePicker

EventSelector

PropertyFilter

SegmentSelector

```

---

## Builder Components

```
DragDropCanvas

QueryBuilder

RuleBuilder

```

---

# 23. Performance Optimization

Important for analytics apps.

Implement:

## Code Splitting

Load heavy charts only when needed.

---

## Virtualized Tables

Use:

```
TanStack Virtual
```

for millions of rows.

---

## Memoization

Use:

```
React.memo

useMemo

useCallback

```

---

# 24. Authentication Layer

Frontend:

```
Auth Provider

↓

JWT Storage

↓

Protected Routes

```

---

Recommended:

```
HttpOnly cookies

```

---

# 25. Deployment Stack

Recommended:

Frontend hosting:

```
Vercel

```

or

```
AWS CloudFront + S3

```

---

CI/CD:

```
GitHub Actions

↓

Build

↓

Test

↓

Deploy

```

---

# 26. Frontend Development Roadmap

## Sprint 1

Foundation

Build:

```
Next.js

Tailwind

shadcn

Theme

Layout

Navigation

```

---

## Sprint 2

Analytics Components

Build:

```
MetricCard

Charts

Tables

Filters

```

---

## Sprint 3

Dashboard

Build:

```
Overview Dashboard

Widget System

Customization

```

---

## Sprint 4

Analytics Modules

Build:

```
Events

Funnels

Retention

Cohorts

Segments

```

---

## Sprint 5

Advanced

Build:

```
Experiments

Feature Flags

Session Replay

```

---

# Final Frontend Architecture

```
                 Next.js


                    |

             Feature Modules


                    |

          React Components


                    |

          shadcn/ui System


                    |

          Tailwind Styling


                    |

       Zustand + TanStack Query


                    |

          Mock API Layer


                    |

        Backend API Contracts


                    |

              Real Backend

```

---

# Core Principle

The PAL frontend should be built as a **complete analytics product using synthetic data first**.

When the frontend is mature:

* Every screen exists
* Every chart exists
* Every interaction exists
* Every data requirement is known

Then the backend becomes an implementation exercise rather than product discovery.

---

The next document after this should be:

```
FRONTEND_COMPONENT_SPEC.md
```

This will define every individual screen:

* Dashboard page
* Event Explorer
* Funnel Builder
* Retention Matrix
* Cohort Builder
* Query Builder
* Charts
* Tables
* Filters
* Synthetic JSON schemas

That document becomes the actual blueprint Claude Code uses to build the frontend.
