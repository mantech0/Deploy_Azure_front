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

// 検索パラメータの型定義
type SearchParams = {
  q?: string;
  prefecture?: string;
}

// APIからユーザーデータを取得する関数
async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('http://localhost:5001/api/users', {
      next: { revalidate: 60 } // 60秒ごとにキャッシュを更新
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const users = await getUsers();
  const filteredUsers = filterUsers(users, searchParams);
  const prefectures = Array.from(new Set(users.map(user => user.prefecture))).sort();

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar currentPath="/search" />

        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6">登録者検索</h2>

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
                  {prefectures.map(prefecture => (
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

          {/* 検索結果 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              検索結果: {filteredUsers.length}件
            </h3>

            {/* 結果一覧 */}
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <Link href={`/users/${user.id}`} key={user.id}>
                  <div className="flex items-center space-x-8 bg-white p-4 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 relative">
                        <Image
                          src="/images/default-avatar.svg"
                          alt="avatar"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{user.prefecture}</div>
                  </div>
                </Link>
              ))}

              {/* 検索結果が0件の場合 */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  検索条件に一致する登録者が見つかりませんでした。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 