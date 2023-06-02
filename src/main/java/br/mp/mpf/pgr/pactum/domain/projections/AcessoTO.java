package br.mp.mpf.pgr.pactum.domain.projections;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import br.mp.mpf.pgr.pactum.domain.OperacaoAcesso;
import br.mp.mpf.pgr.pactum.domain.Telefone;
import br.mp.mpf.pgr.pactum.domain.UnidadeOrganica;

public class AcessoTO {

	private Long id;

	private Long convenioId;

	private Long usuarioId;

	private String nomeUsuario;

	private String siglaConvenio;

	private String nomeConvenio;

	private String cpf;

	private Long matricula;

	private String email;

	private String lotacao;

	private String desligado;

	private OperacaoAcesso operacaoAcesso;

	private Date data;

	private String descricaoCargo;

	private String telefoneComercial;

	public AcessoTO() {
	}

	public AcessoTO(OperacaoAcesso operacaoAcesso, LocalDateTime data) {
		this.operacaoAcesso = operacaoAcesso;
		if (data == null) {
			this.data = null;
		} else {
			this.data = Date.from(data.atZone(ZoneId.systemDefault()).toInstant());
		}
	}

	public AcessoTO(Long id, Long convenioId, Long usuarioId, String siglaConvenio, String nomeConvenio,
			OperacaoAcesso operacaoAcesso, LocalDateTime data) {
		super();
		this.id = id;
		this.siglaConvenio = siglaConvenio;
		this.nomeConvenio = nomeConvenio;
		this.convenioId = convenioId;
		this.usuarioId = usuarioId;
		this.operacaoAcesso = operacaoAcesso;

		if (data == null) {
			this.data = null;
		} else {
			this.data = Date.from(data.atZone(ZoneId.systemDefault()).toInstant());
		}

	}

	public AcessoTO(Long id, Long convenioId, String nomeUsuario, String cpf, Long matricula) {
		super();
		this.id = id;
		this.convenioId = convenioId;
		this.nomeUsuario = nomeUsuario;
		this.cpf = cpf;
		this.matricula = matricula;
	}

	public AcessoTO(Long id, Long convenioId, String nomeUsuario, String cpf, Long matricula, String email,
			UnidadeOrganica lotacao, String desligado, Long usuarioId, OperacaoAcesso operacaoAcesso, LocalDateTime data,
			String descricaoCargo, Telefone telefoneComercial) {
		super();
		this.id = id;
		this.convenioId = convenioId;
		this.nomeUsuario = nomeUsuario;
		this.cpf = cpf;
		this.matricula = matricula;
		this.email = email;
		this.lotacao = lotacao.getSigla() + " - " + lotacao.getDescricao();
		this.desligado = desligado;
		this.usuarioId = usuarioId;
		this.operacaoAcesso = operacaoAcesso;
		this.descricaoCargo = descricaoCargo;
		if (telefoneComercial != null) {
			this.telefoneComercial = "(" + telefoneComercial.getDdd() + ") " + telefoneComercial.getNumero();
		}

		if (data == null) {
			this.data = null;
		} else {
			this.data = Date.from(data.atZone(ZoneId.systemDefault()).toInstant());
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getConvenioId() {
		return convenioId;
	}

	public void setConvenioId(Long convenioId) {
		this.convenioId = convenioId;
	}

	public String getNomeUsuario() {
		return nomeUsuario;
	}

	public void setNomeUsuario(String nomeUsuario) {
		this.nomeUsuario = nomeUsuario;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getSiglaConvenio() {
		return siglaConvenio;
	}

	public void setSiglaConvenio(String siglaConvenio) {
		this.siglaConvenio = siglaConvenio;
	}

	public String getNomeConvenio() {
		return nomeConvenio;
	}

	public void setNomeConvenio(String nomeConvenio) {
		this.nomeConvenio = nomeConvenio;
	}

	public Long getMatricula() {
		return matricula;
	}

	public void setMatricula(Long matricula) {
		this.matricula = matricula;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getLotacao() {
		return lotacao;
	}

	public void setLotacao(String lotacao) {
		this.lotacao = lotacao;
	}

	public String getDesligado() {
		return desligado;
	}

	public void setDesligado(String desligado) {
		this.desligado = desligado;
	}

	public Long getUsuarioId() {
		return usuarioId;
	}

	public void setUsuarioId(Long usuarioId) {
		this.usuarioId = usuarioId;
	}

	public OperacaoAcesso getOperacaoAcesso() {
		return operacaoAcesso;
	}

	public void setOperacaoAcesso(OperacaoAcesso operacaoAcesso) {
		this.operacaoAcesso = operacaoAcesso;
	}

	public Date getData() {
		return data;
	}

	public void setData(Date data) {
		this.data = data;
	}

	public String getDescricaoCargo() {
		return descricaoCargo;
	}

	public void setDescricaoCargo(String descricaoCargo) {
		this.descricaoCargo = descricaoCargo;
	}

	public String getTelefoneComercial() {
		return telefoneComercial;
	}

	public void setTelefoneComercial(String telefoneComercial) {
		this.telefoneComercial = telefoneComercial;
	}

}
