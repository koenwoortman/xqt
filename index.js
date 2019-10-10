#!/usr/bin/env node

const SCRIPT = 'xqt';
const VERSION = require('./package.json').version;
const PACKAGE_MANAGER = 'yarn';

const fs = require('fs');
const path = './package.json';

const option = process.argv[2];

if (option === '--version' || option === '-v') {
  console.log(`${SCRIPT}: ${VERSION}`);
  process.exit(0);
}

if (option === '--help' || option === '-h') {
  console.log(`
  Version: ${VERSION}

  Usage: ${SCRIPT} [options]
  Options:
    -v, --version  output the version number
    -h, --help     output this help info
  `);

  process.exit(0);
}

if (!fs.existsSync(path)) {
  console.log(`${SCRIPT}: No 'package.json' found`);
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(path, 'utf8'));

const { scripts } = json;

if (
  scripts === undefined ||
  (Object.keys(scripts).length === 0 && scripts.constructor === Object)
) {
  console.log(`${SCRIPT}: No scripts found in 'package.json'`);
  process.exit(1);
}

const choices = [];

for (var key in scripts) {
  choices.push(`${key}`);
}

const { Select } = require('enquirer');

const prompt = new Select({
  name: 'script',
  message: 'Pick a script',
  choices: choices
});

prompt
  .run()
  .then(answer => {
    const shell = require('shelljs');
    const cmd = `${PACKAGE_MANAGER} run ${answer}`;

    shell.exec(cmd);
  })
  .catch(error => {
    console.log(error);
  });
