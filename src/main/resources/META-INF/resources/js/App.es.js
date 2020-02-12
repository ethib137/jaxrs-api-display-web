import React from 'react';

import ClayAlert from '@clayui/alert';
import ClayForm, {ClayInput} from '@clayui/form';

import Api from './Api.es';
import MethodBadge from './MethodBadge.es';

export default class extends React.Component {
	constructor(props) {
		super(props);

		let apiKey = null;
		let setKey = null;
		let filter = '';

		let hash = location.hash;

		if (hash) {
			hash = hash.substring(1, hash.length);

			const hashArr = hash.split('+');

			apiKey = decodeURI(hashArr[1]);
			setKey = decodeURI(hashArr[0]);
			filter = decodeURI(hashArr[2]);
		}

		this.state = {
			apiKey,
			filter,
			jaxObj: this._parseAPIs(props.jaxrs),
			setKey
		}
	}

	componentDidMount() {
		const {apiKey, setKey} = this.state;

		if (setKey != null && apiKey != null) {
			const element = document.getElementById(`${setKey}-${apiKey}`)

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

			const setObj = {};

			arr.forEach(
				item => {
					const itemArr = item.split(/(POST|GET|PUT|PATCH|DELETE) (\S+) Consumes: (.+)(?= Produces) Produces: (.+)/);

					const method = itemArr[1];
					const url = itemArr[2];

					setObj[`${method}_${url}`] = {
						consumes: itemArr[3],
						method: itemArr[1],
						produces: itemArr[4],
						url: itemArr[2],
						urlPrefix
					};
				}
			);

			// TODO: switch to map within a map.

			jaxObj[key] = setObj;
		});

		return jaxObj;
	}

	_getFilteredObj(jaxObj, filter) {
		if (filter.trim().length == 0) {
			return jaxObj;
		}

		const newObj = {};

		// filter = filter.replace(/[/|:|{|}|.]/, x => '\\' + x);

		console.log('filter', filter);

		// const regex = new RegExp(`/${filter}/`, 'gi');

		Object.keys(jaxObj).forEach(setKey => {
			const newSetObj = {};

			Object.keys(jaxObj[setKey]).forEach(apiKey => {
				const api = jaxObj[setKey][apiKey];

				const url = api.urlPrefix + api.url;

				if (url.match(filter) || api.method.match(filter)) {
					newSetObj[apiKey] = api;
				}
			});

			if (Object.keys(newSetObj).length > 0) {
				newObj[setKey] = newSetObj;
			}
		});

		return newObj;
	}

	_handleAPIClick(setKey, apiKey) {
		const {filter} = this.state;

		location.hash = `${setKey}+${apiKey}+${filter}`;

		this.setState({
			apiKey,
			setKey
		});
	}

	_keyToId(key) {
		return key.substring(1, key.length);
	}

	render() {
		const {
			apiKey,
			filter,
			jaxObj,
			setKey
		} = this.state;

		console.log('jaxObj', jaxObj, this.state);

		const filteredObj = this._getFilteredObj(jaxObj, filter);

		console.log('filteredObj', filteredObj);

		const apisExist = filteredObj && !Object.keys(filteredObj).length == 0;

		return (
			<div className="jaxrs-root">
				<div className="container container-fluid">
					<div className="row">
						<div className="col col-md-5 border p-0">
							<ClayForm.Group className="px-3 pt-3">
								<label htmlFor="filter">{'Filter'}</label>
								<ClayInput
									id="filter"
									name="filter"
									onInput={e => this.setState({filter: e.target.value})}
									type="text"
									value={filter}
								/>
							</ClayForm.Group>

							<div className="api-list overflow-auto border-top p-3">
								{!apisExist &&
									<ClayAlert displayType="info" spritemap={themeDisplay.getPathThemeImages() + '/lexicon/icons.svg'} title="Info:">
										There are no api's that match your filter.
									</ClayAlert>
								}

								{apisExist && Object.keys(filteredObj).map(curSetKey => (
									<div key={curSetKey}>
										<button
											aria-controls={this._keyToId(curSetKey)}
											aria-expanded={curSetKey == setKey ? 'true' : 'false'}
											class="btn btn-block btn-secondary mb-3 text-left"
											data-target={'#' + this._keyToId(curSetKey)}
											data-toggle="collapse"
											type="button"
										>
											{curSetKey}
										</button>

										<div class={'collapse' + (curSetKey == setKey ? ' show' : '')} id={this._keyToId(curSetKey)}>
											<div class="card card-body">
												{Object.keys(filteredObj[curSetKey]).map(curAPIKey => (
													<div
														class={'align-items-center api-item d-flex p-1' + (curSetKey == setKey && curAPIKey == apiKey ? ' border border-primary rounded' : '')}
														id={curSetKey + '-' + curAPIKey}
														key={curAPIKey}
													>
														<MethodBadge className="flex-shrink-0" method={filteredObj[curSetKey][curAPIKey].method} />

														<button
															className="btn btn-link p-0 text-truncate"
															onClick={() => this._handleAPIClick(curSetKey, curAPIKey)}
															title={`/o${filteredObj[curSetKey][curAPIKey].urlPrefix}${filteredObj[curSetKey][curAPIKey].url}`}
														>/o{filteredObj[curSetKey][curAPIKey].urlPrefix}{filteredObj[curSetKey][curAPIKey].url}</button>
													</div>
												))}
											</div>
										</div>
									</div>
								))}		
							</div>
						</div>

						<div className="col col-md-7">
							{apisExist && setKey && 
								<Api api={jaxObj[setKey][apiKey]} setKey={setKey} apiKey={apiKey} key={`${setKey}${apiKey}`} />
							}

							{!setKey &&
								<ClayAlert displayType="info" spritemap={themeDisplay.getPathThemeImages() + '/lexicon/icons.svg'} title="Info:">
									Please select an API to display more info.
								</ClayAlert>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}