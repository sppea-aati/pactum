package br.mp.mpf.pgr.pactum.cmd.usuario;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.Pessoal;
import br.mp.mpf.pgr.spea.spring.annotation.ReadableTransactional;

@Component
public class GetPessoalByMatricula {

	@Inject
	private EntityManager entityManager;

	@ReadableTransactional
	public Pessoal get(Long matricula) {
		String hql = "select p from Pessoal p where matricula = :matricula and desligado = 'NÃO'";
		Session session = entityManager.unwrap(Session.class);
		Query query = session.createQuery(hql);
		query.setLong("matricula", matricula);
		Pessoal pessoal = (Pessoal) query.uniqueResult();
		return pessoal;
	}

}
