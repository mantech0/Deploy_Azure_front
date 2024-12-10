import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

// ユーザーの型定義
type User = {
  id: string;
  email: string;
  name: string;
  prefecture: string;
}

// 特定のユーザーデータを取得する関数
async function getUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`http://localhost:5001/api/users/${id}`, {
      next: { revalidate: 60 } // 60秒ごとにキャッシュを更新
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
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
    notFound();
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar currentPath="/users" />

        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* 戻るボタン */}
            <Link href="/users" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <span className="text-xl mr-1">←</span>
              <span>登録者一覧に戻る</span>
            </Link>

            {/* ユーザー情報カード */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-24 h-24 relative">
                    <Image
                      src="/images/default-avatar.svg"
                      alt="avatar"
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500">ID: {user.id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">メールアドレス</h3>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">都道府県</h3>
                    <p className="text-gray-900">{user.prefecture}</p>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    編集
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    削除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 