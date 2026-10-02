import { MarriageHall, Caterer, Photographer, DecorationTheme } from '../types';

export const OCCASIONS_LIST = [
  'All Celebrations & Milestones',
  '1st Year Birthday & Baby Milestones (Ayushya Homam, Janmadin, Cake Smash)',
  'Weddings, Engagements & Receptions (Vivaha, Sagai, Sangeet)',
  'Sacred Vedic & Traditional Rites (Upanayanam, Janeu, Griha Pravesh, Homa)',
  'Baby Showers & Motherhood (Godh Bharai, Seemantham, Valakaappu)',
  'Milestone Birthdays (Sashtiapthapoorthi 60th, Shathabhishekam 80th)',
  'Cultural & Religious Feasts (Nikah, Walima, Anand Karaj, Baptism, Navjote)',
  'Silver & Golden Anniversaries & Corporate Galas'
];

export const RELIGIONS_TRADITIONS_LIST = [
  'All Faiths & Cultural Traditions',
  'Hindu (Vedic, South Indian Brahmin, Rajputana, Bengali, Maharashtrian)',
  'Muslim (Nikah, Walima, Aqiqah, Roza Iftar, Dawat-e-Khas)',
  'Christian (Holy Matrimony, Baptism, 1st Birthday, Holy Communion)',
  'Sikh (Anand Karaj, Gurdwara Langar, Dastar Bandi, Lohri)',
  'Jain (Shubh Vivah, Sattvic, Chauvihar, Snatra Puja)',
  'Parsi (Navjote Coming-of-Age, Lagan, Jashan)',
  'Secular & Multi-Faith Grand Celebrations'
];

export interface PanIndiaCityInfo {
  city: string;
  state: string;
}

export const PAN_INDIA_CITIES: PanIndiaCityInfo[] = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi NCR', state: 'Delhi & NCR' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Udaipur', state: 'Rajasthan' },
  { city: 'Goa', state: 'Goa' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Chandigarh', state: 'Punjab / Haryana' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Amritsar', state: 'Punjab' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Jodhpur', state: 'Rajasthan' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Mysuru', state: 'Karnataka' },
  { city: 'Madurai', state: 'Tamil Nadu' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Bhubaneswar', state: 'Odisha' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Ranchi', state: 'Jharkhand' },
  { city: 'Raipur', state: 'Chhattisgarh' },
  { city: 'Guwahati', state: 'Assam' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { city: 'Vijayawada', state: 'Andhra Pradesh' },
  { city: 'Dehradun', state: 'Uttarakhand' }
];

export const PAN_INDIA_LOCATIONS_LIST = [
  'All Locations (India)',
  'Agra - Taj View & Fatehabad Road',
  'Ahmedabad - SG Highway & Riverfront',
  'Amritsar - Heritage Haveli & GT Road',
  'Bengaluru - Palace Grounds & Whitefield',
  'Bhopal - VIP Road & Upper Lake',
  'Bhubaneswar - Temple City & Khandagiri',
  'Chandigarh - Zirakpur & VIP Boulevard',
  'Chennai - ECR Beach Road & Guindy',
  'Coimbatore - Avinashi Road & Race Course',
  'Dehradun & Mussoorie - Doon Valley Hills',
  'Delhi NCR - South Delhi & Lutyens',
  'Delhi NCR - Gurugram & Golf Course Road',
  'Goa - North & South Beachfront Lawns',
  'Guwahati - Brahmaputra Riverside & Khanapara',
  'Hyderabad - Banjara Hills & Falaknuma',
  'Indore - Bypass Road & Vijay Nagar',
  'Jaipur - Amer Road & Royal Havelis',
  'Jodhpur - Umaid Bhawan & Mehrangarh View',
  'Kochi & Kerala - Backwaters & Fort Kochi',
  'Kolkata - Rajarhat & Royal Calcutta Lawns',
  'Lucknow - Gomti Nagar & Awadh Palaces',
  'Madurai - Meenakshi Heritage & Bypass',
  'Mumbai (All Sectors)',
  'Mumbai - South Bombay & Marine Drive',
  'Mumbai - Bandra & BKC Prestige Hub',
  'Mumbai - Juhu Beach & Seaside Lawns',
  'Mumbai - Worli & Lower Parel Luxury',
  'Mumbai - Dadar, Matunga & Shivaji Park Heritage',
  'Mumbai - Andheri & Airport Belt',
  'Mumbai - Powai & Central Suburbs',
  'Mumbai - Bhandup, Mulund & Kanjurmarg',
  'Mumbai - Ghatkopar, Chembur & Eastern Suburbs',
  'Mumbai - Borivali, Kandivali & Malad',
  'Mumbai - Thane & Navi Mumbai Grand Palaces',
  'Mysuru - Royal Palace Road & Chamundi Hills',
  'Nagpur - Wardha Road & Civil Lines',
  'Patna - Bailey Road & Ganga View',
  'Pune - Koregaon Park & Baner Hills',
  'Raipur - VIP Road & Naya Raipur',
  'Ranchi - Kanke Road & Morabadi',
  'Surat - Dumas Road & Diamond City Lawns',
  'Udaipur - Lake Pichola & Heritage Palaces',
  'Varanasi - Ghat View & Cantonment Palaces',
  'Vijayawada - MG Road & Krishna Riverfront',
  'Visakhapatnam - Beach Road & Rushikonda'
];
