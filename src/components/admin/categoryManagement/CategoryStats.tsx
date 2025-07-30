import React from 'react';
import { Category } from '../../../types';
import { Card, CardBody, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface CategoryStatsProps {
  categories: Category[];
  totalCategories: number;
  onQuickAction: (action: string) => void;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({
  categories,
  totalCategories,
  onQuickAction,
}) => {
  const calculateStats = () => {
    // Ensure categories is an array
    const categoriesArray = Array.isArray(categories) ? categories : [];
    
    const categoriesWithDescription = categoriesArray.filter(category => category.description && category.description.trim() !== '').length;
    const categoriesWithImage = categoriesArray.filter(category => category.thumbnailImage).length;
    const emptyCategories = categoriesArray.filter(category => !category.description || category.description.trim() === '').length;
    const categoriesWithProducts = categoriesArray.filter(category => (category.productsCount || 0) > 0).length;

    return {
      categoriesWithDescription,
      categoriesWithImage,
      emptyCategories,
      categoriesWithProducts,
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Categories',
      value: totalCategories.toString(),
      icon: 'lucide:tag',
      color: 'default',
      action: null,
    },
    {
      title: 'With Products',
      value: stats.categoriesWithProducts.toString(),
      icon: 'lucide:package',
      color: 'success',
      action: null,
    },
    {
      title: 'With Description',
      value: stats.categoriesWithDescription.toString(),
      icon: 'lucide:file-text',
      color: 'primary',
      action: null,
    },
    {
      title: 'With Images',
      value: stats.categoriesWithImage.toString(),
      icon: 'lucide:image',
      color: 'secondary',
      action: null,
    },
    {
      title: 'Need Description',
      value: stats.emptyCategories.toString(),
      icon: 'lucide:alert-triangle',
      color: 'warning',
      action: stats.emptyCategories > 0 ? 'emptyCategories' : null,
      actionText: 'View categories needing description',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statCards.map((card, index) => (
        <Card
          key={index}
          className="group hover:shadow-lg hover:shadow-default-200/50 transition-all duration-200 hover:-translate-y-0.5"
          isPressable={!!card.action}
          onPress={card.action ? () => onQuickAction(card.action!) : undefined}
        >
          <CardBody className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-default-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-foreground tracking-tight" title={card.value}>
                  {card.value}
                </p>
              </div>
              <div className={`bg-${card.color}-50 text-${card.color} p-2 rounded-lg`}>
                <Icon icon={card.icon} className="w-5 h-5" />
              </div>
            </div>
            
            {card.action && (
              <Button
                size="sm"
                variant="light"
                color={card.color as any}
                className="mt-3 w-full justify-start"
                endContent={<Icon icon="lucide:arrow-right" className="w-4 h-4" />}
              >
                {card.actionText}
              </Button>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default CategoryStats; 