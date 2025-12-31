# Next.js Frontend – E‑Commerce UI

This repository contains the **Next.js frontend** for an e‑commerce application.
It is designed to work with a Django REST API backend using **cookie‑based JWT authentication**
via same‑origin API proxy routes.

---

## Features

- Next.js App Router
- Cookie‑based authentication (httpOnly JWTs)
- Secure API proxy routes (`/api/*`)
- Product catalog with images
- Shopping cart with quantity controls
- Account management (email + password updates)
- Modern UI with Tailwind CSS
- Server + Client component architecture

---

## Tech Stack

- Node.js 18+
- Next.js 15/16 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Fetch API (same‑origin proxy)
- Django backend (separate repo)

---

## Project Structure

```
web/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── account/
│   │   └── products/
│   ├── login/
│   │   └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── account/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── Navbar.tsx
├── lib/
│   └── serverAuth.ts
├── public/
├── package.json
└── README.md
```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd ecommerce-store/web
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create `.env.local` in the `web/` directory:

```env
DJANGO_API_BASE=http://127.0.0.1:8000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Running the App

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## Authentication Flow

1. User logs in via `/login`
2. Credentials are sent to `/api/auth/login`
3. Next.js proxy calls Django `/api/auth/token/`
4. Access + refresh tokens are stored as **httpOnly cookies**
5. All authenticated requests use same‑origin `/api/*` routes

No tokens are stored in localStorage.

---

## API Proxy Pattern

The frontend never talks to Django directly.

Example:
```
Browser → /api/cart/items → Next.js → Django → Next.js → Browser
```

Benefits:
- No CORS
- Secure cookies
- Centralized auth + refresh handling

---

## Pages

### `/`
Product catalog with **Add to Cart** buttons

### `/cart`
- View cart items
- Update quantities
- Remove items
- Checkout placeholder

### `/account`
- Update email
- Change password
- Logout

### `/login`
- Authentication only
- Navbar hidden

---

## Styling

Tailwind CSS is used for styling.

Common patterns:
- Rounded cards
- Subtle shadows
- Neutral zinc palette
- Mobile‑first responsive layout

---

## Development Notes

- All sensitive auth logic lives in `/lib/serverAuth.ts`
- API routes live under `/app/api`
- Cart, account, and products rely on Django API responses
- The app assumes **one cart per user**

---

## Future Improvements

- Guest cart support
- Checkout flow (Stripe)
- Order history
- Cart badge count in navbar
- Improved error boundaries
- Loading skeletons

---

## License

Personal / educational use.
