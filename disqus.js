const fs = require('fs');
const parser = require('xml2json');
const config = require('./config.json')

function getComments() {
    var xml = fs.readFileSync(config.xmlFile, 'utf8')
    var json = JSON.parse(parser.toJson(xml));

    var threads = buildThreads(json);

    var comments = json.disqus.post
    .map(post => {
        let id = post.thread['dsq:id']
        let thread = threads[id]
        let author = post.author

        if (!thread) {
            console.warn('thread not found for', `${post.message}(id: ${post['dsq:id']})`)
            return
        }
        return {
            pathname: thread.pathname,
            message: post.message,
            title: thread.title,
            link: thread.link,
            author: `${author.name} (<${author.email}>)`,
            date: post.createdAt
        }
    })
    .filter(x => x);

    var total = json.disqus.post.length
    var parsed = comments.length
    var failed = total - parsed
    console.log(`comments: ${total} found, ${parsed} attached, ${failed} dropped`)

    return comments;
}

function buildThreads(xml) {
    const threads = {}
    const postPathRE = /\/(\d{4}\/\d\d\/\d\d\/.*)\.html$/
    xml.disqus.thread.forEach(thread => {
        var match = postPathRE.exec(thread.link)
        if (!match) {
            return
        }

        thread.pathname = match[1]
        threads[thread['dsq:id']] = thread
    })
    return threads;
}

exports.buildThreads = buildThreads;
exports.getComments = getComments;
