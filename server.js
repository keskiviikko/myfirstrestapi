const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());
const parser = bodyParser.urlencoded({ extended: true });

// express router object
const router = express.Router();

router.route('/users').get(function (req, res) {
    res.json(users);
})
    .post(function (req, res) {
        console.log("post");
        let user = {
            "id": users.length + Math.floor((Math.random() * 10000) + 1),
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email,
            "gender": req.body.gender
        };
        users.push(user);
        let data = JSON.stringify(users);
        fs.writeFileSync('users.json', data);
        res.json({ msg: "kuitti" })
        console.dir(req.body);
        return;

    });

router.route('/users/:id')
    .get(function (req, res) {
        for (var user of users) {
            if (user.id == req.params.id) {
                res.json(user);
                return;
            }
        }
        res.json("{'msg:' 'Error, no such user!'}");
    })

    .delete(function (req, res) {
        for (var user in users) {
            if (users[user].id == req.params.id) {
                users.splice(user, 1);
                let data = JSON.stringify(users);
                fs.writeFileSync('users.json', data);
                res.json("{'msg:' 'User removed'}");
                return;
            }
        }
        res.json("{'msg:' 'Error, no such user!'}");
    });

router.use(function (req, res, next) {
    console.log('request');
    next();
});

var users = [];

app.use(express.static('public'));

// attach routers for their respective paths
app.use('/api', router);

var server = app.listen(port, function () {
    var rawdata = fs.readFileSync('users.json');
    users = JSON.parse(rawdata);
    var host = server.address().address;
    console.log("Listening at http://%s:%s", host, port);
});