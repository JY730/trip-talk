/**
 * Home Page
 * 메인 페이지 - boards(트립토크) 페이지로 리다이렉트
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/boards');
}

