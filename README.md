spiffy [![Build Status](https://travis-ci.org/mzabriskie/spiffy.png?branch=master)](https://travis-ci.org/mzabriskie/spiffy)
======

CSS3 Selector Tool for JavaScript

## What is Spiffy?

##### Spiffy is a standalone CSS3 selector tool

Spiffy started out as an academic exercise to better understand CSS3 selectors. Once the work was done I decided to publish it for the benefit of others.

## What does Spiffy do?

##### Spiffy provides metadata about CSS3 selectors

The current version of Spiffy provides the ability to:

- parse a selector to get detailed information about the selector
- explain a selector to understand it's category, key and specificity
- match an element to a selector

Planned for future version:

- search a document for elements matching a selector

## How is Spiffy used?

##### This is how we do it…

Parsing a selector:

```js
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
```

Explaining a selector:

```js
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
```

Matching a selector:

```js
// Determine if an element matches a selector
if (Spiffy.match(element, '#foo.bar')) {
	alert('match found!');
}
```

## License

Spiffy is released under the MIT license.