#!/usr/bin/env node
const argv = require('yargs').argv
const ncp = require('ncp').ncp
const { exec } = require('child_process')

// ./export.js --format html
switch (argv.format) {
  case 'html': {
    exportHtml()
    break
  }
  case 'markdown': {
    exportMarkdown()
    break
  }
}

function exportHtml () {
  const tempThemeName = 'foobar'
  const destination = './docs/index.html'
  ncp('./theme', `./node_modules/jsonresume-theme-${tempThemeName}`, function (err) {
    if (err) {
      return console.error(err)
    }
    generate(destination, tempThemeName, 'html')
   })
}

function exportMarkdown () {
  // resume-cli does not support .md extension ...
  const tempDestination = 'temp_md.html'
  const destination = './resume.md'
  generate(tempDestination, 'markdown', 'markdown', function () {
    exec(`mv ${tempDestination} ${destination}`)
  })
}

const noop = () => {}

function generate (destination, theme, format, callback = noop) {
  exec(`./node_modules/resume-cli/index.js export ${destination} --theme ${theme} --format ${format}`, (err, stdout, stderr) => {
    if (err) {
      return console.error(err)
    }
    console.log(stdout)
    callback()
  })
}