import pluginQuery from "@tanstack/eslint-plugin-query";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  ...pluginQuery.configs["flat/recommended"],
  eslintConfigPrettier,
];
