import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type * as React from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
	"cursor-pointer flex flex-col items-center justify-center gap-0.5 rounded-sm bg-primary text-white transition-colors",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed disabled:opacity-50 ",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50",
				outline:
					"border-2 border-primary text-primary hover:bg-primary/10 disabled:opacity-50 bg-white",
				muted:
					"bg-muted-background text-white hover:bg-muted-hover active:bg-muted-pressed disabled:opacity-50",
			},
			size: {
				square: "h-10 w-10",
				wide: "h-10 w-22.5 px-4 py-0.5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "square",
		},
	},
);

function Button({
	className,
	variant,
	size,
	icon,
	text,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		icon: "save" | "edit" | "done" | "cancel" | "delete" | "+";
		text: string;
	}) {
	return (
		<button
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		>
			<Image src={`/icon/${icon}.svg`} alt={icon} width={18} height={18} />
			<span className="text-[10px] leading-tight">{text}</span>
		</button>
	);
}

export { Button, buttonVariants };
