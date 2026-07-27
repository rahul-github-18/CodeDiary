import React from 'react';
import Link from 'next/link';
import FloatingNav from '@/components/FloatingNav';
import { getSiteUrl } from '@/lib/seo';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'About CodeDiary | Developer Workspace for Learning Programming & Interview Preparation',
  description: 'Learn about CodeDiary, a modern developer workspace for mastering Data Structures & Algorithms, Java, Spring Boot, SQL, coding interviews, programming notes, progress tracking, and code sharing.',
  keywords: [
    'CodeDiary',
    'developer workspace',
    'DSA',
    'Java',
    'Spring Boot',
    'SQL',
    'coding interview preparation',
    'programming notes',
    'coding tracker',
    'code snippets',
    'learning platform'
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About CodeDiary | Developer Workspace for Learning Programming & Interview Preparation',
    description: 'Learn about CodeDiary, a modern developer workspace for mastering Data Structures & Algorithms, Java, Spring Boot, SQL, coding interviews, programming notes, progress tracking, and code sharing.',
    url: `${siteUrl}/about`,
    siteName: 'CodeDiary',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/icon.png`,
        width: 1200,
        height: 630,
        alt: 'About CodeDiary Developer Workspace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About CodeDiary | Developer Workspace for Learning Programming & Interview Preparation',
    description: 'Learn about CodeDiary, a modern developer workspace for mastering Data Structures & Algorithms, Java, Spring Boot, SQL, coding interviews, programming notes, progress tracking, and code sharing.',
    images: [`${siteUrl}/icon.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'CodeDiary',
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      sameAs: [
        'https://linkedin.com',
        'https://github.com'
      ],
      description: 'CodeDiary is a developer workspace built for learning programming, preparing for coding interviews, organizing notes, and tracking daily progress.'
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'CodeDiary',
      publisher: {
        '@id': `${siteUrl}/#organization`
      }
    },
    {
      '@type': 'AboutPage',
      '@id': `${siteUrl}/about/#webpage`,
      url: `${siteUrl}/about`,
      name: 'About CodeDiary',
      isPartOf: {
        '@id': `${siteUrl}/#website`
      },
      about: {
        '@id': `${siteUrl}/#organization`
      },
      description: 'Learn about CodeDiary, a modern developer workspace for mastering Data Structures & Algorithms, Java, Spring Boot, SQL, coding interviews, programming notes, progress tracking, and code sharing.'
    }
  ]
};

export default function AboutPage() {
  const features = [
    {
      title: 'Structured Learning',
      desc: 'Step-by-step categorized roadmap covering fundamental and advanced programming topics.',
      icon: (
        <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'DSA Practice',
      desc: 'Handpicked Data Structures & Algorithms questions with detailed code solutions and complexity analysis.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Java Mastery',
      desc: 'Core Java, OOP principles, Collections framework, Multithreading, and Stream API patterns.',
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Spring Boot',
      desc: 'REST API design, Spring Security, Dependency Injection, JPA/Hibernate, and microservices architecture.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: 'SQL & Databases',
      desc: 'Relational database design, query optimization, indexing strategies, joins, and transaction management.',
      icon: (
        <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      title: 'Programming Notes',
      desc: 'Rich Markdown note taking with code syntax highlighting and searchable topics for quick revision.',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 012.828 0L20.586 7.586a2 2 0 010 2.828L11.828 19H8v-3.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: 'Code Snippets',
      desc: 'Save and format executable code snippets with instant preview and copy-to-clipboard functionality.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Progress Tracking',
      desc: 'Visual analytics, completed topics counters, streak tracking, and daily coding activity metrics.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Share Code',
      desc: 'Instantly share code snippets and solutions with peers without needing an account or login.',
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      title: 'Interview Prep',
      desc: 'Targeted interview questions with frequency tags, company problem patterns, and step-by-step hints.',
      icon: (
        <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Dark Mode',
      desc: 'Sleek, customizable themes for high-focus coding sessions day and night.',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    {
      title: 'Secure Authentication',
      desc: 'Role-based access control powered by Supabase with encrypted session management.',
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const audience = [
    { title: 'Students', desc: 'Computer science & engineering students building solid fundamentals.' },
    { title: 'Freshers', desc: 'Recent graduates preparing for technical campus hiring and online tests.' },
    { title: 'Software Engineers', desc: 'Working professionals refining system design and coding practices.' },
    { title: 'Java Developers', desc: 'Engineers specializing in Core Java, Spring Boot, and enterprise backend.' },
    { title: 'Full Stack Developers', desc: 'Developers mastering both frontend UI and backend services.' },
    { title: 'Backend Developers', desc: 'Engineers building scalable REST APIs, microservices, and databases.' },
    { title: 'Interview Candidates', desc: 'Job seekers cracking coding interviews at tech companies.' },
    { title: 'Competitive Programmers', desc: 'Coder enthusiasts solving algorithmic problems daily.' }
  ];

  const techStack = [
    { name: 'Next.js 14/15', category: 'Framework', desc: 'React App Router, Server Components & Metadata API' },
    { name: 'React', category: 'UI Library', desc: 'Declarative component architecture & responsive hooks' },
    { name: 'JavaScript (ES6+)', category: 'Language', desc: 'Modern asynchronous programming & logic' },
    { name: 'Supabase', category: 'Backend & DB', desc: 'PostgreSQL database, Authentication & Row Level Security' },
    { name: 'PWA', category: 'Platform', desc: 'Progressive Web App support with offline caching' }
  ];

  const faqs = [
    {
      q: 'What is CodeDiary?',
      a: 'CodeDiary is a developer workspace designed for organizing programming topics, practicing Data Structures & Algorithms, writing structured notes, saving code snippets, and tracking daily learning progress.'
    },
    {
      q: 'Is CodeDiary free to use?',
      a: 'Yes, CodeDiary offers free access to public programming resources, code snippets, and the code sharing tool without requiring payment.'
    },
    {
      q: 'Do I need an account to use CodeDiary?',
      a: 'No account is needed to browse public learning modules, read topics, or use the Share Code tool. An account is only required to save personal progress, track daily activity, and manage custom notes.'
    },
    {
      q: 'Can I use CodeDiary on mobile devices?',
      a: 'Yes! CodeDiary is fully responsive and built as a Progressive Web App (PWA), meaning you can install it on iOS and Android devices for a seamless native app experience.'
    },
    {
      q: 'What technologies and topics are covered in CodeDiary?',
      a: 'CodeDiary covers Data Structures & Algorithms (DSA), Java, Spring Boot, SQL & Databases, System Design, Object-Oriented Programming (OOP), Web Development, and interview preparation questions.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans select-none relative overflow-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Floating Header Navigation */}
      <FloatingNav />

      {/* Soft Ambient Background Elements (Matching App Light Theme) */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 relative z-10">
        
        {/* 1. Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-700 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Developer Workspace & Learning Hub</span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/light-logo.png" 
              alt="CodeDiary Logo" 
              className="w-14 h-14 rounded-2xl object-contain bg-white p-2 shadow-md border border-slate-300" 
            />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              About <span className="text-sky-600">CodeDiary</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8">
            CodeDiary is a modern developer workspace built for learning programming, 
            preparing for coding interviews, organizing technical notes, tracking daily progress, and 
            mastering software engineering concepts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login?mode=enroll"
              className="px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              href="/share-code"
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs transition-all"
            >
              Try Share Code
            </Link>
          </div>
        </section>

        {/* 2. Our Mission */}
        <section className="mb-24">
          <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-8 sm:p-12 backdrop-blur-sm relative overflow-hidden shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Our Mission
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              In the fast-evolving world of software development, learning programming can feel overwhelming. 
              Tutorials are scattered, practice questions lack context, and daily learning progress often gets lost.
            </p>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              CodeDiary was created to solve this exact challenge. Our mission is to provide developers with a single, 
              distraction-free environment where they can systematically practice Data Structures & Algorithms, write structured notes, 
              store reusable code snippets, track learning milestones, and ace technical interviews with confidence.
            </p>
          </div>
        </section>

        {/* 3. Features */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Powerful Features for Developers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to streamline your daily programming journey in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <article 
                key={idx}
                className="bg-white/90 border border-slate-200/90 hover:border-sky-400/60 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Who is it for? */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Who is CodeDiary for?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Tailored learning paths for developers at every stage of their career.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {audience.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/90 border border-slate-200/90 rounded-xl p-5 hover:border-sky-300 transition-colors shadow-xs"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Technology Stack */}
        <section className="mb-24">
          <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                Built with Modern Technology
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Architected for speed, responsiveness, and reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <span className="text-[11px] font-bold tracking-wider text-sky-600 uppercase mb-2">
                    {tech.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {tech.name}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {tech.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Vision */}
        <section className="mb-24 text-center max-w-3xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-slate-200/90 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Long-Term Vision
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              We envision CodeDiary as the definitive all-in-one developer workspace where every programmer can map their career 
              growth from writing their first "Hello World" in Java to building enterprise microservices and cracking top-tier 
              technical interviews.
            </p>
          </div>
        </section>

        {/* 7. Frequently Asked Questions (FAQ) */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Got questions? We have answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <details 
                key={idx} 
                className="group bg-white/90 border border-slate-200/90 rounded-2xl p-6 [&_summary::-webkit-details-marker]:none cursor-pointer transition-all duration-200 hover:border-sky-300 shadow-xs"
              >
                <summary className="flex items-center justify-between font-bold text-base text-slate-900">
                  <span>{faq.q}</span>
                  <span className="ml-4 transition-transform duration-200 group-open:rotate-180 text-sky-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-slate-600 text-sm leading-relaxed border-t border-slate-200 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 8. Footer */}
        <footer className="border-t border-slate-200/80 pt-12 pb-6 text-center text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6 font-semibold text-slate-600">
            <Link href="/login" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">About</Link>
            <Link href="/share-code" className="hover:text-slate-900 transition-colors">Share Code</Link>
            <Link href="/login?mode=login" className="hover:text-slate-900 transition-colors">Login</Link>
            <Link href="/login?mode=enroll" className="hover:text-slate-900 transition-colors">Enroll</Link>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors font-medium"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            <span>•</span>
            <a 
              href="mailto:support@kodediary.com" 
              className="text-slate-600 hover:text-sky-600 transition-colors font-medium"
            >
              Contact Email
            </a>
          </div>

          <p>
            Copyright © {new Date().getFullYear()} CodeDiary. All Rights Reserved.
          </p>
        </footer>

      </main>
    </div>
  );
}
