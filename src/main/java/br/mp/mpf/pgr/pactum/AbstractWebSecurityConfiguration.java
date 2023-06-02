package br.mp.mpf.pgr.pactum;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.ldap.core.ContextSource;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyUtils;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.ForwardAuthenticationSuccessHandler;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import br.mp.mpf.pgr.pactum.cmd.usuario.GetUsuarioByEmail;
import br.mp.mpf.pgr.pactum.security.RestAuthenticationEntryPoint;
import br.mp.mpf.pgr.pactum.security.RestAuthenticationFailureHandler;
import br.mp.mpf.pgr.pactum.security.RestLogoutSuccessHandler;
import br.mp.mpf.pgr.pactum.security.SpeaAuthoritiesPopulator;
import br.mp.mpf.pgr.pactum.security.SpeaUserDetailsContextMapper;
import br.mp.mpf.pgr.spea.filter.FixedLocaleFilter;

public abstract class AbstractWebSecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private RestAuthenticationEntryPoint restAuthenticationEntryPoint;

	@Autowired
	private RestAuthenticationFailureHandler restAuthenticationFailureHandler;

	@Autowired
	private RestLogoutSuccessHandler restLogoutSuccessHandler;

	@Autowired
	private FixedLocaleFilter fixedLocaleFilter;

	@Autowired
	protected GetUsuarioByEmail getUsuarioByEmail;

	@Autowired
	private ContextSource contextSource;

	@Autowired
	protected SpeaUserDetailsContextMapper speaUserDetailsContextMapper;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		RequestMatcher preferredMatcher = new OrRequestMatcher(
			new AntPathRequestMatcher("/api/logout", "GET"),
			new AntPathRequestMatcher("/api/logout", "POST"),
			new AntPathRequestMatcher("/api/logout", "PUT"),
			new AntPathRequestMatcher("/api/logout", "DELETE")
		);

		http
			.csrf().disable()
			.addFilterBefore(fixedLocaleFilter, SecurityContextPersistenceFilter.class)
			.exceptionHandling()
				.authenticationEntryPoint(restAuthenticationEntryPoint)
				.and()
			.authorizeRequests()
				.antMatchers("/api/user").permitAll()
				.antMatchers("/api/**").hasAnyRole("USUARIO")
				.antMatchers("/user").authenticated()
				.anyRequest().permitAll()
				.and()
			.formLogin()
				.loginProcessingUrl("/api/login")
				.successHandler(new ForwardAuthenticationSuccessHandler("/user"))
				.failureHandler(restAuthenticationFailureHandler)
				.usernameParameter("email")
				.passwordParameter("senha")
				.and()
			.logout()
				.logoutUrl("/api/logout")
				.defaultLogoutSuccessHandlerFor(restLogoutSuccessHandler, preferredMatcher)
		;
		// @formatter:on
	}

	@Bean
	public SpeaAuthoritiesPopulator speaAuthoritiesPopulator() {
		SpeaAuthoritiesPopulator speaAuthoritiesPopulator = new SpeaAuthoritiesPopulator(contextSource, "o=mpf");
		speaAuthoritiesPopulator.setSearchSubtree(true);
		speaAuthoritiesPopulator.setGroupSearchFilter("(member={0})");
		speaAuthoritiesPopulator.setGroupRoleAttribute("cn");
		speaAuthoritiesPopulator.setGetUsuarioByEmail(getUsuarioByEmail);
		return speaAuthoritiesPopulator;
	}

	@Bean
	public RoleHierarchy roleHierarchy() {
		RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();

		Map<String, List<String>> roleHierarchyMap = new LinkedHashMap<>();
		roleHierarchyMap.put("ROLE_ADMINISTRADOR", asList("ROLE_GERENTE_ACESSO", "ROLE_USUARIO", "ROLE_EDITOR"));
		roleHierarchyMap.put("ROLE_GERENTE_ACESSO", asList("ROLE_USUARIO"));
		roleHierarchyMap.put("ROLE_EDITOR", asList("ROLE_USUARIO"));
		roleHierarchyMap.put("ROLE_SERVIDOR", asList("ROLE_USUARIO"));
		roleHierarchyMap.put("ROLE_MEMBRO", asList("ROLE_USUARIO"));

		String hierarchyFromMap = RoleHierarchyUtils.roleHierarchyFromMap(roleHierarchyMap);
		roleHierarchy.setHierarchy(hierarchyFromMap);

		return roleHierarchy;
	}

	private List<String> asList(String... a) {
		return Arrays.asList(a);
	}
}
