package br.mp.mpf.pgr.pactum.cmd;

import java.io.IOException;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.Anexo;
import br.mp.mpf.pgr.pactum.domain.CargaBaseDados;
import br.mp.mpf.pgr.spea.spring.annotation.WritableTransactional;

@Component
public class AtualizarCarga {

	@Inject
	private EntityManager entityManager;

	@WritableTransactional
	public Anexo atualizarCarga(Long idCarga, Anexo anexo) throws IOException {

		Session session = entityManager.unwrap(Session.class);
		CargaBaseDados carga = session.get(CargaBaseDados.class, idCarga);
		carga.setAnexo(anexo);
		session.saveOrUpdate(carga);
		
		return anexo;

	}

}
