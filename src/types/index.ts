// ============================================================================
// TAFA (Tourism AI for Arequipa) — Master TypeScript Definitions & Schemas
// ============================================================================

export interface Profile {
  id: string
  email: string
  full_name: string
  doc_type: 'DNI' | 'PASAPORTE' | 'CE' | 'OTRO'
  doc_number: string
  tafa_explorer_pass: string
  points_earned: number
  visited_places: number
  favorite_category?: string
  preferred_language: string
  mobility_profile: string
  last_trip?: string
  trip_days: number
  travel_style: string
  role: 'tourist' | 'admin' | 'business_ally' | 'analyst'
  created_at: string
}

export interface AccessibilityPreferences {
  id?: string
  profile_id?: string
  wheelchair_user: boolean
  cane_user: boolean
  wheelchair_accessible: boolean
  senior_citizen: boolean
  baby_stroller: boolean
  low_vision: boolean
  blindness: boolean
  hearing_impaired: boolean
  sign_language: boolean
  simplified_reading: boolean
  step_by_step_guides: boolean
  preferred_language: string
}

export interface Place {
  id: number
  name: string
  category_id?: number
  district_id?: number
  category?: string
  district?: string
  description: string
  lat: number
  lng: number
  address?: string
  opening_hours?: string
  admission_fee?: string
  official_source: string
  is_verified: boolean
  is_unexplored: boolean
  wheelchair_access: boolean
  audio_route_url?: string
  points_reward: number
  created_at?: string
}

export interface Route {
  id: string
  name: string
  summary: string
  duration_hours: number
  difficulty_level: 'fácil' | 'moderada' | 'exigente'
  is_accessible: boolean
  places?: Place[]
}

export interface Business {
  id: string
  tax_id: string
  business_name: string
  trade_name: string
  category: string
  district: string
  status: 'pending' | 'evaluation' | 'approved' | 'ally' | 'suspended' | 'retired'
  rating_score: number
  complaints_count: number
  dircetur_badge: boolean
  wheelchair_access: boolean
}

export interface Reward {
  id: string
  business_id: string
  title: string
  experience_details: string
  required_points: number
  is_active: boolean
}

export interface Application {
  id?: string
  tax_id: string
  company_name: string
  contact_email: string
  contact_phone: string
  category: string
  district: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  created_at?: string
}

export interface Review {
  id?: string
  profile_id?: string
  place_id: number
  rating: number
  comment: string
  created_at?: string
}
