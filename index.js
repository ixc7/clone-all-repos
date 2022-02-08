#!/usr/bin/env node

import { get } from 'https'
import { spawn } from 'child_process'

const help = `
  \rindex.js: clones all repos from a github user
  \rusage: index.js <username>
`

const username = process.argv.slice(2).join('')

process.on('exit', code => {
  console.log(`process exited with: ${code}`)
})

if (!username.length) {
  console.log(help)
  process.exit(1)
}

const init = async () => {
  console.log(`fetching repos for user ${username}`)
  const req = get({
    host: 'api.github.com',
    path: `/users/${username}/repos`,
    headers: {
      'User-agent': 'this-can-be-anything'
    }
  }, res => {
    let acc = ''
    res.on('data', chunk => { acc += chunk })
    res.on('end', () => {
      try {
        const result = JSON.parse(acc, 0, 2)
        for (let i = 0; i < result.length; i += 1) {
          const  { html_url, name } = result[i]
          try {
            console.log(`cloning ${html_url} ( ${i} of ${result.length} )`)
            const clone = spawn('git', ['clone', html_url, `./${username}/${name}`])
            clone.on('exit', code => { 
              if (code === 0) console.log(`${i} of ${result.length} complete`) 
              else console.log(`${i} of ${result.length} exited with: ${code}`)
            })
          } catch (e) {
            console.log(`error on ${html_url}:\n`, e.message)
          }
        }
      } catch (e) {
        console.log('error on API call:\n', e.message)
      }
    })
  })
}

init()
