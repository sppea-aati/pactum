package br.mp.mpf.pgr.pactum.cmd;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.Convenio;
import br.mp.mpf.pgr.spea.exception.NegocioException;
import br.mp.mpf.pgr.spea.spring.annotation.WritableTransactional;

@Component
public class InserirConvenio {

	@Inject
	private EntityManager entityManager;

	@WritableTransactional
	public Convenio inserirConvenio(Convenio convenio) {

		Session session = entityManager.unwrap(Session.class);
		String hql = " from Convenio c where c.sigla = :sigla and c.excluido = 'N'";
		Query query = session.createQuery(hql);
		query.setParameter("sigla", convenio.getSigla());
		Convenio c = (Convenio) query.uniqueResult();
		if (c != null) {
			throw new NegocioException("Já existe convênio com a sigla " + c.getSigla()) ;
		}

		session.saveOrUpdate(convenio);

		return convenio;

	}

}
