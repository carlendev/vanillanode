const http = require('http')
const url = require('url')

const port = 8000

const wesh = console.log

const append = (a, b) => b + a

const isFunction = a => typeof a === 'function'

const codeNotFound = 404

const codeOK = 200

const directRoute = ''

const getRoute = (method, urlP) => `${method} ${urlP}`

const jsonHead = { 'Content-type': 'application/json' }

const connectionHead = { Connection: 'keep-alive' }

const contentLength = body => ({ 'Content-Length': Buffer.byteLength(body) })

const combineHead = (...args) => Object.assign({}, ...args)

const apiHeader = (res, code, data) => writeHead(res, code, combineHead(jsonHead, connectionHead, contentLength(JSON.stringify(data))))

const writeHead = (res, code, props) => res.writeHead(code, props)

const resWrite = (res, props) => res.write(JSON.stringify(props))

const resApi = (res, code, data) => {
    apiHeader(res, code, data)
    resWrite(res, data)
    res.end()    
}

const notFound = (req, res) => resApi(res, codeNotFound, { message: 'Not Found', method: req.method, url: req.url })

const home = (req, res) => resApi(res, codeOK, { message: 'home', method: req.method, url: req.url })

const articles = (req, res) => resApi(res, codeOK, { message: 'articles', method: req.method, url: req.url })

const articlesFr = (req, res) => resApi(res, codeOK, { message: 'articles Fr', method: req.method, url: req.url })

const articlesId = (req, res, ...args) => resApi(res, codeOK, { message: 'articles id', method: req.method, url: req.url, param: args[0][1] })

const router = {
    'GET ': home,
    'GET home': home,
    'GET articles': {
        '': articles,
        ':id': articlesId,
        'fr': articlesFr
    }
}

const inRouter = (router, route) => router[route]

const findParam = (router, base, routes) => {
    const e = router[base]
    const l = Object.keys(e)
    const route = l.find(e => e[0] === ':')
    return route === undefined ? notFound : e[route]
}

//TODO(carlendev) make it recurse
const exec = (route, req, res, rest) => {
    const base = getRoute(req.method, route[0])
    if (route.length === 1) {
        if (inRouter(router, base)) return router[base][directRoute](req, res)
        return notFound(req, res)
    }
    const e = router[base][route[1]]
    if (isFunction(e)) return e(req, res)
    if (route.length === 2) return findParam(router, base)(req, res, route)
}

const request = (req, res) => {
    let body = ''
    const [ , ...urlP ] = url.parse(req.url).pathname.split('/')
    const method = req.method
    
    req.on('data', chunk => append(chunk, body))
    //TODO(carlendev) check GET/POST
    req.on('end', () => {
        const route = getRoute(method, urlP[0])
        if (router[route] === undefined) return notFound(req, res)
        if (isFunction(router[route])) return router[route](req, res)
        exec(urlP, req, res)
    })
}

http.createServer(request).listen(port, () => wesh(`Server listen on ${port}`)) 