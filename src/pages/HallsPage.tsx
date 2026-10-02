import React from 'react';
import { MarriageHall, PricePackage, BundleItem, GlobalFilterState } from '../types';
import { MarriageHallsSection } from '../components/MarriageHallsSection';
import { GlobalFilterBar } from '../components/GlobalFilterBar';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { Building2, Sparkles, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HallsPageProps {
  halls: MarriageHall[];
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters: () => void;
  onSelectCategory: (cat: any) => void;
  onBookHall: (hall: MarriageHall, selectedPkg?: PricePackage) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundleHallIds: string[];
  onOpenChatWithVendor?: (vendor: any) => void;
  onViewOnMap?: (hall: MarriageHall) => void;
  onOpenMap: () => void;
  itemCounts: {
    halls: number;
    caterers: number;
    photographers: number;
    decorations: number;
  };
}

export const HallsPage: React.FC<HallsPageProps> = ({
  halls,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCategory,
  onBookHall,
  onAddToBundle,
  bundleHallIds,
  onOpenChatWithVendor,
  onViewOnMap,
  onOpenMap,
  itemCounts
}) => {
  return (
    <div className="w-full space-y-6">
      {/* 4-Page Header & Navigation Switcher */}
      <PageHeaderBanner
        category="halls"
        onSelectCategory={onSelectCategory}
        totalCount={halls.length}
        itemCounts={itemCounts}
      />

      {/* Dedicated Filter Engine for Marriage Halls */}
      <div id="halls-filter-container">
        <GlobalFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          totalResultsCount={halls.length}
          onOpenMap={onOpenMap}
        />
      </div>

      {/* Main Halls Grid Section */}
      <MarriageHallsSection
        halls={halls}
        topRatedOnly={filters.hallTopRatedOnly || false}
        onToggleTopRated={() => onFilterChange({ hallTopRatedOnly: !filters.hallTopRatedOnly })}
        onBookHall={onBookHall}
        onAddToBundle={onAddToBundle}
        bundleHallIds={bundleHallIds}
        onOpenChatWithVendor={onOpenChatWithVendor}
        onViewOnMap={onViewOnMap}
      />
    </div>
  );
};
