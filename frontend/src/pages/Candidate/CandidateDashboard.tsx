import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useApplications } from '../../hooks/useApplications';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { MapPin, Briefcase, FileText, Activity } from 'lucide-react';

export const CandidateDashboard = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['candidateProfile'],
    queryFn: async () => {
      const { data } = await api.get('/profiles/me'); 
      return data.data.profile;
    }
  });

  const { data: recommendations, isLoading: recsLoading, isError: recsError } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: async () => {
      const { data } = await api.get('/matches/recommendations');
      return data.data;
    },
  });

  const { getMyApplications } = useApplications();
  const { data: myApplications, isLoading: appsLoading } = getMyApplications;

  const needsResume = profile && !profile.resumeUrl;

  if (profileLoading) {
    return <div className="p-12 text-center text-zinc-500 font-sans tracking-wide">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-16 md:py-24 px-4 sm:px-6 md:px-12 font-sans overflow-x-hidden">
      
      {needsResume && (
        <Card className="mb-12 bg-zinc-900 border-zinc-900 text-white">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Complete Your Portfolio</h3>
              <p className="text-zinc-400 font-medium max-w-lg">
                Your profile is incomplete. High-end roles require a comprehensive resume to proceed with applications.
              </p>
            </div>
            <Button 
              variant="primary" 
              className="bg-gray-180 border-white-linear-gradient text-black hover:bg-zinc-500 "
              onClick={() => setIsResumeModalOpen(true)}
            >
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter text-charcoal mb-4">
          Hello, {profile?.firstName || 'Candidate'}.
        </h1>
        <p className="text-lg md:text-2xl text-zinc-500 font-light max-w-2xl leading-relaxed">
          Here is your curated selection of opportunities and active applications.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardContent className="py-8">
            <span className="block text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Applied</span>
            <span className="text-5xl font-extrabold tracking-tighter text-charcoal">{myApplications?.length || 0}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-8">
            <span className="block text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2"><Activity className="w-4 h-4"/> Profile Views</span>
            <span className="text-5xl font-extrabold tracking-tighter text-charcoal">24</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-8">
            <span className="block text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2"><FileText className="w-4 h-4"/> Match Score</span>
            <span className="text-5xl font-extrabold tracking-tighter text-brand">98%</span>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-charcoal">Curated Roles</h2>
          </div>
          <Link to="/candidate/jobs" className="bg-black text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-sm inline-flex items-center gap-2">
            View All Jobs
          </Link>
        </div>

        {recsLoading ? (
          <div className="py-12 border border-zinc-200 rounded-lg text-center text-zinc-500 tracking-wide">Synthesizing matches...</div>
        ) : recsError ? (
          <div className="py-12 border border-red-200 rounded-lg text-center text-red-500">Service unavailable.</div>
        ) : recommendations?.length === 0 ? (
           <div className="py-12 border border-zinc-200 rounded-lg text-center text-zinc-500">
             <p className="font-medium">No strict matches found yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recommendations?.map((match: any) => (
              <Card key={match._id} className="flex flex-col">
                <CardContent className="flex-grow pt-8">
                  <div className="flex justify-between items-start mb-6">
                    <Tag variant="neutral" className="border border-zinc-200 px-3 py-1 text-xs">
                      {match.score}% Accuracy
                    </Tag>
                    {match.score >= 90 && <Tag variant="brand" className="px-3 py-1">Hot Match</Tag>}
                  </div>
                  
                  <h3 className="text-2xl font-bold tracking-tight text-charcoal mb-2 leading-tight">
                    {match.job?.title}
                  </h3>
                  <p className="text-zinc-500 font-medium mb-8">
                    at <span className="text-charcoal font-semibold">{match.job?.companyName}</span>
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-600 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {match.job?.location || 'Unspecified'}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {match.job?.experienceLevel || 'Any'} Exp.</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-transparent border-t-0 pb-8 px-6 pt-0 mt-4">
                  <Link to="/candidate/jobs" className="w-full inline-block">
                    <Button variant="outline" className="w-full font-semibold border-charcoal">
                      Explore Opportunity
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Applications */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-charcoal mb-8">Active Applications</h2>

        {appsLoading ? (
          <div className="text-zinc-500">Loading...</div>
        ) : myApplications?.length === 0 ? (
          <div className="py-12 border border-zinc-200 border-dashed rounded-lg text-center text-zinc-500">
            No applications submitted.
          </div>
        ) : (
          <Card className="rounded-none border-x-0 sm:border-x sm:rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left font-semibold tracking-widest text-zinc-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-left font-semibold tracking-widest text-zinc-500 uppercase">Company</th>
                  <th className="px-6 py-4 text-left font-semibold tracking-widest text-zinc-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left font-semibold tracking-widest text-zinc-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {myApplications?.map((app: any) => (
                  <tr key={app._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-charcoal whitespace-nowrap">{app.job?.title}</td>
                    <td className="px-6 py-5 font-medium text-zinc-500 whitespace-nowrap">{app.job?.companyName}</td>
                    <td className="px-6 py-5 text-zinc-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                       <Tag variant={
                          app.status === 'pending' ? 'neutral' : 
                          app.status === 'reviewed' ? 'neutral' :
                          app.status === 'shortlisted' ? 'success' : 'warning'
                       } className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
                         {app.status}
                       </Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <ResumeUploadModal 
        isOpen={isResumeModalOpen} 
        onClose={() => setIsResumeModalOpen(false)} 
      />
    </div>
  );
};