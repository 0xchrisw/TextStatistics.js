// Encoding: UTF-8

/**
 * https://github.com/DaveChild/Text-Statistics/
 *   blob/master/src/DaveChild/TextStatistics/Text.php
 */
var UTF8 = {
  encode: function( str_data ) {
  //   example 1: utf8_encode('Kevin van Zonneveld');
  //   returns 1: 'Kevin van Zonneveld'
  if (argString === null || typeof argString === 'undefined') {
    return '';
  }
  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '');
  var utftext = '',
    start, end, stringl = 0;
  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;
    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      );
    } else if ((c1 & 0xF800) != 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) != 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n);
      }
      var c2 = string.charCodeAt(++n);
      if ((c2 & 0xFC00) != 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }
  if (end > start) {
    utftext += string.slice(start, stringl);
  }
  return utftext;
  },
  decode: function( str_data ) {
  var tmp_arr = [],
      i = 0,
      c1 = 0,
      seqlen = 0;
  str_data += '';
  while( i < str_data.length ) {
    c1 = str_data.charCodeAt(i) & 0xFF;
    seqlen = 0;
    // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    if (c1 <= 0xBF) {
      c1 = (c1 & 0x7F);
      seqlen = 1;
    } else if (c1 <= 0xDF) {
      c1 = (c1 & 0x1F);
      seqlen = 2;
    } else if (c1 <= 0xEF) {
      c1 = (c1 & 0x0F);
      seqlen = 3;
    } else {
      c1 = (c1 & 0x07);
      seqlen = 4;
    }
    for (var ai = 1; ai < seqlen; ++ai) {
      c1 = ((c1 << 0x06) | (str_data.charCodeAt(ai + i) & 0x3F));
    }
    if (seqlen == 4) {
      c1 -= 0x10000;
      tmp_arr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)), String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
    } else {
      tmp_arr.push(String.fromCharCode(c1));
    }
    i += seqlen;
  }
  return tmp_arr.join("");
  }
};


var Text = {
  /**
   * @var array $clean Efficiency: Store strings
   * once processed.
   */
  cleaned: new Array( ),

  normalize: function( string ) {
    /**
     * https://en.wikipedia.org/wiki/Unicode_symbols
     */
    var test = [ '[',
                 'ÀÁÄÂÃÅÆàáâãäåæÞþÇçÈÉËÊèéêë',
                 'ÌÍÏÎìíîïÑñÒÓÖÔÕØòóôðõöøŠš',
                 'ÙÚÜÛùúûÝýÿŽž',
                 '‼⁇⸮⁏‥…⸘⁉‽⁈',
                 '⁃–—‹«›»‸‘’‛‵„‟“”‶″‷‴⁗',
                 '⁎⁕⁑⁂‧∙•◦‣⁌⁍',
                 ']'
               ].join( '' ),
        re_test    = new RegExp( test, 'g' ),
        characters = {
          A: /[ÀÁÄÂÃÅÆ]/g,  a: /[àáâãäåæ]/g,
          B: /[Þ]/g      ,  b: /[þ]/g      ,
          C: /[Ç]/g      ,  c: /[ç]/g      ,
          E: /[ÈÉËÊ]/g   ,  e: /[èéêë]/g   ,
          I: /[ÌÍÏÎ]/g   ,  i: /[ìíîï]/g   ,
          N: /[Ñ]/g      ,  n: /[ñ]/g      ,
          O: /[ÒÓÖÔÕØ]/g ,  o: /[òóôðõöø]/g,
          S: /[Š]/g      ,  s: /[š]/g      ,
          U: /[ÙÚÜÛ]/g   ,  u: /[ùúû]/g    ,
          Y: /[Ý]/g      ,  y: /[ýÿ]/g     ,
          Z: /[Ž]/g      ,  z: /[ž]/g      ,
          '!':  /[‼]/g   , '?':  /[⁇⸮]/g  ,
          ';': /[⁏]/g    ,
          '..': /[‥]/g  , '...': /[…]/g   ,
          '!?': /[⸘⁉]/  , '?!': /[‽⁈]/g   ,
          '-': /[⁃–]/g   , '--': /[—]/g    ,
          '<': /[‹«]/g   , '>':  /[›»]/g   ,
          '^': /[‸]/g    ,
          "'": /[‘’‛‵′]/g ,
          '"': /[„‟“”‶″‷‴⁗]/g,
          '*': /[⁎⁕⁑⁂‧∙•◦‣⁌⁍]/g,
        },
        keys    = Object.keys( characters ),
        len     = keys.length;
    if( re_test.test( string ) ) {
      while( len-- ) {
        var value = keys[ len ],
            regex = characters[ value ];
        string = string.replace( regex, value );
      }
    }
    return string;
  },

  clean: function( text ) {
    /**
     * Trims, removes line breaks, multiple spaces
     * and generally cleans text before processing.
     * @param   string|boolean  $strText      Text to be transformed
     * @return  string
     */
    var decimal = /([^0-9][0-9]+)\.([0-9]+[^0-9])/gmi,
        text    = UTF8.decode( Text.normalize( text ) );
    
    
    // Check to see if we already processed this text.
    // If we did, don't re-process it.
    // TODO - Hashing function.
    // TODO - Store strings in a Dict.

    // TODO
    //   Handle HTML.
    //     Treat block level elements as sentence terminators
    //     and remove all other tags.
    /*
      $strText =
        preg_replace('`<script(.*?)>(.*?)</script>`is', '', $strText);
      $strText =
        preg_replace('`\</?(address|blockquote|center|dir|div|dl|dd|dt|fieldset|form|h1|h2|h3|h4|h5|h6|menu|noscript|ol|p|pre|table|ul|li)[^>]*>`is', '.', $strText);
    $strText = html_entity_decode($strText);
    $strText = strip_tags($strText);
    */


    // Replace Periods within numbers
    text = text.replace( decimal, "$1$2" );

    // Assume blank lines (i.e., paragraph breaks) end sentences
    //   (useful for titles in plain text documents) and replace
    // remaining new lines with spaces
    text = text.replace( /(\r\n|\n\r)/gmi, '\n' )
               .replace( /(\r|\n){2,}/gmi, '.\n\n' )
               .replace( /[ ]*(\n|\r\n|\r)[ ]*/gmi, ' ' );

    // Replace commas, hyphens, quotes etc (count as spaces)
    text = text.replace( /[",:;()/\`-]/gmi, ' ');
    // Add final terminator.
    
    // Unify terminators and spaces
    text = text.replace( /[\.!?]/gmi, '.' );

    // Merge terminators separated by whitespace.
    text = text.replace( /([\.\s]*\.[\.\s]*)/gmi, '. ' );

    // Remove multiple spaces
    text = text.replace( /[ ]+/gmi, ' ' );

    // Check for duplicated terminators
    text = text.replace( /([\.])[\. ]+/gmi, "$1" );

    // Pad sentence terminators
    text = text.replace( /[ ]*([\.])/gmi, "$1" );
    
    // Lower case all words following terminators
    // (for gunning fog score)
    //  $strText =
    //  preg_replace_callback(
    //  /\. [^\. ]/gmi,
    //  create_function('$matches', 'return strtolower($matches[0]);')

    //Cache it and return
    console.log( text );
    return text; 
  }


};

Text.clean( document.body.textContent )

