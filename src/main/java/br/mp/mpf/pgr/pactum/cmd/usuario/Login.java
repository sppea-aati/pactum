package br.mp.mpf.pgr.pactum.cmd.usuario;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.Pessoal;
import br.mp.mpf.pgr.pactum.domain.Usuario;
import br.mp.mpf.pgr.spea.spring.annotation.WritableTransactional;

@Component
public class Login {

	private static final Logger log = LoggerFactory.getLogger(Login.class);

	@Inject
	private GetUsuarioByEmail getUsuarioByEmail;

	@Inject
	private GetPessoalByEmail getPessoalByEmail;

	@Inject
	private GetPessoalByMatricula getPessoalByMatricula;

	@Inject
	private EntityManager entityManager;

	@WritableTransactional
	public Usuario login(String email) {
		log.debug("Iniciando login usuário '{}'", email);

		Usuario usuario = getUsuarioByEmail.get(email);

		if (usuario == null) {
			log.debug("Usuário '{}' não cadastrado no sistema.", email);
		} else {
			log.debug("Usuário '{}' localizado no sistema. Id: {}", email, usuario.getId());
		}

		log.debug("Procurando usuário '{}' na tabela de pessoal...", email);
		Pessoal pessoal = getPessoal(usuario, email);

		log.debug("Usuário '{}' localizado na tabela pessoal. Matrícula: {}", email, pessoal.getMatricula());

		if (usuario == null) {
			throw new UsernameNotFoundException("Usuário não possui acesso ao sistema.");
		} else {
			if (!usuario.isAtivo()) {
				throw new DisabledException("O cadastro do usuário está desativado no sistema.");
			}
		}

		merge(usuario, pessoal);

		Session session = entityManager.unwrap(Session.class);

		session.flush();
		session.evict(usuario);

		return usuario;
	}

	protected Pessoal getPessoal(Usuario usuario, String email) {
		Pessoal pessoal;
		if (usuario == null) {
			pessoal = getPessoalByEmail.get(email);
			if (pessoal == null) {
				throw new InternalAuthenticationServiceException("E-mail não localizado na base de servidores e membros da SGP.");
			}
		} else {
			pessoal = getPessoalByMatricula.get(Long.valueOf(usuario.getMatricula()));
			if (pessoal == null) {
				throw new InternalAuthenticationServiceException("Matrícula não localizada na base de servidores e membros da SGP.");
			}
		}
		return pessoal;
	}

	protected void merge(Usuario usuario, Pessoal pessoal) {
		Session session = entityManager.unwrap(Session.class);
		if (usuario.getCargo() == null) {
			usuario.setCargo(pessoal.getDescricaoCargo());
		} else if (!usuario.getCargo().equals(pessoal.getDescricaoCargo())) {
			usuario.setCargo(pessoal.getDescricaoCargo());
		}
		if (usuario.getCodigoCargo() == null) {
			usuario.setCodigoCargo(pessoal.getCodigoCargo());
		} else if (!usuario.getCodigoCargo().equals(pessoal.getCodigoCargo())) {
			usuario.setCodigoCargo(pessoal.getCodigoCargo());
		}
		session.update(usuario);
	}
}
