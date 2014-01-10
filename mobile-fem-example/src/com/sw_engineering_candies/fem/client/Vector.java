package com.sw_engineering_candies.fem.client;

public class Vector {

   final double[] values;

   public int getLength() {
      return values.length;
   }

   public double getValue(final int index) {
      return (index >= 0 && index < values.length) ? values[index] : 0.0;
   }

   public void setValue(final int index, final double value) {
      values[index] = value;
   }

   public void addValue(final int index, final double value) {
      values[index] += value;
   }

   public Vector(final int length) {
      values = new double[length];
   }

   public Vector(final Vector A) {
      this(A.values);
   }

   public Vector(final double[] values) {
      this.values = new double[values.length];
      for (int i = 0; i < values.length; i++) {
         this.values[i] = values[i];
      }
   }

   // return C = A + B
   public Vector plus(final Vector B) {
      final Vector C = new Vector(values.length);
      for (int i = 0; i < values.length; i++) {
         C.values[i] = values[i] + B.values[i];
      }
      return C;
   }

   // return C = A - B
   public Vector minus(final Vector B) {
      final Vector C = new Vector(values.length);
      for (int i = 0; i < values.length; i++) {
         C.values[i] = values[i] - B.values[i];
      }
      return C;
   }

   // return C = A o B 
   public double dotProduct(final Vector B) {
      double C = 0.0f;
      for (int i = 0; i < values.length; i++) {
         C += values[i] * B.values[i];
      }
      return C;
   }

   //   public double dotProduct(Vector B) {
   //      final double[] valuesX =new double[B.values.length];;
   //      final double[] valuesA = new double[B.values.length];
   //      final double[] valuesB = new double[B.values.length];
   //
   //      for (int i = 0; i < B.values.length; i++) {
   //         valuesA[i] = values[i];
   //         valuesB[i] = B.values[i];
   //      }
   //
   //      Kernel kernel = new Kernel() {
   //         @Override
   //         public void run() {
   //            int gid = getGlobalId();
   //            valuesX[gid] += valuesA[gid] * valuesB[gid];
   //         }
   //      };
   //      kernel.setExecutionMode(Kernel.EXECUTION_MODE.JTP);
   //      kernel.execute(Range.create(valuesB.length));
   //      double result =0.0f;
   //      for (int i = 0; i < valuesX.length;i++) {
   //         result +=  valuesX[i];
   //      }
   //      kernel.dispose();
   //      return result;
   //   }

   // return C = A * alpha
   public Vector multi(final double alpha) {
      final Vector C = new Vector(values.length);
      for (int i = 0; i < values.length; i++) {
         C.values[i] = values[i] * alpha;
      }
      return C;
   }

}