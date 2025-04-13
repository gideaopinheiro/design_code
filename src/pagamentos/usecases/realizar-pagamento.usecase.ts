import { Injectable } from '@nestjs/common';
import { PagamentosRepository } from '../repositories/pagamentos.repository';
import { RealizarPagamentoDto } from './dtos/realizar-pagamento.dto';
import { Pagamento } from '../entities/pagamento';

@Injectable()
export class RealizarPagamentoUseCase {
  constructor(private readonly pagamentoRepository: PagamentosRepository) {}
  async executar(data: RealizarPagamentoDto) {
    const pagamento = Pagamento.criaNovo(data);
    const pagamentoRealizado =
      await this.pagamentoRepository.registrarPagamento(pagamento);
    return pagamentoRealizado;
  }
}
