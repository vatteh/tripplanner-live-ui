var templates = {
	get: function(name) {
		return $('#templates [data-template-name=' + name + ']').clone()
	}
}