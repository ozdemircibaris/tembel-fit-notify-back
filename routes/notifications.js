let express = require('express');
let router = express.Router();
const { notificationsModel, sequelize, tokensModel } = require('../database/db');
let cron = require('node-cron');
let FCM = require('fcm-node');
let moment = require('moment');
moment.locale('tr')
let x = null;
let dotenv = require('dotenv');
dotenv.config();

let serverKey = process.env.FIREBASE_SERVER_KEY || 'YOURSERVERKEYHERE'; //put your server key here
let fcm = new FCM(serverKey);


router.get('/tokens', (req, res) => {
    tokensModel.findAll().then((result) => {
    let data = result.map((item) => {
        return item.dataValues.token
    })
    res.json({ data: result })
    })
})

router.post('/tokens', (req, res) => {
    const { token } = req.body;
    tokensModel.findOne({
    where: {
        token: token
    }
    }).then((result) => {
    if(result == null) {
        tokensModel.create(req.body).then((result) => {
        res.json({ status: "success", data: result });
        })
    } else {
        res.status(422).send({ error: 'the token already exists.'})
    }
    }).catch((err) => {
    console.log('err.response', err.response)
    })
})

router.get('/', (req, res) => {
    notificationsModel.findAll().then((notifications) => {
    res.json({ data: notifications })
    let notificationData = notifications.map((item) => item.toJSON())
    tokensModel.findAll().then((result) => {
        let data = result.map((item) => {
        return item.dataValues.token
        })
        notificationData.map((notification) => {
            let message = { //this may var according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: data,
                notification: {
                    title: notification.title,
                    body: notification.description,
                    sound: true,
                },
                data: {  //you can send only notification or only data(or include both)
                    screenProps: 'my value',
                    my_another_key: 'my another value'
                }
            };

            let notificationSecond  = moment(notification.date).second();
            let notificationMinutes = moment(notification.date).minutes();
            let notificationHour    = moment(notification.date).hour();
            let notificationDay     = moment(notification.date).date();
            let notificationMonth   = moment(notification.date).month();
            cron.schedule(`${notificationSecond} ${notificationMinutes} ${notificationHour} ${notificationDay} * *`, () => {
                if(x != "delivered") {
                console.log("run!")
                fcm.send(message, (err, response) => {
                    if (err) {
                    console.log("Something has gone wrong!", err);
                    } else {
                    console.log("Successfully sent with response: ", response);
                    }
                });
                x = "delivered";
                setTimeout(() => {
                    x = null;
                }, 500);
                }
            }, {
                timezone: 'Europe/Istanbul'
            });
            })
        })
    })
})

router.post('/timed', (req, res, next) => {
    const { title, description, date, pageName } = req.body;
    if(title && description && date) {
    notificationsModel.create(req.body).then((data) => {
        if(data) res.json({ status: "success", data: data });
    })
    } else {
        return res.status(500).send({ status: "error", message: "Eksik parametre" })
    }
})

router.post('/now', (req, res, next) => {
    const { title, description, pageName } = req.body;
    tokensModel.findAll().then((result) => {
        let data = result.map((item) => {
            return item.dataValues.token
        })
        let message = { //this may var according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids: data,
                notification: {
                    title: title,
                    body: description,
                    sound: true,
                },
                data: { //you can send only notification or only data(or include both)
                    screenProps: 'my value',
                    my_another_key: 'my another value'
                }
        };
        if(x != "delivered") {
            console.log("run!")
            fcm.send(message, (err, response) => {
                if (err) {
                console.log("Something has gone wrong!", err);
                } else {
                console.log("Successfully sent with response: ", response);
                }
            });
            x = "delivered";
            setTimeout(() => {
                x = null;
            }, 500);
        }
    })
})

module.exports = router;