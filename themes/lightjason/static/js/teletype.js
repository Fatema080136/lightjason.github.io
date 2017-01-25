/*
 * Teletype jQuery Plugin
 * @version 0.1.6
 *
 * @author Steve Whiteley
 * @see http://teletype.rocks
 * @see https://github.com/stvwhtly/jquery-teletype-plugin
 *
 * Copyright (c) 2015 Steve Whiteley
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

"use strict";;
(function() {

    var pluginname = "teletype";

    // ---- jQuery initialization -------------------------------------------------------------------------------------------

    /**
     * plugin initialize
     *
     * @param options any options
     */
    jQuery.fn[pluginname] = function(options) {
        var plugin = this.data('plugin_' + pluginname);

        if (!plugin) {
            plugin = new Teletype(this, jQuery.extend({}, jQuery.fn[pluginname].defaultSettings, options || {}));
            this.data('plugin_' + pluginname, plugin)
        }

        return plugin;

    };


    /**
     * default settings
     */
    jQuery.fn[pluginname].defaultSettings = {
        text: ['one', 'two', 'three'],
        result: [],
        automaticstart: true,
        classresult: "teletype-result",
        classprefix: "teletype-prefix",
        classcursor: "teletype-cursor",
        classoutput: "teletype-text",
        taglinebreak: "<br/>",
        typeDelay: 100,
        backDelay: 50,
        blinkSpeed: 1000,
        delay: 2000,
        cursor: '|',
        preserve: false,
        prefix: '',
        loop: 0,
        humanise: true,
        smoothBlink: true,
        callbackNext: null,
        callbackType: null,
        callbackFinished: null
    };


    // ---- plugin definition -----------------------------------------------------------------------------------------------

    /**
     * plugin factory
     *
     * @param po_element closure element
     * @param po_options initialize options
     */
    function Teletype(po_element, po_options) {
        this.dom = po_element
        this.settings = po_options;

        this.init();
        return this;
    }


    Teletype.prototype = {

        /**
         * constructor
         */
        init: function() {

            // clear DOM node first
            this.dom.empty();

            // sets instance an nessessary DOM values into element
            this.current = {
                string: '',
                result: '',
                letters: [],
                index: 0,
                position: 0,
                loop: 0
            };
            this.output = jQuery('<span/>').addClass(this.settings.classoutput).appendTo(this.dom);

            // set cursor
            if (this.settings.cursor) {
                var cursor = jQuery('<span/>').addClass(this.settings.classcursor).appendTo(this.dom).text(this.settings.cursor);
                var self = this;
                setInterval(function() {
                    if (self.settings.smoothBlink)
                        cursor.animate({
                            opacity: 0
                        }).animate({
                            opacity: 1
                        });
                    else
                        cursor.delay(500).fadeTo(0, 0).delay(500).fadeTo(0, 1);
                }, this.settings.blinkSpeed);
            }

            // start typing
            if (this.settings.automaticstart) {
                setCurrentString(this);
                this.type();
            }

        },


        /**
         * sets the next outpur sequence
         */
        next: function() {
            this.current.index++;

            // check end and looping
            if (this.current.index >= this.settings.text.length) {
                this.current.index = 0;
                this.current.loop++;
                if ((this.settings.loop !== false) && (this.settings.loop == this.current.loop))
                    return false;
            }

            setCurrentString(this);
            this.current.position = 0;

            // runs next-callback
            if (typeof(this.settings.callbackNext) == 'function')
                this.settings.callbackNext(null);

            return true;
        },


        /**
         * execution typing
         */
        type: function() {

            // add new prefix item if possible
            if ((this.settings.prefix) && (this.current.position === 0))
                jQuery('<span />').addClass(this.settings.classprefix).html(this.settings.prefix).appendTo(this.output);

            // get current letter & position
            var letter = this.current.letters[this.current.position],
                start = this.current.position + 1;

            // check pause
            if (letter == '^') {
                pause(this, start);
                return;
            }

            // check for pause or remove sign
            /*
            if ( letter == '~' )
            {

            	// @todo code shorten
            	var end = this.current.string.substr( start ).search( /[^0-9]/ );
            	if ( end == -1 )
            		end = current.string.length;

            	var value = this.current.string.substr( start, end );
            	if ( jQuery.isNumeric( value ) ) {
            		this.current.string = this.current.string.replace( letter + value, '' );

            		if ( letter == '^' )
            			setTimeout( function() {}, value );

            		else
            		{
            			var index = this.current.position - value;
            			this.current.string = this.current.string.substr( 0, index - 1 ) + this.current.string.substr( this.current.position - 1 );
            			setTimeout( backspace( Math.max( index, 0 ) ).bind(element) , delay( this.settings.backDelay ) );
            		}

            		return;
            	}

            }
            */

            // check for line-break
            if ((letter == '\\') && (this.current.string.substr(start, 1) === 'n')) {
                this.current.position++;
                letter = this.settings.taglinebreak;
            }


            // run typing-callback
            if (typeof(this.settings.callbackType) == 'function')
                this.settings.callbackType(element);


            // increment current position and set output
            this.current.position++;
            this.output.html(this.output.html() + letter);

            // run the next iteration
            if (this.current.position < this.current.string.length)
                setTimeout(this.type.bind(this), delay(this, this.settings.typeDelay));
            else {
                // set the result (of the typing) if it exists
                if (this.current.result)
                    this.output.html(this.output.html() + this.current.result);

                // check if there exists a new line
                if (this.next()) {
                    this.output.html(this.output.html() + this.settings.taglinebreak);
                    setTimeout(this.type.bind(this), delay(this, this.settings.typeDelay));
                }
            }

        },


        /**
         * modifies the internal cursor representation
         *
         * @param pc_cursor cursor character
         */
        setCursor: function(pc_cursor) {
            this.settings.cursor = pc_cursor;

            return this;
        },


        /**
         * resets the dom element and rerun typing
         */
        reset: function() {
            if (this.settings.loop === 0)
                return this;

            this.start();
            return this;
        },


        /**
         * starts typing if automatic start is disabled
         */
        start: function() {
            if (this.settings.automaticstart)
                return;

            setCurrentString(this);
            this.type();

            return this;
        }

    }


    // ---- private function ------------------------------------------------------------------------------------------------

    /**
     * sets the current string and if possible result data
     *
     * @param po_this execution context
     */
    var setCurrentString = function(po_this) {
            po_this.current.string = po_this.settings.text[po_this.current.index].replace(/\n/g, "\\n");
            po_this.current.letters = po_this.current.string.split('');
            po_this.current.result = (po_this.settings.result.length == po_this.settings.text.length) && (po_this.settings.result[po_this.current.index]) ? '<p class="' + po_this.settings.classresult + '">' + po_this.settings.result[po_this.current.index] + "</p>" : "";
        },


        /**
         * delay function
         *
         * @param po_this execution context
         * @param pn_speed any speed value
         * @return randomized speed value
         */
        delay = function(po_this, pn_speed) {
            return po_this.settings.humanise ? parseInt(pn_speed) + Math.floor(Math.random() * 200) : parseInt(pn_speed);
        },


        /**
         * extract a number from a text
         *
         * @param pc_text input text
         * @param pn_start start position within the string
         * @return extracted number
         */
        extractnumber = function(pc_text, pn_start) {
            var end = pc_text.substr(pn_start).search(/[^0-9]/);
            return pc_text.substr(pn_start, end == -1 ? pc_text.length : end);
        },


        /**
         * pause function for typing pause
         *
         * @param po_this execution context
         * @param pc_text current input text
         * @param pn_start start position for searching pause time
         */
        pause = function(po_this, pn_start) {
            var time = extractnumber(po_this.current.string, pn_start);
            if (!jQuery.isNumeric(time))
                return;

            po_this.current.position = pn_start + time.length;
            setTimeout(po_this.type.bind(po_this), time);
        },


        /**
         * backspace for removing characters
         * @bug incomplete
         *
         * @param po_this execution context
         * @param pn_stop number of characters to remove
         */
        backspace = function(po_this, pn_stop) {
            if (!pn_stop)
                pn_stop = 0;

            if (this.current.position > pn_stop) {
                this.dom.html(this.dom.html().slice(0, -1));
                setTimeout(this.backspace(pn_stop).bind(this), delay(this.settings.backDelay));
                this.current.position--;

            } else {
                if ((pn_stop === 0) && (next() === false))
                    return;

                setTimeout(this.type.bind(this), delay(po_this, this.settings.typeDelay));
            }
        };

}(jQuery));
