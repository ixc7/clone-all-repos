#!/usr/bin/env node

import { get } from 'https'
import { spawn } from 'child_process'
import { createInterface } from 'readline'

const help = `
  \rgit-all, clone-all: clones all public repositories from a GitHub user

  \rusage:
  \r       \x1b[1m\x1b[38;5;32mgit-all\x1b[0m|\x1b[1m\x1b[38;5;32mclone-all\x1b[0m [username]

  \roptions:
  \r       --help, -h: print this text and exit
  \r       --version, -v: print version and exit (0.0.2)
  
`

const username = process.argv.slice(2).join('')

if (username.includes('--help') || username.includes('-h') || !username.length) {
  let code = 0

  if (!username.length) {
    console.log('\n\x1b[1m\x1b[38;5;88mError:\x1b[0m no username specified')
    code = 1
  }

  console.log(help)
  process.exit(code)
}

if (username.includes('--version') || username.includes('-v')) {
  console.log('0.0.2')
  process.exit(0)
}

const getUserInput = (msg = 'Clone all repos?') => {
  // streamline: bool (default = false)
  const responses = 'Yesyes'

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${msg} (y/n) `
  })

  return new Promise((resolve, reject) => {
    // if (streamline) resolve(true)
    rl.prompt()

    rl.on('line', line => {
      if (responses.includes(line)) resolve(true)
      else {
        console.log('Cancelled')
        reject(process.exit(0))
      }
    })
  })
}

const init = async (user) => {
  console.log(`Fetching repos for user ${user}`)

  get({
    host: 'api.github.com',
    path: `/users/${user}/repos`,
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
          let msg = 'User not found'
          if (len === 0) msg = 'User has no public repos'
          console.log(msg)
          process.exit(1)
        }

        await getUserInput(`Clone \x1b[1m\x1b[38;5;49m${len}\x1b[0m repos?`)

        for (let i = 0; i < len; i += 1) {
          const { html_url, name } = result[i]

          try {
            const clone = spawn('git', ['clone', html_url, `./${user}/${name}`])

            clone.on('exit', code => {
              remaining -= 1

              if (code === 0) {
                console.log(`Cloned '${name}' (${remaining} left)`)
              } else if (code === 128) {
                console.log(`${user}/${name} already exists`)
              } else {
                console.log(`${i} of ${result.length} exited with nonzero code: ${code}`)
              }

              if (remaining < 1) {
                console.log('Complete')
                process.exit(0)
              }
            })
          } catch (e) { console.log(`Error running git clone on ${html_url}:\n`, e.message) }
        }
      } catch (e) { console.log('Error fetching data from API:\n', e.message) }
    })
  })
}

init(username)
