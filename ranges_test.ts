import { Rhum } from "./deps_test.ts";
import { Ranges } from "./ranges.ts";

Rhum.testPlan("ranges_test.ts", () => {
  Rhum.testSuite("DOM", () => {
    const prop: keyof typeof Ranges = "DOM";

    Rhum.testCase("Min value is '1'", () => {
      const expect = 1;
      const result = Ranges[prop].min;

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Max value is '31'", () => {
      const expect = 31;
      const result = Ranges[prop].max;

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("DOW", () => {
    const prop: keyof typeof Ranges = "DOW";

    Rhum.testCase("Min value is '0'", () => {
      const expect = 0;
      const result = Ranges[prop].min;

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Max value is '6'", () => {
      const expect = 6;
      const result = Ranges[prop].max;

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("HOUR", () => {
    const prop: keyof typeof Ranges = "HOUR";

    Rhum.testCase("Min value is '0'", () => {
      const expect = 0;
      const result = Ranges[prop].min;

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Max value is '23'", () => {
      const expect = 23;
      const result = Ranges[prop].max;

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("MINUTE", () => {
    const prop: keyof typeof Ranges = "MINUTE";

    Rhum.testCase("Min value is '0'", () => {
      const expect = 0;
      const result = Ranges[prop].min;

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Max value is '59'", () => {
      const expect = 59;
      const result = Ranges[prop].max;

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("MONTH", () => {
    const prop: keyof typeof Ranges = "MONTH";

    Rhum.testCase("Min value is '1'", () => {
      const expect = 1;
      const result = Ranges[prop].min;

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Max value is '12'", () => {
      const expect = 12;
      const result = Ranges[prop].max;

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("SECOND", () => {
    const prop: keyof typeof Ranges = "SECOND";

    Rhum.testCase("Min value is '1'", () => {
      const expect = 1;
      const result = Ranges[prop].min;

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Max value is '60'", () => {
      const expect = 60;
      const result = Ranges[prop].max;

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("YEAR", () => {
    const prop: keyof typeof Ranges = "YEAR";

    Rhum.testCase("Min value is '" + new Date().getFullYear() + "'", () => {
      const expect = new Date().getFullYear();
      const result = Ranges[prop].min;

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Max value is '2099'", () => {
      const expect = 2099;
      const result = Ranges[prop].max;

      Rhum.asserts.assertEquals(result, expect);
    });
  });
});

Rhum.run();
