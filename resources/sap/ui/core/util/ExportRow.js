/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","./ExportCell"],function(e,t){"use strict";var a=e.extend("sap.ui.core.util.ExportRow",{metadata:{library:"sap.ui.core",aggregations:{cells:{type:"sap.ui.core.util.ExportCell",multiple:true}}}});return a});