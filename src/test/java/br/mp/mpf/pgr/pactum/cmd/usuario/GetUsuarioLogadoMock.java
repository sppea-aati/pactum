package br.mp.mpf.pgr.pactum.cmd.usuario;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.Usuario;

@Component
@Profile({ "dev" })
public class GetUsuarioLogadoMock extends GetUsuarioLogado {

	@Override
	public Usuario get() {
		Usuario usuario = getUsuarioByEmail.get("sa");
		return usuario;
	}
}
