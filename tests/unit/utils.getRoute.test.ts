import { getRouteDetails, getRoutePath } from '@src/utils/getRoutePath';
import { describe, it, expect } from 'vitest';

describe('getRoutePath', () => {
  it('should return the correct path for a valid key', () => {
    expect(getRoutePath('AUTH.LOGIN')).toBe('/login');
    expect(getRoutePath('LOGIN')).toBe('/login');
    expect(getRoutePath('AUTH.LOGIN.CALLBACK.GOOGLE')).toBe('/login/auth/google/callback');
    expect(getRoutePath('LOGIN.CALLBACK.GOOGLE')).toBe('/login/auth/google/callback');
    expect(getRoutePath('APP.PROFILE')).toBe('/home/profile');
  });

  it('should prepend / if the path doesn’t start with it', () => {
    const customRoutes = [{ name: 'TEST', path: 'noSlash' }];
    expect(getRoutePath('TEST', customRoutes)).toBe('/noSlash');
  });

  it('should return /route_not_found for an invalid key', () => {
    expect(getRoutePath('INVALID.KEY')).toBe('/route_not_found');
  });
});

describe('getRouteDetails', () => {
  it('should return correct node for given name', () => {
    const node = getRouteDetails({ name: 'APP.PROFILE' });
    expect(node?.path).toBe('/profile');
    expect(node?.name).toBe('PROFILE');
  });

  it('should return correct node for given path', () => {
    const node = getRouteDetails({ path: '/inbox' });
    expect(node?.name).toBe('INBOX');
  });

  it('should return undefined for invalid name or path', () => {
    expect(getRouteDetails({ name: 'INVALID.KEY' })).toBeNull();
    expect(getRouteDetails({ path: '/notfound' })).toBeNull();
  });
});
