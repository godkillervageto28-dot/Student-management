# Student Management System

A lightweight, frontend-only web application that demonstrates role-based access control (Admin, Faculty, and Student) using plain HTML, CSS, JavaScript, and `localStorage`. 

This project is designed to be easily testable without needing a backend server or external database.

## 🚀 Features
* **Role-Based Dashboards:** Distinct views and permissions for Admins, Faculty members, and Students.
* **Admin Controls:** Ability to create new Faculty and Student accounts.
* **Faculty Controls:** View assigned students and update their academic profiles (Attendance, Math, Science, and English marks).
* **Student View:** Read-only access to view their personalized academic performance.
* **Persistent Local Data:** Uses the browser's `localStorage` to save users and grades so data isn't lost on page refresh.

---

## 📖 Evaluator Flow Guide (How to Test)

To fully test the system's capabilities, please follow this exact flow:

### Step 1: Admin Login
1. Open the application.
2. Log in using the default Admin credentials:
   * **Username:** `admin`
   * **Password:** `admin123`

### Step 2: Create Accounts (Admin)
1. On the Admin Dashboard, use the form to add a **Faculty** user (e.g., Username: `fac1`, Password: `password`).
2. Use the form again to add a **Student** user (e.g., Username: `stu1`, Password: `password`).
3. Take note of the credentials you just created.
4. Click **Logout**.

### Step 3: Add Grades (Faculty)
1. Log in using the **Faculty** credentials you created in Step 2.
2. You will see a list of all students in the system.
3. Enter data into the Attendance, Math, Science, and English fields for the student you created.
4. Click the **Update Profile** button. An alert will confirm the update.
5. Click **Logout**.

### Step 4: View Grades (Student)
1. Log in using the **Student** credentials you created in Step 2.
2. You will see your personalized dashboard reflecting the exact attendance and marks inputted by the faculty member.
3. Click **Logout** when finished.

*(Note: There is also a persistent "📖 Flow / How to Use" button in the bottom right corner of the live app for quick reference during testing).*

---

## 🛠️ Tech Stack
* **HTML5:** Page structure.
* **CSS3:** Custom styling (No external libraries like Bootstrap/Tailwind used).
* **JavaScript (ES6):** Logic, DOM manipulation, and state management.
* **Storage:** Window `localStorage` API.

## 💻 How to Run Locally
1. Download or clone this repository to your local machine.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same folder.
3. Double-click `index.html` to open it in any modern web browser (Chrome, Firefox, Safari, Edge).
4. No build steps, servers, or terminal commands are required!

## 🌐 Deployment Note
This project is fully ready to be deployed on static hosting platforms like **Vercel**, **Netlify**, or **GitHub Pages**. 

**Important limitation regarding `localStorage` in a deployed environment:**
Because this app relies on `localStorage` to act as the database, all generated data (new users, marks) is saved directly within the *specific browser* used to access the site. If User A adds a student on their computer, User B will not see that student on their mobile phone. It is perfect for individual testing and evaluation, but a real-world multi-user scenario would require integration with a cloud database (like Firebase or Supabase).
