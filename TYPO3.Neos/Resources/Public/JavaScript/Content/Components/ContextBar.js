/**
 * Context bar which can contain other views.
 */
define(
	[
		'emberjs'
	], function(Ember) {
		return Ember.Component.extend({
			tagName: 'div',
			elementId: 'neos-context-bar',
			template: null
		});
	}
);