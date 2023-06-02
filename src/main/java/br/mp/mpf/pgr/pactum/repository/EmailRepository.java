package br.mp.mpf.pgr.pactum.repository;

import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

import br.mp.mpf.pgr.pactum.domain.Email;

@PreAuthorize("hasRole('GERENTE_ACESSO')")
public interface EmailRepository extends DefaultCrudRepository<Email, Long> {

	Iterable<Email> findByEmailIgnoreCaseContaining(@Param("email") String email);

}
