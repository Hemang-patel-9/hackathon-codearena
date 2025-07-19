import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility function

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

// Main Avatar Component
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, children, size = 'md', ...props }, ref) => {
        const sizeStyles = {
            sm: "h-8 w-8 text-xs",
            md: "h-10 w-10 text-sm",
            lg: "h-12 w-12 text-base",
            xl: "h-16 w-16 text-lg"
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-200",
                    "ring-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600",
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Avatar.displayName = "Avatar";

// Avatar Image Component
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
    ({ className, src, alt, ...props }, ref) => {
        const [imageError, setImageError] = React.useState(false);
        const [imageLoaded, setImageLoaded] = React.useState(false);

        const handleError = () => {
            setImageError(true);
        };

        const handleLoad = () => {
            setImageLoaded(true);
        };

        if (imageError || !src) {
            return null;
        }

        return (
            <>
                <img
                    ref={ref}
                    src={src}
                    alt={alt}
                    className={cn(
                        "aspect-square h-full w-full object-cover transition-opacity duration-300",
                        imageLoaded ? "opacity-100" : "opacity-0",
                        className
                    )}
                    onError={handleError}
                    onLoad={handleLoad}
                    {...props}
                />
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
                    </div>
                )}
            </>
        );
    }
);
AvatarImage.displayName = "AvatarImage";

// Avatar Fallback Component
const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full font-medium uppercase transition-colors duration-200",
                "bg-gray-100 text-gray-600 hover:bg-gray-200",
                "dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };