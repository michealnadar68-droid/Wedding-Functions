import React from 'react';
import { DecorationTheme, BundleItem, GlobalFilterState } from '../types';
import { DecorationsSection } from '../components/DecorationsSection';
import { GlobalFilterBar } from '../components/GlobalFilterBar';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { Palette, Sparkles, Heart, Crown, ShieldCheck } from 'lucide-react';

interface DecorationsPageProps {
  decorations: DecorationTheme[];
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters: () => void;
  onSelectCategory: (cat: any) => void;
  onToggleLike: (themeId: string) => void;
  onBookDecor: (decor: DecorationTheme) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundleDecorIds: string[];
  onOpenChatWithVendor?: (vendor: any) => void;
  onOpenMap: () => void;
  itemCounts: {
    halls: number;
    caterers: number;
    photographers: number;
    decorations: number;
  };
}

export const DecorationsPage: React.FC<DecorationsPageProps> = ({
  decorations,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCategory,
  onToggleLike,
  onBookDecor,
  onAddToBundle,
  bundleDecorIds,
  onOpenChatWithVendor,
  onOpenMap,
  itemCounts
}) => {
  return (
    <div className="w-full space-y-6">
      {/* 4-Page Header & Navigation Switcher */}
      <PageHeaderBanner
        category="decorations"
        onSelectCategory={onSelectCategory}
        totalCount={decorations.length}
        itemCounts={itemCounts}
      />

      {/* Dedicated Filter Engine for Decor Themes */}
      <div id="decorations-filter-container">
        <GlobalFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          totalResultsCount={decorations.length}
          onOpenMap={onOpenMap}
        />
      </div>

      {/* Main Decor Staging Grid Section */}
      <DecorationsSection
        decorations={decorations}
        activeSort={filters.decorSortBy || 'default'}
        onSetSort={(sort) => onFilterChange({ decorSortBy: sort })}
        onToggleLike={onToggleLike}
        onBookDecor={onBookDecor}
        onAddToBundle={onAddToBundle}
        bundleDecorIds={bundleDecorIds}
        onOpenChatWithVendor={onOpenChatWithVendor}
      />
    </div>
  );
};
