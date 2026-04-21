const AUTH_TOKEN_KEY = 'b_nin_auth_token';

export const APP_ROUTES = {
  login: '/login',
  dashboard: '/',
  expenses: '/expenses',
  receives: '/receives',
} as const;

export type AppRoute = keyof typeof APP_ROUTES;
export type ProtectedRoute = Exclude<AppRoute, 'login'>;

const ROUTE_TO_TAB: Record<ProtectedRoute, string> = {
  dashboard: 'dashboard',
  expenses: 'expenses',
  receives: 'receives',
};

const PATH_TO_ROUTE: Record<string, ProtectedRoute> = {
  [APP_ROUTES.dashboard]: 'dashboard',
  [APP_ROUTES.expenses]: 'expenses',
  [APP_ROUTES.receives]: 'receives',
};

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const isAuthenticated = () => getStoredToken() === import.meta.env.VITE_TOKEN;

export const storeToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const validateCredentials = (username: string, password: string) => {
  return (
    username === import.meta.env.VITE_USERNAME &&
    password === import.meta.env.VITE_PASSWORD
  );
};

export const getProtectedRouteFromPath = (pathname: string): ProtectedRoute => {
  return PATH_TO_ROUTE[pathname] ?? 'dashboard';
};

export const getTabFromPath = (pathname: string) => {
  return ROUTE_TO_TAB[getProtectedRouteFromPath(pathname)];
};

export const getPathFromTab = (tab: string) => {
  if (tab === 'expenses') {
    return APP_ROUTES.expenses;
  }

  if (tab === 'receives') {
    return APP_ROUTES.receives;
  }

  return APP_ROUTES.dashboard;
};
