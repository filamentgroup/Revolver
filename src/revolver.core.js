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
        .addClass( itemClass )
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