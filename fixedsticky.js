;(function( win, $ ) {

	function featureTest( property, value, noPrefixes ) {
		// Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
		var prop = property + ':',
			el = document.createElement( 'test' ),
			mStyle = el.style;

		if( !noPrefixes ) {
			mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
		} else {
			mStyle.cssText = prop + value;
		}
		return mStyle[ property ].indexOf( value ) !== -1;
	}

	function getPx( unit ) {
		return parseInt( unit, 10 ) || 0;
	}

	var stuckStates = {};
	var overlapStates = {};

	var S = {
		classes: {
			plugin: 'igsticky',
			active: 'igsticky-on',
			inactive: 'igsticky-off',
			clone: 'igsticky-dummy',
			overlap: 'igsticky-dummy-over',
			clear: 'igsticky-dummy-clear',
			withoutFixedFixed: 'igsticky-withoutfixedfixed'
		},
		keys: {
			offset: 'fixedStickyOffset',
			position: 'fixedStickyPosition'
		},
		tests: {
			sticky: featureTest( 'position', 'sticky' ),
			fixed: featureTest( 'position', 'fixed', true )
		},
		// Thanks jQuery!
		getScrollTop: function() {
			var prop = 'pageYOffset',
				method = 'scrollTop';
			return win ? (prop in win) ? win[ prop ] :
				win.document.documentElement[ method ] :
				win.document.body[ method ];
		},
		bypass: function() {
			// Check native sticky, check fixed and if fixed-fixed is also included on the page and is supported
			return ( S.tests.sticky && !S.optOut ) ||
				!S.tests.fixed ||
				win.FixedFixed && !$( win.document.documentElement ).hasClass( 'fixed-supported' );
		},
		update: function( el ) {
			if( !el.offsetWidth ) { return; }

			var $el = $( el ),
				height = $el.outerHeight(),
				initialOffset = $el.data( S.keys.offset ),
				scroll = S.getScrollTop(),
				isAlreadyOn = $el.is( '.' + S.classes.active ),
				isAlreadyOverlapping = $el.is( '.' + S.classes.overlap ),
				toggleStuck = function( turnOn ) {
					$el[ turnOn ? 'addClass' : 'removeClass' ]( S.classes.active )
						[ !turnOn ? 'addClass' : 'removeClass' ]( S.classes.inactive );
				},
				toggleOverlap = function( turnOn ) {
					$el[ turnOn ? 'addClass' : 'removeClass' ]( S.classes.overlap )
						[ !turnOn ? 'addClass' : 'removeClass' ]( S.classes.clear );	
				},
				viewportHeight = $( window ).height(),
				position = $el.data( S.keys.position ),
				skipSettingToFixed,
				elTop,
				elBottom,
				$parent = $el.parent(),
				parentOffset = $parent.offset().top,
				parentHeight = $parent.outerHeight();

//				var currentStuckState = isAlreadyOn;
				if(isAlreadyOn !== stuckStates[el.id] ){
					stuckStates[el.id] = isAlreadyOn;
					$el.trigger( eventName('stuck', isAlreadyOn) );
				}

				if(isAlreadyOverlapping !== overlapStates[el.id]){
					overlapStates[el.id] = isAlreadyOverlapping;
					$el.trigger( eventName('overlap', isAlreadyOverlapping) );	
				}


			if( !initialOffset ) {
				initialOffset = $el.offset().top;
				$el.data( S.keys.offset, initialOffset );
				$el.find('.'+S.classes.clone).remove(); //check for clones, if they're there, remove them
				$el.after( $( '<div>' ).addClass( S.classes.clone ).height( height ) );
			}
			

			if( !position ) {
				// Some browsers require fixed/absolute to report accurate top/left values.
				skipSettingToFixed = $el.css( 'top' ) !== 'auto' || $el.css( 'bottom' ) !== 'auto';

				if( !skipSettingToFixed ) {
					$el.css( 'position', 'fixed' );
				}

				position = {
					top: $el.css( 'top' ) !== 'auto',
					bottom: $el.css( 'bottom' ) !== 'auto'
				};

				if( !skipSettingToFixed ) {
					$el.css( 'position', '' );
				}

				$el.data( S.keys.position, position );
			}

			function isFixedToTop() {
				var offsetTop = scroll + elTop;

				// Initial Offset Top
				return initialOffset < offsetTop &&
					// Container Bottom
					offsetTop + height <= parentOffset + parentHeight;
			}

			function isFixedToBottom() {
				// Initial Offset Top + Height
				return initialOffset + ( height || 0 ) > scroll + viewportHeight - elBottom &&
					// Container Top
					scroll + viewportHeight - elBottom >= parentOffset + ( height || 0 );
			}

			function isOverlapping() {
				return ((height + initialOffset) > scroll );
			}

			elTop = getPx( $el.css( 'top' ) );
			elBottom = getPx( $el.css( 'bottom' ) );

			if( position.top && isFixedToTop() || position.bottom && isFixedToBottom() ) {
				if( !isAlreadyOn ) {
					toggleStuck( true );
				}
				if( isOverlapping() && !isAlreadyOverlapping ){
					toggleOverlap( true );
				}else if( !isOverlapping() && isAlreadyOverlapping ){
					toggleOverlap( false );
				}
			} else {
				if( isAlreadyOn ) {
					toggleStuck( false );
					//if it's outside the extent of the screen don't toggle the overlap
					if(scroll <= initialOffset){
						toggleOverlap( true );	
					}
				}
			}
		},
		destroy: function( el ) {
			var $el = $( el );
			if (S.bypass()) {
				return;
			}

			$( win ).unbind( '.fixedsticky' );

			return $el.each(function() {
				$( this )
					.removeData( [ S.keys.offset, S.keys.position ] )
					.removeClass( S.classes.active )
					.removeClass( S.classes.inactive )
					.next( '.' + S.classes.clone ).remove();
			});
		},
		init: function( el ) {
			var $el = $( el );
			if( S.bypass() ) {
				return;
			}
			return $el.each(function() {
				var _this = this;
				
				$( win ).bind( 'scroll.fixedsticky', function(e) {
					S.update( _this );
				}).trigger( 'scroll.fixedsticky' );

				$( win ).bind( 'resize.fixedsticky', function(e) {
					if( $el.is( '.' + S.classes.active ) ) {
						S.update( _this );
					}
				});
			});
		}
	};

	function eventName(type,v){
		if(type === 'stuck'){
			if(v) return 'stuck';
			return 'unstuck';
		}
		if(type === 'overlap'){
			if(v) return 'overlap';
			return 'overlap-clear';
		}
	}

	win.FixedSticky = S;

	// Plugin
	$.fn.fixedsticky = function( method ) {
		if ( typeof S[ method ] === 'function') {
			return S[ method ].call( S, this);
		} else if ( typeof method === 'object' || ! method ) {
			return S.init.call( S, this );
		} else {
			throw new Error( 'Method `' +  method + '` does not exist on jQuery.fixedsticky' );
		}
	};

	// Add fallback when fixed-fixed is not available.
	if( !win.FixedFixed ) {
		$( win.document.documentElement ).addClass( S.classes.withoutFixedFixed );
	}

})( this, jQuery );