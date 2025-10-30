'use client';

/**
 * Signup Page
 * Last Updated: 2025-01-27
 */

import { AuthSignup } from '@/components/auth-signup';
import useSignupForm from '@/components/auth-signup/hooks/index.form.hook';

export default function SignupPage() {
  const { form, isFormValid, onSubmit, loading } = useSignupForm();

  const handleEmailChange = (value: string) => {
    form.setValue('email', value, { shouldValidate: true });
  };

  const handleNameChange = (value: string) => {
    form.setValue('name', value, { shouldValidate: true });
  };

  const handlePasswordChange = (value: string) => {
    form.setValue('password', value, { shouldValidate: true });
  };

  const handleConfirmPasswordChange = (value: string) => {
    form.setValue('passwordConfirm', value, { shouldValidate: true });
  };

  const handleSignupClick = () => {
    onSubmit();
  };

  return (
    <div data-testid="signup-page">
      <AuthSignup
        email={form.watch('email')}
        name={form.watch('name')}
        password={form.watch('password')}
        confirmPassword={form.watch('passwordConfirm')}
        onEmailChange={handleEmailChange}
        onNameChange={handleNameChange}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
        onSignupClick={handleSignupClick}
        error={false}
        loading={loading}
        isFormValid={isFormValid}
      />
    </div>
  );
}
