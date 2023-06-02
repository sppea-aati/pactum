package br.mp.mpf.pgr.pactum.domain;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pesquisador")
public class UsuarioConvenio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "atualizado")
	private boolean atualizado;

	@OneToOne
	@JoinColumn(name = "matricula", unique = true)
	private Pessoal pessoal;

	@OneToMany(mappedBy = "usuarioConvenio")
	@JsonIgnore
	private Set<Acesso> acessos;

	@OneToMany(mappedBy = "usuarioConvenio", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<Anexo> anexos;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Pessoal getPessoal() {
		return pessoal;
	}

	public void setPessoal(Pessoal pessoal) {
		this.pessoal = pessoal;
	}

	public Set<Acesso> getAcessos() {
		return acessos;
	}

	public void setAcessos(Set<Acesso> acessos) {
		this.acessos = acessos;
	}

	public Set<Anexo> getAnexos() {
		return anexos;
	}

	public void setAnexos(Set<Anexo> anexos) {
		this.anexos = anexos;
	}

	public boolean isAtualizado() {
		return atualizado;
	}

	public void setAtualizado(boolean atualizado) {
		this.atualizado = atualizado;
	}

}
