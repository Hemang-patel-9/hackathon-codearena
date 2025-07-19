import * as React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: React.ReactNode;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}

// Main Card Component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'rounded-xl border border-border bg-card text-foreground shadow-md',
                'transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2',
                'dark:border-gray-700 dark:bg-gray-800 dark:text-white',
                'hover:ring-2 hover:ring-ring/50',
                'animate-fade-in',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
Card.displayName = 'Card';

// Card Header Component
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex flex-col gap-2 p-6 pb-4',
                'border-b border-border bg-card/90',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
CardHeader.displayName = 'CardHeader';

// Card Title Component
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn(
                'text-xl font-bold tracking-tight',
                'text-foreground dark:text-white',
                'transition-colors duration-200',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    )
);
CardTitle.displayName = 'CardTitle';

// Card Description Component
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                'text-sm text-muted-foreground leading-relaxed',
                'dark:text-muted-foreground',
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
);
CardDescription.displayName = 'CardDescription';

// Card Content Component
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'p-6 pt-0',
                'space-y-4',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };