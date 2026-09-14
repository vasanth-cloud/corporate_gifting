# 🎁 GiftPulse | B2B Corporate Gifting & Swag Automation Platform

**GiftPulse** is a production-grade B2B SaaS Corporate Gifting & Swag Automation Platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, PostgreSQL, Prisma ORM, JWT multi-tenancy middleware, and cryptographic magic links.

It simplifies enterprise corporate gifting by automating HR administration, gift selection, recipient address collection, and multi-supplier fulfillment with zero logistics hassle.

---

## 🌟 Key Features

### 🏢 1. Multi-Tenant Corporate HR Admin Portal (`/admin`)
- **Enterprise Client Isolation**: Separate workspace views and isolated password authentication for corporate tenants (**Acme Corp**, **Globex Corp**, **Cyberdyne Systems**, **Stark Industries**, and **Initech**).
- **Executive Metrics**: Dashboard tracking total budget spent, redemption rate, active campaigns, and catalog SKUs.
- **Campaign Creator (`/admin/campaigns`)**: Launch campaigns (Work Anniversaries, Onboarding Kits, Diwali Festival Cheer), assign budgets, and generate shareable magic claim links.
- **Order Tracker (`/admin/orders`)**: Real-time delivery status board (`Ordered` -> `In Production` -> `Shipped` -> `Delivered`).

### 🎨 2. 3D Logo Customization Studio (`/admin/catalog`)
- **Live Canvas Proofing**: Render company logos dynamically on merchandise (hoodies, tumblers, notebooks, packaging).
- **Print Finishes**: Real-time rendering modes for **Screen Print**, **Metallic Gold Foil**, and **Debossed Leather**.
- **Vector Proof Download**: Export 3D proof mockups for procurement approvals.

### ✉️ 3. Recipient Cryptographic Magic Link Portal (`/claim/[token]`)
- **Interactive Unboxing**: Framer Motion digital gift unboxing sequence with custom executive greeting cards.
- **Budget-Tier Locked Grid**: Curated choice catalog matching pre-approved campaign tiers.
- **Confidential Address Collection**: Direct address and size/color selection (no master spreadsheet dependencies).

### 🚚 4. Supplier Logistics & Fulfillment Dashboard (`/vendor`)
- **Vendor Partitioning**: Dispatch queue categorized by supplier partners (**Dealberg Tech**, **Zestta Delights**, **Ekmatra Swag Studio**, **CorporateGift.com**).
- **Print Asset Exports**: Download vector logo SVGs and personalized greeting note print sheets.
- **Courier Tracking**: Update order status (`In Production` -> `Shipped`) and submit FedEx, DHL, or Shiprocket tracking IDs.

### 🎨 5. Dynamic Multi-Theme Switching Engine
- Switch between **Midnight Dark**, **Corporate Light**, and **Emerald Executive** themes in real-time from the global navigation bar.

---

## 🏗️ Technical Stack

- **Framework**: Next.js 14 (App Router, React Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion, HTML5 Canvas Engine
- **Database & ORM**: PostgreSQL with Prisma ORM (`prisma/schema.prisma` with 20 relational entities)
- **Security & Auth**: `bcryptjs` password hashing, `jose` JWT session tokens, 256-bit cryptographic magic links
- **Middleware**: Edge middleware (`middleware.ts`) injecting `x-company-id` and `x-user-role` headers for strict backend multi-tenancy

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vasanth-cloud/corporate_gifting.git
   cd corporate_gifting
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build & Compilation

To build for production:

```bash
npm run build
```

All 9 routes and edge middleware compile cleanly:
- `/` (Landing Page & Enterprise Sandbox)
- `/admin` (HR Admin Portal & Multi-tenant Switching)
- `/admin/campaigns` (Campaign Creator & Magic Links)
- `/admin/catalog` (Gift Catalog & 3D Studio)
- `/admin/orders` (Order Analytics)
- `/claim/[token]` (Recipient Unboxing Portal)
- `/vendor` (Supplier Fulfillment Dashboard)

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
