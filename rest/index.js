const http = require('http')
const url = require('url')

const port = 8000

const wesh = console.log

const append = (a, b) => b + a

const codeNotFound = 404

const codeOK = 200

const getRoute = (method, urlP) => `${method} ${urlP.pathname}`

const jsonHead = { 'Content-type': 'application/json' }

const connectionHead = { Connection: 'keep-alive' }

const contentLength = body => ({ 'Content-Length': Buffer.byteLength(body) })

const combineHead = (...args) => Object.assign({}, ...args)

const apiHeader = (res, code, data) => writeHead(res, code, combineHead(jsonHead, connectionHead, contentLength(JSON.stringify(data))))

const writeHead = (res, code, props) => res.writeHead(code, props)

const resWrite = (res, props) => res.write(JSON.stringify(props))

const notFound = (req, res) => {
    const data = { message: 'Not Found', method: req.method, url: req.url }
    apiHeader(res, codeNotFound, data)
    resWrite(res, data)
    res.end()
}

const home = (req, res) => {    
    const data = { message: 'home', method: req.method, url: req.url }
    apiHeader(res, codeOK, data)
    resWrite(res, data)
}

const router = {
    'GET /': home,
    'GET ': home,
    'GET /home': home
}

const request = (req, res) => {
    let body = ''
    const urlP = url.parse(req.url)
    const method = req.method
    
    req.on('data', chunk => append(chunk, body))
    //TODO(carlendev) check GET/POST
    req.on('end', () => {
        const route = getRoute(method, urlP)
        if (router[route] === undefined) return notFound(req, res)
        router[getRoute(method, urlP)](req, res)
    })
}

http.createServer(request).listen(port, () => wesh(`Server listen on ${port}`))