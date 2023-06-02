package br.mp.mpf.pgr.pactum.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "acesso")
public class Acesso {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "id_convenio")
	private Convenio convenio;

	@ManyToOne
	@JoinColumn(name = "id_usuario")
	private UsuarioConvenio usuarioConvenio;

	@Column(name = "operacao")
	@Enumerated(EnumType.STRING)
	private OperacaoAcesso operacaoAcesso;

	@Column(name = "data", insertable=false)
	private LocalDateTime data;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public UsuarioConvenio getUsuarioConvenio() {
		return usuarioConvenio;
	}

	public void setUsuarioConvenio(UsuarioConvenio usuarioConvenio) {
		this.usuarioConvenio = usuarioConvenio;
	}

	public Convenio getConvenio() {
		return convenio;
	}

	public void setConvenio(Convenio convenio) {
		this.convenio = convenio;
	}

	public OperacaoAcesso getOperacaoAcesso() {
		return operacaoAcesso;
	}

	public void setOperacaoAcesso(OperacaoAcesso operacaoAcesso) {
		this.operacaoAcesso = operacaoAcesso;
	}

	public LocalDateTime getData() {
		return data;
	}

	public void setData(LocalDateTime data) {
		this.data = data;
	}
}
