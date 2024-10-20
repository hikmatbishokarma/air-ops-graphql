import {
  DeleteManyResponse,
  UpdateManyResponse,
} from 'src/interfaces/query-response.interface';
import { DeepPartial } from '../deep-partial.type';
import { Filter } from 'src/interfaces/filter.interface';
import { Query } from 'src/interfaces/query.interface';

export interface QueryService<DTO, C = DeepPartial<DTO>, U = DeepPartial<DTO>> {
  /**
   * Query for multiple records of type `T`.
   * @param query - the query used to filer, page or sort records.
   * @returns a promise with an array of records that match the query.
   */
  query(query: Query<DTO>): Promise<DTO[]>;

  /**
   * Create a single record.
   *
   * @param item - the record to create.
   * @returns the created record.
   */
  createOne(item: C): Promise<DTO>;

  /**
   * Creates a multiple record.
   *
   * @param items - the records to create.
   * @returns a created records.
   */
  createMany(items: C[]): Promise<DTO[]>;

  /**
   * Update one record.
   * @param id - the id of the record to update
   * @param update - The update to apply.
   * @param opts - Additional opts to apply when updating one entity.
   * @returns the updated record.
   */
  updateOne(id: string | number, update: U, opts?: any): Promise<DTO>;

  /**
   * Updates multiple records using a filter.
   * @param update - the update to apply.
   * @param filter - the filter used to specify records to update
   */
  updateMany(update: U, filter: Filter<DTO>): Promise<UpdateManyResponse>;

  /**
   * Delete a single record by id.
   * @param id - the id of the record to delete.
   * @param opts - Additional opts to apply when deleting by id.
   */
  deleteOne(id: number | string, opts?: DTO): Promise<DTO>;

  /**
   * Delete multiple records using a filter.
   *
   * @param filter - the filter to find records to delete.
   */
  // deleteMany(filter: DTO): Promise<DeleteManyResponse>;
}
