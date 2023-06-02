package br.mp.mpf.pgr.pactum.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import br.mp.mpf.pgr.pactum.domain.BaseDados;

@RepositoryRestResource(path = "basesDados", collectionResourceRel = "basesDados")
public interface BaseDadosRepository extends DefaultPagingRepository<BaseDados, Long>, JpaSpecificationExecutor<BaseDados> {

	@PreAuthorize("hasRole('EDITOR')")
	@Override
	void deleteById(Long id);

	// @formatter:off
	@Query(value = " SELECT bd FROM BaseDados bd WHERE "
			+ " LOWER(bd.orgaoOrigem) LIKE LOWER(CONCAT('%', :orgaoOrigem, '%')) "
			+ " and LOWER(bd.nomeBase) LIKE LOWER(CONCAT('%', :nomeBase, '%')) "
			+ " and bd.excluido = :excluido ", 
			countQuery = " SELECT count(*) FROM BaseDados bd WHERE "
			+ " LOWER(bd.orgaoOrigem) LIKE LOWER(CONCAT('%', :orgaoOrigem, '%')) "
			+ " and LOWER(bd.nomeBase) LIKE LOWER(CONCAT('%', :nomeBase, '%')) "
			+ " and bd.excluido = :excluido ")
	// @formatter:on
	Page<BaseDados> findAtivas(Pageable pageable, @Param("orgaoOrigem") String orgaoOrigem, @Param("nomeBase") String nomeBase, @Param("excluido") Boolean excluido);
	
	

}
