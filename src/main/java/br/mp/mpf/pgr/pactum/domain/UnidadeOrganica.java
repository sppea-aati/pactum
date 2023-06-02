package br.mp.mpf.pgr.pactum.domain;

import javax.persistence.Embeddable;

@Embeddable
public class UnidadeOrganica {
    
    private String codigo;
    
    private String sigla;

    private String descricao;

    private String procuradoria;

    private String uf;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
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

    public String getProcuradoria() {
        return procuradoria;
    }

    public void setProcuradoria(String procuradoria) {
        this.procuradoria = procuradoria;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

}
