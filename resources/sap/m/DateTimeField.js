/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/type/Date","sap/ui/model/odata/type/ODataType","sap/ui/model/odata/type/DateTimeBase","./InputBase","sap/ui/core/LocaleData","sap/ui/core/library","sap/ui/core/format/DateFormat","./DateTimeFieldRenderer","sap/base/util/deepEqual","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/cursorPos"],function(t,e,a,r,i,o,s,n,u,p,l){"use strict";var h=o.CalendarType;var y=r.extend("sap.m.DateTimeField",{metadata:{abstract:true,library:"sap.m",properties:{displayFormat:{type:"string",group:"Appearance",defaultValue:null},valueFormat:{type:"string",group:"Data",defaultValue:null},dateValue:{type:"object",group:"Data",defaultValue:null},initialFocusedDateValue:{type:"object",group:"Data",defaultValue:null}}}});y.prototype.setValue=function(t){t=this.validateProperty("value",t);var e=this.getValue();if(t===e){return this}else{this.setLastValue(t)}this.setProperty("value",t);this._bValid=true;var a;if(t){a=this._parseValue(t);if(!a||a.getTime()<this._oMinDate.getTime()||a.getTime()>this._oMaxDate.getTime()){this._bValid=false;p.warning("Value can not be converted to a valid date",this)}}this.setProperty("dateValue",a);if(this.getDomRef()){var r;if(a){r=this._formatValue(a)}else{r=t}if(this._$input.val()!==r){this._$input.val(r);this._curpos=this._$input.cursorPos()}}return this};y.prototype.setDateValue=function(t){if(this._isValidDate(t)){throw new Error("Date must be a JavaScript date object; "+this)}if(u(this.getDateValue(),t)){return this}t=this._dateValidation(t);var e=this._formatValue(t,true);if(e!==this.getValue()){this.setLastValue(e)}this.setProperty("value",e);if(this.getDomRef()){var a=this._formatValue(t);if(this._$input.val()!==a){this._$input.val(a);this._curpos=this._$input.cursorPos()}}return this};y.prototype.setValueFormat=function(t){this.setProperty("valueFormat",t,true);var e=this.getValue();if(e){this._handleDateValidation(this._parseValue(e))}return this};y.prototype.setDisplayFormat=function(t){this.setProperty("displayFormat",t,true);this.updateDomValue(this._formatValue(this.getDateValue()));this._updateDomPlaceholder(this._getPlaceholder());return this};y.prototype.getDisplayFormatType=function(){return null};y.prototype._dateValidation=function(t){this._bValid=true;this.setProperty("dateValue",t);return t};y.prototype._handleDateValidation=function(t){this._bValid=true;this.setProperty("dateValue",t)};y.prototype._getPlaceholder=function(){var t=this.getPlaceholder();if(!t){t=this._getDisplayFormatPattern();if(!t){t=this._getDefaultDisplayStyle()}if(this._checkStyle(t)){t=this._getLocaleBasedPattern(t)}}return t};y.prototype._getLocaleBasedPattern=function(t){return i.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).getDatePattern(t)};y.prototype._parseValue=function(t,e){var r=this.getBinding("value"),i=r&&r.getType&&r.getType(),o,s,n;if(i&&this._isSupportedBindingType(i)){try{n=i.parseValue(t,"string");if(typeof n==="string"&&i instanceof a){n=a.prototype.parseValue.call(i,t,"string")}o=i.oFormatOptions;if(o&&o.source&&o.source.pattern=="timestamp"){n=new Date(n)}else if(o&&o.source&&typeof o.source.pattern==="string"){n=i.oInputFormat.parse(t)}}catch(t){}if(n&&(i.oFormatOptions&&this._isFormatOptionsUTC(i.oFormatOptions)||i.oConstraints&&i.oConstraints.isDateOnly)){s=new Date(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate(),n.getUTCHours(),n.getUTCMinutes(),n.getUTCSeconds(),n.getUTCMilliseconds());s.setFullYear(n.getUTCFullYear());n=s}return n}return this._getFormatter(e).parse(t)};y.prototype._formatValue=function(t,e){if(!t){return""}var a=this.getBinding("value"),r=a&&a.getType&&a.getType(),i,o;if(r&&this._isSupportedBindingType(r)){if(r.oFormatOptions&&r.oFormatOptions.UTC||r.oConstraints&&r.oConstraints.isDateOnly){o=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()));o.setUTCFullYear(t.getFullYear());t=o}i=r.oFormatOptions;if(i&&i.source&&i.source.pattern=="timestamp"){t=t.getTime()}else if(r.oOutputFormat){return r.oOutputFormat.format(t)}return r.formatValue(t,"string")}return this._getFormatter(!e).format(t)};y.prototype._isSupportedBindingType=function(t){return t.isA(["sap.ui.model.type.Date","sap.ui.model.odata.type.DateTime","sap.ui.model.odata.type.DateTimeOffset"])};y.prototype._isFormatOptionsUTC=function(t){return t.UTC||t.source&&t.source.UTC};y.prototype._getDefaultDisplayStyle=function(){return"medium"};y.prototype._getDefaultValueStyle=function(){return"short"};y.prototype._getFormatter=function(t){var e=this._getBoundValueTypePattern(),a=false,r,i=this.getBinding("value"),o;if(i&&i.oType&&i.oType.oOutputFormat){a=!!i.oType.oOutputFormat.oFormatOptions.relative;o=i.oType.oOutputFormat.oFormatOptions.calendarType}if(!e){if(t){e=this.getDisplayFormat()||this._getDefaultDisplayStyle();o=this.getDisplayFormatType()}else{e=this.getValueFormat()||this._getDefaultValueStyle();o=h.Gregorian}}if(!o){o=sap.ui.getCore().getConfiguration().getCalendarType()}if(t){if(e===this._sUsedDisplayPattern&&o===this._sUsedDisplayCalendarType){r=this._oDisplayFormat}}else{if(e===this._sUsedValuePattern&&o===this._sUsedValueCalendarType){r=this._oValueFormat}}if(r){return r}return this._getFormatterInstance(r,e,a,o,t)};y.prototype._getFormatterInstance=function(t,e,a,r,i){if(this._checkStyle(e)){t=this._getFormatInstance({style:e,strictParsing:true,relative:a,calendarType:r},i)}else{t=this._getFormatInstance({pattern:e,strictParsing:true,relative:a,calendarType:r},i)}if(i){this._sUsedDisplayPattern=e;this._sUsedDisplayCalendarType=r;this._oDisplayFormat=t}else{this._sUsedValuePattern=e;this._sUsedValueCalendarType=r;this._oValueFormat=t}return t};y.prototype._getFormatInstance=function(t,e){return s.getInstance(t)};y.prototype._checkStyle=function(t){return t==="short"||t==="medium"||t==="long"||t==="full"};y.prototype._getDisplayFormatPattern=function(){var t=this._getBoundValueTypePattern();if(t){return t}t=this.getDisplayFormat();if(this._checkStyle(t)){t=this._getLocaleBasedPattern(t)}return t};y.prototype._getBoundValueTypePattern=function(){var a=this.getBinding("value"),r=a&&a.getType&&a.getType();if(r instanceof t){return r.getOutputPattern()}if(r instanceof e&&r.oFormat){return r.oFormat.oFormatOptions.pattern}return undefined};y.prototype._isValidDate=function(t){return t&&l.type(t)!=="date"};y.prototype._updateDomPlaceholder=function(t){if(this.getDomRef()){this._$input.attr("placeholder",t)}};return y});