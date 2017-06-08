/*******************************************************************/
/***                                                             ***/
/***   Tokenizer.js - JavaScript String Tokenizer Function       ***/
/***                                                             ***/
/***   Version   : 0.2                                           ***/
/***   Date      : 01.05.2005                                    ***/
/***   Copyright : 2005 Adrian Zentner                           ***/
/***   Website   : http://www.adrian.zentner.name/               ***/
/***                                                             ***/
/***   This library is free software. It can be freely used as   ***/
/***   long as this this copyright notice is not removed.        ***/
/***                                                             ***/
/*******************************************************************/

String.prototype.tokenize = tokenize;

function tokenize()
  {
     var input             = "";
     var separator         = " ";
     var trim              = "";
     var ignoreEmptyTokens = true;

     try {
       String(this.toLowerCase());
     }
     catch(e) {
       window.alert("Tokenizer Usage: string myTokens[] = myString.tokenize(string separator, string trim, boolean ignoreEmptyTokens);");
       return;
     }

     if(typeof(this) != "undefined")
       {
          input = String(this);
       }

     if(typeof(tokenize.arguments[0]) != "undefined")
       {
          separator = String(tokenize.arguments[0]);
       }

     if(typeof(tokenize.arguments[1]) != "undefined")
       {
          trim = String(tokenize.arguments[1]);
       }

     if(typeof(tokenize.arguments[2]) != "undefined")
       {
          if(!tokenize.arguments[2])
            ignoreEmptyTokens = false;
       }

     var array = input.split(separator);

     if(trim)
       for(var i=0; i<array.length; i++)
         {
           while(array[i].slice(0, trim.length) == trim)
             array[i] = array[i].slice(trim.length);
           while(array[i].slice(array[i].length-trim.length) == trim)
             array[i] = array[i].slice(0, array[i].length-trim.length);
         }

     var token = new Array();
     if(ignoreEmptyTokens)
       {
          for(var i=0; i<array.length; i++)
            if(array[i] != "")
              token.push(array[i]);
       }
     else
       {
          token = array;
       }

     return token;
  }

