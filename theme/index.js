let fs = require('fs');
let path = require('path');
let helperDate = require('helper-date');
let Handlebars = require('handlebars');

function normalizeNetworkName (network) {
  return (network || '').toLowerCase().replace(/\s/g, '-')
}

function render(resume) {
  let css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
  let tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
  let partialsDir = path.join(__dirname, 'partials');
  let filenames = fs.readdirSync(partialsDir);

  Handlebars.registerHelper('date', helperDate);
  Handlebars.registerHelper('normalizeNetworkName', normalizeNetworkName)

  filenames.forEach(function(filename) {
    let matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    let name = matches[1];
    let filepath = path.join(partialsDir, filename);
    let template = fs.readFileSync(filepath, 'utf8');
    Handlebars.registerPartial(name, template);
  });

  return Handlebars.compile(tpl)({
    css: css,
    resume: resume,
  });
}

module.exports = {
  render: render,
};
