const presets = [
  [
    "@babel/env",
    {
      targets: {
        ie: "11",
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
  [
    "minify", {
      "mangle": {
        "keepFnName": false,
        "keepClassName": false
      },
      "keepFnName": false,
      "keepClassName": false,
      "simplify": true,
      "removeConsole": true,
      "removeDebugger": true,
    }
  ]
];

const plugins = [
  "transform-es2015-modules-commonjs"
];
module.exports = { presets, plugins };
