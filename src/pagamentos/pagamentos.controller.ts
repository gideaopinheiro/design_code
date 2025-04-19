import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CriarPagamentoDto } from './criar-pagamento.dto';
import { RealizarPagamentoUseCase } from './usecases/realizar-pagamento.usecase';
import { BuscarPagamentoUseCase } from './usecases/buscar-pagamento.usecase';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('pagamentos')
export class PagamentosController {
  constructor(
    private readonly realizarPagamentoUseCase: RealizarPagamentoUseCase,
    private readonly buscarPagamentoUseCase: BuscarPagamentoUseCase,
    @Inject(CACHE_MANAGER) private readonly caching: Cache,
  ) {}

  @Post()
  async criarPagamento(@Body() data: CriarPagamentoDto) {
    const pagamento = await this.realizarPagamentoUseCase.executar(data);
    return pagamento.serializar();
  }

  @Get(':id')
  async buscarPagamento(@Param('id') id: string) {
    const pagamentoCache = await this.caching.get(id);
    if (pagamentoCache) {
      return pagamentoCache;
    }
    const pagamento = await this.buscarPagamentoUseCase.execute(id);
    const pagamentoSerializado = pagamento.serializar();
    await this.caching.set(pagamentoSerializado.id, pagamentoSerializado);
    return pagamentoSerializado;
  }
}
