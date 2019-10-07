#!/usr/bin/env node

const SCRIPT = 'xqt';
const VERSION = '0.1.1';
const PACKAGE_MANAGER = 'yarn';

const fs = require('fs')
const path = './package.json'

if (!fs.existsSync(path)) {
  console.log(`${SCRIPT}: No 'package.json' found`);
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(path, 'utf8'));

const { scripts } = json

if (scripts === undefined || (Object.keys(scripts).length === 0 && scripts.constructor === Object)) {
  console.log(`${SCRIPT}: No scripts found in 'package.json'`);
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
  const cmd = `${PACKAGE_MANAGER} run ${answer}`;

  shell.exec(cmd)
}).catch((error) => {
  console.log(error)
})
