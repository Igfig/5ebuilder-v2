module.exports = {
  // See http://brunch.io for documentation.
  paths: {
    public: '..'
  },
  files: {
    javascripts: {joinTo: 'js/app.js'},
    stylesheets: {
		joinTo: 'css/styles.css',
		order: {
			before: ['app/css/settings.*',
			         'app/css/tools.*',
			         'app/css/generic.*',
			         'app/css/elements.*',
			         'app/css/objects.*',
			         'app/css/components.*'],
			after:	['app/css/trumps.*']
		}
	},
    templates: {joinTo: 'js/app.js'}
  },
  plugins: {
	  on: ['autoprefixer-brunch', 'postcss-brunch', 'precss'],
	  off: [],
	  postcss: {
	      processors: [
	          require('autoprefixer')(['last 8 versions']),
	          require('precss')
	      ]
	  },
	  autoReload: {enabled: false}
  },
  modules: {
	  wrapper: false
  }
}
