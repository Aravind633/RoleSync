import React from 'react';
import { Button } from '../ui/Button';
import { Briefcase, Bell, User } from 'lucide-react';

export function TopNavBar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-charcoal" />
            <span className="text-xl font-bold tracking-tight text-charcoal">RoleSync</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-charcoal">Jobs</a>
            <a href="#" className="text-sm font-medium text-zinc-500 hover:text-charcoal transition-colors">Applications</a>
            <a href="#" className="text-sm font-medium text-zinc-500 hover:text-charcoal transition-colors">Interviews</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-zinc-400 hover:text-charcoal transition-colors relative">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full"></span>
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden border border-zinc-300">
               <User className="w-4 h-4 text-zinc-500" />
            </div>
            <Button variant="primary" size="sm" className="hidden sm:flex">
              Upload Resume
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
