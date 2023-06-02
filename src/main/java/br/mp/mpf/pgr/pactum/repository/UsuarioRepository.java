package br.mp.mpf.pgr.pactum.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

import br.mp.mpf.pgr.pactum.domain.Usuario;

@PreAuthorize("hasRole('GERENTE_ACESSO')")
public interface UsuarioRepository extends DefaultPagingRepository<Usuario, Long> {

	Page<Usuario> findByMatricula(Pageable pageable, @Param("matricula") String matricula);
}
