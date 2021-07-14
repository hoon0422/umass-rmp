import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Building } from './Building.entity';

@Entity()
export class SpireBuilding {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column({ length: 50 })
  name: string;

  @ManyToOne(() => Building)
  building: Building;
}
