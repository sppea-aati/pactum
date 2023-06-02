package br.mp.mpf.pgr.pactum.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
public class RestAuthenticationFailureHandler implements AuthenticationFailureHandler {
	
	private static final Logger log = LoggerFactory.getLogger(RestAuthenticationFailureHandler.class);

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
			throws IOException, ServletException {

		log.debug("Falha ao autenticar: " + exception.getMessage());
		
		response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, exception.getMessage());
	}

}
