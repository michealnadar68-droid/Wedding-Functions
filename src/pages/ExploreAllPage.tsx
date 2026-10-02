import React from 'react';
import { 
  MarriageHall, 
  Caterer, 
  Photographer, 
  DecorationTheme, 
  BundleItem, 
  GlobalFilterState, 
  PricePackage 
} from '../types';
import { MarriageHallsSection } from '../components/MarriageHallsSection';
import { CaterersSection } from '../components/CaterersSection';
import { PhotographersSection } from '../components/PhotographersSection';
import { DecorationsSection } from '../components/DecorationsSection';
import { GlobalFilterBar } from '../components/GlobalFilterBar';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { HeroBanner } from '../components/HeroBanner';

interface ExploreAllPageProps {
  halls: MarriageHall[];
  caterers: Caterer[];
  photographers: Photographer[];
  decorations: DecorationTheme[];
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters: () => void;
  onSelectCategory: (cat: any) => void;
  onBookHall: (hall: MarriageHall, selectedPkg?: PricePackage) => void;
  onOpenMenuModal: (caterer: Caterer) => void;
  onBookCaterer: (caterer: Caterer, estimatedTotal: number, guests: number) => void;
  onBookPhotographer: (photo: Photographer) => void;
  onToggleLike: (themeId: string) => void;
  onBookDecor: (decor: DecorationTheme) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundleIds: {
    hall: string[];
    caterer: string[];
    photographer: string[];
    decor: string[];
  };
  onOpenChatWithVendor?: (vendor: any) => void;
  onViewOnMap?: (hall: MarriageHall) => void;
  onOpenMap: () => void;
  onOpenMultiRolePortal?: (role?: any) => void;
  itemCounts: {
    halls: number;
    caterers: number;
    photographers: number;
    decorations: number;
  };
}

export const ExploreAllPage: React.FC<ExploreAllPageProps> = ({
  halls,
  caterers,
  photographers,
  decorations,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectCategory,
  onBookHall,
  onOpenMenuModal,
  onBookCaterer,
  onBookPhotographer,
  onToggleLike,
  onBookDecor,
  onAddToBundle,
  bundleIds,
  onOpenChatWithVendor,
  onViewOnMap,
  onOpenMap,
  onOpenMultiRolePortal,
  itemCounts
}) => {
  return (
    <div className="w-full space-y-8">
      {/* Hero Welcome Banner */}
      <HeroBanner
        activeCategory={filters.category}
        onSelectCategory={onSelectCategory}
        totalHallsCount={itemCounts.halls}
        totalCaterersCount={itemCounts.caterers}
        totalPhotographersCount={itemCounts.photographers}
        totalDecorsCount={itemCounts.decorations}
        onOpenMultiRolePortal={onOpenMultiRolePortal}
      />

      {/* 4-Page Header & Navigation Switcher */}
      <PageHeaderBanner
        category="all"
        onSelectCategory={onSelectCategory}
        totalCount={halls.length + caterers.length + photographers.length + decorations.length}
        itemCounts={itemCounts}
      />

      {/* Global Filter Bar */}
      <div id="explore-all-filter-container">
        <GlobalFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          totalResultsCount={halls.length + caterers.length + photographers.length + decorations.length}
          onOpenMap={onOpenMap}
        />
      </div>

      {/* 4 Sector Previews */}
      <div className="space-y-16">
        <MarriageHallsSection
          halls={halls}
          topRatedOnly={filters.hallTopRatedOnly || false}
          onToggleTopRated={() => onFilterChange({ hallTopRatedOnly: !filters.hallTopRatedOnly })}
          onBookHall={onBookHall}
          onAddToBundle={onAddToBundle}
          bundleHallIds={bundleIds.hall}
          onOpenChatWithVendor={onOpenChatWithVendor}
          onViewOnMap={onViewOnMap}
        />

        <CaterersSection
          caterers={caterers}
          dietaryFilter={filters.dietaryFilter || 'all'}
          onSetDietaryFilter={(diet) => onFilterChange({ dietaryFilter: diet })}
          onOpenMenuModal={onOpenMenuModal}
          onBookCaterer={onBookCaterer}
          onAddToBundle={onAddToBundle}
          bundleCatererIds={bundleIds.caterer}
          onOpenChatWithVendor={onOpenChatWithVendor}
        />

        <PhotographersSection
          photographers={photographers}
          onBookPhotographer={onBookPhotographer}
          onAddToBundle={onAddToBundle}
          bundlePhotographerIds={bundleIds.photographer}
          onOpenChatWithVendor={onOpenChatWithVendor}
        />

        <DecorationsSection
          decorations={decorations}
          activeSort={filters.decorSortBy || 'default'}
          onSetSort={(sort) => onFilterChange({ decorSortBy: sort })}
          onToggleLike={onToggleLike}
          onBookDecor={onBookDecor}
          onAddToBundle={onAddToBundle}
          bundleDecorIds={bundleIds.decor}
          onOpenChatWithVendor={onOpenChatWithVendor}
        />
      </div>
    </div>
  );
};
