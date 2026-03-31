export default function CourseCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">

      {/* Image Skeleton */}
      <div className="h-44 bg-gray-700"></div>

      <div className="p-5">

        {/* Title */}
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>

        {/* Description */}
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>

        {/* Info */}
        <div className="flex justify-between mt-4">
          <div className="h-3 bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-700 rounded w-12"></div>
        </div>

        {/* Progress */}
        <div className="mt-4 h-2 bg-gray-700 rounded-full"></div>

        {/* Button */}
        <div className="mt-4 h-10 bg-gray-700 rounded-lg"></div>

      </div>
    </div>
  );
}