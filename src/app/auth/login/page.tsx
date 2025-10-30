'use client';

/**
 * Login Page
 * Last Updated: 2025-01-27
 */

import React from 'react';
import AuthLogin from '@/components/auth-login';
import { useAuthLoginForm } from '@/components/auth-login/hooks/index.form.hook';

export default function LoginPage() {
  const {
    email,
    password,
    error,
    errorMessage,
    loading,
    canSubmit,
    onEmailChange,
    onPasswordChange,
    onLoginClick,
    onSignupClick,
  } = useAuthLoginForm();

  return (
    <AuthLogin
      email={email}
      password={password}
      onEmailChange={onEmailChange}
      onPasswordChange={onPasswordChange}
      onLoginClick={onLoginClick}
      onSignupClick={onSignupClick}
      error={error}
      errorMessage={errorMessage}
      loading={loading}
      canSubmit={canSubmit}
    />
  );
}
