const HttpProxy = require('http-proxy');

const proxy = HttpProxy.createProxyServer({ 
	target: 'http://app.local:3000'
})

const PORT = 8000

proxy.listen(PORT)

console.log('Proxy listening to port ' + PORT);

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

