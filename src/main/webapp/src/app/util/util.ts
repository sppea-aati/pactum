import { INgxMyDpOptions } from 'ngx-mydatepicker';
import { AcessoTO, BaseDados } from '../domain';

export const ngxMyOptions: INgxMyDpOptions = {
  dateFormat: 'dd/mm/yyyy',
  firstDayOfWeek: 'su',
  dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
  monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
  todayBtnTxt: 'Hoje',
  satHighlight: true
};

export function getFormattedDate(date: Date) {
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  let hour = date.getHours().toString();
  hour = hour.length > 1 ? hour : '0' + hour;
  let minute = date.getMinutes().toString();
  minute = minute.length > 1 ? minute : '0' + minute;
  let seconds = date.getSeconds().toString();
  seconds = seconds.length > 1 ? seconds : '0' + seconds;

  return day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + seconds;
}

export function copyToClipboard(campo: string) {

  const range = document.createRange();
  range.selectNode(document.getElementById(campo));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}

export function verificaPerfil(perfis: Array<any>, perfil: String): boolean {
  for (let i = 0, len = perfis.length; i < len; i++) {
    if (perfis[i].perfil === perfil) {
      return true;
    }
  }
  return false;
}

export function formatarCPF(cpf: string): string {
  let retorno = '';
  const tamanho = cpf.length;
  for (let i = tamanho; i <= 10; i++) {
    retorno = retorno + 0;
  }
  retorno = retorno + cpf;
  retorno = retorno.slice(0, 3) + '.' + retorno.slice(3, 6) + '.' + retorno.slice(6, 9) + '-' + retorno.slice(9, 11);
  return retorno;
}

export function validarCPF(strCPF: string): boolean {
  let Soma;
  let Resto;
  let i;
  Soma = 0;
  if (strCPF === '00000000000') {
    return false;
  }

  for (i = 1; i <= 9; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }
  Resto = (Soma * 10) % 11;

  if ((Resto === 10) || (Resto === 11)) {
    Resto = 0;
  }
  if (Resto !== parseInt(strCPF.substring(9, 10))) {
    return false;
  }

  Soma = 0;

  for (i = 1; i <= 10; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  }
  Resto = (Soma * 10) % 11;

  if ((Resto === 10) || (Resto === 11)) {
    Resto = 0;
  }
  if (Resto !== parseInt(strCPF.substring(10, 11))) {
    return false;
  }
  return true;

}

export function validarCNPJ(cnpj: string): boolean {

  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj === '') {
    return false;
  }

  if (cnpj.length !== 14) {
    return false;
  }

  // Elimina CNPJs invalidos conhecidos
  if (cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999') {
    return false;
  }

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros: any = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  let resultado: any = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== digitos.charAt(0)) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== digitos.charAt(1)) {
    return false;
  }

  return true;
}

export function formatarOperacaoAcesso(acesso: AcessoTO): string {
  if (!acesso.operacaoAcesso) {
    return '';
  }
  let operacao = '';
  if (acesso.operacaoAcesso === 'CADASTRAR') {
    operacao = 'Cadastrado';
  } else if (acesso.operacaoAcesso === 'RECADASTRAR') {
    operacao = 'Recadastrado';
  } else if (acesso.operacaoAcesso === 'REMOVER') {
    operacao = 'Removido';
  }
  return operacao;
}

export function situacao(baseDados: BaseDados): BaseDados {
  baseDados.situacao = '';
  baseDados.cls = '';

  if (baseDados.diasAteVencimento == null) {
    baseDados.situacao = '';
    baseDados.cls = 'muted';
  } else if (baseDados.diasAteVencimento < 0) {
    baseDados.situacao = 'Vencido';
    baseDados.cls = 'danger';
  } else if (baseDados.diasAteVencimento === 0) {
    baseDados.situacao = 'Vence hoje';
    baseDados.cls = 'warning';
  } else if (baseDados.diasAteVencimento <= 15) {
    baseDados.situacao = 'Vencimento próximo';
    baseDados.cls = 'info';
  } else if (baseDados.diasAteVencimento > 15) {
    baseDados.situacao = 'Em vigência';
    baseDados.cls = 'success';
  }

  return baseDados;
}
