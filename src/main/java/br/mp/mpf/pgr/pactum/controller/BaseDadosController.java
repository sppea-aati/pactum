package br.mp.mpf.pgr.pactum.controller;

import java.io.IOException;

import javax.inject.Inject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.cmd.AtualizarCarga;
import br.mp.mpf.pgr.pactum.cmd.AtualizarUltimaDataExtracaoBaseDados;
import br.mp.mpf.pgr.pactum.domain.BaseDados;
import br.mp.mpf.pgr.pactum.repository.BaseDadosRepository;

@RestController
@RequestMapping("/api/basesDados")
@PreAuthorize("hasRole('USUARIO')")
public class BaseDadosController extends SearchController<BaseDadosRepository> {

	@Inject
	private BaseDadosRepository baseDadosRepository;

	@Inject
	private AtualizarCarga atualizarCarga;

	@Inject
	private AtualizarUltimaDataExtracaoBaseDados atualizarUltimaDataExtracaoBaseDados;

	@RequestMapping(value = "/lista", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<PagedModel<EntityModel<BaseDados>>> lista( //
			@Param("orgaoOrigem") String orgaoOrigem, //
			@Param("nomeBase") String nomeBase, //
			@Param("excluido") String excluido, //
			Pageable pageable, //
			PagedResourcesAssembler<BaseDados> assembler //
	) {

		Page<BaseDados> basesDados = baseDadosRepository.findAtivas(pageable, orgaoOrigem, nomeBase, (excluido == "S"));
		PagedModel<EntityModel<BaseDados>> pagedResources = assembler.toModel(basesDados);

		return new ResponseEntity<>(pagedResources, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('EDITOR')")
	@RequestMapping(value = "/removerAnexoCarga", method = RequestMethod.GET)
	public void removerAnexoCarga(@Param("cargaId") Long cargaId) {
		try {
			atualizarCarga.atualizarCarga(cargaId, null);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@PreAuthorize("hasRole('EDITOR')")
	@RequestMapping(value = "/atualizarUltimaDataExtracaoBD", method = RequestMethod.GET)
	public void atualizarUltimaDataExtracaoBD(@Param("baseDadosId") Long baseDadosId) {
		try {
			atualizarUltimaDataExtracaoBaseDados.atualizarUltimaDataExtracaoBaseDados(baseDadosId);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	BaseDadosRepository getRepository() {
		return baseDadosRepository;
	}

}
