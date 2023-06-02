package br.mp.mpf.pgr.pactum.cmd;

import java.io.IOException;
import java.sql.SQLException;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import br.mp.mpf.pgr.pactum.domain.Anexo;
import br.mp.mpf.pgr.spea.spring.annotation.ReadableTransactional;

@Component
public class DownloadAnexo {

	@Inject
	private EntityManager entityManager;

	@ReadableTransactional
	public void downloadAnexo(HttpServletResponse response, Long idAnexo) throws IOException, SQLException {

		Session session = entityManager.unwrap(Session.class);
		Anexo anexo = session.get(Anexo.class, idAnexo);
		
		response.setContentType(anexo.getMimeType());
		response.setContentLength(anexo.getTamanho().intValue());
		
		
		response.setHeader("Content-Disposition", String.format("inline; filename=\"" + anexo.getNomeArquivo() +"\""));
		//response.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\"", file.getName()));
		
		FileCopyUtils.copy(anexo.getAnexo().getBinaryStream(), response.getOutputStream());
		
		
		
	}

}
