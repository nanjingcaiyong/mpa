const path = require('path')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue3 MPA project',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author',
    },
    lint: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Use ESLint to lint your code?',
    },
    ts: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Use Typescript to constraint your code?',
    },
    tailwind: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Use tailwind to reduce tap style code?',
    }
  },
  filters: {
    '+(build|config|src)/**/*.ts': 'ts',
    '+(build|config|src)/**/*.js': '!ts',
    'typings/**/*': 'ts',
    'tsconfig.json': 'ts',
    'tailwind.config.js': 'tailwind',
    '**/.eslint+(ignore|rc)': 'lint'
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
