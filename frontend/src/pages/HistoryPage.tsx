import { useState } from 'react';
import { useMatchHistory } from '../hooks/useMatching';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { RecruiterSummary } from '../components/common/RecruiterSummary';
import { Search, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Calendar, User, Briefcase, Award } from 'lucide-react';

export function HistoryPage() {
  const { data: matchHistory, isLoading, error } = useMatchHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-12">Error loading match history</div>;

  const filteredHistory = matchHistory?.filter(
    (match) =>
      match.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (match.candidate_name && match.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const toggleExpand = (id: number) => {
    if (expandedMatchId === id) {
      setExpandedMatchId(null);
    } else {
      setExpandedMatchId(id);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Matching History</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Audit and review all previous resume evaluations and scores</p>
      </div>

      {/* Search and Filters block */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by position or candidate..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all duration-300 text-sm font-semibold placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {filteredHistory.length} match records found
        </div>
      </div>

      {/* History Items list */}
      <div className="space-y-4">
        {filteredHistory.map((match, idx) => {
          const isExpanded = expandedMatchId === match.id;
          return (
            <div
              key={match.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Header Details (Clickable) */}
              <div
                onClick={() => toggleExpand(match.id)}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className={`p-2 rounded-xl shrink-0 ${
                      idx % 3 === 0 ? 'bg-indigo-50 text-indigo-600' : idx % 3 === 1 ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      <Briefcase className="w-4.5 h-4.5" />
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 truncate">
                      {match.job_title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-300 shrink-0" />
                      <span className="text-gray-500">{match.candidate_name || 'Anonymous Candidate'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-300 shrink-0" />
                      <span className="text-gray-500">{new Date(match.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Match Score</span>
                    <span
                      className={`text-lg font-black px-3 py-1 rounded-xl ${
                        match.score >= 80 ? 'text-green-700 bg-green-50 border border-green-100/50' :
                        match.score >= 60 ? 'text-indigo-700 bg-indigo-50 border border-indigo-100/50' :
                        match.score >= 40 ? 'text-yellow-700 bg-yellow-50 border border-yellow-100/50' :
                        'text-red-700 bg-red-50 border border-red-100/50'
                      }`}
                    >
                      {match.score.toFixed(0)}%
                    </span>
                  </div>
                  <button className="p-2 bg-gray-50 text-gray-400 rounded-xl">
                    {isExpanded ? (
                      <ChevronUp className="w-4.5 h-4.5" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded details container */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-[#fafbfc] space-y-6">
                  
                  {match.summary ? (
                    <RecruiterSummary summary={match.summary} />
                  ) : (
                    <>
                      {/* AI Recommendation Summary */}
                      <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-5 mt-4">
                        <h4 className="font-extrabold text-xs text-indigo-950 uppercase tracking-wider mb-2">
                          AI Recommendation & Feedback
                        </h4>
                        <p className="text-xs text-indigo-900 leading-relaxed font-semibold">
                          {match.score >= 80 
                            ? "Excellent alignment. The candidate profile exhibits strong competency matching the core skill requirements for this position. Highly recommended for immediate technical evaluation."
                            : match.score >= 60 
                            ? "Satisfactory match. The candidate possesses several foundational skills. Some core requirements are missing, but they may be offset by transferable competencies."
                            : match.score >= 40 
                            ? "Borderline candidate. Significant skill gaps identified. Consider for junior roles or construct targeted interview questions around missing requirements."
                            : "Weak matching indices. Major skill discrepancies detected. The candidate does not meet the baseline prerequisites outlined for this position."
                          }
                        </p>
                      </div>

                      {/* Skill breakdown grids */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Matched Skills */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Matched Skills ({match.matched_skills.length})
                          </h4>
                          {match.matched_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {match.matched_skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100/50"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic font-semibold">No skills matched.</p>
                          )}
                        </div>

                        {/* Missing Skills */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Missing Skills ({match.missing_skills.length})
                          </h4>
                          {match.missing_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {match.missing_skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-100/50"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg w-fit font-bold">
                              All skills covered! Perfect match!
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty history template */}
        {filteredHistory.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100/60 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <Award className="h-8 w-8 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-gray-900">No match records found</h3>
            <p className="text-gray-500 text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
              {searchTerm ? 'No evaluations match your search criteria. Try a different query.' : 'Perform candidate matching to store and audit evaluation histories here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
