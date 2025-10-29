'use client';

/**
 * Login Page
 * Last Updated: 2025-01-27
 */

import AuthLogin from '@/components/auth-login';

export default function LoginPage() {
  const handleEmailChange = (value: string) => {
    console.log('Email changed:', value);
  };

  const handlePasswordChange = (value: string) => {
    console.log('Password changed:', value);
  };

  const handleLoginClick = () => {
    console.log('Login clicked');
  };

  const handleSignupClick = () => {
    console.log('Signup clicked');
  };

  return (
    <AuthLogin
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onLoginClick={handleLoginClick}
      onSignupClick={handleSignupClick}
    />
  );
}
