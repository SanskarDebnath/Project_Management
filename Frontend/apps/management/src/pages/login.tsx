import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/auth-store';
import { authService } from '../lib/api/auth-service';
import { PortalCaptcha } from '../components/shared/PortalCaptcha';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';
import { Lock, User, ShieldCheck, BookOpen, Key, Building2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  captcha: z.string().length(6, 'Captcha code must be 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [expectedCaptcha, setExpectedCaptcha] = useState('');
  const [bookAnimKey, setBookAnimKey] = useState(0);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (data.captcha.toUpperCase() !== expectedCaptcha.toUpperCase()) {
      toast.error('Invalid Captcha security code. Please try again.');
      return;
    }

    try {
      const res = await authService.login(data);
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        toast.success(`Welcome to Management Portal, ${res.data.user.name}!`);
      } else {
        toast.error(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      toast.error('An error occurred during sign in.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 flex flex-col items-center justify-center space-y-4">
      {/* Re-Open Animation Control Button */}
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={() => setBookAnimKey((prev) => prev + 1)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-900/20 hover:bg-blue-900/30 text-blue-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-blue-800/40 dark:border-slate-700 shadow-sm cursor-pointer"
          title="Re-open 3D Book Animation"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-open Book Animation
        </button>
      </div>

      {/* 3D Book Scene Container */}
      <div
        key={bookAnimKey}
        className="w-full relative"
        style={{ perspective: '2500px', transformStyle: 'preserve-3d' }}
      >
        {/* Free Physical Book Pages Grid without bounding parent border */}
        <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-0 overflow-visible">
          
          {/* Central Book Spine seam accent running down center */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[6px] -ml-[3px] z-30 bg-gradient-to-r from-slate-950 via-black to-slate-950 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] pointer-events-none rounded-full" />
          
          {/* Top Spine Ribbon Bookmark */}
          <div className="hidden md:flex absolute left-1/2 top-0 -ml-3 z-40 flex-col items-center pointer-events-none">
            <div className="w-5.5 h-14 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 shadow-xl rounded-b-md border-x border-amber-400/40 relative">
              <div className="absolute bottom-0 left-0 right-0 h-3.5 bg-amber-800 clip-path-v" />
            </div>
          </div>

          {/* LEFT FOLD PAGE (Unfolds from back-to-front: rotateY -140deg -> 0deg around right spine) */}
          <motion.div
            initial={{ rotateY: -140, opacity: 0, zIndex: 20 }}
            animate={{ rotateY: 0, opacity: 1, zIndex: 10 }}
            whileHover={{ rotateY: -3, transition: { duration: 0.3 } }}
            transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
            className="p-9 md:p-12 min-h-[550px] bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 dark:from-slate-950 dark:to-slate-900 text-white flex flex-col justify-between space-y-6 relative overflow-hidden rounded-t-[2.2rem] md:rounded-tr-none md:rounded-l-[2.2rem] border-t border-l border-b border-r-0 border-blue-900/80 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] group"
          >
            {/* Dynamic Fold Lighting Shadow Overlay */}
            <motion.div
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-0"
            />

            {/* Middle Spine Drop Shadow on Left Page */}
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black/70 via-black/30 to-transparent pointer-events-none z-10" />

            {/* Paper texture overlay accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

            <div className="space-y-6 relative z-20">
              <div className="flex items-center gap-3.5 border-b border-blue-800/60 dark:border-slate-800 pb-5">
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 border border-amber-300 flex items-center justify-center font-black text-base shadow-lg shadow-amber-500/20">
                  GOI
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block">Government of India</span>
                  <h3 className="text-xl font-extrabold text-white leading-tight">Central Oversight Ledger</h3>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-blue-900/40 dark:bg-slate-900/80 border border-blue-800/80 dark:border-slate-800 space-y-3 backdrop-blur-sm shadow-inner">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4.5 h-4.5 text-amber-400" /> Two-Folded Control Register
                </div>
                <p className="text-xs text-blue-100/90 dark:text-slate-300 leading-relaxed">
                  Official authorized access for state project checkers, departmental approvers, and financial controllers.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-blue-200 dark:text-slate-400 uppercase tracking-wider block">
                  Official Access Credentials
                </span>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-blue-800/60 dark:border-slate-800 text-xs space-y-2 shadow-inner">
                  <p className="flex justify-between items-center text-blue-100">
                    <span className="text-slate-400">Username:</span> <code className="font-mono font-bold text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-500/30">admin</code>
                  </p>
                  <p className="flex justify-between items-center text-blue-100">
                    <span className="text-slate-400">Password:</span> <code className="font-mono font-bold text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-500/30">password</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-900/80 dark:border-slate-800 relative z-20 flex items-center justify-between">
              <p className="text-[11px] text-blue-300 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> AES-256 Encrypted Gateway
              </p>
              <span className="text-[10px] font-mono text-amber-400/80 border border-amber-400/30 px-2 py-0.5 rounded">
                VOL-2026-GOI
              </span>
            </div>
          </motion.div>

          {/* RIGHT FOLD PAGE (Unfolds from back-to-front: rotateY 140deg -> 0deg around left spine) */}
          <motion.div
            initial={{ rotateY: 140, opacity: 0, zIndex: 20 }}
            animate={{ rotateY: 0, opacity: 1, zIndex: 10 }}
            whileHover={{ rotateY: 3, transition: { duration: 0.3 } }}
            transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            className="p-9 md:p-12 min-h-[550px] bg-white dark:bg-slate-900 flex flex-col justify-center space-y-6 relative rounded-b-[2.2rem] md:rounded-bl-none md:rounded-r-[2.2rem] border-b md:border-t border-r border-t-0 md:border-l-0 border-slate-200 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] z-30"
          >
            {/* Dynamic Fold Lighting Shadow Overlay */}
            <motion.div
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none z-0"
            />

            {/* Middle Spine Shadow on Right Page */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/20 dark:from-black/60 to-transparent pointer-events-none z-10" />

            <div className="space-y-1 relative z-50">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Management Sign In</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enter your official credentials to open your ledger register.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-50 pointer-events-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Username / ID
                </label>
                <div className="relative z-50 pointer-events-auto">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 z-50 pointer-events-none" />
                  <input
                    {...register('username')}
                    type="text"
                    placeholder="e.g. admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-900 outline-none transition-all relative z-50 pointer-events-auto cursor-text"
                  />
                </div>
                {errors.username && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative z-50 pointer-events-auto">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 z-50 pointer-events-none" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-900 outline-none transition-all relative z-50 pointer-events-auto cursor-text"
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Security Captcha Verification
                </label>
                <div className="space-y-2 relative z-50 pointer-events-auto">
                  <PortalCaptcha
                    onCaptchaChange={(code) => {
                      setExpectedCaptcha(code);
                      setValue('captcha', '');
                    }}
                  />
                  <input
                    {...register('captcha')}
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-character captcha"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-blue-900 outline-none uppercase text-slate-900 dark:text-slate-100 transition-all relative z-50 pointer-events-auto cursor-text"
                  />
                </div>
                {errors.captcha && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.captcha.message}</p>}
              </div>

              <Button type="submit" className="w-full font-bold py-3 mt-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-md relative z-50 pointer-events-auto cursor-pointer" isLoading={isSubmitting}>
                Authenticate & Enter Portal
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* PREVIOUS LOGIN LAYOUT PRESERVED IN COMMENTS PER USER RULE:
      <div className="w-full max-w-4xl mx-auto py-6 px-4" style={{ perspective: '2000px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <motion.div
            initial={{ rotateY: -140, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
            className="p-8 bg-blue-950 dark:bg-slate-950 text-white flex flex-col justify-between space-y-6 relative overflow-hidden rounded-t-[2.2rem] md:rounded-tr-none md:rounded-l-[2.2rem] border-t border-l border-b border-r-0 border-blue-900/80 dark:border-slate-800 shadow-2xl"
          >
            <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm shadow-md">
                  GOI
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Government of India</span>
                  <h3 className="text-base font-extrabold text-white leading-tight">Central Oversight Ledger</h3>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-900/60 dark:bg-slate-900/80 border border-blue-800/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <BookOpen className="w-4 h-4" /> Two-Folded Control Dossier
                </div>
                <p className="text-xs text-blue-100 dark:text-slate-300 leading-relaxed">
                  Authorized access for state project checkers, departmental approvers, and financial controllers.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-blue-200 dark:text-slate-400 uppercase tracking-wider block">
                  Official Access Credentials
                </span>
                <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-800/50 text-xs space-y-1">
                  <p className="flex justify-between text-blue-100">
                    <span>Username:</span> <code className="font-mono font-bold text-amber-300">admin</code>
                  </p>
                  <p className="flex justify-between text-blue-100">
                    <span>Password:</span> <code className="font-mono font-bold text-amber-300">password</code>
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-blue-900/80 dark:border-slate-800">
              <p className="text-[11px] text-blue-300 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> AES-256 Encrypted Gateway & Audit Logged
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ rotateY: 140, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
            className="p-8 bg-white dark:bg-slate-900 flex flex-col justify-center space-y-5 relative rounded-b-[2.2rem] md:rounded-bl-none md:rounded-r-[2.2rem] border-b md:border-t border-r border-t-0 md:border-l-0 border-slate-200 dark:border-slate-800 shadow-2xl"
          >
            <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/20 dark:from-black/50 to-transparent pointer-events-none" />
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Management Sign In</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enter your official credentials to open your ledger.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Username / ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    {...register('username')}
                    type="text"
                    placeholder="e.g. admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                  />
                </div>
                {errors.username && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.username.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Security Captcha Verification
                </label>
                <div className="space-y-2">
                  <PortalCaptcha
                    onCaptchaChange={(code) => {
                      setExpectedCaptcha(code);
                      setValue('captcha', '');
                    }}
                  />
                  <input
                    {...register('captcha')}
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-character captcha"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-blue-900 outline-none uppercase text-slate-900 dark:text-slate-100 transition-all"
                  />
                </div>
                {errors.captcha && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.captcha.message}</p>}
              </div>
              <Button type="submit" className="w-full font-bold py-3 mt-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-md" isLoading={isSubmitting}>
                Authenticate & Enter Portal
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      */}
    </div>
  );
}



