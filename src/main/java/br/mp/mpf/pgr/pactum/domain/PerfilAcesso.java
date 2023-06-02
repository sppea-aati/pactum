package br.mp.mpf.pgr.pactum.domain;

public enum PerfilAcesso {

	USUARIO, // Qualquer usuário da rede pode ter acesso de consulta ao sistema
	EDITOR, // Permite ao usuário editar as informações do sistema
	MEMBRO, // Perfil qualificativo de membro
	SERVIDOR, // Perfil qualificativo de servidor
	GERENTE_ACESSO, // Permite conceder acesso a outros usuários
	ADMINISTRADOR // Usuário administrador do sistema, exclusivo para servidores da CDSI/SPPEA

}
