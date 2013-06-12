var Spiffy = require('../src/Spiffy');

function testResultEquality(test, selector, actual, expected) {
    test.equal(actual.length, expected.length, selector);

    testEquality(test, actual, expected);
}

function testEquality(test, val1, val2) {
    if (val2 && val2.constructor == Array) {
        testArrayEquality(test, val1, val2);
    } else if (typeof val2 == 'object') {
        testObjectEquality(test, val1, val2);
    } else {
        test.equal(val1, val2);
    }
}

function testArrayEquality(test, arr1, arr2) {
    test.ok(arr1 != null);
    test.ok(arr2 != null);
    test.equal(arr1.length, arr2.length);

    for (var i=0, l=arr1.length; i<l; i++) {
        testEquality(test, arr1[i], arr2[i]);
    }
}

function testObjectEquality(test, obj1, obj2) {
    test.ok(obj1 != null);
    test.ok(obj2 != null);

    for (var key in obj2) {
        if (!obj2.hasOwnProperty(key)) continue;

        testEquality(test, obj1[key], obj2[key]);
    }
}

module.exports = {
    setUp: function (callback) {
        callback();
    },

    tearDown: function (callback) {
        callback();
    },

    testID: function (test) {
        test.equal(Spiffy.parse('#foo').expressions[0].ID, 'foo', 'ID wasn\'t parsed');
        test.equal(Spiffy.parse('input#foo').expressions[0].ID, 'foo', 'ID wasn\'t parsed');
        test.equal(Spiffy.parse('input#foo.bar').expressions[0].ID, 'foo', 'ID wasn\'t parsed');
        test.equal(Spiffy.parse('input#foo.bar[name]').expressions[0].ID, 'foo', 'ID wasn\'t parsed');
        test.equal(Spiffy.parse('input#foo.bar[name]:focus').expressions[0].ID, 'foo', 'ID wasn\'t parsed');

        test.done();
    },

    testTagName: function (test) {
        test.equal(Spiffy.parse('input').expressions[0].tagName, 'input', 'tagName wasn\' parsed');
        test.equal(Spiffy.parse('input#foo').expressions[0].tagName, 'input', 'tagName wasn\' parsed');
        test.equal(Spiffy.parse('input#foo.bar').expressions[0].tagName, 'input', 'tagName wasn\' parsed');
        test.equal(Spiffy.parse('input#foo.bar[name]').expressions[0].tagName, 'input', 'tagName wasn\' parsed');
        test.equal(Spiffy.parse('input#foo.bar[name]:focus').expressions[0].tagName, 'input', 'tagName wasn\' parsed');

        test.done();
    },

    testClassName: function (test) {
        test.equal(Spiffy.parse('.bar').expressions[0].classes[0], 'bar', 'className wasn\'t parsed');
        test.equal(Spiffy.parse('input.bar').expressions[0].classes[0], 'bar', 'className wasn\'t parsed');
        test.equal(Spiffy.parse('input#foo.bar').expressions[0].classes[0], 'bar', 'className wasn\'t parsed');
        test.equal(Spiffy.parse('input#foo.bar[name]').expressions[0].classes[0], 'bar', 'className wasn\'t parsed');
        test.equal(Spiffy.parse('input#foo.bar[name]:focus').expressions[0].classes[0], 'bar', 'className wasn\'t parsed');

        test.done();
    },

    testAttributes: function (test) {
        //1. Test attributes length
        test.equal(Spiffy.parse('[name]').expressions[0].attributes.length, 1, 'attributes length is wrong');
        test.equal(Spiffy.parse('[name=email]').expressions[0].attributes.length, 1, 'attributes length is wrong');
        test.equal(Spiffy.parse('[name][value]').expressions[0].attributes.length, 2, 'attributes length is wrong');

        //2. Test attribute names
        test.equal(Spiffy.parse('[name][value]').expressions[0].attributes[0].name, 'name', 'attributes weren\'t parsed correctly');
        test.equal(Spiffy.parse('[name][value]').expressions[0].attributes[1].name, 'value', 'attributes weren\'t parsed correctly');

        //3. Test attribute values
        test.equal(Spiffy.parse('[name=email]').expressions[0].attributes[0].expected, 'email', 'attribute value is wrong');
        test.equal(Spiffy.parse('[name=email][value*=@]').expressions[0].attributes[1].expected, '@', 'attribute value is wrong');

        //4. Test attribute operators
        test.equal(Spiffy.parse('[name=email]').expressions[0].attributes[0].operator, '=', 'attribute operator is wrong');
        test.equal(Spiffy.parse('[name|=email]').expressions[0].attributes[0].operator, '|=', 'attribute operator is wrong');
        test.equal(Spiffy.parse('[name^=email]').expressions[0].attributes[0].operator, '^=', 'attribute operator is wrong');
        test.equal(Spiffy.parse('[name~=email]').expressions[0].attributes[0].operator, '~=', 'attribute operator is wrong');
        test.equal(Spiffy.parse('[name$=email]').expressions[0].attributes[0].operator, '$=', 'attribute operator is wrong');
        test.equal(Spiffy.parse('[name*=email]').expressions[0].attributes[0].operator, '*=', 'attribute operator is wrong');

        //5. Test attributes within complex selectors
        test.equal(Spiffy.parse('input[name]').expressions[0].attributes[0].name, 'name', 'attribute name is wrong');
        test.equal(Spiffy.parse('input[name=email]').expressions[0].attributes[0].name, 'name', 'attribute name is wrong');
        test.equal(Spiffy.parse('input.bar[name=email]').expressions[0].attributes[0].name, 'name', 'attribute name is wrong');
        test.equal(Spiffy.parse('input#foo.bar[name=email]').expressions[0].attributes[0].name, 'name', 'attribute name is wrong');
        test.equal(Spiffy.parse('input#foo.bar[name=email]:focus').expressions[0].attributes[0].name, 'name', 'attribute name is wrong');

        //6. Test attributes with spaces
        test.equal(Spiffy.parse('[name = email]').expressions[0].attributes[0].name, 'name', 'attribute name is wrong');
        test.equal(Spiffy.parse('[name = email]').expressions[0].attributes[0].expected, 'email', 'attribute value is wrong');

        test.done();
    },

    testPseudos: function (test) {
        //1. Test pseudos length
        test.equal(Spiffy.parse(':focus').expressions[0].pseudos.length, 1, 'pseudos length is wrong');
        test.equal(Spiffy.parse(':focus:hover').expressions[0].pseudos.length, 2, 'pseudos length is wrong');

        //2. Test pseudo names
        test.equal(Spiffy.parse(':focus:hover').expressions[0].pseudos[0].name, 'focus', 'pseudos weren\'t parsed correctly');
        test.equal(Spiffy.parse(':focus:hover').expressions[0].pseudos[1].name, 'hover', 'pseudos weren\'t parsed correctly');
        test.equal(Spiffy.parse('a:focus:hover img').expressions[0].pseudos[1].name, 'hover', 'pseudos weren\'t parsed correctly');
        test.equal(Spiffy.parse('p a:focus:hover').expressions[1].pseudos[1].name, 'hover', 'pseudos weren\'t parsed correctly');

        //3. Test pseudo params
        test.equal(Spiffy.parse(':nth-child(odd)').expressions[0].pseudos[0].param, 'odd', 'pseudo param is wrong');
        test.equal(Spiffy.parse(':nth-child(even)').expressions[0].pseudos[0].param, 'even', 'pseudo param is wrong');
        test.equal(Spiffy.parse(':nth-child(2n+1)').expressions[0].pseudos[0].param, '2n+1', 'pseudo param is wrong');

        //4. Test pseudos within complex selectors
        test.equal(Spiffy.parse('a:hover').expressions[0].pseudos[0].name, 'hover', 'pseudo name is wrong');
        test.equal(Spiffy.parse('a.nav:hover').expressions[0].pseudos[0].name, 'hover', 'pseudo name is wrong');
        test.equal(Spiffy.parse('a#logo.nav:hover').expressions[0].pseudos[0].name, 'hover', 'pseudo name is wrong');
        test.equal(Spiffy.parse('a#logo.nav[href^=https]:hover').expressions[0].pseudos[0].name, 'hover', 'pseudo name is wrong');

        //5. Test pseudos with spaces
        test.equal(Spiffy.parse(':nth-child( 2n + 1 )').expressions[0].pseudos[0].name, 'nth-child', 'pseudo name is wrong');
        test.equal(Spiffy.parse(':nth-child( 2n + 1 )').expressions[0].pseudos[0].param, '2n+1', 'pseudo param is wrong');

        test.done();
    },

    testCombinators: function (test) {
        //1. Test combinators length
        test.equal(Spiffy.parse('body').expressions.length, 1, 'combinators length is wrong');
        test.equal(Spiffy.parse('body header').expressions.length, 2, 'combinators length is wrong');
        test.equal(Spiffy.parse('body header > nav').expressions.length, 3, 'combinators length is wrong');

        //2. Test scopes
        test.equal(Spiffy.parse('body').expressions[0].scope, '*', 'scope is wrong');
        test.equal(Spiffy.parse('body header').expressions[1].scope, '*', 'scope is wrong');
        test.equal(Spiffy.parse('body header > nav').expressions[2].scope, '>', 'scope is wrong');
        test.equal(Spiffy.parse('body header + article').expressions[2].scope, '+', 'scope is wrong');
        test.equal(Spiffy.parse('body header ~ article').expressions[2].scope, '~', 'scope is wrong');

        test.done();
    },

    testGroupings: function (test) {
        //1. Test groupings length
        test.equal(Spiffy.parse('a').length, 1, 'groupings length is wrong');
        test.equal(Spiffy.parse('a, button').length, 2, 'groupings length is wrong');
        test.equal(Spiffy.parse('a , button').length, 2, 'groupings length is wrong');
        test.equal(Spiffy.parse('h1, h2, h3, h4, h5, h6').length, 6, 'groupings length is wrong');

        test.done();
    },

    testErrors: function (test) {
        test.done();
        return;

        test.doesNotThrow(function () {Spiffy.parse('#foo')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('input')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('input#foo')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('.bar')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('[name]')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse(':focus')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('input#foo.bar[name]:focus')}, SyntaxError);
        test.throws(function () {Spiffy.parse('[name')}, SyntaxError);
        test.throws(function () {Spiffy.parse('name]')}, SyntaxError);
        test.throws(function () {Spiffy.parse('form name]')}, SyntaxError);
        test.throws(function () {Spiffy.parse(':nth-child(odd')}, SyntaxError);
        test.throws(function () {Spiffy.parse('nth-child(odd)')}, SyntaxError);
        test.throws(function () {Spiffy.parse('div :nth-child(odd')}, SyntaxError);
        test.throws(function () {Spiffy.parse('div :nth-childodd)')}, SyntaxError);

        //1. Test pseudo errors
        test.doesNotThrow(function () {Spiffy.parse(':focus')}, SyntaxError);
        test.throws(function () {Spiffy.parse(':focus[name]')}, SyntaxError);
        test.throws(function () {Spiffy.parse(':focus.bar')}, SyntaxError);
        test.throws(function () {Spiffy.parse(':focus#foo')}, SyntaxError);

        //2. Test attribute errors
        test.doesNotThrow(function () {Spiffy.parse('[name]')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('[name]:focus')}, SyntaxError);
        test.throws(function () {Spiffy.parse('[name].bar')}, SyntaxError);
        test.throws(function () {Spiffy.parse('[name]#foo')}, SyntaxError);

        //3. Test class errors
        test.doesNotThrow(function () {Spiffy.parse('.bar')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('.bar:focus')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('.bar[name]')}, SyntaxError);
        test.throws(function () {Spiffy.parse('.bar#foo')}, SyntaxError);

        //4. Test ID errors
        test.doesNotThrow(function () {Spiffy.parse('#foo')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('#foo:focus')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('#foo[name]')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('#foo.bar')}, SyntaxError);

        //5. Test tag errors
        test.doesNotThrow(function () {Spiffy.parse('input')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('input:focus')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('input[name]')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('input.bar')}, SyntaxError);
        test.doesNotThrow(function () {Spiffy.parse('input#foo')}, SyntaxError);

        test.done();
    },

    testSelectors: function (test) {
        var selectors = {
            'body': {expressions:[{tagName:'body'}], length:1},
            'div': {expressions:[{tagName:'div'}], length:1},
            'body div': {expressions:[{tagName:'body'}, {tagName:'div'}], length:2},
            'div p': {expressions:[{tagName:'div'}, {tagName:'p'}], length:2},
            'div > p': {expressions:[{tagName:'div'}, {tagName:'p', scope:'>'}], length:2},
            'div + p': {expressions:[{tagName:'div'}, {tagName:'p', scope:'+'}], length:2},
            'div ~ p': {expressions:[{tagName:'div'}, {tagName:'p', scope:'~'}], length:2},
            'div[class^=exa][class$=mple]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'^=', expected:'exa'}, {name:'class', operator:'$=', expected:'mple'}]}], length:1},
            'div p a': {expressions:[{tagName:'div'}, {tagName:'p'}, {tagName:'a'}], length:3},
            'div, p, a': {expressions:[[{tagName:'div'}], [{tagName:'p'}], [{tagName:'a'}]], length:3},
            '.note': {expressions:[{classes:['note']}], length:1},
            'div.example': {expressions:[{tagName:'div', classes:['example']}], length:1},
            'ul .tocline2': {expressions:[{tagName:'ul'}, {classes:['tocline2']}], length:2},
            'div.example, div.note': {expressions:[[{tagName:'div', classes:['example']}], [{tagName:'div', classes:['note']}]], length:2},
            '#title': {expressions:[{ID:'title'}], length:1},
            'h1#title': {expressions:[{tagName:'h1', ID:'title'}], length:1},
            'div #title': {expressions:[{tagName:'div'}, {ID:'title'}], length:2},
            'ul.toc li.tocline2': {expressions:[{tagName:'ul', classes:['toc']}, {tagName:'li', classes:['tocline2']}], length:2},
            'ul.toc > li.tocline2': {expressions:[{tagName:'ul', classes:['toc']}, {tagName:'li', classes:['tocline2'], scope:'>'}], length:2},
            'h1#title + div > p': {expressions:[{tagName:'h1', ID:'title'}, {tagName:'div', scope:'+'}, {tagName:'p', scope:'>'}], length:3},
            'h1[id]:contains(Selectors)': {expressions:[{tagName:'h1', attributes:[{name:'id'}], pseudos:[{name:'contains', param:'Selectors'}]}], length:1},
            'a[href][lang][class]': {expressions:[{tagName:'a', attributes:[{name:'href'}, {name:'lang'}, {name:'class'}]}], length:1},
            'div[class]': {expressions:[{tagName:'div', attributes:[{name:'class'}]}], length:1},
            'div[class=example]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'=', expected:'example'}]}], length:1},
            'div[class^=exa]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'^=', expected:'exa'}]}], length:1},
            'div[class$=mple]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'$=', expected:'mple'}]}], length:1},
            'div[class*=e]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'*=', expected:'e'}]}], length:1},
            'div[class|=dialog]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'|=', expected:'dialog'}]}], length:1},
            'div[class!=made_up]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'!=', expected:'made_up'}]}], length:1},
            'div[class~=example]': {expressions:[{tagName:'div', attributes:[{name:'class', operator:'~=', expected:'example'}]}], length:1},
            'div:not(.example)': {expressions:[{tagName:'div', pseudos:[{name:'not', param:'.example'}]}], length:1},
            'p:contains(selectors)': {expressions:[{tagName:'p', pseudos:[{name:'contains', param:'selectors'}]}], length:1},
            'p:nth-child(even)': {expressions:[{tagName:'p', pseudos:[{name:'nth-child', param:'even'}]}], length:1},
            'p:nth-child(2n)': {expressions:[{tagName:'p', pseudos:[{name:'nth-child', param:'2n'}]}], length:1},
            'p:nth-child(odd)': {expressions:[{tagName:'p', pseudos:[{name:'nth-child', param:'odd'}]}], length:1},
            'p:nth-child(2n+1)': {expressions:[{tagName:'p', pseudos:[{name:'nth-child', param:'2n+1'}]}], length:1},
            'p:nth-child(n)': {expressions:[{tagName:'p', pseudos:[{name:'nth-child', param:'n'}]}], length:1},
            'p:only-child': {expressions:[{tagName:'p', pseudos:[{name:'only-child'}]}], length:1},
            'p:last-child': {expressions:[{tagName:'p', pseudos:[{name:'last-child'}]}], length:1},
            'p:first-child': {expressions:[{tagName:'p', pseudos:[{name:'first-child'}]}], length:1}
        };

        for (var key in selectors) {
            if (!selectors.hasOwnProperty(key)) continue;

            testResultEquality(test, key, Spiffy.parse(key), selectors[key]);
        }

        test.done();
    }
};