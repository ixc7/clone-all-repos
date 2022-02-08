#!/usr/bin/env node

import { fork } from 'child_process'
import tap from 'tap'

// const filepath = new URL('../index.js', import.meta.url).pathname

// import index from '../index.js'

// tap.pass('hello cruel world')

// test/basic.js
// const tap = require('tap')
// const mam = require('../my-awesome-module.js')

// Always call as (found, wanted) by convention
// tap.equal(mam(1), 'odd')
// tap.equal(mam(2), 'even')


// test/async.js
// this is a silly test.
// const tap = require('tap')
// const fs = require('fs')

tap.test('search for nonexistent user', childTest => {

  const forked = fork(new URL('../index.js', import.meta.url).pathname, ['jasksjdajfkj'])

  forked.on('exit', code => {
    console.log('got code:', code)
    childTest.end()
  })
  
  // fs.readdir(__dirname, (er, files) => {
    // if (er) {
      // throw er
    // }
    // childTest.match(files.join(','), /\basync\.js\b/)
    // childTest.end()
  // })
  
})

// tap.test('this waits until after', childTest => {
  // // no asserts?  no problem!
  // // the lack of throwing means "success"
  // childTest.end()
// })


// const tap = require('tap')
// tap.test('dogs should be ok', async t => {
  // const result = await doSomethingAsync()
  // t.match(result, { ok: true, message: /dogs/ }, 'dogs are ok')
  // // Or you can use any assertion lib you like.  as long as this
  // // code doesn't throw an error, it's a pass!
// })


// // sloppy mess, don't do this!
// const t = require('tap')
// const myThing = require('./my-thing.js')
// 
// t.equal(myThing.add(1, 2), 3, '1 added to 2 is 3')
// t.throws(() => myThing.add('dog', 'cat'), 'cannot add dogs and cats')
// t.equal(myThing.times(2, 2), 4, '2 times 2 is 4')
// t.equal(myThing.add(2, -1), 1, '2 added to -1 is 1')
// t.equal(myThing.times(-1, 3), 3, '-1 times 3 is -3')
// t.throws(() => myThing.times('best', 'worst'), 'can only times numbers')


// // much better, so clean and nice
// const t = require('tap')
// const myThing = require('./my-thing.js')
// 
// t.test('add() can add two numbers', t => {
  // t.equal(myThing.add(1, 2), 3, '1 added to 2 is 3')
  // t.equal(myThing.add(2, -1), 1, '2 added to -1 is 1')
  // t.throws(() => myThing.add('dog', 'cat'), 'cannot add dogs and cats')
  // t.end()
// })
// 
// t.test('times() can multiply two numbers', t => {
  // t.equal(myThing.times(2, 2), 4, '2 times 2 is 4')
  // t.equal(myThing.times(-1, 3), 3, '-1 times 3 is -3')
  // t.throws(() => myThing.times('best', 'worst'), 'can only times numbers')
  // t.end()
// })


// // using async functions, no t.end() necessary
// const t = require('tap')
// const myThing = require('./my-thing.js')
// 
// t.test('add() can add two numbers', async t => {
  // t.equal(myThing.add(1, 2), 3, '1 added to 2 is 3')
  // t.equal(myThing.add(2, -1), 1, '2 added to -1 is 1')
  // t.throws(() => myThing.add('dog', 'cat'), 'cannot add dogs and cats')
// })
// 
// t.test('times() can multiply two numbers', async t => {
  // t.equal(myThing.times(2, 2), 4, '2 times 2 is 4')
  // t.equal(myThing.times(-1, 3), 3, '-1 times 3 is -3')
  // t.throws(() => myThing.times('best', 'worst'), 'can only times numbers')
// })


// t.test('reads symbolic links properly', t => {
  // // setup the environment
  // // this will automatically get torn down at the end
  // const dir = t.testdir({
    // file: 'some file contents',
    // link: t.fixture('symlink', 'file'),
  // })
// 
  // // requires a module while mocking
  // // one of its internally required module
  // const myModule = t.mock('../my-module.js', {
    // fs: {
      // readFileSync: () => 'file'
    // }
  // })
// 
  // // test both synchronously and asynchronously.
  // // in this case we know there are 2 subtests coming,
  // // but we could also have called t.end() at the bottom
  // t.plan(2)
// 
  // t.test('sync', async t => {
    // t.equal(myModule.readSync(dir + '/link'), 'file')
    // t.equal(myModule.typeSync(dir + '/link'), 'SYMBOLIC LINK')
  // })
// 
  // t.test('async', async t => {
    // t.equal(await myModule.read(dir + '/link'), 'file')
    // t.equal(await myModule.type(dir + '/link'), 'SYMBOLIC LINK')
  // })
// })
