export type ProgressProps = {
  animated?: boolean;
  value: number;
};

export const Progress = ({ animated, value }: ProgressProps) => {
  const classList = [
    "transition-all relative w-full h-2 overflow-hidden bg-gray-200 rounded",
  ];
  if (animated) {
    classList.push("progress-animated");
  }
  return (
    <div className={classList.join(" ")}>
      <div
        className="absolute top-0 left-0 h-2 bg-blue-600"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;
