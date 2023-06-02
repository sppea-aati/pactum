package br.mp.mpf.pgr.pactum;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import br.mp.mpf.pgr.pactum.domain.Acesso;
import br.mp.mpf.pgr.pactum.domain.Anexo;
import br.mp.mpf.pgr.pactum.domain.BaseDados;
import br.mp.mpf.pgr.pactum.domain.CargaBaseDados;
import br.mp.mpf.pgr.pactum.domain.Convenio;
import br.mp.mpf.pgr.pactum.domain.Email;
import br.mp.mpf.pgr.pactum.domain.Pessoal;
import br.mp.mpf.pgr.pactum.domain.Usuario;
import br.mp.mpf.pgr.pactum.domain.UsuarioConvenio;

@Configuration
public class ExposeEntityIdRestConfiguration extends RepositoryRestConfigurerAdapter {

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		config.exposeIdsFor(Email.class, UsuarioConvenio.class, Convenio.class, Pessoal.class, Usuario.class, Acesso.class, Anexo.class, BaseDados.class, CargaBaseDados.class);
	}

}