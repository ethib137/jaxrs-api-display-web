import React from 'react';

export default class extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {method, url} = this.props;

		return (
			<div className="card overflow-auto vh-100">
				<div className="p-3">
					<pre style={{overflow: 'visible'}}>{
`const request = {
	method: '${method}'
};

if ('${method}' === 'POST') {
	const body = JSON.stringify(data);

	request.body = body;

	const headers = new Headers();

	headers.append('Content-Type', 'application/json');

	request.headers = headers;
}

Liferay.Util.fetch(
	'${url}',
	request
).then(
	res => {
		console.log('res', res);

		const json = res.json();

		console.log('json', json)
	}
);`
					}</pre>
				</div>
			</div>
		);
	}
}