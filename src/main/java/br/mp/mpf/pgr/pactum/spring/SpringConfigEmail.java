package br.mp.mpf.pgr.pactum.spring;

import java.util.Properties;

import javax.mail.Session;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("br.mp.mpf")
public class SpringConfigEmail {

	@Bean(name="emailSession")
	public Session emailSession() {
		Properties p = new Properties();
		p.put("mail.host", "srv-smtp");
		p.put("mail.mime.charset", "utf-8");
		p.put("mail.smtp.port", "25");

		Session emailSession = Session.getInstance(p);

		return emailSession;
	}
	
	

}
