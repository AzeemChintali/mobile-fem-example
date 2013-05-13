package com.sprunck.fem.client;

/**
 * This class xxx
 * 
 * @author Markus Sprunck
 * 
 */
final public class MatrixBanded {

	private final int row;

	private final int col;

	private final double[][] matrix;

	public MatrixBanded(double[][] matrix) {
		if (matrix == null || matrix.length <= 0 || matrix[0].length <= 0) {
			throw new RuntimeException("Illegal parameter.");
		}

		row = matrix.length;
		col = matrix[0].length;
		this.matrix = new double[row][col];
		for (int i = 0; i < row; i++) {
			for (int j = 0; j < col; j++) {
				this.matrix[i][j] = matrix[i][j];
			}
		}
	}

	public Matrix times(Matrix B) {
		final MatrixBanded A = this;
		if (A.row != B.row || B.col != 1) {
			throw new RuntimeException("Illegal matrix dimensions.");
		}

		final Matrix C = new Matrix(A.row, 1);
		for (int i = 0; i < A.row; i++) {
			for (int k = i - A.col; k - i < A.col; k++) {
				if (k >= 0 && k < B.row) {
					C.matrix[i][0] += getValue(A, i, k) * B.matrix[k][0];
				}
			}
		}
		return C;
	}

	public static double getValue(final MatrixBanded bandmatrix, int row, int col) {
		if (col == row) {
			return bandmatrix.matrix[row][0];
		} else if (row > col) {
			return getValue(bandmatrix, col, row);
		} else if (col - row < bandmatrix.col) {
			return bandmatrix.matrix[row][col - row];
		}

		return 0.0;
	}

	public static void setValue(final MatrixBanded bandmatrix, int row, int col, double value) {
		if (col == row) {
			bandmatrix.matrix[row][0] = value;
		} else if (row > col) {
			setValue(bandmatrix, col, row, value);
		} else if (col - row < bandmatrix.col) {
			bandmatrix.matrix[row][col - row] = value;
		}
	}

	public static Matrix solveConjugateGradient(final MatrixBanded A, final Matrix b, final double[] initial, int maxNumberItterations) {
		final double start = System.currentTimeMillis();

		Matrix x = (initial != null) ? new Matrix(initial).transpose() : new Matrix(b.row, b.col);
		Matrix r = b.minus(A.times(x));
		Matrix p = new Matrix(r);
		double rsold = r.transpose().times(r).getData()[0][0];
		int i;
		for (i = 1; i < maxNumberItterations; i++) {
			final Matrix Ap = A.times(p);
			final double alpha = rsold / p.transpose().times(Ap).getData()[0][0];
			x = x.plus(p.mult(alpha));
			r = r.minus(Ap.mult(alpha));
			final double rsnew = r.transpose().times(r).getData()[0][0];
			final double beta = rsnew / rsold;
			if (rsnew < 1e-5) {
				break;
			}
			p = r.plus(p.mult(beta));
			rsold = rsnew;
		}

		final double end = System.currentTimeMillis();
		System.out.println("conjugate gradient ready [" + (end - start) + "ms, itterations=" + i + "]");

		return x;
	}
}