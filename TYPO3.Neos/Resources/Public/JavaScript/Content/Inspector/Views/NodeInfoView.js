define([
	'Library/jquery-with-dependencies',
	'emberjs',
	'text!./NodeInfoView.html'
],
function(
	$,
	Ember,
	template
) {
	Ember.HTMLBars.helpers.registerHelper('formatDate', function(value) {
		// Fallback if the value is undefined,
		// since the Date Object requires a string/Datetime-Object as the first parameter.
		if (typeof value === 'undefined') {
			return new Date(value).toISOString().slice(0, 16).replace('T', ' ');
		} else {
			return '';
		}
	});
	return Ember.View.extend({
		template: Ember.Handlebars.compile(template)
	});
});