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
                "shadow-sm",
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
                    "hover:bg-gradient-to-r dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 hover:from-purple-200 hover:to-blue-200",
                    isActive && [
                        "shadow-sm",
                        "hover:bg-gradient-to-r dark:from-purple-900/30 dark:to-blue-900/30 from-purple-200 to-blue-200",
                        "ring-1 ring-gray-200 dark:ring-purple-950"
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