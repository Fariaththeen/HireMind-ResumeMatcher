import { useState } from 'react';
import { ArrowRight, Trophy, Target, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useJobs } from '../hooks/useJobs';
import { useResumes } from '../hooks/useResumes';
import { useCalculateScore } from '../hooks/useMatching';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { RecruiterSummary } from '../components/common/RecruiterSummary';
import { toast } from 'sonner';
import type { MatchResult } from '../types';

export function MatchingPage() {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const { data: jobs } = useJobs();
  const { data: resumes } = useResumes();
  const calculateScore = useCalculateScore();

  const handleMatch = async () => {
    if (!selectedJobId || !selectedResumeId) {
      toast.error('Please select both a job and a resume');
      return;
    }

    try {
      const result = await calculateScore.mutateAsync({
        job_id: selectedJobId,
        resume_id: selectedResumeId,
      });
      setMatchResult(result);
      toast.success('Match score calculated!');
    } catch (error) {
      toast.error('Failed to calculate match score');
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Match & Score</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Cross-compare candidate skills against active job specifications</p>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Job Selection */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 hover:shadow-md transition duration-300">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Job Specification</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target Position</span>
            </div>
          </div>
          <select
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(Number(e.target.value))}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all duration-300 text-sm font-semibold placeholder-gray-400 bg-white cursor-pointer"
          >
            <option value="">Choose a job position...</option>
            {jobs?.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.extracted_skills?.length || 0} requirements)
              </option>
            ))}
          </select>
        </div>

        {/* Resume Selection */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 hover:shadow-md transition duration-300">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shadow-inner">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Candidate Profile</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Indexed Resume</span>
            </div>
          </div>
          <select
            value={selectedResumeId || ''}
            onChange={(e) => setSelectedResumeId(Number(e.target.value))}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all duration-300 text-sm font-semibold placeholder-gray-400 bg-white cursor-pointer"
          >
            <option value="">Choose a resume file...</option>
            {resumes?.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.candidate_name || 'Anonymous Candidate'} ({resume.filename})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Match Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleMatch}
          disabled={!selectedJobId || !selectedResumeId || calculateScore.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 py-6 font-bold shadow-lg shadow-indigo-600/10 text-base flex items-center gap-2.5 transition duration-300 disabled:opacity-50"
        >
          {calculateScore.isPending ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              Calculating match metrics...
            </div>
          ) : (
            <>
              Calculate Match Score
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>

      {/* Match Result Display */}
      {matchResult && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 animate-slide-up relative overflow-hidden">
          {/* Glass decorative background blob */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-indigo-50/50 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-gray-100 pb-8 mb-8 relative z-10">
            
            {/* Round score display column */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg shadow-indigo-600/20 text-white flex-col border-4 border-indigo-100">
                <span className="text-3xl font-black">{matchResult.score.toFixed(0)}%</span>
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Match Index</span>
              </div>
            </div>

            {/* Score progress details */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI Matching Analysis</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase mt-0.5 tracking-wider">Evaluation Report</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Match Strength</span>
                  <span>{matchResult.score.toFixed(1)}%</span>
                </div>
                <Progress value={matchResult.score} className="h-3.5 bg-gray-100 rounded-full [&>div]:bg-indigo-600" />
              </div>
            </div>

          </div>

          {matchResult.summary ? (
            <RecruiterSummary summary={matchResult.summary} />
          ) : (
            <>
              {/* Detailed Analysis Output */}
              <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-[2rem] p-6 mb-8 relative">
                <h4 className="font-extrabold text-sm text-indigo-950 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  AI Recommendation & Summary
                </h4>
                <p className="text-xs text-indigo-900 leading-relaxed font-semibold whitespace-pre-line">
                  {matchResult.analysis}
                </p>
              </div>

              {/* Skills Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Matched Skills */}
                <div className="bg-green-50/20 border border-green-100/40 rounded-[2rem] p-6">
                  <h4 className="font-extrabold text-sm text-green-800 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 bg-green-100 text-green-600 rounded-full p-1 border border-green-200/50" />
                    Matched Skills ({matchResult.matched_skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matched_skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {matchResult.matched_skills.length === 0 && (
                      <p className="text-gray-400 text-xs italic">No matching skills found in candidate profile.</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-red-50/20 border border-red-100/40 rounded-[2rem] p-6">
                  <h4 className="font-extrabold text-sm text-red-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 bg-red-100 text-red-600 rounded-full p-1 border border-red-200/50" />
                    Missing Core Skills ({matchResult.missing_skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missing_skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg border border-red-100/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {matchResult.missing_skills.length === 0 && (
                      <p className="text-green-700 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-xl w-fit">
                        Full Skill coverage! Excellent Candidate match!
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
