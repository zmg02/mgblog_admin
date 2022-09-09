import request from '@/utils/request'

// 获取文章分类
export const reqGetArticleCategories = () => request({ url: '/admin/v1/article_categories', method: 'get' });
// 获取文章列表
export const reqGetArticleList = (params) => request({ url: '/admin/v1/articles', params, method: 'get' });
// 修改文章实例
export const reqPutArticle = (id, data) => request({ url: `/admin/v1/articles/${id}`, data, method: 'put' });
// 删除文章实例
export const reqDelArticle = (id) => request({ url: `/admin/v1/articles/${id}`, method: 'delete' });
// 获取作者
export const reqGetAuthors = () => request({ url: `/admin/v1/users/authors`, method: 'get' });
// 创建文章实例
export const reqPostArticle = (data) => request({ url: `/admin/v1/articles`, data, method: 'post' });

// 创建文章分类
export const reqPostArticleCategory = (data) => request({ url: '/admin/v1/article_categories', data, method: 'post' });
// 修改文章分类
export const reqPutArticleCategory = (id, data) => request({ url: `/admin/v1/article_categories/${id}`, data, method: 'put' });
// 删除文章分类
export const reqDelArticleCategory = (id) => request({ url: `/admin/v1/article_categories/${id}`, method: 'delete' });
