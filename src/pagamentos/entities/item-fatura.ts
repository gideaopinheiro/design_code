export class ItemFatura {
  constructor(
    private _valor: number,
    private _descricao: string,
  ) {}

  get valor(): number {
    return this._valor;
  }

  get descricao(): string {
    return this._descricao;
  }

  public serializar() {
    return {
      valor: this.valor,
      descricao: this.descricao,
    };
  }
}

export type ItemFaturaProps = {
  valor: number;
  descricao: string;
};
