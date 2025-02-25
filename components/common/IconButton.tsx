import { mergeClasses } from "@/lib/utils";
import React from "react";

type IconButtonProps = React.ComponentPropsWithoutRef<"button">;

function IconButton({ className, children, ...otherProps }: IconButtonProps) {
  const baseClasses =
    "border-none bg-transparent p-0 m-0 shadow-none text-foregroundSecondary hover:text-foreground cursor:pointer";
  const buttonClasses = mergeClasses(className, baseClasses);

  return (
    <button className={buttonClasses} {...otherProps}>
      {children}
    </button>
  );
}

export default IconButton;
