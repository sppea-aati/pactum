package br.mp.mpf.pgr.pactum.cmd.usuario;

import javax.inject.Inject;

import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import br.mp.mpf.pgr.pactum.domain.Usuario;
import br.mp.mpf.pgr.spea.exception.InfraestruturaException;

@Component
@Profile({ "prod" , "dev-oracle"})
public class GetUsuarioLogado {

	@Inject
	protected GetUsuarioByEmail getUsuarioByEmail;

	public Usuario get() {
		SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();

		if (authentication == null) {
			throw new InfraestruturaException("Usuário não está logado.");
		}

		Object principal = authentication.getPrincipal();

		if (principal instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) principal;

			Usuario usuario = getUsuarioByEmail.get(userDetails.getUsername());

			if (usuario == null) {
				throw new InfraestruturaException("Usuário não localizado: " + userDetails.getUsername());
			}

			return usuario;
		} else {
			throw new InfraestruturaException("Tipo do principal não tratado: " + principal.getClass().getName());
		}
	}
	
	public Usuario getOrNull() {
		SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		
		if (authentication == null) {
			return null;
		}
		
		Object principal = authentication.getPrincipal();
		
		if (principal instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) principal;
			
			Usuario usuario = getUsuarioByEmail.get(userDetails.getUsername());
			
			if (usuario == null) {
				return null;
			}
			
			return usuario;
		} else {
			return null;
		}
	}

	public String getIp() {
		return (String) RequestContextHolder.currentRequestAttributes().getAttribute("ip",
				RequestAttributes.SCOPE_REQUEST);
	}
}
