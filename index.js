'use strict'
//** # DEFG Default Plugin
//**
//** A set of nice defaults for the [defg](https://github.com/theproductiveprogrammer/defg) document generator.
const fs = require('fs');
const path = require('path');

let title;
let subtitle;
let logo;
let version;
let author;
let repo;

function update(readme, cb) {
  let i = 0;
  let err;
  for(;i < 10;i++) {
    const l = readme[i];
    if(!l) continue;
    const m = l.match(/^[ \t]*<.*>[ \t\n]*$/);
    if(m) continue;
    if(!title) {
      const m = l.match(/^#[ \t](.*)/);
      if(m) title = m[1];
      else break;
    } else {
      const m = l.match(/!\[([^\[]+)\]\(([^\)]+)\)/);
      if(m) {
        if(!logo) logo = { src: m[2], alt: m[1] };
        break;
      } else {
        if(subtitle) break;
        if(!logo) subtitle = l;
      }
    }
  }
  if(!title) return cb(null, readme);

  try {
    const p = require(path.join(process.cwd(), 'package.json'));
    version = p.version;
    author = p.author;
    repo = p.homepage;
  } catch(e) { /* ignore */ }

  const header = [
    `<div class="defg__header">`,
      `<div class="defg__deco1"></div>`,
      `<div class="defg__deco2">`,
      `<div class="defg__title">${title}</div>`,
  ];
  if(subtitle) header.push(`<div class="defg__subtitle">${subtitle}</div>`);
  header.push('</div>');
  if(logo) header.push(`<div class="defg__logo"><img src="${logo.src}" alt="${logo.alt}"></img></div>`);
  if(version) header.push(`<div class="defg__version">v${version}</div>`);
  if(author) header.push(`<div class="defg__author">${author}</div>`);
  if(repo) header.push(`<div class="defg__repo">${repo}</div>`);
  header.push('</div>');
  header.push('<div class="page-break"></div>');

  const css = `
@import url('https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Zilla+Slab:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
* {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
body {
  font-family: 'Zilla Slab', 'Helvetica', 'Georgia', 'Times New Roman', 'serif';
}
.defg__deco1 {
  font-size: 0.8em;
  color: #666;
  text-align: right;
  width: 24px;
  margin-left: auto;
  border-bottom: 6px dotted black;
}
.defg__title {
  font-family:'Mulish', sans-serif;
  font-size: 32px;
}
.defg__deco2 {
  border-left: 6px solid black;
  padding-left: 24px;
  margin: 12px 0;
}
.defg__subtitle {
  font-size: 12px;
  weight: 300;
  color: #666;
}
.defg__logo img {
  display: block;
  width: 300px;
  margin: 200px auto;
}
.defg__version,
.defg__author,
.defg__repo {
  font-size: 14px;
  color: #666;
  weight: 300;
  text-align: center;
}
.defg__repo {
  color: #66a;
  font-size: 12px;
}
h1 {
  font-family: 'Arvo', serif;
  padding-top: 32px;
  padding-bottom: 24px;
  font-weight: 600px;
  font-size: 32px;
}
h2 {
  font-family: 'Montserrat', sans-serif;
  font-family: 'Arvo', serif;
  font-weight: 600px;
  font-size: 24px;
}
h3 {
  font-family: 'Montserrat', sans-serif;
  font-family: 'Arvo', serif;
  font-weight: 600px;
  font-size: 18px;
}
h4 {
  font-family: 'Montserrat', sans-serif;
  font-family: 'Arvo', serif;
  font-weight: 600px;
  font-size: 16px;
}
code,
p code,
pre code {
  font-size: 1em;
}
`;

  cb(null, header.concat(readme.slice(i+1)), css);

}

function pagedef() {
  return `
format: A4
margin: 20mm 20mm
printBackground: true
headerTemplate: |-
  <style>
    .header, .footer {
      width: calc(100% - 30mm);
      margin: 0 auto;
      text-align: left;
      font-family: 'Mulish', sans-serif;
      font-size: 6px;
      padding: 4px;
    }
    .header {
      border-bottom: 1px solid #333;
    }
    .footer {
      border-top: 1px solid #333;
      text-align: center;
    }
    .date {
      display: block;
      float: right;
    }
    .htitle {
      font-weight: bold;
    }
  </style>
  <div class="header">
     <span class="htitle">${title}</span>
     <span class="date"></span>
  </div>
footerTemplate: |-
  <div class="footer">
      Page <span class="pageNumber"></span>
      of <span class="totalPages"></span>
  </div>
`.trim();
}

module.exports = {
  update,
  pagedef,
}
