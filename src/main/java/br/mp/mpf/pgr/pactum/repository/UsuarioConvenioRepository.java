package br.mp.mpf.pgr.pactum.repository;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.mp.mpf.pgr.pactum.domain.UsuarioConvenio;

public interface UsuarioConvenioRepository extends DefaultPagingRepository<UsuarioConvenio, Long>, JpaSpecificationExecutor<UsuarioConvenio>  {

	Page<UsuarioConvenio> findByPessoal_NomeIgnoreCaseContaining(Pageable pageable, @Param("nome") String nome);
	
	Page<UsuarioConvenio> findByPessoal_CodigoCargoStartsWith(Pageable pageable, @Param("codigoCargo") String codigoCargo);
	
	//TODO: terminar de montar essa query
	@Query(""
			+ " select                                           "
			+ " u                                                "
			+ " from                                             "
			+ " 	UsuarioConvenio u                            "
			+ " where                                            "
			+ " 	u.pessoal.codigoCargo not like :codigoCargo% ")
	Page<UsuarioConvenio> findByPessoal_Usuarios(Pageable pageable, @Param("codigoCargo") String codigoCargo);

	Page<UsuarioConvenio> findById(Pageable pageable, @Param("id") Long id);
	
	UsuarioConvenio findByPessoal_Matricula(@Param("matricula") Long matricula);
	
	@Modifying
    @Query(value = "INSERT INTO pesquisador (matricula) VALUES (:matricula)", nativeQuery = true)
    @Transactional
    void insertByMatricula(@Param("matricula") Long matricula);
	
	
	// @formatter:off
    @Query( " SELECT uc FROM UsuarioConvenio uc JOIN uc.pessoal p"
            + " WHERE "
            + "     (cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR (upper(p.nome) like %:pesquisa%) "
            + "     OR (upper(p.email) like %:pesquisa%) "
            + "     OR (upper(p.email2) like %:pesquisa%) "
            + "     OR (upper(p.lotacao.sigla) like %:pesquisa%) "
            + "     OR (upper(p.lotacao.descricao) like %:pesquisa%) "
            )
    // @formatter:on
	Page<UsuarioConvenio> filtroUsuarios(Pageable pageable, @Param("pesquisa") String pesquisa);
    
 // @formatter:off
    @Query( " SELECT uc FROM UsuarioConvenio uc JOIN uc.pessoal p"
            + " WHERE "
            + "     ((cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR (upper(p.nome) like %:pesquisa%) "
            + "     OR (upper(p.email) like %:pesquisa%) "
            + "     OR (upper(p.email2) like %:pesquisa%) "
            + "     OR (upper(p.lotacao.sigla) like %:pesquisa%) "
            + "     OR (upper(p.lotacao.descricao) like %:pesquisa%)) "
            + " AND (p.codigoCargo like '%MPF%' )"
            )
    // @formatter:on
	Page<UsuarioConvenio> filtroUsuariosMembro(Pageable pageable, @Param("pesquisa") String pesquisa);
	
 // @formatter:off
    @Query( " SELECT uc FROM UsuarioConvenio uc JOIN uc.pessoal p"
            + " WHERE "
            + "     ((cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR (upper(p.nome) like %:pesquisa%) "
            + "     OR (upper(p.email) like %:pesquisa%) "
            + "     OR (upper(p.email2) like %:pesquisa%) "
            + "     OR (upper(p.lotacao.sigla) like %:pesquisa%) "
            + "     OR (upper(p.lotacao.descricao) like %:pesquisa%)) "
            + " AND ((p.codigoCargo IS NULL) OR (p.codigoCargo not like '%MPF%')) "
            )
    // @formatter:on
    Page<UsuarioConvenio> filtroUsuariosServidor(Pageable pageable, @Param("pesquisa") String pesquisa);
	
}
