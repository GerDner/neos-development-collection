/**
 * Property Editor
 */
define(
[
	'emberjs',
	'Library/jquery-with-dependencies',
	'Shared/Configuration',
	'Shared/Notification'
], function(
	Ember,
	$,
	Configuration,
	Notification
) {
	return Ember.ContainerView.extend({
		propertyDefinition: null,
		value: null,
		isModified: false,
		hasValidationErrors: false,
		classNameBindings: ['isModified:neos-modified', 'hasValidationErrors:neos-error', 'editorClassName'],
		editorClassName: '',

		// a reference to the InspectorController (set from the outside in the Handlebars template)
		inspector: null,

		_valueDidChange: function() {
			if (this.get('inspector').isPropertyModified(this.get('propertyDefinition.key')) === true) {
				this.set('isModified', true);
			} else {
				this.set('isModified', false);
			}
		// we cannot just observe "value", but we also need to refresh when all properties changed (i.e. the user pressed apply).
		// Else, the change indication is not working correctly.
		}.observes('value', 'inspector.cleanProperties'),

		_validationErrorsDidChange: function() {
			if (this.get('isDestroyed') === true) {
				return;
			}
			var property = this.get('propertyDefinition.key'),
				validationErrors = this.get('inspector.validationErrors.' + property) || [];
			if (validationErrors.length > 0) {
				this.set('hasValidationErrors', true);
				this.$().tooltip('destroy').tooltip({
					animation: false,
					placement: 'bottom',
					title: validationErrors[0],
					trigger: 'manual'
				}).tooltip('show');
			} else {
				this.set('hasValidationErrors', false);
				this.$().tooltip('destroy');
			}
		},

		init: function() {
			this._super();
			this._loadView();
		},

		_loadView: function() {
			var that = this,
				propertyDefinition = this.get('propertyDefinition'),
				editor;

			Ember.bind(this, 'value', 'inspector.nodeProperties.' + propertyDefinition.key);

			var editorOptions = $.extend(true,
				{
					elementId: propertyDefinition.elementId,
					property: propertyDefinition.key,
					propertyType: propertyDefinition.type,
					inspector: Ember.computed.alias('_propertyEditor.inspector'),
					_propertyEditor: this,
					valueBinding: 'inspector.nodeProperties.' + propertyDefinition.key
				},
				Ember.get(propertyDefinition, 'ui.inspector.editorOptions') || {}
			);

			editor = Ember.get(propertyDefinition, 'ui.inspector.editor');

			if (!editor) {
				if (window.console && console.error) {
					console.error('Couldn\'t create editor for property "' + propertyDefinition.key + '" (no editor configured). Please check your NodeTypes.yaml configuration.');
				}
				Notification.error('Error loading inspector', 'Inspector property "' + propertyDefinition.key + '" could not be loaded because of a missing editor definition. See console for further details.');
				return;
			}

			if (editor.indexOf('Content/Inspector/Editors/') === 0) {
				// Rename old editor names for backwards compatibility
				editor = editor.replace('Content/Inspector/Editors/', 'TYPO3.Neos/Inspector/Editors/');
			}

			// Convert last part of editor path into dashed class name
			var editorName = editor.substring(editor.lastIndexOf('/') + 1);
			this.set('editorClassName', editorName.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase());

			require({context: 'neos'}, [editor], function(editorClass) {
				Ember.run(function() {
					if (!that.isDestroyed) {
						// It might happen that the editor was deselected before the require() call completed; so we
						// need to check again whether the view has been destroyed in the meantime.
						var editor = editorClass.create(editorOptions);
						that.set('currentView', editor);
					}
				});
			}, function(err) {
				if (window.console && window.console.error) {
					window.console.error('Couldn\'t create editor for property "' + propertyDefinition.key + '" Message: ' + err.message);
				}
				Notification.error('Error loading inspector', 'Inspector editor for property "' + propertyDefinition.key + '" could not be loaded. See console for further details.');
			});
		},

		_addValidationObserver: function() {
			if (!this.get('inspector.validationErrors')) {
				return;
			}
			this.get('inspector.validationErrors').addObserver(this.get('propertyDefinition.key'), this, '_validationErrorsDidChange');
		}.observes('inspector.validationErrors')
	});
});