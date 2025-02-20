import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQ = 100; // máximo 100 requisições por IP
const ipMap = new Map();

export function middleware(request: NextRequest) {
  // aplicar somente para rotas de API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const now = Date.now();
    let record = ipMap.get(ip);
    if (!record) {
      record = { count: 1, startTime: now };
    } else {
      if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
        record = { count: 1, startTime: now };
      } else {
        record.count++;
      }
    }
    ipMap.set(ip, record);

    if (record.count > RATE_LIMIT_MAX_REQ) {
      return NextResponse.json({ message: "Muitas requisições, aguarde para usar novamente" }, { status: 429 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
