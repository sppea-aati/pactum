package br.mp.mpf.pgr.pactum.quartz;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;

import org.quartz.CronScheduleBuilder;
import org.quartz.DateBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.job.EnviaEmailJob;

@Component
public class EnviaEmailQuartz {

	private static final Logger log = LoggerFactory.getLogger(EnviaEmailQuartz.class);
	
	public static final String APPLICATION_CONTEXT_KEY = "APPLICATION_CONTEXT_KEY";

	@Inject
	private ApplicationContext context;

	@PostConstruct
	public void init() {
		log.debug("Iniciando quartz...");

		try {
			JobDetail job = newJob(EnviaEmailJob.class) //
					.withIdentity("CronQuartzJob", "Group1") //
					.build();

			Trigger trigger = newTrigger() //
					.withIdentity("emailTrigger", "Group1") //
					.withSchedule(CronScheduleBuilder //
							.weeklyOnDayAndHourAndMinute(DateBuilder.MONDAY, 8, 00)) //
					.forJob(job) //
					.build();
			
			
			/*
			Trigger trigger = newTrigger() //
					.withIdentity("emailTrigger", "Group1") //
					.withSchedule(CronScheduleBuilder //
							.cronSchedule("* * * * * ?")) //
					.forJob(job) //
					.build();
			*/

			Scheduler sched = StdSchedulerFactory.getDefaultScheduler();
			sched.getContext().put(APPLICATION_CONTEXT_KEY, context);
			sched.scheduleJob(job, trigger);
			sched.startDelayed(10);

		} catch (SchedulerException e) {
			log.debug("Erro ao agendar envio de email", e);
		}
	}

	@PreDestroy
	public void tearDown() {
		try {
			log.debug("Parando Quartz...");
			Scheduler sched = StdSchedulerFactory.getDefaultScheduler();
			sched.shutdown();
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
	}
}
