package br.mp.mpf.pgr.pactum.controller;

import javax.inject.Inject;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.cmd.usuario.CadastrarNovoUsuario;
import br.mp.mpf.pgr.pactum.to.RestReturn;
import br.mp.mpf.pgr.spea.exception.NegocioException;

@RestController
@RequestMapping("/api/usuario")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioController {

	@Inject
	private CadastrarNovoUsuario cadastrarNovoUsuario;

	@RequestMapping(path = "novo/{matricula}", method = RequestMethod.GET, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public String novo(@PathVariable("matricula") String matricula) {
		cadastrarNovoUsuario.cadastrar(matricula);
		return "{\"mensagem\":\"Cadastro realizado com sucesso.\"}";
	}

	@ExceptionHandler(NegocioException.class)
	public RestReturn handleIOException(NegocioException ex) {
		RestReturn r = new RestReturn();
		r.setError(ex.getMessage());
		return r;
	}

}
