import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../../lib/api'

const AboutEditor: React.FC = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ 
    queryKey: ['admin', 'about'], 
    queryFn: () => api.getAbout() 
  })
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [gitHubUrl, setGitHubUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  useEffect(() => {
    if (data) {
      setTitle(data.title ?? '')
      setDescription(data.description ?? '')
      setLocation(data.location ?? '')
      setPhone(data.phone ?? '')
      setEmail(data.email ?? '')
      setLinkedInUrl(data.linkedInUrl ?? '')
      setGitHubUrl(data.gitHubUrl ?? '')
      setPortfolioUrl(data.portfolioUrl ?? '')
    }
  }, [data])

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.createAbout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about'] })
      queryClient.invalidateQueries({ queryKey: ['about'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => api.updateAbout(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about'] })
      queryClient.invalidateQueries({ queryKey: ['about'] })
    }
  })

  const handleSave = async () => {
    const payload = {
      title,
      description,
      location,
      phone: phone || null,
      email: email || null,
      linkedInUrl: linkedInUrl || null,
      gitHubUrl: gitHubUrl || null,
      portfolioUrl: portfolioUrl || null
    }

    if (data?.id) {
      await updateMutation.mutateAsync({ id: data.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

  const handleReset = () => {
    if (data) {
      setTitle(data.title ?? '')
      setDescription(data.description ?? '')
      setLocation(data.location ?? '')
      setPhone(data.phone ?? '')
      setEmail(data.email ?? '')
      setLinkedInUrl(data.linkedInUrl ?? '')
      setGitHubUrl(data.gitHubUrl ?? '')
      setPortfolioUrl(data.portfolioUrl ?? '')
    }
  }

  if (isLoading) return <div className="text-white/70">Loading...</div>

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">About Me Section</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
            placeholder="e.g., Full Stack .NET Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Description *</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
            rows={6}
            placeholder="Tell visitors about yourself, your experience, and what you do..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Location *</label>
          <input 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">LinkedIn URL</label>
          <input 
            value={linkedInUrl} 
            onChange={e => setLinkedInUrl(e.target.value)} 
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">GitHub URL</label>
          <input 
            value={gitHubUrl} 
            onChange={e => setGitHubUrl(e.target.value)} 
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Portfolio URL</label>
          <input 
            value={portfolioUrl} 
            onChange={e => setPortfolioUrl(e.target.value)} 
            className="w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white" 
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button 
          onClick={handleReset} 
          className="rounded-md border border-white/10 px-4 py-2 text-white/80 hover:bg-white/5"
          disabled={isSaving}
        >
          Reset
        </button>
        <button 
          onClick={handleSave} 
          className="hero-primary-btn"
          disabled={isSaving || !title || !description || !location}
        >
          {isSaving ? 'Saving...' : data?.id ? 'Update' : 'Create'}
        </button>
      </div>
      
      {(createMutation.isError || updateMutation.isError) && (
        <div className="mt-3 text-sm text-red-400">
          Error: {(createMutation.error as any)?.message || (updateMutation.error as any)?.message || 'Failed to save'}
        </div>
      )}
    </div>
  )
}

export default AboutEditor

