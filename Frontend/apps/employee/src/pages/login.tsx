import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/auth-store';
import { authService } from '../lib/api/auth-service';
import { PortalCaptcha } from '../components/shared/PortalCaptcha';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';
import { Lock, User, ShieldCheck, BookOpen, Key, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  captcha: z.string().length(6, 'Captcha code must be 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [expectedCaptcha, setExpectedCaptcha] = useState('');
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
        toast.success(`Welcome back, ${res.data.user.name}!`);
      } else {
        toast.error(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      toast.error('An error occurred during sign in.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4" style={{ perspective: '2000px' }}>
      {/* Two-Folded Book Grid Container without static background border */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        
        {/* Left Fold — Pivots outward from backside (-140deg) around middle spine (right center) */}
        <motion.div
          initial={{ rotateY: -140, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
          className="p-8 bg-blue-950 dark:bg-slate-950 text-white flex flex-col justify-between space-y-6 relative overflow-hidden rounded-t-[2.2rem] md:rounded-tr-none md:rounded-l-[2.2rem] border-t border-l border-b border-r-0 border-blue-900/80 dark:border-slate-800 shadow-2xl"
        >
          {/* Middle Spine Gradient Highlight */}
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm shadow-md">
                GOI
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Government of India</span>
                <h3 className="text-base font-extrabold text-white leading-tight">Employee Service Ledger</h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-900/60 dark:bg-slate-900/80 border border-blue-800/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <BookOpen className="w-4 h-4" /> Two-Folded Employee Portal
              </div>
              <p className="text-xs text-blue-100 dark:text-slate-300 leading-relaxed">
                Official service portal for state engineers, developers, and project personnel.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-blue-200 dark:text-slate-400 uppercase tracking-wider block">
                Official Access Credentials
              </span>
              <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-800/50 text-xs space-y-1">
                <p className="flex justify-between text-blue-100">
                  <span>Username:</span> <code className="font-mono font-bold text-amber-300">dev1</code> (or <code className="font-mono font-bold text-amber-300">sanskar</code>)
                </p>
                <p className="flex justify-between text-blue-100">
                  <span>Password:</span> <code className="font-mono font-bold text-amber-300">password</code>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-900/80 dark:border-slate-800">
            <p className="text-[11px] text-blue-300 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> AES-256 Encrypted Service Gateway
            </p>
          </div>
        </motion.div>

        {/* Right Fold — Pivots outward from backside (+140deg) around middle spine (left center) */}
        <motion.div
          initial={{ rotateY: 140, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
          className="p-8 bg-white dark:bg-slate-900 flex flex-col justify-center space-y-5 relative rounded-b-[2.2rem] md:rounded-bl-none md:rounded-r-[2.2rem] border-b md:border-t border-r border-t-0 md:border-l-0 border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          {/* Middle Spine Gradient Highlight */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/20 dark:from-black/50 to-transparent pointer-events-none" />



          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Employee Sign In</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter your credentials to open your employee portal.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Username / Employee ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  {...register('username')}
                  type="text"
                  placeholder="e.g. dev1 or sanskar"
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
                Security Verification Captcha
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
              Sign In to Portal
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}


