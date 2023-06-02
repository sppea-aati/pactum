package br.mp.mpf.pgr.pactum.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.domain.projections.AcessoTO;
import br.mp.mpf.pgr.pactum.repository.AcessoRepository;

@RestController
@RequestMapping("/api/acesso")
@PreAuthorize("hasRole('USUARIO')")
public class AcessoController {

	@Inject
	private AcessoRepository acessoRepository;

	@RequestMapping(value = "/acessosPorConvenio", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<PagedModel<EntityModel<AcessoTO>>> acessosPorConvenio( //
			@Param("convenioId") Long convenioId, //
			@Param("pesquisa") String pesquisa, //
			@Param("filtroCargo") String filtroCargo, //
			@Param("filtroCadastrados") String filtroCadastrados, //
			Pageable pageable, //
			PagedResourcesAssembler<AcessoTO> assembler //
	) {
		Page<AcessoTO> acessos = null;
		if (filtroCargo.equals("todos")) {
			acessos = acessoRepository.findAcessosPorConvenio(pageable, convenioId, pesquisa.toUpperCase(), filtroCadastrados);
		} else if (filtroCargo.equals("membro")) {
			acessos = acessoRepository.findAcessosMembroPorConvenio(pageable, convenioId, pesquisa.toUpperCase(), filtroCadastrados);
		} else if (filtroCargo.equals("servidor")) {
			acessos = acessoRepository.findAcessosServidorPorConvenio(pageable, convenioId, pesquisa.toUpperCase(), filtroCadastrados);
		}

		PagedModel<EntityModel<AcessoTO>> pagedResources = assembler.toModel(acessos);

		return new ResponseEntity<>(pagedResources, HttpStatus.OK);
	}

	@RequestMapping(value = "/acessosPorUsuario", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<PagedModel<EntityModel<AcessoTO>>> acessosPorUsuario(
			@Param("idUsuarioConvenio") Long idUsuarioConvenio,
			Pageable pageable,
			PagedResourcesAssembler<AcessoTO> assembler
	) {
		Page<AcessoTO> acessos = acessoRepository.findAcessosPorUsuario(pageable, idUsuarioConvenio);

		PagedModel<EntityModel<AcessoTO>> pagedResources = assembler.toModel(acessos);

		return new ResponseEntity<>(pagedResources, HttpStatus.OK);
	}

	@RequestMapping(value = "/acessosDisponiveisPorUsuario", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<PagedModel<EntityModel<AcessoTO>>> acessosDisponiveisPorUsuario(
			@RequestParam("idUsuarioConvenio") Long idUsuarioConvenio,
            @RequestParam(required = false) String pesquisa,
			Pageable pageable,
			PagedResourcesAssembler<AcessoTO> assembler
	) {
		Page<AcessoTO> acessos = acessoRepository.findAcessosDisponiveisPorUsuario(pageable, idUsuarioConvenio, pesquisa != null ? pesquisa.toUpperCase(): "");

		PagedModel<EntityModel<AcessoTO>> pagedResources = assembler.toModel(acessos);

		return new ResponseEntity<>(pagedResources, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/todosAcessosPorConvenio", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<Iterable<AcessoTO>> todosAcessosPorConvenio( //
			@Param("convenioId") Long convenioId) {
		Iterable<AcessoTO> acessos = acessoRepository.findTodosAcessosPorConvenio(convenioId);

		return new ResponseEntity<>(acessos, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/acessosUsuarioConvenio", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<Iterable<AcessoTO>> acessosUsuarioConvenio( //
			@Param("idUsuario") Long idUsuario, @Param("idConvenio") Long idConvenio) {
		Iterable<AcessoTO> acessos = acessoRepository.findAcessosUsuarioConvenio(idUsuario, idConvenio);

		return new ResponseEntity<>(acessos, HttpStatus.OK);
	}


}
