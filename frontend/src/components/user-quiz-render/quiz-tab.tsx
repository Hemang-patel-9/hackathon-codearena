import React from 'react';
import { cn } from '@/lib/utils';

interface QuizTabProps {
    activeTab: 'private' | 'public';
    setActiveTab: (tab: 'private' | 'public') => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => setActiveTab('private')}
                    className={cn(
                        "px-6 py-2 text-sm font-medium transition-all",
                        activeTab === 'private'
                            ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100 ring-1 ring-gray-200 dark:ring-gray-600"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                >
                    Private Quizzes
                </button>
                <button
                    onClick={() => setActiveTab('public')}
                    className={cn(
                        "px-6 py-2 text-sm font-medium transition-all",
                        activeTab === 'public'
                            ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100 ring-1 ring-gray-200 dark:ring-gray-600"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                >
                    Public Quizzes
                </button>
            </div>
        </div>
    );
};

export default QuizTab;
