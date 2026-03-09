# 🎨 Aesthetic Auctions — Frontend

A real-time auction web platform built with **Next.js 14**, featuring live bidding, user authentication, product search, and a rating system.

> **Full-stack project** · Frontend repo · [Backend repo →](https://github.com/merygon/Backend-App-Aesthetic)

---

## ✨ Features

- 🔍 **Product search** with category filters and rating-based sorting
- 💸 **Real-time auction system** with live bid updates
- ⭐ **User rating system** — view and compare ratings across all users
- 🔐 **Authentication** — login, registration, and session management
- 📱 **Responsive design** — optimized for mobile and desktop
- 🖼️ **Product detail pages** with image gallery and description

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (ES6+) |
| Styling | CSS3, Flexbox/Grid |
| Icons | FontAwesome, Flaticon |
| Auth | Session-based via Django backend |
| Version Control | Git & GitHub |

---

## 🚀 Getting Started

```bash
git clone https://github.com/merygon/Subastas-Aesthetic.git
cd Subastas-Aesthetic
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ Requires the [backend](https://github.com/merygon/Backend-App-Aesthetic) running on `localhost:8000`

---

## 🗂️ Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.js       # Home — search + categories
│   ├── auctions/     # Auction listing + detail pages
│   ├── auth/         # Login & registration
│   └── users/        # User profiles & ratings
├── components/       # Reusable UI components
└── public/           # Static assets
```

---

## 🔗 Related

- **Backend** (Django REST API): [Backend-App-Aesthetic](https://github.com/merygon/Backend-App-Aesthetic)

---

## 👩‍💻 Authors

- María González Gómez · [GitHub](https://github.com/merygon)
- David Tarrasa Puebla · [GitHub](https://github.com/davidtarrasa)
