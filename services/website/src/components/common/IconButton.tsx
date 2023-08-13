import React from "react";

export type IconButtonProps =
  React.ComponentProps<"button"> & {
    color?: "primary" | "secondary" | "default";
    size?: "sm" | "md" | "lg";
    className?: string;
  };

export const IconButton = ({
  type = "button",
  color = "default",
  size = "md",
  className,
  children,
  ...props
}: IconButtonProps) => {
  const colors = {
    default: "text-gray-500",
    primary: "text-blue-500",
    secondary: "text-orange-500"
  }
  const sizes = {
    sm: "w-9 h-9 p-2",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2",
  }
  const classList = [
    "icon-button transition-all transform duration-300 rounded-full flex items-center justify-center outline-none text-dark hover:bg-gray-300 hover:bg-opacity-20 focus:bg-gray-300 focus:bg-opacity-30",
    colors[color || "default"],
    sizes[size || "md"]
  ];
  if (className) {
    classList.push(className);
  }
  return <button className={classList.join(" ")} {...props}>{children}</button>;
};

export default IconButton;
