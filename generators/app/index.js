const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	prompting () {
		const prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'Project name',
				default: this.appname, // Default to current folder name
			},
			{
				type: 'confirm',
				name: 'addBackend',
				message: 'Add express.js backend?',
				default: false,
			},
		];

		return this.prompt(prompts).then(props => this.props = props);
	}

	writing () {
		if (this.props.addBackend) {
			this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
			this.fs.copy(this.templatePath('README.md'), this.destinationPath('README.md'));
			this.fs.copy(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'));
			this.fs.copy(this.templatePath('client'), this.destinationPath('client'));
			this.fs.copy(this.templatePath('config'), this.destinationPath('config'));
			this.fs.copy(this.templatePath('server'), this.destinationPath('server'));
			this.fs.copy(this.templatePath('app.js'), this.destinationPath('app.js'));
		}
		else {
			this.fs.copy(this.templatePath('index-simple.js'), this.destinationPath('index.js'));
			this.fs.copy(this.templatePath('index-simple.css'), this.destinationPath('index.css'));
		}

		this.fs.copy(this.templatePath('_editorconfig'), this.destinationPath('.editorconfig'));
		this.fs.copy(this.templatePath('_eslintrc'), this.destinationPath('.eslintrc'));
		this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
		this.fs.copy(this.templatePath('_npmrc'), this.destinationPath('.npmrc'));
		this.fs.copy(this.templatePath('LICENSE'), this.destinationPath('LICENSE'));

		this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), { title: this.props.name });

		// index.html
		const indexSrc = this.props.addBackend ? 'server/index.html' : 'index-simple.html';
		const indexTar = this.props.addBackend ? 'server/index.html' : 'index.html';
		this.fs.copyTpl(this.templatePath(indexSrc), this.destinationPath(indexTar), { title: this.props.name });

		// package.json
		const pkgName = `package-${this.props.addBackend ? 'complex' : 'simple'}.json`;
		const pkg = this.fs.readJSON(this.templatePath(pkgName));
		pkg.name = this.props.name.toLowerCase().replace(/\s/g, '-');
		this.fs.writeJSON(this.destinationPath('package.json'), pkg);
	}


	install () {
		if (this.props.addBackend) this.yarnInstall();
	}
};
