/* @flow */
var request = require('request');
const express = require('express')
const fs = require('fs')

const port = process.env.PORT || 3000

const app = express()

app.use(express.static('public'))

app.get('/inbox', (req, res) => {
  fs.createReadStream('./support.json').pipe(res)
})

app.listen(port)

console.log('Server is running on ' + port)

