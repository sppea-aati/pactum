package br.mp.mpf.pgr.pactum.cmd;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.mp.mpf.pgr.pactum.domain.BaseDados;
import br.mp.mpf.pgr.pactum.domain.Convenio;
import br.mp.mpf.pgr.pactum.domain.Email;
import br.mp.mpf.pgr.pactum.domain.QuartzClusterControl;
import br.mp.mpf.pgr.spea.exception.InfraestruturaException;
import br.mp.mpf.pgr.spea.spring.annotation.ReadableTransactional;
import br.mp.mpf.pgr.spea.util.EmailManager;
import br.mp.mpf.pgr.spea.util.VelocityUtil;

@Component
public class EnviarEmail {

	private static final Logger log = LoggerFactory.getLogger(EnviarEmail.class);
	
	private static String contextPath = "http://srv-producao/pactum";

	@Inject
	private GetConveniosAVencer getConveniosAVencer;

	@Inject
	private GetConveniosVencidos getConveniosVencidos;

	@Inject
	private GetBasesDadosAVencer getBasesDadosAVencer;

	@Inject
	private GetBasesDadosVencidos getBasesDadosVencidos;

	@Inject
	private EntityManager entityManager;

	@Inject
	private EmailManager emailManager;

	@Transactional
	public void enviarEmail() {
		enviarEmailConvenio();
		enviarEmailBaseDados();
	}

	@Transactional
	public boolean emailJaEnviado() {
		Session session = entityManager.unwrap(Session.class);
		QuartzClusterControl quartzClusterControl = new QuartzClusterControl();
		quartzClusterControl.setData(LocalDate.now().atStartOfDay());
		try {
			session.save(quartzClusterControl);
			return false;
		} catch (Exception e) {
			log.info("Email já enviado: " + e.getMessage());
			return true;
		}
	}

	@SuppressWarnings("unchecked")
	@ReadableTransactional
	private void enviarEmailBaseDados() {
		log.info("Enviando emails de bases de dados a vencer.");

		List<BaseDados> listaBaseDadosAVencer = this.getBasesDadosAVencer.getBasesDadosAVencer();
		List<BaseDados> listaBaseDadosVencidos = this.getBasesDadosVencidos.getBasesDadosVencidos();

		// String contextPath = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
		
		VelocityUtil velocityUtil = new VelocityUtil();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("listaBaseDadosAVencer", listaBaseDadosAVencer);
		map.put("listaBaseDadosVencidos", listaBaseDadosVencidos);
		map.put("dateFormat", DateTimeFormatter.ofPattern("dd/MM/YYYY"));
		map.put("contextPath", contextPath);

		List<Email> listaEmail = entityManager.unwrap(Session.class).createQuery("from Email where enviarBaseDados = 'S'").list();
		if (listaEmail == null || listaEmail.size() == 0) {
			log.info("Não há emails cadastrados para informações de vencimento de bases de dados.");
			return;
		}
		String[] toList = new String[listaEmail.size()];
		int i = 0;
		for (Email email : listaEmail) {
			toList[i] = email.getEmail();
			i++;
		}

		try {
			String msg = velocityUtil.process(map, "templates/notificacao-basesDados-vencendo.html");
			emailManager.sendHtml("pgr-sppea@pgr.mp.br", toList, "[PACTUM] Vencimento das Bases de Dados", msg, null);
		} catch (IOException e) {
			throw new InfraestruturaException(e);
		}

	}

	@SuppressWarnings("unchecked")
	@ReadableTransactional
	private void enviarEmailConvenio() {
		log.info("Enviando emails de convênios a vencer.");

		List<Convenio> listaConveniosAVencer = this.getConveniosAVencer.getConveniosAVencer();
		List<Convenio> listaConveniosVencidos = this.getConveniosVencidos.getConveniosVencidos();

		VelocityUtil velocityUtil = new VelocityUtil();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("listaConveniosAVencer", listaConveniosAVencer);
		map.put("listaConveniosVencidos", listaConveniosVencidos);
		map.put("dateFormat", DateTimeFormatter.ofPattern("dd/MM/YYYY"));
		map.put("contextPath", contextPath);

		List<Email> listaEmail = entityManager.unwrap(Session.class).createQuery("from Email where enviarConvenio = 'S'").list();
		if (listaEmail == null || listaEmail.size() == 0) {
			log.info("Não há emails cadastrados para informações de vencimento de convênios.");
			return;
		}
		String[] toList = new String[listaEmail.size()];
		int i = 0;
		for (Email email : listaEmail) {
			toList[i] = email.getEmail();
			i++;
		}

		try {
			String msg = velocityUtil.process(map, "templates/notificacao-convenios-vencendo.html");
			emailManager.sendHtml("pgr-sppea@pgr.mp.br", toList, "[PACTUM] Vencimento dos Convênios", msg, null);
		} catch (IOException e) {
			throw new InfraestruturaException(e);
		}

	}

}
