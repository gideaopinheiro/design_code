import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagamentoModel } from '../models/pagamento.model';
import { UsuarioModel } from '../models/usuario.model';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario';
import { Pagamento } from '../entities/pagamento';

@Injectable()
export class PagamentosRepository {
  constructor(
    @InjectRepository(PagamentoModel)
    private readonly pagamentosRepository: Repository<PagamentoModel>,
    @InjectRepository(UsuarioModel)
    private readonly usuariosRepository: Repository<UsuarioModel>,
  ) {}

  async registrarPagamento(pagamento: Pagamento): Promise<Pagamento> {
    const usuario = Usuario.criaNovo(pagamento.usuario);
    const usuarioEntity = this.usuariosRepository.create(usuario.serializar());
    const savedUser = await this.usuariosRepository.save(usuarioEntity);
    const pagamentoModel = this.pagamentosRepository.create(
      pagamento.serializar(),
    );
    pagamentoModel.fatura.usuario = savedUser;
    pagamentoModel.usuario = savedUser;
    const pagamentoSalvo = await this.pagamentosRepository.save(pagamentoModel);

    return Pagamento.criar(pagamentoSalvo);
  }

  async buscarPagamentoPorId(id: string): Promise<Pagamento> {
    const pagamento = await this.pagamentosRepository.findOneBy({ id });
    return Pagamento.criar(pagamento);
  }
}
