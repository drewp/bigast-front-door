import builtins from "rollup-plugin-node-builtins";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

const workaround_jsonld_module_system_picker = "process = {version: '1.0.0'}";
const workaround_some_browser_detector = "global = window";

const workaround_jsonld_expand_issue = {
  namedExports: {
    "../streamed-graph/node_modules/jsonld/lib/index.js": ["expand"], // fixes "expand is not exported by node_modules/jsonld/lib/index.js"
  },
};

export default [
  {
    input: "src/index.ts",
    output: {
      file: "/my/site/homepage/www/homeauto/frontDoor/build/bundle.js",
      format: "esm",
      intro: `const ${workaround_some_browser_detector}, ${workaround_jsonld_module_system_picker};`,
    },

    plugins: [
      builtins(),
      resolve({
        extensions: [".js", ".ts"],
        browser: true,
      }),
      typescript(),
      postcss({
        inject: false,
      }),
      commonjs(workaround_jsonld_expand_issue),
      //terser() // 1500 -> 500kB, but slow. put it in the docker builder only.
    ],
  },
];
