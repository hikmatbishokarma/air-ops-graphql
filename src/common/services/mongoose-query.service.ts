import { Document, Model as MongooseModel, UpdateQuery } from 'mongoose';
import { QueryService } from './query.service';
import { DeepPartial } from '../deep-partial.type';
import { NotFoundException } from '@nestjs/common';
import {
  DeleteManyResponse,
  UpdateManyResponse,
} from 'src/interfaces/query-response.interface';
import { Filter } from 'src/interfaces/filter.interface';
import { FilterQueryBuilder } from '../query/filter-query.builder';
import { Query } from 'src/interfaces/query.interface';

export class MongooseQueryService<Entity extends Document>
  implements QueryService<Entity, DeepPartial<Entity>, DeepPartial<Entity>>
{
  constructor(
    readonly model: MongooseModel<Entity>,
    readonly filterQueryBuilder: FilterQueryBuilder<Entity> = new FilterQueryBuilder(
      model,
    ),
  ) {}

  private ensureIdIsNotPresent(e: DeepPartial<Entity>): void {
    if (Object.keys(e).find((f) => f === 'id' || f === '_id')) {
      throw new Error('Id cannot be specified when updating or creating');
    }
  }

  /**
   * Query for multiple entities, using a Query from `@app/core`.
   *
   * @example
   * ```ts
   * const todoItems = await this.service.query({
   *   filter: { title: { eq: 'Foo' } },
   *   paging: { limit: 10 },
   *   sorting: [{ field: "create", direction: SortDirection.DESC }],
   * });
   * ```
   * @param query - The Query used to filter, page, and sort rows.
   */
  async query(query: Query<Entity>): Promise<Entity[]> {
    const { filterQuery, options } = this.filterQueryBuilder.buildQuery(query);
    return this.model.find(filterQuery, {}, options).exec();
  }

  /**
   * Creates a single entity.
   *
   * @example
   * ```ts
   * const todoItem = await this.service.createOne({title: 'Todo Item', completed: false });
   * ```
   * @param record - The entity to create.
   */
  async createOne(record: DeepPartial<Entity>): Promise<Entity> {
    this.ensureIdIsNotPresent(record);
    return this.model.create(record);
  }

  /**
   * Create multiple entities.
   *
   * @example
   * ```ts
   * const todoItem = await this.service.createMany([
   *   {title: 'Todo Item 1', completed: false },
   *   {title: 'Todo Item 2', completed: true },
   * ]);
   * ```
   * @param records - The entities to create.
   */
  async createMany(records: DeepPartial<Entity>[]): Promise<Entity[]> {
    records.forEach((r) => this.ensureIdIsNotPresent(r));
    return this.model.create(records);
  }

  /**
   * Update an entity.
   *
   * @example
   * ```ts
   * const updatedEntity = await this.service.updateOne(1, { completed: true });
   * ```
   * @param id - The `id` of the record.
   * @param update - A `Partial` of the entity with fields to update.
   * @param opts - Additional options
   */
  async updateOne(
    id: string,
    update: DeepPartial<Entity>,
    opts?: any,
  ): Promise<Entity> {
    this.ensureIdIsNotPresent(update);
    const filterQuery = this.filterQueryBuilder.buildIdFilterQuery(
      id,
      opts?.filter,
    );
    const doc = await this.model.findOneAndUpdate({ _id: id }, update, {
      new: true,
    });
    if (!doc) {
      throw new NotFoundException(
        `Unable to find ${this.model.modelName} with id: ${id}`,
      );
    }
    return doc;
  }

  /**
   * Update multiple entities with a `@app/core` Filter.
   *
   * @example
   * ```ts
   * const { updatedCount } = await this.service.updateMany(
   *   { completed: true }, // the update to apply
   *   { title: { eq: 'Foo Title' } } // Filter to find records to update
   * );
   * ```
   * @param update - A `Partial` of entity with the fields to update
   * @param filter - A Filter used to find the records to update
   */
  async updateMany(
    update: DeepPartial<Entity>,
    filter: Filter<Entity>,
  ): Promise<UpdateManyResponse> {
    this.ensureIdIsNotPresent(update);
    const filterQuery = this.filterQueryBuilder.buildFilterQuery(filter);
    const res = await this.model
      .updateMany(filterQuery, this.getUpdateQuery(update))
      .exec();
    return { updatedCount: res.matchedCount || 0 };
  }
  /* * ```ts
   * const deletedTodo = await this.service.deleteOne(1);
   * ```
   *
   * @param id - The `id` of the entity to delete.
   * @param opts - Additional filter to use when finding the entity to delete.
   */
  async deleteOne(id: string, opts?: any): Promise<Entity> {
    //const filterQuery = this.filterQueryBuilder.buildIdFilterQuery(id, opts?.filter);
    const doc = await this.model.findOneAndDelete({ _id: id });
    if (!doc) {
      throw new NotFoundException(
        `Unable to find ${this.model.modelName} with id: ${id}`,
      );
    }
    return doc;
  }

  /**
   * Delete multiple records with a `@app/core` `Filter`.
   *
   * @example
   *
   * ```ts
   * const { deletedCount } = this.service.deleteMany({
   *   created: { lte: new Date('2020-1-1') }
   * });
   * ```
   *
   * @param filter - A `Filter` to find records to delete.
   */
  async deleteMany(filter: Filter<Entity>): Promise<DeleteManyResponse> {
    const filterQuery = this.filterQueryBuilder.buildFilterQuery(filter);
    const res = await this.model.deleteMany(filterQuery).exec();
    return { deletedCount: res.deletedCount || 0 };
  }

  private getUpdateQuery(entity: DeepPartial<Entity>): UpdateQuery<Entity> {
    if (entity instanceof this.model) {
      return entity.modifiedPaths().reduce(
        (update: UpdateQuery<Entity>, k) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ({ ...update, [k]: entity.get(k) }),
        {},
      );
    }
    return entity as UpdateQuery<Entity>;
  }
}
