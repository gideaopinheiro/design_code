import { Injectable } from '@nestjs/common';
import { PagamentosRepository } from '../repositories/pagamentos.repository';
import { Pagamento } from '../entities/pagamento';
import Bugsnag from '@bugsnag/js';
import { trace } from '@opentelemetry/api';
import { Span } from '@opentelemetry/sdk-trace-base';

@Injectable()
export class BuscarPagamentoUseCase {
  constructor(private readonly pagamentoRepository: PagamentosRepository) {}

  async execute(id: string): Promise<Pagamento> {
    try {
      const tracer = trace.getTracer('pagamentos.buscar');
      return tracer.startActiveSpan('pagamentos.buscar', async (span: Span) => {
        const result = await this.pagamentoRepository.buscarPagamentoPorId(id);
        span.end();
        return result;
      });
    } catch (error) {
      Bugsnag.notify(error);
      throw error;
    }
  }
}
