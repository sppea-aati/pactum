package br.mp.mpf.pgr.pactum.controller;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.mp.mpf.pgr.pactum.cmd.usuario.AdicionarRemoverPerfil;
import br.mp.mpf.pgr.pactum.domain.PerfilAcesso;

@RestController
@RequestMapping("/api/controleAcesso")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class ControleAcessoController {
	
	@Inject
	private AdicionarRemoverPerfil adicionarRemoverPerfil;

	@RequestMapping(path = "/perfis", method = RequestMethod.GET, produces = { MediaType.ALL_VALUE })
	public List<String> getPerfis() {
		List<String> retorno = new ArrayList<String>();
		PerfilAcesso[] perfis = PerfilAcesso.values();
		for(PerfilAcesso p: perfis) {
			retorno.add(p.toString());
		}
		return retorno;
	}
	
	@RequestMapping(path = "/{id}/{role}", method = RequestMethod.DELETE)
	public ResponseEntity<String> delete(@PathVariable("id") long id, @PathVariable("role") PerfilAcesso role) {
		adicionarRemoverPerfil.remover(id, role.toString());
		return ResponseEntity.status(HttpStatus.OK).body("{\"mensagem\": \"Sucesso\"}");
	}
	
	@RequestMapping(path = "/{id}/{role}", method = RequestMethod.POST)
	public ResponseEntity<String> post(@PathVariable("id") long id, @PathVariable("role") PerfilAcesso role) {
		adicionarRemoverPerfil.adicionar(id, role.toString());
		return ResponseEntity.status(HttpStatus.OK).body("{\"mensagem\": \"Sucesso\"}");
	}

}
