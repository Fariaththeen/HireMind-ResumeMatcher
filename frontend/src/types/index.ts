// Job Types
export interface Job {
  id: number;
  title: string;
  description: string;
  extracted_skills: string[];
  created_at: string;
}

export interface JobCreate {
  title: string;
  description: string;
}

// Resume Types
export interface Resume {
  id: number;
  candidate_name: string | null;
  extracted_skills: string[];
  filename: string;
  uploaded_at: string;
}

// Match Types
export interface MatchRequest {
  job_id: number;
  resume_id: number;
}

export interface RecruiterSummaryType {
  executive_summary: {
    text: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  skills_alignment: Array<{
    skill: string;
    candidate_level: 'Expert' | 'Intermediate' | 'Familiar' | 'None';
    evidence: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    gap_severity: 'HIGH' | 'MODERATE' | null;
    mitigation: string | null;
    resume_location?: string | null;
  }>;
  potential_concerns: Array<{
    concern: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigating_factors: string[];
  }>;
  recommended_next_steps: {
    proceed_to_interview: boolean;
    interview_focus: string[];
  };
}

export interface MatchResult {
  job_id: number;
  job_title: string;
  resume_id: number;
  candidate_name: string | null;
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  matched_required?: string[];
  missing_required?: string[];
  matched_preferred?: string[];
  missing_preferred?: string[];
  match_details?: Array<[string, string, number]>;
  analysis: string;
  summary?: RecruiterSummaryType;
}

export interface MatchHistory {
  id: number;
  job_title: string;
  candidate_name: string | null;
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  summary?: RecruiterSummaryType;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
