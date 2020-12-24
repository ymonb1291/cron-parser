import { Rhum } from "./deps_test.ts";

import { Config } from "./config.ts";
import { Chrono } from "./deps.ts";

Rhum.testPlan("config_test.ts", () => {
  Rhum.testSuite("endDate", () => {
    Rhum.testCase("Defaults to '31 Dec 2099 23:59:59'", () => {
      const expect = new Date("31 Dec 2099 23:59:59");

      const result = new Config({});
      Rhum.asserts.assertEquals(result.endDate.getTime(), expect.getTime());
    });

    Rhum.testCase("Allows option as string", () => {
      const value = `value Dec ${new Date().getFullYear() + 1} 23:59:59`;
      const expect = new Date(value);

      const result = new Config({ endDate: value });
      Rhum.asserts.assertEquals(result.endDate.getTime(), expect.getTime());
    });

    Rhum.testCase("Allows option as number", () => {
      const value = Date.now() + 10000;
      const expect = new Date(value);

      const result = new Config({ endDate: value });
      Rhum.asserts.assertEquals(result.endDate.getTime(), expect.getTime());
    });

    Rhum.testCase("Allows option as Date object", () => {
      const value = new Date(Date.now() + 10000);
      const expect = new Date(value);

      const result = new Config({ endDate: value });
      Rhum.asserts.assertEquals(result.endDate.getTime(), expect.getTime());
    });

    Rhum.testCase("Allows option as Chrono object", () => {
      const value = new Chrono(Date.now() + 10000);
      const expect = new Date(value);

      const result = new Config({ endDate: value });
      Rhum.asserts.assertEquals(result.endDate.getTime(), expect.getTime());
    });

    Rhum.testCase(
      "Equals '31 Dec 2099 23:59:59' when the option is in the past",
      () => {
        const expect = new Date("31 Dec 2099 23:59:59");

        const result = new Config({ endDate: "31 Dec 1900" });
        Rhum.asserts.assertEquals(result.endDate.getTime(), expect.getTime());
      },
    );

    Rhum.testCase(
      "Equals '31 Dec 2099 23:59:59' when the option equals the current time",
      () => {
        const expect = new Date("31 Dec 2099 23:59:59");

        const result = new Config({ endDate: Date.now() });
        Rhum.asserts.assertEquals(result.endDate.getTime(), expect.getTime());
      },
    );
  });

  Rhum.testSuite("firstDayOfWeek", () => {
    Rhum.testCase("Defaults to '1'", () => {
      const result = new Config({});
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 1);
    });

    Rhum.testCase("Equals '1' with a negative option", () => {
      const result = new Config({ firstDayOfWeek: -1 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 1);
    });

    Rhum.testCase("Equals '0' with option set to 0", () => {
      const result = new Config({ firstDayOfWeek: 0 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 0);
    });

    Rhum.testCase("Equals '1' with option set to 1", () => {
      const result = new Config({ firstDayOfWeek: 1 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 1);
    });

    Rhum.testCase("Equals '2' with option set to 2", () => {
      const result = new Config({ firstDayOfWeek: 2 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 2);
    });

    Rhum.testCase("Equals '3' with option set to 3", () => {
      const result = new Config({ firstDayOfWeek: 3 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 3);
    });

    Rhum.testCase("Equals '4' with option set to 4", () => {
      const result = new Config({ firstDayOfWeek: 4 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 4);
    });

    Rhum.testCase("Equals '5' with option set to 5", () => {
      const result = new Config({ firstDayOfWeek: 5 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 5);
    });

    Rhum.testCase("Equals '6' with option set to 6", () => {
      const result = new Config({ firstDayOfWeek: 6 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 6);
    });

    Rhum.testCase("Equals '1' with option set to a value > 6", () => {
      const result = new Config({ firstDayOfWeek: 7 });
      Rhum.asserts.assertEquals(result.firstDayOfWeek, 1);
    });
  });
});

Rhum.run();
