import { Config } from "./config.ts";
import { Ranges } from "./ranges.ts";
import {
  findKey,
  removeUndefined,
  sortNumericArrayASC,
  unique,
} from "./utils.ts";

/** Lists all abreviations for days */
const DAYS: Readonly<string[]> = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

/** Defines the index of each field in the expression */
const INDEXES: Readonly<Record<Label, number>> = {
  second: 0,
  minute: 1,
  hour: 2,
  dom: 3,
  month: 4,
  dow: 5,
  year: 6,
};

/** Lists all abreviations for months */
const MONTHS: Readonly<string[]> = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/**
 * Enhanced labels are the names of fields which allow special characters
 * such as L, W or # for which no parsing is performed in Fields
 */
type EnhancedLabel = "dow" | "dom";

/** Name of fields */
export type Label = EnhancedLabel | NumericLabel;

/** 
 * Record of key/value pairs where:
 *  - keys are of type Label
 *  - values are string[] which contain fragments of fields
 */
type MappedFields = Record<Label, string[]>;

/** Name of fields which are not in the enhanced labels category */
type NumericLabel = "second" | "minute" | "hour" | "month" | "year";

/** 
 * Record of key/value pairs where:
 *  - keys are of type Label
 *  - values hold the result of the parsing either as number[] or as string
 */
type RecordOfLabels<T extends Label, U> = Record<T, U>;

/** Parses a cron expression into a record of parsed fields */
export class Fields
  implements
    RecordOfLabels<NumericLabel, number[]>,
    RecordOfLabels<EnhancedLabel, string | number[]> {
  /** Array that contains all possible values for seconds */
  public second: number[] = [];

  /** Array that contains all possible values for minutes */
  public minute: number[] = [];

  /** Array that contains all possible values for hours */
  public hour: number[] = [];

  /**
   * If the days-of-month field contains the characters L or W, then the field is returned
   * as-is for the Parser class. Otherwise, is key points to an array that contains all
   * possible values for days-of-month.
   */
  public dom: number[] | string = [];

  /** Array that contains all possible values for months */
  public month: number[] = [];

  /**
   * If the days-of-week field contains the characters L or #, then the field is returned
   * as-is for the Parser class. Otherwise, is key points to an array that contains all
   * possible values for days-of-week.
   */
  public dow: number[] | string = [];

  public wildcards: Label[] = [];

  /** Array that contains all possible values for years */
  public year: number[] = [];

  constructor(
    expression: string,
    config: Config,
  ) {
    this.parse(expression, config);
  }

  /** Creates an interval of values */
  private createInterval(min: number, max: number): number[] {
    const res: number[] = [];

    for (let i = min; i < max + 1; i++) {
      res.push(i);
    }

    return res;
  }

  /** Creates an interval of value by steps */
  private createSteps(fragment: string, min: number, max: number): number[] {
    const [, prefix, stepSize] = fragment.match(
      /([*]|\d+|(?:\d+-\d+))\/(\d+)/,
    ) as RegExpMatchArray;
    let population: number[];
    if (prefix.includes("-")) {
      const [, matchedMin, matchedMax] = fragment.match(
        /(\d+)-(\d+)/,
      ) as RegExpMatchArray;
      population = this.createInterval(Number(matchedMin), Number(matchedMax));
    } else if (prefix === "*") {
      population = this.createInterval(min, max);
    } else {
      population = this.createInterval(Number(prefix), max);
    }

    return population
      .map((value, key) => {
        if (key % Number(stepSize)) {
          return void 0;
        }
        return value;
      })
      .filter(removeUndefined);
  }

  /**
   * Validates a cron expression and returns a new object
   * of type MappedFields
   */
  private getFields(expression: string): MappedFields {
    const fields: string[] = this
      .validateExpression(expression)
      .split(/\s/g);

    const mappedFields: MappedFields = this.mapFields(fields);

    return this.validateFields(mappedFields);
  }

  /** Finds the value to return if a field is ? */
  private handleQuestionMark(label: Exclude<Label, "year">): number[] {
    const now = new Date();

    switch (label) {
      case "second":
        return [now.getSeconds()];
      case "minute":
        return [now.getMinutes()];
      case "hour":
        return [now.getHours()];
      case "dom":
        return [now.getDate()];
      case "month":
        return [now.getMonth() + 1];
      default:
        return [now.getDay()];
    }
  }

  /**
   * Loops through fragments of fields and returns
   * all possible values in an array
   */
  private loopThroughFragments(
    label: Label,
    field: string[],
    min: number,
    max: number,
  ): number[] {
    return field
      .map((fragment) => {
        if (fragment.includes("/")) {
          return this.createSteps(fragment, min, max);
        } else if (fragment.includes("-")) {
          const [, matchedMin, matchedMax] = fragment.match(
            /(\d+)-(\d+)/,
          ) as RegExpMatchArray;
          return this.createInterval(Number(matchedMin), Number(matchedMax));
        }
        return [Number(fragment)];
      })
      .flat()
      .map(value => {
        if(label === "dow" && value === 7) return 0
        return value;
      })
      .filter(unique)
      .sort(sortNumericArrayASC);
  }

  /** Converts an array of fields to a new MappedFields object */
  private mapFields(fields: string[]): MappedFields {
    const offset = fields.length === 5 ? 1 : 0;
    const res: Partial<MappedFields> = {};

    fields.forEach((field, index) => {
      const key = findKey(INDEXES, index + offset);
      if (key) {
        res[key as Label] = field.split(/(?<!^),(?!$)/g);
      }
    });

    if (!res.second) res["second"] = [];
    if (!res.year) res["year"] = [];

    return res as MappedFields;
  }

  /** Fills the second...year properties from a cron expression */
  private parse(expression: string, config: Config) {
    const fields: MappedFields = this.getFields(expression);
    this.parseFields(fields, config);
  }

  /** Parses enhanced fields (DOW, DOM) */
  private parseEnhancedField(
    label: EnhancedLabel,
    field: string[],
    min: number,
    max: number,
  ): number[] | string {
    // if label is dow, replace SUN-SAT by 0-6
    if (label === "dow") {
      field = this.replace(field, DAYS, 0);
    }

    // if label is dom and the first fragment of the field contains W or L,
    // return that fragment unchanged
    if (label === "dom" && (field[0].includes("W") || field[0].includes("L"))) {
      return field[0];
    }

    // if label is dow and the first fragment of the field contains L or #,
    // return that fragment unchanged
    if (label === "dow" && (field[0].includes("L") || field[0].includes("#"))) {
      return field[0];
    }

    return this.parseNumericField(label, field, min, max);
  }

  /** Saves the parsed fields to the second...year properties */
  private parseField(label: Label, field: string[], config: Config) {
    let min: number, max: number;

    switch (label) {
      case "dom":
      case "dow":
        const labelUC = label.toUpperCase() as Uppercase<EnhancedLabel>;
        min = Ranges[labelUC].min;
        max = Ranges[labelUC].max;

        this[label] = this.parseEnhancedField(label, field, min, max);
        break;

      default:
        [min, max] = label === "year"
          ? [new Date().getFullYear(), config.endDate.getFullYear()]
          : [
            Ranges[label.toUpperCase() as keyof typeof Ranges].min,
            Ranges[label.toUpperCase() as keyof typeof Ranges].max,
          ];

        this[label] = this.parseNumericField(label, field, min, max);
        break;
    }
  }

  /** Iterates through mappedFields */
  private parseFields(mappedFields: MappedFields, config: Config) {
    for (const [label, field] of Object.entries(mappedFields)) {
      this.parseField(label as Label, field, config);
    }
  }

  /** Parses fields which are not enhanced  */
  private parseNumericField(
    label: Label,
    field: string[],
    min: number,
    max: number,
  ): number[] {
    // if label is month, replace JAN-DEC by 1-12
    if (label === "month") {
      field = this.replace(field, MONTHS, 1);
    }

    // if label is anything but year and the first fragment of the field is ?,
    // return the corresponding value from the current date
    if (label !== "year" && field[0] === "?") {
      return this.handleQuestionMark(label);
    }

    // The first fragment of the field is * or there is no fragment at all
    // then we need to return the min-max interval
    if (!field.length || field[0] === "*") {
      this.wildcards.push(label);
      return this.createInterval(min, max);
    }

    // The field contains lists, ranges or steps
    return this.loopThroughFragments(label, field, min, max);
  }

  /**
   * Replaces days and months abbreviations (FRI, APR, ...)
   * by their numeric equivalent
   */
  private replace(
    field: string[],
    searchMasks: string[] | Readonly<string[]>,
    offset: number,
  ): string[] {
    return field.map((fragment) => {
      searchMasks.forEach((searchMask, key) => {
        const regEx = new RegExp(searchMask, "i");
        fragment = fragment.replace(regEx, String(key + offset));
      });

      return fragment;
    });
  }

  /** TODO */
  private validateFields(mappedFields: MappedFields): MappedFields {
    /**
     * TODO:
     *    Validate each field fragment by fragment.
     *    We want to check:
     *      - that each fragment has the correct characters set
     *      - that the syntax is OK
     */
    return mappedFields;
  }

  /** TODO */
  private validateExpression(expression: string): string {
    /**
     * TODO:
     *    Validate the expression
     *    We are checking:
     *      - that the expression contains 5-7 fields separated by spaces
     *      - that the expression contains exclusively the characters "*,-/LW?# "
     *      - that the expressions containing the characters LW# are not lists
     */
    return expression;
  }
}
