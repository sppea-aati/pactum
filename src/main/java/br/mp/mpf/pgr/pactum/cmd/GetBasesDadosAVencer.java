package br.mp.mpf.pgr.pactum.cmd;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.BaseDados;
import br.mp.mpf.pgr.spea.spring.annotation.ReadableTransactional;

@Component
public class GetBasesDadosAVencer {

	@Inject
	private EntityManager entityManager;
	
	@SuppressWarnings("unchecked")
	@ReadableTransactional
	public List<BaseDados> getBasesDadosAVencer() {
		Session session = entityManager.unwrap(Session.class);
		
		String hql = " select bd from BaseDados bd where "
				+ " (bd.avisoVencimento = 'S' AND bd.excluido = 'N') AND "
				+ "("
				+ " ( ADD_MONTHS(bd.ultimaDataExtracao, 1)  <= :dataLimite and ADD_MONTHS(bd.ultimaDataExtracao, 1)  >= :dataAtual and bd.periodicidade = 'MENSAL') OR "
				+ " ( ADD_MONTHS(bd.ultimaDataExtracao, 2)  <= :dataLimite and ADD_MONTHS(bd.ultimaDataExtracao, 2)  >= :dataAtual and bd.periodicidade = 'BIMESTRAL') OR "
				+ " ( ADD_MONTHS(bd.ultimaDataExtracao, 3)  <= :dataLimite and ADD_MONTHS(bd.ultimaDataExtracao, 3)  >= :dataAtual and bd.periodicidade = 'TRIMESTRAL') OR "
				+ " ( ADD_MONTHS(bd.ultimaDataExtracao, 6)  <= :dataLimite and ADD_MONTHS(bd.ultimaDataExtracao, 6)  >= :dataAtual and bd.periodicidade = 'SEMESTRAL') OR "
				+ " ( ADD_MONTHS(bd.ultimaDataExtracao, 12) <= :dataLimite and ADD_MONTHS(bd.ultimaDataExtracao, 12) >= :dataAtual and bd.periodicidade = 'ANUAL') "
				+ ")"
				+ " order by bd.ultimaDataExtracao asc";
		Query query = session.createQuery(hql);
		
		
		query.setParameter("dataLimite", Date.from(LocalDate.now().plusDays(90).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
		query.setParameter("dataAtual", Date.from(LocalDate.now().atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
		
		List<BaseDados> list = query.list();

		return list;
	}

}
