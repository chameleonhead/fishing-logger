import React from "react";

export type ChipProps<T extends React.ElementType> = React.ComponentProps<T> & {
  as: React.ElementType;
  className?: string;
};

export const Chip = <T extends React.ElementType>({
  as: As = "span",
  className,
  ...props
}: ChipProps<T>) => {
  const classList = [
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
  ];
  if (className) {
    classList.push(className);
  }
  return <As className={classList.join(" ")} {...props} />;
};

export default Chip;
