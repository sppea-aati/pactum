package br.mp.mpf.pgr.pactum.to;

public class UsuarioTO {

	private Long id;

	private String matricula;

	private String nome;

	private String email;

	private String cargo;

	private boolean ativo;

	private boolean validSerproLogin;

	private String codigoCargo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMatricula() {
		return matricula;
	}

	public void setMatricula(String matricula) {
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

	public String getCargo() {
		return cargo;
	}

	public void setCargo(String cargo) {
		this.cargo = cargo;
	}

	public boolean isAtivo() {
		return ativo;
	}

	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}

	public boolean isValid_serpro_login() {
		return validSerproLogin;
	}

	public void setValid_serpro_login(boolean valid_serpro_login) {
		this.validSerproLogin = valid_serpro_login;
	}

	public String getCodigo_cargo() {
		return codigoCargo;
	}

	public void setCodigo_cargo(String codigo_cargo) {
		this.codigoCargo = codigo_cargo;
	}

	public UsuarioTO(){
	}
	
	public UsuarioTO(Long id, String matricula, String nome, String email, String cargo, boolean ativo, boolean valid_serpro_login,
			String codigo_cargo) {
		super();
		this.id = id;
		this.matricula = matricula;
		this.nome = nome;
		this.email = email;
		this.cargo = cargo;
		this.ativo = ativo;
		this.validSerproLogin = valid_serpro_login;
		this.codigoCargo = codigo_cargo;
	}

}
