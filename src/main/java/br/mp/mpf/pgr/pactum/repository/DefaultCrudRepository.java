package br.mp.mpf.pgr.pactum.repository;

import java.io.Serializable;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.security.access.prepost.PreAuthorize;

@NoRepositoryBean
@PreAuthorize("hasRole('USUARIO')")
public interface DefaultCrudRepository<T, ID extends Serializable> extends CrudRepository<T, ID> {

	@PreAuthorize("hasRole('ADMINISTRADOR')")
	@Override
	void deleteAll();

	@PreAuthorize("denyAll")
	@Override
	void deleteAll(Iterable<? extends T> entities);

	@PreAuthorize("hasRole('ADMINISTRADOR')")
	@Override
	void delete(T entity);

	@PreAuthorize("hasRole('ADMINISTRADOR')")
	@Override
	void deleteById(ID id);

	@PreAuthorize("hasRole('EDITOR')")
	@Override
	<S extends T> S save(S entity);

	@PreAuthorize("hasRole('EDITOR')")
	@Override
	<S extends T> Iterable<S> saveAll(Iterable<S> entities);
	
	
}
