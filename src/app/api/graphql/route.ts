import { NextRequest, NextResponse } from 'next/server';

const GRAPHQL_ENDPOINT = 'https://main-practice.codebootcamp.co.kr/graphql';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_ORIGIN || 'http://localhost:3000';
    const authorization = request.headers.get('authorization') || '';
    const contentType = request.headers.get('content-type') || '';

    const headers: Record<string, string> = {
      Origin: origin,
    };

    if (authorization) {
      headers.Authorization = authorization;
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
    };

    if (contentType.includes('multipart/form-data')) {
      fetchOptions.body = request.body;
      // @ts-expect-error duplex는 Node.js fetch 스트리밍 전송에 필요
      fetchOptions.duplex = 'half';
    } else {
      const bodyText = await request.text();
      fetchOptions.body = bodyText;
      if (!contentType) {
        fetchOptions.headers = {
          ...headers,
          'Content-Type': 'application/json',
        };
      }
    }

    const response = await fetch(GRAPHQL_ENDPOINT, fetchOptions);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
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
