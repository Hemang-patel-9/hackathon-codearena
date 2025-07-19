import { useState, useEffect } from 'react';
import { fetchPrivateQuizzes, fetchPublicQuizzes } from '../api/quiz';
import type { Quiz } from '../types/quizComponent';
import QuizTab from '@/components/user-quiz-render/quiz-tab';
import QuizCard from '@/components/user-quiz-render/quiz-card';
import type { Result } from '../types/response';
import { useAuth } from '@/contexts/authContext';
import { Badge } from '@/components/dashboard/dashboard-badge';

export default function UserQuizRender() {
    const [activeTab, setActiveTab] = useState<'private' | 'public'>('public');
    const [privateQuizzes, setPrivateQuizzes] = useState<Quiz[]>([]);
    const [publicQuizzes, setPublicQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user, token } = useAuth();

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'private') {
                    const response: Result = await fetchPrivateQuizzes(token as string, user?._id as string);
                    setPrivateQuizzes(response.data || []);
                    if (response.error) setError(response.error);
                } else {
                    const response: Result = await fetchPublicQuizzes();
                    setPublicQuizzes(response.data || []);
                    if (response.error) setError(response.error);
                }
            } catch {
                setError('Failed to fetch quizzes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [activeTab, token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white animate-fade-in">
                    Available Quizzes
                </h1>

                <QuizTab activeTab={activeTab} setActiveTab={setActiveTab} />

                {loading && (
                    <p className="text-center text-muted-foreground animate-pulse py-10">
                        Loading quizzes...
                    </p>
                )}
                {error && (
                    <div className="h-48 w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        <div className="flex justify-center py-10 animate-fade-in">
                            <Badge variant="secondary" size="md">
                                No {activeTab} quizzes found.
                            </Badge>
                        </div>
                    </div>
                )}


                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {(activeTab === 'private' ? privateQuizzes : publicQuizzes).map((quiz, index) => (
                            <div
                                key={quiz._id}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <QuizCard quiz={quiz} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading &&
                    !error &&
                    (activeTab === 'private' ? privateQuizzes : publicQuizzes).length === 0 && (
                        <div className="flex justify-center py-10 animate-fade-in">
                            <Badge variant="secondary" size="md">
                                No {activeTab} quizzes found.
                            </Badge>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
