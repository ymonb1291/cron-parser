/**
 * Predicate function for Array.prototype.filter() to remove duplicates
 * @param value element of the array
 * @param index index of the element
 * @param self array that contains the element
 * ```
 * findKey({a: "A", b: "B"}, "B"); // Returns: "b"
 * findKey({a: "A", b: "B"}, "C"); // Returns: undefined
 * ```
 */
export function findKey<T extends Record<string, unknown>>(
  obj: T,
  search: unknown,
): string | undefined {
  const keys = Object.keys(obj) as (string)[];

  return keys.find((key) => {
    return obj[key] === search;
  });
}

/**
 * Predicate function for Array.prototype.filter() to remove undefined values
 * @param value element of the array
 * ```
 * [0, false, null, "a", void 0].filter(removeUndefined); // Returns: [0, false, null, "a"]
 * ```
 */
export function removeUndefined<T>(value?: T): value is T {
  return value !== void 0;
}

/**
 * Allows Array.prototype.sort() to sort a numeric array in ascending order
 * @param a number
 * @param b number
 * ```
 * [2,3,1].sort(sortNumericArrayASC) // Returns: [1,2,3]
 * ```
 */
export function sortNumericArrayASC(a: number, b: number): number {
  return a - b;
}

/**
 * Predicate function for Array.prototype.filter() to remove duplicates
 * @param value element of the array
 * @param index index of the element
 * @param self array that contains the element
 * ```
 * [1,2,3,2,1].filter(unique); // Returns: [1,2,3]
 * ```
 */
export function unique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}
