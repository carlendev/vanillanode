const http = require('http')
const url = require('url')

const port = 8000

const wesh = console.log

const append = (a, b) => b + a

const home = (req, res) => {    
    res.end('home')
}

const router = {
    'GET /': home,
    'GET ': home
}

const getRoute = (method, urlP) => `${method} ${urlP.pathname}`

const request = (req, res) => {
    let body = ''
    const urlP = url.parse(req.url)
    const method = req.method
    
    //TODO(carlendev) set header
    req.on('data', chunk => append(chunk, body))
    //TODO(carlendev) add 404
    //TODO(carlendev) check GET/POST
    req.on('end', () => router[getRoute(method, urlP)](req, res))
}

http.createServer(request).listen(port, () => wesh(`Server listen on ${port}`))