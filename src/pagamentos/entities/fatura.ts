import * as moment from 'moment';
import { ItemFatura, ItemFaturaProps } from './item-fatura';
import { randomUUID } from 'crypto';

export class Fatura {
  private static errors: Error[] = [];
  private _itensFatura: ItemFatura[] = [];

  private constructor(
    private readonly _id: string,
    private _valor: number,
    private _status: FaturaStatus,
    private _dataPagamento: Date,
  ) {}

  public static criaNovo(props: NovaFaturaProps): Fatura {
    if (!this.valoresEstaoEmCentavos(props.valor, props.itensFatura)) {
      this.errors.push(
        new Error('O valor da invoice e dos itens precisam ser inteiros'),
      );
    }

    if (!this.valorTotalValido(props.valor, props.itensFatura)) {
      this.errors.push(
        new Error(
          'O somatórios dos valores dos itens da fatura precisam ser exatamente igual ao valor total',
        ),
      );
    }

    if (!this.dataPagamentoAPartirDeHoje(props.dataPagamento)) {
      this.errors.push(
        new Error(
          'A data de pagamento da fatura precisa ser maior ou igual a data de hoje',
        ),
      );
    }

    if (this.errors.length > 0) {
      console.log(this.errors);
      return;
    }

    const id = randomUUID();
    const fatura = new Fatura(
      id,
      props.valor,
      FaturaStatus.PENDENTE,
      props.dataPagamento,
    );
    fatura.addItensFatura(props.itensFatura);
    return fatura;
  }

  public static criar(props: FaturaProps): Fatura {
    const fatura = new Fatura(
      props.id,
      props.valor,
      props.status,
      props.dataPagamento,
    );
    fatura.addItensFatura(props.itensFatura);
    return fatura;
  }

  private addItensFatura(itensFaturaProps: ItemFaturaProps[]) {
    itensFaturaProps.forEach((itemProps) => {
      this.addItemFatura(itemProps);
    });
  }

  private addItemFatura(itemFaturaProps: ItemFaturaProps) {
    const itemFatura = new ItemFatura(
      itemFaturaProps.valor,
      itemFaturaProps.descricao,
    );
    this._itensFatura.push(itemFatura);
  }

  private static valorTotalValido(
    valorFatura: number,
    itensFatura: ItemFaturaProps[],
  ): boolean {
    const sum = itensFatura.reduce((acc, curr) => acc + curr.valor, 0);
    return sum === valorFatura;
  }

  private static dataPagamentoAPartirDeHoje(dataPagamento: Date): boolean {
    const today = moment().startOf('day');
    const dataPagamentoNoTime = moment(dataPagamento).startOf('day');
    return dataPagamentoNoTime.isSameOrAfter(today);
  }

  private static valoresEstaoEmCentavos(
    valorFatura: number,
    itensFatura: ItemFaturaProps[],
  ): boolean {
    const valorFaturaInteiro = Number.isInteger(valorFatura);
    const valoresItensInteiros = itensFatura.every((item) =>
      Number.isInteger(item.valor),
    );
    return valorFaturaInteiro && valoresItensInteiros;
  }

  get id(): string {
    return this._id;
  }

  get valor(): number {
    return this._valor;
  }

  get status(): FaturaStatus {
    return this._status;
  }

  get dataPagamento(): Date {
    return this._dataPagamento;
  }

  get itensFatura(): ItemFatura[] {
    return this._itensFatura;
  }

  public serializar() {
    return {
      id: this.id,
      valor: this.valor,
      status: this.status,
      dataPagamento: this.dataPagamento,
      itensFatura: this.itensFatura.map((item) => item.serializar()),
    };
  }
}

export enum FaturaStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  CANCELADO = 'cancelado',
}

export type FaturaProps = {
  id: string;
  valor: number;
  status: FaturaStatus;
  dataPagamento: Date;
  itensFatura: ItemFaturaProps[];
};

export type NovaFaturaProps = Omit<FaturaProps, 'id' | 'status'>;
