export interface IndianLocationInfo {
  id: string;
  name: string;
  shortLabel: string;
  state: string;
  latitude: number;
  longitude: number;
  isMumbai: boolean;
}

export const INDIAN_WEDDING_HUBS: IndianLocationInfo[] = [
  // A
  { id: 'agra', name: 'Agra - Taj View & Fatehabad Road', shortLabel: 'Agra Taj Hub', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, isMumbai: false },
  { id: 'ahmedabad', name: 'Ahmedabad - SG Highway & Riverfront', shortLabel: 'Ahmedabad Grand', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, isMumbai: false },
  { id: 'amritsar', name: 'Amritsar - Heritage Haveli & GT Road', shortLabel: 'Amritsar Heritage', state: 'Punjab', latitude: 31.6340, longitude: 74.8723, isMumbai: false },
  
  // B
  { id: 'bengaluru', name: 'Bengaluru - Palace Grounds & Whitefield', shortLabel: 'Bengaluru Gardens', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, isMumbai: false },
  { id: 'bhopal', name: 'Bhopal - VIP Road & Upper Lake', shortLabel: 'Bhopal Lake View', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, isMumbai: false },
  { id: 'bhubaneswar', name: 'Bhubaneswar - Temple City & Khandagiri', shortLabel: 'Bhubaneswar Temple City', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, isMumbai: false },
  
  // C
  { id: 'chandigarh', name: 'Chandigarh - Zirakpur & VIP Boulevard', shortLabel: 'Chandigarh Tri-City', state: 'Punjab / Haryana', latitude: 30.7333, longitude: 76.7794, isMumbai: false },
  { id: 'chennai', name: 'Chennai - ECR Beach Road & Guindy', shortLabel: 'Chennai ECR Coast', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, isMumbai: false },
  { id: 'coimbatore', name: 'Coimbatore - Avinashi Road & Race Course', shortLabel: 'Coimbatore Hills', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, isMumbai: false },
  
  // D
  { id: 'dehradun', name: 'Dehradun & Mussoorie - Doon Valley Hills', shortLabel: 'Dehradun Mussoorie', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322, isMumbai: false },
  { id: 'delhi', name: 'Delhi NCR - South Delhi & Lutyens', shortLabel: 'Delhi NCR Lutyens', state: 'Delhi NCR', latitude: 28.6139, longitude: 77.2090, isMumbai: false },
  
  // G
  { id: 'goa', name: 'Goa - North & South Beachfront Lawns', shortLabel: 'Goa Coast', state: 'Goa', latitude: 15.2993, longitude: 74.1240, isMumbai: false },
  { id: 'guwahati', name: 'Guwahati - Brahmaputra Riverside & Khanapara', shortLabel: 'Guwahati Riverside', state: 'Assam', latitude: 26.1445, longitude: 91.7362, isMumbai: false },
  
  // H
  { id: 'hyderabad', name: 'Hyderabad - Banjara Hills & Falaknuma', shortLabel: 'Hyderabad Nizam Estates', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, isMumbai: false },
  
  // I
  { id: 'indore', name: 'Indore - Bypass Road & Vijay Nagar', shortLabel: 'Indore Royal', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, isMumbai: false },
  
  // J
  { id: 'jaipur', name: 'Jaipur - Amer Road & Royal Havelis', shortLabel: 'Jaipur Pink City', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, isMumbai: false },
  { id: 'jodhpur', name: 'Jodhpur - Umaid Bhawan & Mehrangarh View', shortLabel: 'Jodhpur Sun City', state: 'Rajasthan', latitude: 26.2389, longitude: 73.0243, isMumbai: false },
  
  // K
  { id: 'kochi', name: 'Kochi & Kerala - Backwaters & Fort Kochi', shortLabel: 'Kochi & Backwaters', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, isMumbai: false },
  { id: 'kolkata', name: 'Kolkata - Rajarhat & Royal Calcutta Lawns', shortLabel: 'Kolkata Heritage', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, isMumbai: false },
  
  // L
  { id: 'lucknow', name: 'Lucknow - Gomti Nagar & Awadh Palaces', shortLabel: 'Lucknow Awadh', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, isMumbai: false },
  
  // M
  { id: 'madurai', name: 'Madurai - Meenakshi Heritage & Bypass', shortLabel: 'Madurai Temple City', state: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, isMumbai: false },
  { id: 'mumbai-south', name: 'Mumbai - South Bombay & Marine Drive', shortLabel: 'South Mumbai', state: 'Maharashtra', latitude: 18.9220, longitude: 72.8347, isMumbai: true },
  { id: 'mumbai-bandra', name: 'Mumbai - Bandra & BKC Prestige Hub', shortLabel: 'Bandra & BKC', state: 'Maharashtra', latitude: 19.0600, longitude: 72.8680, isMumbai: true },
  { id: 'mumbai-juhu', name: 'Mumbai - Juhu Beach & Seaside Lawns', shortLabel: 'Juhu Beach', state: 'Maharashtra', latitude: 19.1025, longitude: 72.8263, isMumbai: true },
  { id: 'mumbai-worli', name: 'Mumbai - Worli & Lower Parel Luxury', shortLabel: 'Worli & Lower Parel', state: 'Maharashtra', latitude: 19.0017, longitude: 72.8277, isMumbai: true },
  { id: 'mumbai-powai', name: 'Mumbai - Powai & Central Suburbs', shortLabel: 'Powai Lake', state: 'Maharashtra', latitude: 19.1176, longitude: 72.9060, isMumbai: true },
  { id: 'mumbai-andheri', name: 'Mumbai - Andheri & Airport Belt', shortLabel: 'Andheri & Airport', state: 'Maharashtra', latitude: 19.1136, longitude: 72.8697, isMumbai: true },
  { id: 'mumbai-navi', name: 'Mumbai - Thane & Navi Mumbai Grand Palaces', shortLabel: 'Navi Mumbai & Thane', state: 'Maharashtra', latitude: 19.0330, longitude: 73.0297, isMumbai: true },
  { id: 'mysuru', name: 'Mysuru - Royal Palace Road & Chamundi Hills', shortLabel: 'Mysuru Palace District', state: 'Karnataka', latitude: 12.2958, longitude: 76.6394, isMumbai: false },
  
  // N
  { id: 'nagpur', name: 'Nagpur - Wardha Road & Civil Lines', shortLabel: 'Nagpur Central Hub', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, isMumbai: false },
  
  // P
  { id: 'patna', name: 'Patna - Bailey Road & Ganga View', shortLabel: 'Patna Heritage', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, isMumbai: false },
  { id: 'pune', name: 'Pune - Koregaon Park & Baner Hills', shortLabel: 'Pune Heritage & Baner', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, isMumbai: false },
  
  // R
  { id: 'raipur', name: 'Raipur - VIP Road & Naya Raipur', shortLabel: 'Raipur Grand Hub', state: 'Chhattisgarh', latitude: 21.2514, longitude: 81.6296, isMumbai: false },
  { id: 'ranchi', name: 'Ranchi - Kanke Road & Morabadi', shortLabel: 'Ranchi Green Valley', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096, isMumbai: false },
  
  // S
  { id: 'surat', name: 'Surat - Dumas Road & Diamond City Lawns', shortLabel: 'Surat Grand Hub', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, isMumbai: false },
  
  // U
  { id: 'udaipur', name: 'Udaipur - Lake Pichola & Heritage Palaces', shortLabel: 'Udaipur Palace District', state: 'Rajasthan', latitude: 24.5854, longitude: 73.7125, isMumbai: false },
  
  // V
  { id: 'varanasi', name: 'Varanasi - Ghat View & Cantonment Palaces', shortLabel: 'Varanasi Ghats & Cantt', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, isMumbai: false },
  { id: 'vijayawada', name: 'Vijayawada - MG Road & Krishna Riverfront', shortLabel: 'Vijayawada Riverfront', state: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480, isMumbai: false },
  { id: 'visakhapatnam', name: 'Visakhapatnam - Beach Road & Rushikonda', shortLabel: 'Vizag Beachfront', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185, isMumbai: false }
];

// Calculate Haversine distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface GeolocationResult {
  matchedLocation: string;
  cityLabel: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  isNearMumbai: boolean;
  distanceToHubKm: number;
  source: 'gps' | 'ip' | 'default_mumbai';
}

export async function detectCurrentIndianLocation(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({
        matchedLocation: 'Mumbai (All Sectors)',
        cityLabel: 'Mumbai, Maharashtra, India',
        latitude: 18.9220,
        longitude: 72.8347,
        isNearMumbai: true,
        distanceToHubKm: 0,
        source: 'default_mumbai'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Find closest Indian wedding hub
        let closestHub = INDIAN_WEDDING_HUBS[0];
        let minDistance = Number.MAX_VALUE;

        for (const hub of INDIAN_WEDDING_HUBS) {
          const dist = getDistanceKm(latitude, longitude, hub.latitude, hub.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closestHub = hub;
          }
        }

        // If distance is less than 3500km (within South Asia / India region)
        const isNearMumbai = minDistance < 50 && closestHub.isMumbai;

        resolve({
          matchedLocation: closestHub.name,
          cityLabel: `${closestHub.shortLabel}, ${closestHub.state}, India`,
          latitude,
          longitude,
          accuracyMeters: Math.round(accuracy),
          isNearMumbai,
          distanceToHubKm: Math.round(minDistance),
          source: 'gps'
        });
      },
      (error) => {
        console.info('Geolocation access not granted or unavailable, defaulting to Mumbai:', error.message);
        resolve({
          matchedLocation: 'Mumbai (All Sectors)',
          cityLabel: 'Mumbai, Maharashtra, India (Default)',
          latitude: 19.0760,
          longitude: 72.8777,
          isNearMumbai: true,
          distanceToHubKm: 0,
          source: 'default_mumbai'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  });
}
