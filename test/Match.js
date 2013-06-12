var Spiffy = require('../src/Spiffy');

function Element(tagName, properties, attributes) {
    this.id = '';
    this.className = '';
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes || {};

    for (var key in properties || {}) {
        if (properties.hasOwnProperty(key)) {
            this[key] = properties[key];
        }
    }

    if (this.attributes.class) {
        this.className = this.attributes.class;
    }
}

Element.prototype.getAttribute = function (name) {
    return this.attributes[name] || null;
};

module.exports = {
    setUp: function (callback) {
        callback();
    },

    tearDown: function (callback) {
        callback();
    },

    testID: function (test) {
        var element = new Element('div', {id: 'foo'});

        test.ok(Spiffy.match(element, '#foo'));
        test.ok(!Spiffy.match(element, '#bar'));

        test.done();
    },

    testTagName: function (test) {
        var element = new Element('div');

        test.ok(Spiffy.match(element, 'div'));
        test.ok(!Spiffy.match(element, 'span'));

        test.done();
    },

    testClassName: function (test) {
        var element = new Element('div', {className:'foo bar baz'});

        test.ok(Spiffy.match(element, 'div.foo'));
        test.ok(Spiffy.match(element, 'div.bar'));
        test.ok(Spiffy.match(element, 'div.baz'));
        test.ok(Spiffy.match(element, 'div.foo.bar'));
        test.ok(Spiffy.match(element, 'div.foo.baz'));
        test.ok(Spiffy.match(element, 'div.bar.baz'));
        test.ok(Spiffy.match(element, 'div.foo.bar.baz'));
        test.ok(!Spiffy.match(element, '.fu.br.bz'));

        test.done();
    },

    testAttributes: function (test) {
        var element = new Element('input', null, {name:'email', value:'somebody@example.com', lang:'en-US', 'class':'foo bar'});

        test.ok(Spiffy.match(element, '[name]'));
        test.ok(Spiffy.match(element, '[name][value]'));
        test.ok(Spiffy.match(element, '[name=email]'));
        test.ok(Spiffy.match(element, '[value^=some]'));
        test.ok(Spiffy.match(element, '[value$=.com]'));
        test.ok(Spiffy.match(element, '[value*=example]'));
        test.ok(Spiffy.match(element, '[class~=foo]'));
        test.ok(Spiffy.match(element, '[class~=bar]'));
        test.ok(Spiffy.match(element, '[lang|=en]'));
        test.ok(Spiffy.match(element, '[lang|=en-US]'));

        test.done();
    },

    testPseudos: function (test) {
        var element = new Element('input', null, {name:'email', 'class':'extra-wide'});

        test.ok(Spiffy.match(element, ':not(.disabled)'));
        test.ok(!Spiffy.match(element, ':not(.extra-wide)'));

        test.done();
    }
};