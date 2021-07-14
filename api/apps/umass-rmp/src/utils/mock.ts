import { ObjectLiteral, SelectQueryBuilder, Repository } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export type MockSelectQueryBuilder<T = any> = Partial<
  Record<keyof SelectQueryBuilder<T>, jest.Mock>
>;

export function createMockRepository<T extends ObjectLiteral>() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(
      () =>
        ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          getMany: jest.fn(),
          getOne: jest.fn(),
        } as MockSelectQueryBuilder<T>),
    ),
  } as MockRepository<T>;
}
