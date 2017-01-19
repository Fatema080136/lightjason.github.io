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

"use strict";
(function () {

	jQuery.teletype = function( element, options ) {

			// helper references
			var dom = jQuery( element );
			
		
			// default plugin settings
			var defaults = {
				text: [ 'one', 'two', 'three' ],
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
			}


			// ---- private methods -------------------------------------------------------------------------------------------------

			// defines the function for get the next command-item
			var next = function()
			{
				element.current.index++;

				// check end and looping
				if ( element.current.index >= element.settings.text.length )
				{
					element.current.index = 0;
					element.current.loop++;
					if ( ( element.settings.loop !== false ) && ( element.settings.loop == element.current.loop ) )
						return false;
				}

				setCurrentString();
				element.current.position = 0;
				if ( typeof( element.settings.callbackNext ) == 'function' )
					element.settings.callbackNext( element );

				return true;
			};

			// extracts a number beginning on the given position
			var extractnumber = function( text, start )
			{
				var end = text.substr( start ).search( /[^0-9]/ );
				return text.substr( start, end == -1 ? text.length : end );
			}

			// creates a pause function
			var pause = function( text, start )
			{
				var time = extractnumber( text, start );
				if ( !jQuery.isNumeric( time ) )
					return;

				element.current.position = start + time.length;
				setTimeout( type.bind(element), time );
			}


			// runs the typing animation
			var type = function() 
			{

				// add new prefix item if possible
				if ( ( element.settings.prefix ) && ( element.current.position === 0 ) )
						jQuery( '<span />' ).addClass( element.settings.classprefix ).html( element.settings.prefix ).appendTo( element.output );

				// get current letter & position
				var letter = element.current.letters[element.current.position],
					start = element.current.position + 1;

				// check pause
				if ( letter == '^' )
				{
					pause( element.current.string, start );
					return;
				}

				// check for pause or remove sign
				/*
				if ( letter == '~' )
				{

					// @todo code shorten
					var end = element.current.string.substr( start ).search( /[^0-9]/ );
					if ( end == -1 )
						end = current.string.length;
					
					var value = element.current.string.substr( start, end );
					if ( jQuery.isNumeric( value ) ) {
						element.current.string = element.current.string.replace( letter + value, '' );

						if ( letter == '^' )
							setTimeout( function() {}, value );

						else
						{
							var index = element.current.position - value;
							element.current.string = element.current.string.substr( 0, index - 1 ) + element.current.string.substr( element.current.position - 1 );
							setTimeout( backspace( Math.max( index, 0 ) ).bind(element) , delay( element.settings.backDelay ) );
						}

						return;
					}

				}
				*/
				
				// check for line-break
				if ( ( letter == '\\' ) && ( element.current.string.substr( start, 1 ) === 'n' ) )
				{
					element.current.position++;
					letter = element.settings.taglinebreak;		
				}



				// increment current position and set output
				element.current.position++;
				element.output.html( element.output.html() + letter );


				// run the next iteration
				if ( element.current.position < element.current.string.length )
					setTimeout( type.bind(element), delay( element.settings.typeDelay ) );
				else
				{
					// set the result (of the typing) if it exists
					if ( element.current.result )
						element.output.html( element.output.html() + element.current.result );

					// check if there exists a new line
					if ( next() )
					{
						element.output.html( element.output.html() + element.settings.taglinebreak );
						setTimeout( type.bind(element), delay( element.settings.typeDelay ) );
					}
				}


				/*
					if ( element.settings.preserve != false )
						setTimeout( function() { setTimeout( backspace, delay( element.settings.backDelay ) ); }, element.settings.delay );
					else {
						element.output.html( element.output.html() + element.current.result + '<span class="' + element.settings.classprefix+ '">' + element.settings.prefix + '</span>' );
						if ( next() )
							setTimeout( function() { setTimeout( type, delay( element.settings.typeDelay ) ); }, element.settings.delay );
						else 
							if ( typeof( element.settings.callbackFinished ) == 'function' )
								element.settings.callbackFinished( element );
					}
					*/

				if ( typeof( element.settings.callbackType ) == 'function' )
					element.settings.callbackType( letter, element );
			}


			var backspace = function( stop ) 
			{
				if ( !stop )
					stop = 0;
				
				if ( element.current.position > stop ) {
					dom.html( dom.html().slice( 0, -1 ) );
					setTimeout( backspace( stop ).bind(element), delay( element.settings.backDelay ) );
					element.current.position--;
				
				} else {
					if ( ( stop === 0 ) && ( next() === false ) )
						return;
				
					setTimeout( type.bind(element), delay( element.settings.typeDelay ) );
				}
			}


			// returns a delay value
			var delay = function( speed ) 
			{ 
				return element.settings.humanise ? parseInt( speed ) + Math.floor( Math.random() * 200 ) : parseInt( speed ); 
			}


			// sets the current string data (command and command result)
			var setCurrentString = function() {
				element.current.string = element.settings.text[element.current.index].replace(/\n/g, "\\n");
				element.current.letters = element.current.string.split( '' );
				element.current.result = (element.settings.result.length == element.settings.text.length) && (!!element.settings.result[element.current.index]) ? '<p class="' + element.settings.classresult + '">' + element.settings.result[element.current.index] + "</p>" : "";
			}



			// ---- public methods --------------------------------------------------------------------------------------------------

			element.setCursor = function( cursor ) {
				element.settings.cursor = cursor;
			}
			
			
			element.reset = function() {
				if (element.settings.loop === 0)
					return;
			}


			element.start = function() {
				//if (element.settings.automaticstart)
				//	return;
			}


			element.init = function() {

				// clear DOM node first
				dom.empty();

				// sets instance an nessessary DOM values into element
				element.settings = jQuery.extend( {}, defaults, options );
				element.current   = { string: '', result: '', letters: [], index: 0, position: 0, loop: 0 };
				element.output    = jQuery( '<span/>' ).addClass( element.settings.classoutput ).appendTo( dom );

				// set cursor
				if ( element.settings.cursor ) {
					var cursor = jQuery( '<span/>' ).addClass( element.settings.classcursor ).appendTo( dom ).text( element.settings.cursor );
					setInterval ( function() {
						if ( element.settings.smoothBlink )
							cursor.animate( { opacity: 0 } ).animate( { opacity: 1 } );
						else
							cursor.delay(500).fadeTo(0,0).delay(500).fadeTo(0,1);
					}, element.settings.blinkSpeed );
				}
				
				// start typing
				setCurrentString();
				type();
			}

			element.init();
		}

		// ---- jQuery initialization -------------------------------------------------------------------------------------------



		jQuery.fn.teletype = function( options ) {

			return this.each( function() {
				// http://stefangabos.ro/jquery/jquery-plugin-boilerplate-revisited/
				// http://stackoverflow.com/questions/8758685/get-dom-element-from-jquery-plugin-extension

				if (undefined == jQuery(this).data('teletype'))
					return jQuery(this).data( 'teletype', new jQuery.teletype(this, options) );
				
				/*
				setCurrentString();
				self.addClass( settings.classmain ).empty();
				output = jQuery( '<span />' ).addClass( settings.classtext ).appendTo( self );
				if ( settings.cursor ) {
					var cursor = $( '<span />' ).addClass( settings.classcursor ).appendTo( self );
					element.setCursor( settings.cursor );
					setInterval ( function() {
						if ( settings.smoothBlink )
							cursor.animate( { opacity: 0 } ).animate( { opacity: 1 } );
						else
							cursor.delay(500).fadeTo(0,0).delay(500).fadeTo(0,1);
					}, settings.blinkSpeed );
				}
				if (settings.automaticstart)
					type();	
				*/

			} );
	}

})(jQuery);