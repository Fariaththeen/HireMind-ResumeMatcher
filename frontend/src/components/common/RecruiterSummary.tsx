import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Sparkles, 
  UserCheck, 
  UserX,
  MapPin,
  Info,
  Flame,
  CheckCircle
} from 'lucide-react';
import type { RecruiterSummaryType } from '../../types';

interface RecruiterSummaryProps {
  summary: RecruiterSummaryType;
}

export function RecruiterSummary({ summary }: RecruiterSummaryProps) {
  if (!summary) return null;

  const {
    executive_summary,
    skills_alignment = [],
    potential_concerns = [],
    recommended_next_steps
  } = summary;

  // Helpers for styling confidence levels
  const getConfidenceBadge = (confidence: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (confidence) {
      case 'HIGH':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'LOW':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getCandidateLevelBadge = (level: 'Expert' | 'Intermediate' | 'Familiar' | 'None') => {
    switch (level) {
      case 'Expert':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Familiar':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'None':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getSeverityBadge = (severity: 'High' | 'Medium' | 'Low' | 'HIGH' | 'MODERATE') => {
    const sev = severity.toUpperCase();
    switch (sev) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MODERATE':
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in mt-6">
      
      {/* Executive Decision & Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        
        {/* Recommendation Indicator Box */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">RAG Assessment</span>
          
          {recommended_next_steps?.proceed_to_interview ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-400/30 mb-4 animate-pulse">
                <UserCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-emerald-400 tracking-tight">Proceed to Interview</h4>
              <p className="text-[11px] text-gray-300 mt-1">Skills criteria match role benchmarks</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center border border-amber-400/30 mb-4">
                <UserX className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-amber-400 tracking-tight">Interview Discretion</h4>
              <p className="text-[11px] text-gray-300 mt-1">Significant skill alignment gaps observed</p>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs">
            <span className="text-gray-400 font-bold uppercase tracking-wider">Confidence</span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black tracking-wider uppercase ${
              executive_summary?.confidence === 'HIGH' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
              executive_summary?.confidence === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
              'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              {executive_summary?.confidence || 'MEDIUM'}
            </span>
          </div>
        </div>

        {/* Summary Text Content */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Recruiter Executive Brief</h3>
            </div>
            <p className="text-base sm:text-lg font-medium text-gray-100 leading-relaxed">
              {executive_summary?.text || "No summary notes provided."}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold bg-white/5 w-fit px-3 py-1.5 rounded-xl border border-white/5">
            <Info className="w-4.5 h-4.5 text-indigo-400" />
            <span>Generated from RAG Knowledge Base and semantic resume matching context.</span>
          </div>
        </div>

      </div>

      {/* Skills Alignment Matrix Table */}
      {skills_alignment.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">Skills Alignment Matrix</h3>
              <p className="text-xs text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Targeted competency evaluation</p>
            </div>
            <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-2xl">
              {skills_alignment.filter(s => s.candidate_level !== 'None').length} / {skills_alignment.length} Competencies
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4">Skill Requirement</th>
                  <th className="px-6 py-4">Candidate Level</th>
                  <th className="px-6 py-4">Evidence / Gap Info</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Action / Mitigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                {skills_alignment.map((item, index) => (
                  <tr key={`${item.skill}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Skill Badge */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="font-extrabold text-gray-900 text-sm block">{item.skill}</span>
                      {item.resume_location && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          {item.resume_location}
                        </span>
                      )}
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-lg border text-[10px] font-extrabold tracking-wide uppercase ${getCandidateLevelBadge(item.candidate_level)}`}>
                        {item.candidate_level}
                      </span>
                    </td>

                    {/* Evidence */}
                    <td className="px-6 py-4.5 max-w-sm">
                      <p className={`line-clamp-2 ${item.candidate_level === 'None' ? 'text-gray-400 italic' : 'text-gray-600'}`}>
                        {item.evidence || "No evidence text snippet available."}
                      </p>
                    </td>

                    {/* Confidence */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${getConfidenceBadge(item.confidence)}`}>
                        {item.confidence}
                      </span>
                    </td>

                    {/* Gap Severity & Mitigation */}
                    <td className="px-6 py-4.5 max-w-xs">
                      {item.gap_severity ? (
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded-md border text-[9px] font-black tracking-wider uppercase ${getSeverityBadge(item.gap_severity)}`}>
                            {item.gap_severity} GAP
                          </span>
                          <p className="text-[11px] text-amber-800 leading-tight">
                            {item.mitigation}
                          </p>
                        </div>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Validated
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Potential Concerns */}
      {potential_concerns.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">Potential Concerns & Risks</h3>
              <p className="text-xs text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Identified gaps or candidate anomalies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {potential_concerns.map((concern, idx) => (
              <div 
                key={`${concern.concern}-${idx}`}
                className="bg-rose-50/20 border border-rose-100/50 rounded-2xl p-5 relative overflow-hidden"
              >
                {/* Severity Badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-black tracking-wider uppercase ${getSeverityBadge(concern.severity)}`}>
                    {concern.severity} Severity
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-gray-900 mb-3">{concern.concern}</h4>

                {concern.mitigating_factors && concern.mitigating_factors.length > 0 && (
                  <div className="space-y-1.5 border-t border-rose-100/50 pt-3">
                    <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider block">Mitigating Factors</span>
                    <ul className="list-none space-y-1">
                      {concern.mitigating_factors.map((factor, fIdx) => (
                        <li key={fIdx} className="text-xs text-gray-600 flex items-start gap-1.5 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Steps & Interview Focus */}
      {recommended_next_steps?.interview_focus && recommended_next_steps.interview_focus.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">Recommended Interview Focus</h3>
              <p className="text-xs text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Suggested deep-dives for the recruiting team</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {recommended_next_steps.interview_focus.map((focus, index) => (
              <div 
                key={index} 
                className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl items-start hover:border-indigo-100 transition-colors"
              >
                <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-800 leading-relaxed font-semibold">
                    {focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
