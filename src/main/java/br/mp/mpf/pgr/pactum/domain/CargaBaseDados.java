package br.mp.mpf.pgr.pactum.domain;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "carga_base_dados")
public class CargaBaseDados {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "data_extracao")
	private LocalDateTime dataExtracao;

	@Column(name = "data_inicio")
	private LocalDateTime dataInicio;

	@Column(name = "data_fim")
	private LocalDateTime dataFim;

	@Column(name = "data_carga_radar")
	private LocalDateTime dataCargaRadar;

	@Column(name = "layout_arquivo")
	private String layoutArquivo;

	@Column(name = "anotacao")
	private String anotacao;

	@Column(name = "tamanho_base")
	private Double tamanhoBase;

	@Column(name = "unidade_tamanho")
	@Enumerated(EnumType.STRING)
	private UnidadeTamanho unidadeTamanho;

	@Column(name = "formato_base")
	private String formatoBase;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="ID_ANEXO")
	private Anexo anexo;

	@ManyToOne
	@JoinColumn(name = "id_base_dados")
	private BaseDados baseDados;
	
	@Transient
	private String nomeAnexo;
	
	@Transient
	private Long idAnexo;
	
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getDataExtracao() {
		return dataExtracao;
	}

	public void setDataExtracao(LocalDateTime dataExtracao) {
		this.dataExtracao = dataExtracao;
	}

	public LocalDateTime getDataCargaRadar() {
		return dataCargaRadar;
	}

	public void setDataCargaRadar(LocalDateTime dataCargaRadar) {
		this.dataCargaRadar = dataCargaRadar;
	}

	public String getLayoutArquivo() {
		return layoutArquivo;
	}

	public void setLayoutArquivo(String layoutArquivo) {
		this.layoutArquivo = layoutArquivo;
	}

	public String getAnotacao() {
		return anotacao;
	}

	public void setAnotacao(String anotacao) {
		this.anotacao = anotacao;
	}

	public Double getTamanhoBase() {
		return tamanhoBase;
	}

	public void setTamanhoBase(Double tamanhoBase) {
		this.tamanhoBase = tamanhoBase;
	}

	public UnidadeTamanho getUnidadeTamanho() {
		return unidadeTamanho;
	}

	public void setUnidadeTamanho(UnidadeTamanho unidadeTamanho) {
		this.unidadeTamanho = unidadeTamanho;
	}

	public String getFormatoBase() {
		return formatoBase;
	}

	public void setFormatoBase(String formatoBase) {
		this.formatoBase = formatoBase;
	}

	public Anexo getAnexo() {
		return anexo;
	}

	public void setAnexo(Anexo anexo) {
		this.anexo = anexo;
	}

	public LocalDateTime getDataInicio() {
		return dataInicio;
	}

	public void setDataInicio(LocalDateTime dataInicio) {
		this.dataInicio = dataInicio;
	}

	public LocalDateTime getDataFim() {
		return dataFim;
	}

	public void setDataFim(LocalDateTime dataFim) {
		this.dataFim = dataFim;
	}

	public BaseDados getBaseDados() {
		return baseDados;
	}

	public void setBaseDados(BaseDados baseDados) {
		this.baseDados = baseDados;
	}
	
	public String getNomeAnexo() {
		if(anexo == null) {
			return null;
		}
		return anexo.getNomeArquivo();
	}
	
	public Long getIdAnexo() {
		if(anexo == null) {
			return null;
		}
		return anexo.getId();
	}


}
