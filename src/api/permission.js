import request from '@/utils/request'

// 权限列表
export const reqGetPermission = () => request({ url: '/admin/v1/permissions', method: 'get' });
// 创建权限
export const reqPostPermission = (data) => request({ url: '/admin/v1/permissions', data, method: 'post' });
// 修改权限
export const reqPutPermission = (id, data) => request({ url: `/admin/v1/permissions/${id}`, data, method: 'put' });
// 删除权限
export const reqDelPermission = (id) => request({ url: `/admin/v1/permissions/${id}`, method: 'delete' });