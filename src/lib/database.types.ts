export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  mobile: string | null;
  location: string | null;
  state: string | null;
  district: string | null;
  eco_points: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  transaction_type: 'earned' | 'spent';
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  eco_points: number;
  level: number;
  location: string;
  state: string;
  district: string;
  rank: number;
}