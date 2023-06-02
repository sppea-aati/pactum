package br.mp.mpf.pgr.pactum.cmd.usuario;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Session;
import org.springframework.stereotype.Component;

import br.mp.mpf.pgr.pactum.domain.PerfilAcesso;
import br.mp.mpf.pgr.pactum.domain.PerfilUsuario;
import br.mp.mpf.pgr.pactum.domain.Pessoal;
import br.mp.mpf.pgr.pactum.domain.Usuario;
import br.mp.mpf.pgr.pactum.to.PessoalTO;
import br.mp.mpf.pgr.spea.exception.NegocioException;
import br.mp.mpf.pgr.spea.spring.annotation.WritableTransactional;

@Component
public class CadastrarNovoUsuario {

	@Inject
	private EntityManager entityManager;

	@Inject
	private AdicionarRemoverPerfil adicionarRemoverPerfil;

	@Inject
	private GetUsuarioByEmail getUsuarioByEmail;

	@Inject
	private GetPessoalByMatricula getPessoalByMatricula;

	@WritableTransactional
	public Usuario cadastrar(String matricula) {
		Pessoal pessoal;
		try {
			pessoal = getPessoalByMatricula.get(Long.parseLong(matricula));
		} catch (NumberFormatException e) {
			throw new NegocioException("Matrícula não localizada na base de pessoal da SGP.");
		}

		if (pessoal == null) {
			throw new NegocioException("Matrícula não localizada na base de pessoal da SGP.");
		}

		return cadastrar(pessoal);
	}

	@WritableTransactional
	public Usuario cadastrar(Pessoal pessoal) {
		if ("SIM".equals(pessoal.getDesligado())) {
			throw new NegocioException("Servidor/Membro está marcado como desligado no cadastro da SGP.");
		}

		verificarUsuarioJaCadastrado(pessoal.getEmail());

		Usuario usuario = new Usuario();
		usuario.setAtivo(true);
		usuario.setEmail(pessoal.getEmail().toLowerCase());
		usuario.setMatricula(String.valueOf(pessoal.getMatricula()));
		usuario.setNome(pessoal.getNome());
		usuario.setCargo(pessoal.getDescricaoCargo());
		usuario.setCodigoCargo(pessoal.getCodigoCargo());
		List<PerfilUsuario> perfis = new ArrayList<>(1);
		PerfilUsuario perfil = new PerfilUsuario();
		perfil.setUsuario(usuario);
		perfil.setPerfil(pessoal.isMembro() ? PerfilAcesso.MEMBRO : PerfilAcesso.SERVIDOR);
		perfis.add(perfil);
		usuario.setPerfis(perfis);

		Session session = entityManager.unwrap(Session.class);
		session.save(usuario);

		return usuario;
	}

	@WritableTransactional
	public Usuario cadastrar(PessoalTO pessoal, String[] perfis) {
		if ("SIM".equals(pessoal.getDesligado())) {
			throw new NegocioException("Servidor/Membro está marcado como desligado no cadastro da SGP.");
		}

		verificarUsuarioJaCadastrado(pessoal.getEmail());

		Usuario usuario = new Usuario();
		usuario.setAtivo(true);
		usuario.setEmail(pessoal.getEmail().toLowerCase());
		usuario.setMatricula(String.valueOf(pessoal.getMatricula()));
		usuario.setNome(pessoal.getNome());
		usuario.setCargo(pessoal.getDescricaoCargo());
		usuario.setCodigoCargo(pessoal.getCodigoCargo());

		Session session = entityManager.unwrap(Session.class);
		session.save(usuario);

		if (perfis != null) {
			for (String perfil : perfis) {
				adicionarRemoverPerfil.adicionar(usuario.getId(), perfil);
			}
			usuario = session.get(Usuario.class, usuario.getId());
		}

		return usuario;
	}

	protected void verificarUsuarioJaCadastrado(String email) {
		Usuario usuarioJaExistente = getUsuarioByEmail.get(email.toLowerCase());

		if (usuarioJaExistente != null) {
			String objeto = usuarioJaExistente.isMembro() ? "Membro" : "Servidor";
			throw new NegocioException(objeto + " já cadastrado.");
		}
	}

}
