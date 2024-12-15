'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

type Project = {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  location: string;
  duration: string;
  status: string;
}

type Assignment = {
  id: number;
  project_id: number;
  user_id: number;
  assigned_date: string;
  status: string;
  project?: Project;
}

type UserAssignmentsProps = {
  userId: number;
}

export default function UserAssignments({ userId }: UserAssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 担当案件一覧を取得
  const fetchAssignments = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/users/${userId}/assignments`);
      if (!response.ok) throw new Error('担当案件情報の取得に失敗しました');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('担当案件情報の取得に失敗しました');
    }
  };

  // 案件一覧を取得
  const fetchProjects = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) throw new Error('案件情報の取得に失敗しました');
      const data = await response.json();
      // すでに担当している案件を除外
      const availableProjects = data.filter(
        (project: Project) => !assignments.some(a => a.project_id === project.id)
      );
      setProjects(availableProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('案件情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 初期データ取得
  useEffect(() => {
    fetchAssignments();
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [assignments]);

  // 案件を担当
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/projects/${selectedProjectId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId
        }),
      });

      if (!response.ok) throw new Error('案件の担当に失敗しました');

      toast.success('案件を担当しました');
      fetchAssignments();
      setSelectedProjectId('');
    } catch (error) {
      console.error('Error assigning project:', error);
      toast.error('案件の担当に失敗しました');
    }
  };

  // 担当を解除
  const handleRemove = async (projectId: number, assignmentId: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/projects/${projectId}/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('担当の解除に失敗しました');

      toast.success('担当を解除しました');
      fetchAssignments();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast.error('担当の解除に失敗しました');
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  return (
    <div className="mt-12">
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-6">案件担当管理</h3>

        {/* 案件担当フォーム */}
        <form onSubmit={handleAssign} className="mb-8">
          <div className="flex gap-4">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">担当する案件を選択...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title} ({project.location})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!selectedProjectId}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              担当する
            </button>
          </div>
        </form>

        {/* 担当案件一覧 */}
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <p className="text-gray-500">担当している案件はありません</p>
          ) : (
            assignments.map(assignment => (
              <div
                key={assignment.id}
                className="border border-gray-200 p-6 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg mb-2">{assignment.project?.title}</h4>
                    <p className="text-gray-600 mb-4">{assignment.project?.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">場所:</span>
                        <p className="text-gray-900">{assignment.project?.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">期間:</span>
                        <p className="text-gray-900">{assignment.project?.duration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">割当日:</span>
                        <p className="text-gray-900">{assignment.assigned_date}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(assignment.project_id, assignment.id)}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    担当解除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 