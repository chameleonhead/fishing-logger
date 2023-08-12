import React from "react";
import { Link as RouterLink } from "react-router-dom";

export type ListProps = {
  children:
    | React.ReactElement<ListItemProps>
    | Array<React.ReactElement<ListItemProps>>;
};

export const List = ({ children }: ListProps) => {
  return (
    <div role="list" className="divide-y divide-gray-100">
      {children}
    </div>
  );
};

export type ListItemProps = React.PropsWithChildren<{
  action?: boolean;
  href?: string;
}>;

List.Item = ({ children, action = false, href }: ListItemProps) => {
  const className = action
    ? "flex justify-between gap-x-6 py-5 px-2 cursor-pointer hover:bg-gray-100"
    : "flex justify-between gap-x-6 py-5 px-2";
  if (typeof href !== "undefined") {
    return (
      <RouterLink to={href} className={className}>
        {children}
      </RouterLink>
    );
  }
  return <div className={className}>{children}</div>;
};

export default List;
