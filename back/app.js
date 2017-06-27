const host = 'http://app.zenika.com';
const statusUrl = '/restAPI/status';
const externalUrl = '/restAPI/userAPI/external/'
const config = require('./config')
const express = require('express');

const request = require('request');
const sha1 = require('sha1');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

request(host + statusUrl, (err, res, body) => {
  const key = sha1(JSON.parse(body).token + config.salt)
  request(host + externalUrl + key + '/skills', (err, res, body) => {
    const parsedBody = JSON.parse(JSON.parse(body))
    const birthdays = [];

    Object.keys(parsedBody).reduce((prev, curr) => {
      const person = parsedBody[curr];
      if (person.birthdate) {
      const first_name = capitalizeFirstLetter(curr.split('.')[0])
      const last_name = capitalizeFirstLetter(curr.split('.')[1].split('@')[0])

      birthdays.push({
        name: first_name + ' ' + last_name,
        date: person.birthdate,
        agency: person.agency
      })
      }
    })
  
    const app = express();

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With')
      next()
    })


    app.get('/', (req, res) => {
      return res.json(birthdays)
    })

    app.get('/:agency', (req, res) => {
      return res.json(birthdays.filter(birthday => birthday.agency === req.params.agency))
    })

    app.listen(5000, () => {
      console.log('Birthday server listening on port 5000');
    });
  })
})