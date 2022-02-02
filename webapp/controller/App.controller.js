sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"../libs/socket"
], function (Controller, Fragment, Socket) {
	"use strict";

	return Controller.extend("com.github.kornh.nodejs-presenter-ui.controller.App", {
		socket: null,
		onInit: function () {
			Fragment.load({
				name: "com.github.kornh.nodejs-presenter-ui.view.SlideshowDialog",
				controller: this
			}).then(function (_oDialog) {
				this._oDialog = _oDialog;
				this.getView().addDependent(this._oDialog);
			}.bind(this));

			this.socket = io();

			this.socket.emit("#file-list");
			this.socket.on('fileList', function (msg) {
				var model = this.getView().getModel("viewModel");
				model.setProperty("/files", msg);
				model.setProperty("/fullList", msg);
				model.setProperty("/searchText", "");
			}.bind(this));

			this.socket.on('image', function (img) {
				this.getView().getModel("viewModel").setProperty("/imageMax", img.length);
				var imageNum = this.getView().getModel("viewModel").getProperty("/imageNum");
				const blob = new Blob([img[imageNum]]);
				const url = URL.createObjectURL(blob);
				this.getView().getModel("viewModel").setProperty("/image", url);
			}.bind(this));
		},
		onSelectItem: function (oEvent) {
			var item = {
				filename: oEvent.getSource().data("filename"),
				hash: oEvent.getSource().data("hash")
			}

			var found = false;
			var fav = this.getView().getModel("viewModel").getProperty("/favorites");
			for (var index = 0; index < fav.length; index++) {
				var element = fav[index];
				found = element.hash === item.hash;
				if (found) {
					fav.splice(index, 1);
					break;
				}
			}
			if (!found) {
				fav.push(item);
			}
			this.getView().getModel("viewModel").setProperty("/favorites", fav);

			var files = this.getView().getModel("viewModel").getProperty("/files");
			for (index = 0; index < files.length; index++) {
				element = files[index];
				if (element.hash === item.hash) {
					element.found = !found;
					this.getView().getModel("viewModel").setProperty("/files", files);
					return;
				}
			}

		},
		onPressItem: function (oEvent) {
			this._oDialog.open();
			var hash = oEvent.getSource().data("hash")
			this.socket.emit("#start", hash);
			this.fetchDelayedScreen();
		},
		onImagePress: function (oEvent, imageNum) {
			if (imageNum >= 0) {
				this.getView().getModel("viewModel").setProperty("/imageNum", imageNum);
			}
			this.socket.emit("#screen");
		},
		onLeftPress: function (oEvent) {
			this.socket.emit("#left");
			this.fetchDelayedScreen();
		},
		onRightPress: function (oEvent) {
			this.socket.emit("#right");
			this.fetchDelayedScreen();
		},
		onStopPress: function (oEvent) {
			this.socket.emit("#stop");
			this.fetchDelayedScreen();
			this._oDialog.close();
		},
		fetchDelayedScreen: function () {
			setTimeout(function () {
				this.socket.emit("#screen");
			}.bind(this), 100)
		},
		onSearchChange: function (oEvent) {
			var filterText = oEvent.getParameter("query");
			var files = this.getView().getModel("viewModel").getProperty("/fullList");
			var newFilesList = [];
			if (filterText !== "") {
				for (var x = 0; x < files.length; x++) {
					var filename = files[x].filename;
					if (filename.toLowerCase().indexOf(filterText) > -1) {
						newFilesList.push(files[x])
					}
				}
			} else {
				newFilesList = files;
			}
			this.getView().getModel("viewModel").setProperty("/files", newFilesList);
		}

	});

});