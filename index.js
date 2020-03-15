#!/usr/bin/env node // para ejecutar como un sh
'use strict'
const minimist = require('minimist')
const { createDb } = require('./lib/db')
const argv = minimist(process.argv.slice(2))

async function main () {
  const db = await createDb()
  const command = argv._.shift()

  switch (command) {
    case 'users:create':
      try {
        const { user, pass } = argv
        await db.createUser(user, pass)
      } catch (error) {
        console.log(error)
        throw new Error('Cannot create user')
      }
      break
    case 'users:list':
      try {
        const results = await db.listUsers()
        results.users.forEach(user => {
          console.log(`${user.user}`)
        })
        console.log(`\tTotal ${results.count}`)
      } catch (error) {
        throw new Error('Cannot list users')
      }
      break
    case 'secrets:create':
      try {
        const { user, name, value } = argv
        await db.createSecret(user, name, value)
        console.log(`secret: ${name} created`)
      } catch (error) {
        throw new Error('Cannot create secret')
      }
      break
    case 'secrets:list':
      try {
        const { user } = argv
        const secrets = await db.listSecrets(user)
        secrets.forEach(s => {
          console.log(`- ${s.name}`)
        })
      } catch (error) {
        throw new Error('Cannot list secrets')
      }
      break
    case 'secrets:get':
      try {
        const { user, name } = argv
        const secret = await db.getSecret(user, name)
        if (!secret) return new Error(`secret ${name} not found`)
        console.log(`${secret.name} = ${secret.value}`)
      } catch (error) {
        throw new Error('Cannot get secret')
      }
      break
    case 'secret:update':
      try {
        const { user, name, value } = argv
        await db.updateSecret(user, name, value)
        console.log(`secret ${name} update`)
      } catch (error) {
        throw new Error('Cannot update secret')
      }
      break
    case 'secret:delete':
      try {
        const { user, name } = argv
        await db.deleteSecret(user, name)
        console.log(`secret ${name} delete`)
      } catch (error) {
        throw new Error('Cannot delete secret')
      }
      break
    default:
      console.error(`command not found : ${command}`)
  }
}

main().catch(error => console.log(error))
