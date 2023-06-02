export interface State {
  isLogged: boolean;
  usuario?: UsuarioLogin;
  err?: string;
}

export class UsuarioLogin {
  id: number;
  matricula: string;
  email: string;
  username: string;
  nome: string;
  roles?: string[];
  ativo: boolean;
  cargo: string;
  codigoCargo: string;
  membro: boolean;
  validLoginSerpro: boolean;
  gerenteAcesso: boolean;
  admin: boolean;
}

export function isAdmin(usuario: UsuarioLogin): boolean {
  if (!usuario.roles) {
    return false;
  }
  return usuario.roles.filter((value) => value === 'ADMINISTRADOR').length > 0;
}

export function isGerenteAcesso(usuario: UsuarioLogin): boolean {
  if (!usuario.roles) {
    return false;
  }
  return usuario.roles
    .filter((value) =>
      value === 'ADMINISTRADOR' || value === 'GERENTE_ACESSO'
    ).length > 0;
}

export function isMembro(usuario: UsuarioLogin): boolean {
  if (!usuario.roles) {
    return false;
  }
  return usuario.roles.filter((value) => value === 'MEMBRO').length > 0;
}

export function isEditor(usuario: UsuarioLogin): boolean {
  if (!usuario.roles) {
    return false;
  }
  return usuario.roles
    .filter((value) =>
      value === 'ADMINISTRADOR' || value === 'EDITOR'
    ).length > 0;
}
export function isUser(usuario: UsuarioLogin): boolean {
  if (!usuario.roles) {
    return false;
  }
  return usuario.roles
    .filter((value) =>
      value === 'ADMINISTRADOR' || value === 'MEMBRO' || value === 'USUARIO' || value === 'SERVIDOR' || value === 'EDITOR' || value === 'GERENTE_ACESSO'
    ).length > 0;
}

export interface Credentials {
  email: string;
  senha: string;
}
