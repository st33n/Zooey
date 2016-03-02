/* @flow */
var request = require('request');
const express = require('express')
const fs = require('fs')

const port = process.env.PORT || 3000

const app = express()

app.use(express.static('public'))
app.use('/data', express.static('data'))

app.listen(port)

console.log('Server is running on ' + port)

