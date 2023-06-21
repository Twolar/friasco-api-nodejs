require('dotenv').config()
const { logger } = require('./src/utility/logger')
const express = require('express')
const app = express()

const port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('Friasco Hello World!')
})

app.listen(port, () => {
  console.log(`Friasco Application listening on ${port}`)
  logger.info(`Friasco Application listening on ${port}`)
})
