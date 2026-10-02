/**
 * Standard Indian Currency (INR / ₹) and Localization Formatting Utilities
 */

/**
 * Format a number into standard Indian Rupee notation (e.g. ₹15,00,000 or ₹1,850)
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  if (compact) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
      return `₹${cr} Cr`;
    }
    if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(2).replace(/\.00$/, '');
      return `₹${lakhs} Lakh`;
    }
    if (amount >= 1000) {
      const k = (amount / 1000).toFixed(1).replace(/\.0$/, '');
      return `₹${k}k`;
    }
    return `₹${amount}`;
  }

  // Standard Indian comma separator notation (en-IN)
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

/**
 * Format per plate pricing for caterers in INR
 */
export function formatPerPlate(amount: number): string {
  return `${formatINR(amount)}/plate`;
}

/**
 * Format per day pricing for photographers in INR
 */
export function formatPerDay(amount: number): string {
  return `${formatINR(amount)}/day`;
}

/**
 * Format distance in Kilometers
 */
export function formatDistanceKm(kmOrMiles: number): string {
  if (kmOrMiles <= 0) return 'Nearby';
  if (kmOrMiles < 1) return `${Math.round(kmOrMiles * 1000)} m`;
  return `${kmOrMiles.toFixed(1)} km`;
}
