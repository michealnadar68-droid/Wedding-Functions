import React from 'react';
import { Caterer, BundleItem, GlobalFilterState } from '../types';
import { CaterersSection } from '../components/CaterersSection';
import { GlobalFilterBar } from '../components/GlobalFilterBar';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { Utensils, Sparkles, Leaf, Flame, ShieldCheck } from 'lucide-react';

interface CaterersPageProps {
  caterers: Caterer[];
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters: () => void;
  onSelectCategory: (cat: any) => void;
  onOpenMenuModal: (caterer: Caterer) => void;
  onBookCaterer: (caterer: Caterer, estimatedTotal: number, guests: number) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundleCatererIds: string[];
  onOpenChatWithVendor?: (vendor: any) => void;
  onOpenMap: () => void;
  itemCounts: {
    halls: number;
    caterers: number;
    photographers: number;
    decorations: number;
  };
}

export const CaterersPage: React.FC<CaterersPageProps> = ({
  caterers,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCategory,
  onOpenMenuModal,
  onBookCaterer,
  onAddToBundle,
  bundleCatererIds,
  onOpenChatWithVendor,
  onOpenMap,
  itemCounts
}) => {
  return (
    <div className="w-full space-y-6">
      {/* 4-Page Header & Navigation Switcher */}
      <PageHeaderBanner
        category="caterers"
        onSelectCategory={onSelectCategory}
        totalCount={caterers.length}
        itemCounts={itemCounts}
      />

      {/* Dedicated Filter Engine for Caterers */}
      <div id="caterers-filter-container">
        <GlobalFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          totalResultsCount={caterers.length}
          onOpenMap={onOpenMap}
        />
      </div>

      {/* Main Caterers Grid Section */}
      <CaterersSection
        caterers={caterers}
        dietaryFilter={filters.dietaryFilter || 'all'}
        onSetDietaryFilter={(diet) => onFilterChange({ dietaryFilter: diet })}
        onOpenMenuModal={onOpenMenuModal}
        onBookCaterer={onBookCaterer}
        onAddToBundle={onAddToBundle}
        bundleCatererIds={bundleCatererIds}
        onOpenChatWithVendor={onOpenChatWithVendor}
      />
    </div>
  );
};
