import request from '@/utils/request'
// 获取所有设置
export const reqGetSetting = () => request({ url: '/admin/v1/settings', method: 'get' });
// 新增属性
export const reqPostSetting = (data) => request({ url: '/admin/v1/settings', data, method: 'post' });
// 保存所有设置
export const reqSaveSetting = (data) => request({ url: '/admin/v1/settings/form', data, method: 'post' });
// 获取摸个属性
export const reqGetSettingName = (params) => request({ url: '/admin/v1/settings/get_setting', params, method: 'get' });