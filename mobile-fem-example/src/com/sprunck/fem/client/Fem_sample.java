package com.sprunck.fem.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.Timer;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class Fem_sample implements EntryPoint {

	CallbackUtilityClass callbackUtilityClass;

	/**
	 * This is the entry point method.
	 */
	@Override
	public void onModuleLoad() {
		callbackUtilityClass = new CallbackUtilityClass();
		CallbackUtilityClass.exportStaticMethod();

		Timer timerGraficUpdate = new Timer() {
			@Override
			public void run() {
				callbackUtilityClass.updateModel();
			}
		};
		timerGraficUpdate.scheduleRepeating(500);

	}
}
