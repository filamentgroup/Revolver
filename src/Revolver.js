/*
 * Revolver
 * https://github.com/filamentgroup/revolver
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
  var pluginName = "revolver",
    initSelector = "." + pluginName,
    itemClass = pluginName + "-item",
    activeClass = pluginName + "-active",
    methods = {
      _create: function(){
        return $( this ).each(function() {
          var init = $( this ).data( "init" );

          if( init ) {
            return false;
          }

          $( this )
            .data( "init", true)
            .trigger( "beforecreate." + pluginName )
            [ pluginName ]( "_init" )
            .trigger( "create." + pluginName );
        });
      },

      _init: function(){
        var $dupe = $( this ).find( "img" ).clone();
        
        return $( this ).addClass( pluginName + " " + pluginName + "-slide " )
        .append( $dupe )
        .children()
        .addClass( itemClass + " introslide")
        .first()
        .addClass( activeClass );
      },

      _destroy: function() {
        // TODO
      }
    };
    
  // Collection method.
  $.fn[ pluginName ] = function( arrg, a, b, c ) {
    return this.each(function() {

      // if it's a method
      if( arrg && typeof( arrg ) === "string" ){
        return $.fn[ pluginName ].prototype[ arrg ].call( this, a, b, c );
      }
      
      // don't re-init
      if( $( this ).data( pluginName + "data" ) ){
        return $( this );
      }
      
      // otherwise, init
      $( this ).data( pluginName + "active", true );
      $.fn[ pluginName ].prototype._create.call( this );
    });
  };

  // add methods
  $.extend( $.fn[ pluginName ].prototype, methods ); 

  // DOM-ready auto-init
  $( function(){
    $( initSelector )[ pluginName ]();
  } );

}(jQuery));

/*
 * responsive-carousel touch drag extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

 (function($) {
  var pluginName = "revolver",
    initSelector = "." + pluginName,
    noTrans = pluginName + "-no-transition",
    touchMethods = {
      _dragBehavior: function(){
        var origin,
          data = {},
          deltaY,
          xPerc,
          yPerc,
          emitEvents = function( e ){
            var touches = e.touches || e.originalEvent.touches,
              $elem = $( e.target ).closest( initSelector );
            
            if( e.type === "touchstart" ){
              origin = { 
                x : touches[ 0 ].pageX,
                y: touches[ 0 ].pageY
              };
            }

            if( touches[ 0 ] && touches[ 0 ].pageX ){
              data.touches = touches;
              data.deltaX = touches[ 0 ].pageX - origin.x;
              data.deltaY = touches[ 0 ].pageY - origin.y;
              data.w = $elem.first().width();
              data.h = $elem.first().height();
              data.xPercent = data.deltaX / data.w;
              data.yPercent = data.deltaY / data.h;
              data.srcEvent = e;
            }

            $elem.trigger( "drag" + e.type.split( "touch" )[ 1 ], data );
            return data;
          };

        $( this )
          .bind( "touchstart", function( e ){
            $( this ).addClass( noTrans );
            emitEvents( e );
          } )
          .bind( "touchmove", function( e ){
            var data = emitEvents( e );

            if( Math.abs( data.deltaX ) > 35 && Math.abs( data.deltaY ) < 35 && data.touches.length === 1 ){
              return false;
            }
            e.stopPropagation();
          } )
          .bind( "touchend", function( e ){
            $( this ).removeClass( noTrans );
            emitEvents( e );
          } );
      }
    };
      
  // add methods
  $.extend( $.fn[ pluginName ].prototype, touchMethods );

  // DOM-ready auto-init
  $( initSelector ).live( "create." + pluginName, function(){
    $( this )[ pluginName ]( "_dragBehavior" );
  } );

 }(jQuery));

 (function($) {
  var pluginName = "revolver",
    initSelector = "." + pluginName,
    activeClass = pluginName + "-active",
    itemClass = pluginName + "-item",
    current,
    clicked,
    origin,
    adjust,
    mouseDrag = function( e ) {
      var data = {};
      if( e.type === "mousedown" ) {
        clicked = true;
        origin = { 
          x : e.pageX,
          e : e
        };
        data.srcEvent = origin.e;
        e.preventDefault();
      }
      if( ( e.type === "mousedown" || e.type === "mousemove" ) && clicked ) {
        data.deltaX = e.pageX - origin.x;
        data.srcEvent = origin.e;

        if( e.type === "mousemove" ) {
          data.moveEvent = e;
        }

        $( this ).trigger( "dragmove", [ data ] );
      }
      if( e.type === "mouseup" ) {
        clicked = false;
      }
    },
    getActiveSlides = function( $revolver, data ){
      var $from = $( data.srcEvent.target ),
        activeNum = $from.prevAll().length + 1,
        forward = data.deltaX < 0,
        nextNum = activeNum + (forward ? 1 : -1),
        $children = $revolver.find( "." + itemClass ),
        $to = $children.eq( nextNum - 1 );

      if( !$to.length ){
        $to = $children[ forward ? "first" : "last" ]();
      }
      return [ $from, $to ];
    };

  $( initSelector )
    // Touch handling
    .live( "dragstart dragmove", function( e, data ){
      var activeSlides = getActiveSlides( $( this ), data ),
        swipeSpeed = data.deltaX * 3.5,
        width = activeSlides[ 0 ].width(),
        current = parseInt( activeSlides[ 0 ].css( "left" ), 10 );

      if( ( e.type === "dragstart" || data.srcEvent.type === "mousedown" ) && !data.moveEvent ){
        adjust = current;
      }

      activeSlides[ 0 ].css( "left", ( adjust || 0 ) + swipeSpeed );
      activeSlides[ 1 ].css( "left", ( current < -( width / 2 ) ) ? width + ( adjust || 0 ) + swipeSpeed : -width + ( adjust || 0 ) + swipeSpeed );

      e.stopPropagation();
    } )
    .live( "dragend dragmove", function( e ) {
      e.stopPropagation();
    })
    // Mouse handling
    .live( "mousedown mousemove mouseup", mouseDrag );
}(jQuery));

(function($) {
  var pluginName = "revolver",
    initSelector = "." + pluginName;

  $( initSelector ).live( "dragstart dragmove drag", function( e ) {
    var $el = $( e.target );
  } );

}(jQuery));

