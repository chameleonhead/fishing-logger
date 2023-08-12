import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "primary" | "secondary" | "default";
  size?: "sm" | "md" | "lg";
};

export const Button = ({
  children,
  color = "default",
  size = "md",
  ...props
}: ButtonProps) => {
  const colors: Record<string, string> = {
    primary:
      "text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600",
    secondary:
      "text-white bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600",
  };

  const sizes: Record<string, string> = {
    sm: "text-sm shadow-sm",
    md: "text-base shadow-md",
    lg: "text-xl shadow-lg",
  };
  return (
    <button
      type="button"
      className={`inline-flex items-center rounded-md px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        sizes[size] || ""
      } ${colors[color] || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
