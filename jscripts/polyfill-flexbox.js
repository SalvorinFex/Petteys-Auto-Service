function addClass(el, className) {

    if (el.classList) {
		
        el.classList.add(className);

    } else {

        el.className += ' ' + className;

    }

}

function hasClass(el, className) {
	
	if (el.classList) {
		
		return el.classList.contains(className);

	} else {
		
	    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
			
	}
	
}

function q(selector) {

	return document.querySelector(selector);
	
}

function qa(selector) {
	
	return document.querySelectorAll(selector);
	
}

function forEach(selector, fn) { // Accepts both an array and a selector

    var elements = (typeof selector == 'string') ? qa(selector) : selector;
	if (elements.length > 0) {

	    for (var i = 0; i < elements.length; i++) {
	
	        fn(elements[i], i);
	
	    }
    
    }

}

forEach(['querySelector', 'querySelectorAll'], function(method) {
  var nativ = proto[method];
  proto[method] = function(selectors) {
    if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
      var id = this.id; // remember current element id
      this.id = 'ID_' + Date.now(); // assign new unique id
      selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
      var result = doc[method](selectors);
      this.id = id; // restore previous id
      return result;
    } else {
      return nativ.call(this, selectors); // use native code for other selectors
    }
  }
});

// Flex is not supported, add col*-class-less columns the proper classes   '.row > *:not([class^="col"])'
forEach('.row', function (el) {
    
    // Set width: (container_width - width_taken_by_columns_with_col_classes) / number_of_classless_columns
    // To do: wrapping when too many columns
    if (el.children.length < 6) { // distribute the remaining width in % evenly among the classless columns. to do: get number of columns from 100/width_of_classless_column. To do: sort out multi-line grids with specific column widths
	    
	    var space = 100; // %
	    forEach(el.querySelectorAll(':scope > [class^=col]'), function(el) {
			addClass(el, 'column');
// 				space -=  100 / (getStyle(el.parentNode, 'width').match(/[0-9]*/) / getStyle(el, 'width').match(/[0-9]*/)); // To do: get it from CSS rule

		    // Get each column's specified space in % via their col* class, substract it from 100 and distribute the result evenly among the classless columns // To do: get it from CSS rule
			var col_class = el.getAttribute('class').match(/col[^ ]*/)[0];
			if (col_class.split('col')[1].length < 2) { // Add the missing '1'
				
				col_class = 'col1' + col_class.split('col')[1]; 
			
			}
		    space -= ((col_class.split('col')[1][0] / col_class.split('col')[1][1]) * 100);
						    
	    });
		
		if (space < 1) {
			
			return;

		}

		// Set this row's classless columns width to space/number_of_classless_columns
		var new_width = space / (el.querySelectorAll(':scope > *').length - el.querySelectorAll(':scope > .column').length);
	    
	    forEach(el.querySelectorAll(':scope > *'), function (el) {
		    
		    if (!hasClass(el, 'column')) {

			    el.style.width = new_width + '%';
			
			}
		    
	    });
	    
    }
    
    
});
