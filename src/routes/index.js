const router = require('express').Router();

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../config/config');

const routes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
];

const devRoutes = [
    {
        path: '/docs',
        route: docsRoute,
    },
];

routes.forEach((route) => {
    const { path, route: routeName } = route;
    router.use(path, routeName);
});

if (config.env === 'development') {
    devRoutes.forEach((route) => {
        const { path, route: routeName } = route;
        router.use(path, routeName);
    });
}

module.exports = router;
