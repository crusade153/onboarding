// src/app/api/auth/route.ts
// 강연자 PIN 검증 → HttpOnly 쿠키 발급
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'sysinno_presenter';
const COOKIE_VALUE = 'verified-v2';
const ONE_DAY = 60 * 60 * 24;
const DEFAULT_PRESENTER_PIN = '820119';

export async function POST(req: NextRequest) {
  const { pin } = await req.json().catch(() => ({}));
  const expected = process.env.PRESENTER_PIN ?? DEFAULT_PRESENTER_PIN;

  if (typeof pin !== 'string' || pin !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: COOKIE_VALUE,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ONE_DAY,
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: COOKIE_NAME, value: '', maxAge: 0, path: '/' });
  return res;
}
