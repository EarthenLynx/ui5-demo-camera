/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Helper","./_V2MetadataConverter","./_V4MetadataConverter","sap/base/Log","sap/ui/thirdparty/jquery"],function(e,t,a,r,n){"use strict";return{create:function(i,o,s){var d={},u=e.buildQuery(s);return{read:function(s,f,c){var l;function M(e){var r=o==="4.0"||f?a:t,n=e.$XML;delete e.$XML;return Object.assign((new r).convertXMLMetadata(n,s),e)}if(s in d){if(c){throw new Error("Must not prefetch twice: "+s)}l=d[s].then(M);delete d[s]}else{l=new Promise(function(t,a){n.ajax(f?s:s+u,{method:"GET",headers:i}).then(function(e,a,r){var n=r.getResponseHeader("Date"),i=r.getResponseHeader("ETag"),o={$XML:e},s=r.getResponseHeader("Last-Modified");if(n){o.$Date=n}if(i){o.$ETag=i}if(s){o.$LastModified=s}t(o)},function(t,n,i){var o=e.createError(t,"Could not load metadata");r.error("GET "+s,o.message,"sap.ui.model.odata.v4.lib._MetadataRequestor");a(o)})});if(c){d[s]=l}else{l=l.then(M)}}return l}}}}},false);