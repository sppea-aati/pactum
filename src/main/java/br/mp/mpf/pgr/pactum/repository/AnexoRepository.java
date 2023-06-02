package br.mp.mpf.pgr.pactum.repository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import br.mp.mpf.pgr.pactum.domain.Anexo;

@RepositoryRestResource(path = "anexos", collectionResourceRel = "anexos")
public interface AnexoRepository extends DefaultCrudRepository<Anexo, Long> {

	@PreAuthorize("hasRole('EDITOR')")
	@Override
	void deleteById(Long id);

}
