import React from 'react'
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
    <section id="skills" className="relative z-10 bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">Skills</h2>
          <p className="mt-2 text-sm text-white/70">Technologies and tools I work with.</p>
        </div>

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
