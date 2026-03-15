import { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  const { bulkUpload } = useJobs();
  const [jobsData, setJobsData] = useState<any[] | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('Please upload a valid .json file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setJobsData(json);
        } else {
          setError('Invalid format: The JSON file must contain an array of jobs [ {...}, {...} ].');
        }
      } catch (err) {
        setError('Failed to parse JSON. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!jobsData) return;
    
    bulkUpload.mutate(jobsData, {
      onSuccess: () => {
        setJobsData(null);
        onClose();
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'An error occurred during upload.');
      }
    });
  };

  const handleClose = () => {
    setJobsData(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">Bulk Upload Jobs</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Upload a JSON file containing an array of job objects.
          </p>

          <input 
            type="file" 
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4" 
          />

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm mb-4">{error}</div>}
          
          {jobsData && !error && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm mb-4 font-medium">
              ✓ Successfully loaded {jobsData.length} jobs. Ready to upload!
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={handleClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={!jobsData || bulkUpload?.isPending} 
            className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {bulkUpload?.isPending ? 'Uploading...' : 'Import Jobs'}
          </button>
        </div>
      </div>
    </div>
  );
};