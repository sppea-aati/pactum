package br.mp.mpf.pgr.pactum.security;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.security.SecureRandom;

import javax.net.SocketFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;

import br.mp.mpf.pgr.spea.exception.InfraestruturaException;

public class TrustAllSocketFactory extends SocketFactory {

	public static final int LDAP_SECURE_PORT = 636;

	public static final int LDAP_INSECURE_PORT = 389;

	private SocketFactory sslSocketFactory;

	private SocketFactory nosslSocketFactory;

	public TrustAllSocketFactory() {

		TrustManager[] trustManager = new TrustManager[] { new TrustAllTrustManager() };

		try {
			SSLContext context = SSLContext.getInstance("SSL");
			context.init(null, trustManager, new SecureRandom());
			this.sslSocketFactory = context.getSocketFactory();
		} catch (Exception e) {
			throw new InfraestruturaException("Erro ao inicializar TrustManager ao conectar com LDAP.");
		}

		this.nosslSocketFactory = SocketFactory.getDefault();
	}

	public static SocketFactory getDefault() {
		return new TrustAllSocketFactory();
	}

	@Override
	public Socket createSocket(String host, int port) throws IOException, UnknownHostException {
		if (port == LDAP_INSECURE_PORT) {
			return this.nosslSocketFactory.createSocket(host, port);
		}
		return this.sslSocketFactory.createSocket(host, port);
	}

	@Override
	public Socket createSocket(InetAddress host, int port) throws IOException {
		if (port == LDAP_INSECURE_PORT) {
			return this.nosslSocketFactory.createSocket(host, port);
		}
		return this.sslSocketFactory.createSocket(host, port);
	}

	@Override
	public Socket createSocket(String host, int port, InetAddress localHost, int localPort) throws IOException, UnknownHostException {
		if (port == LDAP_INSECURE_PORT) {
			return this.nosslSocketFactory.createSocket(host, port, localHost, localPort);
		}
		return this.sslSocketFactory.createSocket(host, port, localHost, localPort);
	}

	@Override
	public Socket createSocket(InetAddress address, int port, InetAddress localAddress, int localPort) throws IOException {
		if (port == LDAP_INSECURE_PORT) {
			return this.nosslSocketFactory.createSocket(address, port, localAddress, localPort);
		}
		return this.sslSocketFactory.createSocket(address, port, localAddress, localPort);
	}

}
