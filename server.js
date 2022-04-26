const jsonServer = require('json-server');
const fs = require('fs');
const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

const server = jsonServer.create();
const router = jsonServer.router('db.json');
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.post('/trials/:trialId/animals-delete', (req, res) => {
    const animals = router.db.get("animals").valueOf();
    for (const id of req.body.ids) {
        const animal = animals.find(a => a.id === id);
        animal.trialId = null;
        animal.hasTrial = false;
    }
    res.end('200');
});

server.use(router);
server.use(jsonServer.rewriter('routes.json'));
server.listen(process.env.PORT || 3000);