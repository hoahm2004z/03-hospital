// permission = hành động trên tài nguyên (chuỗi ổn định)
const ROLE_PERMISSIONS = {
    admin: [
      'patient:read',
      'patient:write',
      'doctor:read',
      'doctor:write',
      'appointment:read',
      'appointment:write',
      'stats:read',
    ],
    doctor: [
      'patient:read',
      'doctor:read',
      'appointment:read',
      'appointment:write',
    ],
    patient: [
      'doctor:read',
      'appointment:read',
      'appointment:write',
    ],
  };
  
  function getPermissionsForRole(role) {
    return ROLE_PERMISSIONS[role] || [];
  }
  
  function roleHasPermission(role, permission) {
    return getPermissionsForRole(role).includes(permission);
  }
  
  module.exports = {
    ROLE_PERMISSIONS,
    getPermissionsForRole,
    roleHasPermission,
  };