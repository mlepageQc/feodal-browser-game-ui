var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({ target: 'https://obscure-plateau-79291.herokuapp.com' })

var PORT = process.env.PORT || 8000

proxy.listen(PORT);

console.log('Proxy listening to port ' + PORT);

var enableCors = function(req, res) {
	if (req.headers['access-control-request-method']) {
		res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
	}

	if (req.headers['access-control-request-headers']) {
		res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
	}

	if (req.headers.origin) {
		res.setHeader('access-control-allow-origin', req.headers.origin);
		res.setHeader('access-control-allow-credentials', 'true');
	}
};

// set header for CORS
proxy.on("proxyRes", function(proxyRes, req, res) {
	console.log('Proxy request')
	enableCors(req, res);
});

