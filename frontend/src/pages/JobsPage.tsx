import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Briefcase, Trash2, Calendar, FileText, CheckCircle2, ChevronRight, X, Pencil } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useJobs, useCreateJob, useDeleteJob, useUpdateJob } from '../hooks/useJobs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import type { Job } from '../types';

const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z.string().min(20, 'Job description must be at least 20 characters'),
});

type JobFormData = z.infer<typeof jobSchema>;

export function JobsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [deletingJobTitle, setDeletingJobTitle] = useState('');
  const { data: jobs, isLoading, error } = useJobs();
  const createJob = useCreateJob();
  const deleteJob = useDeleteJob();
  const updateJob = useUpdateJob();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
    }
  });

  useEffect(() => {
    if (editingJob) {
      reset({
        title: editingJob.title,
        description: editingJob.description,
      });
    } else {
      reset({
        title: '',
        description: '',
      });
    }
  }, [editingJob, reset]);

  const onSubmit = async (data: JobFormData) => {
    try {
      if (editingJob) {
        await updateJob.mutateAsync({
          id: editingJob.id,
          job: data as { title: string; description: string }
        });
        toast.success('Job updated successfully!');
      } else {
        await createJob.mutateAsync(data as { title: string; description: string });
        toast.success('Job posted successfully!');
      }
      reset();
      setShowForm(false);
      setEditingJob(null);
    } catch (error) {
      toast.error(editingJob ? 'Failed to update job' : 'Failed to create job');
    }
  };

  const handleStartEdit = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const promptDelete = (id: number, title: string) => {
    setDeletingJobId(id);
    setDeletingJobTitle(title);
  };

  const handleConfirmDelete = async () => {
    if (!deletingJobId) return;
    try {
      await deleteJob.mutateAsync(deletingJobId);
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setDeletingJobId(null);
      setDeletingJobTitle('');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-12">Error loading jobs</div>;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Job Postings</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage your active listings and extract skill requirements</p>
        </div>
        <Button 
          onClick={() => {
            if (showForm) {
              setEditingJob(null);
            }
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-5 py-6 shadow-lg shadow-indigo-600/10 font-bold transition-all duration-300"
        >
          {showForm ? (
            <>
              <X className="h-5 w-5" />
              Close Form
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Post New Job
            </>
          )}
        </Button>
      </div>

      {/* Create Job Form (styled with glass/shadow aesthetic) */}
      {showForm && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 mb-8 animate-slide-up relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Job Title
              </label>
              <input
                {...register('title')}
                className="w-full px-6 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all duration-300 text-sm font-semibold placeholder-gray-400"
                placeholder="e.g., Senior Full-Stack Engineer"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Job Description & Skills Requirements
              </label>
              <textarea
                {...register('description')}
                rows={6}
                className="w-full px-6 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all duration-300 text-sm font-semibold placeholder-gray-400 leading-relaxed"
                placeholder="Describe responsibilities, stack requirements, and key skills. AI will extract these automatically."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 font-bold shadow-md shadow-indigo-600/10 disabled:opacity-50"
              >
                {isSubmitting 
                  ? 'AI Skills Extraction in progress...' 
                  : editingJob 
                    ? 'Update Job & Extract Skills' 
                    : 'Post Job & Extract Skills'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingJob(null);
                }}
                className="border-gray-200 text-gray-500 rounded-xl px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job, idx) => (
          <div
            key={job.id}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 p-6 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-2xl ${
                    idx % 3 === 0 ? 'bg-indigo-50 text-indigo-600' : idx % 3 === 1 ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'
                  } shadow-inner`}>
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">
                      <Calendar className="w-3.5 h-3.5" />
                      ID: #{job.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(job)}
                    className="p-1.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition duration-300"
                    title="Edit job posting"
                  >
                    <Pencil className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => promptDelete(job.id, job.title)}
                    className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-300"
                    title="Delete job posting"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-gray-600 text-xs leading-relaxed font-medium mb-6 line-clamp-3">
                {job.description}
              </p>
            </div>

            {/* Extracted Skills Container */}
            {job.extracted_skills && job.extracted_skills.length > 0 && (
              <div className="pt-4 border-t border-gray-50">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  Extracted Skills ({job.extracted_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {job.extracted_skills.slice(0, 4).map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 bg-gray-100/70 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-200/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.extracted_skills.length > 4 && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      +{job.extracted_skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fallback empty view */}
      {jobs?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100/60 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <FileText className="h-8 w-8 text-indigo-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-black text-gray-900">No active job listings</h3>
          <p className="text-gray-500 text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
            Create your first job posting. Our integrated AI will parse your description and auto-extract skill requirements.
          </p>
          <Button 
            onClick={() => setShowForm(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10"
          >
            Create Posting
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
      {/* Confirm deletion dialog */}
      <ConfirmDialog
        isOpen={deletingJobId !== null}
        title="Delete Job Posting?"
        message={`Are you sure you want to delete the job listing "${deletingJobTitle}"? This will permanently delete associated match histories and skill gap score records.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeletingJobId(null);
          setDeletingJobTitle('');
        }}
        isDanger={true}
      />
    </div>
  );
}
