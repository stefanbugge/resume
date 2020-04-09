#!/usr/bin/env node
const fs = require('fs')
const path = require("path")
const argv = require('yargs').argv
const { exec } = require('child_process')

// ./export.js --format html
switch (argv.format) {
  case 'html': {
    // run yarn export-html instead
    break
  }
  case 'markdown': {
    exportMarkdown()
    break
  }
}

function exportMarkdown () {
  // resume-cli does not support .md extension for can generate the format for some reason ...
  const tempFilename = 'temp_md.html'
  const destination = './readme.md'
  generate(tempFilename, 'markdown', 'markdown', function () {
    const header = fs.readFileSync(path.join(__dirname, '/markdown-header.md'), 'utf-8')
    const resume = fs.readFileSync(path.join(__dirname, tempFilename), 'utf8')
    const output = header + '\n' + resume
    fs.writeFileSync(destination, output, 'utf-8')
    fs.unlinkSync(tempFilename)
  })
}

function generate (destination, theme, format, callback) {
  exec(`resume export ${destination} --theme ${theme} --format ${format}`, (err, stdout, stderr) => {
    if (err) {
      return console.error(err)
    }
    console.log(stdout)
    if (typeof callback === 'function') {
      callback()
    } 
  })
}