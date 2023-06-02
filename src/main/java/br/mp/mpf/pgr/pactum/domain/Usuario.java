package br.mp.mpf.pgr.pactum.domain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.mp.mpf.pgr.spea.util.StringUtil;

@Entity
@Table(name = "usuario_sistema")
public class Usuario implements UserDetails {

	private static final long serialVersionUID = 1185768529033361590L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "matricula")
	private String matricula;

	@Column(name = "nome")
	private String nome;

	@Column(name = "ativo")
	private boolean ativo;

	@Column(name = "email")
	private String email;

	@Column(name = "cargo")
	private String cargo;

	@Column(name = "codigo_cargo")
	private String codigoCargo;

	@JsonIgnore
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario", cascade= { CascadeType.PERSIST })
	private List<PerfilUsuario> perfis;

	@Transient
	@JsonIgnore
	private Pessoal pessoal;

	@Override
	@JsonIgnore
	public Collection<? extends GrantedAuthority> getAuthorities() {
		if (perfis == null) {
			return Collections.emptyList();
		}

		List<GrantedAuthority> authorities = new ArrayList<>();
		for (PerfilUsuario perfilUsuario : perfis) {
			GrantedAuthority authority = new SimpleGrantedAuthority(perfilUsuario.getPerfil().toString());
			authorities.add(authority);
		}

		return authorities;
	}

	public String[] getRoles() {
		Collection<? extends GrantedAuthority> authorities = getAuthorities();
		String[] roles = new String[authorities.size()];
		int i = 0;
		for (GrantedAuthority grantedAuthority : authorities) {
			roles[i++] = grantedAuthority.getAuthority();
		}
		return roles;
	}

	@Override
	@JsonIgnore
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonLocked() {
		return false;
	}

	@Override
	@JsonIgnore
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isEnabled() {
		return ativo;
	}

	public boolean isMembro() {
		return codigoCargo != null && codigoCargo.startsWith("MPF");
	}

	@Override
	public String toString() {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append(nome);
		if (perfis != null) {
			stringBuilder.append(" - ");
			stringBuilder.append(StringUtil.virgulaE(perfis));
		}
		return stringBuilder.toString();
	}

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

	public boolean isAtivo() {
		return ativo;
	}

	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Pessoal getPessoal() {
		return pessoal;
	}

	public void setPessoal(Pessoal pessoal) {
		this.pessoal = pessoal;
	}

	public List<PerfilUsuario> getPerfis() {
		return perfis;
	}

	public void setPerfis(List<PerfilUsuario> perfis) {
		this.perfis = perfis;
	}

	public String getCargo() {
		return cargo;
	}

	public void setCargo(String cargo) {
		this.cargo = cargo;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getNome() {
		return nome;
	}

	public String getCodigoCargo() {
		return codigoCargo;
	}

	public void setCodigoCargo(String codigoCargo) {
		this.codigoCargo = codigoCargo;
	}

}
