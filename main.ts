import { parse } from "@std/csv/parse";

const a = await Deno.readTextFile("./test.csv");

const result = parse(a, { skipFirstRow: true });
console.log(result);