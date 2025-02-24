import { mergeClasses } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "destructive" | "warning" | "secondary";
};

function Button({
  className,
  children,
  variant = "primary",
  ...otherProps
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-md text-sm text-white transition-colors duration-300 focus:outline-none disabled:opacity-75 cursor:pointer";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600",
    destructive: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    secondary: "bg-gray-800 hover:bg-gray-900",
  };

  const buttonClasses = mergeClasses(
    className,
    baseClasses,
    variantClasses[variant]
  );

  return (
    <button className={buttonClasses} {...otherProps}>
      {children}
    </button>
  );
}

export default Button;
