type Identifiable = {
  uniqId?: string,
  resourceId: string,
};

/**
 * Get the ID of a SearchResultSerialized
 *
 * @param {SearchResultSerialized} item
 * @return {string}
 */
export const getId = (item: Identifiable) => item.uniqId || item.resourceId;

/**
 * Find a SearchResultSerialized using id
 *
 * @param {string} id
 * @param {SearchResultSerialized[]} items
 * @returns {SearchResultSerialized | undefined}
 */
export const findItemById = <T extends Identifiable>(id: string, items: T[]): T | undefined =>
  items.find(item => getId(item) === id);
