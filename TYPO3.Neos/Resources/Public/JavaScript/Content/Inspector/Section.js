/**
 * A section within a group within a tab in the inspector.
 */
define(
[
	'emberjs',
	'./PropertyEditor',
	'./ViewView',
	'Content/Model/NodeSelection'
], function(
	Ember,
	PropertyEditor,
	ViewView,
	NodeSelection
) {
	return Ember.View.extend({
		actions: {
			toggleCollapsed: function() {
				this.set('_collapsed', !this.get('_collapsed'));
				if (!this.get('inspector.configuration.' + this.get('_nodeType'))) {
					this.set('inspector.configuration.' + this.get('_nodeType'), {});
				}
				this.set('inspector.configuration.' + this.get('_nodeType') + '.' + this.get('group'), this.get('_collapsed'));
				Ember.propertyDidChange(this.get('inspector'), 'configuration');
			}
		},
		PropertyEditor: PropertyEditor,
		ViewView: ViewView,
		_hasValidationErrors: false,
		_collapsed: false,
		_nodeType: '',
		_automaticallyCollapsed: false,

		init: function() {
			this._super();

			var selectedNode = NodeSelection.get('selectedNode'),
				nodeType = (selectedNode.$element ? selectedNode.$element.attr('typeof').replace(/\./g,'_') : 'ALOHA'),
				collapsed = this.get('inspector.configuration.' + nodeType + '.' + this.get('groupName'));

			this.set('_nodeType', nodeType);
			if (collapsed === undefined) {
				collapsed = this.get('group.collapsed');
			}
			if (collapsed) {
				this.set('_collapsed', true);
				this.set('_automaticallyCollapsed', true);
			}
		},

		didInsertElement: function() {
			var that = this,
				properties = this.get('properties') || [];

			if (this.get('_collapsed')) {
				this.$().find('.neos-inspector-field,.neos-inspector-view').hide();
			}
			properties.forEach(function(property) {
				that.get('inspector.validationErrors').addObserver(property.key, that, '_validationErrorsDidChange');
			});
		},


		_onCollapsedChange: function() {
			var $content = this.$().find('.neos-inspector-field,.neos-inspector-view');
			if (this.get('_collapsed') === true) {
				$content.slideUp(200);
			} else {
				$content.slideDown(200);
			}
		}.observes('_collapsed'),

		_validationErrorsDidChange: function() {
			if (this.get('isDestroyed') === true) {
				return;
			}
			var that = this,
				hasValidationErrors = false;
			this.get('properties').forEach(function(property) {
				var validationErrors = that.get('controller.validationErrors.' + property.key) || [];
				if (validationErrors.length > 0) {
					hasValidationErrors = true;
				}
			});
			this.set('_hasValidationErrors', hasValidationErrors);
		}
	});
});