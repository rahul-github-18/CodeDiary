import React from 'react';
import Link from 'next/link';
import FloatingNav from '@/components/FloatingNav';
import Footer from '@/components/Footer';
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
        'https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/',
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
      title: 'DSA Practice',
      desc: 'Handpicked Data Structures & Algorithms questions with detailed code solutions and complexity analysis.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Java & Spring Boot',
      desc: 'Core Java, OOP principles, Collections, REST APIs, and Spring Boot microservices patterns.',
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Programming Notes',
      desc: 'Rich Markdown note taking with code syntax highlighting for quick revision.',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 012.828 0L20.586 7.586a2 2 0 010 2.828L11.828 19H8v-3.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: 'Code Editor & Share Code',
      desc: 'Instant code execution preview and account-free code snippet sharing.',
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      title: 'Progress Tracking',
      desc: 'Visual analytics, streak counters, completed topic metrics, and daily activity.',
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Interview Preparation',
      desc: 'Targeted company problem patterns, frequency tags, and step-by-step hints.',
      icon: (
        <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const audience = [
    { title: 'Students', desc: 'Computer science & engineering students building solid fundamentals.' },
    { title: 'Developers', desc: 'Engineers refining system design, Core Java, and coding practices.' },
    { title: 'Job Seekers', desc: 'Candidates cracking technical coding interviews at top tech companies.' },
    { title: 'Professionals', desc: 'Developers looking for one central hub for notes and code snippets.' }
  ];

  const stats = [
    { number: '100+', label: 'Programming Topics' },
    { number: '500+', label: 'Interview Questions' },
    { number: '10+', label: 'Learning Categories' },
    { number: '24/7', label: 'Available Online' }
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
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              About <span className="text-sky-600">CodeDiary</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            CodeDiary is a modern developer workspace built for learning programming, 
            preparing for coding interviews, organizing technical notes, tracking daily progress, and 
            mastering software engineering concepts.
          </p>
        </section>

        {/* 2. Our Mission */}
        <section className="mb-20">
          <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-8 sm:p-12 backdrop-blur-sm relative overflow-hidden shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Our Mission
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              In the fast-evolving world of software development, learning programming can feel overwhelming. 
              Tutorials are scattered, practice questions lack context, and daily learning progress often gets lost.
            </p>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              CodeDiary was created to solve this exact challenge. Our mission is to provide developers with a single, 
              distraction-free environment where they can systematically practice Data Structures & Algorithms, write structured notes, 
              store reusable code snippets, track learning milestones, and ace technical interviews with confidence.
            </p>
          </div>
        </section>

        {/* 3. Statistics Section (Clean Light Background Matching Screenshot) */}
        <section className="mb-20">
          <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm backdrop-blur-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
              {stats.map((stat, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-4 lg:pt-0' : ''}>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sky-600 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Features (6 Cards Only) */}
        <section className="mb-20">
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
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                    {feature.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Who is it for? (4 Cards Only) */}
        <section className="mb-20">
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
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Vision */}
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-slate-200/90 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Long-Term Vision
            </h2>
            <p className="text-slate-600 text-base leading-relaxed font-normal">
              We envision CodeDiary as the definitive all-in-one developer workspace where every programmer can map their career 
              growth from writing their first "Hello World" in Java to building enterprise microservices and cracking top-tier 
              technical interviews.
            </p>
          </div>
        </section>

        {/* 7. Frequently Asked Questions (FAQ) */}
        <section className="mb-20">
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
                <p className="mt-4 text-slate-600 text-sm leading-relaxed border-t border-slate-200 pt-4 font-normal">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 8. Footer */}
        <Footer />

      </main>
    </div>
  );
}
