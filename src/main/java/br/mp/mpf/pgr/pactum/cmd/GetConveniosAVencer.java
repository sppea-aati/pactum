package br.mp.mpf.pgr.pactum.cmd;

import java.time.LocalDate;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.Convenio;
import br.mp.mpf.pgr.spea.spring.annotation.ReadableTransactional;

@Component
public class GetConveniosAVencer {

	@Inject
	private EntityManager entityManager;

	@SuppressWarnings("unchecked")
	@ReadableTransactional
	public List<Convenio> getConveniosAVencer() {

		Session session = entityManager.unwrap(Session.class);
		
		String hql = " select c from Convenio c where "
				+ " c.excluido = 'N' and c.dataFimVigencia <= :dataLimite and c.dataFimVigencia >= :dataAtual "
				+ " order by c.dataFimVigencia asc";
		Query query = session.createQuery(hql);
		query.setParameter("dataLimite", LocalDate.now().plusDays(180).atStartOfDay());
		query.setParameter("dataAtual", LocalDate.now().atStartOfDay());

		List<Convenio> list = query.list();

		return list;
	}

}
