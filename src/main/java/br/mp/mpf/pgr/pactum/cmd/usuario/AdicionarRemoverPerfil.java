package br.mp.mpf.pgr.pactum.cmd.usuario;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.PerfilAcesso;
import br.mp.mpf.pgr.pactum.domain.PerfilUsuario;
import br.mp.mpf.pgr.pactum.domain.Usuario;
import br.mp.mpf.pgr.spea.exception.NegocioException;
import br.mp.mpf.pgr.spea.spring.annotation.WritableTransactional;

@Component
public class AdicionarRemoverPerfil {

	private static final Logger log = LoggerFactory.getLogger(AdicionarRemoverPerfil.class);

	@Inject
	private EntityManager entityManager;

	@WritableTransactional
	public void adicionar(long idUsuario, String perfil) {
		modificarPerfil(idUsuario, perfil, true);
	}

	@WritableTransactional
	public void remover(long idUsuario, String perfil) {
		modificarPerfil(idUsuario, perfil, false);
	}

	protected void modificarPerfil(long idUsuario, String perfil, boolean valor) {
		Session session = entityManager.unwrap(Session.class);
		;

		Usuario usuario = session.get(Usuario.class, idUsuario);
		if (usuario == null) {
			throw new NegocioException("Usuário não localizado. ID = " + idUsuario);
		}

		PerfilAcesso perfilAcesso;
		try {
			perfilAcesso = PerfilAcesso.valueOf(perfil);
		} catch (Exception e) {
			throw new NegocioException("Perfil " + perfil + " inválido.", e);
		}

		List<PerfilUsuario> perfis = usuario.getPerfis();
		if (perfis == null) {
			perfis = new ArrayList<>();
			usuario.setPerfis(perfis);
		}
		if (valor) {
			boolean temPerfil = false;
			for (PerfilUsuario perfilUsuario : perfis) {
				if (perfilUsuario.getPerfil() == perfilAcesso) {
					log.warn("Tentativa de adicionar perfil {} já existente ao usuário id {} ({}).", perfil, usuario.getId(),
							usuario.getNome());
					temPerfil = true;
					break;
				}
			}
			if (!temPerfil) {
				PerfilUsuario perfilUsuario = new PerfilUsuario();
				perfilUsuario.setUsuario(usuario);
				perfilUsuario.setPerfil(perfilAcesso);
				perfis.add(perfilUsuario);
				session.save(perfilUsuario);
			}
		} else {
			PerfilUsuario perfiuRemover = null;
			for (PerfilUsuario perfilUsuario : perfis) {
				if (perfilUsuario.getPerfil() == perfilAcesso) {
					perfiuRemover = perfilUsuario;
					break;
				}
			}
			if (perfiuRemover != null) {
				perfis.remove(perfiuRemover);
				session.delete(perfiuRemover);
			} else {
				log.warn("Tentativa de remover perfil {} não existente ao usuário id {} ({})", perfil, usuario.getId(), usuario.getNome());
			}
		}
	}

}
