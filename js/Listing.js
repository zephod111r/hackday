// Main entry point for new website.
(function initListing(local) {

    "use strict";

    var ListEntry = Class.Design(function (entry) {
        Object.defineProperties(this, {
            element: {
                value: null,
                writable: false,
                enumerable: true,
                configurable: true
            },
            url: {
                value: entry.url,
                writable: false,
                enumerable: true
            },
            description: {
                value: entry.Description,
                writable: false,
                enumerable: true
            },
            thumburl: {
                value: entry.ThumbURL,
                writable: false,
                enumerable: true
            },
            oncleanup: {
                value: null,
                writable: true,
                enumerable: false
            },
            response: {
                value: null,
                writable: true,
                enumerable: false
            }
        });

    }, {
        GetRequestPromise: {
            value: function () {
                if (this.url) {
                    return HTTP.Load(this.url);
                }
                return StateMachine.Promise.Wrap('');
            }, writable: false, enumerable: true
        },
        GetThumbPromise: {
            value: function () {
                if (this.thumburl) {
                    return HTTP.Load(this.thumburl);
                }
                return StateMachine.Promise.Wrap('');
            }, writable: false, enumerable: true
        }
    });

    function ParseEntry(entry, list) {
        var imageURL = null;
        var desc = null;
        var thumb = null;

        for (var index in entry.childNodes) {
            var node = entry.childNodes[index];
            switch (node.localName) {
                case 'URL':
                    {
                        imageURL = node.firstChild.data;
                    }
                    break;
                case 'Description':
                    {
                        desc = node.firstChild.data;
                    }
                    break;
                case 'Thumb':
                    {
                        thumb = node.firstChild.data;
                    }
                default:
                    break;
            }
        }

        list.push(new ListEntry({ url: imageURL, Description: desc, ThumbURL: thumb }));
    };

    function ParseXML(XMLdoc) {
        var list = XMLdoc.getElementsByTagName('entry');
        for (var index in list) {
            var entry = list[index];
            if (entry.isPrototypeOf(list) || !entry.childNodes) continue;
            ParseEntry(entry, this);
        }
        return this;
    };

    function FailedXML(reason) {
        console.log(reason);
    };

    local.Listing = Object.create(Object.prototype, {
        Promise: {
            value: function (url, list) {
                return HTTP.Load(url).Then(ParseXML.bind(list), FailedXML);
            }, writable: false, enumerable: true
        },
        ListEntry: {
            value: ListEntry,
            writable: false,
            enumerable: true
        }

    });
    
} )(this);
