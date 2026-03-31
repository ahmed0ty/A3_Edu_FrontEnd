// export const Spinner = () => {
//   return (
//     <div className="flex items-center justify-center">
//       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );
// };








export const Spinner = ({
  size = "md",
  variant = "primary", // primary | neutral | white
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-[3px]",
  };

  const variantClasses = {
    primary: "border-blue-600 dark:border-blue-400 border-t-transparent",
    neutral: "border-gray-300 dark:border-gray-600 border-t-transparent",
    white: "border-white/80 border-t-transparent",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          rounded-full animate-spin
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
      />
    </div>
  );
};