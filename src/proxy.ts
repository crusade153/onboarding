// src/proxy.ts (Next.js 16 — middleware의 새 이름)
// 강연자 전용 경로(/, /prologue, /part1~3, /epilogue, /admin)는 PRESENTER 쿠키가 있어야 진입.
// 청중 경로(/join, /perception, /hbh, /gratitude)는 무인증 진입 (세션 코드 검증은 페이지에서).
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRESENTER_COOKIE = 'sysinno_presenter';
const PRESENTER_PATHS = ['/', '/prologue', '/part1', '/part2', '/part3', '/epilogue', '/admin'];

function isPresenterPath(pathname: string) {
  if (pathname === '/') return true;
  return PRESENTER_PATHS.some((p) => p !== '/' && (pathname === p || pathname.startsWith(p + '/')));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isPresenterPath(pathname)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(PRESENTER_COOKIE);
  if (cookie && cookie.value) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // api, _next, 정적 파일은 제외
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|login|join|perception|hbh|gratitude).*)',
  ],
};
