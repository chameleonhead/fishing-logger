export type CollapseProps = React.ComponentProps<"div"> & {
  open: boolean;
};

export const Collapse = ({
  open,
  children,
  className,
  ...props
}: CollapseProps) => {
  const classList = [
    "transition-all transform duration-300 overflow-hidden",
    open ? "max-h-96" : "max-h-0",
  ];
  if (className) {
    classList.push(className);
  }
  return (
    <div className={classList.join(" ")} {...props}>
      {children}
    </div>
  );
};

export default Collapse;
