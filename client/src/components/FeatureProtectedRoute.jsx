import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, ChevronLeft, Loader } from 'lucide-react';

export const FeatureProtectedRoute = ({ featureKey, children }) => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      // Admins are exempt from feature lock for testing purposes
      if (user && user.role === 'Admin') {
        setIsActive(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/settings/features', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let result;
        try {
          result = await response.json();
        } catch (jsonErr) {
          console.warn('Failed to parse feature flags JSON:', jsonErr);
          setIsActive(true);
          return;
        }
        
        if (response.ok && result.success) {
          const flag = result.data.find(f => f.feature_key === featureKey);
          if (flag) {
            setIsActive(flag.is_active);
          }
        }
      } catch (err) {
        console.error('Error fetching feature flags:', err);
      } finally {
        setLoading(false);
      }
    };

    checkFeature();
  }, [featureKey, token, user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Loader className="animate-spin text-brand-500" size={32} />
        <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">सत्यापन किया जा रहा है...</span>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex-1 w-full max-w-xl mx-auto p-6 flex flex-col justify-center items-center min-h-[75vh]">
        {/* Glowing glass panel */}
        <div className="glass-panel w-full p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-rose-950/20 via-slate-950/40 to-slate-950/60 shadow-premium flex flex-col items-center text-center gap-6 relative overflow-hidden glow-rose">
          {/* Decorative ambient background spots */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-slate-500/10 blur-3xl"></div>

          {/* Alert icon with breathing animation */}
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center justify-center animate-pulse shrink-0">
            <ShieldAlert size={36} />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              सुविधा अस्थायी रूप से निष्क्रिय है
            </h2>
            <h3 className="text-xs md:text-sm font-bold text-rose-400/90 tracking-widest uppercase">
              Feature Temporarily Disabled
            </h3>
          </div>

          <div className="flex flex-col gap-3 max-w-md border-t border-b border-white/5 py-5 my-1">
            <p className="text-xs text-slate-300 font-medium leading-relaxed Hindi">
              आरडब्ल्यूए प्रबंधक द्वारा इस सुविधा को अस्थायी रूप से बंद कर दिया गया है। सोसायटी रखरखाव या प्रशासनिक नीति के तहत यह सुविधा जल्द ही फिर से उपलब्ध होगी।
            </p>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              This module has been temporarily deactivated by the Society Welfare Association Administrator for maintenance or policy updates.
            </p>
          </div>

          <Link
            to={user?.role === 'Security' ? '/visitor-logs' : '/dashboard'}
            className="px-6 py-3 bg-white/5 border border-white/10 hover:border-brand-500/20 hover:bg-brand-500/10 text-slate-300 hover:text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 group shadow-lg"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>डैशबोर्ड पर वापस जाएं</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default FeatureProtectedRoute;
