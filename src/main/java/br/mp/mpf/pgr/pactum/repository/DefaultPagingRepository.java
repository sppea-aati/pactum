package br.mp.mpf.pgr.pactum.repository;

import java.io.Serializable;

import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;

@NoRepositoryBean
@PreAuthorize("hasRole('USUARIO')")
public interface DefaultPagingRepository<T, ID extends Serializable> extends PagingAndSortingRepository<T, ID> {

	@PreAuthorize("hasRole('ADMINISTRADOR')")
	@Override
	void deleteAll();

	@PreAuthorize("denyAll")
	@Override
	void deleteAll(Iterable<? extends T> entities);

	@PreAuthorize("hasRole('EDITOR')")
	@Override
	<S extends T> S save(S entity);

	@PreAuthorize("hasRole('EDITOR')")
	@Override
	<S extends T> Iterable<S> saveAll(Iterable<S> entities);

}
