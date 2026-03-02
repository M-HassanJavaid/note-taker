import React, { useContext, useState } from 'react';
import { MailWarning, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import cn from '../utils/cn';
import AuthContext from '../context/authContext';
import { Navigate } from 'react-router-dom';

const EmailVerification = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {user , setUser} = useContext(AuthContext);


  const handleRequestLink = async () => {
    setIsSending(true);
    try {
      // Logic for sending verification email
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/resend-verification-email`, {
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        setIsSent(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return <Navigate to='/login' />
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--bg-primary) p-6">
      <div className={cn(
        "w-full max-w-md bg-(--bg-secondary) rounded-2xl border border-slate-800/50 p-8 shadow-2xl text-center",
        "animate-in fade-in zoom-in duration-500"
      )}>
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className={cn(
            "p-4 rounded-full border shadow-inner transition-colors duration-500",
            isSent ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            {isSent ? <CheckCircle2 size={48} /> : <ShieldAlert size={48} />}
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-(--text-primary) mb-3">
          {isSent ? "Email Sent!" : "Verify Your Identity"}
        </h1>
        
        <p className="text-(--text-secondary) leading-relaxed mb-8">
          {isSent 
            ? "A fresh verification link has been sent to your inbox. Please check your spam folder if you don't see it."
            : "Your account is currently restricted because your email address has not been verified yet."}
        </p>

        {/* Action Area */}
        <div className="space-y-4">
          <Button 
            onClick={handleRequestLink}
            loading={isSending}
            disabled={isSent}
            className={cn(
              "w-full py-4 font-bold text-lg transition-all",
              isSent ? "bg-slate-800 text-slate-400 cursor-default" : "bg-(--btn-primary) shadow-lg shadow-blue-500/10"
            )}
          >
            {isSent ? (
              "Link Sent"
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Get Verification Link
              </>
            )}
          </Button>

          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors font-medium underline underline-offset-4"
          >
            I've verified my email
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-xs text-(--text-secondary)/50 uppercase tracking-widest font-bold">
          Secure Access System
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;