package br.mp.mpf.pgr.pactum.cmd.usuario;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.Usuario;
import br.mp.mpf.pgr.spea.spring.annotation.ReadableTransactional;

@Component
public class GetUsuarioByEmail {

	@Inject
	private EntityManager entityManager;

	@ReadableTransactional
	public Usuario get(String email) {
		String hql = "select u from Usuario u where email = :email";
		Session session = entityManager.unwrap(Session.class);;
		Query query = session.createQuery(hql);
		query.setString("email", email.toLowerCase());
		Usuario usuario = (Usuario) query.uniqueResult();
		return usuario;
	}
}
