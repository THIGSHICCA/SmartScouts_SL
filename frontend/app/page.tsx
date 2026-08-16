import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero (slate-900, same as footer) ─────────────────────── */}
      <div className="relative bg-slate-900 flex flex-col items-center text-center px-4 pt-16 pb-24">
        {/* Subtle decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-white/3" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-yellow-300/5" />
        </div>

        {/* Logo */}
        <div className="relative z-10 w-40 h-40 mb-6">
          <img src="/images/logo.png" alt="Smart Scouts SL Logo" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>

        {/* Label */}
        <span className="relative z-10 text-slate-400 font-black text-xs uppercase tracking-[0.35em] mb-3">
          Based on Srilankan Scout Syllabus
        </span>

        {/* Title */}
        <h1 className="relative z-10 text-5xl md:text-7xl font-black text-white tracking-tight mb-5 leading-tight">
          Smart Scouts SL
        </h1>

        {/* Tagline */}
        <p className="relative z-10 max-w-xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-medium">
          The digital platform for scouts and leaders to track progress,
          earn badges, and manage the scouting journey — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link href="/register">
            <button className="w-full sm:w-auto h-14 px-10 text-lg font-black bg-white text-slate-900 rounded-2xl shadow-xl hover:bg-slate-100 hover:-translate-y-1 transition-all duration-200">
              Start Your Journey
            </button>
          </Link>
          <Link href="/login">
            <button className="w-full sm:w-auto h-14 px-10 text-lg font-black border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-200">
              Existing Member Login
            </button>
          </Link>
        </div>

        <p className="relative z-10 text-slate-500 text-xs font-semibold uppercase tracking-widest">
          2022 Curriculum · Trilingual (EN / தமிழ் / සිං)
        </p>
      </div>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-green-600 mb-3">
            Platform Features
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-black text-slate-900 mb-12">
            Everything a Scout Needs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📒',
                title: 'Digital Record Book',
                desc: '5 award levels with 97 tasks. Submit, track, and get verified by your Patrol Leader and Scout Leader.',
                color: 'bg-emerald-50 border-emerald-100',
                accent: 'text-emerald-700',
              },
              {
                icon: '🏅',
                title: '130 Proficiency Badges',
                desc: 'Browse all 14 skill groups and upload examiner-signed certificates for each badge you earn.',
                color: 'bg-blue-50 border-blue-100',
                accent: 'text-blue-700',
              },
              {
                icon: '✅',
                title: 'Real-time Verification',
                desc: 'Structured approval workflow: Scout → Patrol Leader → Scout Leader, all digitally recorded.',
                color: 'bg-purple-50 border-purple-100',
                accent: 'text-purple-700',
              },
              {
                icon: '🤖',
                title: 'Scout Assistant',
                desc: 'Ask anything about badge requirements or the Sri Lanka Scout syllabus. Available in EN, Tamil & Sinhala.',
                color: 'bg-amber-50 border-amber-100',
                accent: 'text-amber-700',
              },
              {
                icon: '👥',
                title: 'Troop Management',
                desc: 'Scout Leaders can manage their troop, review member progress, and sign off on achievements.',
                color: 'bg-red-50 border-red-100',
                accent: 'text-red-700',
              },
              {
                icon: '🌐',
                title: 'Trilingual Support',
                desc: 'All tasks and badge requirements in English, Tamil, and Sinhala to support every scout.',
                color: 'bg-teal-50 border-teal-100',
                accent: 'text-teal-700',
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`p-6 rounded-2xl border-2 ${f.color} hover:-translate-y-1 transition-all duration-200`}
              >
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className={`font-black text-lg mb-2 ${f.accent}`}>{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="mt-auto bg-slate-900 text-white px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/images/logo.png" alt="" className="w-8 h-8 object-contain opacity-80" />
          <span className="font-black text-lg">Smart Scouts SL</span>
        </div>
        <p className="text-slate-400 text-sm">
          Based on Srilankan Scout Syllabus · Digital Platform · 2022 Curriculum
        </p>
      </footer>

    </div>
  );
}
