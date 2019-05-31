#!/usr/bin/env node
require('dotenv').config()
const {MergeDb} = require('../lib/db')
const {getCommunes} = require('../lib/cli/util')
const {runInParallel} = require('../lib/cli/parallel')

async function main() {
  const mergeDb = new MergeDb('default')
  await mergeDb.clear()

  const communes = getCommunes()

  if (!process.env.SOURCES) {
    throw new Error('La liste des sources à prendre en compte doit être définie (SOURCES)')
  }

  const sources = process.env.SOURCES.split(',')
  const licences = process.env.LICENCES ? process.env.LICENCES.split(',') : undefined

  await runInParallel(
    require.resolve('../lib/merge'),
    communes.map(codeCommune => ({codeCommune, sources, licences})),
    {maxConcurrentCallsPerWorker: 4}
  )
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
