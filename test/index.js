#!/usr/bin/env node

import { fork } from 'child_process'
import tap from 'tap'

const index = new URL('../index.js', import.meta.url).pathname
const options = {
  stdio: ['ignore', 'ignore', 'ignore', 'ipc']
}

tap.test('run with no input', childTest => {
  const child = fork(index, options)

  child.on('exit', code => {
    childTest.match(code, 1, 'empty username exits with code 1')
    childTest.end()
  })
})

tap.test('search for nonexistent user', childTest => {
  const child = fork(index, ['jasksjdajfkj'], options)

  child.on('exit', code => {
    childTest.match(code, 1, 'nonexistent user exits with code 1')
    childTest.end()
  })
})
