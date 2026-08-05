# Code Diary

A comprehensive, full-stack learning management platform, code editor playground, and curriculum tracker designed for students and educators. Built with Next.js 14, React 18, Supabase (PostgreSQL), and Tailwind CSS.

## Overview

Code Diary is designed to streamline coding education by combining curriculum topic tracking, in-browser code execution, interactive problem sets, note-taking, student progress analytics, automated certificate generation, and an instructor management portal into a unified Web and Progressive Web App (PWA).

---

## Key Features

### Learning Management & Curriculum Tracking
- **Structured Categories**: Browse learning modules categorized by subject (Data Structures, Algorithms, Web Development, SQL, etc.).
- **Topic Progress Tracking**: Track completed topics, view progress percentages, and estimate completion times for each module.
- **Problem Sets & Solutions**: Access detailed questions with code solutions, step-by-step explanations, and downloadable study notes.
- **Resource Exports**: Export notes and curriculum guides directly to PDF format or download data reports as Excel datasheets.

### In-Browser Code Playground & Snippet Sharing
- **Monaco Editor Integration**: Embedded VS Code-powered editor supporting syntax highlighting, theme switching, and auto-formatting.
- **Multi-Language Support**: Write and test code in Java, JavaScript, Python, C++, C, HTML/CSS, and SQL.
- **Code Sharing**: Generate unique public links for code snippets (`/share-code/[id]`) to share code with peers or instructors.

### Student Analytics & Gamification
- **Streak Tracker**: Tracks daily consecutive user logins and activity.
- **Activity Dashboard**: Displays weekly activity metrics and completion percentages.
- **Personalized Recommendations**: Suggests next topics to study based on completed modules and difficulty levels.

### Certification & Verification
- **Course Certificates**: Automatically generates completion certificates upon module completion.
- **Certificate Verification Modal**: Allows digital verification of certificate IDs (`certificate_no`).
- **PDF Export**: Download high-resolution completion certificates as PDF documents.

### Student Helpdesk & Code Reviews
- **Query Ticket System**: Students can send direct questions to admins and receive threaded responses.
- **Code Submission & Evaluation**: Students submit code answers for instructor evaluation and feedback.
- **Notification System**: Real-time unread badges for admin replies and updates.

### Admin Management Portal
- **Content Management**: Create, update, reorder, and delete categories, topics, questions, code examples, and notes.
- **User Account Administration**: Review user accounts, configure role permissions (View, Edit, Delete), and approve registration requests.
- **Ticketing & Code Review Console**: Manage student inquiries and code submissions in real time.
- **Platform Analytics**: Monitor overall platform metrics, total registered users, completed topics, and active notes.

### Security, Auth & PWA Support
- **Role-Based Access Control (RBAC)**: Enforced roles (`admin` vs `user`) with fine-grained capability checks.
- **Email Verification**: User registration with 10-minute OTP verification via Nodemailer SMTP.
- **Progressive Web App (PWA)**: Installable application support with service worker caching for offline access.

---

## Tech Stack

| Component | Technology | Description |
| --- | --- | --- |
| **Framework** | Next.js 14 (App Router) | Server and Client Side Rendering |
| **Frontend UI** | React 18 & Tailwind CSS | Dynamic component UI with custom styling |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) | In-browser code editing environment |
| **Database** | Supabase (PostgreSQL) | Managed PostgreSQL relational database |
| **PDF Export** | jsPDF | Client-side PDF generation for notes & certificates |
| **Excel Export** | SheetJS (XLSX) | Datasheet spreadsheet export capabilities |
| **Email Service** | Nodemailer | SMTP email delivery for OTP verification |
| **HTTP Client** | Axios | API requests and asynchronous data fetching |

---

## Project Structure

```
coding-tracker/
├── app/                      # Next.js App Router routes & pages
│   ├── [category]/[slug]/    # Dynamic topic & problem view pages
│   ├── about/                # About page
│   ├── admin/                # Admin portal layout and management views
│   ├── api/                  # API endpoints (Auth, Admin, User, Topics, Questions)
│   ├── code-editor/          # Code playground view
│   ├── enroll/               # Registration & OTP verification page
│   ├── login/                # User login page
│   ├── share-code/           # Shared code snippet viewer
│   ├── todo/                 # Task and topic checklist view
│   ├── verify/               # Certificate verification view
│   ├── globals.css           # Global stylesheet & Tailwind directives
│   └── page.js               # Main Dashboard / Landing View
├── components/               # Reusable UI Components
│   ├── CertificateModal.js   # Certificate modal & PDF view
│   ├── CertificatePreview.js # Certificate render preview
│   ├── FloatingNav.js        # Dynamic floating navigation menu
│   ├── Footer.js             # Application footer
│   ├── LandingView.js        # Hero landing page for guest users
│   ├── Layout.js             # Main dashboard layout wrapper with navigation
│   ├── PWAContainer.js       # PWA service worker container & prompt
│   └── Sidebar.js            # Category navigation sidebar
├── lib/                      # Helper modules & backend services
│   ├── api.js                # Frontend API client service calls
│   ├── cache.js              # In-memory API cache helper
│   ├── certificateExport.js  # Certificate generation logic
│   ├── certificateStore.js   # Client certificate persistence
│   ├── email.js              # Nodemailer transport configuration
│   ├── pdfExport.js          # jsPDF topic document generator
│   ├── seo.js                # Dynamic meta tags & SEO helper
│   ├── slug.js               # URL slug parsing & generator
│   └── supabase.js           # Supabase client initializer
├── public/                   # Static assets & PWA manifest/service worker
│   └── sw.js                 # Service worker script
├── package.json              # Project dependencies & scripts
├── supabase_schema.sql       # Database table definitions & seed data
└── tailwind.config.js        # Tailwind CSS configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js**: `v18.x` or higher
- **npm** or **yarn**
- A **Supabase** project instance (or PostgreSQL database)

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd coding-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

### Environment Configuration

Create a `.env.local` file in the project root directory and supply your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# SMTP Configuration (Optional - for Email OTP Verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Code Diary" <your-email@gmail.com>
```

---

### Database Setup

1. Log into your **Supabase Dashboard** and open the **SQL Editor**.
2. Copy the contents of `supabase_schema.sql` and execute the query.
3. This migration script will create the following tables and seed default users:
   - `users` & `otp_codes`
   - `todos` (Curriculum Topics)
   - `questions`, `code_examples`, and `notes`
   - `user_tasks`, `user_queries`, and `user_submissions`
   - `shared_codes`
   - `login_history`
   - `certificates`

---

### Running Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to view the application.

To test building for production:

```bash
npm run build
npm run start
```

---

## Application Architecture & Routes

| Route Path | Description | Access Level |
| --- | --- | --- |
| `/` | Main dashboard displaying courses, progress, and analytics | Public / Authenticated |
| `/[category]/[slug]` | Detailed topic page with questions, notes, and code samples | Public / Authenticated |
| `/code-editor` | Interactive Monaco code editor playground | Public / Authenticated |
| `/share-code` | Shared code snippet view | Public |
| `/login` | User authentication page | Guest |
| `/enroll` | User signup and email OTP verification page | Guest |
| `/todo` | Student task & topic checklist page | Authenticated |
| `/admin` | Administration portal for content & user management | Admin |
| `/about` | About page detailing platform objectives | Public |

---

## Database Schema

The core database tables managed by Supabase include:

- **`users`**: User profile, credentials, role (`admin` / `user`), permissions (`can_view`, `can_edit`, `can_delete`), streak counter, and last activity date.
- **`otp_codes`**: Temporary 6-digit email verification codes with expiration timestamps.
- **`todos`**: Curriculum topics containing metadata (category, difficulty, estimated time, sort order).
- **`questions`**: Topic problem sets with descriptions, answer solutions, sample code, and explanations.
- **`code_examples`**: Code snippets organized by programming language and topic.
- **`notes`**: Topic-specific textual guides and documentation.
- **`user_tasks`**: Tracks individual user progress per topic (Status: Pending, In Progress, Completed).
- **`user_queries`**: Helpdesk ticket records between users and admins.
- **`user_submissions`**: Student code submissions for admin review.
- **`certificates`**: Issued course completion certificates with unique certificate numbers.
- **`shared_codes`**: Snippet repository for public code sharing.
- **`login_history`**: Audit logs capturing user login timestamps, IP addresses, and user agents.

---
