import { Injectable } from '@nestjs/common';
import { PagamentosRepository } from '../repositories/pagamentos.repository';
import { Pagamento } from '../entities/pagamento';

@Injectable()
export class BuscarPagamentoUseCase {
  constructor(private readonly pagamentoRepository: PagamentosRepository) {}

  async execute(id: string): Promise<Pagamento> {
    return await this.pagamentoRepository.buscarPagamentoPorId(id);
  }
}
