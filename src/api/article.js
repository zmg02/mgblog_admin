import request from '@/utils/request'

// 获取文章分类
export const reqGetArticleCategories = () => request({ url: '/admin/v1/article_categories', method: 'get' });
// 获取文章列表
export const reqGetArticleList = (params) => request({ url: '/admin/v1/articles', params, method: 'get' });
// 修改文章实例
export const reqPutArticle = (id, data) => request({ url: `/admin/v1/articles/${id}`, data, method: 'put' });