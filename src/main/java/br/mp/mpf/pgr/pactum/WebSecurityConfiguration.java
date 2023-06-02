package br.mp.mpf.pgr.pactum;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;

import br.mp.mpf.pgr.pactum.AbstractWebSecurityConfiguration;
import br.mp.mpf.pgr.pactum.security.SpeaAuthoritiesPopulator;
import br.mp.mpf.pgr.pactum.security.SpeaUserDetailsContextMapper;
import br.mp.mpf.pgr.pactum.security.TrustAllSocketFactory;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Profile({ "prod", "dev-oracle" })
public class WebSecurityConfiguration extends AbstractWebSecurityConfiguration {

	@Autowired
	private DefaultSpringSecurityContextSource contextSource;

	@Autowired
	private SpeaAuthoritiesPopulator speaAuthoritiesPopulator;

	@Autowired
	protected SpeaUserDetailsContextMapper speaUserDetailsContextMapper;

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		// @formatter:off
		auth
			.ldapAuthentication()
				.contextSource(contextSource)
				.userDetailsContextMapper(speaUserDetailsContextMapper)
				.ldapAuthoritiesPopulator(speaAuthoritiesPopulator)
				.groupSearchBase("o=mpf")
				.userSearchBase("o=mpf")
				.userSearchFilter("(&(objectClass=Person)(mail={0}))");
		// @formatter:on
	}

	@Bean
	@Order(Ordered.LOWEST_PRECEDENCE)
	public DefaultSpringSecurityContextSource getContextSource() {
		String url = "ldaps://srv-ldap";

		Map<String, Object> baseEnvironmentProperties = new HashMap<>();
		baseEnvironmentProperties.put("java.naming.ldap.factory.socket", TrustAllSocketFactory.class.getName());

		DefaultSpringSecurityContextSource contextSource = new DefaultSpringSecurityContextSource(url);
		contextSource.setBaseEnvironmentProperties(baseEnvironmentProperties);

		return contextSource;
	}


}
