import Vue from 'vue';

import App from './App.vue';

import VueIziToast from 'vue-izitoast';
import 'izitoast/dist/css/iziToast.min.css';
Vue.use(VueIziToast);

//import Plugins
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

const requireComponent = require.context(
  // The relative path of the components folder
  '../../plugins',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /[A-Z]\w+\.(vue|js)$/
);

window.pluginList = [];

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName);
  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Strip the leading `./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  );
  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  );
  pluginList.push({
						uuid: (pluginList.length + 1),
						active: (pluginList.length == 0 ? true : false),
						module: componentName,
						label: componentConfig.default.data().config.label,
						icon: componentConfig.default.data().config.icon
					});
});

window.Event = new Vue(); //Handling events between siblings and grandparent to grandsons etc...

new Vue({
	el: '#app',
	data() {
		return {
			pluginsList: window.pluginList
		}
	},
	render(createElement) {
		return createElement(App, {
					props: {
						plugins: this.pluginsList
					}
				});
	}
})