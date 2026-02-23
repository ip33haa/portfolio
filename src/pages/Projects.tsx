import React from 'react'
import * as api from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import ChromaGrid from '../components/ChromaGrid'

export default function ProjectsPage() {
  const { data: projectsRaw } = useQuery({ queryKey: ['projects'], queryFn: () => api.getProjects(), staleTime: 1000 * 60 * 2, retry: 1 })
  const projects = (projectsRaw?.data ?? projectsRaw) || []

  const items = projects.map((p: any, i: number) => {
    const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
    const rawStack = p.technologiesUsed ?? p.TechnologiesUsed ?? p.stack ?? p.technologies ?? p.tech
    let stackArr: string[] = []
    if (Array.isArray(rawStack)) stackArr = rawStack.map((s: any) => String(s).trim())
    else if (typeof rawStack === 'string') stackArr = rawStack.split(/[,;]\s*/).map(s => s.trim()).filter(Boolean)

    return {
      image: p.imageUrl ?? '/Media.jpg',
      title: p.title ?? 'Untitled',
      subtitle: (p.description ?? '').slice(0, 140),
      stack: stackArr,
      handle: p.handle ?? '',
      borderColor: palette[i % palette.length],
      gradient: `linear-gradient(145deg, ${palette[i % palette.length]}, #000)`,
      url: p.projectUrl ?? p.ProjectUrl
    }
  })

  return (
    <main className="relative min-h-screen py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">Projects</h2>
          <p className="mt-2 text-sm text-white/70">A visual showcase of selected projects.</p>
        </div>

        <div className="mt-6 w-full">
          <ChromaGrid items={items} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
        </div>
      </div>
    </main>
  )
}
