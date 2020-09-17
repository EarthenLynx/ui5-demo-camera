/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/m/TextArea","sap/m/Button","./FeedInputRenderer","sap/ui/thirdparty/jquery"],function(t,e,o,r,i,s,n){"use strict";var a=t.ButtonType;var u=15,p=2,l=0;var h=e.extend("sap.m.FeedInput",{metadata:{library:"sap.m",designtime:"sap/m/designtime/FeedInput.designtime",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},rows:{type:"int",group:"Appearance",defaultValue:2},showExceededText:{type:"boolean",group:"Behavior",defaultValue:false},maxLength:{type:"int",group:"Behavior",defaultValue:0},growing:{type:"boolean",group:"Behavior",defaultValue:false},growingMaxLines:{type:"int",group:"Behavior",defaultValue:0},placeholder:{type:"string",group:"Appearance",defaultValue:"Post something here"},value:{type:"string",group:"Data",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},showIcon:{type:"boolean",group:"Behavior",defaultValue:true},iconDensityAware:{type:"boolean",group:"Appearance",defaultValue:true},buttonTooltip:{type:"sap.ui.core.TooltipBase",group:"Accessibility",defaultValue:"Submit"},ariaLabelForPicture:{type:"string",group:"Accessibility",defaultValue:null}},events:{post:{parameters:{value:{type:"string"}}}}}});h.prototype.init=function(){var t=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.setProperty("placeholder",t.getText("FEEDINPUT_PLACEHOLDER"),true);this.setProperty("buttonTooltip",t.getText("FEEDINPUT_SUBMIT"),true)};h.prototype.exit=function(){if(this._oTextArea){this._oTextArea.destroy()}if(this._oButton){this._oButton.destroy()}if(this._oImageControl){this._oImageControl.destroy()}};h.prototype.setIconDensityAware=function(t){this.setProperty("iconDensityAware",t,true);var e=sap.ui.require("sap/m/Image");if(this._getImageControl()instanceof e){this._getImageControl().setDensityAware(t)}return this};h.prototype.setRows=function(t){var e=this.getProperty("growingMaxLines");if(t>u){t=u}else if(t<p){t=p}if(t>e&&e!==0){this.setProperty("growingMaxLines",t,true);this._getTextArea().setGrowingMaxLines(t)}this.setProperty("rows",t,true);this._getTextArea().setRows(t);return this};h.prototype.setShowExceededText=function(t){this.setProperty("showExceededText",t,true);this._getTextArea().setShowExceededText(t);return this};h.prototype.setMaxLength=function(t){this.setProperty("maxLength",t,true);this._getTextArea().setMaxLength(t);return this};h.prototype.setGrowing=function(t){this.setProperty("growing",t,true);this._getTextArea().setGrowing(t);return this};h.prototype.setGrowingMaxLines=function(t){var e=this.getProperty("rows");if(t!==l){if(t<e){t=e}else if(t>u){t=u}}this.setProperty("growingMaxLines",t,true);this._getTextArea().setGrowingMaxLines(t);return this};h.prototype.setValue=function(t){this.setProperty("value",t,true);this._getTextArea().setValue(t);this._enablePostButton();return this};h.prototype.setPlaceholder=function(t){this.setProperty("placeholder",t,true);this._getTextArea().setPlaceholder(t);return this};h.prototype.setEnabled=function(t){this.setProperty("enabled",t,true);if(this.getDomRef("outerContainer")){if(t){this.getDomRef("outerContainer").classList.remove("sapMFeedInDisabled")}else{this.getDomRef("outerContainer").classList.add("sapMFeedInDisabled")}}this._getTextArea().setEnabled(t);this._enablePostButton();return this};h.prototype.setButtonTooltip=function(t){this.setProperty("buttonTooltip",t,true);this._getPostButton().setTooltip(t);return this};h.prototype._getTextArea=function(){var t=this;if(!this._oTextArea){this._oTextArea=new r(this.getId()+"-textArea",{value:this.getValue(),maxLength:this.getMaxLength(),placeholder:this.getPlaceholder(),growing:this.getGrowing(),growingMaxLines:this.getGrowingMaxLines(),showExceededText:this.getShowExceededText(),rows:this.getRows(),liveChange:n.proxy(function(t){var e=t.getParameter("value");this.setProperty("value",e,true);this._enablePostButton()},this)});this._oTextArea.setParent(this);this._oTextArea.addEventDelegate({onAfterRendering:function(){t.$("counterContainer").empty();t.$("counterContainer").html(t._oTextArea.getAggregation("_counter").$())}})}return this._oTextArea};h.prototype._getPostButton=function(){if(!this._oButton){this._oButton=new i(this.getId()+"-button",{enabled:false,type:a.Default,icon:"sap-icon://feeder-arrow",tooltip:this.getButtonTooltip(),press:n.proxy(function(){this._oTextArea.focus();this.firePost({value:this.getValue()});this.setValue(null)},this)});this._oButton.setParent(this)}return this._oButton};h.prototype._enablePostButton=function(){var t=this._isControlEnabled();var e=this._getPostButton();e.setEnabled(t)};h.prototype._isControlEnabled=function(){var t=this.getValue();return this.getEnabled()&&n.type(t)==="string"&&t.trim().length>0};h.prototype._getImageControl=function(){var e=this.getIcon()||o.getIconURI("person-placeholder"),r=this.getId()+"-icon",i={src:e,alt:this.getAriaLabelForPicture(),densityAware:this.getIconDensityAware(),decorative:false,useIconTooltip:false},s=["sapMFeedInImage"];this._oImageControl=t.ImageHelper.getImageControl(r,this._oImageControl,this,i,s);return this._oImageControl};return h});