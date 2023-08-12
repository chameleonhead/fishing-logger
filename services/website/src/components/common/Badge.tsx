import React from "react";

export type BadgeProps = React.PropsWithChildren<{
  color?: "primary" | "secondary" | "default";
}>;

export const Badge = ({ children, color = "default" }: BadgeProps) => {
  const colors = {
    primary: "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
    secondary: "bg-gray-50 text-gray-600 ring-gray-500/10",
    default: "bg-white text-dark ring-gray-500/10",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
