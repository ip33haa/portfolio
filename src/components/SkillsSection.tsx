import { useState } from 'react'

const SkillsSection: React.FC = () => {
  const skills = [
    { name: 'Adobe', icon: '/tech-stacks/adobe.png' },
    { name: 'Angular', icon: '/tech-stacks/Angular.png' },
    { name: 'AWS', icon: '/tech-stacks/AWS.png' },
    { name: 'Azure', icon: '/tech-stacks/Azure.png' },
    { name: 'Bitbucket', icon: '/tech-stacks/BitBucket.png' },
    { name: 'Blender', icon: '/tech-stacks/Blender.png' },
    { name: 'C', icon: '/tech-stacks/C.png' },
    { name: 'CSS3', icon: '/tech-stacks/CSS3.png' },
    { name: 'Cursor AI', icon: '/tech-stacks/cursor-ai.png' },
    { name: 'Docker', icon: '/tech-stacks/Docker.png' },
    { name: 'Figma', icon: '/tech-stacks/Figma.png' },
    { name: 'GitHub', icon: '/tech-stacks/GitHub.png' },
    { name: 'GitHub Copilot', icon: '/tech-stacks/githubcopilot.png' },
    { name: 'HTML5', icon: '/tech-stacks/HTML5.png' },
    { name: 'Java', icon: '/tech-stacks/Java.png' },
    { name: 'JavaScript', icon: '/tech-stacks/JavaScript.png' },
    { name: 'Microsoft SQL Server', icon: '/tech-stacks/Microsoft SQL Server.png' },
    { name: 'MySQL', icon: '/tech-stacks/MySQL.png' },
    { name: '.NET', icon: '/tech-stacks/NET.png' },
    { name: 'Node.js', icon: '/tech-stacks/Node.js.png' },
    { name: 'PHP', icon: '/tech-stacks/PHP.png' },
    { name: 'Postman', icon: '/tech-stacks/Postman.png' },
    { name: 'React', icon: '/tech-stacks/React.png' },
    { name: 'Swagger', icon: '/tech-stacks/Swagger.png' },
    { name: 'Tailwind CSS', icon: '/tech-stacks/Tailwind CSS.png' },
    { name: 'Three.js', icon: '/tech-stacks/Three.js.png' },
    { name: 'TypeScript', icon: '/tech-stacks/TypeScript.png' },
    { name: 'WordPress', icon: '/tech-stacks/WordPress.png' },
    { name: 'Claude AI', icon: 'https://static.vecteezy.com/system/resources/previews/067/941/712/non_2x/claude-ai-logo-rounded-hd-free-png.png' }
  ]

  return (
    <section id="skills" className="relative z-10 bg-transparent min-h-screen snap-start flex items-center">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">Skills</h2>
          <p className="mt-2 text-sm text-white/70">Technologies and tools I work with.</p>
        </div>
        
        <ExperienceCards />

        <div className="mt-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="group rounded-lg border border-white/10 bg-white/5 p-3 text-center transition hover:border-cyan-300/60 hover:bg-white/15"
                title={skill.name}
              >
                {skill.icon ? (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="mx-auto h-14 w-14 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-white/20 text-xs text-white/80">N/A</div>
                )}
                <div className="mt-2 text-xs font-semibold text-white/80">
                  {skill.name}
                </div>
                <div className="mt-1 text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {skill.name} is a core tool
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm text-indigo-100 font-mono">
            <code>const aiAssistants = ['GitHub Copilot', 'Claude AI', 'Cursor AI']</code>
          </div>
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
      dates: 'Jan 2023 - Present',
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
