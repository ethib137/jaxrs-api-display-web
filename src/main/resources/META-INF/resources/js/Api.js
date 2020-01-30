import React from 'react';

import lifeFetch from './fetch';

export default class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			formBlurs: {},
			formErrors: {},
			formValues: {},
			inputs: props.api.url.match(/{[a-z|A-Z]+}/g),
			result: null,
			test: 'evan',
			url: ''
		}
	}

	_handleInput(e) {
		console.log(e);

		const {name, value} = e.target;

		this.setState(state => (
			{formValues: Object.assign({}, state.formValues, {[name]: value})}
		),
		() => {
			const {formValues, inputs} = this.state;

			const {api} = this.props;

			let url = `/o${api.urlPrefix}${api.url}`;

			inputs.forEach(input => {
				url = url.replace(input, formValues[input]);
			})

			this.setState({
				url
			})
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

	render() {
		const {api} = this.props;

		console.log('this.state', this.state);

		const {
			formValues,
			inputs,
			result,
			url
		} = this.state;

		return (
			<div>
				{api.method} /o{api.urlPrefix}{api.url}

				{inputs && inputs.map(input => (
					<div className="form-group" key={input}>
						<label for={input}>{input}</label>
						<input
							class="form-control"
							id={input}
							key={input}
							name={input}
							onInput={e => this._handleInput(e)}
							type="text"
							value={formValues[input]}
						/>
					</div>
				))}

				<div>{url}</div>

				<button className="btn btn-primary my-4" onClick={() => this._handleSubmit()}>{'Submit'}</button>

				{result &&
					<>
						<h1>{'Results'}</h1>

						<div className="card p-3">
							<pre>{result}</pre>
						</div>
					</>
				}
			</div>
		);
	}
}