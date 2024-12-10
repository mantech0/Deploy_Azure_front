import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* 黒背景のヘッダー */}
      <header className="bg-black text-white p-4">
        <h1 className="text-2xl font-bold">SkillNow</h1>
      </header>

      {/* 左サイドメニュー */}
      <nav className="w-64 p-4">
        <ul className="space-y-6">
          <li>
            <Link href="/register" className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded text-lg font-medium">
              <span className="text-xl">✏️</span>
              <span>登録</span>
            </Link>
          </li>
          <li>
            <Link href="/users" className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded text-lg font-medium">
              <span className="text-xl">👥</span>
              <span>登録者一覧</span>
            </Link>
          </li>
          <li>
            <Link href="/search" className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded text-lg font-medium">
              <span className="text-xl">🔍</span>
              <span>検索</span>
            </Link>
          </li>
          <li>
            <Link href="/projects" className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded text-lg font-medium">
              <span className="text-xl">📋</span>
              <span>案件一覧</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}