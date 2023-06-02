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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.cmd.InserirConvenio;
import br.mp.mpf.pgr.pactum.domain.Convenio;
import br.mp.mpf.pgr.pactum.repository.ConvenioRepository;
import br.mp.mpf.pgr.spea.exception.NegocioException;

@RestController
@RequestMapping("/api/convenios")
@PreAuthorize("hasRole('USUARIO')")
public class ConvenioController extends SearchController<ConvenioRepository> {

	@Inject
	private ConvenioRepository convenioRepository;
	
	@Inject
	private InserirConvenio inserirConvenio;

	@RequestMapping(value = "/lista", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<PagedModel<EntityModel<Convenio>>> lista( //
			@Param("descricao") String descricao, //
			@Param("sigla") String sigla, //
			@Param("excluido") String excluido, //
			@Param("diasAteVencimento") Long diasAteVencimento, //
			Pageable pageable, //
			PagedResourcesAssembler<Convenio> assembler //
	) {
		Page<Convenio> convenios;
		if (diasAteVencimento < 0) {
			convenios = convenioRepository.findAtivos(pageable, descricao, sigla, (excluido == "S"));
		} else {
			convenios = convenioRepository.findAtivos(pageable, descricao, sigla, diasAteVencimento.doubleValue(), (excluido == "S"));
		}

		PagedModel<EntityModel<Convenio>> pagedResources = assembler.toModel(convenios);

		return new ResponseEntity<>(pagedResources, HttpStatus.OK);
	}
	
	@RequestMapping(method = { RequestMethod.POST })
	public ResponseEntity<Object> inserirConvenio(@RequestBody Convenio convenio) {
		try {
		inserirConvenio.inserirConvenio(convenio);
		return new ResponseEntity<>(convenio, HttpStatus.OK);
		} catch (NegocioException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
			
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	ConvenioRepository getRepository() {
		return convenioRepository;
	}

}
