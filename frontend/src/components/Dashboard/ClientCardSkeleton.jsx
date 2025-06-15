export default function ClientCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div>
            <div className="w-32 h-5 bg-gray-200 rounded mb-2" />
            <div className="w-24 h-4 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-24 h-5 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="w-36 h-4 bg-gray-200 rounded" />
        <div className="w-48 h-4 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="h-9 bg-gray-200 rounded" />
        <div className="h-9 bg-gray-200 rounded" />
        <div className="h-9 bg-gray-200 rounded" />
        <div className="h-9 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
