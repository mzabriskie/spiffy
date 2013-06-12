spiffy
======

CSS3 Selector Tool for JavaScript

	// Parse a selector
	Spiffy.parse('#foo .bar');

	// Output from call above
	[
    	[{
        	'ID': 'foo',
	        'attributes': undefined,
    	    'classes': undefined,
        	'pseudos': undefined,
	        'scope': '*',
    	    'tagName': undefined
	    }, {
    	    'ID:' undefined,
        	'attributes': undefined,
	        'classes': ['bar'],
    	    'pseudos': undefined,
	        'scope': '*',
    	    'tagName': undefined
	    }]
	]

	// Explain a selector
	Spiffy.explain('#foo .bar');

	// Output from call above
	{
    	'category': 'class',
	    'key': 'bar',
	    'parsed': [...], // Whatever calling Spiffy.parse returns
	    'selector': '#foo .bar',
    	'specificity': [1, 1, 0]
	}

	// Determine if an element matches a selector
	if (Spiffy.match(element, '#foo.bar')) {
		alert('match found!');
	}
	