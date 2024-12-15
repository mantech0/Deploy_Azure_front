'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type Project = {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  location: string;
  duration: string;
  status: string;
}

type Props = {
  project: Project;
}

export default function ProjectEditForm({ project }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    required_skills: project.required_skills.join(', '),
    location: project.location,
    duration: project.duration,
    status: project.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          required_skills: formData.required_skills.split(',').map(skill => skill.trim()).filter(Boolean)
        }),
      });

      if (!response.ok) {
        throw new Error('更新に失敗しました');
      }

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 表示モード用のコンポーネント
  const DisplayField = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="mb-6">
      <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );

  if (!isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">プロジェクト基本情報</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            編集する
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">プロジェクト番号</div>
            <div className="text-gray-900">{project.id}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">ステータス</div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
              project.status === '募集中' 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">プロジェクト名</div>
            <div className="text-gray-900">{project.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">場所</div>
            <div className="text-gray-900">{project.location}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">期間</div>
            <div className="text-gray-900">{project.duration}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">必要スキル</div>
            <div className="flex flex-wrap gap-2">
              {project.required_skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-500 mb-1">プロジェクト概要</div>
          <div className="text-gray-900 whitespace-pre-wrap">{project.description}</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            プロジェクト名
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            プロジェクト概要
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="required_skills" className="block text-sm font-medium text-gray-700 mb-1">
            必要スキル（カンマ区切り）
          </label>
          <input
            type="text"
            id="required_skills"
            name="required_skills"
            value={formData.required_skills}
            onChange={handleChange}
            placeholder="例: React, Node.js, TypeScript"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            場所
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            期間
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="募集中">募集中</option>
            <option value="募集終了">募集終了</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>
    </form>
  );
} 