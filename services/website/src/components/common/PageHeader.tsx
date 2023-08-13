type PageHeaderProps = {
  title: string;
  actions?: React.ReactNode;
};

export const PageHeader = ({ title, actions }: PageHeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex justify-between">
          <h1
            className={`text-3xl font-bold tracking-tight text-gray-900 truncate text-ellipsis${
              actions ? " mb-4 sm:mb-0" : ""
            }`}
          >
            {title}
          </h1>
          {actions ? <div>{actions}</div> : null}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
