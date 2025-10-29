'use client';

/**
 * Signup Page
 * Last Updated: 2025-01-27
 */

import { AuthSignup } from '@/components/auth-signup';

export default function SignupPage() {
  const handleEmailChange = (value: string) => {
    console.log('Email changed:', value);
  };

  const handleNameChange = (value: string) => {
    console.log('Name changed:', value);
  };

  const handlePasswordChange = (value: string) => {
    console.log('Password changed:', value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    console.log('Confirm password changed:', value);
  };

  const handleSignupClick = () => {
    console.log('Signup clicked');
  };

  return (
    <AuthSignup
      onEmailChange={handleEmailChange}
      onNameChange={handleNameChange}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onSignupClick={handleSignupClick}
    />
  );
}
