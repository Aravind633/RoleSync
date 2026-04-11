import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from "../../utils/api";
import { useApplications } from '../../hooks/useApplications';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import { MapPin, Briefcase, Search } from 'lucide-react';

export const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  const [activeSearch, setActiveSearch] = useState({ q: '', location: '' });

  const { applyForJob, getMyApplications } = useApplications();
  const appliedJobs = getMyApplications?.data || [];
  const appliedJobIds = appliedJobs.map((app: any) => app.job?._id);

  const { data: searchResults, isLoading, isError } = useQuery({
    queryKey: ['searchJobs', activeSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeSearch.q) params.append('q', activeSearch.q);
      if (activeSearch.location) params.append('location', activeSearch.location);
      
      const { data } = await api.get(`/jobs/search?${params.toString()}`);
      return data.data.jobs;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch({ q: searchQuery, location: locationQuery });
  };

  const handleApply = (jobId: string) => {
    applyForJob?.mutate(jobId);
  };

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 md:px-12 font-sans">
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-charcoal mb-4">
          Discover.
        </h1>
        <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl leading-relaxed">
          The finest curated opportunities, distilled for you.
        </p>
      </div>

      {/* Advanced Search Bar */}
      <div className="mb-16">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Roles, keywords, or companies"
              className="w-full bg-white border border-zinc-200 text-charcoal shadow-sm rounded-lg pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Location or 'Remote'"
              className="w-full bg-white border border-zinc-200 text-charcoal shadow-sm rounded-lg pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full md:w-auto px-10 text-lg whitespace-nowrap"
          >
            Refine Search
          </Button>
        </form>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        {isLoading ? (
          <div className="text-center py-20 text-zinc-500 tracking-wide text-lg">Gathering insights...</div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">Service unavailable. Please retry.</div>
        ) : searchResults?.length === 0 ? (
          <div className="text-center py-32 border border-zinc-200 border-dashed rounded-lg bg-white">
            <p className="text-zinc-500 text-lg font-medium">No strict matches fulfill your criteria.</p>
            <p className="text-zinc-400 mt-2">Try expanding your parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults?.map((job: any) => {
              const hasApplied = appliedJobIds.includes(job._id);
              const isApplying = applyForJob?.isPending && applyForJob.variables === job._id;

              return (
                <Card key={job._id} className="flex flex-col transition-all hover:border-zinc-300">
                  <CardContent className="flex-grow pt-8">
                    <h2 className="text-2xl font-bold tracking-tight text-charcoal mb-2 leading-tight">
                      {job.title}
                    </h2>
                    <p className="text-charcoal font-semibold mb-6">
                      {job.companyName}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 font-medium mb-8">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Unspecified'}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.experienceLevel || 'Any'} Exp.</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills?.slice(0, 4).map((skill: string, idx: number) => (
                        <Tag key={idx} variant="neutral" className="border border-zinc-200 uppercase tracking-wider text-[10px]">
                          {skill}
                        </Tag>
                      ))}
                      {job.skills?.length > 4 && (
                        <Tag variant="neutral" className="border border-zinc-100 bg-zinc-50 uppercase tracking-wider text-[10px]">
                          +{job.skills.length - 4}
                        </Tag>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="bg-transparent border-t-0 pb-8 px-6 pt-0 mt-4">
                    <Button
                      variant={hasApplied ? 'secondary' : 'primary'}
                      className="w-full font-semibold"
                      onClick={() => handleApply(job._id)}
                      disabled={hasApplied || isApplying}
                    >
                      {hasApplied ? '✓ Application Submitted' : isApplying ? 'Processing...' : 'Submit Application'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};