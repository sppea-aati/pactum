package br.mp.mpf.pgr.pactum.to;

import java.io.Serializable;

public class RestReturn implements Serializable {

	private static final long serialVersionUID = 6508394387362766604L;

	private Object value;

	private String error;

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}
}
