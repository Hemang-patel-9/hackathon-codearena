import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility function

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

// Main Card Component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
                "border-gray-200 bg-white text-gray-900",
                "dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
Card.displayName = "Card";

// Card Header Component
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-col space-y-1.5 p-6 pb-4",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
CardHeader.displayName = "CardHeader";

// Card Title Component
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn(
                "text-2xl font-semibold leading-none tracking-wide transition-colors duration-200",
                "text-gray-900 dark:text-white",
                className
            )}
            {...props}
        >
            {children}
        </h3>
    )
);
CardTitle.displayName = "CardTitle";

// Card Description Component
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, children, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                "text-sm leading-relaxed",
                "text-gray-600 dark:text-gray-300",
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
);
CardDescription.displayName = "CardDescription";

// Card Content Component
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "p-6 pt-0",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };