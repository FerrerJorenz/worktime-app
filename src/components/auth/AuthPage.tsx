import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
            {/* Background gradient effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-[var(--color-brand)] opacity-10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 opacity-10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
                {/* Left side - Branding */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                        <div className="w-12 h-12 bg-[var(--color-brand)] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,229,153,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-bg-dark)]">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white">WorkTime</h1>
                    </div>

                    <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                        Track Your<br />
                        <span className="text-[var(--color-brand)]">Productivity</span>
                    </h2>

                    <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto lg:mx-0">
                        Monitor work sessions, analyze patterns, and boost your productivity with intelligent time tracking.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 text-[var(--color-text-secondary)] justify-center lg:justify-start">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand)]">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Real-time tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand)]">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Project management</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand)]">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Analytics</span>
                        </div>
                    </div>
                </div>

                {/* Right side - Auth Form */}
                <div className="flex-1 w-full flex flex-col items-center">
                    {isLogin ? <LoginForm /> : <RegisterForm />}

                    <div className="mt-6 text-center">
                        <p className="text-[var(--color-text-secondary)]">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-[var(--color-brand)] hover:underline font-medium"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
