
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