import { test } from "node:test";
import assert from "node:assert/strict";
import { parseReviews, parseStats } from "../lib/content/schema.ts";

test("platná recenze projde, volitelná pole jsou null", () => {
  const { value, errors } = parseReviews([
    { id: "jana-n", author: "Jana N.", text: "Skvělá spolupráce." },
  ]);
  assert.deepEqual(errors, []);
  assert.deepEqual(value, [
    { id: "jana-n", author: "Jana N.", text: "Skvělá spolupráce.", context: null, rating: null, date: null },
  ]);
});

test("recenze bez textu, s duplicitním id nebo hodnocením 6 neprojde", () => {
  const { value, errors } = parseReviews([
    { id: "a", author: "A", text: "Text" },
    { id: "a", author: "B", text: "Text" },
    { id: "c", author: "C", text: "" },
    { id: "d", author: "D", text: "Text", rating: 6 },
  ]);
  assert.equal(value.length, 1);
  assert.equal(errors.length, 3);
});

test("datum jen RRRR-MM nebo RRRR-MM-DD", () => {
  assert.equal(parseReviews([{ id: "a", author: "A", text: "T", date: "3/2025" }]).errors.length, 1);
  assert.equal(parseReviews([{ id: "a", author: "A", text: "T", date: "2025-03" }]).errors.length, 0);
});

test("statistiky: číslo je text, aby zůstalo „120+“", () => {
  const { value, errors } = parseStats({
    note: "Podle profilu",
    items: [{ value: "120+", label: "prodaných nemovitostí" }, { value: "", label: "x" }],
  });
  assert.equal(errors.length, 1);
  assert.deepEqual(value.items, [{ value: "120+", label: "prodaných nemovitostí" }]);
});

test("statistiky ve špatném tvaru", () => {
  assert.equal(parseStats([]).errors.length, 1);
});
