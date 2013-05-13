package com.sw_engineering_candies.fem.client;

public class CallbackUtilityClass {

	final static FemCore model = new FemCore();

	static Double currentBeta = 60.0;

	static Double currentGamma = 0.0;

	public CallbackUtilityClass() {
		final String inputModel = ModelUtil.createDefaultModel(model).toString();
		model.createStiffnessMatrix(inputModel);
		String json = ModelUtil.getJSON(model, currentBeta, currentGamma);
		setModelGlobal(json, currentBeta, currentGamma);
	}

	public void updateModel() {
		updateForces();
		String json = ModelUtil.getJSON(model, currentBeta, currentGamma);
		setModelGlobal(json, currentBeta, currentGamma);
	}

	public static void updateForces() {
		String currentBetaNew = getCurrentBeta();
		if (null != currentBetaNew && !currentBetaNew.isEmpty()) {
			currentBeta = Double.valueOf(currentBetaNew);
		}
		String currentGammaNew = getCurrentGamma();
		if (null != currentGammaNew && !currentGammaNew.isEmpty()) {
			currentGamma = Double.valueOf(currentGammaNew);
		}
	}

	public static native void exportStaticMethod() /*-{
													$wnd.updateForces = $entry(@com.sw_engineering_candies.fem.client.CallbackUtilityClass::updateForces());
													}-*/;

	public static native void setModelGlobal(String model, Double currentBeta, Double currentGamma)
	/*-{
		$wnd.setModel(model);
		$wnd.setGamma(currentGamma);
		$wnd.setBeta(currentBeta);
	}-*/;

	public static native String getCurrentBeta()
	/*-{
		return $wnd.getBeta();
	}-*/;

	public static native String getCurrentGamma()
	/*-{
		return $wnd.getGamma();
	}-*/;

}
