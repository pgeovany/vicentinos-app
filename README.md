# Vicentinos App

Web application for managing and visualizing food assistance operations for a **Vicentinos (Sociedade de São Vicente de Paulo)** group.

The app is used by both **internal volunteers** and the **general public**, with a strong focus on **usability, security, and clarity**, rather than visual complexity.

It is designed to support real operational work by users who are **not necessarily familiar with technology**, while enforcing strict access control and data integrity.

---

## 🎯 Purpose

This application exists to:
- Support volunteers during real operational workflows
- Reduce errors in donation intake and food distribution
- Provide **public transparency** to the community and donors
- Offer a simple and reliable interface over a complex backend system

It is **actively running in production** and used monthly during operations.

---

## 🧩 Core Features

### 🔐 Admin / Volunteer Area (Authenticated)
- Secure login and session handling
- Assisted people registration and lifecycle management
- Donations intake with source and date tracking
- Food stock visualization and updates
- Basket configuration and monthly distribution tracking
- Emergency assistance (SOS) registration
- Full historical records of operations
- Advanced filtering and search
- Clear feedback and validation for critical actions

Access to these pages is **strictly protected**, and unauthenticated users are prevented from accessing internal routes.

---

### 🌍 Public Transparency Pages (Unauthenticated)

Anyone can access:
- 📦 Product transparency  
  - https://vicentinos.vercel.app/transparencia/produtos

- 📊 Statistics and historical data  
  - https://vicentinos.vercel.app/transparencia/estatisticas

These pages exist to ensure **trust, accountability, and openness**, while exposing only aggregated and non-sensitive data.

---

## 🔐 Authentication & Routing

- JWT-based authentication flow
- Clear separation between public and protected routes
- Route guards to prevent unauthorized access
- Graceful handling of expired or invalid sessions
- Defensive UI behavior for missing or partial data

Routing and access control are designed to mirror real backend authorization rules.

---

## 🧠 Frontend Engineering Approach

- Backend-driven UI design
- Focus on correctness, security, and clarity over visual polish
- Simple, predictable navigation
- Explicit loading and error states
- Interfaces built to prevent invalid operations
- Close alignment with backend contracts (REST API)

The frontend acts as a **reliable operational layer**, not a source of business logic.

---

## 🎨 UX & Usability

- Screens designed for non-technical volunteers
- Clear labels, flows, and confirmations
- Minimal cognitive load during operations
- Data visualization focused on comprehension, not decoration
- Consistent patterns across the application

---

## 🔌 API Integration

- Consumes the Vicentinos REST API
- Handles authenticated and public endpoints
- Explicit handling of authorization failures
- Defensive UI against partial or inconsistent data
- Designed to reflect backend validations and constraints

---

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **shadcn/ui**
- **REST API integration**
- **Charting & data visualization**
- **JWT-based authentication**

---

## 🚀 Deployment

- Hosted on **Vercel**
- Connected to a production backend
- Publicly accessible transparency routes
- Mobile-friendly layout for real-world usage

---

## 📌 Status

✅ In production  
👥 Used by volunteers  
🌍 Public transparency enabled  

---

## 🤍 Why this project matters

This is not a demo application.

It is a **production system** built to support real people, real responsibilities, and real accountability — balancing usability for non-technical users with strong security and backend-driven design.
