package br.mp.mpf.pgr.pactum.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.cmd.EnviarEmail;
import br.mp.mpf.pgr.pactum.quartz.EnviaEmailQuartz;

@Component
public class EnviaEmailJob implements Job {
	
	private static final Logger log = LoggerFactory.getLogger(EnviarEmail.class);

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		
		try {
			ApplicationContext applicationContext = (ApplicationContext) context.getScheduler().getContext().get(EnviaEmailQuartz.APPLICATION_CONTEXT_KEY);

			EnviarEmail enviarEmail = applicationContext.getBean(EnviarEmail.class);
			if (enviarEmail.emailJaEnviado()) {
				return;
			}
			enviarEmail.enviarEmail();
		} catch (SchedulerException e) {
			log.error("Erro durante execução dos jobs");
			e.printStackTrace();
		} catch (DataIntegrityViolationException e) {
			log.info("Email já enviado.");
		}
	}

	

}
