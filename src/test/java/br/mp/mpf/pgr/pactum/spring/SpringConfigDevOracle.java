package br.mp.mpf.pgr.pactum.spring;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import oracle.jdbc.OracleDriver;

@Configuration
@Profile({ "dev-oracle" })
public class SpringConfigDevOracle {

	@Bean
	public DataSource dataSource() {

		BasicDataSource dataSource = new BasicDataSource();
		dataSource.setDriverClassName(OracleDriver.class.getName());
		dataSource.setUrl("jdbc:oracle:thin:@//bd-server:1521/service-name");
		dataSource.setUsername("user");
		dataSource.setPassword("passwd");

		return dataSource;
	}

}
