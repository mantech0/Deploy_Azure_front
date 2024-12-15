import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

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

// 担当者の型定義
type Assignment = {
  id: number;
  project_id: number;
  user_id: number;
  assigned_date: string;
  status: string;
  user?: {
    name: string;
    prefecture: string;
  };
}

// 検索パラメータの型定義
type SearchParams = {
  q?: string;
  location?: string;
  status?: string;
}

// APIから案件データを取得する関数
async function getProjects(): Promise<Project[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/projects`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// APIから担当者データを取得する関数
async function getProjectAssignments(projectId: number): Promise<Assignment[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/projects/${projectId}/assignments`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }

    const assignments = await response.json();
    return assignments;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
}

// 検索結果をフィルタリングする関数
function filterProjects(projects: Project[], params: SearchParams): Project[] {
  return projects.filter(project => {
    // フリーワード検索（タイトル、説明文、必要スキル）
    if (params.q) {
      const searchTerm = params.q.toLowerCase();
      const searchTarget = `${project.title} ${project.description} ${project.required_skills.join(' ')}`.toLowerCase();
      if (!searchTarget.includes(searchTerm)) {
        return false;
      }
    }

    // 場所での絞込み
    if (params.location && params.location !== 'all') {
      if (project.location !== params.location) {
        return false;
      }
    }

    // ステータスでの絞り込み
    if (params.status && params.status !== 'all') {
      if (project.status !== params.status) {
        return false;
      }
    }

    return true;
  });
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const projects = await getProjects();
  const filteredProjects = filterProjects(projects, searchParams);
  const locations = Array.from(new Set(projects.map(project => project.location))).sort();

  // 各プロジェクトの担当者情報を取得
  const projectsWithAssignments = await Promise.all(
    filteredProjects.map(async (project) => {
      const assignments = await getProjectAssignments(project.id);
      return { ...project, assignments };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-screen pt-16">
        <Sidebar currentPath="/projects" />
        <main className="flex-1 ml-64">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">案件一覧</h2>
              <Link 
                href="/projects/new" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                新規案件登録
              </Link>
            </div>

            {/* 検索フォーム */}
            <form className="mb-12">
              <div className="space-y-4">
                {/* フリーワード検索 */}
                <div>
                  <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
                    フリーワード検索
                  </label>
                  <input
                    type="text"
                    id="q"
                    name="q"
                    defaultValue={searchParams.q}
                    placeholder="タイトル、説明文、必要スキルなど"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 場所での絞り込み */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      場所で絞り込み
                    </label>
                    <select
                      id="location"
                      name="location"
                      defaultValue={searchParams.location || 'all'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">すべての場所</option>
                      {locations.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ステータスでの絞り込み */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      ステータスで絞り込み
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={searchParams.status || 'all'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">すべてのステータス</option>
                      <option value="募集中">募集中</option>
                      <option value="募集終了">募集終了</option>
                    </select>
                  </div>
                </div>

                {/* 検索ボタン */}
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    検索
                  </button>
                </div>
              </div>
            </form>

            {/* 検索結果 */}
            <div className="mb-16">
              <h3 className="text-lg font-medium text-gray-900 mb-10">
                検索結果: {filteredProjects.length}件
              </h3>

              {/* 結果一覧 */}
              <div className="space-y-16">
                {projectsWithAssignments.map((project) => (
                  <Link href={`/projects/${project.id}`} key={project.id}>
                    <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-100 hover:border-blue-100">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 mb-6 text-lg">
                            {project.description}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          project.status === '募集中' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-8 text-base mb-8">
                        <div>
                          <span className="text-gray-500 block mb-2">必要スキル:</span>
                          <div className="flex flex-wrap gap-2">
                            {project.required_skills.map((skill, index) => (
                              <span 
                                key={index}
                                className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <span className="text-gray-500 block mb-2">場所:</span>
                            <p className="text-gray-900 font-medium">{project.location}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-2">期間:</span>
                            <p className="text-gray-900 font-medium">{project.duration}</p>
                          </div>
                        </div>
                      </div>

                      {/* 担当者情報 */}
                      <div className="mt-6 pt-6 border-t-2 border-gray-100">
                        <span className="text-gray-500 text-base block mb-3">担当者:</span>
                        <div className="flex flex-wrap gap-3">
                          {project.assignments && project.assignments.length > 0 ? (
                            project.assignments.map((assignment) => (
                              <span
                                key={assignment.id}
                                className="inline-flex items-center bg-gray-50 px-4 py-2 rounded-full text-sm font-medium text-gray-800"
                              >
                                {assignment.user?.name}
                                {assignment.user?.prefecture && ` (${assignment.user.prefecture})`}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-base">未設定</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* 検索結果が0件場合 */}
                {projectsWithAssignments.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-lg">
                    検索条件に一致する案件が見つかりませんでした。
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}