var DirtyForm = function() {
	var observed_forms = [];
	var selectors = 'input, select, textarea, .ui-switch-green';
	var exclude_selectors = '.select2-input';
	return {
		userMessage:"You have not saved your changes.\nDo you wish to proceed and lose your changes?",
		observeForm: function(form_id){
			observed_forms.push(form_id);
			var ele_container = $('#'+form_id);
			ele_container.find(selectors).not(exclude_selectors).each(function(){
				var type = $(this).get(0).type;
				if (type == "checkbox" || type == "radio") {
					$(this).data('initial-value', $(this).is(':checked'));
				}else {
					$(this).data('initial-value', $(this).val());
				}
			});
		},
		removeForm: function(form_id){
			observed_forms = jQuery.grep(observed_forms, function(value) {
				return value != form_id;
			});
		},
		removeAllForms: function() {
			observed_forms = [];
		},
		checkDirtyForms: function() {
			for(var i=0; i<observed_forms.length; i++) {
				var status = this.formIsDirty(observed_forms[i]);
				if (status!==false) return status;
			};
			return false;
		},
		formIsDirty:  function(form) {
			var elements = $('#'+form).find(selectors).not(exclude_selectors);
			var status_flag = false;
			for (var i = 0; i < elements.length; i++) {
				var type = elements[i].type;
				var ele = $(elements[i]);
				var value = "";
				if (type == "checkbox" || type == "radio") {
					value = ele.is(':checked');
				}else {
					value = ele.val();
				}

				if (ele.data('initial-value') != value ) {
					status_flag = true;
					return true;
				}
			}
			return status_flag;
		},
	}
}();

function dirtyFormCatcher() {
	if (DirtyForm.checkDirtyForms()){
		return DirtyForm.userMessage;
	}
	return;
}

$(window).bind('beforeunload', dirtyFormCatcher);


