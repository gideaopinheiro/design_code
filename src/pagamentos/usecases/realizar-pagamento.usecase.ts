import { Injectable } from '@nestjs/common';
import { PagamentosRepository } from '../repositories/pagamentos.repository';
import { RealizarPagamentoDto } from './dtos/realizar-pagamento.dto';
import { Pagamento } from '../entities/pagamento';
import Bugsnag from '@bugsnag/js';

@Injectable()
export class RealizarPagamentoUseCase {
  constructor(private readonly pagamentoRepository: PagamentosRepository) {}
  async executar(data: RealizarPagamentoDto) {
    try {
      const pagamento = Pagamento.criaNovo(data);
      const pagamentoRealizado =
        await this.pagamentoRepository.registrarPagamento(pagamento);
      return pagamentoRealizado;
    } catch (error) {
      Bugsnag.notify(error);
      throw new error();
    }
  }
}
