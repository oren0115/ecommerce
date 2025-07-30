import React, { useState, useEffect } from 'react';
import { Input, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface CategorySearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ({
  searchTerm,
  onSearch,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className="space-y-4">
      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search categories..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              startContent={<Icon icon="lucide:search" className="w-4 h-4 text-default-400" />}
              endContent={
                localSearchTerm && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={handleClearSearch}
                    className="text-default-400"
                  >
                    <Icon icon="lucide:x" className="w-4 h-4" />
                  </Button>
                )
              }
              className="flex-1"
            />
          </form>
        </div>
      </div>

      {/* Active Search Display */}
      {searchTerm && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-default-500">Filters:</span>
          
          <Chip
            variant="flat"
            color="primary"
            onClose={() => onSearch('')}
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onSearch('')}
                className="text-default-400"
              >
                <Icon icon="lucide:x" className="w-3 h-3" />
              </Button>
            }
          >
            "{searchTerm}"
          </Chip>
          
          <Button
            size="sm"
            variant="light"
            color="default"
            onPress={() => onSearch('')}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySearch; 