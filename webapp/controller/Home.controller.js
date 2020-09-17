sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

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
					console.log(config.getProperty('/videoDevices'));
				})
				.then(
					() =>
						(videoContraints.video.deviceId.exact =
							config.getProperty('/videoDevices')[1].deviceId)
				)
				// After contraints are set, initially ask for stream permission
				.then(() => self.handleChangeStream());
		},

		handleChangeStream() {
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
		}
	});
});