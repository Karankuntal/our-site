import { NextResponse } from 'next/server';

export function middleware(req) {
  const authHeader = req.headers.get('authorization');

  const USER = 'admin';
  const PASS = 'Ashikaran831'; // your password

  if (authHeader) {
    const encoded = authHeader.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString(); // FIX
    const [user, pass] = decoded.split(':');

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}