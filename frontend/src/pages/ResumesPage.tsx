import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, User, CheckCircle2, Calendar, Sparkles, Trash2 } from 'lucide-react';
import { useResumes, useUploadResume, useDeleteResume } from '../hooks/useResumes';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';

export function ResumesPage() {
  const [candidateName, setCandidateName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [deletingResumeId, setDeletingResumeId] = useState<number | null>(null);
  const [deletingResumeName, setDeletingResumeName] = useState('');
  const { data: resumes, isLoading } = useResumes();
  const uploadResume = useUploadResume();
  const deleteResume = useDeleteResume();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!candidateName.trim()) {
      setNameError(true);
      toast.error('Candidate Name is required before uploading a resume');
      return;
    }

    setNameError(false);

    try {
      const result = await uploadResume.mutateAsync({ file, candidateName });
      toast.success(`Resume processed! Extracted ${result.extracted_skills.length} skills for ${result.candidate_name || 'candidate'}`);
      setCandidateName('');
    } catch (error) {
      toast.error('Failed to upload resume');
    }
  }, [candidateName, uploadResume]);

  const promptDelete = (id: number, name: string) => {
    setDeletingResumeId(id);
    setDeletingResumeName(name);
  };

  const handleConfirmDelete = async () => {
    if (!deletingResumeId) return;
    try {
      await deleteResume.mutateAsync(deletingResumeId);
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
    } finally {
      setDeletingResumeId(null);
      setDeletingResumeName('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Candidate Resumes</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Upload and manage resumes to index skills automatically</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-md p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Dropzone area (2/3 width) */}
          <div className="lg:col-span-2">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer
                transition-all duration-500 relative overflow-hidden
                ${isDragActive 
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
                  : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                isDragActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-gray-50 text-gray-400 border border-gray-100'
              }`}>
                <Upload className="h-6 w-6" />
              </div>

              {isDragActive ? (
                <p className="text-lg text-indigo-600 font-bold">Drop your resume here...</p>
              ) : (
                <>
                  <p className="text-base text-gray-800 font-extrabold">
                    Drag & drop candidate resume here
                  </p>
                  <p className="text-xs text-gray-400 font-semibold mt-1">PDF or DOCX accepted (maximum 10MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Name input + info (1/3 width) */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Candidate Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => {
                  setCandidateName(e.target.value);
                  if (e.target.value.trim()) setNameError(false);
                }}
                className={`w-full px-6 py-3 border rounded-2xl focus:ring-4 transition-all duration-300 text-sm font-semibold placeholder-gray-400 ${
                  nameError 
                    ? 'border-red-500 focus:ring-red-600/10 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-indigo-600/10 focus:border-indigo-600'
                }`}
                placeholder="e.g., Sarah Jenkins"
              />
              {nameError && (
                <p className="text-red-500 text-xs mt-1.5 font-bold">Candidate name is required</p>
              )}
            </div>

            <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4 flex gap-3 text-xs text-indigo-900/80 leading-relaxed font-semibold">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                AI parses candidate profiles automatically and maps identified skills onto our system.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes?.map((resume, idx) => (
          <div
            key={resume.id}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header block */}
              <div className="flex justify-between items-start gap-2 mb-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`p-3 rounded-2xl ${
                    idx % 3 === 0 ? 'bg-indigo-50 text-indigo-600' : idx % 3 === 1 ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'
                  } shadow-inner`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-base text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {resume.candidate_name || 'Anonymous Candidate'}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide truncate">
                      <Calendar className="w-3.5 h-3.5" />
                      {resume.filename}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    promptDelete(resume.id, resume.candidate_name || resume.filename);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-300 shrink-0"
                  title="Delete resume"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Status details */}
              <div className="flex items-center gap-2 mb-5 text-xs text-gray-500 font-bold uppercase tracking-wider bg-gray-50/50 border border-gray-100/50 rounded-2xl px-3.5 py-2 w-fit">
                <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                <span>{resume.extracted_skills.length} skills identified</span>
              </div>
            </div>

            {/* Skills Badges */}
            {resume.extracted_skills.length > 0 && (
              <div className="pt-4 border-t border-gray-50">
                <div className="flex flex-wrap gap-2 items-center">
                  {resume.extracted_skills.slice(0, 6).map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 bg-gray-100/70 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-200/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {resume.extracted_skills.length > 6 && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      +{resume.extracted_skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fallback empty view */}
      {resumes?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100/60 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <User className="h-8 w-8 text-indigo-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-black text-gray-900">No resumes uploaded yet</h3>
          <p className="text-gray-500 text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
            Upload candidate resumes in PDF or DOCX format to parse and extract professional skills automatically.
          </p>
        </div>
      )}
      {/* Confirm deletion dialog */}
      <ConfirmDialog
        isOpen={deletingResumeId !== null}
        title="Delete Candidate Resume?"
        message={`Are you sure you want to delete the resume for "${deletingResumeName}"? This will permanently remove the record from your database.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeletingResumeId(null);
          setDeletingResumeName('');
        }}
        isDanger={true}
      />
    </div>
  );
}
