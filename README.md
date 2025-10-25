# 📱 React Native Inventory & Sales App

A complete **Inventory & Sales management mobile app** built with **Expo (SDK 54)**, **React Native**, **TypeScript**, and **SQLite**.  
It demonstrates local data storage, navigation, and form handling with a clean business-style UI.

---

## 🚀 Features

- 🔐 **Login Screen** – Local email & password validation  
- 🏠 **Dashboard** – Summary of items, customers, and invoices  
- 📦 **Items Management** – Add / edit / delete / view items  
- 🗂️ **Categories** – Create and manage item categories  
- 👥 **Customers** – Add, edit, and delete customers  
- 🧾 **Sales Invoices**  
  - Customer & date selection  
  - Auto invoice number generation  
  - Item & category dropdowns  
  - Automatic subtotal, VAT, total, and due calculations  
- 💾 **Offline SQLite Storage** – All data stored locally  
- 🧭 **React Navigation** – Smooth screen transitions  
- 🎨 **Official-style UI** – Simple, clean, and responsive

---

## 🧰 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Expo SDK 54** | Development & build environment |
| **React Native 0.81** | Core mobile framework |
| **TypeScript 5+** | Type safety |
| **React Navigation 6** | Multi-screen navigation |
| **expo-sqlite (Async API)** | Local database |
| **@react-native-picker/picker** | Dropdown picker |
| **date-fns** | Date formatting |

---

## 📂 Project Structure


---

## 🧑‍💻 Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/inventory-sales-app.git
cd inventory-sales-app
npm install
# or
yarn install
npx expo start
npx expo run:android
# or
npx expo run:ios
| Field        | Value               |
| ------------ | ------------------- |
| **Email**    | `admin@example.com` |
| **Password** | `password123`       |
| Screen                | Description                                       |
| --------------------- | ------------------------------------------------- |
| 🏠 **Dashboard**      | Shows counts for items, invoices, and customers   |
| 📦 **Items List**     | Add, edit, or delete items                        |
| 🗂️ **Categories**    | Manage item categories                            |
| 👥 **Customers**      | Customer CRUD                                     |
| 🧾 **Create Invoice** | Add invoice, select customer & items, auto totals |
