import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black text-white p-4">
      <Link href="/" className="inline-block">
        <h1 className="text-2xl font-bold hover:text-gray-300 transition-colors">SkillNow</h1>
      </Link>
    </header>
  )
} 