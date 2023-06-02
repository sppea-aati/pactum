package br.mp.mpf.pgr.pactum.controller;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.cmd.usuario.GetUsuarioLogado;
import br.mp.mpf.pgr.pactum.domain.Usuario;

@RestController
@RequestMapping("/api/user")
public class LoggedUserController {

	@Inject
	private GetUsuarioLogado getUsuarioLogado;

	public static class LoginState {
		public boolean isLogged = false;
		public Usuario usuario;
	}

	@RequestMapping(method = { RequestMethod.GET, RequestMethod.POST }, //
			produces = { MediaType.APPLICATION_JSON_UTF8_VALUE })
	public LoginState getUsuarioLogado(HttpServletRequest request) {
		Usuario usuario = getUsuarioLogado.getOrNull();

		LoginState loginState = new LoginState();
		loginState.isLogged = usuario != null;
		loginState.usuario = usuario;
		return loginState;
	}

}
