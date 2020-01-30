import React from 'react';

import App from './App';

export default function(props) {
	return (
		<App jaxrs={props.jaxrs} />
	);
}