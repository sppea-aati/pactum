package br.mp.mpf.pgr.pactum.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "perfil_usuario")
public class PerfilUsuario implements Serializable {

	private static final long serialVersionUID = 2351760583583134599L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_usuario", nullable = false)
	@JsonIgnore
	private Usuario usuario;

	@Column(name = "perfil")
	@Enumerated(EnumType.STRING) 
	private PerfilAcesso perfil;

	public PerfilAcesso getPerfil() {
		return perfil;
	}

	public void setPerfil(PerfilAcesso perfil) {
		this.perfil = perfil;
	}

	@Override
	public String toString() {
		if (perfil == null) {
			return "";
		}
		return perfil.toString();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

}
