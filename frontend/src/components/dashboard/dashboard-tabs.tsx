import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility function

// Context for tab state management
interface TabsContextType {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
};

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children: React.ReactNode;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    children: React.ReactNode;
}

// Main Tabs Component
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, defaultValue = '', value, onValueChange, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = useState(defaultValue);

        const currentValue = value !== undefined ? value : internalValue;
        const handleValueChange = (newValue: string) => {
            if (value === undefined) {
                setInternalValue(newValue);
            }
            onValueChange?.(newValue);
        };

        return (
            <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
                <div
                    ref={ref}
                    className={cn("w-full", className)}
                    {...props}
                >
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

// Tabs List Component
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-lg p-1 transition-all duration-200",
                "bg-gray-100 text-gray-600 shadow-sm",
                "dark:bg-gray-800 dark:text-gray-400",
                "border border-gray-200 dark:border-gray-700",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
TabsList.displayName = "TabsList";

// Tabs Trigger Component
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, children, ...props }, ref) => {
        const { value: currentValue, onValueChange } = useTabsContext();
        const isActive = currentValue === value;

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "hover:bg-gray-50 dark:hover:bg-gray-700",
                    isActive && [
                        "bg-white text-gray-900 shadow-sm",
                        "dark:bg-gray-700 dark:text-gray-100",
                        "ring-1 ring-gray-200 dark:ring-gray-600"
                    ],
                    !isActive && [
                        "text-gray-600 dark:text-gray-400",
                        "hover:text-gray-900 dark:hover:text-gray-100"
                    ],
                    className
                )}
                onClick={() => onValueChange(value)}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

// Tabs Content Component
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, children, ...props }, ref) => {
        const { value: currentValue } = useTabsContext();
        const isActive = currentValue === value;

        if (!isActive) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    "mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };