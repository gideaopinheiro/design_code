import { randomUUID } from 'crypto';
import { Fatura, FaturaProps, NovaFaturaProps } from './fatura';
import { NovoUsuarioProps, Usuario, UsuarioProps } from './usuario';

export class Pagamento {
  private _fatura: Fatura;
  private _usuario: Usuario;

  private constructor(
    private readonly _id: string,
    private _status: PagamentoStatus,
  ) {}

  public static criaNovo(props: CriarPagamentoProps): Pagamento {
    const id = randomUUID();
    const pagamento = new Pagamento(id, PagamentoStatus.PROCESSANDO);

    pagamento.addFatura(props.fatura);
    pagamento.addUsuario(props.usuario);

    return pagamento;
  }

  public static criar(props: PagamentoProps) {
    const pagamento = new Pagamento(props.id, props.status);

    pagamento.addFatura(props.fatura);
    pagamento.addUsuario(props.usuario);

    return pagamento;
  }

  get status(): PagamentoStatus {
    return this._status;
  }

  get usuario(): Usuario {
    return this._usuario;
  }

  private addFatura(faturaProps: FaturaProps | NovaFaturaProps) {
    if ('id' in faturaProps) {
      this._fatura = Fatura.criar(faturaProps);
      return;
    }
    this._fatura = Fatura.criaNovo(faturaProps);
  }

  private addUsuario(usuarioProps: UsuarioProps | NovoUsuarioProps) {
    if ('id' in usuarioProps) {
      this._usuario = Usuario.criar(usuarioProps);
      return;
    }
    this._usuario = Usuario.criaNovo(usuarioProps);
  }

  public serializar() {
    return {
      id: this._id,
      status: this.status,
      usuario: this._usuario.serializar(),
      fatura: this._fatura.serializar(),
    };
  }
}

export enum PagamentoStatus {
  PROCESSANDO = 'processando',
}

export type PagamentoProps = {
  id: string;
  fatura: FaturaProps;
  status: PagamentoStatus;
  usuario: UsuarioProps;
};

export type CriarPagamentoProps = Omit<PagamentoProps, 'id' | 'status'>;
