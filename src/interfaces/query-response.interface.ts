/**
 * The response from a delete many operation.
 */
export interface DeleteManyResponse {
  /**
   * The number of records deleted.
   */
  deletedCount: number;
}

/**
 * The response from an update many operation.
 */
export interface UpdateManyResponse {
  /**
   * The number of records deleted.
   */
  updatedCount: number;
}
