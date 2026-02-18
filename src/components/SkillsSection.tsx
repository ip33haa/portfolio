import { useState } from 'react'
import LogoLoop from './LogoLoop'

const SkillsSection: React.FC = () => {
  // Use all PNG files from public/tech-stacks — hardcoded list
  const localFiles = [
    'adobe.png',
    'Angular.png',
    'AWS.png',
    'Azure Devops.png',
    'Azure.png',
    'BitBucket.png',
    'Blender.png',
    'C.png',
    'CSS3.png',
    'cursor-ai.png',
    'Docker.png',
    'Figma.png',
    'GitHub.png',
    'githubcopilot.png',
    'HTML5.png',
    'Java.png',
    'JavaScript.png',
    'Microsoft SQL Server.png',
    'MySQL.png',
    'NET.png',
    'Node.js.png',
    'PHP.png',
    'Postman.png',
    'React.png',
    'Swagger.png',
    'Tailwind CSS.png',
    'Three.js.png',
    'TypeScript.png',
    'WordPress.png'
  ]

  const finalItems = localFiles.map((f) => ({
    src: `/tech-stacks/${encodeURI(f)}`,
    alt: f.replace(/\.[^.]+$/, ''),
    title: f.replace(/\.[^.]+$/, ''),
    file: f
  }))

  return (
    <section id="skills" className="relative z-10 bg-transparent min-h-screen snap-start flex items-center">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">Skills</h2>
          <p className="mt-2 text-sm text-white/70">Technologies and tools I work with.</p>
        </div>
        
        <ExperienceCards />

        <div>
          <LogoLoop
            logos={finalItems}
            speed={50}
            gap={80}
            logoHeight={104}
            pauseOnHover
            scaleOnHover
            className="w-full"
            renderItem={(item: any, key) => {
              const circleFiles = new Set([
                'AWS.png',
                'GitHub.png',
                'Microsoft SQL Server.png',
                'Three.js.png',
                'WordPress.png'
              ])
              const needsCircle = circleFiles.has(item.file)

              if (needsCircle) {
                return (
                  <div key={key} className="rounded-full bg-white p-3 inline-flex items-center justify-center">
                    <img src={item.src} alt={item.alt} title={item.title} className="h-20 w-auto object-contain" loading="lazy" decoding="async" />
                  </div>
                )
              }

              return (
                <img key={key} src={item.src} alt={item.alt} title={item.title} className="h-[var(--logoloop-logoHeight)] w-auto object-contain" loading="lazy" decoding="async" />
              )
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default SkillsSection

function ExperienceCards() {
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  const experiences = [
    {
      role: 'Lead .NET Developer',
      company: 'Offshore Business Processing',
      dates: 'Jan 2005 - Present',
      logo: '/project-logo/obp-logo 2.png',
      href: 'https://www.offshorebusinessprocessing.com/'
    },
    {
      role: '.NET Developer',
      company: 'Offshore Business Processing',
      dates: 'Dec 2023 - Jan 2025',
      logo: '/project-logo/obp-logo 2.png',
      href: 'https://www.offshorebusinessprocessing.com/'
    },
    {
      role: 'Front-end Developer',
      company: 'Medblast',
      dates: 'Jul 2023 - Oct 2023',
      logo: '/project-logo/MedBlast.png',
      href: 'https://medblast.com'
    },
    {
      role: 'UI/UX Designer',
      company: 'Medblast',
      dates: 'Jul 2023 - Oct 2023',
      logo: '/project-logo/MedBlast.png',
      href: 'https://medblast.com'
    },
    {
      role: 'Programming Analyst',
      company: 'Rockwell',
      dates: 'Apr 2023 - Jul 2023',
      logo: '/project-logo/rockwell.png',
      href: '#'
    },
    {
      role: 'Software Engineer',
      company: 'Norima Consulting Inc.',
      dates: 'Sept 2021 - Jul 2023',
      logo: '/project-logo/norima-logo.png',
      href: '#'
    }
  ]

  return (
    <div className="mt-12">
      <h3 className="font-display text-xl font-semibold text-white mb-6">Professional Experience</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => {
          const key = exp.company + exp.role
          const showImg = !failed[exp.logo]
          return (
            <a key={key} href={exp.href} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white/3 backdrop-blur-sm p-4 rounded-lg hover:scale-[1.01] transition-transform">
              <div className="flex-shrink-0">
                {showImg ? (
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    className="h-14 w-14 object-contain rounded-md bg-white/5 p-1"
                    onError={(_e) => setFailed((s) => ({ ...s, [exp.logo]: true }))}
                    loading="lazy"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-md bg-white/8 flex items-center justify-center text-sm font-semibold text-white/90">
                    {exp.company.split(' ').map((p) => p[0]).slice(0,2).join('')}
                  </div>
                )}
              </div>

              <div>
                <div className="text-white font-medium">{exp.role}</div>
                <div className="text-sm text-white/70">{exp.company} • {exp.dates}</div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
