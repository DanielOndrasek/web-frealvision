import { test } from "node:test";
import assert from "node:assert/strict";
import { isOfferedOnWeb } from "../lib/properties/scope.ts";

test("prodej na web patří", () => {
  assert.equal(isOfferedOnWeb({ ad_type: "prodej" }), true);
});

test("pronájem web nenabízí", () => {
  assert.equal(isOfferedOnWeb({ ad_type: "pronajem" }), false);
});

test("inzerát bez typu se bere jako prodej", () => {
  assert.equal(isOfferedOnWeb({ ad_type: null }), true);
});
