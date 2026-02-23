import React from 'react'

export default function DocumentationSection() {
  return (
    <section id="documentation" className="relative z-10 bg-transparent py-16 px-6">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-display text-2xl font-semibold text-white mb-4">Documentation</h2>
        <p className="text-white/70 mb-6">Overview of technologies and libraries used in this portfolio.</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-5">
            <h3 className="text-white font-semibold mb-3">Frontend</h3>
            <ul className="text-white/70 list-disc pl-5 space-y-1">
              <li>React (v18+), TypeScript</li>
              <li>Vite (dev/build tooling)</li>
              <li>Tailwind CSS</li>
              <li>Three.js, @react-three/fiber, postprocessing</li>
              <li>@splinetool/react-spline (3D scene integration)</li>
              <li>GSAP (animations)</li>
              <li>@tanstack/react-query (data fetching & caching)</li>
              <li>Radix UI, Lucide icons</li>
              <li>WYSIWYG editor (react-simple-wysiwyg)</li>
            </ul>
          </div>

          <div className="bg-[rgba(255,255,255,0.02)] rounded-lg p-5">
            <h3 className="text-white font-semibold mb-3">Backend & Dev</h3>
            <ul className="text-white/70 list-disc pl-5 space-y-1">
              <li>.NET (ASP.NET Core) — C# Web API</li>
              <li>Entity Framework Core (Persistence & Migrations)</li>
              <li>CQRS-style commands/queries and validation</li>
              <li>Automated tests (unit/integration projects present)</li>
              <li>SMTP/email integration</li>
              <li>Build & CI: solution (.sln) with multiple projects</li>
            </ul>
          </div>
        </div>

        {/* Internal setup and configuration files exist in the backend; they are not public here. */}
      </div>
    </section>
  )
}
