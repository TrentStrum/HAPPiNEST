export interface DataAccessInterface<T> {
  getById(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  getByKey?(key: string, value: string, single?: boolean): Promise<T | T[]>;
} 