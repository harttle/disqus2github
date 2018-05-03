const github = require('./github.js')
const disqus = require('./disqus.js')
// const fs = require('fs')

var count = 0;

// var list = fs.readFileSync('./posted-comments', 'utf8').split('\n')
// function inList(target) {
    // return list.some(str => str === target.message)
// }

disqus.getComments().slice()
// .filter(x => !inList(x))
.forEach(comment => {
    // console.log(comment.message)
    github.findOrCreateIssue(comment)
    .then(issue => github.issueComment(comment, issue))
    .then(() => console.log(`${++count} comments created: ${comment.message}`))
    .catch(err => console.error(err.message))
})
