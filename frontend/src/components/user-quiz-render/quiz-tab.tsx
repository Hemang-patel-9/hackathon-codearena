import React from 'react';
import { cn } from '@/lib/utils';

interface QuizTabProps {
    activeTab: 'private' | 'public';
    setActiveTab: (tab: 'private' | 'public') => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex  rounded-lg overflow-hidden">
                <button
                    onClick={() => setActiveTab('public')}
                    className={cn(
                        "px-6 py-2 text-sm font-medium transition-all",
                        activeTab === 'public'
                            ? "bg-gradient-to-tr from-purple-700 to-blue-700 text-white shadow-sm"
                            : "bg-gradient-to-tr from-purple-700 to-blue-700 text-transparent bg-clip-text"
                    )}
                >
                    Public Quizzes
                </button>
                <button
                    onClick={() => setActiveTab('private')}
                    className={cn(
                        "px-6 py-2 text-sm font-medium transition-all",
                        activeTab === 'private'
                            ? "bg-gradient-to-tr from-purple-700 to-blue-700 text-white shadow-sm"
                            : "bg-gradient-to-tr from-purple-700 to-blue-700 text-transparent bg-clip-text"
                    )}
                >
                    Private Quizzes
                </button>
            </div>
        </div>
    );
};

export default QuizTab;
