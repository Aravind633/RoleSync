
import { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateJobModal = ({ isOpen, onClose }: CreateJobModalProps) => {
  const { createJob } = useJobs();
  const [formData, setFormData] = useState({
    title: '', companyName: '', description: '', skills: '',
    experienceLevel: 'Mid', location: '', minSalary: '', maxSalary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobPayload = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()), 
      salaryRange: { min: Number(formData.minSalary), max: Number(formData.maxSalary) },
    };

    createJob.mutate(jobPayload, {
      onSuccess: () => {
        setFormData({ title: '', companyName: '', description: '', skills: '', experienceLevel: 'Mid', location: '', minSalary: '', maxSalary: '' });
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">Post a New Job</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="jobForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Skills (Comma separated)</label>
                <input type="text" name="skills" required placeholder="React, Node.js" value={formData.skills} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Min Salary</label>
                <input type="number" name="minSalary" required value={formData.minSalary} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Salary</label>
                <input type="number" name="maxSalary" required value={formData.maxSalary} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button type="submit" form="jobForm" disabled={createJob?.isPending} className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {createJob?.isPending ? 'Saving...' : 'Post Job'}
          </button>
        </div>
      </div>
    </div>
  );
};