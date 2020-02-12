import React from 'react';

import ClayBadge from '@clayui/badge';

import Api from './Api.es';

export default class extends React.Component {
	constructor(props) {
		super(props);

		console.log('props', props);

		let i = null;
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

	componentDidMount() {
		console.log('componentDidMount', this.state);

		const {i, set} = this.state;

		if (set != null && i != null) {
			const element = document.getElementById(`${set}-${i}`)

			if (element) {
				element.scrollIntoView();

				window.scroll(0, 0);
			}
		}
	}

	_parseAPIs(jaxrs) {
		const jaxArr = jaxrs.split(/(?:Application )([^\n]+)/g);

		jaxArr.shift();
		jaxArr.shift();
		jaxArr.shift();

		console.log('jaxArr', jaxArr);

		const jaxObj = {};

		let tempKey = null;

		jaxArr.map(item => {
			if (tempKey) {
				jaxObj[tempKey] = item;

				tempKey = null;
			}
			else {
				tempKey = item.split(' ')[2];
			}
		});

		Object.keys(jaxObj).map(key => {
			var urlPrefix = key.split(/(\/[a-z|-]+)/)[1];

			var arr = jaxObj[key].split(/((?:POST|GET|PUT|PATCH|DELETE)[^\n]+)/gm);

			arr = arr.filter((item, i) => (i % 2));

			arr = arr.map(
				item => {
					const itemArr = item.split(/(POST|GET|PUT|PATCH|DELETE) (\S+) Consumes: (.+)(?= Produces) Produces: (.+)/);

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

	_keyToId(key) {
		return key.substring(1, key.length);
	}

	render() {
		const {i, jaxObj, set} = this.state;

		const currentIndex = i;

		console.log('jaxObj', jaxObj);

		return (
			<div className="jaxrs-root">
				<div className="container container-fluid">
					<div className="row">
						<div className="col col-md-5 api-list overflow-auto border p-3">
							{jaxObj && Object.keys(jaxObj).map(key => (
								<div key={key}>
									<button
										aria-controls={this._keyToId(key)}
										aria-expanded={key == set ? 'true' : 'false'}
										class="btn btn-block btn-secondary mb-3 text-left"
										data-target={'#' + this._keyToId(key)}
										data-toggle="collapse"
										type="button"
									>
										{key}
									</button>

									<div class={'collapse' + (key == set ? ' show' : '')} id={this._keyToId(key)}>
										<div class="card card-body">
											{jaxObj[key].map((api, i) => (
												<div
													class={'align-items-center api-item d-flex p-1' + (key == set && i == currentIndex ? ' border border-primary rounded' : '')}
													id={key + '-' + i}
													key={i}
												>
													<ClayBadge
														className="flex-shrink-0"
														displayType="success"
														label={api.method}
													/>

													<button
														className="btn btn-link p-0 text-truncate"
														onClick={() => this._handleAPIClick(key, i)}
														title={`/o${api.urlPrefix}${api.url}`}
													>/o{api.urlPrefix}{api.url}</button>
												</div>
											))}
										</div>
									</div>
								</div>
							))}		
						</div>

						<div className="col col-md-7">
							{set && 
								<Api api={jaxObj[set][i]} category={set} i={i} key={`${set}${i}`} />
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}