import { type Quiz } from '@/types/quizComponent';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../dashboard/dashboard-card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button'; // Assuming a Button component from a UI library
import {
    CalendarDays,
    Timer,
    ListChecks,
    Clock,
    User,
    Dot
} from 'lucide-react';


interface QuizCardProps {
    quiz: Quiz;
    onJoin?: (quizId: string) => void; // Optional prop for join action
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onJoin }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const handleJoin = () => {
        if (onJoin && quiz._id) {
            onJoin(quiz._id);
        }
    };

    return (
        <Card className="animate-fade-in">
            <div className='w-full h-48'>
                <img
                    src={`${import.meta.env.VITE_APP_API_URL}/${quiz.thumbnail}`}
                    alt={quiz.title}
                    className="mt-4 w-full h-36 object-cover border border-border"
                />
            </div>
            <CardHeader>
                <CardTitle className='mb-3'>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description || 'No description available'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Scheduled Date with icon */}
                    <div className="flex items-center gap-2 border-b pb-2 border-border">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <p className="text-sm text-foreground">
                            <span className="font-medium text-primary">Scheduled:</span> {formatDate(quiz.schedule)}
                        </p>
                    </div>

                    {/* Duration and Questions flex together */}
                    <div className="flex justify-between gap-1 items-end border-b pb-2 border-border">
                        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md p-2">
                            <Timer className="w-4 h-4 me-2" />
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-primary">Duration:</span> {quiz.duration} min
                            </p>
                        </div>

                        <div className="flex items-center border border-gray-300 dark:border-gray-700  rounded-md p-2">
                            <ListChecks className="w-4 h-4 me-2" />
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-primary">Questions:</span> {quiz.NoOfQuestion}
                            </p>
                        </div>
                    </div>



                    {/* Time / Question */}
                    <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                            <span className="font-medium text-muted-foreground">Time / Question:</span> {quiz.timePerQuestion} sec
                        </span>
                    </p>

                    {/* Creator */}
                    <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>
                            <span className="font-medium text-muted-foreground">Creator:</span> {quiz.creator?.username || 'Unknown'}
                        </span>
                    </p>

                    {/* Status */}
                    <p className="text-sm flex items-center gap-2">
                        <Dot className={cn('w-5 h-5', quiz.status === 'active' ? 'text-green-500' : 'text-blue-500')} />
                        <span className="font-medium">Status:</span>
                        <span
                            className={cn(
                                'font-semibold',
                                quiz.status === 'active' ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'
                            )}
                        >
                            {quiz.status}
                        </span>
                    </p>

                    {/* Join Button */}
                    <Button className="w-full mt-4" onClick={handleJoin} disabled={!onJoin || !quiz._id}>
                        Join Quiz
                    </Button>
                </div>
            </CardContent>


        </Card>
    );
};

export default QuizCard;