const github = require('./github.js')
const disqus = require('./disqus.js')

var count = 0;

disqus.getComments()
.forEach(comment => {
    github.findOrCreateIssue(comment)
    .then(issue => github.issueComment(comment, issue))
    .then(() => console.log(`${++count} comments created: ${comment.message}`))
    .catch(err => console.error(err.message))
})
