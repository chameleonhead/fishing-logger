import React from "react";

export type ButtonProps<T extends React.ElementType> =
  React.ComponentProps<T> & {
    as: React.ElementType;
    color?: "primary" | "secondary" | "default";
    variant?: "outline" | "filled";
    size?: "sm" | "md" | "lg";
    className?: string;
  };

export const Button = <T extends React.ElementType>({
  as: As = "button",
  type = "button",
  color = "default",
  variant = "filled",
  size = "md",
  className,
  ...props
}: ButtonProps<T>) => {
  const colors = {
    default:
      variant === "outline"
        ? "bg-white text-gray-700 border-gray-500 ring-gray-500 enabled:hover:ring-gray-500 enabled:hover:bg-gray-50 focus:bg-gray-50"
        : "bg-gray-500 text-white ring-gray-500 enabled:hover:bg-gray-400 enabled:hover:ring-gray-600 focus:bg-gray-400",
    primary:
      variant === "outline"
        ? "bg-white text-blue-700 border-blue-500 ring-blue-500 enabled:hover:ring-blue-500 enabled:hover:bg-blue-50 focus:bg-blue-50"
        : "bg-blue-500 text-white ring-blue-500 enabled:hover:bg-blue-400 enabled:hover:ring-blue-600 focus:bg-blue-400",
    secondary:
      variant === "outline"
        ? "bg-white text-orange-700 border-orange-500 ring-orange-500 enabled:hover:ring-orange-500 enabled:hover:bg-orange-50 focus:bg-orange-50"
        : "bg-orange-500 text-white ring-orange-500 enabled:hover:bg-orange-400 enabled:hover:ring-orange-600 focus:bg-orange-400",
  };
  const classList = [
    "transition-all inline-flex items-center justify-center rounded shadow-sm font-medium focus:ring-1",
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-1 text-lg"
      : "px-4 py-1 text-base",
    variant === "outline"
      ? "outline-0 ring-0 border"
      : "outline-0 ring-0 border-0",
    "disabled:opacity-75 disabled:cursor-not-allowed",
    colors[(color as keyof typeof colors) || "default"],
  ];
  if (className) {
    classList.push(className);
  }
  if (As === "button") {
    return <As className={classList.join(" ")} type={type} {...props} />;
  }
  return <As className={classList.join(" ")} {...props} />;
};

export default Button;
