import React from 'react';

import ClayForm, {ClayInput} from '@clayui/form';

import JavascriptExample from './JavascriptExample.es';
import MethodBadge from './MethodBadge.es';
import Results from './Results.es';

import lifeFetch from './fetch.es';

const TABS = [
	'Results',
	'Javascript Example'
];

export default class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			formBlurs: {},
			formErrors: {},
			formValues: {},
			inputs: props.api.url.match(/{[a-z|A-Z|\||:]+}/g),
			method: props.api.method,
			result: null,
			tabIndex: 0,
			test: 'evan',
			url: ''
		}

		this.setLocalStorage = this.setLocalStorage.bind(this);
	}

	componentDidMount() {
		const {category, i} = this.props;

		this.setState({formValues: this.getLocalStore(category, i)}, this._setURL);
	}

	storageAvailable(type) {
	    var storage;
	    try {
	        storage = window[type];
	        var x = '__storage_test__';
	        storage.setItem(x, x);
	        storage.removeItem(x);
	        return true;
	    }
	    catch(e) {
	        return e instanceof DOMException && (
	            // everything except Firefox
	            e.code === 22 ||
	            // Firefox
	            e.code === 1014 ||
	            // test name field too, because code might not be present
	            // everything except Firefox
	            e.name === 'QuotaExceededError' ||
	            // Firefox
	            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
	            // acknowledge QuotaExceededError only if there's something already stored
	            (storage && storage.length !== 0);
	    }
	}

	generateKey(category, i) {
		return `API_FORM_VALUES_${category}_${i}`;
	}

	setLocalStorage(formValues, category, i) {
		if (this.storageAvailable('localStorage')) {
			localStorage.setItem(this.generateKey(category, i), JSON.stringify(formValues));
		}
	}

	getLocalStore(category, i) {
		if (this.storageAvailable('localStorage')) {
			const item = localStorage.getItem(this.generateKey(category, i));

			if (!item) {
				return {};
			}

			return JSON.parse(item);
		}
	}

	_handleInput(e) {
		console.log(e);

		const {name, value} = e.target;

		this.setState(state => (
			{formValues: Object.assign({}, state.formValues, {[name]: value})}
		),
		() => {
			const {formValues} = this.state;

			const {category, i} = this.props;

			this.setLocalStorage(formValues, category, i);

			this._setURL();
		});
	}

	_handleSubmit() {
		console.log('Submit');

		const {method, url} = this.state;

		lifeFetch(url, method, {}).then(
			res => {
				console.log(res);

				this.setState({
					result: JSON.stringify(res, null, 4)
				})
			}
		).catch(
			err => {
				console.log('err', err);
			}
		);
	}

	_renderTabPanel(i) {
		switch(i) {
			case 0:
				return <Results data={this.state.result} />;
			case 1:
				return <JavascriptExample method={this.state.method} url={this.state.url} />;
			default:
				return <Results data={this.state.results} />;
		}
	}

	_setURL() {
		const {formValues, inputs} = this.state;

		const {api} = this.props;

		let url = `/o${api.urlPrefix}${api.url}`;

		inputs.forEach(input => {
			url = url.replace(input, formValues[input]);
		});

		if (this.state.method == 'GET' && formValues.page && formValues.pageSize) {
			url = `${url}?page=${formValues.page}&pageSize=${formValues.pageSize}`;
		}

		this.setState({
			url
		});
	}

	render() {
		const {api} = this.props;

		console.log('this.state', this.state);

		const {
			formValues,
			inputs,
			result,
			tabIndex,
			url
		} = this.state;

		return (
			<div>
				<div class="align-items-center d-flex mb-4">
					<MethodBadge className="flex-shrink-0" method={api.method} />

					<span> /o{api.urlPrefix}{api.url}</span>
				</div>


				{inputs && inputs.map(input => (
					<ClayForm.Group key={input}>
						<label htmlFor={input}>{input}</label>
						<ClayInput
							id={input}
							name={input}
							onInput={e => this._handleInput(e)}
							type="text"
							value={formValues[input]}
						/>
					</ClayForm.Group>
				))}

				{api.method == 'GET' &&
					<>
						<ClayForm.Group>
							<label htmlFor="page">{'Page'}</label>
							<ClayInput
								id="page"
								name="page"
								onInput={e => this._handleInput(e)}
								type="text"
								value={formValues['page']}
							/>
						</ClayForm.Group>

						<ClayForm.Group>
							<label htmlFor="pageSize">{'Page Size'}</label>
							<ClayInput
								id="pageSize"
								name="pageSize"
								onInput={e => this._handleInput(e)}
								type="text"
								value={formValues['pageSize']}
							/>
						</ClayForm.Group>
					</>
				}

				<div className="mb-4">{url}</div>

				<button className="btn btn-primary mb-4" onClick={() => this._handleSubmit()}>{'Submit'}</button>

				{result &&
					<>
						<ul className="nav nav-underline mb-4" role="tablist">
							{TABS.map((tab, i) => (
								<li className="nav-item" key={tab}>
									<button 
										className={'btn btn-unstyled nav-link' + (tabIndex == i ? ' active' : '')}
										onClick={() => this.setState({tabIndex: i})}
										role="tab"
									>
										{tab}
									</button>
								</li>
							))}
						</ul>

						{this._renderTabPanel(tabIndex)}
					</>
				}
			</div>
		);
	}
}