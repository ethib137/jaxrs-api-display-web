import React from 'react';

import Api from './Api';

export default class extends React.Component {
	constructor(props) {
		super(props);

		console.log('props', props);

		let i = 0;
		let set = null;

		let hash = location.hash;

		console.log('hash', hash);

		if (hash) {
			hash = hash.substring(1, hash.length);

			const hashArr = hash.split('+');

			i = parseInt(hashArr[1]);
			set = decodeURI(hashArr[0]);
		}

		this.state = {
			i,
			jaxObj: this._parseAPIs(props.jaxrs),
			set
		}
	}

	_parseAPIs(jaxrs) {
		const jaxArr = jaxrs.split(/(?:Application )([^\n]+)/g);

		jaxArr.shift();

		const jaxObj = {};

		let tempKey = null;

		jaxArr.map(item => {
			if (tempKey) {
				jaxObj[tempKey] = item;

				tempKey = null;
			}
			else {
				tempKey = item;
			}
		});

		Object.keys(jaxObj).map(key => {
			var urlPrefix = key.split(/(\/[a-z|-]+)/)[1];

			var arr = jaxObj[key].split(/((?:POST|GET|PUT|PATCH|DELETE)[^\n]+)/gm);

			arr = arr.filter((item, i) => (i % 2));

			arr = arr.map(
				item => {
					const itemArr = item.split(/(POST|GET|PUT|PATCH|DELETE) (\S+) Consumes: (.+)(?= Produces) Produces: (.+)/);
					console.log('itemArr', itemArr);
					return {
						consumes: itemArr[3],
						method: itemArr[1],
						produces: itemArr[4],
						url: itemArr[2],
						urlPrefix
					};
				}
			)

			jaxObj[key] = arr;
		});

		return jaxObj;
	}

	_handleAPIClick(set, i) {
		console.log(set, i);

		location.hash = `${set}+${i}`;

		this.setState({
			i,
			set
		});
	}

	render() {
		const {i, jaxObj, set} = this.state;

		console.log('jaxObj', jaxObj);

		return (
			<div className="jaxrs-root">
				<div className="container container-fluid">
					<div className="row">
						<div className="col col-md-4 api-list">
							{jaxObj && Object.keys(jaxObj).map(key => (
								<div key={key}>
									<h1>{key}</h1>

									{jaxObj[key].map((api, i) => (
										<div key={i}>
											<a href="javascript:;" onClick={() => this._handleAPIClick(key, i)}>{api.method} /o{api.urlPrefix}{api.url}</a>
										</div>
									))}
								</div>
							))}		
						</div>

						<div className="col col-md-8">
							{set && 
								<Api api={jaxObj[set][i]} key={`${set}${i}`} />
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}