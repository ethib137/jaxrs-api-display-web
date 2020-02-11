const fetch = (url, method, data = {}) => {
	console.log('url', url);

	const request = {
		method
	};

	if (method === 'POST') {
		const body = JSON.stringify(data);

		request.body = body;

		const headers = new Headers();

		headers.append('Content-Type', 'application/json');

		request.headers = headers;
	}

	return Liferay.Util.fetch(
		url,
		request
	).then(
		res => {
			console.log('res', res);

			const json = res.json();

			console.log('json', json)

			return json;
		}
	);
}

export default fetch;