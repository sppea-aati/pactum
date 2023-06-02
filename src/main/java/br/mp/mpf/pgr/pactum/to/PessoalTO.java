package br.mp.mpf.pgr.pactum.to;

public class PessoalTO {

	private int matricula;

	private String nome;

	private String email;

	private String codigoCargo;

	private String descricaoCargo;

	private String desligado;

	private boolean cadastrado;

	private String perfisParam;

	public int getMatricula() {
		return matricula;
	}

	public void setMatricula(int matricula) {
		this.matricula = matricula;
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

	public String getPerfisParam() {
		return perfisParam;
	}

	public void setPerfisParam(String perfisParam) {
		this.perfisParam = perfisParam;
	}

}
