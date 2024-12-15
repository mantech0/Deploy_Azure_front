import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ProjectNewForm from './ProjectNewForm'

export default function ProjectNewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-64px)]">
          <div className="w-64 flex-shrink-0">
            <Sidebar currentPath="/projects" />
          </div>
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-8">
              <div>
                <Link 
                  href="/projects"
                  className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
                >
                  ← 案件一覧に戻る
                </Link>
                <ProjectNewForm />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 