package br.mp.mpf.pgr.pactum.job;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile({ "teste" })
public class EnviaEmailJobMock extends EnviaEmailJob {

	private static final Logger log = LoggerFactory.getLogger(EnviaEmailJobMock.class);

	public void enviarEmail() {
		log.info("Mock envia emails de convênios a vencer.");

	}

}
