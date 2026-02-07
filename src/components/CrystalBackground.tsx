import React from 'react';
import { motion } from 'framer-motion';
export function CrystalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base Diamond Texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(135deg, #1a1a24 25%, transparent 25%),
            linear-gradient(225deg, #1a1a24 25%, transparent 25%),
            linear-gradient(45deg, #1a1a24 25%, transparent 25%),
            linear-gradient(315deg, #1a1a24 25%, transparent 25%)
          `,
          backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
          backgroundSize: '40px 40px',
          backgroundRepeat: 'repeat'
        }} />


      {/* Deep Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080f] via-transparent to-[#08080f] opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080f] via-transparent to-[#08080f] opacity-80" />

      {/* Floating Crystal Shapes */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-64 h-64 bg-white/5 backdrop-blur-sm border border-white/10"
        style={{
          clipPath:
          'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}
        animate={{
          rotate: 360,
          y: [0, -20, 0]
        }}
        transition={{
          rotate: {
            duration: 40,
            repeat: Infinity,
            ease: 'linear'
          },
          y: {
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }} />


      <motion.div
        className="absolute top-[60%] right-[10%] w-96 h-96 bg-white/3 backdrop-blur-sm border border-white/5"
        style={{
          clipPath:
          'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        }}
        animate={{
          rotate: -360,
          y: [0, 30, 0]
        }}
        transition={{
          rotate: {
            duration: 50,
            repeat: Infinity,
            ease: 'linear'
          },
          y: {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }} />


      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-white/2 backdrop-blur-sm border border-white/5"
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
        animate={{
          rotate: 180,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: {
            duration: 60,
            repeat: Infinity,
            ease: 'linear'
          },
          scale: {
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }} />


      {/* Prismatic Light Leaks */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl" />
    </div>);

}