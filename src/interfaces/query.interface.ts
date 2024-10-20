/**
 * Enum for sorting either ASC or DESC.
 */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Null sort option.
 */
export enum SortNulls {
  /**
   * All nulls will be first.
   */
  NULLS_FIRST = 'NULLS FIRST',
  /**
   * All nulls will be last.
   */
  NULLS_LAST = 'NULLS LAST',
}

/**
 * Interface to sort a field.
 *
 * Example use in a [[Query]]
 *
 * ```ts
 * // ORDER BY name DESC
 * const query: Query<Item> = {
 *   sorting: [{ field: 'name', direction: SortDirection.DESC }],
 * }
 * ```
 *
 * To sort on multiple fields
 *
 * ```ts
 * // ORDER BY name DESC, age ASC
 * const query: Query<Item> = {
 *   sorting: [
 *     { field: 'name', direction: SortDirection.DESC },
 *     { field: 'age', direction: SortDirection.ASC },
 *   ],
 * }
 * ```
 *
 * @typeparam T - the type of object to sort.
 */
export interface SortField<T> {
  /**
   * A field in type T to sort on.
   */
  field: keyof T;
  /**
   * The direction of the sort (ASC or DESC)
   */
  direction: SortDirection;
  /**
   * The order that nulls values should be sorted.
   */
  nulls?: SortNulls;
}

/**
 * Interface for all queries to a collection of items.
 *
 * For example assume the following record type.
 *
 * ```ts
 * class Item {
 *   id: string;
 *   name: string;
 *   completed: boolean;
 * }
 * ```
 * Now lets create a query.
 *
 * ```ts
 * const query: Query<Item> = {
 *   filter: { name: { like: 'Foo%' } }, // filter name LIKE "Foo%"
 *   paging: { limit: 10, offset: 20}, // LIMIT 10 OFFSET 20
 *   sorting: [{ field: 'name', direction: SortDirection.DESC }], // ORDER BY name DESC
 * };
 * ```
 *
 * @typeparam T - the type of the object to query for.
 */

/**
 * Interface for paging a collection.
 */
export interface Paging {
  /**
   * The maximum number of items that should be in the collection.
   */
  limit?: number;
  /**
   * When paging through a collection, the offset represents the index to start at.
   */
  offset?: number;
}
import { Filter } from './filter.interface';

/**
 * Base interface for all types that allow filtering
 */
export interface Filterable<DTO> {
  /**
   * Filter to use when operating on a entities.
   *
   * When using with a single entity operation (e.g. findById) the filter can be used to apply an additional filter to
   * ensure that the entity belongs to a particular user.
   */
  filter?: Filter<DTO>;
}

export interface Query<T> extends Filterable<T> {
  /**
   * Option to page through the collection.
   */
  paging?: Paging;
  /**
   * Option to sort the collection.
   */
  sorting?: SortField<T>[];
}
