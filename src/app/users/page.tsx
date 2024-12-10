import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// ユーザーの型定義
type User = {
  id: string;
  email: string;
  name: string;
  prefecture: string;
}

// APIからユーザーデータを取得する関数
async function getUsers(): Promise<User[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    console.log('Fetching users from:', API_URL);
    const response = await fetch(`${API_URL}/users`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <>
      <Header />

      <div className="flex">
        <Sidebar currentPath="/users" />

        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6">登録者一覧</h2>
          
          {/* ヘッダー行 */}
          <div className="flex items-center space-x-8 px-4 py-2 bg-gray-50 font-medium text-sm text-gray-500">
            <span className="w-8">No</span>
            <span className="w-16">ID</span>
            <span className="flex-1">メールアドレス</span>
            <span className="w-32">お名前</span>
            <span className="w-24">都道府県</span>
          </div>

          {/* ユーザーリスト */}
          <div className="space-y-2 mt-2">
            {users.map((user, index) => (
              <Link href={`/users/${user.id}`} key={user.id}>
                <div className="flex items-center space-x-8 bg-white p-4 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-500 w-8">{index + 1}</span>
                  <span className="text-gray-500 w-16">{user.id}</span>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-8 h-8 relative">
                      <Image
                        src="/images/default-avatar.svg"
                        alt="avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <span className="text-gray-500">{user.email}</span>
                  </div>
                  <span className="text-gray-700 w-32">{user.name}</span>
                  <span className="text-gray-500 w-24">{user.prefecture}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 