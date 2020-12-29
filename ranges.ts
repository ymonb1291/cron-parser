import type { Label } from "./fields.ts";

type Ranges = Record<Uppercase<Label>, RecordOfRanges>;
type RecordOfRanges = Record<"max" | "min", number>;

/**
 * Structure that enumerates min and max values for each fields
 * @param max Max value
 * @param min Min value
 * ```
 * console.log(Ranges.HOUR.max); // Output: 23
 * ```
 */
export const Ranges: Ranges = class Range implements RecordOfRanges {
  public static readonly DOM = new Range(31, 1);
  public static readonly DOW = new Range(6, 0);
  public static readonly HOUR = new Range(23, 0);
  public static readonly MINUTE = new Range(59, 0);
  public static readonly MONTH = new Range(12, 1);
  public static readonly SECOND = new Range(60, 1);
  public static readonly YEAR = new Range(2099, Range.currentYear());

  private static currentYear(): number {
    return new Date().getFullYear();
  }

  private constructor(
    public max: number,
    public min: number,
  ) {}
};
