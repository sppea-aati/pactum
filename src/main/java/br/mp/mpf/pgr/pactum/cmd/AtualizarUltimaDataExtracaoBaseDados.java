package br.mp.mpf.pgr.pactum.cmd;

import java.io.IOException;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.BaseDados;
import br.mp.mpf.pgr.pactum.domain.CargaBaseDados;
import br.mp.mpf.pgr.spea.spring.annotation.WritableTransactional;

@Component
public class AtualizarUltimaDataExtracaoBaseDados {

	@Inject
	private EntityManager entityManager;

	@WritableTransactional
	public void atualizarUltimaDataExtracaoBaseDados(Long idBaseDados) throws IOException {

		Session session = entityManager.unwrap(Session.class);
		BaseDados baseDados = session.get(BaseDados.class, idBaseDados);
		
		baseDados.setUltimaDataExtracao(null);
		for(CargaBaseDados c : baseDados.getCargas()) {
			if(baseDados.getUltimaDataExtracao() == null) {
				baseDados.setUltimaDataExtracao(c.getDataExtracao());
				continue;
			}
			
			if(baseDados.getUltimaDataExtracao().isBefore(c.getDataExtracao())) {
				baseDados.setUltimaDataExtracao(c.getDataExtracao());
			}
		}
		
		session.saveOrUpdate(baseDados);
		

	}

}
