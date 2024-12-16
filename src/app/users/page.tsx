import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// ユーザーの型定義を更新
type User = {
  id: number;
  email: string;
  name: string;
  skills: string[];
  experience: string;
  prefecture: string;
}

// 検索パラメータの型定義
type SearchParams = {
  q?: string;
  prefecture?: string;
  skills?: string;
}

// APIからユーザーデータを取得する関数
async function getUsers(): Promise<User[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    console.log('Fetching users from:', API_URL);
    
    const response = await fetch(`${API_URL}/users`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('API response status:', response.status);
      console.error('API response text:', await response.text());
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();
    console.log('Fetched users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// 検索結果をフィルタリングする関数
function filterUsers(users: User[], params: SearchParams): User[] {
  return users.filter(user => {
    // フリーワード検索
    if (params.q) {
      const searchTerm = params.q.toLowerCase();
      const searchTarget = `${user.name} ${user.email} ${user.prefecture}`.toLowerCase();
      if (!searchTarget.includes(searchTerm)) {
        return false;
      }
    }

    // 都道府県での絞り込み
    if (params.prefecture && params.prefecture !== 'all') {
      if (user.prefecture !== params.prefecture) {
        return false;
      }
    }

    return true;
  });
}

// 検索フォームと���果の表示を統合
export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const users = await getUsers();
  const filteredUsers = filterUsers(users, searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-screen pt-16">
        <Sidebar currentPath="/users" />
        <main className="flex-1 ml-64">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">ユーザー一覧</h2>

            {/* 検索フォーム */}
            <form className="mb-8">
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
                    placeholder="名前、メールアドレス、都道府県など"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 都道府県での絞り込み */}
                <div>
                  <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
                    都道府県で絞り込み
                  </label>
                  <select
                    id="prefecture"
                    name="prefecture"
                    defaultValue={searchParams.prefecture || 'all'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">すべての都道府県</option>
                    {Array.from(new Set(users.map(user => user.prefecture))).sort().map(prefecture => (
                      <option key={prefecture} value={prefecture}>
                        {prefecture}
                      </option>
                    ))}
                  </select>
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

            {/* ユッダー行 */}
            <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 font-medium text-sm text-gray-500">
              <span className="w-8">No</span>
              <span className="w-16">ID</span>
              <span className="w-32">お名前</span>
              <span className="w-24">都道府県</span>
              <span className="flex-1">スキル</span>
              <span className="w-24">経験年数</span>
            </div>

            {/* ユーザーリスト */}
            <div className="space-y-2 mt-2">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <Link 
                    key={user.id} 
                    href={`/users/${user.id}`}
                  >
                    <div className="flex items-center space-x-4 bg-white p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                      <span className="text-gray-500 w-8">{index + 1}</span>
                      <span className="text-gray-500 w-16">{user.id}</span>
                      <span className="text-gray-700 w-32">{user.name}</span>
                      <span className="text-gray-500 w-24">{user.prefecture}</span>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {user.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500 w-24">{user.experience}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  ユーザーが見つかりません
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 