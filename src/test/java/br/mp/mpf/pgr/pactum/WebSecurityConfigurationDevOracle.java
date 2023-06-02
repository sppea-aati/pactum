package br.mp.mpf.pgr.pactum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Profile({ "local-ldap" })
public class WebSecurityConfigurationDevOracle extends AbstractWebSecurityConfiguration {

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		// @formatter:off
		auth
			.ldapAuthentication()
				.contextSource()
					.root("dc=mpf,dc=br")
					.and()
				.userDetailsContextMapper(speaUserDetailsContextMapper)
				.userDnPatterns("uid={0},ou=people")
				.groupSearchBase("ou=groups,ou=pgr")
				.userSearchBase("ou=pgr")
				.userSearchFilter("mail={0}")
				;
		// @formatter:on
	}

}
