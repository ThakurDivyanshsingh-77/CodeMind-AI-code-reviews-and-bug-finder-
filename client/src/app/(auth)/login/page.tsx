'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Terminal, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const token = credentialResponse.credential;
      if (!token) {
        throw new Error('No credential token received from Google');
      }

      // Determine the API URL dynamically based on the environment config
      const googleLoginUrl = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL || 
        (process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')}/api/google-login` 
          : 'https://connect-315o.onrender.com/api/google-login');

      // Send the token to the backend
      const response = await axios.post(googleLoginUrl, {
        token,
      });

      if (response.data?.success && response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        // Force full reload/redirect to dashboard to make AuthProvider mount and fetch user
        window.location.href = '/dashboard';
      } else {
        throw new Error(response.data?.message || 'Google authentication response failed');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Google authentication failed');
      setLoading(false);
    }
  };

  // Redirect if user is already authenticated
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-bg flex flex-col items-center justify-center p-6 text-ink-black selection:bg-editorial-red/20 dot-grid-bg relative overflow-hidden">
      {/* Top Ticker Marquee */}
      <div className="absolute top-0 left-0 w-full bg-ink-black text-paper-bg py-2 font-mono text-[9px] uppercase tracking-widest overflow-hidden border-b border-ink-black z-20 select-none hidden lg:block">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>CodeMind AI Reviewer • Status: Operational • Gemini 2.5 Active • Security scan completed successfully • review smarter • ship faster •</span>
          <span>CodeMind AI Reviewer • Status: Operational • Gemini 2.5 Active • Security scan completed successfully • review smarter • ship faster •</span>
          <span>CodeMind AI Reviewer • Status: Operational • Gemini 2.5 Active • Security scan completed successfully • review smarter • ship faster •</span>
          <span>CodeMind AI Reviewer • Status: Operational • Gemini 2.5 Active • Security scan completed successfully • review smarter • ship faster •</span>
        </div>
      </div>

      {/* Decorative Editorial Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-0 hidden lg:block">
        {/* Floating Card 1: Code Review log */}
        <div className="absolute left-[8%] top-[15%] w-72 bg-amber-50/70 border border-ink-black/15 p-4 font-mono text-[10px] text-neutral-500/80 -rotate-3 sharp-corners hard-shadow-hover transition-all duration-300 pointer-events-auto hover:scale-[1.03] hover:rotate-0 hover:z-20 hover:border-editorial-red/50 hover:bg-amber-50/90 cursor-pointer animate-float-1">
          <div className="border-b border-dashed border-ink-black/10 pb-2 mb-2 flex justify-between">
            <span>SESSION: #4092</span>
            <span className="text-emerald-700 font-bold">STATUS: OK</span>
          </div>
          <pre className="leading-relaxed">
{`// review_session.ts
export function analyze(code: string) {
  console.log("Analyzing...");
  // FIX: resolve potential memory leak
  return { score: 98, status: "READY" };
}`}
          </pre>
        </div>

        {/* Floating Card 2: Git Commit Tag */}
        <div className="absolute left-[10%] bottom-[15%] w-64 bg-editorial-red/5 border border-editorial-red/15 p-3.5 font-mono text-[9px] text-editorial-red/60 rotate-2 sharp-corners transition-all duration-300 pointer-events-auto hover:scale-[1.03] hover:rotate-0 hover:border-editorial-red hover:z-20 hover:bg-editorial-red/10 cursor-pointer animate-float-2">
          <div className="font-bold mb-1 border-b border-editorial-red/10 pb-1">GIT COMMIT HISTORY</div>
          <div>commit 4f8d9b2a</div>
          <div>Author: AI Reviewer &lt;bot@codemind.ai&gt;</div>
          <div>Date:   Tue Jul 14 09:44 2026</div>
          <div className="mt-2 text-ink-black/60 font-bold">&gt; feat: add google oauth login</div>
        </div>

        {/* Floating Card 3: Metrics Report */}
        <div className="absolute right-[8%] top-[25%] w-60 bg-white/70 border border-ink-black/15 p-4 font-mono text-[9px] text-neutral-600/80 rotate-3 sharp-corners hard-shadow-hover transition-all duration-300 pointer-events-auto hover:scale-[1.03] hover:rotate-0 hover:border-editorial-red/50 hover:bg-white cursor-pointer animate-float-3">
          <div className="font-bold border-b border-ink-black/10 pb-1.5 mb-1.5 tracking-wider uppercase text-neutral-700">Audit Performance</div>
          <div className="flex justify-between text-neutral-500"><span>[SPEED]</span><span className="text-ink-black font-bold">120 files/sec</span></div>
          <div className="flex justify-between text-neutral-500"><span>[ACCURACY]</span><span className="text-ink-black font-bold">99.8% Precision</span></div>
          <div className="flex justify-between text-neutral-500"><span>[PROVIDER]</span><span className="text-ink-black font-bold">Gemini 2.5 Flash</span></div>
          <div className="flex justify-between mt-1.5 pt-1.5 border-t border-dashed border-ink-black/10 font-bold"><span>STATUS</span><span className="text-emerald-600">OPERATIONAL</span></div>
        </div>

        {/* Floating Card 4: CodeMind Logo Watermark Accent */}
        <div className="absolute right-[12%] bottom-[12%] w-40 h-40 bg-ink-black/5 border border-ink-black/10 sharp-corners flex items-center justify-center font-serif text-[100px] font-black text-ink-black/5 -rotate-12 transition-transform duration-500 hover:rotate-0">
          CM
        </div>
      </div>

      <div className="w-full max-w-md bg-paper-bg border border-ink-black p-8 flex flex-col gap-6 sharp-corners hard-shadow-hover z-10">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg sharp-corners">
            <Terminal size={18} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-serif font-black tracking-tight text-ink-black uppercase">Sign in to CodeMind</h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">Welcome back. Enter your credentials.</p>
        </div>

        {/* Error message box */}
        {errorMsg && (
          <div className="p-3 bg-editorial-red/5 border border-editorial-red text-editorial-red text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
            <AlertCircle size={14} strokeWidth={1.5} />
            <span>ALERT: {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black py-3.5 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:bg-neutral-400 disabled:text-neutral-200"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={14} strokeWidth={1.5} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <span className="text-center text-[10px] font-mono uppercase tracking-wider text-neutral-500 border-t border-ink-black pt-4">
          New to CodeMind?{' '}
          <Link href="/register" className="text-ink-black font-bold underline hover:text-editorial-red transition-colors">
            Create an account
          </Link>
        </span>

        <div className="relative flex items-center justify-center my-1 text-neutral-400">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-ink-black/25"></div>
          </div>
          <span className="relative px-3 bg-paper-bg text-[9px] font-mono uppercase tracking-widest text-neutral-500">or continue with</span>
        </div>

        <div className="flex justify-center w-full">
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '915518431027-con7b7sp2k64u9t3l1v80farh0ort35g.apps.googleusercontent.com'}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setErrorMsg('Google authentication failed. Please try again.');
              }}
              theme="outline"
              size="large"
              shape="square"
              width="384px"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
