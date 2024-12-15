import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ProjectEditForm from './ProjectEditForm'
import ProjectAssignments from './ProjectAssignments'

// 案件の型定義
type Project = {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  location: string;
  duration: string;
  status: string;
}

// APIから案件データを取得する関数
async function getProject(id: string): Promise<Project | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch project');
    }

    const project = await response.json();
    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="flex h-[calc(100vh-64px)]">
            <Sidebar currentPath="/projects" />
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                  案件が見つかりませんでした。
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-screen pt-16">
        <Sidebar currentPath="/projects" />
        <main className="flex-1 ml-64">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Link 
                href="/projects"
                className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
              >
                ← 案件一覧に戻る
              </Link>
              <ProjectEditForm project={project} />
              <ProjectAssignments projectId={project.id} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 