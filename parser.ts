import { Config } from "./config.ts";
import { Fields } from "./fields.ts";

import type { Options } from "./options.interface.ts";

export class CronParser {
  #config: Config;
  #fields: Fields;

  constructor(
    expression: string,
    options: Options = {},
  ) {
    this.#config = new Config(options);
    this.#fields = new Fields(expression, this.#config);
  }

  public next() {}
}
