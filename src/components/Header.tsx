import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black text-white h-16 fixed top-0 left-0 right-0 z-50">
      <div className="h-full flex items-center px-6">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-bold hover:text-gray-300 transition-colors">SkillNow</h1>
        </Link>
      </div>
    </header>
  )
} 