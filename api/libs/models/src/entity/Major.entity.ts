import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Major {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column('varchar', { length: 70, unique: true })
  name: string;
}
