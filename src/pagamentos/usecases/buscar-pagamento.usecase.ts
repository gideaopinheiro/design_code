import { Injectable } from '@nestjs/common';
import { PagamentosRepository } from '../repositories/pagamentos.repository';
import { Pagamento } from '../entities/pagamento';
import Bugsnag from '@bugsnag/js';

@Injectable()
export class BuscarPagamentoUseCase {
  constructor(private readonly pagamentoRepository: PagamentosRepository) {}

  async execute(id: string): Promise<Pagamento> {
    try {
      return await this.pagamentoRepository.buscarPagamentoPorId(id);
    } catch (error) {
      Bugsnag.notify(error);
      throw error;
    }
  }
}
