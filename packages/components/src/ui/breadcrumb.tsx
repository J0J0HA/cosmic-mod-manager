import { Slot } from "@radix-ui/react-slot";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import * as React from "react";
import Link from "~/ui/link";
import { cn } from "~/utils";

const Breadcrumb = React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithoutRef<"nav"> & {
        separator?: React.ReactNode;
    }
>(({ className, ...props }, ref) => (
    <nav ref={ref} aria-label="breadcrumb" className={cn("max-w-full overflow-x-hidden", className)} {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(({ className, ...props }, ref) => (
    <ol ref={ref} className={cn("flex flex-wrap items-center gap-x-1 break-words text-base text-muted-foreground", className)} {...props} />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-x-1", className)} {...props} />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
    typeof Link,
    React.ComponentPropsWithoutRef<"a"> & {
        asChild?: boolean;
    }
>(({ asChild, className, href, ...props }, ref) => {
    const Comp = asChild ? Slot : Link;

    return (
        <Comp
            to={href || ""}
            className={cn("transition-colors text-accent-foreground hover:text-accent-foreground/90", className)}
            {...props}
        />
    );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(({ className, ...props }, ref) => (
    <span ref={ref} aria-disabled="true" aria-current="page" className={cn("font-normal text-foreground", className)} {...props} />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
    return (
        <li
            role="presentation"
            aria-hidden="true"
            className={cn("[&>svg]:w-btn-icon [&>svg]:h-btn-icon text-muted-foreground", className)}
            {...props}
        >
            {children ?? <ChevronRightIcon aria-hidden />}
        </li>
    );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span role="presentation" aria-hidden="true" className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
            <MoreHorizontalIcon aria-hidden className="w-btn-icon h-btn-icon" />
            <span className="sr-only">More</span>
        </span>
    );
}
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };
