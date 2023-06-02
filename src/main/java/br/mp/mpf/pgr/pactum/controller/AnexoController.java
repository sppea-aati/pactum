package br.mp.mpf.pgr.pactum.controller;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.mp.mpf.pgr.pactum.cmd.AtualizarCarga;
import br.mp.mpf.pgr.pactum.cmd.DownloadAnexo;
import br.mp.mpf.pgr.pactum.cmd.SalvarAnexo;
import br.mp.mpf.pgr.pactum.domain.Anexo;
import br.mp.mpf.pgr.pactum.domain.TipoAnexo;

@RestController
@RequestMapping("/api/anexo")
public class AnexoController {

	@Inject
	private SalvarAnexo salvarAnexo;

	@Inject
	private DownloadAnexo downloadAnexo;
	
	@Inject
	private AtualizarCarga atualizarCarga;

	@PreAuthorize("hasRole('EDITOR')")
	@RequestMapping(value = "/convenio", method = RequestMethod.POST)
	public ResponseEntity<String> salvarAnexoConvenio(@RequestParam("file") MultipartFile arquivo, @Param("convenioId") Long convenioId) {
		try {
			salvarAnexo.salvarAnexo(arquivo, convenioId, TipoAnexo.CONVENIO);
			return ResponseEntity.status(HttpStatus.OK).body("{\"mensagem\": \"Sucesso\"}");
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"mensagem\": \"" + e.getMessage() + "\"}");
		}
	}

	@PreAuthorize("hasRole('USUARIO')")
	@ResponseBody
	@RequestMapping(path = "/convenio/{id}", method = RequestMethod.GET)
	public void getAnexoConvenio(HttpServletResponse response, @PathVariable("id") long idAnexo) {

		try {
			downloadAnexo.downloadAnexo(response, idAnexo);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	@PreAuthorize("hasRole('EDITOR')")
	@RequestMapping(value = "/usuarioConvenio", method = RequestMethod.POST)
	public ResponseEntity<String> salvarAnexoUsuarioConvenio(@RequestParam("file") MultipartFile arquivo, @Param("usuarioId") Long usuarioId) {
		try {
			salvarAnexo.salvarAnexo(arquivo, usuarioId, TipoAnexo.USUARIO);
			return ResponseEntity.status(HttpStatus.OK).body("{\"mensagem\": \"Sucesso\"}");
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"mensagem\": \"" + e.getMessage() + "\"}");
		}
	}

	@PreAuthorize("hasRole('USUARIO')")
	@ResponseBody
	@RequestMapping(path = "/usuarioConvenio/{id}", method = RequestMethod.GET)
	public void getAnexoUsuarioConvenio(HttpServletResponse response, @PathVariable("id") long idAnexo) {

		try {
			downloadAnexo.downloadAnexo(response, idAnexo);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	@PreAuthorize("hasRole('EDITOR')")
	@RequestMapping(value = "/baseDados", method = RequestMethod.POST)
	public ResponseEntity<String> salvarAnexoBaseDados(@RequestParam("file") MultipartFile arquivo, @Param("baseDadosId") Long baseDadosId) {
		try {
			salvarAnexo.salvarAnexo(arquivo, baseDadosId, TipoAnexo.BASE_DADOS);
			return ResponseEntity.status(HttpStatus.OK).body("{\"mensagem\": \"Sucesso\"}");
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"mensagem\": \"" + e.getMessage() + "\"}");
		}
	}

	@PreAuthorize("hasRole('USUARIO')")
	@ResponseBody
	@RequestMapping(path = "/baseDados/{id}", method = RequestMethod.GET)
	public void getAnexoBaseDados(HttpServletResponse response, @PathVariable("id") long idAnexo) {

		try {
			downloadAnexo.downloadAnexo(response, idAnexo);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	@PreAuthorize("hasRole('EDITOR')")
	@RequestMapping(value = "/carga", method = RequestMethod.POST)
	public ResponseEntity<String> salvarAnexoCarga(@RequestParam("file") MultipartFile arquivo, @Param("cargaId") Long cargaId) {
		try {
			Anexo anexo = salvarAnexo.salvarAnexo(arquivo, 0L, TipoAnexo.CARGA);
			atualizarCarga.atualizarCarga(cargaId, anexo);
			return ResponseEntity.status(HttpStatus.OK).body("{\"mensagem\": \"Sucesso\"}");
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"mensagem\": \"" + e.getMessage() + "\"}");
		}
	}

	@PreAuthorize("hasRole('USUARIO')")
	@ResponseBody
	@RequestMapping(path = "/carga/{id}", method = RequestMethod.GET)
	public void getAnexoCarga(HttpServletResponse response, @PathVariable("id") long idAnexo) {

		try {
			downloadAnexo.downloadAnexo(response, idAnexo);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
