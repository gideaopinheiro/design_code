import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CriarPagamentoDto } from './criar-pagamento.dto';
import { RealizarPagamentoUseCase } from './usecases/realizar-pagamento.usecase';
import { BuscarPagamentoUseCase } from './usecases/buscar-pagamento.usecase';

@Controller('pagamentos')
export class PagamentosController {
  constructor(
    private readonly realizarPagamentoUseCase: RealizarPagamentoUseCase,
    private readonly buscarPagamentoUseCase: BuscarPagamentoUseCase,
  ) {}

  @Post()
  async criarPagamento(@Body() data: CriarPagamentoDto) {
    const pagamento = await this.realizarPagamentoUseCase.executar(data);
    return pagamento.serializar();
  }

  @Get(':id')
  async buscarPagamento(@Param('id') id: string) {
    const pagamento = await this.buscarPagamentoUseCase.execute(id);
    return pagamento.serializar();
  }
}
