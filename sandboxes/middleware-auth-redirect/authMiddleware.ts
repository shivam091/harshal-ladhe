export interface MockRequest {
  pathname: string;
  isAuthenticated: boolean;
}

export type MiddlewareDecision = { type: "next" } | { type: "redirect"; to: string };

const PROTECTED_PREFIXES = ["/dashboard", "/settings", "/billing"];

// Mirrors the decision logic of a real middleware.ts — same rules, same shape, returning a plain
// decision object here instead of calling NextResponse.next()/redirect() against a real request.
export function authMiddleware(request: MockRequest): MiddlewareDecision {
  const isProtected = PROTECTED_PREFIXES.some((prefix) => request.pathname.startsWith(prefix));

  if (isProtected && !request.isAuthenticated) {
    return { type: "redirect", to: `/login?from=${encodeURIComponent(request.pathname)}` };
  }

  return { type: "next" };
}
