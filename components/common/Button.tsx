import { mergeClasses } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "destructive" | "warning";
};

function Button({
  className,
  children,
  variant = "primary",
  ...otherProps
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-md text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-75";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
    destructive: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
    warning: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",
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
