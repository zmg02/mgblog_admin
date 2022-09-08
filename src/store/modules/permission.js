import { fetchMenu, reqGetPermissions } from "@/api/user";
import router, { dynamicRoutes } from "@/router"
import map from '@/router/map-routes'
import { recursionRoutes, setDefaultRoute, mapRoutes } from "@/utils/recursion-route";

export default {
    namespaced: true,
    state: {
        permissionList: null,
        sidebarMenu: [], //侧边栏菜单
        currentMenu: '', //当前页菜单
    },
    mutations: {
        SET_PERMISSION(state, routes) {
            state.permissionList = routes;
        },
        CLEAR_PERMISSION(state) {
            state.permissionList = null;
        },
        SET_MENU(state, menu) {
            state.sidebarMenu = menu;
        },
        CLEAR_MENU(state) {
            state.sidebarMenu = []
        }
    },
    actions: {
        async fetchPermissions({ commit }) {
            // 获取登录用户权限
            let result = await reqGetPermissions();
            let userPermission = [];
            if (result.code == 200) {
                userPermission = result.data;
            }
            // 获取所有菜单
            let resultMenu = await fetchMenu({'status': 1});
            let serviceRoutes = [];
            if (resultMenu.code == 200) {
                serviceRoutes = resultMenu.data;
            }
            // 路由映射
            let allRoutes = mapRoutes(serviceRoutes, map);

            // 筛选
            let routes = recursionRoutes(allRoutes, userPermission);
            let mainContainer = dynamicRoutes.find(v => v.path === '/');
            dynamicRoutes.push(...routes);
            // 生成菜单
            commit('SET_MENU', dynamicRoutes);
            // 设置子路由的默认路由
            setDefaultRoute([mainContainer]);
            // 初始化路由,常规路由
            let initialRoutes = router.options.routes;
            // 添加动态路由
            router.addRoutes(dynamicRoutes);
            // 生成权限
            commit("SET_PERMISSION", [ ...initialRoutes, ...dynamicRoutes]);
        }
    },
    getters: {}
}