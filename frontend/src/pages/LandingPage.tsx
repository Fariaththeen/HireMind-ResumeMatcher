import { Link } from 'react-router-dom';
import { Layers, ArrowRight, FileText, Target, History, Sparkles, Shield, Database } from 'lucide-react';
import { Button } from '../components/ui/button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden selection:bg-indigo-100 relative">
      
      {/* Mesh decorative backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-teal-100/40 rounded-full blur-3xl -z-10"></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 px-6 lg:px-12 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-600/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="tracking-tight">HireMind</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-wider">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#demo" className="hover:text-indigo-600 transition-colors">Preview</a>
        </div>
        <Link to="/app">
          <Button className="rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 font-bold transition duration-300">
            Go to Dashboard
          </Button>
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 pb-20 px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100/50">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI-Powered Hiring intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.15]">
            Match Candidate Resumes <br />
            with Job Openings, <span className="text-indigo-600">Instantly.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Scan local candidate profiles, extract key professional competencies, and evaluate qualification scores automatically using smart NLP indexing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app">
              <Button size="lg" className="rounded-full px-8 py-6.5 text-base bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 text-white font-bold transition duration-300">
                Launch App Dashboard
                <ArrowRight className="ml-2.5 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- PRODUCT PREVIEW / INTERACTIVE MOCKUP --- */}
      <section id="demo" className="pb-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            {/* Window title bar mockup */}
            <div className="absolute top-4 left-6 flex gap-1.5">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            
            <div className="mt-6 border-t border-gray-50 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Mockup Left Col */}
              <div className="md:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Target className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">Senior Python Developer</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Job Specification</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">Sarah Jenkins</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Candidate Profile</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="space-y-1.5 bg-gray-50 p-4.5 rounded-2xl border border-gray-100/50">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>AI Match Strength</span>
                    <span className="text-indigo-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200/60 rounded-full h-3">
                    <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              {/* Mockup Right Col */}
              <div className="md:col-span-5 bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-5 space-y-4">
                <div>
                  <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wide">AI Extraction Verdict</h4>
                  <p className="text-[11px] text-indigo-900/90 leading-relaxed font-semibold mt-1">
                    Excellent match. Candidate exhibits strong competencies in backend architectures, matching 5/6 core skills required.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-indigo-100/50">
                  {['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'AWS'].map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md border border-green-200/50">
                      {skill}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[9px] font-bold rounded-md border border-red-200/50">
                    Kubernetes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Engineered for Efficient Recruiting
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-semibold mt-2.5 leading-relaxed">
              Ditch manual screenings. Let our offline-capable, local indexing workflow screen files for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100/60 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">Resume Indexing</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                  Upload candidate CVs in PDF or DOCX format. The app automatically extracts name and lists core skills instantly.
                </p>
              </div>
              <Link to="/app/resumes" className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase mt-8 tracking-wider group-hover:text-indigo-700">
                Upload Resumes <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100/60 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">Requirement Tagging</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                  Post detailed job descriptions. The system extracts specific technical stack requirements and catalogues them.
                </p>
              </div>
              <Link to="/app/jobs" className="flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase mt-8 tracking-wider group-hover:text-teal-700">
                Post Job Openings <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100/60 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">History & Audit Logs</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                  Access every match score history from your local history logs. Audit recommendations and skill gaps anytime.
                </p>
              </div>
              <Link to="/app/history" className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase mt-8 tracking-wider group-hover:text-purple-700">
                View History <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- TRUST & PRIVACY SUMMARY BANNER --- */}
      <section className="py-16 px-6 lg:px-12 bg-indigo-900 text-white rounded-t-[3rem]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Local Data Privacy Included
            </h2>
            <p className="text-sm text-indigo-200/90 leading-relaxed font-semibold">
              All parsed text data, extracted candidate skills, and evaluation scores are stored safely inside your local database. No external trackers, completely secure.
            </p>
          </div>
          <div className="flex gap-8 justify-start md:justify-end">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-white/10 rounded-2xl">
                <Shield className="w-5 h-5 text-indigo-300" />
              </span>
              <div>
                <span className="block text-sm font-bold">100% Offline</span>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">Secured Engine</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-white/10 rounded-2xl">
                <Database className="w-5 h-5 text-indigo-300" />
              </span>
              <div>
                <span className="block text-sm font-bold">SQLite Store</span>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">Local Storage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 pt-16 pb-10 px-6 lg:px-12 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-800/80 pt-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Layers className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">HireMind</span>
          </div>
          
          <div className="flex items-center gap-8 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/app" className="hover:text-white transition">Dashboard</Link>
            <Link to="/app/jobs" className="hover:text-white transition">Jobs</Link>
            <Link to="/app/resumes" className="hover:text-white transition">Resumes</Link>
          </div>

          <div className="text-xs text-gray-500 font-semibold">
            &copy; {new Date().getFullYear()} HireMind.
          </div>
        </div>
      </footer>

    </div>
  );
}
