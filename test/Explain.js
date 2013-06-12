var Spiffy = require('../src/Spiffy');

function testArrayEquality(test, arr1, arr2) {
    test.ok(arr1 != null);
    test.ok(arr2 != null);
    test.equal(arr1.length, arr2.length);

    for (var i=0, l=arr1.length; i<l; i++) {
        test.equal(arr1[i], arr2[i]);
    }
}

module.exports = {
    setUp: function (callback) {
        callback();
    },

    tearDown: function (callback) {
        callback();
    },

    testCategory: function (test) {
        //1. Test general categories
        test.equal(Spiffy.explain('input').category, 'tag', 'category was incorrect');
        test.equal(Spiffy.explain('#foo').category, 'id', 'category was incorrect');
        test.equal(Spiffy.explain('.bar').category, 'class', 'category was incorrect');
        test.equal(Spiffy.explain('[name=email]').category, 'universal', 'category was incorrect');

        //2. Test tag category
        test.equal(Spiffy.explain('input[name=email]').category, 'tag', 'category should be tag');
        test.equal(Spiffy.explain('input:focus').category, 'tag', 'category should be tag');
        test.equal(Spiffy.explain('input[name=email][value]:focus').category, 'tag', 'category should be tag');
        test.equal(Spiffy.explain('div.wrapper input[name=email][value]:focus').category, 'tag', 'category should be tag');
        test.equal(Spiffy.explain('form[method=post] div.wrapper input[name=email][value]:focus').category, 'tag', 'category should be tag');

        //3. Test ID category
        test.equal(Spiffy.explain('#foo').category, 'id', 'category should be id');
        test.equal(Spiffy.explain('#foo.bar').category, 'id', 'category should be id');
        test.equal(Spiffy.explain('#foo[name]').category, 'id', 'category should be id');
        test.equal(Spiffy.explain('#foo:focus').category, 'id', 'category should be id');
        test.equal(Spiffy.explain('input#foo').category, 'id', 'category should be id');

        //4. Test class category
        test.equal(Spiffy.explain('.bar').category, 'class', 'category should be class');
        test.equal(Spiffy.explain('.bar[name]').category, 'class', 'category should be class');
        test.equal(Spiffy.explain('.bar:focus').category, 'class', 'category should be class');
        test.equal(Spiffy.explain('input.bar').category, 'class', 'category should be class');

        //5. Test universal category
        test.equal(Spiffy.explain('[name]').category, 'universal', 'category should be universal');
        test.equal(Spiffy.explain(':focus').category, 'universal', 'category should be universal');
        test.equal(Spiffy.explain('[name]:focus').category, 'universal', 'category should be universal');

        test.done();
    },

    testKey: function (test) {
        //1. Test tag key
        test.equal(Spiffy.explain('input').key, 'input', 'key should be input');
        test.equal(Spiffy.explain('input:focus').key, 'input', 'key should be input');
        test.equal(Spiffy.explain('input[name]:focus').key, 'input', 'key should be input');

        //2. Test id key
        test.equal(Spiffy.explain('#foo').key, 'foo', 'key should be foo');
        test.equal(Spiffy.explain('input#foo').key, 'foo', 'key should be foo');
        test.equal(Spiffy.explain('input#foo.bar').key, 'foo', 'key should be foo');
        test.equal(Spiffy.explain('input#foo.bar[name]').key, 'foo', 'key should be foo');
        test.equal(Spiffy.explain('input#foo.bar[name]:focus').key, 'foo', 'key should be foo');

        //3. Test class key
        test.equal(Spiffy.explain('.bar').key, 'bar', 'key should be bar');
        test.equal(Spiffy.explain('input.bar').key, 'bar', 'key should be bar');
        test.equal(Spiffy.explain('input.bar.baz').key, 'bar', 'key should be bar');
        test.equal(Spiffy.explain('input.bar[name]').key, 'bar', 'key should be bar');
        test.equal(Spiffy.explain('input.bar[name]:focus').key, 'bar', 'key should be bar');

        //4. Test universal key
        test.equal(Spiffy.explain('[name]').key, '*', 'key should be *');
        test.equal(Spiffy.explain('[name]:focus').key, '*', 'key should be *');

        test.done();
    },

    testSpecificity: function (test) {
        //1. Test general specificity
        testArrayEquality(test, Spiffy.explain('#foo').specificity, [1, 0, 0]);
        testArrayEquality(test, Spiffy.explain('#foo input').specificity, [1, 0, 1]);
        testArrayEquality(test, Spiffy.explain('#foo input.bar').specificity, [1, 1, 1]);
        testArrayEquality(test, Spiffy.explain('#foo input.bar[name]').specificity, [1, 2, 1]);
        testArrayEquality(test, Spiffy.explain('#foo input.bar[name][value]').specificity, [1, 3, 1]);
        testArrayEquality(test, Spiffy.explain('#foo input.bar[name][value]:focus').specificity, [1, 4, 1]);
        testArrayEquality(test, Spiffy.explain('#foo input.bar[name][value]:before').specificity, [1, 3, 2]);
        testArrayEquality(test, Spiffy.explain('#foo input.bar[name][value]:focus:before').specificity, [1, 4, 2]);

        //2. Test specificity a
        testArrayEquality(test, Spiffy.explain('#foo').specificity, [1, 0, 0]);
        testArrayEquality(test, Spiffy.explain('#foo #bar').specificity, [2, 0, 0]);

        //3. Test specificity b
        testArrayEquality(test, Spiffy.explain('.foo').specificity, [0, 1, 0]);
        testArrayEquality(test, Spiffy.explain('.foo.bar').specificity, [0, 2, 0]);
        testArrayEquality(test, Spiffy.explain('[name]').specificity, [0, 1, 0]);
        testArrayEquality(test, Spiffy.explain('[name][value]').specificity, [0, 2, 0]);
        testArrayEquality(test, Spiffy.explain(':focus').specificity, [0, 1, 0]);
        testArrayEquality(test, Spiffy.explain(':focus:hover').specificity, [0, 2, 0]);

        //4. Test specificity c
        testArrayEquality(test, Spiffy.explain(':before').specificity, [0, 0, 1]);
        testArrayEquality(test, Spiffy.explain(':after').specificity, [0, 0, 1]);
        testArrayEquality(test, Spiffy.explain(':first-line').specificity, [0, 0, 1]);
        testArrayEquality(test, Spiffy.explain(':first-letter').specificity, [0, 0, 1]);
        testArrayEquality(test, Spiffy.explain(':first-letter:before').specificity, [0, 0, 2]);

        test.done();
    }
};