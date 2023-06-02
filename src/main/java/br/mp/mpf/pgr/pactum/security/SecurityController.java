package br.mp.mpf.pgr.pactum.security;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.domain.Usuario;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/user")
public class SecurityController {

	@RequestMapping(method = { RequestMethod.GET, RequestMethod.POST }, produces = MediaType.APPLICATION_JSON_VALUE)
	public Usuario getUsuario(HttpServletResponse response) throws IOException {
		SecurityContext securityContext = SecurityContextHolder.getContext();

		Authentication authentication = securityContext.getAuthentication();

		if (authentication.getPrincipal() instanceof Usuario) {
			Usuario usuario = (Usuario) authentication.getPrincipal();
			return usuario;
		} else {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			return null;
		}
	}

}
