package com.sw_engineering_candies.fem.client;

/* The symmetric banded matrix ( '-' indicates zero values):
 * 
 * |  a0  a1  a2   0    0  |
 * |  a1  a3  a4  a5    0  |
 * |  a2  a4  a6  a7   a8  |   
 * |  0   a5  a7  a9   a10 |
 * |  0   0   a8  a10  a11 |
 * 
 * is managed in the half band matrix format (just upper part):
 * 
 * |  a0   a1  a2 |
 * |  a3   a4  a5 |
 * |  a6   a7  a8 |   
 * |  a9   a10  0 |
 * |  a11  0    0 |
 * 
 * is stored as array:
 * 
 * [ a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, 0, a11, 0, 0 ] 
 * 
 */

final public class BandMatrix {

	private static final int MAX_NUMBER_OF_ITTERATIONS = 100;

	private final int rowNumber;

	private final int colNumber;

	final double[] values;

	private int getIndex(final int row, final int col) {
		return (col + row * getColNumber());
	}

	public BandMatrix(final int rowNumber, final int bandwidth) {
		this.rowNumber = rowNumber;
		colNumber = bandwidth / 2 + 1;

		values = new double[getRowNumber() * getColNumber()];
		for (int row = 0; row < getRowNumber(); row++) {
			for (int col = 0; col < getColNumber(); col++) {
				values[getIndex(row, col)] = 0.0f;
			}
		}
	}

	public BandMatrix(double[][] matrix) {
		rowNumber = matrix.length;
		colNumber = matrix[0].length;
		this.values = new double[rowNumber * colNumber];
		for (int i = 0; i < rowNumber; i++) {
			for (int j = 0; j < colNumber; j++) {
				values[getIndex(i, j)] = matrix[i][j];
			}
		}
	}

	public Vector times(final Vector B) {
		final Vector C = new Vector(getRowNumber());
		for (int row = 0; row < getRowNumber(); row++) {
			final int start = Math.max(0, row - getColNumber() + 1);
			final int end = Math.min(getRowNumber(), row + getColNumber());

			for (int col = start; col < Math.min(end, row); col++) {
				C.addValue(row, getValue(col, row) * B.getValue(col));
			}

			for (int col = Math.max(start, row); col < end; col++) {
				C.addValue(row, getValue(row, col) * B.getValue(col));
			}
		}
		return C;
	}

	double getValue(final int row, final int col) {
		return values[getIndex(row, col - row)];
	}

	/**
	 * The upper band and diagonal values are stored in the following
	 * half-banded-matrix format:
	 * 
	 * | 10 11 12 - - - - | | 10 11 12 | | 11 13 14 15 - - - | | 13 14 15 | | 12
	 * 14 16 17 18 - - | | 16 17 18 | | - 15 17 19 20 21 - | | 19 20 21 | | - -
	 * 18 20 22 23 24 | | 22 23 24 | | - - - 21 23 25 26 | | 25 26 - | | - - - -
	 * 24 26 27 | | 27 - - |
	 */
	public void setValue(final int row, final int col, final double value) {
		if (row <= col) {
			values[getIndex(row, col - row)] = value;
		}
	}

	public static Vector solveConjugateGradient(final BandMatrix A, final Vector b) {

		Vector vectorX = new Vector(b.getLength());
		Vector vectorR = b.minus(A.times(vectorX));
		Vector vectorP = new Vector(vectorR);
		double rs_old = vectorR.dotProduct(vectorR);
		int itteration = 1;
		for (itteration = 1; itteration < MAX_NUMBER_OF_ITTERATIONS; itteration++) {
			final Vector vectorAp = A.times(vectorP);
			final double alpha = rs_old / vectorP.dotProduct(vectorAp);
			vectorX = vectorX.plus(vectorP.multi(alpha));
			vectorR = vectorR.minus(vectorAp.multi(alpha));
			final double rs_new = vectorR.dotProduct(vectorR);
			if (rs_new < 1e-10) {
				break;
			}
			final double beta = rs_new / rs_old;
			vectorP = vectorR.plus(vectorP.multi(beta));
			rs_old = rs_new;
		}

		return vectorX;
	}

	public int getRowNumber() {
		return rowNumber;
	}

	public int getColNumber() {
		return colNumber;
	}
}
