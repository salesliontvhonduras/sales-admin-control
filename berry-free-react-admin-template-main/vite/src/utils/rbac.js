const RBAC_STRICT = String(import.meta.env.VITE_RBAC_STRICT || 'false').toLowerCase() === 'true';

function normalizeToArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((it) => it.trim());
  return [value];
}

function normalizePermissionValue(value) {
  return String(value || '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .toUpperCase();
}

function collectValues(candidate) {
  if (candidate === null || candidate === undefined) return [];
  if (typeof candidate === 'object' && !Array.isArray(candidate)) {
    const objectValues = [];
    Object.entries(candidate).forEach(([key, value]) => {
      objectValues.push(key, value);
    });
    return objectValues;
  }
  return [candidate];
}

export function getUserPermissions(user) {
  if (!user) return new Set();

  const rawValues = [
    ...normalizeToArray(user.permissions),
    ...normalizeToArray(user.authorities),
    ...normalizeToArray(user.scopes),
    ...normalizeToArray(user.roles),
    ...normalizeToArray(user.role)
  ];

  const permissions = new Set();
  rawValues.forEach((value) => {
    collectValues(value).forEach((entry) => {
      const normalized = normalizePermissionValue(entry);
      if (!normalized) return;
      permissions.add(normalized);
      if (!normalized.startsWith('ROLE_')) {
        permissions.add(`ROLE_${normalized}`);
      }
    });
  });

  return permissions;
}

function hasAdminBypass(permissions) {
  const knownAdmin =
    permissions.has('ADMIN') || permissions.has('ROLE_ADMIN') || permissions.has('SUPER_ADMIN') || permissions.has('ROLE_SUPER_ADMIN');
  if (knownAdmin) return true;
  return Array.from(permissions).some((permission) => /(^|_)ADMIN($|_)/.test(permission));
}

function checkAny(permissions, list) {
  if (!list || list.length === 0) return true;
  return list.some((permission) => permissions.has(normalizePermissionValue(permission)));
}

function checkAll(permissions, list) {
  if (!list || list.length === 0) return true;
  return list.every((permission) => permissions.has(normalizePermissionValue(permission)));
}

export function hasPermission(user, requirement) {
  if (!requirement) return true;
  const permissions = getUserPermissions(user);
  if (permissions.size === 0) return true;
  if (hasAdminBypass(permissions)) return true;

  let matched = false;
  if (typeof requirement === 'string') {
    matched = permissions.has(normalizePermissionValue(requirement));
    return matched || !RBAC_STRICT;
  }

  if (Array.isArray(requirement)) {
    matched = checkAny(permissions, requirement);
    return matched || !RBAC_STRICT;
  }

  if (typeof requirement === 'object') {
    const anyList = normalizeToArray(requirement.any);
    const allList = normalizeToArray(requirement.all);
    matched = checkAny(permissions, anyList) && checkAll(permissions, allList);
    return matched || !RBAC_STRICT;
  }

  return true;
}

export function hasPermissionExact(user, requirement) {
  if (!requirement) return true;
  const permissions = getUserPermissions(user);
  if (permissions.size === 0) return true;
  if (hasAdminBypass(permissions)) return true;

  if (typeof requirement === 'string') {
    return permissions.has(normalizePermissionValue(requirement));
  }

  if (Array.isArray(requirement)) {
    return checkAny(permissions, requirement);
  }

  if (typeof requirement === 'object') {
    const anyList = normalizeToArray(requirement.any);
    const allList = normalizeToArray(requirement.all);
    return checkAny(permissions, anyList) && checkAll(permissions, allList);
  }

  return true;
}

export function isResellerConsoleUser(user) {
  const permissions = getUserPermissions(user);
  return (
    permissions.has('ROLE_LIONTV_RESELLER_OWNER') ||
    permissions.has('ROLE_LIONTV_RESELLER_OPERATOR') ||
    permissions.has('LIONTV_RESELLER_PORTAL_VIEW') ||
    permissions.has('ROLE_LIONTV_RESELLER_PORTAL_VIEW')
  );
}

function filterMenuNode(item, user) {
  if (!item) return null;
  if (isResellerConsoleUser(user) && item.resellerVisible === false) return null;
  if (!hasPermissionExact(user, item.permission)) return null;

  if (!Array.isArray(item.children)) return item;

  const filteredChildren = item.children.map((child) => filterMenuNode(child, user)).filter(Boolean);

  if (filteredChildren.length === 0 && item.type !== 'item') return null;
  return {
    ...item,
    children: filteredChildren
  };
}

export function filterMenuByPermission(menuItems, user) {
  if (!Array.isArray(menuItems)) return [];
  return menuItems.map((item) => filterMenuNode(item, user)).filter(Boolean);
}
