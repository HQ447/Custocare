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

## Demo Account

Customer: user@gmail.com , Password : useruser
Owner : user2@gmail.com , Password: useruser
Admin: user3@gmail.com , Passsword: useruser

---

## 📁 UI Design

![Screenshot (615)](https://github.com/user-attachments/assets/bcb30092-ba2c-4d1f-8efa-a7107a943495)

![Screenshot (616)](https://github.com/user-attachments/assets/8262e651-b04c-4740-a44b-a5413a7e9038)

![Screenshot (617)](https://github.com/user-attachments/assets/7acb30a6-a9cd-45bf-862f-883242bfd104)

![Screenshot (618)](https://github.com/user-attachments/assets/366cfa85-4d64-4501-b88d-2939d282f410)

![Screenshot (619)](https://github.com/user-attachments/assets/78c1da5d-6cf7-48a4-90bd-f774e254228b)

![Screenshot (620)](https://github.com/user-attachments/assets/923919c5-faca-4870-974b-4c6390b8e9b0)

![Screenshot (621)](https://github.com/user-attachments/assets/cf555c22-1ae5-4a01-8db8-0e5a36f031d3)

![Screenshot (622)](https://github.com/user-attachments/assets/7044ed79-8aa8-4281-90a6-4d86ecc26729)

![Screenshot (623)](https://github.com/user-attachments/assets/3a0cc827-2efc-4f53-a1b0-86fc7477a9b8)

![Screenshot (624)](https://github.com/user-attachments/assets/797788c9-74a2-4da2-bc50-711b7df81284)

![Screenshot (625)](https://github.com/user-attachments/assets/3b65d9e6-61e2-41db-87ce-cf0725875411)

![Screenshot (626)](https://github.com/user-attachments/assets/aca2a94f-c410-4f77-9276-20d2c868cb29)

![Screenshot (627)](https://github.com/user-attachments/assets/21146b32-9607-4d09-b8c2-0878a5092fdd)

![Screenshot (629)](https://github.com/user-attachments/assets/8a2f53a3-827a-45a9-988f-e76ef714bfd2)

![Screenshot (630)](https://github.com/user-attachments/assets/2ded48d0-fbaf-47a2-b641-6e923fed5144)

![Screenshot (632)](https://github.com/user-attachments/assets/0714a347-c097-4a4b-a27d-866fe5ed339d)

![Screenshot (631)](https://github.com/user-attachments/assets/9e93dc11-2339-4b50-b672-8e800ac4116b)
