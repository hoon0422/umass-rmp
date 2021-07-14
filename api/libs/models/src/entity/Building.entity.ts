import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Building {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column({ length: 50 })
  name: string;
}
