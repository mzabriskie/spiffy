/*

 Copyright (c) 2013 by Matt Zabriskie

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */

(function (undefined) {
    'use strict';

    var REGEXP_GROUP = /\s?,\s?/g,
        REGEXP_TRIM = /^\s+|\s+$/gm,
        REGEXP_SELECTOR = /^([a-z0-9]*?)?(#.*?)?(\..*?)?(\[.*\])?(:.*?)?$/i,
        REGEXP_ATTRIBUTE = /[\^\$\*~\|!]/;

    var Attribute = {
        Operators: {
            // equals
            '=': function (e, a) {
                return e == a;
            },
            // includes
            '~=': function (e, a) {
                var words = a.split(' ');
                while (words.length) {
                    if (e == words.shift()) return true;
                }
                return false;
            },
            // submatch
            '|=': function (e, a) {
                return e == a || a.indexOf(e + '-') === 0;
            },
            // prefix
            '^=': function (e, a) {
                return a.indexOf(e) === 0;
            },
            // suffix
            '$=': function (e, a) {
                return a.indexOf(e) === (a.length - e.length);
            },
            // contains
            '*=': function (e, a) {
                return a.indexOf(e) > -1;
            }
        },
        Getters: {
            'class': function () {
                return ('className' in this) ? this.className : this.getAttribute('class');
            },
            'for': function() {
                return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
            },
            'href': function() {
                return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
            },
            'style': function() {
                return (this.style) ? this.style.cssText : this.getAttribute('style');
            }
        },
        createFilter: function (attribute) {
            return function (node) {
                var val = getAttribute(node, attribute.name);

                if (attribute.operator && attribute.expected) {
                    return Attribute.Operators[attribute.operator](trim(attribute.expected), val);
                } else {
                    return val !== null && val.length > 0;
                }
            };
        }
    };

    var Pseudo = {
        Filters: {
            'nth': function (node, param, type) {
                var children = getChildren(node.parentNode, type ? node.nodeName : null);
                return children && children[param - 1] == node;
            },
            'nth-last': function (node, param, type) {
                var children = getChildren(node.parentNode, type ? node.nodeName : null);
                return children && children[children.length - param] == node;
            },
            'only': function (node, type) {
                var children = getChildren(node.parentNode, type ? node.nodeName : null);
                return children && children.length == 1 && children[0] == node;
            }
        },
        Methods: {
            'only-of-type': function (node) {
                return Pseudo.Filters.only(node, true);
            },
            'first-of-type': function (node) {
                return Pseudo.Filters.nth(node, 1, true);
            },
            'last-of-type': function (node) {
                return Pseudo.Filters['nth-last'](node, 1, true);
            },
            'nth-of-type': function (node, param) {
                return Pseudo.Filters.nth(node, param, true);
            },
            'nth-last-of-type': function (node, param) {
                return Pseudo.Filters['nth-last'](node, param, true);
            },
            'only-child': function (node) {
                return Pseudo.Filters.only(node, false);
            },
            'first-child': function (node) {
                return Pseudo.Filters.nth(node, 1, false);
            },
            'last-child': function (node) {
                return Pseudo.Filters['nth-last'](node, 1, false);
            },
            'nth-child': function (node, param) {
                return Pseudo.Filters.nth(node, param, false);
            },
            'nth-last-child': function (node, param) {
                return Pseudo.Filters['nth-last'](node, param, false);
            },
            'empty': function (node) {
                var children = getChildren(node);
                return !children || children.length === 0;
            },
            'enabled': function (node) {
                return !node.disabled;
            },
            'disabled': function (node) {
                return node.disabled;
            },
            'checked': function (node) {
                return node.checked || node.selected;
            },
            'selected': function (node) {
                return node.selected;
            },
            'focus': function (node) {
                return node == document.activeElement;
            },
            'contains': function (node, param) {
                return (node.innerText || node.textContent || '').indexOf(param) > -1;
            },
            'not': function (node, param) {
                return !Spiffy.match(node, param);
            }
        },
        createFilter: function (pseudo) {
            return function (node) {
                return Pseudo.Methods[pseudo.name](node, trim(pseudo.param));
            };
        }
    };

    function getChildren(node, name) {
        var children = null;
        if (node && node.childNodes) {
            children = [];
            var i = node.childNodes.length;
            while (i--) {
                if (node.childNodes[i].nodeType == 1 &&
                    (!name || node.childNodes[i].nodeName == name)) {
                    children[children.length] = node.childNodes[i];
                }
            }
        }
        return children.reverse();
    }

     function getAttribute(node, name) {
        var getter = Attribute.Getters[name];
        if (getter) return getter.call(node);
        return node.getAttribute(name);
    }

    function inArray(needle, haystack) {
        var i = haystack.length;
        while (i--) {
            if (needle == haystack[i]) {
                return true;
            }
        }
        return false;
    }

    function trim(str) {
        return !str ? '' : str.replace(REGEXP_TRIM, '');
    }

    function clean(str) {
        if (!str) return '';

        var i = str.length,
            result = '',
            open = false;

        while (i--) {
            if (str[i] == ']' || str[i] == ')') open = true;
            if (str[i] == '[' || str[i] == '(') open = false;
            if (open && str[i] == ' ') continue;
            result = str[i] + result;
        }

        return result;
    }

    function parseGrouping(selector) {
        var
            groups = selector.split(REGEXP_GROUP),
            i = groups.length,
            results = [];

        while (i--) {
            results[results.length] = parseSelector(groups[i]);
        }

        return results.reverse();
    }

    function parseSelector(selector) {
        var chain = [],
            parts = clean(selector).split(' ').reverse(),
            index = parts.length,
            scope = null,
            indexOf = 0,
            i = 0, l = 0;

        while (index--) {
            var part = parts[index];

            // Check if part is a combinator
            if (part.length == 1 && (
                    part == '+' ||
                    part == '*' ||
                    part == '~' ||
                    part == '>'
                )) {
                scope = part;
                continue;
            }

            // Break part down
            var match = part.match(REGEXP_SELECTOR),
                matchID = match[2],
                matchClasses = match[3],
                matchAttributes = match[4],
                matchPseudos = match[5],
                query = {};

            // Add query to chain
            chain[chain.length] = query;

            // Set scope for the query
            query.scope = scope || '*';
            scope = null;

            // Set tagName
            query.tagName = match[1];

            // Set ID
            if (matchID) {
                query.ID = matchID ? matchID.substring(1, matchID.length) : undefined;
            }

            // Set classes
            if (matchClasses) {
                query.classes = matchClasses.substring(1, matchClasses.length).split('.');
            }

            // Set attributes
            if (matchAttributes) {
                query.attributes = [];
                var length = matchAttributes.length,
                    a = matchAttributes.substring(1, length).substring(0, length - 2).split('][');

                for (i=0, l=a.length; i<l; i++) {
                    var attribute = {},
                        tempA = a[i];
                    query.attributes[query.attributes.length] = attribute;

                    indexOf = tempA.indexOf('=');
                    if (indexOf >= 0) {
                        var temp = tempA.match(REGEXP_ATTRIBUTE);

                        attribute.name = tempA.substring(0, indexOf - (temp ? 1 : 0));
                        attribute.expected = tempA.substring(indexOf + 1, tempA.length);
                        attribute.operator = (temp ? temp[0] : '') + '=';
                    } else {
                        attribute.name = tempA;
                    }
                }
            }

            // Set pseudos
            if (matchPseudos) {
                query.pseudos = [];
                var p = matchPseudos.substring(1, matchPseudos.length).split(':');

                for (i=0, l=p.length; i<l; i++) {
                    var pseudo = {},
                        tempP = p[i];
                    query.pseudos[query.pseudos.length] = pseudo;

                    indexOf = tempP.indexOf('(');
                    if (indexOf >= 0) {
                        tempP = tempP.substring(0, tempP.length - 1);
                        pseudo.name = tempP.substring(0, indexOf);
                        pseudo.param = tempP.substring(indexOf + 1, tempP.length);
                    } else {
                        pseudo.name = tempP;
                    }
                }
            }
        }

        return chain;
    }

    var Spiffy = {
        parse: function (selector) {
            var expressions = null;

            if (selector && selector.indexOf(',') >= 0) {
                expressions = parseGrouping(selector);
            } else {
                expressions = parseSelector(selector);
            }

            return {
                expressions: expressions,
                length: expressions.length,
                raw: selector
            };
        },

        explain: function (selector) {
            var parsed = Spiffy.parse(selector),
                result = {
                    selector: selector,
                    parsed: parsed,
                    specificity: [0, 0, 0],
                    category: 'universal',
                    key: '*'
                },
                last = parsed.expressions[parsed.length - 1];

            // Determine category and key
            if (typeof last.ID !== 'undefined') {
                result.category = 'id';
                result.key = last.ID;
            } else if (typeof last.classes !== 'undefined') {
                result.category = 'class';
                result.key = last.classes[0];
            } else if (typeof last.tagName !== 'undefined') {
                result.category = 'tag';
                result.key = last.tagName;
            }

            // Determine specificity
            var i = parsed.length;
            while (i--) {
                var temp = parsed.expressions[i];
                if (typeof temp.ID !== 'undefined') {
                    result.specificity[0]++;
                }
                if (typeof temp.classes !== 'undefined') {
                    result.specificity[1]+=temp.classes.length;
                }
                if (typeof temp.attributes !== 'undefined') {
                    result.specificity[1]+=temp.attributes.length;
                }
                if (typeof temp.tagName !== 'undefined') {
                    result.specificity[2]++;
                }
                if (typeof temp.pseudos !== 'undefined') {
                    var j = temp.pseudos.length;
                    while (j--) {
                        var name = temp.pseudos[j].name;
                        if (name == 'first-line' ||
                            name == 'first-letter' ||
                            name == 'before' ||
                            name == 'after') {
                            result.specificity[2]++;
                        } else {
                            result.specificity[1]++;
                        }
                    }
                }
            }

            return result;
        },

        match: function (element, selector) {
            var parsed = Spiffy.parse(selector).expressions[0],
                parsedID = parsed.ID,
                parsedTagName = parsed.tagName,
                parsedClasses = parsed.classes,
                parsedAttributes = parsed.attributes,
                parsedPseudos = parsed.pseudos,
                i = 0;

            // Test ID
            if (parsedID && element.id != parsedID) {
                return false;
            }

            // Test tagName
            if (parsedTagName && element.tagName != parsedTagName.toUpperCase()) {
                return false;
            }

            // Test classes
            if (parsedClasses) {
                var classes = element.className.split(' ');
                i = parsedClasses.length;

                while (i--) {
                    if (!inArray(parsedClasses[i], classes)) {
                        return false;
                    }
                }
            }

            // Test attributes
            if (parsedAttributes) {
                i = parsedAttributes.length;

                while (i--) {
                    if (!Attribute.createFilter(parsedAttributes[i]).call(null, element)) {
                        return false;
                    }
                }
            }

            // Test pseudos
            if (parsedPseudos) {
                i = parsedPseudos.length;

                while (i--) {
                    if (!Pseudo.createFilter(parsedPseudos[i]).call(null, element)) {
                        return false;
                    }
                }
            }

            return true;
        }
    };

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define('Spiffy', [], function() { return Spiffy; });
    } else if (typeof module !== 'undefined') {
        module.exports = Spiffy;
    } else {
        this.Spiffy = Spiffy;
    }

}).call(this);