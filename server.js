const jsonServer = require('json-server');
const server = jsonServer.create();

const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(router);
server.use(jsonServer.rewriter('routes.json'));
server.listen(process.env.PORT || 3000);