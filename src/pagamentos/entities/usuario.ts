import { randomUUID } from 'crypto';

export class Usuario {
  private constructor(
    private readonly _id: string,
    private _nome: string,
    private _status: UsuarioStatus,
  ) {}

  static criaNovo(props: NovoUsuarioProps): Usuario {
    const id = randomUUID();
    return new Usuario(id, props.nome, UsuarioStatus.ATIVO);
  }

  public static criar(props: UsuarioProps): Usuario {
    return new Usuario(props.id, props.nome, props.status);
  }

  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get status(): UsuarioStatus {
    return this._status;
  }

  public serializar() {
    return {
      id: this.id,
      nome: this.nome,
      status: this.status,
    };
  }
}

export type UsuarioProps = {
  id: string;
  nome: string;
  status: UsuarioStatus;
};

export type NovoUsuarioProps = Omit<UsuarioProps, 'id' | 'status'>;

export enum UsuarioStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

// const usuario = Usuario.criaNovo({ nome: 'Gideao' });
