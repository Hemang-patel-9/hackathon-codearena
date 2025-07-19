export interface Creator {
    _id: string;
    username: string;
    avatar?: string;
}

export interface Quiz {
    _id: string;
    title: string;
    description?: string;
    schedule: string;
    duration: number;
    NoOfQuestion: number;
    timePerQuestion: number;
    thumbnail?: string;
    status: 'upcoming' | 'active';
    creator: Creator;
}