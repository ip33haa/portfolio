// React import not required with JSX transform
import DocumentationSection from '../components/DocumentationSection'

export default function DocumentationPage() {
  return (
    <main className="relative min-h-screen py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <DocumentationSection />
      </div>
    </main>
  )
}
