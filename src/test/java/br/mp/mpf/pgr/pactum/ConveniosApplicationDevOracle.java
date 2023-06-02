package br.mp.mpf.pgr.pactum;

import org.springframework.boot.builder.SpringApplicationBuilder;

public class ConveniosApplicationDevOracle {

	public static void main(String[] args) {
		// @formatter:off
		new SpringApplicationBuilder()
			.sources(ConveniosApplication.class)
			.profiles("dev-oracle")
			.run(args);
		// @formatter:on
	}
}
