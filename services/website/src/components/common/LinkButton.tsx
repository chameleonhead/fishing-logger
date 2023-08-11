import { Link, LinkProps } from "react-router-dom";

export type LinkButtonProps = LinkProps & {
  color?: "primary" | "secondary" | "default";
  size?: "sm" | "md" | "lg";
};

export const LinkButton = ({
  children,
  color = "default",
  size = "md",
  ...props
}: LinkButtonProps) => {
  const colors: Record<string, string> = {
    primary:
      "text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600",
    secondary:
      "text-white bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600",
  };
  return (
    <Link
      className={
        `inline-flex items-center rounded-md px-3 py-2 text-${
          size === "md" ? "base" : size === "lg" ? "xl" : size
        } font-semibold shadow-${size} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ` +
        (colors[color] || "")
      }
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
