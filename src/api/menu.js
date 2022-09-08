import request from '@/utils/request'

// 菜单列表
export const reqGetMenu = (params) => request({ url: '/admin/v1/menus', params, method: 'get' });
// 创建菜单
export const reqPostMenu = (data) => request({ url: '/admin/v1/menus', data, method: 'post' });
// 修改菜单
export const reqPutMenu = (id, data) => request({ url: `/admin/v1/menus/${id}`, data, method: 'put' });
// 删除菜单
export const reqDelMenu = (id) => request({ url: `/admin/v1/menus/${id}`, method: 'delete' });