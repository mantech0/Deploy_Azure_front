import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-screen pt-16">
        <Sidebar currentPath="/register" />
        <main className="flex-1 ml-64">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">登録者の登録</h2>
            
            {/* タブ */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <a
                    href="#"
                    className="border-b-2 border-blue-500 py-4 px-6 text-sm font-medium text-blue-600 whitespace-nowrap"
                  >
                    手動で登録
                  </a>
                  <a
                    href="#"
                    className="border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap"
                  >
                    CSVで登録
                  </a>
                </nav>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <RegisterForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 