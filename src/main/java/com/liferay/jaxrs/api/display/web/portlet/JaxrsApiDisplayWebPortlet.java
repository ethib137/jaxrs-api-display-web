package com.liferay.jaxrs.api.display.web.portlet;

import com.liferay.jaxrs.api.display.web.constants.JaxrsApiDisplayWebPortletKeys;
import com.liferay.jaxrs.api.display.web.constants.GogoShellWebKeys;

import com.liferay.portal.kernel.io.unsync.UnsyncByteArrayInputStream;
import com.liferay.portal.kernel.io.unsync.UnsyncByteArrayOutputStream;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.security.auth.PrincipalException;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.servlet.SessionErrors;
import com.liferay.portal.kernel.servlet.SessionMessages;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.ResourceBundleUtil;
import com.liferay.portal.kernel.util.TransientValue;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;

import java.util.ResourceBundle;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.PortletRequest;
import javax.portlet.PortletSession;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.apache.felix.service.command.CommandProcessor;
import org.apache.felix.service.command.CommandSession;
import org.apache.felix.service.command.Converter;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author evanthibodeau
 */
@Component(
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.header-portlet-css=/css/main.css",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.display-name=JaxrsApiDisplayWeb",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=" + JaxrsApiDisplayWebPortletKeys.JAXRSAPIDISPLAYWEB,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user"
	},
	service = Portlet.class
)
public class JaxrsApiDisplayWebPortlet extends MVCPortlet {
	@Override
	public void doView(
			RenderRequest renderRequest, RenderResponse renderResponse)
		throws IOException, PortletException {

		String command = "jaxrs:check";

		initCommandSession(renderRequest);

		CommandSession commandSession = _getSessionAttribute(
			renderRequest, GogoShellWebKeys.COMMAND_SESSION);

		ThemeDisplay themeDisplay = (ThemeDisplay)renderRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

		UnsyncByteArrayOutputStream outputUnsyncByteArrayOutputStream =
			_getSessionAttribute(
				renderRequest, GogoShellWebKeys.COMMAND_SESSION_OUTPUT_STREAM);
		UnsyncByteArrayOutputStream errorUnsyncByteArrayOutputStream =
			_getSessionAttribute(
				renderRequest, GogoShellWebKeys.COMMAND_SESSION_ERROR_STREAM);
		PrintStream outputPrintStream = _getSessionAttribute(
			renderRequest,
			GogoShellWebKeys.COMMAND_SESSION_OUTPUT_PRINT_STREAM);
		PrintStream errorPrintStream = _getSessionAttribute(
			renderRequest, GogoShellWebKeys.COMMAND_SESSION_ERROR_PRINT_STREAM);

		try {
			SessionMessages.add(renderRequest, "command", command);

			checkCommand(command, themeDisplay);

			Object result = commandSession.execute(command);

			if (result != null) {
				outputPrintStream.print(
					commandSession.format(result, Converter.INSPECT));
			}

			errorPrintStream.flush();
			outputPrintStream.flush();

			SessionMessages.add(
				renderRequest, "commandOutput",
				outputUnsyncByteArrayOutputStream.toString());

			String errorContent = errorUnsyncByteArrayOutputStream.toString();

			if (Validator.isNotNull(errorContent)) {
				throw new Exception(errorContent);
			}
		}
		catch (Exception exception) {
			hideDefaultErrorMessage(renderRequest);

			SessionErrors.add(renderRequest, "gogo", exception);
		}
		finally {
			outputUnsyncByteArrayOutputStream.reset();
			errorUnsyncByteArrayOutputStream.reset();
		}

		SessionMessages.add(
			renderRequest, "prompt", commandSession.get("prompt"));

		super.doView(renderRequest, renderResponse);
	}

	public void executeCommand(
			ActionRequest actionRequest, ActionResponse actionResponse)
		throws Exception {

		String command = "jaxrs:check";

		ThemeDisplay themeDisplay = (ThemeDisplay)actionRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

		initCommandSession(actionRequest);

		CommandSession commandSession = _getSessionAttribute(
			actionRequest, GogoShellWebKeys.COMMAND_SESSION);

		UnsyncByteArrayOutputStream outputUnsyncByteArrayOutputStream =
			_getSessionAttribute(
				actionRequest, GogoShellWebKeys.COMMAND_SESSION_OUTPUT_STREAM);
		UnsyncByteArrayOutputStream errorUnsyncByteArrayOutputStream =
			_getSessionAttribute(
				actionRequest, GogoShellWebKeys.COMMAND_SESSION_ERROR_STREAM);
		PrintStream outputPrintStream = _getSessionAttribute(
			actionRequest,
			GogoShellWebKeys.COMMAND_SESSION_OUTPUT_PRINT_STREAM);
		PrintStream errorPrintStream = _getSessionAttribute(
			actionRequest, GogoShellWebKeys.COMMAND_SESSION_ERROR_PRINT_STREAM);

		try {
			SessionMessages.add(actionRequest, "command", command);

			checkCommand(command, themeDisplay);

			Object result = commandSession.execute(command);

			if (result != null) {
				outputPrintStream.print(
					commandSession.format(result, Converter.INSPECT));
			}

			errorPrintStream.flush();
			outputPrintStream.flush();

			SessionMessages.add(
				actionRequest, "commandOutput",
				outputUnsyncByteArrayOutputStream.toString());

			String errorContent = errorUnsyncByteArrayOutputStream.toString();

			if (Validator.isNotNull(errorContent)) {
				throw new Exception(errorContent);
			}
		}
		catch (Exception exception) {
			hideDefaultErrorMessage(actionRequest);

			SessionErrors.add(actionRequest, "gogo", exception);
		}
		finally {
			outputUnsyncByteArrayOutputStream.reset();
			errorUnsyncByteArrayOutputStream.reset();
		}
	}

	@Override
	public void processAction(
			ActionRequest actionRequest, ActionResponse actionResponse)
		throws IOException, PortletException {

		checkOmniAdmin();

		super.processAction(actionRequest, actionResponse);
	}

	@Override
	public void render(
			RenderRequest renderRequest, RenderResponse renderResponse)
		throws IOException, PortletException {

		checkOmniAdmin();

		super.render(renderRequest, renderResponse);
	}

	protected void checkCommand(String command, ThemeDisplay themeDisplay)
		throws Exception {

		Matcher matcher = _pattern.matcher(command);

		if (matcher.find()) {
			ResourceBundle resourceBundle = ResourceBundleUtil.getBundle(
				themeDisplay.getLocale(), JaxrsApiDisplayWebPortlet.class);

			throw new Exception(
				LanguageUtil.format(
					resourceBundle, "the-command-x-is-not-supported", command));
		}
	}

	protected void checkOmniAdmin() throws PortletException {
		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();

		if (!permissionChecker.isOmniadmin()) {
			PrincipalException principalException =
				new PrincipalException.MustBeOmniadmin(permissionChecker);

			throw new PortletException(principalException);
		}
	}

	protected void initCommandSession(PortletRequest portletRequest) {
		PortletSession portletSession = portletRequest.getPortletSession();

		Object commandSessionAttribute = portletSession.getAttribute(
			GogoShellWebKeys.COMMAND_SESSION);

		if (commandSessionAttribute instanceof CommandSession) {
			return;
		}

		UnsyncByteArrayOutputStream outputUnsyncByteArrayOutputStream =
			new UnsyncByteArrayOutputStream();
		UnsyncByteArrayOutputStream errorUnsyncByteArrayOutputStream =
			new UnsyncByteArrayOutputStream();

		PrintStream outputPrintStream = new PrintStream(
			outputUnsyncByteArrayOutputStream);
		PrintStream errorPrintStream = new PrintStream(
			errorUnsyncByteArrayOutputStream);

		CommandSession commandSession = _commandProcessor.createSession(
			_emptyInputStream, outputPrintStream, errorPrintStream);

		commandSession.put("prompt", "g!");

		portletSession.setAttribute(
			GogoShellWebKeys.COMMAND_SESSION,
			new TransientValue<>(commandSession));

		portletSession.setAttribute(
			GogoShellWebKeys.COMMAND_SESSION_ERROR_PRINT_STREAM,
			new TransientValue<>(errorPrintStream));
		portletSession.setAttribute(
			GogoShellWebKeys.COMMAND_SESSION_ERROR_STREAM,
			new TransientValue<>(errorUnsyncByteArrayOutputStream));
		portletSession.setAttribute(
			GogoShellWebKeys.COMMAND_SESSION_OUTPUT_PRINT_STREAM,
			new TransientValue<>(outputPrintStream));
		portletSession.setAttribute(
			GogoShellWebKeys.COMMAND_SESSION_OUTPUT_STREAM,
			new TransientValue<>(outputUnsyncByteArrayOutputStream));
	}

	private static <T> T _getSessionAttribute(
		PortletRequest portletRequest, String name) {

		PortletSession portletSession = portletRequest.getPortletSession();

		Object sessionAttribute = portletSession.getAttribute(name);

		if (sessionAttribute instanceof TransientValue) {
			TransientValue<T> transientValue =
				(TransientValue<T>)sessionAttribute;

			return transientValue.getValue();
		}

		return null;
	}

	private static final InputStream _emptyInputStream =
		new UnsyncByteArrayInputStream(new byte[0]);
	private static final Pattern _pattern = Pattern.compile(
		".*(close|disconnect|exit|shutdown).*",
		Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);

	@Reference
	private CommandProcessor _commandProcessor;

	@Reference
	private Portal _portal;
}