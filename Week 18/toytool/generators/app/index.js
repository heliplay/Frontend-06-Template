const Generator = require('yeoman-generator')

module.exports = class extends Generator {
//   The name `constructor` is important here
  constructor (args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)
    this.log('constructor')
    // Next, add your custom code
  }

  async initPackage () {
    const answer = await this.prompt([
      {
        type: 'input',
        name: 'projecnName',
        message: 'Your project name',
        default: this.appname
      }
    ])
    const pkgJson = {
      name: answer.projecnName,
      version: '1.0.0',
      description: '',
      scripts: {
        dev: 'webpack',
        test: 'mocha --require @babel/register',
        coverage: 'nyc mocha'
      },
      author: 'leo',
      license: 'ISC',
      devDependencies: {

      },
      dependencies: {

      }
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
  }

  install () {
    this.npmInstall(['vue'], { 'save-dev': false })
    this.npmInstall([
      'vue-loader',
      'vue-template-compiler',
      'vue-style-loader',
      'css-loader'
    ],
    { 'save-dev': true })

    this.npmInstall([
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'html-webpack-plugin',
      'clean-webpack-plugin'],
    { 'save-dev': true })

    this.npmInstall([
      'mocha',
      'nyc',
      '@istanbuljs/nyc-config-babel'
    ], { 'save-dev': true })

    this.npmInstall([
      '@babel/core',
      'babel-loader',
      '@babel/preset-env',
      '@babel/register',
      'babel-plugin-istanbul'
    ], { 'save-dev': true })
  }

  copyFiles () {
    this.fs.copyTpl(
      this.templatePath('src/HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
      { }
    )

    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath('src/index.html'),
      { title: 'vue1' }
    )

    this.fs.copyTpl(
      this.templatePath('src/main.js'),
      this.destinationPath('src/main.js'),
      { }
    )

    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      { }
    )

    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('babelrc.js'),
      { }
    )

    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
      { }
    )

    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
      { }
    )

    this.fs.copyTpl(
      this.templatePath('./sample/test.js'),
      this.destinationPath('./test/test.js'),
      { }
    )
  }
}
