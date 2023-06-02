export class Usuario {
  id: number;
  matricula: string;
  nome: string;
  ativo: boolean;
  email: string;
  cargo: string;
  codigoCargo: string;
  perfis: Array<any>;
  roles: Array<string>;
}
export class Pessoal {
  matricula: string;
  nome: string;
  email: string;
  cargo: string;
  lotacao: Lotacao;
  cpf: string;
  desligado: string;
  dtNascimento: Date | string;
  rgNumero: string;
  rgOrgaoEmissor: string;
  rgUf: string;
  tituloEleitor: number;
}

export class Lotacao {
  sigla: string;
  descricao: string;
}

export class UsuarioConvenio {
  id: number;
  atualizado: boolean;
  pessoal: Pessoal;
}

export class Convenio {
  id: number;
  sigla: string;
  descricao: string;
  orgaoVinculo: string;
  contatos: string;
  dataInicioVigencia: Date | string;
  dataFimVigencia: Date | string;
  resumo: string;
  anotacao: string;
  numeroProcedimento: string;
  diasAteVencimento: number;
  situacao?: string;
  cls?: string;
}

export class BaseDados {
  id: number;
  nomeBase: string;
  numeroProcedimento: string;
  orgaoOrigem: string;
  periodicidade: string;
  fonteObtencao: string;
  contatos: string;
  resumo: string;
  anotacao: string;
  diasAteVencimento: number;
  situacao?: string;
  avisoVencimento: boolean;
  ultimaDataExtracao: Date | string;
  cls?: string;
}

export class CargaBaseDados {
  id: number;
  baseDados: string;
  dataExtracao: Date | string;
  dataInicio: Date | string;
  dataFim: Date | string;
  dataCargaRadar: Date | string;
  layoutArquivo: string;
  anotacao: string;
  tamanhoBase: any;
  unidadeTamanho: string;
  formatoBase: string;
  nomeAnexo: string;
  idAnexo: string;
  cls?: string;
}

export class Acesso {
  id: number;
  usuarioConvenio: UsuarioConvenio;
  convenio: Convenio;
  operacaoAcesso: string;
}

export class AcessoTO {
  id: number;
  convenioId: number;
  usuarioId: number;
  nomeUsuario: string;
  siglaConvenio: string;
  nomeConvenio: string;
  cpf: string;
  matricula: number;
  operacaoAcesso: string;
  email: string;
  lotacao: string;
  desligado: string;
  data: number;
  descricaoCargo: string;
  telefoneComercial: string;
}

export class Anexo {
  id: number;
  nomeArquivo: string;
  anexo: string | any;
}

export class Filter {
  key: string;
  operation: string;
  value: string;
  useContains: true;

  constructor(key, operation, value, useContains) {
    this.key = key;
    this.operation = operation;
    this.value = value;
    this.useContains = useContains;
  }
}

export class FiltrosConvenios {
  dias_vencimento: number;
  vencidos: boolean;
}

