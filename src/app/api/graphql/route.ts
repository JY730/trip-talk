import { NextRequest, NextResponse } from 'next/server';

const GRAPHQL_ENDPOINT = 'https://main-practice.codebootcamp.co.kr/graphql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text(); // body를 그대로 받음

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_ORIGIN || 'http://localhost:3000';
    const authorization = request.headers.get('authorization') || '';

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 백엔드가 Origin을 참고하여 CORS 헤더를 설정하는 경우 undefined 방지
        'Origin': origin,
        // 토큰 전달 필요 시 넘겨줌
        ...(authorization ? { 'Authorization': authorization } : {}),
      },
      body,
    });

    const data = await response.text(); // text로 받아 그대로 전달

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
