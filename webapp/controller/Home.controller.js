sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit() {
			const self = this;

			const videoContraints = self.getOwnerComponent().getModel('config').getProperty('/videoContrains'); 

			// Initially set the video media devices
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) =>
					devices.filter((device) => device.kind === 'videoinput')
				)
				.then((videoDevices) => (self.videoDevices = videoDevices))
				.then(
					() =>
						(videoContraints.video.deviceId.exact =
							self.videoDevices[1].deviceId)
				)
				// After contraints are set, initially ask for stream permission
				.then(() => self.handleChangeStream());
		}, 

		handleChangeStream() {
			const self = this;

			console.log(self.getOwnerComponent().getModel('config'))

			// Get the video contrains
			const videoContraints = self.getOwnerComponent().getModel('config').getProperty('/videoContrains'); 
			console.log(videoContraints);
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