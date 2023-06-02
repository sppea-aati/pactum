package br.mp.mpf.pgr.pactum.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "base_dados")
public class BaseDados {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nome_base")
	private String nomeBase;

	@Column(name = "numero_procedimento")
	private String numeroProcedimento;

	@Column(name = "orgao_origem")
	private String orgaoOrigem;

	@Column(name = "periodicidade")
	@Enumerated(EnumType.STRING)
	private PeriodicidadeBaseDados periodicidade;

	@Column(name = "fonte_obtencao")
	@Enumerated(EnumType.STRING)
	private FonteObtencao fonteObtencao;

	@Column(name = "contatos")
	private String contatos;

	@Column(name = "resumo")
	private String resumo;

	@Column(name = "anotacao")
	private String anotacao;

	@Column(name = "aviso_vencimento")
	private boolean avisoVencimento;

	@Column(name = "excluido")
	private boolean excluido;

	@Column(name = "ultima_data_extracao")
	private LocalDateTime ultimaDataExtracao;

	@OneToMany(mappedBy = "baseDados", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<Anexo> anexos;

	@OneToMany(mappedBy = "baseDados", fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<CargaBaseDados> cargas;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeBase() {
		return nomeBase;
	}

	public void setNomeBase(String nomeBase) {
		this.nomeBase = nomeBase;
	}

	public String getNumeroProcedimento() {
		return numeroProcedimento;
	}

	public void setNumeroProcedimento(String numeroProcedimento) {
		this.numeroProcedimento = numeroProcedimento;
	}

	public String getOrgaoOrigem() {
		return orgaoOrigem;
	}

	public void setOrgaoOrigem(String orgaoOrigem) {
		this.orgaoOrigem = orgaoOrigem;
	}

	public PeriodicidadeBaseDados getPeriodicidade() {
		return periodicidade;
	}

	public void setPeriodicidade(PeriodicidadeBaseDados periodicidade) {
		this.periodicidade = periodicidade;
	}

	public FonteObtencao getFonteObtencao() {
		return fonteObtencao;
	}

	public void setFonteObtencao(FonteObtencao fonteObtencao) {
		this.fonteObtencao = fonteObtencao;
	}

	public String getContatos() {
		return contatos;
	}

	public void setContatos(String contatos) {
		this.contatos = contatos;
	}

	public String getResumo() {
		return resumo;
	}

	public void setResumo(String resumo) {
		this.resumo = resumo;
	}

	public String getAnotacao() {
		return anotacao;
	}

	public void setAnotacao(String anotacao) {
		this.anotacao = anotacao;
	}

	public boolean isAvisoVencimento() {
		return avisoVencimento;
	}

	public void setAvisoVencimento(boolean avisoVencimento) {
		this.avisoVencimento = avisoVencimento;
	}

	public boolean isExcluido() {
		return excluido;
	}

	public void setExcluido(boolean excluido) {
		this.excluido = excluido;
	}

	public Set<Anexo> getAnexos() {
		return anexos;
	}

	public void setAnexos(Set<Anexo> anexos) {
		this.anexos = anexos;
	}

	public Set<CargaBaseDados> getCargas() {
		return cargas;
	}

	public void setCargas(Set<CargaBaseDados> cargas) {
		this.cargas = cargas;
	}

	public LocalDateTime getUltimaDataExtracao() {
		return ultimaDataExtracao;
	}

	public void setUltimaDataExtracao(LocalDateTime ultimaDataExtracao) {
		this.ultimaDataExtracao = ultimaDataExtracao;
	}

	public Long getDiasAteVencimento() {
		if (this.ultimaDataExtracao == null) {
			return null;
		}

		if (this.ultimaDataExtracao != null && this.periodicidade != null) {
			LocalDateTime dataFim = null;
			switch (this.periodicidade) {
			case MENSAL:
				dataFim = this.ultimaDataExtracao.plusMonths(1);
				break;
			case BIMESTRAL:
				dataFim = this.ultimaDataExtracao.plusMonths(2);
				break;
			case TRIMESTRAL:
				dataFim = this.ultimaDataExtracao.plusMonths(3);
				break;
			case SEMESTRAL:
				dataFim = this.ultimaDataExtracao.plusMonths(6);
				break;
			case ANUAL:
				dataFim = this.ultimaDataExtracao.plusMonths(12);
				break;
			case NAO_ATUALIZAVEL:
				break;
			}
			if (dataFim != null) {
				return ChronoUnit.DAYS.between(LocalDate.now(), dataFim);
			}
		}
		return null;
	}
}
