/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Dialog","./ComboBoxTextField","./Input","./GroupHeaderListItem","./SuggestionsPopover","sap/ui/core/SeparatorItem","sap/ui/core/InvisibleText","sap/base/Log","./library","sap/ui/Device","sap/ui/core/library","./ComboBoxBaseRenderer","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/base/security/encodeXML","sap/base/strings/escapeRegExp"],function(t,e,i,s,o,n,r,a,u,p,h,l,g,d,c,f,y){"use strict";var I=u.PlacementType;var m=["value","enabled","name","placeholder","editable","textAlign","textDirection","valueState","valueStateText"];var b=e.extend("sap.m.ComboBoxBase",{metadata:{library:"sap.m",abstract:true,defaultAggregation:"items",properties:{showSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false},formattedTextFocused:{type:"boolean",defaultValue:false,hidden:true},open:{type:"boolean",defaultValue:false,hidden:true}},aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable"},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"}},events:{loadItems:{}},dnd:{draggable:false,droppable:true}}});b.DEFAULT_TEXT_FILTER=function(t,e,i){var s,o,n;if(!e[i]){return false}s=e[i]().toLowerCase();o=t.toLowerCase();n=new RegExp("(^|\\s)"+y(o)+".*","g");return n.test(s)};b.prototype.oncompositionstart=function(){this._bIsComposingCharacter=true};b.prototype.oncompositionend=function(t){this._bIsComposingCharacter=false;this._sComposition=t.target.value;if(!p.browser.edge&&!p.browser.firefox){e.prototype.handleInput.apply(this,arguments);this.handleInputValidation(t,this.isComposingCharacter())}};b.prototype.isComposingCharacter=function(){return this._bIsComposingCharacter};b.prototype.updateItems=function(t){this.bItemsUpdated=false;this.destroyItems();this.updateAggregation("items");this.bItemsUpdated=true;if(this.hasLoadItemsEventListeners()){this.onItemsLoaded()}};b.prototype.setFilterFunction=function(t){if(t===null||t===undefined){this.fnFilter=null;return this}if(typeof t!=="function"){a.warning("Passed filter is not a function and the default implementation will be used")}else{this.fnFilter=t}return this};b.prototype.highLightList=function(t,e,i){if(i&&typeof i==="function"){i(e,t)}else{this._oSuggestionPopover.highlightSuggestionItems(e,t,true)}};b.prototype._highlightList=function(t){var e=[],i=[],s,o,n;this._getList().getItems().forEach(function(t){o=t.getDomRef();n=o&&o.getElementsByClassName("sapMSLITitleOnly")[0];if(n){e.push(n);s=o.querySelector(".sapMSLIInfo");if(s&&t.getInfo){i.push(s)}}});this.highLightList(t,e);this.highLightList(t,i)};b.prototype._modifyPopupInput=function(t){this.setTextFieldHandler(t);return t};b.prototype.setTextFieldHandler=function(t){var e=this,i=t._handleEvent;t._handleEvent=function(t){i.apply(this,arguments);if(/keydown|sapdown|sapup|saphome|sapend|sappagedown|sappageup|input/.test(t.type)){e._handleEvent(t)}}};b.prototype.refreshItems=function(){this.bItemsUpdated=false;this.refreshAggregation("items")};b.prototype.loadItems=function(t,e){var i=typeof t==="function";if(this.hasLoadItemsEventListeners()&&this.getItems().length===0){this._bOnItemsLoadedScheduled=false;if(i){e=c.extend({action:t,busyIndicator:true,busyIndicatorDelay:300},e);this.aMessageQueue.push(e);if(this.iLoadItemsEventInitialProcessingTimeoutID===-1&&e.busyIndicator){this.iLoadItemsEventInitialProcessingTimeoutID=setTimeout(function t(){this.setInternalBusyIndicatorDelay(0);this.setInternalBusyIndicator(true)}.bind(this),e.busyIndicatorDelay)}}if(!this.bProcessingLoadItemsEvent){this.bProcessingLoadItemsEvent=true;this.fireLoadItems()}}else if(i){t.call(this)}};b.prototype.onItemsLoaded=function(){this.bProcessingLoadItemsEvent=false;clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);if(this.bInitialBusyIndicatorState!==this.getBusy()){this.setInternalBusyIndicator(this.bInitialBusyIndicatorState)}if(this.iInitialBusyIndicatorDelay!==this.getBusyIndicatorDelay()){this.setInternalBusyIndicatorDelay(this.iInitialBusyIndicatorDelay)}for(var t=0,e,i,s;t<this.aMessageQueue.length;t++){e=this.aMessageQueue.shift();t--;s=t+1===this.aMessageQueue.length;i=s?null:this.aMessageQueue[t+1];if(typeof e.action==="function"){if(e.name==="input"&&!s&&i.name==="input"){continue}e.action.call(this)}}};b.prototype.hasLoadItemsEventListeners=function(){return this.hasListeners("loadItems")};b.prototype._scheduleOnItemsLoadedOnce=function(){if(!this._bOnItemsLoadedScheduled&&!this.isBound("items")&&this.hasLoadItemsEventListeners()&&this.bProcessingLoadItemsEvent){this._bOnItemsLoadedScheduled=true;setTimeout(this.onItemsLoaded.bind(this),0)}};b.prototype.getPickerInvisibleTextId=function(){return r.getStaticId("sap.m","COMBOBOX_AVAILABLE_OPTIONS")};b.prototype._getGroupHeaderInvisibleText=function(){if(!this._oGroupHeaderInvisibleText){this._oGroupHeaderInvisibleText=new r;this._oGroupHeaderInvisibleText.toStatic()}return this._oGroupHeaderInvisibleText};b.prototype._getItemByListItem=function(t){return this._getItemBy(t,"ListItem")};b.prototype._getItemBy=function(t,e){e=this.getRenderer().CSS_CLASS_COMBOBOXBASE+e;for(var i=0,s=this.getItems(),o=s.length;i<o;i++){if(s[i].data(e)===t){return s[i]}}return null};b.prototype._isListInSuggestMode=function(){return this._getList().getItems().some(function(t){return!t.getVisible()&&this._getItemByListItem(t).getEnabled()},this)};b.prototype.getListItem=function(t){return t?t.data(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"ListItem"):null};b.prototype.getSelectable=function(t){return t._bSelectable};b.prototype._setItemsShownWithFilter=function(t){this._bItemsShownWithFilter=t};b.prototype._getItemsShownWithFilter=function(){return this._bItemsShownWithFilter};b.prototype.init=function(){e.prototype.init.apply(this,arguments);this.setPickerType(p.system.phone?"Dialog":"Dropdown");this._setItemsShownWithFilter(false);this.bItemsUpdated=false;this.bOpenedByKeyboardOrButton=false;this._bShouldClosePicker=false;this._oPickerValueStateText=null;this.bProcessingLoadItemsEvent=false;this.iLoadItemsEventInitialProcessingTimeoutID=-1;this.aMessageQueue=[];this.bInitialBusyIndicatorState=this.getBusy();this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();this._bOnItemsLoadedScheduled=false;this._bDoTypeAhead=true;this.getIcon().addEventDelegate({onmousedown:function(t){this._bShouldClosePicker=this.isOpen()}},this);this.getIcon().attachPress(this._handlePopupOpenAndItemsLoad.bind(this,true));this._sComposition="";this.fnFilter=null};b.prototype.onBeforeRendering=function(){var t=this.getOpen(),i=t?this._oSuggestionPopover._getValueStateHeader().getText():null,s=t?this._oSuggestionPopover._getValueStateHeader().getValueState():null;e.prototype.onBeforeRendering.apply(this,arguments);if(t&&(this.getValueStateText()&&i!==this.getValueStateText()||this.getValueState()!==s||this.getFormattedValueStateText())){this._updateSuggestionsPopoverValueState()}};b.prototype._handlePopupOpenAndItemsLoad=function(t){var e;if(!this.getEnabled()||!this.getEditable()){return}if(t&&this._getItemsShownWithFilter()){this._bShouldClosePicker=false;this.toggleIconPressedStyle(true);this.bOpenedByKeyboardOrButton=false;this.clearFilter();this._setItemsShownWithFilter(false);return}if(this._bShouldClosePicker){this._bShouldClosePicker=false;this.close();return}this.loadItems();this.bOpenedByKeyboardOrButton=t;if(this.isPlatformTablet()){this.syncPickerContent();e=this.getPicker();e.setInitialFocus(e)}this.open()};b.prototype.exit=function(){e.prototype.exit.apply(this,arguments);if(this._getList()){this._getList().destroy();this._oList=null}if(this._getGroupHeaderInvisibleText()){this._getGroupHeaderInvisibleText().destroy();this._oGroupHeaderInvisibleText=null}clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);this.aMessageQueue=null;this.fnFilter=null};b.prototype.onsapshow=function(t){if(!this.getEnabled()||!this.getEditable()){return}t.setMarked();if(t.keyCode===d.F4){this.onF4(t)}if(this._getItemsShownWithFilter()){this.loadItems(this._handlePopupOpenAndItemsLoad.bind(this,true));return}if(this.isOpen()){this.close();return}this.selectText(0,this.getValue().length);this.loadItems();this.bOpenedByKeyboardOrButton=true;this.open()};b.prototype.onF4=function(t){t.preventDefault()};b.prototype.onsapescape=function(t){if(this.getEnabled()&&this.getEditable()&&this.isOpen()){t.setMarked();t.preventDefault();this.close()}else{e.prototype.onsapescape.apply(this,arguments)}};b.prototype.onsaphide=b.prototype.onsapshow;b.prototype.onsapfocusleave=function(t){if(!t.relatedControlId){e.prototype.onsapfocusleave.apply(this,arguments);return}var i=sap.ui.getCore().byId(t.relatedControlId);if(i===this){return}var s=this.getPicker(),o=i&&i.getFocusDomRef();if(s&&g(s.getFocusDomRef(),o)){return}e.prototype.onsapfocusleave.apply(this,arguments)};b.prototype.getPopupAnchorDomRef=function(){return this.getDomRef()};b.prototype.addContent=function(t){};b.prototype.getList=function(){a.warning("[Warning]:","You are attempting to use deprecated method 'getList()', please refer to SAP note 2746748.",this);return this._getList()};b.prototype._getList=function(){if(this.bIsDestroyed){return null}return this._oList};b.prototype.setPickerType=function(t){this._sPickerType=t};b.prototype.getPickerType=function(){return this._sPickerType};b.prototype._updateSuggestionsPopoverValueState=function(){var t=this._getSuggestionsPopover();if(!t){return}var e=this.getValueState(),i=this.getValueState()!==t._getValueStateHeader().getValueState(),s=this.getFormattedValueStateText(),o=this.getValueStateText(),n=s||i;if(t.isOpen()&&!n){this.setFormattedValueStateText(t._getValueStateHeader().getFormattedText())}t.updateValueState(e,s||o,this.getShowValueStateMessage())};b.prototype.shouldValueStateMessageBeOpened=function(){var t=e.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);return t&&!this.isOpen()};b.prototype.onPropertyChange=function(t,e){var i=t.getParameter("newValue"),s=t.getParameter("name"),o="set"+s.charAt(0).toUpperCase()+s.slice(1),n=e&&e.srcControl||this.getPickerTextField();if(this.getInputForwardableProperties().indexOf(s)>-1&&n&&typeof n[o]==="function"){n[o](i)}};b.prototype.getInputForwardableProperties=function(){return m};b.prototype.isPickerDialog=function(){return this.getPickerType()==="Dialog"};b.prototype.isPlatformTablet=function(){var t=!p.system.combi,e=p.system.tablet&&t;return e};b.prototype.createPickerTextField=function(){var t=new i({width:"100%",showValueStateMessage:false});return t};b.prototype.getDropdownSettings=function(){return{showArrow:false,placement:I.VerticalPreferredBottom,offsetX:0,offsetY:0,bounce:false,ariaLabelledBy:this.getPickerInvisibleTextId()||undefined}};b.prototype._configureList=function(){};b.prototype.createPicker=function(t){var e=this.getAggregation("picker");if(e){return e}this._oSuggestionPopover=this._createSuggestionsPopover();e=this._oSuggestionPopover._oPopover;this.setAggregation("picker",e,true);this.configPicker(e);return e};b.prototype.configPicker=function(t){};b.prototype._hasShowSelectedButton=function(){return false};b.prototype._createSuggestionsPopover=function(){var t=this.isPickerDialog(),e;e=new o(this);if(t){var i=this.createPickerTextField();e._oPopupInput=this._modifyPopupInput(i)}e._createSuggestionPopup({showSelectedButton:this._hasShowSelectedButton()});e._createSuggestionPopupContent(false);this.forwardEventHandlersToSuggPopover(e);this._oList=e._oList;this._configureList(this._oList);return e};b.prototype.forwardEventHandlersToSuggPopover=function(t){t.setOkPressHandler(this._handleOkPress.bind(this));t.setCancelPressHandler(this._handleCancelPress.bind(this));t.setInputLabels(this.getLabels.bind(this))};b.prototype._handleOkPress=function(){var t=this,e=t.getPickerTextField();t.updateDomValue(e.getValue());t.onChange();t.close()};b.prototype._handleCancelPress=function(){this.close();this.revertSelection()};b.prototype.setSelectable=function(t,e){if(this.indexOfItem(t)<0){return}t._bSelectable=e;var i=this.getListItem(t);if(i){i.setVisible(e)}};b.prototype.onBeforeOpen=function(){this._updateSuggestionsPopoverValueState();if(!this._getItemsShownWithFilter()){this.toggleIconPressedStyle(true)}};b.prototype.onBeforeClose=function(){this.bOpenedByKeyboardOrButton=false;this._setItemsShownWithFilter(false);this._updateSuggestionsPopoverValueState()};b.prototype.getPicker=function(){var t=this.getAggregation("picker");if(t&&!t.bIsDestroyed&&!this.bIsDestroyed){return t}return null};b.prototype._getSuggestionsPopover=function(){return this._oSuggestionPopover};b.prototype.getValueStateLinks=function(){var t=this.getPicker()&&this.getPicker().getCustomHeader()&&typeof this.getPicker().getCustomHeader().getFormattedText==="function",e=t&&this.getPicker().getCustomHeader().getFormattedText(),i=e&&e.getControls();return i||[]};b.prototype.getPickerTextField=function(){var t=this.getPicker(),e=t&&t.getSubHeader();return e&&e.getContent()[0]||null};b.prototype.getPickerTitle=function(){var t=this.getPicker(),e=t&&t.getCustomHeader();if(this.isPickerDialog()&&e){return e.getContentMiddle()[0]}return null};b.prototype.revertSelection=function(){};b.prototype.hasContent=function(){return this.getItems().length>0};b.prototype.syncPickerContent=function(){};b.prototype.findFirstEnabledItem=function(t){t=t||this.getItems();for(var e=0;e<t.length;e++){if(t[e].getEnabled()){return t[e]}}return null};b.prototype.findLastEnabledItem=function(t){t=t||this.getItems();return this.findFirstEnabledItem(t.reverse())};b.prototype.open=function(){var t=this.getPicker();if(t){t.open()}return this};b.prototype.getVisibleItems=function(){for(var t=0,e,i=this.getItems(),s=[];t<i.length;t++){e=this.getListItem(i[t]);if(e&&e.getVisible()){s.push(i[t])}}return s};b.prototype.isItemSelected=function(){};b.prototype.getKeys=function(t){t=t||this.getItems();for(var e=0,i=[];e<t.length;e++){i[e]=t[e].getKey()}return i};b.prototype.getSelectableItems=function(){return this.getEnabledItems(this.getVisibleItems())};b.prototype.findItem=function(t,e){var i="get"+t.charAt(0).toUpperCase()+t.slice(1);for(var s=0,o=this.getItems();s<o.length;s++){if(o[s][i]()===e){return o[s]}}return null};b.prototype.getItemByText=function(t){return this.findItem("text",t)};b.prototype.clearFilter=function(){this.getItems().forEach(function(t){var e=this.getListItem(t);if(e){e.setVisible(t.getEnabled()&&this.getSelectable(t))}},this)};b.prototype.onItemChange=function(t){};b.prototype.clearSelection=function(){};b.prototype.setInternalBusyIndicator=function(t){this.bInitialBusyIndicatorState=this.getBusy();return this.setBusy.apply(this,arguments)};b.prototype.setInternalBusyIndicatorDelay=function(t){this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();return this.setBusyIndicatorDelay.apply(this,arguments)};b.prototype.addItem=function(t){this.addAggregation("items",t);if(t){t.attachEvent("_change",this.onItemChange,this)}if(this._getList()){this._getList().addItem(this._mapItemToListItem(t))}return this};b.prototype.insertItem=function(t,e){this.insertAggregation("items",t,e,true);if(t){t.attachEvent("_change",this.onItemChange,this)}if(this._getList()){this._getList().insertItem(this._mapItemToListItem(t),e)}this._scheduleOnItemsLoadedOnce();return this};b.prototype.getItemAt=function(t){return this.getItems()[+t]||null};b.prototype.getFirstItem=function(){return this.getItems()[0]||null};b.prototype.getLastItem=function(){var t=this.getItems();return t[t.length-1]||null};b.prototype.getEnabledItems=function(t){t=t||this.getItems();return t.filter(function(t){return t.getEnabled()})};b.prototype.getItemByKey=function(t){return this.findItem("key",t)};b.prototype.addItemGroup=function(t,e,i){e=e||new n({text:t.text||t.key});this.addAggregation("items",e,i);if(this._getList()&&e.isA("sap.ui.core.SeparatorItem")){this._getList().addItem(this._mapItemToListItem(e))}return e};b.prototype._mapSeparatorItemToGroupHeader=function(t,e){var i=new s({title:t.getText(),ariaLabelledBy:this._getGroupHeaderInvisibleText().getId()});i.addStyleClass(e.CSS_CLASS_COMBOBOXBASE+"NonInteractiveItem");if(t.getText&&!t.getText()){i.addStyleClass(e.CSS_CLASS_COMBOBOXBASE+"SeparatorItemNoText")}return i};b.prototype.isOpen=function(){var t=this.getPicker();return!!(t&&t.isOpen())};b.prototype.close=function(){var t=this.getPicker();if(t){t.close()}return this};b.prototype.removeItem=function(t){t=this.removeAggregation("items",t);if(t){t.detachEvent("_change",this.onItemChange,this)}return t};b.prototype.removeAllItems=function(){var t=this.removeAllAggregation("items");this.clearSelection();for(var e=0;e<t.length;e++){t[e].detachEvent("_change",this.onItemChange,this)}return t};b.prototype.intersectItems=function(t,e){return t.filter(function(t){return e.map(function(t){return t.getId()}).indexOf(t.getId())!==-1})};b.prototype.showItems=function(t){var e=this.fnFilter,i=function(){if(!this.getItems().length){return}this.detachLoadItems(i);this.setFilterFunction(t||function(){return true});this.applyShowItemsFilters();this._handlePopupOpenAndItemsLoad(false);this.setFilterFunction(e)}.bind(this);if(!this.getEnabled()||!this.getEditable()){return}this._setItemsShownWithFilter(true);this.attachLoadItems(i);this.loadItems(i)};b.prototype.applyShowItemsFilters=function(){};return b});