import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return url.match(/https:\/\/([^.]+)\./)?.[1] ?? '';
}

function injectTokenFromHeader(request: NextRequest): void {
  const token = request.headers.get('x-sb-token');
  if (!token) return;
  const hasCookie = request.cookies.getAll().some((c) => c.name.includes('auth-token'));
  if (hasCookie) return;
  request.cookies.set(`sb-${getProjectRef()}-auth-token`, token);
}

// Routes only accessible by job seekers (role: job_seeker or no role)
const JOB_SEEKER_ROUTES = [
  '/',
  '/c-vth-que-master',
  '/portfolio-studio',
  '/templates',
  '/portfolio-audit',
  '/campaigns-tracking',
  '/analytics',
  '/ai-analysis',
  '/crm',
  '/setup-wizard',
  '/coach-dashboard',
  '/export-tools',
  '/integrations',
];

// Routes only accessible by recruiters
const RECRUITER_ROUTES = [
  '/recruiter-dashboard',
  '/recruiter-space',
];

export async function middleware(request: NextRequest) {
  injectTokenFromHeader(request);
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isPublicPage =
    pathname.startsWith('/public-portfolio-view') ||
    pathname.startsWith('/auth/') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/landing';

  // Not logged in → redirect to login
  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    const role = user.user_metadata?.role as string | undefined;

    // Logged in user on auth page → redirect to their home
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = role === 'recruiter' ? '/recruiter-dashboard' : '/';
      return NextResponse.redirect(url);
    }

    // Recruiter trying to access job seeker routes → redirect to recruiter dashboard
    if (role === 'recruiter') {
      const isJobSeekerRoute = JOB_SEEKER_ROUTES.some(
        (route) => pathname === route || (route !== '/' && pathname.startsWith(route))
      );
      if (isJobSeekerRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/recruiter-dashboard';
        return NextResponse.redirect(url);
      }
    }

    // Job seeker trying to access recruiter routes → redirect to job seeker home
    if (role === 'job_seeker' || !role) {
      const isRecruiterRoute = RECRUITER_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route)
      );
      if (isRecruiterRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
