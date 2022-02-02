sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("com.github.kornh.nodejs-presenter-ui.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);


			// Create a JSON model from an object literal
			var oModel = new JSONModel({
				files: [],
				fullList: [],
				favorites: [],
				searchText: '',
				image: null,
				imageNum: 0,
				imageMax: 1
			});

			// Assign the model object to the SAPUI5 core
			this.setModel(oModel, "viewModel");
		}

	});

});