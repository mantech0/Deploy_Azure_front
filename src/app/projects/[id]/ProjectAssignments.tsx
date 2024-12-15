'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

type User = {
  id: number;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  prefecture: string;
}

type Assignment = {
  id: number;
  project_id: number;
  user_id: number;
  assigned_date: string;
  status: string;
  user?: User;
}

type ProjectAssignmentsProps = {
  projectId: number;
}

export default function ProjectAssignments({ projectId }: ProjectAssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 担当者一覧を取得
  const fetchAssignments = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/projects/${projectId}/assignments`);
      if (!response.ok) throw new Error('担当者情報の取得に失敗しました');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('担当者情報の取得に失敗しました');
    }
  };

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) throw new Error('ユーザー情報の取得に失敗しました');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('ユーザー情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 初期データ取得
  useEffect(() => {
    fetchAssignments();
    fetchUsers();
  }, [projectId]);

  // 担当者を追加
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/projects/${projectId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(selectedUserId)
        }),
      });

      if (!response.ok) throw new Error('担当者の追加に失敗しました');

      toast.success('担当者を追加しました');
      fetchAssignments();
      setSelectedUserId('');
    } catch (error) {
      console.error('Error assigning user:', error);
      toast.error('担当者の追加に失敗しました');
    }
  };

  // 担当者を解除
  const handleRemove = async (assignmentId: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/projects/${projectId}/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('担当者の解除に失敗しました');

      toast.success('担当者を解除しました');
      fetchAssignments();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast.error('担当者の解除に失敗しました');
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">担当者管理</h3>

      {/* 担当者追加フォーム */}
      <form onSubmit={handleAssign} className="mb-6">
        <div className="flex gap-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">担当者を選択...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.prefecture})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedUserId}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            追加
          </button>
        </div>
      </form>

      {/* 担当者一覧 */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <p className="text-gray-500">担当者は設定されていません</p>
        ) : (
          assignments.map(assignment => (
            <div
              key={assignment.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <div className="font-medium">{assignment.user?.name}</div>
                <div className="text-sm text-gray-500">
                  {assignment.user?.prefecture} | 割当日: {assignment.assigned_date}
                </div>
              </div>
              <button
                onClick={() => handleRemove(assignment.id)}
                className="text-red-600 hover:text-red-700"
              >
                解除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 