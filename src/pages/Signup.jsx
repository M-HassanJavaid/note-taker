import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsSubmitting(true);


            let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    name
                })
            });

            res = await res.json();
            console.log(res)

            if (!res.success) {
                throw new Error(res.message);
            } else {
                alert('You have successfully signup, A verification email has sent to you verify your email.');
                setEmail('');
                setPassword('')
                navigate('/')
            }
            
        } catch (error) {
            alert(error.message)
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }


    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-primary)] px-4">
            {/* Form Container */}
            <div className="w-full max-w-md bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-2xl border border-slate-800/50">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                        Create <span className="text-[var(--accent)]">Account</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Join NoteFlow and start organizing your thoughts.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Email Address</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Hassan Javaid"
                            required
                            className='bg-slate-900/50'
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Email Address</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Fixed typo from 'taeget'
                            placeholder="name@example.com"
                            required
                            className='bg-slate-900/50'
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className='bg-slate-900/50'
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full py-3 mt-4 text-lg shadow-lg shadow-blue-500/20"
                    >
                        {!isSubmitting && <UserPlus size={18} className="mr-2" />}
                        Sign Up
                    </Button>
                </form>

                {/* Footer Link */}
                <p className="mt-8 text-center text-[var(--text-secondary)] text-sm">
                    Already have an account?{' '}
                    <Link to='/login'>
                        <button className="text-[var(--accent)] hover:underline font-medium">
                            Log in
                        </button>
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Signup;