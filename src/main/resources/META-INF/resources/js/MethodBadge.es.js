import React from 'react';

import ClayBadge from '@clayui/badge';

const METHOD_DISPLAY_MAP = {
	'POST': 'success',
	'GET': 'primary',
	'PUT': 'warning',
	'PATCH': 'info',
	'DELETE': 'danger'
}

export default function(props) {
	const {method, ...otherProps} = props;

	return (
		<ClayBadge
			displayType={METHOD_DISPLAY_MAP[method]}
			label={method}
			{...otherProps}
		/>
	);
}