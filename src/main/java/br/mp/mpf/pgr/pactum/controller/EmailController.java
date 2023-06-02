package br.mp.mpf.pgr.pactum.controller;

import javax.inject.Inject;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.cmd.EnviarEmail;

@RestController
@RequestMapping("/api/email")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class EmailController {

	@Inject
	private EnviarEmail enviarEmail;

	@RequestMapping(value = "/testeEnvioEmail", produces = { MediaType.APPLICATION_JSON_UTF8_VALUE })
	public String testeEnvioEmail() {
		enviarEmail.enviarEmail();
		return "{\"mensagem\": \"Sucesso\"}";
	}
}
