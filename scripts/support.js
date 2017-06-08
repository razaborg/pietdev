/*
support.js
Piet IDE additional support scripts

Copyright (c) 2006-2013, Oscar Rodriguez
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function GetXmlHttpObject(handler)
{ 
	var objXmlHttp=null;
    if (window.XMLHttpRequest)
    {
		objXmlHttp=new XMLHttpRequest();
		objXmlHttp.onload=handler;
		objXmlHttp.onerror=handler; 
		return objXmlHttp;
    }
    else if (window.ActiveXObject)
    {
        try
        {
            var strName="Msxml2.XMLHTTP";
            if (navigator.appVersion.indexOf("MSIE 5.5") >= 0)
                strName="Microsoft.XMLHTTP";
            objXmlHttp=new ActiveXObject(strName);
            objXmlHttp.onreadystatechange=handler;
            return objXmlHttp;
        }
		catch(e)
		{
			alert("Error. Scripting for ActiveX might be disabled.");
			return;
		}
    }
    alert("Error. Your browser does not seem to support XMLHttpRequest.");
    return;
}

function colorToRGB(color)
{
	switch(color)
	{
	case  0: return "#000000";
	case 11: return "#ffc0c0";
	case 12: return "#ff0000";
	case 13: return "#c00000";
	case 21: return "#ffffc0";
	case 22: return "#ffff00";
	case 23: return "#c0c000";
	case 31: return "#c0ffc0";
	case 32: return "#00ff00";
	case 33: return "#00c000";
	case 41: return "#c0ffff";
	case 42: return "#00ffff";
	case 43: return "#00c0c0";
	case 51: return "#c0c0ff";
	case 52: return "#0000ff";
	case 53: return "#0000c0";
	case 61: return "#ffc0ff";
	case 62: return "#ff00ff";
	case 63: return "#c000c0";
	default:
	case 99: return "#ffffff";
	}
}

function RGBToColor(RGB)
{
	switch(color)
	{
	case "#000000": return 0;
	case "#ffc0c0": return 11;
	case "#ff0000": return 12;
	case "#c00000": return 13;
	case "#ffffc0": return 21;
	case "#ffff00": return 22;
	case "#c0c000": return 23;
	case "#c0ffc0": return 31;
	case "#00ff00": return 32;
	case "#00c000": return 33;
	case "#c0ffff": return 41;
	case "#00ffff": return 42;
	case "#00c0c0": return 43;
	case "#c0c0ff": return 51;
	case "#0000ff": return 52;
	case "#0000c0": return 53;
	case "#ffc0ff": return 61;
	case "#ff00ff": return 62;
	case "#c000c0": return 63;
	default:
	case "#ffffff": return 99;
	}
}

function opcodeToText(opcode)
{
	switch(opcode)
	{
	case 0: return "none";
	case 1: return "push";
	case 2: return "pop";
	case 3: return "add";
	case 4: return "sub";
	case 5: return "mul";
	case 6: return "div";
	case 7: return "mod";
	case 8: return "not";
	case 9: return "greater";
	case 10: return "pointer";
	case 11: return "switch";
	case 12: return "dup";
	case 13: return "roll";
	case 14: return "inNum";
	case 15: return "inChar";
	case 16: return "outNum";
	case 17: return "outChar";
	case 18: return "noop";
	case -8: return "exit";
	default: return "wait (" + (-opcode) + ")";
	}
}
