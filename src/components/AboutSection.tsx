import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as api from '../lib/api'

const AboutSection: React.FC = () => {
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['about'], 
    queryFn: () => api.getAbout(),
    staleTime: 1000 * 60 * 5
  })

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    contact: false,
    social: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (isLoading) {
    return (
      <section id="about" className="mt-0 bg-transparent min-h-screen snap-start flex items-center relative">
        <div className="mx-auto relative z-10 w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-16">
          <div className="animate-pulse text-white/70 text-center">Loading about information...</div>
        </div>
      </section>
    )
  }

  if (error || !data) {
    return null
  }

  const about = data?.data ?? data

  return (
    <section id="about" className="mt-0 bg-transparent min-h-screen snap-start flex items-center relative">
      <div className="mx-auto relative z-10 w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Swagger-like Header */}
        <div className="mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
            About Me
          </h2>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded font-mono text-xs">GET</span>
            <span className="font-mono">/api/about</span>
          </div>
        </div>

        {/* Swagger-style API Documentation Container */}
        <div className="swagger-container bg-[#1a1a1a] rounded-lg border border-white/10 shadow-2xl overflow-hidden">
          
          {/* General Information Section */}
          <div className="border-b border-white/10">
            <button
              onClick={() => toggleSection('general')}
              className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{expandedSections.general ? '▼' : '▶'}</span>
                <h3 className="text-lg sm:text-xl font-semibold text-white">General Information</h3>
              </div>
              <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                200 OK
              </div>
            </button>
            
            {expandedSections.general && (
              <div className="p-4 sm:p-6 pt-0 bg-[#0d0d0d]">
                <div className="space-y-4 font-mono text-sm">
                  <div className="swagger-response">
                    <div className="swagger-field">
                      <span className="text-purple-400">"title"</span>
                      <span className="text-white/40">:</span>
                      <span className="text-green-300 ml-2">"{about.title}"</span>
                    </div>
                    <div className="swagger-field">
                      <span className="text-purple-400">"description"</span>
                      <span className="text-white/40">:</span>
                      <span className="text-green-300 ml-2">"{about.description}"</span>
                    </div>
                    <div className="swagger-field">
                      <span className="text-purple-400">"location"</span>
                      <span className="text-white/40">:</span>
                      <span className="text-green-300 ml-2">"{about.location}"</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          {(about.phone || about.email) && (
            <div className="border-b border-white/10">
              <button
                onClick={() => toggleSection('contact')}
                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{expandedSections.contact ? '▼' : '▶'}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Contact Details</h3>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                  200 OK
                </div>
              </button>
              
              {expandedSections.contact && (
                <div className="p-4 sm:p-6 pt-0 bg-[#0d0d0d]">
                  <div className="space-y-4 font-mono text-sm">
                    <div className="swagger-response">
                      {about.email && (
                        <div className="swagger-field">
                          <span className="text-purple-400">"email"</span>
                          <span className="text-white/40">:</span>
                          <a 
                            href={`mailto:${about.email}`}
                            className="text-cyan-400 ml-2 hover:underline"
                          >
                            "{about.email}"
                          </a>
                        </div>
                      )}
                      {about.phone && (
                        <div className="swagger-field">
                          <span className="text-purple-400">"phone"</span>
                          <span className="text-white/40">:</span>
                          <a 
                            href={`tel:${about.phone}`}
                            className="text-cyan-400 ml-2 hover:underline"
                          >
                            "{about.phone}"
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Links Section */}
          {(about.linkedInUrl || about.gitHubUrl || about.portfolioUrl) && (
            <div>
              <button
                onClick={() => toggleSection('social')}
                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{expandedSections.social ? '▼' : '▶'}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Social Links</h3>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                  200 OK
                </div>
              </button>
              
              {expandedSections.social && (
                <div className="p-4 sm:p-6 pt-0 bg-[#0d0d0d]">
                  <div className="space-y-4 font-mono text-sm">
                    <div className="swagger-response">
                      {about.linkedInUrl && (
                        <div className="swagger-field">
                          <span className="text-purple-400">"linkedInUrl"</span>
                          <span className="text-white/40">:</span>
                          <a 
                            href={about.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 ml-2 hover:underline"
                          >
                            "{about.linkedInUrl}"
                          </a>
                        </div>
                      )}
                      {about.gitHubUrl && (
                        <div className="swagger-field">
                          <span className="text-purple-400">"gitHubUrl"</span>
                          <span className="text-white/40">:</span>
                          <a 
                            href={about.gitHubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 ml-2 hover:underline"
                          >
                            "{about.gitHubUrl}"
                          </a>
                        </div>
                      )}
                      {about.portfolioUrl && (
                        <div className="swagger-field">
                          <span className="text-purple-400">"portfolioUrl"</span>
                          <span className="text-white/40">:</span>
                          <a 
                            href={about.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 ml-2 hover:underline"
                          >
                            "{about.portfolioUrl}"
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-white/40 font-mono">
          Response time: ~32ms | Schema: AboutDto
        </div>
      </div>
    </section>
  )
}

export default AboutSection
