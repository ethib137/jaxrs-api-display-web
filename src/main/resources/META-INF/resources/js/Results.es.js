import React from 'react';

export default class extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="card overflow-auto vh-100">
				<div className="p-3">
					<pre style={{overflow: 'visible'}}>{this.props.data}</pre>
				</div>
			</div>
		);
	}
}