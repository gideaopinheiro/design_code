import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FaturaStatus } from '../entities/fatura';
import { ItemFaturaModel } from './item-fatura.model';
import { UsuarioModel } from './usuario.model';
import { PagamentoModel } from './pagamento.model';

@Entity('faturas')
export class FaturaModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  valor: number;

  @Column({ type: 'enum', enum: FaturaStatus, nullable: false })
  status: FaturaStatus;

  @Column({ name: 'data_pagamento', type: 'date', nullable: false })
  dataPagamento: Date;

  @OneToMany((type) => ItemFaturaModel, (itemFatura) => itemFatura.fatura, {
    cascade: ['insert'],
    eager: true,
  })
  itensFatura: ItemFaturaModel[];

  @ManyToOne((type) => UsuarioModel, (usuario) => usuario.faturas, {
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioModel;

  @OneToOne((type) => PagamentoModel, (pagamento) => pagamento.fatura)
  pagamento: PagamentoModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
