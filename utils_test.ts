import { Rhum } from "./deps_test.ts";
import {
  findKey,
  removeUndefined,
  sortNumericArrayASC,
  unique,
} from "./utils.ts";

Rhum.testPlan("utils_test.ts", () => {
  Rhum.testSuite("findKey", () => {
    Rhum.testCase("Returns the key when match", () => {
      const expect = "b";
      const result = findKey({ a: "A", b: "B" }, "B");

      Rhum.asserts.assertEquals(result, expect);
    });

    Rhum.testCase("Returns undefined when no match", () => {
      const expect = void 0;
      const result = findKey({ a: "A", b: "B" }, "C");

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("removeUndefined", () => {
    Rhum.testCase("Removes only undefined", () => {
      const expect = [0, false, null, ""];
      const result = [0, false, null, "", void 0].filter(removeUndefined);

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("sortNumericArrayASC", () => {
    Rhum.testCase("Sorts the array in ascending order", () => {
      const expect = [1, 2, 3];
      const result = [2, 3, 1].sort(sortNumericArrayASC);

      Rhum.asserts.assertEquals(result, expect);
    });
  });

  Rhum.testSuite("unique", () => {
    Rhum.testCase("Removes duplicates", () => {
      const expect = [1, 2, 3];
      const result = [1, 2, 3, 2, 1].filter(unique);

      Rhum.asserts.assertEquals(result, expect);
    });
  });
});

Rhum.run();
