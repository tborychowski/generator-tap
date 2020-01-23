const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	prompting () {
		const prompts = [
			{
				type: 'list',
				name: 'type',
				message: 'Select application type',
				choices: [
					{ name: 'CLI app', value: 'cli' },
					{ name: 'UI demo app', value: 'ui' },
					{ name: 'Full stack (svelte, stylus, express, sequelize, rollup)', value: 'fullstack' },
				]
			}
		];
		return this.prompt(prompts).then(props => this.props = props);
	}

	writing () {
		const templates = [{ src: 'common/README.md', dest: 'README.md' }];
		const assets = [
			{ src: 'common/_editorconfig', dest: '.editorconfig' },
			{ src: 'common/_eslintrc', dest: '.eslintrc' },
			{ src: 'common/_gitignore', dest: '.gitignore' },
			{ src: 'common/_npmrc', dest: '.npmrc' },
			{ src: 'common/LICENSE', dest: 'LICENSE' },
		];

		if (this.props.type === 'cli') {
			templates.push(
				{ src: 'cli/index.js', dest: 'index.js' },
				{ src: 'cli/install.sh', dest: 'install.sh' },
				{ src: 'cli/package.json', dest: 'package.json' },
			);
		}

		else if (this.props.type === 'ui') {
			assets.push({ src: 'ui/index.css', dest: 'index.css'});
			templates.push(
				{ src: 'ui/index.html', dest: 'index.html' },
				{ src: 'ui/package.json', dest: 'package.json' },
			);
		}

		else if (this.props.type === 'fullstack') {
			assets.push(
				{ src: 'fullstack/client',      dest: 'client' },
				{ src: 'fullstack/server',      dest: 'server' },
				{ src: 'fullstack/assets',      dest: 'assets' },
				{ src: 'fullstack/app.js',      dest: 'app.js' },
				{ src: 'fullstack/_env',        dest: '.env' },
				{ src: 'fullstack/_eslintrc',   dest: '.eslintrc' },
				{ src: 'fullstack/gulpfile.js', dest: 'gulpfile.js' },
			);
			templates.push(
				{ src: 'fullstack/assets/manifest.json', dest: 'assets/manifest.json' },
				{ src: 'fullstack/server/index.html', dest: 'server/index.html' },
				{ src: 'fullstack/package.json', dest: 'package.json' },
			);
		}

		assets.forEach(a => this.fs.copy(this.templatePath(a.src), this.destinationPath(a.dest)));

		const params = {name: this.appname, safename: this.appname.toLowerCase().replace(/\s/g, '-') };
		templates.forEach(t => this.fs.copyTpl(this.templatePath(t.src), this.destinationPath(t.dest), params));
	}


	install () {
		this.yarnInstall();
	}
};
