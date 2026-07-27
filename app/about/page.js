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
  const premiumFeatures = [
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
      title: 'Code Editor / Share Code',
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

  const stats = [
    { number: '100+', label: 'Programming Topics' },
    { number: '500+', label: 'Interview Questions' },
    { number: '10+', label: 'Learning Categories' },
    { number: '24/7', label: 'Available Online' }
  ];

  const audience = [
    { title: 'Students', desc: 'Computer science & engineering students building solid fundamentals.' },
    { title: 'Developers', desc: 'Engineers refining system design, Core Java, and coding practices.' },
    { title: 'Job Seekers', desc: 'Candidates cracking technical coding interviews at top tech companies.' },
    { title: 'Professionals', desc: 'Developers looking for one central hub for notes and code snippets.' }
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

      {/* Soft Ambient Background Elements */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 relative z-10">
        
        {/* 1. SaaS Hero Section */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero Left Content */}
            <div className="flex-1 text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700 mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span>Developer Workspace & Learning Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
                Your Personal <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">Developer Workspace</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8">
                Organize programming topics, practice Data Structures & Algorithms, write structured notes, and track your daily learning progress—all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/login?mode=enroll"
                  className="px-6 py-3.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Get Started
                </Link>
                <Link
                  href="/share-code"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs transition-all cursor-pointer"
                >
                  Share Code
                </Link>
              </div>
            </div>

            {/* Hero Right Product Mockup */}
            <div className="flex-1 w-full relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/20 to-indigo-400/20 rounded-3xl blur-xl pointer-events-none" />
              <div className="relative rounded-2xl border border-slate-300/80 bg-white p-2 shadow-2xl shadow-slate-400/30 overflow-hidden">
                <img 
                  src="/dashboard-mockup.png" 
                  alt="CodeDiary Workspace Dashboard Mockup" 
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full h-[1px] bg-slate-200/80 my-16" />

        {/* 2. Compact Mission Section */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-white/90 border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Our Mission
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4 font-normal">
                Learning software engineering can feel fragmented. Tutorials are scattered, code snippets get lost, and daily progress goes untracked.
              </p>
              <p className="text-slate-600 text-base leading-relaxed font-normal">
                CodeDiary provides developers with a single, distraction-free environment to systematically master programming concepts, write notes, and prepare for interviews with clarity.
              </p>
            </div>
            
            <div className="w-full lg:w-72 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-xs font-bold text-slate-800">Distraction-Free Workspace</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-xs font-bold text-slate-800">Structured Roadmap</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-xs font-bold text-slate-800">Real-Time Progress Tracking</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 6 Premium Features Grid */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Built for Modern Developers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Six core capabilities designed to accelerate your programming mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, idx) => (
              <article 
                key={idx}
                className="bg-white/90 border border-slate-200/90 hover:border-sky-400/80 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full h-[1px] bg-slate-200/80 my-16" />

        {/* 4. Product Showcase: "See CodeDiary in Action" */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              See CodeDiary in Action
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore how CodeDiary streamlines curriculum tracking, code sharing, and interview prep.
            </p>
          </div>

          <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left">
                <div className="w-3 h-3 rounded-full bg-sky-500 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Curriculum & Topics</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Categorized topics from Java OOP to Spring Boot REST APIs with completion status.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Code Snippets & Sharing</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Save syntax-highlighted code snippets and share them instantly with peers.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Progress Analytics</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Track daily activity streaks, completed questions, and learning velocity.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <img 
                src="/dashboard-mockup.png" 
                alt="CodeDiary Product Showcase" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* 5. Why CodeDiary (Split Layout) */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/90 border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm">
            {/* Left Column: Code Preview Card */}
            <div className="flex-1 w-full bg-slate-900 text-slate-100 rounded-2xl p-6 font-mono text-xs shadow-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-[11px] font-sans">UserService.java</span>
              </div>
              <p className="text-emerald-400 font-semibold mb-1">// CodeDiary Java Spring Boot Snippet</p>
              <p className="text-sky-300 mb-1">@RestController</p>
              <p className="text-sky-300 mb-1">@RequestMapping("/api/workspace")</p>
              <p className="text-purple-300">public class <span className="text-amber-300">WorkspaceController</span> &#123;</p>
              <p className="pl-4 text-slate-300">@GetMapping("/progress")</p>
              <p className="pl-4 text-slate-300">public ResponseEntity&lt;Progress&gt; getDailyProgress() &#123;</p>
              <p className="pl-8 text-slate-400">return ResponseEntity.ok(workspace.getStats());</p>
              <p className="pl-4 text-slate-300">&#125;</p>
              <p className="text-purple-300">&#125;</p>
            </div>

            {/* Right Column: Checkmark Bullets */}
            <div className="flex-1 text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Why Choose CodeDiary?
              </h2>

              <ul className="space-y-4">
                {[
                  'Organized learning paths for DSA and Java',
                  'Daily progress tracking & streak metrics',
                  'Targeted technical interview preparation',
                  'Reusable code snippets & instant sharing',
                  'One unified workspace for everything'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium text-sm sm:text-base">
                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Compact Statistics Bar */}
        <section className="mb-24">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 sm:p-10 shadow-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              {stats.map((stat, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-6 lg:pt-0' : ''}>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Who is CodeDiary For? (4 Elegant Cards) */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Who is CodeDiary For?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Tailored for ambitious developers at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audience.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/90 border border-slate-200/90 rounded-2xl p-6 hover:border-sky-400 transition-all shadow-xs"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Modern FAQ Accordion (4 essential FAQs) */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
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

        {/* 9. Final CTA Section */}
        <section className="mb-20 text-center max-w-4xl mx-auto">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-sky-600 via-indigo-600 to-slate-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-sky-100 text-base sm:text-lg mb-8 max-w-xl mx-auto font-normal">
              Join CodeDiary and organize your learning in one structured developer workspace.
            </p>
            <Link
              href="/login?mode=enroll"
              className="inline-block px-8 py-4 rounded-full bg-white text-sky-600 hover:bg-slate-100 font-extrabold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        {/* 10. Clean Footer */}
        <footer className="border-t border-slate-200/80 pt-8 pb-6 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              Copyright © {new Date().getFullYear()} CodeDiary. All Rights Reserved.
            </p>
            <a 
              href="https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-sky-600 transition-colors font-medium"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
}
