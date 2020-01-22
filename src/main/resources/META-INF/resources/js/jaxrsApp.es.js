import React from 'react';

import ClayPanel from '@clayui/panel';

export default function(props) {
	console.log('props', props);

	const {jaxrs} = props;

	const jaxArr = jaxrs.split(/(Application [\.|a-zA-Z]+ \([0-9]+\) \/[a-zA-Z]+)/g);

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

	console.log('jaxObj', jaxObj);

	return (
		<div className="jaxrs-root">
			{'Hello World!'}


			{jaxObj && Object.keys(jaxObj).map(key => (
				<ClayPanel
					collapsable
					displayTitle={key}
					displayType="secondary"
				>
					<ClayPanel.Body>{jaxObj[key]}</ClayPanel.Body>
				</ClayPanel>
			))}

		</div>
	);
}