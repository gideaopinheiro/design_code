import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FaturaModel } from './fatura.model';

@Entity('itens_fatura')
export class ItemFaturaModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  valor: number;

  @Column({ type: 'varchar', length: 512, nullable: false })
  descricao: string;

  @ManyToOne((type) => FaturaModel, (fatura) => fatura.itensFatura)
  @JoinColumn({ name: 'fatura_id' })
  fatura: FaturaModel;
}
