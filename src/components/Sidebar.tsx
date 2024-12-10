import Link from 'next/link'

type SidebarProps = {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  return (
    <nav className="w-64 p-4">
      <ul className="space-y-6">
        <li>
          <Link
            href="/register"
            className={`flex items-center space-x-3 p-3 rounded text-lg font-medium ${
              currentPath === '/register' ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">✏️</span>
            <span>登録</span>
          </Link>
        </li>
        <li>
          <Link
            href="/users"
            className={`flex items-center space-x-3 p-3 rounded text-lg font-medium ${
              currentPath === '/users' ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">👥</span>
            <span>登録者一覧</span>
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className={`flex items-center space-x-3 p-3 rounded text-lg font-medium ${
              currentPath === '/search' ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">🔍</span>
            <span>検索</span>
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className={`flex items-center space-x-3 p-3 rounded text-lg font-medium ${
              currentPath === '/projects' ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">📋</span>
            <span>案件一覧</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
} 