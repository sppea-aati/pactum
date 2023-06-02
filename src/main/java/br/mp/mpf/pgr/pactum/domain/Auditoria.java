package br.mp.mpf.pgr.pactum.domain;

import java.io.Serializable;
import java.util.Date;

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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "auditoria")
public class Auditoria implements Serializable {

	private static final long serialVersionUID = 5485235363851150149L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Long id;

	@Column(name = "acao", nullable = false)
	@Enumerated(EnumType.STRING)
	private AcaoAuditoria acao;

	@ManyToOne
	@JoinColumn(name = "id_usuario", nullable = false)
	private Usuario usuario;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "data", nullable = false)
	private Date data;

	@Column(name = "ip")
	private String ip;

	@Column(name = "id_1")
	private Long id1;

	@Column(name = "detalhe_1")
	private String detalhe1;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public AcaoAuditoria getAcao() {
		return acao;
	}

	public void setAcao(AcaoAuditoria acao) {
		this.acao = acao;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public Date getData() {
		return data;
	}

	public void setData(Date data) {
		this.data = data;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public Long getId1() {
		return id1;
	}

	public void setId1(Long id1) {
		this.id1 = id1;
	}

	public String getDetalhe1() {
		return detalhe1;
	}

	public void setDetalhe1(String detalhe1) {
		this.detalhe1 = detalhe1;
	}
}
