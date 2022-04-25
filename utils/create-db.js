
const fs = require('fs');
const faker = require('faker');

const trials = [];
const farms = [{ id: 1, id: 2, id: 3 }];
const animals = [];
for (var id = 0; id < 50; id++) {
    const created = faker.date.recent(20);
    const start = faker.datatype.boolean() ? faker.date.recent(10) : null;
    const end = start && faker.datatype.boolean() ? faker.date.recent(5) : null;
    const trial = {
        "id": id + 1,
        "name": faker.company.companyName(),
        "description": faker.lorem.paragraph(),
        "start": start,
        "end": end,
        "created": created,
        "animalType": faker.datatype.number({ 'min': 1, 'max': 4 }),
        "status": null,
        "changed": "2022-05-12T14:04:39.041567+02:00",
        "farmId": faker.datatype.number({ 'min': 1, 'max': 3 })
    };
    trial.status = start ? 1 : null;
    trial.status = end ? 2 : trial.status;
    trials.push(trial);
}

for (var id = 0; id < 200; id++) {
    const type = faker.datatype.number({ 'min': 1, 'max': 4 });
    const farm = faker.datatype.number({ 'min': 1, 'max': 3 });
    const animal = {
        "id": `${faker.datatype.number({ 'min': 1000, 'max': 9999 })}-${faker.datatype.number({ 'min': 100, 'max': 999 })}-${id + 1}`,
        "type": type,
        "daysInMilk": faker.datatype.number({ 'min': 1, 'max': 100 }),
        'gender': faker.datatype.boolean() ? '1' : '2',
        "hasTrial": false
    };
    const farmIndex = faker.datatype.number({ 'min': 1, 'max': 48 });
    for (var index = farmIndex; index < 50; index++) {
        if (trials[index].animalType === animal.type) {
            animal.trialId = trials[index].id;
            animal.hasTrial = true;
            break;
        }
    }
    animals.push(animal);
}

const users = [];
for (var id = 1; id < 21; id++) {
    users.push({ id, name: faker.name.findName() })
}
for (const user of users) {
    if (faker.datatype.boolean()) {
        user.trialId = faker.datatype.number({ 'min': 1, 'max': 50 })
    }
}

const final = { "trials": trials, "farms": farms, "animals": animals, "users": users };

let data = JSON.stringify(final, null, 2);

fs.writeFile('db.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
