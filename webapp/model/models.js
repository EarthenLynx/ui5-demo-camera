sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createConfigModel() {
			const oModel = new JSONModel({
				"cameraSelection": "",
				"cameraSnapUrl": "",
				"videoDevices": [],
				"videoContrains": {
					video: {
						height: { min: 640, ideal: 736, max: 736 },
						width: { min: 326, ideal: 538, max: 1920 },
						deviceId: {
							exact: '',
						},
					},
				}
			})
			return oModel;
		}

	};
});