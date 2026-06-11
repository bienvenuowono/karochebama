# Project Documentation

### Design System
- **Typography**: Inter (Sans-serif) for clean, modern readability.
- **Colors**: 
  - Primary: Agricultural Green (`emerald-600`)
  - Secondary: Water Blue (`blue-600`)
  - Neutral: Charcoal (`gray-900`), White (`white`)
- **Components**: Reusable, highly polished UI components (Cards, Modals, Data Tables) inspired by Stripe and Shopify.
- **Animations**: `framer-motion` for smooth page transitions and micro-interactions.

### Recommended Folder Structure
```
/src
  /components
    /common      (Button, Input, Modal, Badge)
    /layout      (Navbar, Footer, Sidebar)
    /products    (ProductCard, TraceabilityMap)

  /pages
    /public      (Home, About, Marketplace, ProductDetail)

  /hooks         (useAuth, useCart, useIntelligence)
  /services      (api.ts, auth.ts)
  /store         (Zustand or Redux for state)
  /utils         (formatters, validators)
  App.tsx
```
