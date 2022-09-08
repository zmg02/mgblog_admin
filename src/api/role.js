import request from '@/utils/request'

/**
 * 角色列表
 */
export const reqGetRole = () => request({ url: '/admin/v1/roles', method: 'get' });
// 创建角色
export const reqPostRole = (data) => request({ url: '/admin/v1/roles', data, method: 'post' });
// 修改角色
export const reqPutRole = (id,data) => request({ url: `/admin/v1/roles/${id}`, data, method: 'put' });
// 删除角色
export const reqDelRole = (id) => request({ url: `/admin/v1/roles/${id}`, method: 'delete' });

/**
 * 角色权限
 */
export const reqGetRolePermission = (roleId) => request({ url: `/admin/v1/roles/${roleId}/permissions`, method: 'get' });
// 添加角色权限
export const reqPostRolePermission = (roleId, data) => request({ url: `/admin/v1/roles/${roleId}/permissions`, data, method: 'post' });

/**
 * 角色管理员
 */
export const reqGetRoleAdmin = (roleId) => request({ url: `/admin/v1/roles/${roleId}/users`, method: 'get' });
// 角色还未添加的管理员
export const reqGetAdmin = (roleId, params) => request({ url: `/admin/v1/roles/${roleId}/admin`, params, method: 'get' });
// 添加角色管理员
export const reqPostRoleAdmin = (roleId, data) => request({ url: `/admin/v1/roles/${roleId}/users`, data, method: 'post' });
// 删除角色管理员
export const reqDelRoleAdmin = (roleId, userId) => request({ url: `/admin/v1/roles/${roleId}/users/${userId}`, method: 'delete' });