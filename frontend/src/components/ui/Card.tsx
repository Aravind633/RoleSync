import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-white border border-zinc-200 rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardProps) {
  return <div className={`px-6 py-4 border-b border-zinc-100 ${className}`}>{children}</div>;
}

export function CardContent({ className = '', children }: CardProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }: CardProps) {
  return <div className={`px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 ${className}`}>{children}</div>;
}
