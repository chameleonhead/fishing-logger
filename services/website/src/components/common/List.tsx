import React from "react";

export type ListProps = {
  children:
  | React.ReactElement<ListItemProps>
  | Array<React.ReactElement<ListItemProps>>;
  className?: string;
};

export const List = ({ children, className }: ListProps) => {
  return (
    <div role="list" className={`divide-y divide-gray-100 ${className ? className : ""}`}>
      {children}
    </div>
  );
};

export type ListItemProps = React.PropsWithChildren<{
  action?: boolean;
}>;

List.Item = ({ children, action = false }: ListItemProps) => {
  const className = action
    ? "flex justify-between gap-x-6 py-5 px-2 cursor-pointer hover:bg-gray-100"
    : "flex justify-between gap-x-6 py-5 px-2";
  return <div className={className}>{children}</div>;
};

export default List;
