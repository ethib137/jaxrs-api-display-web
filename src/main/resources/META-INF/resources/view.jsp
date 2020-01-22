<%--
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
--%>

<%@ include file="/init.jsp" %>

<%
String command = (String)SessionMessages.get(renderRequest, "command");
String commandOutput = (String)SessionMessages.get(renderRequest, "commandOutput");
String prompt = (String)SessionMessages.get(renderRequest, "prompt");
%>

<div class="container-fluid-1280">
	<%
	Map<String, Object> data = new HashMap<>();

	data.put("jaxrs", commandOutput);
	%>

	<div class="react-component">
		<react:component
			data="<%= data %>"
			module="js/jaxrsApp.es"
		/>
	</div>
</div>
