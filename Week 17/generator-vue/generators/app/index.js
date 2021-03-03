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
        test: 'echo "Error: no test specified" && exit 1',
        dev: 'webpack'
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
    this.npmInstall(['vue-loader'], { 'save-dev': true })
    this.npmInstall(['vue-template-compiler'], { 'save-dev': true })

    this.npmInstall(['webpack'], { 'save-dev': true })
    this.npmInstall(['webpack-cli'], { 'save-dev': true })
    this.npmInstall(['html-webpack-plugin'], { 'save-dev': true })
    this.npmInstall(['clean-webpack-plugin'], { 'save-dev': true })
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
  }
}
