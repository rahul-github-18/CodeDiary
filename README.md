<div align="center">

# 📝 Code Diary

**An All-in-One Fullstack Learning Management Platform, Interactive Code Playground, & Curriculum Tracker.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-kodediary.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kodediary.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

### 🔗 Live Application: [kodediary.vercel.app](https://kodediary.vercel.app)

</div>

---

## 🌟 Overview

**Code Diary** is a state-of-the-art learning platform built for students, developers, and educators. It combines curriculum tracking, multi-language in-browser code execution, interactive problem sets, real-time analytics, automated PDF certificate generation, and an instructor management console into a unified Web and Progressive Web App (PWA).

---

## ✨ Key Features

### 📚 Learning Management & Curriculum Tracking
- 🏷️ **Structured Categories**: Browse modules across Data Structures, Algorithms, Web Development, SQL, and more.
- 📈 **Progress Tracking**: Real-time topic completion percentages, time estimations, and visual progress bars.
- 🎯 **Problem Sets & Solutions**: Detailed coding challenges with solution code, step-by-step explanations, and notes.
- 📥 **Export Resources**: Export study notes directly to PDF format or download learning progress reports as Excel datasheets.

### 💻 In-Browser Code Playground
- ⚡ **VS Code-Powered Monaco Editor**: Embedded editor with syntax highlighting, auto-formatting, themes, and line numbers.
- 🌐 **Multi-Language Execution**: Write and run code in Java, JavaScript, Python, C++, C, HTML/CSS, and SQL.
- 🔗 **Code Snippet Sharing**: Instantly generate public shareable links (`/share-code/[id]`) for peer reviews or showcase.

### 📊 Analytics & Gamification
- 🔥 **Streak Tracker**: Monitor consecutive daily coding activity to build consistent learning habits.
- 📉 **Activity Dashboard**: Comprehensive weekly metrics, completion breakdowns, and user activity history.
- 💡 **Personalized Recommendations**: Smart suggestions for next topics based on user progress and target skill level.

### 📜 Automated Certifications
- 🎓 **Course Completion Certificates**: Dynamic generation of verified completion certificates upon completing modules.
- 🔍 **Certificate Verification Modal**: Digital certificate validation system via unique `certificate_no` tracking.
- 📄 **High-Res PDF Export**: One-click PDF document generation for certificates and portfolio achievements.

### 💬 Student Helpdesk & Reviews
- 🎟️ **Support Ticket System**: Direct threaded Q&A communication between students and instructors.
- 📥 **Submission Evaluation**: Submit code solutions for grading, code review, and personalized feedback.
- 🔔 **Real-Time Notifications**: Unread badges and instant notifications for ticket replies.

### ⚡ Admin Portal & Management
- 🛠️ **Content Editor**: Full CRUD suite to add, reorder, update, or remove categories, topics, and problem sets.
- 👥 **User Administration**: Account permissions management (`View`, `Edit`, `Delete`) and registration approval.
- 📊 **Platform Analytics**: High-level platform statistics tracking active learners, completed topics, and system usage.

### 🔒 Security, Authentication & PWA
- 🛡️ **Role-Based Access Control (RBAC)**: Enforces strict permissions between standard users and platform administrators.
- 🔑 **OTP Email Verification**: Secure registration powered by 10-minute email verification codes.
- 📱 **Progressive Web App (PWA)**: Installable app experience with offline capability and service worker caching.

---

## 🛠️ Tools & Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white) | Fullstack React framework with App Router |
| **Frontend UI** | ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Dynamic UI components & custom glassmorphic styling |
| **Code Editor** | ![Monaco Editor](https://img.shields.io/badge/Monaco-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white) | In-browser VS Code editing engine |
| **Database** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) | PostgreSQL relational database & real-time client |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Production edge hosting & deployment |
| **PDF Generation** | ![jsPDF](https://img.shields.io/badge/jsPDF-red?style=flat-square) | Client-side export for notes & certificate documents |
| **Excel Export** | ![SheetJS](https://img.shields.io/badge/SheetJS_XLSX-green?style=flat-square) | Excel spreadsheet datasheet exports |
| **Email Service** | ![Nodemailer](https://img.shields.io/badge/Nodemailer-blue?style=flat-square) | SMTP email verification & OTP service |

---

## 📂 Project Structure

```
code-diary/
├── 📁 app/                      # Next.js App Router & API Endpoints
│   ├── 📁 [category]/[slug]/    # Dynamic curriculum topic & problem pages
│   ├── 📁 about/                # Platform info page
│   ├── 📁 admin/                # Admin management dashboard & tools
│   ├── 📁 api/                  # REST API routes (Auth, Admin, Topics, Users)
│   ├── 📁 code-editor/          # Monaco code editor playground
│   ├── 📁 enroll/               # Registration & OTP email verification
│   ├── 📁 login/                # Authentication page
│   ├── 📁 share-code/           # Public snippet view page
│   ├── 📁 todo/                 # Learning checklist & task manager
│   ├── 📁 verify/               # Certificate verification portal
│   ├── 📄 globals.css           # Global CSS styles & Tailwind imports
│   └── 📄 page.js               # Main Landing / Learning Dashboard
├── 📁 components/               # UI Components
│   ├── 📄 CertificateModal.js   # Interactive certificate viewer
│   ├── 📄 CertificatePreview.js # PDF layout previewer
│   ├── 📄 FloatingNav.js        # Dynamic floating header navigation
│   ├── 📄 Footer.js             # Application footer section
│   ├── 📄 LandingView.js        # Public landing view for guest visitors
│   ├── 📄 Layout.js             # Authenticated dashboard wrapper layout
│   ├── 📄 PWAContainer.js       # PWA offline worker & install prompts
│   └── 📄 Sidebar.js            # Category & topic navigation menu
├── 📁 lib/                      # Services & Helper Utilities
│   ├── 📄 api.js                # Frontend API client module
│   ├── 📄 cache.js              # In-memory response cache
│   ├── 📄 certificateExport.js  # Certificate PDF generator logic
│   ├── 📄 email.js              # SMTP Nodemailer configuration
│   ├── 📄 pdfExport.js          # Topic PDF notes generator
│   └── 📄 supabase.js           # Supabase client initialization
├── 📁 public/                   # Static assets & service worker scripts
├── 📄 supabase_schema.sql       # Database schema & initial setup SQL
├── 📄 tailwind.config.js        # Tailwind styling options
└── 📄 package.json              # Dependencies and scripts
```

---

## 🚀 Quick Start Guide

### 📋 Prerequisites

Ensure you have the following installed on your development machine:
- 🟢 **Node.js**: `v18.x` or higher
- 📦 **npm** / **yarn** / **pnpm**
- ⚡ A **Supabase** project instance (or PostgreSQL database)

---

### 💻 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rahul-github-18/Coding-Tracker.git
   cd coding-tracker
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

---

### ⚙️ Environment Configuration

Create a `.env.local` file in the project root folder and populate it with your environment parameters:

```env
# Supabase Database Settings
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# SMTP Credentials (Optional - For OTP Email Authentication)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM="Code Diary" <your-email@example.com>
```

---

### 🗄️ Database Setup

1. Navigate to your **Supabase Dashboard** and open the **SQL Editor**.
2. Open `supabase_schema.sql` from this repository, copy its contents, and execute the SQL query.
3. This script sets up all required database tables and relational constraints:
   - `users`, `otp_codes`, `todos`
   - `questions`, `code_examples`, `notes`
   - `user_tasks`, `user_queries`, `user_submissions`
   - `certificates`, `shared_codes`, `login_history`

---

### 🖥️ Running Development Server

Run the development server locally:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to test the platform.

For production builds:
```bash
npm run build
npm run start
```

---

## 🗺️ Application Routes

| Route | Icon | Description | Access Level |
| :--- | :---: | :--- | :--- |
| `/` | 🏠 | Main Dashboard displaying courses, progress & activity | Public / User |
| `/[category]/[slug]` | 📖 | Specific topic page with questions, code samples & notes | Public / User |
| `/code-editor` | 💻 | Multi-language Monaco code editor playground | Public / User |
| `/share-code` | 🔗 | Public code snippet view page | Public |
| `/login` | 🔑 | User login authentication | Guest |
| `/enroll` | 📝 | User registration & email OTP verification | Guest |
| `/todo` | ✅ | Student task checklist & topic progress tracker | Authenticated |
| `/admin` | 🛡️ | Instructor management portal for content & users | Admin |
| `/about` | ℹ️ | About Code Diary and platform mission | Public |

---

## 🗄️ Database Architecture

The application database is powered by Supabase (PostgreSQL) and consists of the following core models:

- 👤 **`users`**: Manages user profiles, role permissions (`admin` / `user`), login streaks, and activity dates.
- 🔢 **`otp_codes`**: Manages temporary 6-digit email verification codes.
- 📘 **`todos`**: Stores curriculum topics, categories, difficulties, and target completion times.
- ❓ **`questions`**: Topic problem sets containing explanations and solution code snippets.
- 💻 **`code_examples`**: Pre-configured code samples organized by language and subject.
- 📝 **`notes`**: Topic documentation and study notes.
- ✅ **`user_tasks`**: Individual student topic progress tracking (`Pending`, `In Progress`, `Completed`).
- 💬 **`user_queries`**: Helpdesk ticket records between students and admins.
- 📤 **`user_submissions`**: Student code submissions awaiting admin feedback.
- 📜 **`certificates`**: Issued course certificates with unique verification identifiers.
- 🔗 **`shared_codes`**: Public code snippet storage for shared links.
- 📊 **`login_history`**: Audit logs capturing user timestamps, IP addresses, and browsers.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for learners worldwide • Powered by <b>Code Diary</b></sub>
</div>
