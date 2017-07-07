const http = require('http')
const url = require('url')

const port = 8000

const wesh = console.log

const append = (a, b) => b + a

const home = (req, res) => {    
    res.end('home')
}

const router = {
    '/': home,
    '': home
}

const request = (req, res) => {
    let body = ''
    const urlP = url.parse(req.url)
    
    //TODO(carlendev) set header
    req.on('data', chunk => append(chunk, urlP))
    //TODO(carlendev) add 404
    //TODO(carlendev) check GET/POST
    req.on('end', () => router[urlP.pathname](req, res))
}

http.createServer(request).listen(port, () => wesh(`Server listen on ${port}`))