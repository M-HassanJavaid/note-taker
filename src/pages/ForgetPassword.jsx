import React, { useState } from 'react';
import { Mail, KeyRound, ArrowLeft, SendHorizontal, Lock, CheckCircle2 } from 'lucide-react';
import cn from '../utils/cn.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const handleRequestOtp = async (e ) => {
        try {
            console.log(e)
            e.preventDefault();
            console.log('request for otp')
            if (!email) {
                alert('Email is required');
                return
            }
            setIsLoading(true);
             let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/otp-for-reset-password`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            let data = await res.json();
            if (!data.success) throw new Error(data.message);
            setStep(2);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            if (otp.length !== 6) throw new Error('Otp should have 6 digits');

            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/verify-otp`, {
                method: 'PUT',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp, email })
            });
            let data = await res.json();
            if (!data.success) throw new Error(data.message);
            setStep(3);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        try {
            e.preventDefault();
            if (password !== confirmPassword) throw new Error("Passwords do not match");
            setIsLoading(true);

            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/change-password`, {
                method: 'PUT',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword: password })
            });
            let data = await res.json();
            if (!data.success) throw new Error(data.message);

            alert("Password reset successful, login with new password to continue.");
            navigate('/login')

        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Determine form submit handler based on current step
    const getSubmitHandler = () => {
        console.log(step)
        if (step === 1) return handleRequestOtp;
        if (step === 2) return handleVerifyOtp;
        return handleResetPassword;
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-(--bg-primary) p-4">
            <div className="w-full max-w-md p-8 rounded-2xl bg-(--bg-secondary) border border-slate-800/50 shadow-2xl">

                <button
                    onClick={() => setStep(step - 1)}
                    className={cn(
                        "flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--accent) transition-colors mb-6",
                        step === 1 && "invisible"
                    )}
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--accent)/10 text-(--accent) mb-4">
                        {step === 1 && <Mail size={32} />}
                        {step === 2 && <KeyRound size={32} />}
                        {step === 3 && <Lock size={32} />}
                    </div>
                    <h1 className="text-2xl font-bold text-(--text-primary)">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "Set New Password"}
                    </h1>
                    <p className="text-(--text-secondary) text-sm mt-2">
                        {step === 1 && "Enter your email to receive a reset code."}
                        {step === 2 && `Code sent to ${email}`}
                        {step === 3 && "Create a strong password for your account."}
                    </p>
                </div>

                <form onSubmit={getSubmitHandler()} className="space-y-5">
                    {step === 1 && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-(--text-secondary) ml-1">Email Address</label>
                            <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-(--text-secondary) ml-1">Enter 6-Digit OTP</label>
                            <Input type="text" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} className="text-center text-2xl tracking-[0.5em] font-mono" maxLength={6} required />
                        </div>
                    )}

                    {step === 3 && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-(--text-secondary) ml-1">New Password</label>
                                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-(--text-secondary) ml-1">Confirm Password</label>
                                <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                        </>
                    )}

                    <Button type="submit" loading={isLoading} className="w-full py-6 text-base font-bold uppercase tracking-widest">
                        {step === 1 && <>Send Reset Code <SendHorizontal size={18} className="ml-2" /></>}
                        {step === 2 && "Verify & Proceed"}
                        {step === 3 && "Update Password"}
                    </Button>
                </form>

                {step === 2 && (
                    <p className="mt-6 text-center text-sm text-(--text-secondary)">
                        Didn't receive the code? <button className="text-(--accent) hover:underline" onClick={handleRequestOtp}>Resend</button>
                    </p>
                )}
            </div>
        </main>
    );
};

export default ForgetPassword;