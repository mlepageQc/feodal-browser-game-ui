const HttpProxy = require('http-proxy');

const proxy = HttpProxy.createProxyServer({ 
	target: 'http://app.local:3000'
})

const WEB_PORT = 8000

proxy.listen(WEB_PORT)

const enableCors = (req, res) => {
	if (req.headers['access-control-request-method']) {
		res.setHeader('access-control-allow-methods', req.headers['access-control-request-method'])
	}
	if (req.headers['access-control-request-headers']) {
		res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers'])
	}
	if (req.headers.origin) {
		res.setHeader('access-control-allow-origin', req.headers.origin)
		res.setHeader('access-control-allow-credentials', 'true')
	}
}

proxy.on('proxyRes', (_proxyRes, req, res) => {
	enableCors(req, res)
})

console.log('Proxy web socket server listening to port ' + WEB_PORT);

var proxyWs = HttpProxy.createServer({
	target: 'wss://app.local:3000',
	ws: true
})

const WEB_SOCKET_PORT = 8014

proxyWs.listen(WEB_SOCKET_PORT)

proxyWs.on('proxyRes', (_proxyRes, req, res) => {
	enableCors(req, res)
})

console.log('Proxy web socket server listening to port ' + WEB_SOCKET_PORT);

