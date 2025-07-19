import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility function

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

        const sizeStyles = {
            sm: "px-2 py-0.5 text-xs rounded-md",
            md: "px-2.5 py-1 text-sm rounded-md",
            lg: "px-3 py-1.5 text-base rounded-lg"
        };

        const variantStyles = {
            default: cn(
                "bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
                "bg-blue-600 text-white hover:bg-blue-700",
                "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
            ),
            secondary: cn(
                "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
                "bg-gray-100 text-gray-900 hover:bg-gray-200",
                "dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            ),
            destructive: cn(
                "bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
                "bg-red-600 text-white hover:bg-red-700",
                "dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
            ),
            outline: cn(
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                "dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            )
        };

        return (
            <div
                ref={ref}
                className={cn(
                    baseStyles,
                    sizeStyles[size],
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Badge.displayName = "Badge";

export { Badge };