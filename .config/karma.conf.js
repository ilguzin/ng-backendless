// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function karmaConf(config) {
  config.set({
    basePath: '../',
    browsers: [/*'Chrome',*/ 'PhantomJS'],
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-jasmine-html-reporter')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'karma-typescript', 'kjhtml'],

    files: [
      'test/test.spec.ts',
      './ng-backendless.ts',
      'src/*.ts',
      'test/*.spec.ts'
    ],
    exclude: ["src/*.d.ts"],

    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.spec.json',
      exclude: ['src/*.d.ts'],
      coverageOptions: {
        exclude: /\.(d|spec|test)\.ts?/,
      },
      reports: {
        // "html": "coverage",
        // "text": "",
        "lcovonly": "coverage"
      },
    }

  });
};
