/*
方法1：比对路有权限
方法2：判断是否有子路由，有子路由设置第一个为默认路由
方法3：路由映射
*/

export function recursionRoutes($allRouter = [], $userRouter = [])
{
    var realRouters = [];
    $allRouter.forEach((v, i) => {
        $userRouter.forEach((item, key) => {
            if (item.uri === v.meta.uri) {
                if (item.children && item.children.length > 0) {
                    v.children = recursionRoutes(v.children, item.children);
                }
                realRouters.push(v);
            }
        })
    })
    return realRouters;
}

export function setDefaultRoute(routes)
{
    routes.forEach((v, k) => {
        if (v.children && v.children.length > 0) {
            // v.redirect = { name: v.children[0].name }
            v.redirect = v.children[0].uri
            setDefaultRoute(v.children);
        }
    })
}

export function mapRoutes(serviceRoutes, map)
{
    var realRouters = [];
    serviceRoutes.forEach(item => {
        item.component = map[item.component];
        if (item.children && item.children.length > 0) {
            item.children = mapRoutes(item.children, map);
        }
        realRouters.push(item);
    })
    return realRouters;
}