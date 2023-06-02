package br.mp.mpf.pgr.pactum.domain;

import java.sql.Blob;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "anexo")
public class Anexo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nome_arquivo")
	private String nomeArquivo;

	@JsonIgnore
	@Lob
	@Column(name = "anexo")
	private Blob anexo;

	@Column(name = "mime_type")
	private String mimeType;

	@Column(name = "extensao")
	private String extensao;

	@Column(name = "tamanho")
	private Long tamanho;

	@ManyToOne
	@JoinColumn(name = "id_convenio")
	private Convenio convenio;

	@ManyToOne
	@JoinColumn(name = "id_usuario")
	private UsuarioConvenio usuarioConvenio;

	@ManyToOne
	@JoinColumn(name = "id_base_dados")
	private BaseDados baseDados;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeArquivo() {
		return nomeArquivo;
	}

	public void setNomeArquivo(String nomeArquivo) {
		this.nomeArquivo = nomeArquivo;
	}

	public Blob getAnexo() {
		return anexo;
	}

	public void setAnexo(Blob anexo) {
		this.anexo = anexo;
	}

	public Convenio getConvenio() {
		return convenio;
	}

	public void setConvenio(Convenio convenio) {
		this.convenio = convenio;
	}

	public String getMimeType() {
		return mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	public String getExtensao() {
		return extensao;
	}

	public void setExtensao(String extensao) {
		this.extensao = extensao;
	}

	public Long getTamanho() {
		return tamanho;
	}

	public void setTamanho(Long tamanho) {
		this.tamanho = tamanho;
	}

	public UsuarioConvenio getUsuarioConvenio() {
		return usuarioConvenio;
	}

	public void setUsuarioConvenio(UsuarioConvenio usuarioConvenio) {
		this.usuarioConvenio = usuarioConvenio;
	}

	public BaseDados getBaseDados() {
		return baseDados;
	}

	public void setBaseDados(BaseDados baseDados) {
		this.baseDados = baseDados;
	}
}
