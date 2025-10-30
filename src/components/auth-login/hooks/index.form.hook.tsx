'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { gql } from '@apollo/client';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';
import { useRouter } from 'next/navigation';
import { urls } from '@/commons/constants/url';

const LoginSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }).includes('@', {
    message: '이메일에는 @가 포함되어야 합니다.',
  }),
  password: z.string().min(1, { message: '비밀번호를 입력해 주세요.' }),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`;

const FETCH_USER_LOGGED_IN = gql`
  query fetchUserLoggedIn {
    fetchUserLoggedIn {
      _id
      name
    }
  }
`;

export interface UseAuthLoginFormReturn {
  email: string;
  password: string;
  error: boolean;
  errorMessage?: string;
  loading: boolean;
  canSubmit: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLoginClick: () => Promise<void>;
  onSignupClick: () => void;
}

export const useAuthLoginForm = (): UseAuthLoginFormReturn => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const hasShownModalRef = useRef<{ success: boolean; fail: boolean }>({ success: false, fail: false });

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [requestLogin, { loading }] = useMutation(LOGIN_USER);
  const [requestFetchUser] = useLazyQuery(FETCH_USER_LOGGED_IN);

  const onEmailChange = useCallback((value: string) => {
    setValue('email', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  }, [setValue]);

  const onPasswordChange = useCallback((value: string) => {
    setValue('password', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  }, [setValue]);

  const openSuccessModalOnce = useCallback(() => {
    if (hasShownModalRef.current.success) return;
    hasShownModalRef.current.success = true;
    openModal(
      <Modal
        variant="info"
        actions="single"
        title="로그인 완료"
        description="게시글 목록으로 이동합니다."
        confirmText="확인"
        onConfirm={() => {
          closeModal();
          router.push(urls.boards.list());
        }}
      />
    );
  }, [closeModal, openModal, router]);

  const openFailModalOnce = useCallback((message?: string) => {
    if (hasShownModalRef.current.fail) return;
    hasShownModalRef.current.fail = true;
    openModal(
      <Modal
        variant="danger"
        actions="single"
        title="로그인 실패"
        description={message ?? '이메일 또는 비밀번호를 확인해 주세요.'}
        confirmText="확인"
        onConfirm={() => {
          closeModal();
        }}
      />
    );
  }, [closeModal, openModal]);

  const onLoginClick = useCallback(async () => {
    setError(false);
    setErrorMessage(undefined);

    const values = getValues();
    const parseResult = LoginSchema.safeParse(values);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      setError(true);
      setErrorMessage(firstIssue?.message ?? '입력값을 확인해 주세요.');
      return;
    }

    try {
      const { data: loginData } = await requestLogin({
        variables: { email: values.email, password: values.password },
      });

      const accessToken: string | undefined = loginData?.loginUser?.accessToken;
      if (!accessToken) {
        throw new Error('accessToken이 반환되지 않았습니다.');
      }

      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);

      // 사용자 정보 조회 (헤더에 Authorization)
      const { data: userData } = await requestFetchUser({
        context: { headers: { Authorization: `Bearer ${accessToken}` } },
        fetchPolicy: 'no-cache',
      });

      const user = userData?.fetchUserLoggedIn;
      if (user?._id && user?.name) {
        localStorage.setItem('user', JSON.stringify({ _id: user._id, name: user.name }));
      }

      openSuccessModalOnce();
    } catch (e: any) {
      setError(true);
      const message = typeof e?.message === 'string' ? e.message : '로그인에 실패했습니다.';
      setErrorMessage(message);
      openFailModalOnce(message);
    }
  }, [getValues, openFailModalOnce, openSuccessModalOnce, requestFetchUser, requestLogin]);

  const onSignupClick = useCallback(() => {
    router.push(urls.auth.signup());
  }, [router]);

  const email = watch('email') ?? '';
  const password = watch('password') ?? '';

  return {
    email,
    password,
    error,
    errorMessage,
    loading: Boolean(loading),
    canSubmit: isValid,
    onEmailChange,
    onPasswordChange,
    onLoginClick,
    onSignupClick,
  };
};

export default useAuthLoginForm;

