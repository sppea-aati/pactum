package br.mp.mpf.pgr.pactum.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.mp.mpf.pgr.pactum.domain.Acesso;
import br.mp.mpf.pgr.pactum.domain.projections.AcessoTO;

@RepositoryRestResource(path = "acessos", collectionResourceRel = "acessos")
public interface AcessoRepository extends DefaultPagingRepository<Acesso, Long> {
	
	@Query(value = "SELECT new br.mp.mpf.pgr.pactum.domain.projections.AcessoTO ( " +
				   " a.operacaoAcesso, a.data) " +
				   " FROM Acesso a " +
				   " WHERE " +
				   " a.usuarioConvenio.id = :idUsuario AND " +
				   " a.convenio.id = :idConvenio " +
				   " order by a.data desc ")
	Iterable<AcessoTO> findAcessosUsuarioConvenio(@Param("idUsuario") long idUsuario, @Param("idConvenio") long idConvenio);
   
    // @formatter:off
	@Query(value = "      SELECT new br.mp.mpf.pgr.pactum.domain.projections.AcessoTO ( " +
                   "             a.id, " +
                   "             c.id, " +
                   "             a.usuarioConvenio.id, " +
                   "             c.sigla AS siglaConvenio, " +
                   "             c.descricao AS nomeConvenio, " +
                   "             a.operacaoAcesso, " +
                   "             a.data " +
                   "           ) " +
	               "        FROM Acesso a " +
	               "  RIGHT JOIN a.convenio c " +
	               "          ON a.usuarioConvenio.id = :idUsuarioConvenio " +
                   "       WHERE (" +
                   "             LOWER(c.descricao) LIKE LOWER(CONCAT('%', :pesquisa, '%')) " +
                   "             OR LOWER(c.sigla) LIKE LOWER(CONCAT('%', :pesquisa, '%')) " +
                   "             )" +
                   "             AND (" +
                   "             a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id )" +
                   "             )" +
                   "			 AND c.excluido = false",
                   
	       countQuery = "      SELECT count(*) " +
	               "             FROM Acesso a " +
	               " RIGHT JOIN a.convenio c " +
	               "             ON a.usuarioConvenio.id = :idUsuarioConvenio" + 
	               "     WHERE (" +
	               "             LOWER(c.descricao) LIKE LOWER(CONCAT('%', :pesquisa, '%')) " +
	               "             OR LOWER(c.sigla) LIKE LOWER(CONCAT('%', :pesquisa, '%')) " +
	               "           )"+
	               "           AND (" +
                   "             a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id )" +
                   "           )" +
                   "		   AND c.excluido = false"
	               )
    // @formatter:on
	Page<AcessoTO> findAcessosDisponiveisPorUsuario(Pageable pageable, @Param("idUsuarioConvenio") Long idUsuarioConvenio, @Param("pesquisa") String pesquisa);
	
    // @formatter:off
    @Query(value = "SELECT new br.mp.mpf.pgr.pactum.domain.projections.AcessoTO ( " +
                   "       a.id, " +
                   "       c.id, " +
                   "       a.usuarioConvenio.id, " + 
                   "       c.sigla AS siglaConvenio, " +
                   "       c.descricao AS nomeConvenio, " +
                   "       a.operacaoAcesso, " +
                   "       a.data " +
                   "       ) " +
                   "  FROM Acesso a " +
                   "  JOIN a.convenio c " +
                   " WHERE a.usuarioConvenio.id = :idUsuarioConvenio")
    // @formatter:on
    Page<AcessoTO> findAcessosPorUsuario(Pageable pageable, @Param("idUsuarioConvenio") Long idUsuarioConvenio);

 // @formatter:off
    @Query(value = "select new br.mp.mpf.pgr.pactum.domain.projections.AcessoTO("
            + "a.id, "
            + "c.id, "
            + "p.nome, "
            + "p.cpf, "
            + "p.matricula, "
            + "p.email, "
            + "p.lotacao, "
            + "p.desligado, "
            + "u.id, "
            + "a.operacaoAcesso, "
            + "a.data, "
            + "p.descricaoCargo, "
            + "p.telefoneComercial "
            + ") "
            + "from Acesso a "
            + "join a.convenio c WITH c.id = :convenioId "
            + "right join a.usuarioConvenio u "
            + "join u.pessoal p "
            + "where "
            + "("
            + "     (cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR   (upper(p.nome) like %:pesquisa%) "
            + "     OR   (upper(p.email) like %:pesquisa%) "
            + "     OR   (upper(p.lotacao.descricao) like %:pesquisa%) "
            + ") "
            +"AND ( "
            +"a is null or a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id ) "
            +") "
            +"AND ( (:filtroTodos = 'todos') or (a IS NOT NULL AND (a.operacaoAcesso = 'CADASTRAR' or a.operacaoAcesso = 'RECADASTRAR')) )",
            countQuery = "select count(*) "
            + "from Acesso a "
            + "join a.convenio c WITH c.id = :convenioId "
            + "right join a.usuarioConvenio u "
            + "join u.pessoal p "
            + "where "
            + "("
            + "     (cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR   (upper(p.nome) like %:pesquisa%) "
            + "     OR   (upper(p.email) like %:pesquisa%) "
            + "     OR   (upper(p.lotacao.descricao) like %:pesquisa%) "
            + ") "
            +"AND ( "
            +"a is null or a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id ) "
            +") "
            +"AND ( (:filtroTodos = 'todos') or (a IS NOT NULL AND (a.operacaoAcesso = 'CADASTRAR' or a.operacaoAcesso = 'RECADASTRAR')) )")
    // @formatter:on
    Page<AcessoTO> findAcessosPorConvenio(Pageable pageable, @Param("convenioId") Long convenioId, @Param("pesquisa") String pesquisa, @Param("filtroTodos") String filtroTodos);	
    
 // @formatter:off
    @Query(value = "select new br.mp.mpf.pgr.pactum.domain.projections.AcessoTO("
            + "a.id, "
            + "c.id, "
            + "p.nome, "
            + "p.cpf, "
            + "p.matricula, "
            + "p.email, "
            + "p.lotacao, "
            + "p.desligado, "
            + "u.id, "
            + "a.operacaoAcesso, "
            + "a.data, "
            + "p.descricaoCargo, "
            + "p.telefoneComercial "
            + ") "
            + "from Acesso a "
            + "join a.convenio c WITH c.id = :convenioId "
            + "right join a.usuarioConvenio u "
            + "join u.pessoal p "
            + "where "
            + "("
            + "     (cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR   (upper(p.nome) like %:pesquisa%) "
            + "     OR   (upper(p.email) like %:pesquisa%) "
            + "     OR   (upper(p.lotacao.descricao) like %:pesquisa%) "
            + ")"
            + "AND ("
            + "     p.codigoCargo like '%MPF%' "
            + ") "
            +"AND ( "
            +"a is null or a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id ) "
            +") "
            +"AND ( (:filtroTodos = 'todos') or (a IS NOT NULL AND (a.operacaoAcesso = 'CADASTRAR' or a.operacaoAcesso = 'RECADASTRAR')) )",
            countQuery = "select count(*) "
            + "from Acesso a "
            + "join a.convenio c WITH c.id = :convenioId "
            + "right join a.usuarioConvenio u "
            + "join u.pessoal p "
            + "where"
            + "("
            + "     (cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR   (upper(p.nome) like %:pesquisa%) "
            + "     OR   (upper(p.email) like %:pesquisa%) "
            + "     OR   (upper(p.lotacao.descricao) like %:pesquisa%) "
            + ")"
            + "AND ("
            + "     p.codigoCargo like '%MPF%' "
            + ") "
            +"AND ( "
            +"a is null or a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id ) "
            +") "
            +"AND ( (:filtroTodos = 'todos') or (a IS NOT NULL AND (a.operacaoAcesso = 'CADASTRAR' or a.operacaoAcesso = 'RECADASTRAR')) )")
    // @formatter:on
    Page<AcessoTO> findAcessosMembroPorConvenio(Pageable pageable, @Param("convenioId") Long convenioId, @Param("pesquisa") String pesquisa, @Param("filtroTodos") String filtroTodos);
    
 // @formatter:off
    @Query(value = "select new br.mp.mpf.pgr.pactum.domain.projections.AcessoTO("
            + "a.id, "
            + "c.id, "
            + "p.nome, "
            + "p.cpf, "
            + "p.matricula, "
            + "p.email, "
            + "p.lotacao, "
            + "p.desligado, "
            + "u.id, "
            + "a.operacaoAcesso, "
            + "a.data, "
            + "p.descricaoCargo, "
            + "p.telefoneComercial "
            + ") "
            + "from Acesso a "
            + "join a.convenio c WITH c.id = :convenioId "
            + "right join a.usuarioConvenio u "
            + "join u.pessoal p "
            + "where "
            + "("
            + "     (cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR   (upper(p.nome) like %:pesquisa%) "
            + "     OR   (upper(p.email) like %:pesquisa%) "
            + "     OR   (upper(p.lotacao.descricao) like %:pesquisa%) "
            + ")"
            + "AND ("
            + "     (p.codigoCargo IS NULL) OR (p.codigoCargo not like '%MPF%') "
            + ") "
            +"AND ( "
            +"a is null or a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id ) "
            +") "
            +"AND ( (:filtroTodos = 'todos') or (a IS NOT NULL AND (a.operacaoAcesso = 'CADASTRAR' or a.operacaoAcesso = 'RECADASTRAR')) )",
            countQuery = "select count(*) "
            + "from Acesso a "
            + "join a.convenio c WITH c.id = :convenioId "
            + "right join a.usuarioConvenio u "
            + "join u.pessoal p "
            + "where "
            + "("
            + "     (cast(p.matricula as string) like %:pesquisa%) "
            + "     OR (cast(p.cpf as string) like %:pesquisa%) "
            + "     OR   (upper(p.nome) like %:pesquisa%) "
            + "     OR   (upper(p.email) like %:pesquisa%) "
            + "     OR   (upper(p.lotacao.descricao) like %:pesquisa%) "
            + ")"
            + "AND ("
            + "     (p.codigoCargo IS NULL) OR (p.codigoCargo not like '%MPF%') "
            + ") "
            +"AND ( "
            +"a is null or a.data IS NULL or a.data in (select max(a2.data) from Acesso a2 where a2.convenio.id = c.id and a2.usuarioConvenio.id = a.usuarioConvenio.id ) "
            +") "
            +"AND ( (:filtroTodos = 'todos') or (a IS NOT NULL AND (a.operacaoAcesso = 'CADASTRAR' or a.operacaoAcesso = 'RECADASTRAR')) )")
    // @formatter:on
    Page<AcessoTO> findAcessosServidorPorConvenio(Pageable pageable, @Param("convenioId") Long convenioId, @Param("pesquisa") String pesquisa, @Param("filtroTodos") String filtroTodos);
    
 // @formatter:off
    @Query("select new br.mp.mpf.pgr.pactum.domain.projections.AcessoTO("
            + "a.id, "
            + "c.id, "
            + "p.nome, "
            + "p.cpf, "
            + "p.matricula "
            + ") "
            + "from Acesso a "
            + "join a.convenio c "
            + "join a.usuarioConvenio u "
            + "join u.pessoal p "
            + "where (c.id = :convenioId) order by p.nome asc"
            )
    // @formatter:on
    Iterable<AcessoTO> findTodosAcessosPorConvenio(@Param("convenioId") Long convenioId);	

}
