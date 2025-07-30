import React from "react";
import { Card, Skeleton } from "@heroui/react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-48 h-8 rounded-lg" />
        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>

      {/* Tab navigation */}
      <div className="flex space-x-1 bg-gray-50 rounded-2xl p-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="flex-1 h-12 rounded-xl" />
        ))}
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-16 h-8 rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
