import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/auth-store';
import { authService } from '../lib/api/auth-service';
import { PortalCaptcha } from '../components/shared/PortalCaptcha';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';
import { Lock, User, ShieldCheck } from 'lucide-react';

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
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-lg shadow-indigo-500/30">
          PM
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Employee Sign In</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Project Management & Budget Tracking System
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Username / Employee ID
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              {...register('username')}
              type="text"
              placeholder="e.g. sanskar"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Security Verification
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
            />
          </div>
          {errors.captcha && <p className="text-xs text-rose-500 mt-1">{errors.captcha.message}</p>}
        </div>

        <Button type="submit" className="w-full font-semibold py-3 mt-2" isLoading={isSubmitting}>
          Sign In to Portal
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Protected by AES-256 Payload Encryption
        </p>
      </div>
    </div>
  );
}
