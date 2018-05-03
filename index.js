const github = require('./github.js')
const disqus = require('./disqus.js')

var count = 0;

function createComments() {
    return disqus.getComments()
    .forEach(comment => {
        github.findOrCreateIssue(comment)
        .then(issue => github.issueComment(comment, issue))
        .then(() => console.log(`${++count} comments created: ${comment.message}`))
        .catch(err => console.error(err.message))
    })
}

function updateComments() {
    github.getComments().then(comments => comments.forEach(comment => {
        github.updateComment(comment)
        .then(() => console.log(`${++count} comments updated`))
        .catch(err => console.error(err.message))
    }))
}

createComments();
// updateComments();
