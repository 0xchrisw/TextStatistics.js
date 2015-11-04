var Tools = {
  type: function( object ) {
    /**
     * @example    Tools.type( new Boolean( true ) );
     * @example    Tools.type( true );
     */
    return ( { } ).toString
                  .call( object )
                  .match( /\s([a-zA-Z]+)/ )[ 1 ]
                  .toLowerCase( );
  }

};

