const rp = require('request-promise');
const config = require('./config.json');

var cache = {}

function issueComment(comment, issue) {
    return fetch(issue.comments_url, 'POST', {
        body: comment.message + '\n\nBy ' + comment.author + ' ' + comment.date
    })
}

function findOrCreateIssue(post) {
    if (!cache[post.pathname]) {
        cache[post.pathname] = getIssueByTitle(post.pathname)
        .then(issue => issue || createIssue(post))
    }
    return cache[post.pathname]
}

function getIssueByTitle(title) {
    const q = `"${title}" type:issue in:title repo:${config.repo}`;
    return fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}`)
    .then(result => {
        return result.total_count > 0 ? result.items[0] : null;
    })
}

function createIssue(post) {
    return fetch(`https://api.github.com/repos/${config.repo}/issues`, 'POST', {
        title: post.pathname,
        body: `# ${post.title}\n\n[${post.link}](${post.link})`
    })
}

var lastFetch = Promise.resolve();

function fetch(url, method, body) {
    const TOKEN = config.token
    return lastFetch = lastFetch
    .then(() => new Promise(resolve => {
        setTimeout(resolve, 3000)
    }))
    .then(() => console.log(`fetching ${url}...`))
    .then(x => rp({
        method: method || 'GET',
        uri: url,
        headers: {
            Authorization: `token ${TOKEN}`,
            'User-Agent': 'disqus2issues'
        },
        body: body,
        json: true
    }))
}

exports.findOrCreateIssue = findOrCreateIssue
exports.issueComment = issueComment
