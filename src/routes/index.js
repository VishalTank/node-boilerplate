const router = require('express').Router();

const userRoute = require('./user.route');
const config = require('../config/config');

const routes = [
    {
        path: '/users',
        route: userRoute,
    },
];

const devRoutes = [];

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
