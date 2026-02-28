import React, { useState } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import cn  from '../utils/cn';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            setIsLoggingIn(true);

            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json", // ✅ REQUIRED
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            res = await res.json();

            if (!res.success) {
                throw new Error(res.message);
            } else {
                alert('You have successfully login');
                setEmail('');
                setPassword('')
                navigate('/')
            }


        } catch (error) {
            alert(error.message)
        } finally {
            setIsLoggingIn(false);

        }
    };



    return (
        <main className={cn(
            "min-h-screen w-full flex items-center justify-center p-4",
            "bg-[var(--bg-primary)]"
        )}>
            {/* Login Card */}
            <div className={cn(
                "w-full max-w-md p-8 rounded-2xl border shadow-2xl transition-all",
                "bg-[var(--bg-secondary)] border-slate-800/50 hover:border-slate-700"
            )}>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                        Welcome <span className="text-[var(--accent)]">Back</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Enter your credentials to access your notes.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] ml-1">
                            Email
                        </label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-900/50" // Example of merging class via cn inside the component
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] ml-1">
                                Password
                            </label>
                            <Link to='/forget-password'>
                                <button
                                    type="button"
                                    className="text-xs text-[var(--accent)] hover:opacity-80 transition-opacity"
                                >
                                    Forgot?
                                </button>
                            </Link>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='bg-slate-900/50'
                        />
                    </div>

                    {/* Action Button */}
                    <Button
                        type="submit"
                        loading={isLoggingIn}
                        className={cn(
                            "w-full mt-2 text-base font-bold uppercase tracking-widest",
                            "shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                        )}
                    >
                        {!isLoggingIn && <LogIn size={18} className="mr-2" />}
                        Login
                    </Button>
                </form>

                {/* Signup Redirect */}
                <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
                    <p className="text-[var(--text-secondary)] text-sm">
                        New to NoteFlow?{' '}
                        <Link to="/signup">
                            <button className="text-[var(--accent)] font-semibold hover:underline decoration-[var(--accent)] underline-offset-4">
                                Create an account
                            </button>
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Login;