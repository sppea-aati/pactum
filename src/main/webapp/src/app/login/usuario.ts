export class UsuarioLogin {
  email: string;
  nome: string;
  roles?: string[];
}

export interface Credentials {
  email: string;
  senha: string;
}
