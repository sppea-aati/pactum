package br.mp.mpf.pgr.pactum.domain;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "vw_pessoal")
public class Pessoal implements Serializable {

	private static final long serialVersionUID = 2660897158073983571L;

	@Id
	@Column(name = "matricula")
	private Long matricula;

	@Column(name = "nome", length = 65)
	private String nome;

	@Column(name = "email1", length = 100)
	private String email;

    @Column(name = "email2", length = 100)
    private String email2;

	@Column(name = "desligado")
	private String desligado;

	@Column(name = "cpf", length = 11)
	private String cpf;

	@Column(name = "cargo_codigo", length = 8)
	private String codigoCargo;

	@Column(name = "cargo_descricao", length = 60)
	private String descricaoCargo;
	
	@Column(name = "dt_nascimento")
	private LocalDateTime dtNascimento;
	
	@Column(name = "rg_numero", length = 14)
	private String rgNumero;
	
	@Column(name = "rg_orgemissor_sg", length = 6)
	private String rgOrgaoEmissor;
	
	@Column(name = "rg_uf_sg", length = 2)
	private String rgUf;
	
	@Column(name = "titulo_nr")
	private Long tituloEleitor;
	
    @Embedded   
	@AttributeOverrides({
        @AttributeOverride(name="ddd", column=@Column(name="DDD_CELULAR")),
        @AttributeOverride(name="numero", column=@Column(name="TELEFONE_CELULAR"))
    })
	private Telefone telefoneCelular;


    @Embedded   
    @AttributeOverrides({
        @AttributeOverride(name="ddd", column=@Column(name="DDD_COMERCIAL")),
        @AttributeOverride(name="numero", column=@Column(name="TELEFONE_COMERCIAL"))
    })
    private Telefone telefoneComercial;

    @Embedded   
    @AttributeOverrides({
        @AttributeOverride(name="ddd", column=@Column(name="DDD_RESIDENCIAL")),
        @AttributeOverride(name="numero", column=@Column(name="TELEFONE_RESIDENCIAL"))
    })
    private Telefone telefoneResidencial;
    
    @Embedded   
    @AttributeOverrides({
        @AttributeOverride(name="codigo", column=@Column(name="LOTACAO_CODIGO")),
        @AttributeOverride(name="sigla", column=@Column(name="LOTACAO_SIGLA")),
        @AttributeOverride(name="descricao", column=@Column(name="LOTACAO_DESCRICAO")),
        @AttributeOverride(name="procuradoria", column=@Column(name="LOTACAO_SIGLA_PR")),
        @AttributeOverride(name="uf", column=@Column(name="LOTACAO_UF"))
    })
    private UnidadeOrganica lotacao;
    
    @Transient
	private boolean cadastrado;

    @Transient
    public boolean isServidor() {
    	return !isMembro();
    }

    @Transient
    public boolean isMembro() {
    	if (codigoCargo == null) {
    		return false;
    	}
    	return codigoCargo.startsWith("MPF");
    }

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getMatricula() {
		return matricula;
	}

	public void setMatricula(Long matricula) {
		this.matricula = matricula;
	}

	public String getDesligado() {
		return desligado;
	}

	public void setDesligado(String desligado) {
		this.desligado = desligado;
	}

	public boolean isCadastrado() {
		return cadastrado;
	}

	public void setCadastrado(boolean cadastrado) {
		this.cadastrado = cadastrado;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getCodigoCargo() {
		return codigoCargo;
	}

	public void setCodigoCargo(String codigoCargo) {
		this.codigoCargo = codigoCargo;
	}

	public String getDescricaoCargo() {
		return descricaoCargo;
	}

	public void setDescricaoCargo(String descricaoCargo) {
		this.descricaoCargo = descricaoCargo;
	}

    public String getEmail2() {
        return email2;
    }

    public void setEmail2(String email2) {
        this.email2 = email2;
    }

    public Telefone getTelefoneCelular() {
        return telefoneCelular;
    }

    public void setTelefoneCelular(Telefone telefoneCelular) {
        this.telefoneCelular = telefoneCelular;
    }

    public Telefone getTelefoneComercial() {
        return telefoneComercial;
    }

    public void setTelefoneComercial(Telefone telefoneComercial) {
        this.telefoneComercial = telefoneComercial;
    }

    public Telefone getTelefoneResidencial() {
        return telefoneResidencial;
    }

    public void setTelefoneResidencial(Telefone telefoneResidencial) {
        this.telefoneResidencial = telefoneResidencial;
    }

    public UnidadeOrganica getLotacao() {
        return lotacao;
    }

    public void setLotacao(UnidadeOrganica lotacao) {
        this.lotacao = lotacao;
    }

	public LocalDateTime getDtNascimento() {
		return dtNascimento;
	}

	public void setDtNascimento(LocalDateTime dtNascimento) {
		this.dtNascimento = dtNascimento;
	}

	public String getRgNumero() {
		return rgNumero;
	}

	public void setRgNumero(String rgNumero) {
		this.rgNumero = rgNumero;
	}

	public String getRgOrgaoEmissor() {
		return rgOrgaoEmissor;
	}

	public void setRgOrgaoEmissor(String rgOrgaoEmissor) {
		this.rgOrgaoEmissor = rgOrgaoEmissor;
	}

	public String getRgUf() {
		return rgUf;
	}

	public void setRgUf(String rgUf) {
		this.rgUf = rgUf;
	}

	public Long getTituloEleitor() {
		return tituloEleitor;
	}

	public void setTituloEleitor(Long tituloEleitor) {
		this.tituloEleitor = tituloEleitor;
	}
    
}
