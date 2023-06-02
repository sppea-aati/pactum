package br.mp.mpf.pgr.pactum.security;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ldap.core.ContextSource;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.ldap.userdetails.DefaultLdapAuthoritiesPopulator;

import br.mp.mpf.pgr.pactum.cmd.usuario.GetUsuarioByEmail;
import br.mp.mpf.pgr.pactum.domain.PerfilUsuario;
import br.mp.mpf.pgr.pactum.domain.Usuario;
import br.mp.mpf.pgr.spea.exception.InfraestruturaException;
import br.mp.mpf.pgr.spea.util.StringUtil;

public class SpeaAuthoritiesPopulator extends DefaultLdapAuthoritiesPopulator {

	private static final Logger log = LoggerFactory.getLogger(SpeaAuthoritiesPopulator.class);

	private GetUsuarioByEmail getUsuarioByEmail;

	public SpeaAuthoritiesPopulator(ContextSource contextSource, String groupSearchBase) {
		super(contextSource, groupSearchBase);
	}

	@Override
	public Set<GrantedAuthority> getGroupMembershipRoles(String userDn, String username) {

		Usuario usuario = getUsuarioByEmail.get(username);

		if (usuario == null) {
			throw new InfraestruturaException("Usuário não localizado. E-mail: " + username);
		}

		Set<GrantedAuthority> groupMembershipRoles = new HashSet<>();

		List<PerfilUsuario> perfis = usuario.getPerfis();
		List<String> roles = new ArrayList<>(perfis.size());
		for (PerfilUsuario perfil : perfis) {
			groupMembershipRoles.add(new SimpleGrantedAuthority(getRolePrefix() + perfil.getPerfil().name()));
		}

		log.debug("Usuário: {} Perfis banco: {}", usuario.getEmail(), StringUtil.virgulaE(roles));

		return groupMembershipRoles;
	}

	public void setGetUsuarioByEmail(GetUsuarioByEmail getUsuarioByEmail) {
		this.getUsuarioByEmail = getUsuarioByEmail;
	}

}
