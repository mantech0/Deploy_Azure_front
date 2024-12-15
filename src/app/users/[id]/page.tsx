import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import UserEditForm from './UserEditForm'
import UserAssignments from './UserAssignments'

// ユーザーの型定義
type User = {
  id: number;
  email: string;
  name: string;
  skills: string[];
  experience: string;
  prefecture: string;
}

// 特定のユーザーデータを取得する関数
async function getUser(id: string): Promise<User | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex min-h-screen pt-16">
          <Sidebar currentPath="/users" />
          <main className="flex-1 ml-64">
            <div className="container max-w-6xl mx-auto px-4 py-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                  ユーザーが見つかりませんでした。
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-screen pt-16">
        <Sidebar currentPath="/users" />
        <main className="flex-1 ml-64">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Link 
                href="/users"
                className="text-blue-500 hover:text-blue-600 mb-2 inline-block"
              >
                ← ユーザー一覧に戻る
              </Link>
              <h2 className="text-2xl font-bold mb-6">ユーザー詳細</h2>
              <UserEditForm user={user} />
              <UserAssignments userId={user.id} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 