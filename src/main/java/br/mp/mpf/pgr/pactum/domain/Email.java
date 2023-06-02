package br.mp.mpf.pgr.pactum.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "email")
public class Email {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "email", length = 256, unique = true)
	private String email;

	@Column(name = "enviar_base_dados")
	private boolean enviarBaseDados;

	@Column(name = "enviar_convenio")
	private boolean enviarConvenio;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isEnviarBaseDados() {
		return enviarBaseDados;
	}

	public void setEnviarBaseDados(boolean enviarBaseDados) {
		this.enviarBaseDados = enviarBaseDados;
	}

	public boolean isEnviarConvenio() {
		return enviarConvenio;
	}

	public void setEnviarConvenio(boolean enviarConvenio) {
		this.enviarConvenio = enviarConvenio;
	}
}
