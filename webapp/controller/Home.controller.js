sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/core/Fragment"
], function (Controller, formatter, Fragment) {
	"use strict";

	return Controller.extend("ui5.demo.camera.controller.App", {

		formatter: formatter,

		onInit() {
			const self = this;

			// Get the config and video contraints
			const config = self.getOwnerComponent().getModel('config')
			const videoContraints = config.getProperty('/videoContrains');

			// Initially get and set the video media devices
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) =>
					devices.filter((device) => device.kind === 'videoinput')
				)
				.then((videoDevices) => {
					// Set the config model accordingly to the media devices that have been found
					config.setProperty('/videoDevices', videoDevices);
				})
				.then(
					() =>
						(videoContraints.video.deviceId.exact =
							config.getProperty('/videoDevices')[1].deviceId)
				)
				// After contraints are set, initially ask for stream permission
				.then(() => self.onChangeStream());
		},

		onChangeStream() {
			const self = this;

			// Get the video contrains
			const videoContraints = self.getOwnerComponent().getModel('config').getProperty('/videoContrains');
			const video = document.getElementById('video-stream');
			navigator.mediaDevices.getUserMedia(videoContraints).then((stream) => {
				video.srcObject = stream;
				video.play();
			});
		},

		handleTakeScreenshot() {
			const canvas = document.getElementById('video-canvas');
			const video = document.getElementById('video-stream');

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			canvas.getContext('2d').drawImage(video, 0, 0);

			// Convert the canvas content to data Url and assign to model
			this.getOwnerComponent().getModel('config').setProperty('/cameraSnapUrl', canvas.toDataURL('image/jpg'))

			// Open the dialog
			this.onOpenPreview();
		},

		onOpenPreview() {
			const oView = this.getView();

			// create dialog lazily
			if (!this.byId("preview")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ui5.demo.camera.view.Preview",
					controller: this
				}).then((oDialog) => {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("preview").open();
			}
		},

		onClosePreview() {
			this.byId("preview").close();
		}
	});
});