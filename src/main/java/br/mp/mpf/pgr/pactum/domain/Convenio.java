package br.mp.mpf.pgr.pactum.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "convenio")
public class Convenio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "sigla", nullable = false)
	private String sigla;

	@Column(name = "descricao")
	private String descricao;

	@Column(name = "orgao_vinculo")
	private String orgaoVinculo;

	@Column(name = "contatos")
	private String contatos;

	@Column(name = "numero_procedimento")
	private String numeroProcedimento;

	@Column(name = "data_inicio_vigencia")
	private LocalDateTime dataInicioVigencia;

	@Column(name = "data_fim_vigencia")
	private LocalDateTime dataFimVigencia;

	@Column(name = "resumo")
	private String resumo;

	@Column(name = "anotacao")
	private String anotacao;

	@Column(name = "excluido")
	private boolean excluido;

	@OneToMany(mappedBy = "convenio", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<Acesso> acessos;

	@OneToMany(mappedBy = "convenio", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<Anexo> anexos;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSigla() {
		return sigla;
	}

	public void setSigla(String sigla) {
		this.sigla = sigla;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getOrgaoVinculo() {
		return orgaoVinculo;
	}

	public void setOrgaoVinculo(String orgaoVinculo) {
		this.orgaoVinculo = orgaoVinculo;
	}

	public String getNumeroProcedimento() {
		return numeroProcedimento;
	}

	public void setNumeroProcedimento(String numeroProcedimento) {
		this.numeroProcedimento = numeroProcedimento;
	}

	public String getContatos() {
		return contatos;
	}

	public void setContatos(String contatos) {
		this.contatos = contatos;
	}

	public LocalDateTime getDataInicioVigencia() {
		return dataInicioVigencia;
	}

	public void setDataInicioVigencia(LocalDateTime dataInicioVigencia) {
		this.dataInicioVigencia = dataInicioVigencia;
	}

	public LocalDateTime getDataFimVigencia() {
		return dataFimVigencia;
	}

	public void setDataFimVigencia(LocalDateTime dataFimVigencia) {
		this.dataFimVigencia = dataFimVigencia;
	}

	public String getResumo() {
		return resumo;
	}

	public void setResumo(String resumo) {
		this.resumo = resumo;
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

	public Date getVencimento() {
		if (this.dataFimVigencia != null) {
			return Date.from(dataFimVigencia.toInstant(ZoneOffset.UTC));
		}
		return null;
	}

	public Long getDiasAteVencimento() {
		if (this.dataFimVigencia != null) {
			return ChronoUnit.DAYS.between(LocalDate.now(), this.dataFimVigencia);
		}
		return null;
	}

	public SituacaoVencimento getSituacao() {
		if (this.dataFimVigencia != null) {
			int diasAteVencimento = getDiasAteVencimento().intValue();
			if (diasAteVencimento < 0) {
				// return "Vencido";
			}
		}
		return SituacaoVencimento.NORMAL;
	}

	// @JsonFormat(shape = JsonFormat.Shape.OBJECT)
	enum SituacaoVencimento {

		NORMAL(1, "Normal"), VENCIDO(2, "Vencido"), A_VENCER_ATE_15_DIAS(3, "A vencer em até 15 dias"), A_VENCER_ATE_30_DIAS(4, "A vencer em até 30 dias"), A_VENCER_ATE_60_DIAS(5,
				"A vencer em até 60 dias"), NAO_DEFINIDO(6, "Fim da vigência não informada");

		SituacaoVencimento(Integer codigo, String descricao) {
			this.codigo = codigo;
			this.descricao = descricao;
		}

		private Integer codigo;

		private String descricao;

		// @JsonValue
		public Integer getCodigo() {
			return codigo;
		}

		// @JsonValue
		public String getDescricao() {
			return descricao;
		}

	}

	public String getAnotacao() {
		return anotacao;
	}

	public void setAnotacao(String anotacao) {
		this.anotacao = anotacao;
	}

	public boolean isExcluido() {
		return excluido;
	}

	public void setExcluido(boolean excluido) {
		this.excluido = excluido;
	}

}
