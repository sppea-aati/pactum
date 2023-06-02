package br.mp.mpf.pgr.pactum.security;

import java.util.Collection;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.cmd.usuario.Login;
import br.mp.mpf.pgr.pactum.domain.Usuario;

@Component
public class SpeaUserDetailsContextMapper implements UserDetailsContextMapper {

	private static final Logger log = LoggerFactory.getLogger(SpeaUserDetailsContextMapper.class);

	@Inject
	protected Login login;

	@Override
	public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authorities) {
		try {
			Usuario usuario = login.login(username);
			return usuario;
		} catch (AuthenticationException e) {
			throw e;
		} catch (Exception e) {
			log.error("Erro interno no sistema ao autenticar usuário: " + username, e);
			throw new AuthenticationServiceException("Erro interno no sistema.", e);
		}
	}

	@Override
	public void mapUserToContext(UserDetails user, DirContextAdapter ctx) {
		throw new UnsupportedOperationException("Operação não suportada.");
	}

}
