package br.mp.mpf.pgr.pactum;

import org.springframework.boot.builder.SpringApplicationBuilder;

public class ConveniosApplicationDev {

	public static void main(String[] args) {
		// @formatter:off
		new SpringApplicationBuilder()
			.sources(ConveniosApplication.class)
			.profiles("local-ldap")
			.run(args);
		// @formatter:on
	}
}
