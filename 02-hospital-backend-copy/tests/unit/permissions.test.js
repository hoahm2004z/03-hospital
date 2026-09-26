const {
  roleHasPermission,
  getPermissionsForRole,
  ROLE_PERMISSIONS,
} = require('../../src/auth/permissions');

describe('permissions (RBAC)', () => {
  it('admin has stats:read', () => {
    expect(roleHasPermission('admin', 'stats:read')).toBe(true);
  });

  it('patient cannot read patients list permission', () => {
    expect(roleHasPermission('patient', 'patient:read')).toBe(false);
  });

  it('doctor can write appointments', () => {
    expect(roleHasPermission('doctor', 'appointment:write')).toBe(true);
  });

  it('unknown role has empty permissions', () => {
    expect(getPermissionsForRole('guest')).toEqual([]);
  });

  it('ROLE_PERMISSIONS defines three roles', () => {
    expect(Object.keys(ROLE_PERMISSIONS).sort()).toEqual([
      'admin',
      'doctor',
      'patient',
    ]);
  });
});
