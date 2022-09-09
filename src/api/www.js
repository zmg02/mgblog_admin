import request from '@/utils/request'

/**
 * banner
 */
export const reqGetBanners = (params) => request({ url: '/admin/v1/banners', params, method: 'get' });
// 选择文章关联
export const reqGetArticles = () => request({ url: '/admin/v1/articles/banner', method: 'get' });
// 新建轮播图
export const reqPostBanners = (data) => request({ url: '/admin/v1/banners', data, method: 'post' });
// 修改轮播图
export const reqPutBanners = (id, data) => request({ url: `/admin/v1/banners/${id}`, data, method: 'put' });
// 删除轮播图
export const reqDelBanners = (id) => request({ url: `/admin/v1/banners/${id}`, method: 'delete' });
