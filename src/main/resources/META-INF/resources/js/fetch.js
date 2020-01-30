var fetch = (url, method, data = {}) => {
	console.log('url', url);

	var request = {
		method
	};

	if (method === 'POST') {
		var body = JSON.stringify(data);

		request.body = body;

		var headers = new Headers();

		headers.append('Content-Type', 'application/json');

		request.headers = headers;
	}

	return Liferay.Util.fetch(
		url,
		request
	).then(
		res => {
			console.log('res', res);

			var json = res.json();

			console.log('json', json)

			return json;
		}
	);
}

export default fetch;