package br.mp.mpf.pgr.pactum.cmd;

import javax.inject.Inject;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("dev")
public class EnviarEmailTest {

	@Inject
	private EnviarEmail enviarEmail;

	@Test
	public void test() {

		enviarEmail.enviarEmail();

	}
}
