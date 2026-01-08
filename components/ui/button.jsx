import * as React from "react"
// Simplification: Simple button without Slot for now unless requested.
// Simplification: Simple button without Slot for now unless requested.
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
        default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all active:scale-95",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-indigo-200 bg-background hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300",
        secondary: "bg-indigo-100 text-indigo-900 hover:bg-indigo-200",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={
                cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )
            }
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
