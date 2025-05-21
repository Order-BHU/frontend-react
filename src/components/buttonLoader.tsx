interface ButtonLoaderProps {
  className?: string;
  spinner?: string;
  size?: string;
  border?: string;
  color?: string;
}

export default function ButtonLoader({
  className = "",
  spinner = "",
  size = "h-12 w-12",
  border = "border-b-2",
  color = "border-white",
}: ButtonLoaderProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${size} ${border} ${color} ${spinner}`}
      ></div>
    </div>
  );
}
