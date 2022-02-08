#!/usr/bin/env node

import { get } from 'https'
import { spawn } from 'child_process'
import { createInterface } from 'readline'

const help = `
  \rget-all-repos: clones all repos from a github user

  \rusage:
  \r       \x1b[1m\x1b[38;5;32mget-all-repos\x1b[0m [expression]

  \roptions:
  \r       --help, -h: prints this message
`

const username = process.argv.slice(2).join('')

if (username.includes('--help') || username.includes('-h') || !username.length) {
  if (!username.length) {
    console.log('\n\x1b[1m\x1b[38;5;88merror:\x1b[0m no username specified')
    console.log(help)
    process.exit(1)
  }
  console.log(help)
  process.exit(0)
}

const getInput = (msg = 'clone?') => {
  const responses = 'Yesyes'

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${msg} (y/n) `
  })

  return new Promise((resolve, reject) => {
    rl.prompt()
    rl.on('line', line => {
      if (responses.includes(line)) resolve(true)
      else {
        console.log('cancelled')
        reject(process.exit(1))
      }
    })
  })
}

const init = async () => {
  console.log(`fetching repos for user ${username}`)

  get({
    host: 'api.github.com',
    path: `/users/${username}/repos`,
    headers: {
      'User-agent': 'this-can-be-anything'
    }
  }, res => {
    let acc = ''

    res.on('data', chunk => { acc += chunk })

    res.on('end', async () => {
      try {
        const result = JSON.parse(acc, 0, 2)
        const len = result.length
        let remaining = len

        if (!len) {
          console.log('user not found')
          process.exit(1)
        } else if (len === 0) {
          console.log('user has no public repos')
          process.exit(1)
        }

        await getInput(`clone ${len} repos?`)

        for (let i = 0; i < len; i += 1) {
          const { html_url, name } = result[i]

          try {
            const clone = spawn('git', ['clone', html_url, `./${username}/${name}`])

            clone.on('exit', code => {
              if (code === 0) {
                remaining -= 1
                console.log(`cloned '${name}' ( ${remaining} left )`)

                if (remaining < 1) {
                  console.log('complete')
                  process.exit(0)
                }
              } else console.log(`${i} of ${result.length} exited with: ${code}`)
            })
          } catch (e) { console.log(`error cloning ${html_url}:\n`, e.message) }
        }
      } catch (e) { console.log('error on API request:\n', e.message) }
    })
  })
}

init()
