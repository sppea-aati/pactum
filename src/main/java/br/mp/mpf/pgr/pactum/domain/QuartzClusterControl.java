package br.mp.mpf.pgr.pactum.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quartz_cluster_control")
public class QuartzClusterControl {

	@Id
	@Column(name = "data")
	private LocalDateTime data;

	public LocalDateTime getData() {
		return data;
	}

	public void setData(LocalDateTime data) {
		this.data = data;
	}

}
