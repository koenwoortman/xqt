#!/usr/bin/env node

const fs = require('fs')
const path = './package.json'

if (!fs.existsSync(path)) {
  console.log('Oops: there is no package.json in this directory');
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(path, 'utf8'));

const { scripts } = json

if (scripts === undefined || (Object.keys(scripts).length === 0 && scripts.constructor === Object)) {
  console.log('Oops: no scripts found in the package.json');
  process.exit(1);
}

const choices = []

for (var key in scripts) {
  choices.push(`${key}`)
}

const { Select } = require('enquirer');

const prompt = new Select({
  name: 'script',
  message: 'Pick a script',
  choices: choices
});


prompt.run().then(answer => {
  const shell = require('shelljs')
  const cmd = `yarn run ${answer}`;

  shell.exec(cmd)
}).catch((error) => {
  console.log(error)
})
