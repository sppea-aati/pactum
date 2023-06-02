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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.cmd.usuario.GetPessoalByMatricula;
import br.mp.mpf.pgr.pactum.cmd.usuario.GetPessoalByMatriculaDesligado;
import br.mp.mpf.pgr.pactum.domain.UsuarioConvenio;
import br.mp.mpf.pgr.pactum.repository.UsuarioConvenioRepository;
import br.mp.mpf.pgr.spea.exception.NegocioException;

@RestController
@RequestMapping("/api/usuarioConvenio")
@PreAuthorize("hasRole('USUARIO')")
public class UsuarioConvenioController extends SearchController<UsuarioConvenioRepository> {
    
    @Inject
    private UsuarioConvenioRepository usuarioConvenioRepository;
    
    @Inject
    private GetPessoalByMatriculaDesligado getPessoalByMatriculaDesligado;
    
    @Inject
    private GetPessoalByMatricula getPessoalByMatricula;
    
    @RequestMapping(path = "{matricula}", method = RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('EDITOR')")
    public HttpEntity<UsuarioConvenio> incluirUsuarioConvenio(@PathVariable("matricula") Long matricula) {
        
        if (usuarioConvenioRepository.findByPessoal_Matricula(matricula) != null) {
            throw new NegocioException("O usuário informado já está cadastrado.");
        }
        
        if (getPessoalByMatricula.get(matricula) == null) {
            throw new NegocioException("Matrícula não localizada na base de servidores e membros da SGP.");
        }
        
        if (getPessoalByMatriculaDesligado.get(matricula, "SIM") != null) {
            throw new NegocioException("O usuário não pertence mais ao MPF.");
        }
        
        usuarioConvenioRepository.insertByMatricula(matricula);
        return new ResponseEntity<>(usuarioConvenioRepository.findByPessoal_Matricula(matricula), HttpStatus.OK);
    }
    
    @Override
    UsuarioConvenioRepository getRepository() {
        return usuarioConvenioRepository;
    }
    
    @RequestMapping(value = "/lista", produces = { MediaType.APPLICATION_JSON_VALUE })
	public HttpEntity<PagedModel<EntityModel<UsuarioConvenio>>> lista( //
			@Param("pesquisa") String pesquisa, //
			@Param("filtroCargo") String filtroCargo, //
			Pageable pageable, //
			PagedResourcesAssembler<UsuarioConvenio> assembler //
	) {
		Page<UsuarioConvenio> usuarios = null;
		if (filtroCargo.equals("todos")) {
			usuarios = usuarioConvenioRepository.filtroUsuarios(pageable, pesquisa.toUpperCase());
		} else if (filtroCargo.equals("membro")) {
			usuarios = usuarioConvenioRepository.filtroUsuariosMembro(pageable, pesquisa.toUpperCase());
		} else if (filtroCargo.equals("servidor")) {
			usuarios = usuarioConvenioRepository.filtroUsuariosServidor(pageable, pesquisa.toUpperCase());
		}

		PagedModel<EntityModel<UsuarioConvenio>> pagedResources = assembler.toModel(usuarios);

		return new ResponseEntity<>(pagedResources, HttpStatus.OK);
	}

}
