import Sidebar from '@/components/Sidebar'

export default function Home() {
  return (
    <>
      <header className="bg-black text-white p-4">
        <h1 className="text-2xl font-bold">SkillNow</h1>
      </header>

      <div className="flex">
        <Sidebar currentPath="/" />
        <main className="flex-1 ml-64 p-4">
          {/* メインコンテンツ */}
        </main>
      </div>
    </>
  )
}