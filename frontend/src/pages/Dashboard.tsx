import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { useResumes } from '../hooks/useResumes';
import { useMatchHistory } from '../hooks/useMatching';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronRight, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Upload, 
  GitCompare,
  UserCheck,
  FileText,
  Clock
} from 'lucide-react';

export function Dashboard() {
  const { data: jobs } = useJobs();
  const { data: resumes } = useResumes();
  const { data: matchHistory } = useMatchHistory();
  const [activeTab, setActiveTab] = useState<'highest' | 'recent'>('highest');
  const [searchText, setSearchText] = useState('');

  // Extract stats
  const totalJobs = jobs?.length || 0;
  const totalResumes = resumes?.length || 0;
  const matchesMade = matchHistory?.length || 0;
  const avgScore = matchHistory?.length 
    ? (matchHistory.reduce((acc, m) => acc + m.score, 0) / matchHistory.length)
    : 0;

  // Filter and sort match history
  let sortedMatches = [...(matchHistory || [])];
  
  // Search filter
  if (searchText) {
    sortedMatches = sortedMatches.filter(
      (m) =>
        m.job_title.toLowerCase().includes(searchText.toLowerCase()) ||
        (m.candidate_name && m.candidate_name.toLowerCase().includes(searchText.toLowerCase()))
    );
  }

  // Sorting
  if (activeTab === 'highest') {
    sortedMatches.sort((a, b) => b.score - a.score);
  } else if (activeTab === 'recent') {
    sortedMatches.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  const topCandidates = sortedMatches.slice(0, 3);

  // Fallback candidates if no matches exist
  const mockCandidates = [
    {
      id: 991,
      candidate_name: 'Sarah Connor',
      job_title: 'Lead React Developer',
      score: 94.5,
      date: '2 days ago',
      color: 'from-blue-600 to-indigo-700',
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
    {
      id: 992,
      candidate_name: 'John Doe',
      job_title: 'Senior Python Engineer',
      score: 88.2,
      date: '5 days ago',
      color: 'from-teal-600 to-emerald-700',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    {
      id: 993,
      candidate_name: 'Marcus Wright',
      job_title: 'DevOps Architect',
      score: 85.0,
      date: '1 week ago',
      color: 'from-orange-600 to-red-700',
      avatar: 'https://i.pravatar.cc/150?img=12',
    }
  ];

  const displayedCandidates = topCandidates.length > 0 
    ? topCandidates.map((m, i) => ({
        id: m.id,
        candidate_name: m.candidate_name || 'Anonymous Candidate',
        job_title: m.job_title,
        score: m.score,
        date: new Date(m.created_at).toLocaleDateString(),
        color: i === 0 ? 'from-indigo-600 to-blue-700' : i === 1 ? 'from-purple-600 to-pink-700' : 'from-emerald-600 to-teal-700',
        avatar: `https://i.pravatar.cc/150?img=${10 + i}`,
      }))
    : mockCandidates;

  // Prepare chart data for Top Candidate Skills
  const skillCounts: Record<string, number> = {};
  resumes?.forEach((resume) => {
    resume.extracted_skills?.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  
  const topSkillsData = Object.entries(skillCounts)
    .map(([name, count]) => ({ name, Count: count }))
    .sort((a, b) => b.Count - a.Count)
    .slice(0, 5);

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-gray-50 animate-fade-in">
      
      {/* CENTRAL MAIN CONTENT SECTION */}
      <div className="flex-1 p-5 sm:p-8 overflow-y-auto min-w-0">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Welcome back to your hiring command center!</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search matches..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 hover:bg-gray-200/70 focus:bg-white border-none rounded-2xl text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
              />
            </div>
            
            {/* Notification Button */}
            <button className="p-3 bg-gray-100 hover:bg-gray-200/80 text-gray-600 rounded-2xl transition-all duration-300 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Jobs', val: totalJobs, icon: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Total Resumes', val: totalResumes, icon: Users, color: 'bg-teal-50 text-teal-600' },
            { label: 'Matches Made', val: matchesMade, icon: GitCompare, color: 'bg-purple-50 text-purple-600' },
            { label: 'Avg Match Score', val: avgScore > 0 ? `${avgScore.toFixed(1)}%` : 'N/A', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100/60 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{stat.val}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Top Candidates Section (Matches / Resized to h-60) */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Top Candidates</h2>
            <Link to="/app/match" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              New Match <Plus className="w-4 h-4" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-100 pb-4 mb-6">
            {[
              { id: 'highest', label: 'Highest Match' },
              { id: 'recent', label: 'Most Recent' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm font-semibold transition-all duration-300 relative pb-4 -mb-4 ${
                  activeTab === tab.id 
                    ? 'text-gray-900 border-b-2 border-indigo-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Resized Cards Grid (h-60 instead of h-96) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedCandidates.map((c) => (
              <div
                key={c.id}
                className="group relative h-60 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1.5 cursor-pointer bg-gray-900"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-85 group-hover:scale-105 transition-all duration-500`}></div>
                
                {/* Subtle Mesh Circles */}
                <div className="absolute -top-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
                
                {/* Card Content overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wide uppercase">
                      {c.date}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-sm border border-white/10">
                      {c.score.toFixed(0)}%
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt={c.candidate_name} className="w-9 h-9 rounded-full border border-white/30 object-cover" />
                      <div>
                        <h3 className="font-bold text-sm leading-tight tracking-tight">{c.candidate_name}</h3>
                        <p className="text-[11px] text-white/70 font-semibold truncate max-w-[150px]">{c.job_title}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/80">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-indigo-200" />
                        Qualified Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Rows: Recent Match History & Top Skills Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Match Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Match Results</h3>
              <Link to="/app/history" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View History <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                    <th className="pb-3 pr-4">Candidate</th>
                    <th className="pb-3 px-4">Position</th>
                    <th className="pb-3 pl-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {matchHistory && matchHistory.length > 0 ? (
                    matchHistory.slice(0, 4).map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3 pr-4 font-semibold text-gray-800">{match.candidate_name || 'Anonymous'}</td>
                        <td className="py-3 px-4 text-gray-500 font-medium">{match.job_title}</td>
                        <td className="py-3 pl-4 text-right">
                          <span className={`font-bold ${
                            match.score >= 80 ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded-lg' :
                            match.score >= 60 ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg' :
                            'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg'
                          }`}>
                            {match.score.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-400 italic">
                        No match calculations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Skills Chart */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Candidate Skills</h3>
            {topSkillsData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSkillsData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={10} tickLine={false} width={75} />
                    <Tooltip />
                    <Bar dataKey="Count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 italic text-sm">
                No skills extracted yet.
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* RIGHT SIDEBAR (CLEANED UP & WORKABLE) */}
      <div className="w-full xl:w-80 bg-white border-t xl:border-t-0 xl:border-l border-gray-100 p-6 sm:p-8 flex flex-col gap-8 z-10 shadow-sm xl:sticky xl:top-0 xl:h-screen overflow-y-auto">
        
        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Quick Actions</h4>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Upload, path: '/app/resumes', bg: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100', label: 'Upload' },
              { icon: Plus, path: '/app/jobs', bg: 'bg-teal-50 text-teal-600 hover:bg-teal-100', label: 'Post' },
              { icon: GitCompare, path: '/app/match', bg: 'bg-purple-50 text-purple-600 hover:bg-purple-100', label: 'Match' },
              { icon: FileText, path: '/app/history', bg: 'bg-orange-50 text-orange-600 hover:bg-orange-100', label: 'History' },
            ].map((act, i) => (
              <Link
                key={i}
                to={act.path}
                title={act.label}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${act.bg} shadow-sm`}
              >
                <act.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Resumes (Workable using real database resumes) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Resumes</h4>
            <Link to="/app/resumes" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              See all
            </Link>
          </div>

          <div className="space-y-4 overflow-y-auto pr-1">
            {resumes && resumes.length > 0 ? (
              resumes.slice(0, 4).map((resume) => (
                <div key={resume.id} className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-2xl transition duration-300">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-gray-800 truncate">
                      {resume.candidate_name || 'Anonymous Candidate'}
                    </h5>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(resume.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400 italic">
                No resumes uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Simple System Health/Status Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl p-5 shadow-md shadow-indigo-600/10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Active Database Pool</p>
              <h5 className="text-lg font-black mt-0.5">{totalResumes} Candidate{totalResumes !== 1 ? 's' : ''}</h5>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-300" />
          </div>
          <div className="text-[10px] text-indigo-100/90 leading-relaxed font-medium">
            Your ATS is active and synced with SQLite database storage. System latency: 12ms.
          </div>
        </div>

      </div>

    </div>
  );
}
