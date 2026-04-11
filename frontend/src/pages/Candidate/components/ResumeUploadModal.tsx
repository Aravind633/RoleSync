// Path: src/pages/Candidate/components/ResumeUploadModal.tsx
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../../config/api'; // Adjust this path if your api.ts is elsewhere

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeUploadModal = ({ isOpen, onClose }: ResumeUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Basic validation: Check file size (e.g., max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File is too large. Maximum size is 5MB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    // 🚨 Critical: We must use FormData for files, not standard JSON!
    const formData = new FormData();
    formData.append('resume', file); // 'resume' MUST match what Multer is looking for

    try {
      await api.patch('/profiles/resume', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
      });
      
      // Force React Query to re-fetch the profile so the banner instantly disappears
      queryClient.invalidateQueries({ queryKey: ['candidateProfile'] });
      
      // Reset and close
      setFile(null);
      onClose();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Your Resume</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Candidates with resumes are 80% more likely to get shortlisted. Please upload a PDF or DOCX file (Max 5MB).
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:bg-gray-50 hover:border-blue-400 transition-colors">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 mt-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            I'll do it later
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm
              ${!file || isUploading 
                ? 'bg-blue-400 cursor-not-allowed opacity-70' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};