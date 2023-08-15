import React from "react";

export type IconButtonProps<T extends React.ElementType> =
  React.ComponentProps<T> & {
    as?: React.ElementType;
    color?: "primary" | "secondary" | "default";
    size?: "sm" | "md" | "lg";
    className?: string;
  };

export const IconButton = <T extends React.ElementType>({
  as: Component = "button",
  type = "button",
  color = "default",
  size = "md",
  className,
  children,
  ...props
}: IconButtonProps<T>) => {
  const colors = {
    white: "text-white",
    dark: "text-gray-900",
    default: "text-gray-500",
    primary: "text-blue-500",
    secondary: "text-orange-500",
  };
  const sizes = {
    sm: "w-9 h-9 p-2",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2",
  };
  const classList = [
    "icon-button transition-all transform duration-300 rounded-full flex items-center justify-center outline-none text-dark hover:bg-gray-300 hover:bg-opacity-20 focus:bg-gray-300 focus:bg-opacity-30",
    colors[(color || "default") as "primary" | "secondary" | "default"],
    sizes[(size || "md") as "sm" | "md" | "lg"],
  ];
  if (className) {
    classList.push(className);
  }
  if (Component !== "button") {
    return (
      <Component className={classList.join(" ")} {...props}>
        {children}
      </Component>
    );
  }
  return (
    <Component className={classList.join(" ")} {...props} type={type}>
      {children}
    </Component>
  );
};

export default IconButton;
