/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/format/NumberFormat","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/model/odata/ODataUtils","sap/ui/model/odata/type/ODataType","sap/ui/thirdparty/jquery"],function(t,e,i,n,r,a,o,s){"use strict";var u=/^[-+]?(\d+)(?:\.(\d+))?$/,m=/(?:(\.[0-9]*[1-9]+)0+|\.0*)$/;function l(t){var i,n;if(!t.oFormat){i={groupingEnabled:true,maxIntegerDigits:Infinity};n=f(t);if(n!==Infinity){i.minFractionDigits=i.maxFractionDigits=n}i=s.extend(i,t.oFormatOptions);i.parseAsString=true;t.oFormat=e.getFloatInstance(i)}return t.oFormat}function f(t){return t.oConstraints&&t.oConstraints.scale||0}function c(t,e){return sap.ui.getCore().getLibraryResourceBundle().getText(t,e)}function p(t){if(t.indexOf(".")>=0){t=t.replace(m,"$1")}return t}function h(e,i){var n,r,a,o,s;function m(i,n){t.warning("Illegal "+n+": "+i,null,e.getName())}function l(t,e,i,n){var r=typeof t==="string"?parseInt(t):t;if(r===undefined){return e}if(typeof r!=="number"||isNaN(r)||r<i){m(t,n);return e}return r}function f(t,e){if(t){if(t.match(u)){return t}m(t,e)}}function c(t,e){if(t===true||t==="true"){return true}if(t!==undefined&&t!==false&&t!=="false"){m(t,e)}}function p(t,i,n){if(i!==n){e.oConstraints=e.oConstraints||{};e.oConstraints[t]=i}}e.oConstraints=undefined;if(i){n=i.nullable;a=i.precision;s=i.scale;o=s==="variable"?Infinity:l(s,0,0,"scale");r=l(a,Infinity,1,"precision");if(o!==Infinity&&r<=o){t.warning("Illegal scale: must be less than precision (precision="+a+", scale="+s+")",null,e.getName());o=Infinity}p("precision",r,Infinity);p("scale",o,0);if(n===false||n==="false"){p("nullable",false,true)}else if(n!==undefined&&n!==true&&n!=="true"){m(n,"nullable")}p("minimum",f(i.minimum,"minimum"));p("minimumExclusive",c(i.minimumExclusive,"minimumExclusive"));p("maximum",f(i.maximum,"maximum"));p("maximumExclusive",c(i.maximumExclusive,"maximumExclusive"))}e._handleLocalizationChange()}var g=o.extend("sap.ui.model.odata.type.Decimal",{constructor:function(t,e){o.apply(this,arguments);this.oFormatOptions=t;h(this,e)}});g.prototype.formatValue=function(t,e){if(t===null||t===undefined){return null}switch(this.getPrimitiveType(e)){case"any":return t;case"float":return parseFloat(t);case"int":return Math.floor(parseFloat(t));case"string":return l(this).format(p(String(t)));default:throw new i("Don't know how to format "+this.getName()+" to "+e)}};g.prototype.parseValue=function(t,i){var r;if(t===null||t===""){return null}switch(this.getPrimitiveType(i)){case"string":r=l(this).parse(t);if(!r){throw new n(sap.ui.getCore().getLibraryResourceBundle().getText("EnterNumber"))}r=p(r);break;case"int":case"float":r=e.getFloatInstance({maxIntegerDigits:Infinity,decimalSeparator:".",groupingEnabled:false}).format(t);break;default:throw new n("Don't know how to parse "+this.getName()+" from "+i)}return r};g.prototype._handleLocalizationChange=function(){this.oFormat=null};g.prototype.validateValue=function(t){var e,i,n,o,s,m,l,p,h;if(t===null&&(!this.oConstraints||this.oConstraints.nullable!==false)){return}if(typeof t!=="string"){throw new r(c("EnterNumber"))}n=u.exec(t);if(!n){throw new r(c("EnterNumber"))}i=n[1].length;e=(n[2]||"").length;h=f(this);p=this.oConstraints&&this.oConstraints.precision||Infinity;m=this.oConstraints&&this.oConstraints.minimum;o=this.oConstraints&&this.oConstraints.maximum;if(e>h){if(h===0){throw new r(c("EnterInt"))}else if(i+h>p){throw new r(c("EnterNumberIntegerFraction",[p-h,h]))}throw new r(c("EnterNumberFraction",[h]))}if(h===Infinity){if(i+e>p){throw new r(c("EnterNumberPrecision",[p]))}}else if(i>p-h){if(h){throw new r(c("EnterNumberInteger",[p-h]))}else{throw new r(c("EnterMaximumOfDigits",[p]))}}if(m){l=this.oConstraints.minimumExclusive;if(a.compare(m,t,true)>=(l?0:1)){throw new r(c(l?"EnterNumberMinExclusive":"EnterNumberMin",[this.formatValue(m,"string")]))}}if(o){s=this.oConstraints.maximumExclusive;if(a.compare(o,t,true)<=(s?0:-1)){throw new r(c(s?"EnterNumberMaxExclusive":"EnterNumberMax",[this.formatValue(o,"string")]))}}};g.prototype.getName=function(){return"sap.ui.model.odata.type.Decimal"};return g});