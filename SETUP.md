# SeeU Admin Panel — Setup & Integration Guide

## Overview

This is a **Next.js 14** admin panel for the SeeU dating app. It connects to your FastAPI backend at `http://163.227.92.122:4012` using JWT Bearer token authentication.

---

## 1. Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| Git | any |

---

## 2. Quick Start

```bash
# Clone or extract the project
cd seeu-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** — you'll be redirected to `/login`.

---

## 3. Environment Configuration

The file `.env.local` is pre-configured:

```env
NEXT_PUBLIC_API_URL=http://163.227.92.122:4012
```

### Change the API URL

Edit `.env.local`:

```env
# For local backend
NEXT_PUBLIC_API_URL=http://localhost:4012

# For production
NEXT_PUBLIC_API_URL=https://your-production-api.com
```

> **Important:** Always restart `npm run dev` after changing `.env.local`.

---

## 4. Authentication Flow

### How it works

1. Admin visits any protected route → middleware checks for `admin_token` cookie
2. If no cookie → redirected to `/login`
3. On login, `POST /admin/login` is called with `{ email, password }`
4. The returned `access_token` is stored as a cookie (`admin_token`, 7-day expiry)
5. All subsequent API calls include `Authorization: Bearer <token>` header automatically

### Login endpoint

```
POST /admin/login
Body: { "email": "admin@seeu.com", "password": "yourpassword" }
Response: { "data": { "access_token": "eyJ..." } }
```

### Logout

```
POST /admin/logout
Headers: Authorization: Bearer <token>
```

Logout removes the cookie and redirects to `/login`.

---

## 5. Project Structure

```
seeu-admin/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Redirects to /dashboard
│   ├── globals.css             # Global styles (dark theme, CSS vars)
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard with metrics + charts
│   ├── users/
│   │   └── page.tsx            # Users management table
│   ├── configuration/
│   │   └── page.tsx            # Pricing plans (Basic/Chat/Micro)
│   └── notifications/
│       └── page.tsx            # Notification & Communication
├── components/
│   ├── layout/
│   │   └── AdminLayout.tsx     # Sidebar + topbar layout
│   └── ui/
│       └── Pagination.tsx      # Reusable pagination component
├── lib/
│   ├── api.ts                  # Axios client + all API functions
│   └── auth.tsx                # Auth context (token management)
├── middleware.ts               # Route protection
├── .env.local                  # API URL config
└── package.json
```

---

## 6. API Integration Details

All API calls are in `lib/api.ts`. The axios instance automatically:
- Attaches the Bearer token from the `admin_token` cookie
- Redirects to `/login` on 401 responses

### Dashboard

| Function | Endpoint | Used In |
|----------|----------|---------|
| `getDashboardMetrics(filter)` | `GET /admin/dashboard/metrics` | Dashboard stats cards |
| `getRevenueOverview(type)` | `GET /api/dashboard/revenue-overview` | Revenue chart |

**Filter values:** `daily`, `weekly`, `monthly`, `yearly`

### Users Management

| Function | Endpoint | Used In |
|----------|----------|---------|
| `listUsers(params)` | `GET /admin/users` | Users table |
| `blockUnblockUser(id, bool)` | `POST /admin/users/block` | Block/Unblock action |

**Params for listUsers:**
```typescript
{
  search?: string;       // Search by name
  gender?: string;       // 'man', 'woman', 'beyond binary'
  persona_type?: string; // Persona type filter
  status?: string;       // 'active', 'blocked'
  page?: number;         // Default: 1
  page_size?: number;    // Default: 10
}
```

### Configuration & Pricing

| Function | Endpoint | Used In |
|----------|----------|---------|
| `getAdminPlans()` | `GET /api/subscription/admin/get_plans_list` | Plans table |
| `createSubscriptionPlan(data)` | `POST /api/subscription/admin/create_subscription` | Create modal |
| `updateSubscriptionPlan(id, data)` | `PATCH /api/subscription/admin/update_subscription/{id}` | Edit plan |
| `deleteSubscriptionPlan(id)` | `DELETE /api/subscription/admin/delete_plan/{id}` | Delete plan |
| `toggleSubscriptionStatus(id, status)` | `POST /api/subscription/admin/toggle_subscription_status/{id}` | Toggle active |

### Notifications

| Function | Endpoint | Used In |
|----------|----------|---------|
| `getAdminNotifications(type, page, limit)` | `GET /admin/get-admin-notifications` | Notifications table |
| `sendNotification(data)` | `POST /admin/send-notification-to-users` | Send modal |
| `scheduleNotification(data)` | `POST /admin/schedule-notification` | Schedule modal |

---

## 7. Adding New API Functions

Open `lib/api.ts` and add your function:

```typescript
// Example: Get user profile
export const getUserProfile = (profile_id: string) =>
  api.get(`/api/users/profile/${profile_id}`);

// Example: Update user profile  
export const updateUserProfile = (profile_id: string, data: object) =>
  api.patch(`/api/users/profile/${profile_id}`, data);
```

Then import and use it in your page component:

```typescript
import { getUserProfile } from '@/lib/api';

const profile = await getUserProfile(userId);
```

---

## 8. Adding New Pages

### Step 1: Create the page file

```
app/your-page/page.tsx
```

### Step 2: Use AdminLayout wrapper

```tsx
'use client';

import AdminLayout from '@/components/layout/AdminLayout';

export default function YourPage() {
  return (
    <AdminLayout>
      <div>
        <h1>Your Page</h1>
      </div>
    </AdminLayout>
  );
}
```

### Step 3: Add to sidebar nav

Edit `components/layout/AdminLayout.tsx`, add to `navItems`:

```typescript
const navItems = [
  // existing items...
  { href: '/your-page', label: 'Your Page Label', icon: YourIcon },
];
```

---

## 9. Styling System

The design uses CSS variables defined in `app/globals.css`:

| Variable | Value | Purpose |
|----------|-------|---------|
| `--bg` | `#0d0b1e` | Page background |
| `--surface` | `#1a1535` | Sidebar, inputs |
| `--card` | `#1e1a3a` | Cards, modals |
| `--border` | `#2a2550` | Borders |
| `--pink` | `#e8456a` | Primary accent |
| `--orange` | `#f07f3c` | Secondary accent |
| `--gradient` | pink→orange | Buttons, active states |
| `--text` | `#c8c4e8` | Body text |
| `--muted` | `#6b6890` | Labels, secondary text |

### Reusable CSS classes

```css
.seeu-card      /* Dark card with border */
.seeu-input     /* Styled input field */
.gradient-btn   /* Pink-orange gradient button */
.nav-link       /* Sidebar navigation link */
.badge-active   /* Green status badge */
.badge-inactive /* Red status badge */
.badge-sent     /* Green notification badge */
.badge-scheduled /* Yellow notification badge */
.persona-tag    /* Base persona tag */
.persona-stable /* Purple persona */
.persona-sensory /* Pink persona */
.persona-explorer /* Blue persona */
.modal-backdrop /* Full-screen overlay */
.modal-box      /* Modal container */
```

---

## 10. Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Set environment variable in Vercel dashboard:
- Key: `NEXT_PUBLIC_API_URL`
- Value: `http://163.227.92.122:4012` (or your production URL)

### Deploy with Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t seeu-admin .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://163.227.92.122:4012 seeu-admin
```

---

## 11. CORS Configuration

If you see CORS errors in the browser, the backend needs to allow your frontend origin.

In your FastAPI backend, add:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-admin-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 12. Common Issues & Fixes

### "401 Unauthorized" on all requests
- Token may have expired. Log out and log back in.
- Check that `NEXT_PUBLIC_API_URL` is correct.

### "Network Error" / "Failed to fetch"
- Backend is not running or unreachable.
- Check CORS settings on the backend.
- Verify the API URL in `.env.local`.

### Charts not showing data
- The dashboard will show sample data if the API returns an unexpected format.
- Check the browser console for the actual API response shape.
- You may need to adjust the data mapping in `app/dashboard/page.tsx`.

### Login token not found
- The API response format might differ. Check the actual response in browser DevTools Network tab.
- The code looks for `data.data.access_token` OR `data.access_token`. If it's different, update `app/login/page.tsx`:
  ```typescript
  const token = res.data?.your_actual_path?.access_token;
  ```

---

## 13. API Response Format Notes

The backend returns responses in this format:

```json
{
  "success": true,
  "status_code": 200,
  "message": "Success",
  "data": { ... }
}
```

All API functions in `lib/api.ts` extract `res.data?.data` first, then fall back to `res.data`. If you see issues, console.log the raw response to check the structure.

---

## 14. Feature Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Login | ✅ | JWT cookie auth |
| Dashboard metrics | ✅ | Calls `/admin/dashboard/metrics` |
| Revenue chart | ✅ | Area chart with Recharts |
| Gender pie chart | ✅ | Pie chart with Recharts |
| Users table | ✅ | Paginated, searchable, filterable |
| Block/Unblock user | ✅ | Via action menu |
| Subscription plans | ✅ | Basic/Chat/Micro tabs |
| Create plan | ✅ | Modal form |
| Toggle plan status | ✅ | Via action menu |
| Send notification | ✅ | Modal with persona/msg type |
| Schedule notification | ✅ | Modal with datetime picker |
| Notification history | ✅ | Sent + Scheduled tabs |
| Auth middleware | ✅ | Protects all routes |
| Responsive sidebar | ✅ | Collapsible |
| Language switcher | ✅ | UI only (EN/FR) |
| Admin profile modal | ⬜ | Can be added |
| User profile detail | ⬜ | Can be added |
| Export users CSV | ⬜ | `/api/user-transactions` |
| Terms & Conditions | ⬜ | Admin T&C management |

---

*Built for SeeU Admin — Next.js 14 + FastAPI backend*
