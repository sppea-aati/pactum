package br.mp.mpf.pgr.pactum.cmd;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.sql.Blob;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import br.mp.mpf.pgr.pactum.domain.Anexo;
import br.mp.mpf.pgr.pactum.domain.BaseDados;
import br.mp.mpf.pgr.pactum.domain.Convenio;
import br.mp.mpf.pgr.pactum.domain.TipoAnexo;
import br.mp.mpf.pgr.pactum.domain.UsuarioConvenio;
import br.mp.mpf.pgr.spea.spring.annotation.WritableTransactional;

@Component
public class SalvarAnexo {

	@Inject
	private EntityManager entityManager;

	@WritableTransactional
	public Anexo salvarAnexo(MultipartFile arquivo, Long id, TipoAnexo tipoAnexo) throws IOException {

		Session session = entityManager.unwrap(Session.class);

		ByteArrayInputStream inputStream;
		inputStream = new ByteArrayInputStream(arquivo.getBytes());
		Blob blob = Hibernate.getLobCreator(session).createBlob(inputStream, arquivo.getSize());

		String mimeType = URLConnection.guessContentTypeFromName(arquivo.getOriginalFilename());
		if (mimeType == null) {
			mimeType = "application/octet-stream";
		}

		Anexo anexo = new Anexo();
		anexo.setAnexo(blob);
		anexo.setNomeArquivo(arquivo.getOriginalFilename());
		anexo.setTamanho(arquivo.getSize());
		anexo.setMimeType(mimeType);
		if (tipoAnexo == TipoAnexo.CONVENIO) {
			anexo.setConvenio(new Convenio());
			anexo.getConvenio().setId(id);
		} else if (tipoAnexo == TipoAnexo.USUARIO) {
			anexo.setUsuarioConvenio(new UsuarioConvenio());
			anexo.getUsuarioConvenio().setId(id);
		} else if (tipoAnexo == TipoAnexo.BASE_DADOS) {
			anexo.setBaseDados(new BaseDados());
			anexo.getBaseDados().setId(id);
		}
		session.saveOrUpdate(anexo);
		
		return anexo;

	}

}
