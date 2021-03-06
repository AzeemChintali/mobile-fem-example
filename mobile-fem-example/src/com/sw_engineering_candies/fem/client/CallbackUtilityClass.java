/**
 * Copyright (C) 2012-2013, Markus Sprunck
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the following
 * conditions are met:
 *
 * - Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above
 *   copyright notice, this list of conditions and the following
 *   disclaimer in the documentation and/or other materials provided
 *   with the distribution.
 *
 * - The name of its contributor may be used to endorse or promote
 *   products derived from this software without specific prior
 *   written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * 
 */
package com.sw_engineering_candies.fem.client;

public class CallbackUtilityClass {

	final static FemCore model = new FemCore();

	static Double currentBeta = 0.0;

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
		
		final double start = System.currentTimeMillis();
		setModelGlobal(json, currentBeta, currentGamma);
		
		final double end = System.currentTimeMillis();
		System.out.println("update model ready       [" + (end - start) + "ms]");
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
