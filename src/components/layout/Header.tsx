import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">SkillNow</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/projects" className="px-3 py-2 hover:text-blue-600">案件一覧</Link>
            <Link href="/projects/new" className="px-3 py-2 hover:text-blue-600">案件登録</Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 