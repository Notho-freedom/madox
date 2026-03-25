import React from 'react';
import { motion } from 'framer-motion';
export function CardSkeleton({ count = 6 }: {count?: number;}) {
  return (
    <div className="flex gap-6 overflow-hidden">
      {Array.from({
        length: count
      }).map((_, i) =>
      <div key={i} className="w-[280px] flex-shrink-0">
          <div
          className="relative h-[400px] w-full bg-white/5 overflow-hidden animate-pulse"
          style={{
            clipPath:
            'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)'
          }}>
          
            <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }} />
          
          </div>
        </div>
      )}
    </div>);

}
export function GridSkeleton({ count = 8 }: {count?: number;}) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({
        length: count
      }).map((_, i) =>
      <div key={i} className="flex justify-center">
          <div className="w-full max-w-[220px] xl:max-w-[228px] 2xl:max-w-[236px]">
            <div
            className="relative h-[400px] w-full bg-white/5 overflow-hidden animate-pulse"
            style={{
              clipPath:
              'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)'
            }}>
            
              <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.1
              }} />
            
            </div>
          </div>
        </div>
      )}
    </div>);

}
export function ListSkeleton({ count = 5 }: {count?: number;}) {
  return (
    <div className="space-y-4">
      {Array.from({
        length: count
      }).map((_, i) =>
      <div
        key={i}
        className="flex items-center gap-8 p-6 bg-white/5 animate-pulse overflow-hidden"
        style={{
          clipPath:
          'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
        }}>
        
          <div className="w-24 h-8 bg-white/5 rounded" />
          <div className="w-48 h-28 bg-white/5 rounded" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-white/5 rounded w-2/3" />
            <div className="h-4 bg-white/5 rounded w-1/3" />
          </div>
          <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.1
          }} />
        
        </div>
      )}
    </div>);

}
export function HeroSkeleton() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center px-16 py-20">
      <div className="max-w-2xl space-y-6">
        <div className="h-6 w-40 bg-white/5 rounded animate-pulse" />
        <div className="space-y-3">
          <div className="h-16 w-96 bg-white/5 rounded animate-pulse" />
          <div className="h-16 w-72 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="flex gap-6">
          <div className="h-14 w-48 bg-white/10 rounded animate-pulse" />
          <div className="h-14 w-40 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </section>);

}
export function ContinueWatchingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({
        length: 6
      }).map((_, i) =>
      <div
        key={i}
        className="aspect-video bg-white/5 animate-pulse rounded"
        style={{
          clipPath:
          'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)'
        }} />

      )}
    </div>);

}
export function ErrorState({
  message,
  onRetry



}: {message: string;onRetry?: () => void;}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <span className="text-2xl">!</span>
      </div>
      <p className="text-sm mb-4">{message}</p>
      {onRetry &&
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors uppercase tracking-widest text-xs">
        
          Retry
        </button>
      }
    </div>);

}
