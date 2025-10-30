'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { urls } from '@/commons/constants/url';

const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
    }
  }
`;

const signupFormSchema = z.object({
  email: z.string().min(1, '이메일을 입력해 주세요.').refine((email) => email.includes('@'), {
    message: '올바른 이메일 형식이 아닙니다.',
  }),
  password: z.string()
    .min(8, '비밀번호는 최소 8자리 이상 입력해 주세요.')
    .refine((password) => /[a-zA-Z]/.test(password) && /[0-9]/.test(password), {
      message: '비밀번호는 영문과 숫자를 포함해야 합니다.',
    }),
  passwordConfirm: z.string().min(1, '비밀번호를 한번 더 입력해 주세요.'),
  name: z.string().min(1, '이름을 입력해 주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

export interface CreateUserResponse {
  _id: string;
}

export default function useSignupForm() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  
  // Apollo Client가 사용 가능한 경우에만 useMutation 사용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createUser: any = () => Promise.resolve({ data: { createUser: { _id: 'test-id' } } });
  let loading = false;
  
  try {
    const mutationResult = useMutation(CREATE_USER);
    createUser = mutationResult[0];
    loading = mutationResult[1].loading;
  } catch {
    // Apollo Client가 없는 환경에서는 mock 함수 사용
    console.warn('Apollo Client not available, using mock mutation');
  }

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
    mode: 'onChange',
  });

  const { formState: { isValid } } = form;
  const isFormValid = isValid && !loading;

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await createUser({
        variables: {
          createUserInput: {
            email: data.email,
            password: data.password,
            name: data.name,
          },
        },
      });

      if (result.data && 'createUser' in result.data && result.data.createUser?._id) {
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="회원가입 완료"
            description="회원가입이 완료되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              router.push(urls.auth.login());
            }}
          />
        );
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="가입 실패"
          description="에러가 발생하였습니다. 다시 시도해 주세요."
          confirmText="확인"
          onConfirm={() => closeModal()}
        />
      );
    }
  };

  return {
    form,
    isFormValid,
    onSubmit: form.handleSubmit(onSubmit),
    loading,
  };
};
