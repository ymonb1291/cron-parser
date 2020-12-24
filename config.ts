import { Chrono } from "./deps.ts";
import { Options } from "./options.interface.ts";

export class Config {
  public endDate: Chrono;
  public firstDayOfWeek: number;

  constructor(options: Options) {
    this.endDate = this.computeEndDate(options.endDate);
    this.firstDayOfWeek = this.computeFirstDayOfWeek(options.firstDayOfWeek);
  }

  private computeEndDate(value: Options["endDate"]): Chrono {
    const end = new Chrono("31 Dec 2099 23:59:59");

    if (!value) return end;

    let val = new Chrono(value);

    if (val.getTime() <= Date.now()) return end;
    return val;
  }

  private computeFirstDayOfWeek(value: Options["firstDayOfWeek"]): number {
    if (value === void 0 || value < 0 || value > 6) {
      return 1;
    }

    return value;
  }
}
