import React from 'react';
import { Photographer, BundleItem, GlobalFilterState } from '../types';
import { PhotographersSection } from '../components/PhotographersSection';
import { GlobalFilterBar } from '../components/GlobalFilterBar';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { Camera, Sparkles, Film, Calendar, ShieldCheck } from 'lucide-react';

interface PhotographersPageProps {
  photographers: Photographer[];
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters: () => void;
  onSelectCategory: (cat: any) => void;
  onBookPhotographer: (photo: Photographer) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundlePhotographerIds: string[];
  onOpenChatWithVendor?: (vendor: any) => void;
  onOpenMap: () => void;
  itemCounts: {
    halls: number;
    caterers: number;
    photographers: number;
    decorations: number;
  };
}

export const PhotographersPage: React.FC<PhotographersPageProps> = ({
  photographers,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCategory,
  onBookPhotographer,
  onAddToBundle,
  bundlePhotographerIds,
  onOpenChatWithVendor,
  onOpenMap,
  itemCounts
}) => {
  return (
    <div className="w-full space-y-6">
      {/* 4-Page Header & Navigation Switcher */}
      <PageHeaderBanner
        category="photographers"
        onSelectCategory={onSelectCategory}
        totalCount={photographers.length}
        itemCounts={itemCounts}
      />

      {/* Dedicated Filter Engine for Photographers */}
      <div id="photographers-filter-container">
        <GlobalFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          totalResultsCount={photographers.length}
          onOpenMap={onOpenMap}
        />
      </div>

      {/* Main Photographers Grid Section */}
      <PhotographersSection
        photographers={photographers}
        onBookPhotographer={onBookPhotographer}
        onAddToBundle={onAddToBundle}
        bundlePhotographerIds={bundlePhotographerIds}
        onOpenChatWithVendor={onOpenChatWithVendor}
      />
    </div>
  );
};
