// import { useState } from 'react';
// import { useJobs } from '../../hooks/useJobs';

// interface CreateJobModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const CreateJobModal = ({ isOpen, onClose }: CreateJobModalProps) => {
//   const { createJob } = useJobs();
  
//   const [formData, setFormData] = useState({
//     title: '',
//     companyName: '',
//     description: '',
//     skills: '',
//     experienceLevel: 'Mid',
//     location: '',
//     minSalary: '',
//     maxSalary: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Format the data to match our Mongoose Job Schema 
//     const jobPayload = {
//       title: formData.title,
//       companyName: formData.companyName,
//       description: formData.description,
//       skills: formData.skills.split(',').map(skill => skill.trim()), 
//       experienceLevel: formData.experienceLevel,
//       location: formData.location,
//       salaryRange: {
//         min: Number(formData.minSalary),
//         max: Number(formData.maxSalary),
//       },
//     };

//     createJob.mutate(jobPayload, {
//       onSuccess: () => {
//         // Clear the form and close the modal automatically on success!
//         setFormData({
//           title: '', companyName: '', description: '', skills: '',
//           experienceLevel: 'Mid', location: '', minSalary: '', maxSalary: ''
//         });
//         onClose();
//       }
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>

//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
//           <form onSubmit={handleSubmit}>
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4" id="modal-title">
//                 Post a New Job
//               </h3>
              
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Job Title</label>
//                     <input type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Company Name</label>
//                     <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Required Skills (Comma separated)</label>
//                     <input type="text" name="skills" required placeholder="Python, Django, SQL" value={formData.skills} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Location</label>
//                     <input type="text" name="location" required placeholder="e.g., Remote or New York" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Experience</label>
//                     <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
//                       <option value="Entry">Entry Level</option>
//                       <option value="Mid">Mid Level</option>
//                       <option value="Senior">Senior Level</option>
//                       <option value="Director">Director</option>
//                       <option value="Executive">Executive</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Min Salary</label>
//                     <input type="number" name="minSalary" value={formData.minSalary} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Max Salary</label>
//                     <input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//               <button type="submit" disabled={createJob?.isPending} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
//                 {createJob.isPending ? 'Posting...' : 'Post Job'}
//               </button>
//               <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

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