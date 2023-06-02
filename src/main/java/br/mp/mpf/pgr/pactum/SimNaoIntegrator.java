package br.mp.mpf.pgr.pactum;

import org.hibernate.boot.SessionFactoryBuilder;
import org.hibernate.boot.spi.MetadataImplementor;
import org.hibernate.boot.spi.SessionFactoryBuilderFactory;
import org.hibernate.boot.spi.SessionFactoryBuilderImplementor;

import br.mp.mpf.pgr.spea.hibernate.SimNaoType;

public class SimNaoIntegrator implements SessionFactoryBuilderFactory {

	@Override
	public SessionFactoryBuilder getSessionFactoryBuilder(MetadataImplementor metadata, SessionFactoryBuilderImplementor defaultBuilder) {
		metadata.getTypeResolver().registerTypeOverride(new SimNaoType());
		return defaultBuilder;
	}

}
