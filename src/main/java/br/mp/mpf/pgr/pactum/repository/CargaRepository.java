package br.mp.mpf.pgr.pactum.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import br.mp.mpf.pgr.pactum.domain.CargaBaseDados;

@RepositoryRestResource(path = "cargasBaseDados", collectionResourceRel = "cargasBaseDados")
public interface CargaRepository extends DefaultPagingRepository<CargaBaseDados, Long>, JpaSpecificationExecutor<CargaBaseDados> {

	@PreAuthorize("hasRole('EDITOR')")
	@Override
	void deleteById(Long id);
	
	Page<CargaBaseDados> findByBaseDados_Id(Pageable pageable, @Param("Id") Long id);
	

}
