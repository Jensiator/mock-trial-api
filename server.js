const jsonServer = require('json-server');
const fs = require('fs');
const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));

const server = jsonServer.create();
const router = jsonServer.router('db.json');
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.get('/users/current', (req, res) => {
    res.jsonp({name:'Administrator',id:1,isAdmin:true});
});

server.get('/trials/:trialId/users', (req, res) => {
    const users = router.db.get("users").valueOf();
    const retUsers = [];
    for (const user of users) {
        if (user.trialIds?.includes(+req.params.trialId)) {
            retUsers.push(user);
        }
    }
    res.jsonp(retUsers);
});

server.post('/trials/:trialId/animals-delete', (req, res) => {
    const animals = router.db.get("animals").valueOf();
    for (const id of req.body.ids) {
        const animal = animals.find(a => a.id === id);
        animal.trialId = null;
        animal.hasTrial = false;
    }
    res.end('200');
});

server.post('/trials/:trialId/animals', (req, res) => {
    const animals = router.db.get("animals").valueOf();
    for (const id of req.body.ids) {
        const animal = animals.find(a => a.id === id);
        animal.trialId = req.params.trialId;
        animal.hasTrial = true;
    }
    res.end('200');
});

server.post('/trials', (req, res, next) => {
    const trials = router.db.get("trials").valueOf();
    const trial = {
        id: trials.length + 1,
        name: req.body.name,
        farmId: req.body.farmId,
        description: req.body.description,
        animalType: req.body.animalType,
        created: new Date(),
        changed: new Date()
    };
    trials.push(trial);
    const userId = req.headers.authorization;
    const users = router.db.get("users").valueOf();
    const user = users.find(a => a.id === +userId);
    user.trialId = trial.id;
    res.end('' + trial.id);
});

server.post('/trials/:trialId/users', (req, res, next) => {
    const users = router.db.get("users").valueOf();
    const user = users.find(a => a.id === +req.body.id);
    user.trialIds = user.trialIds?[...user.trialIds,+req.body.trialId]:[+req.body.trialId];
    res.end('200');
});



server.use(router);
server.use(jsonServer.rewriter('routes.json'));
server.listen(process.env.PORT || 3000);