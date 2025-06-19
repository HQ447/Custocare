# 🍽️ Food Delivery - Restaurant Management MERN Project

A robust full-stack MERN food delivery platform where restaurant owners can manage their restaurants and menus, customers can browse nearby restaurants, place orders, and leave ratings, while admins oversee the entire system.

---

## 🚀 Features

### 👤 Customer

- Register/Login securely
- View nearest approved restaurants using geolocation
- Browse restaurant menus and place food orders
- Rate and leave feedback for restaurants
- View order status updates

### 🏪 Restaurant Owner

- Register restaurant account
- Submit restaurant for admin approval
- Manage food/menu items (CRUD operations)
- View orders placed for their restaurant
- Update restaurant profile and food details

### 🛡️ Admin Dashboard

- Approve or reject new restaurant registrations
- View and manage all users (customers, owners, admins)
- View and manage all orders across the platform
- Monitor restaurant ratings and feedback
- Delete/update restaurants, food items, or users

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Geolocation:** HTML5 Geolocation API
- **Other Features:** Loading states, rating system, feedback collection

---

## 🔐 Role-Based Access Control (RBAC)

| Role     | Permissions                                         |
| -------- | --------------------------------------------------- |
| Customer | View, order, rate, and give feedback to restaurants |
| Owner    | Add/edit restaurant and food items, manage orders   |
| Admin    | Approve/reject restaurants, manage all entities     |

---

## 🧪 Security & Performance

- 🔐 All routes protected via **JWT + middleware**
- ✅ Role-based authorization checks
- 📶 Loading spinners and disabled states improve UX
- 🔍 Secure password hashing with bcrypt
- 📜 All sensitive routes validated against user roles

---

## 📁 UI Design
