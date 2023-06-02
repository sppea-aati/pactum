package br.mp.mpf.pgr.pactum.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.mp.mpf.pgr.pactum.domain.Convenio;

public interface ConvenioRepository extends DefaultPagingRepository<Convenio, Long>, JpaSpecificationExecutor<Convenio> {
	Page<Convenio> findByDescricaoIgnoreCaseContainingOrSiglaIgnoreCaseContaining(Pageable pageable, @Param("descricao") String descricao, @Param("sigla") String sigla);
  
    // @formatter:off
	@Query(value = "      SELECT c " +
	               "      FROM Convenio c " +
	               "      WHERE c.dataFimVigencia BETWEEN TO_DATE(:data1, 'DD-MM-YYYY') AND TO_DATE(:data2, 'DD-MM-YYYY') ",
	       countQuery = "      SELECT count(*) " +
	               "           FROM Convenio c " +
	               "           WHERE c.dataFimVigencia BETWEEN TO_DATE(:data1, 'DD-MM-YYYY') AND TO_DATE(:data2, 'DD-MM-YYYY')")
    // @formatter:on
	Page<Convenio> findBetweenDataFimVigencia(Pageable pageable, @Param("data1") String data1, @Param("data2") String data2);
	
	// @formatter:off
	@Query(value = " SELECT c FROM Convenio c WHERE "
			+ " LOWER(c.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) AND "
			+ " LOWER(c.sigla) LIKE LOWER(CONCAT('%', :sigla, '%')) AND "
			+ " c.dataFimVigencia < sysdate + :diasAteVencimento AND "
			+ " c.excluido = :excluido ", 
			countQuery = " SELECT count(*) FROM Convenio c "
					+ " WHERE LOWER(c.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) AND LOWER(c.sigla) LIKE LOWER(CONCAT('%', :sigla, '%')) AND c.dataFimVigencia < sysdate + :diasAteVencimento AND c.excluido = :excluido ")
	// @formatter:on
	Page<Convenio> findAtivos(Pageable pageable, @Param("descricao") String descricao, @Param("sigla") String sigla, @Param("diasAteVencimento") Double diasAteVencimento, @Param("excluido") Boolean excluido);
	
	// @formatter:off
	@Query(value = " SELECT c FROM Convenio c WHERE "
			+ " LOWER(c.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) AND "
			+ " LOWER(c.sigla) LIKE LOWER(CONCAT('%', :sigla, '%')) AND "
			+ " c.excluido = :excluido ", 
			countQuery = " SELECT count(*) FROM Convenio c "
					+ " WHERE LOWER(c.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) AND LOWER(c.sigla) LIKE LOWER(CONCAT('%', :sigla, '%')) AND c.excluido = :excluido ")
	// @formatter:on
	Page<Convenio> findAtivos(Pageable pageable, @Param("descricao") String descricao, @Param("sigla") String sigla, @Param("excluido") Boolean excluido);
	
	// Mesma coisa que findAll sem paginação
	Iterable<Convenio> findBy();
}
