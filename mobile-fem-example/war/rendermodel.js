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

function ModelRenderer() {

	var offset_x = 200;
	var offset_y = 200;

	var offset_x_scala = 20;
	var offset_y_scala = 160;
	
	var scala_size_x = 20;
	var scala_size_y = 160;

	var factorX = 3;
	var factorY = 3;

	this.factorForce = 0.1;
	this.factorDisplacement = 1900;
	
	this.beta = 1.1;
	this.gamma = 1.1;
	
	this.rotate = false;
	
	this.display_scale = true;

	var minColor = 20;
	var maxColor = -20;

	var frequency = 2.0;
	function getColor(mean) {
		mean = -mean;
		red = Math.sin(frequency * mean + 2) * 127 + 128;
		green = Math.sin(frequency * mean + 1) * 127 + 128;
		blue = Math.sin(frequency * mean + 4) * 127 + 128;
		return '#' + toHex(red) + toHex(green) + toHex(blue);
	}

	function toHex(n) {
		n = parseInt(n, 10);
		if (isNaN(n))
			return "00";
		n = Math.max(0, Math.min(n, 255));
		return "0123456789ABCDEF".charAt((n - n % 16) / 16)
				+ "0123456789ABCDEF".charAt(n % 16);
	}

	function draw_scala() {
		var path = new paper.Path();
		var delta = 0.15;
		for ( var index = -1.0; index < 1.0; index += delta) {
			var path = new paper.Path();
			path.add(new paper.Point(offset_x_scala, offset_y_scala
					+ (-index + delta) * scala_size_y));
			path.add(new paper.Point(offset_x_scala, offset_y_scala - index
					* scala_size_y));
			path.add(new paper.Point(offset_x_scala + scala_size_x,
					offset_y_scala - index * scala_size_y));
			path.add(new paper.Point(offset_x_scala + scala_size_x,
					offset_y_scala + (-index + delta) * scala_size_y));

			var text = new paper.PointText(new paper.Point(offset_x_scala
					+ scala_size_x * 1.2, offset_y_scala + (-index + delta / 2)
					* scala_size_y));
			text.content = ' '
					+ Math.round(10000 * (minColor + (maxColor - minColor)
							* index / 2)) / 10000.0 + ' mm';
			text.fontSize = 11;
			text.justification = 'left';
			text.fillColor = 'white';
			path.closed = true;
			path.strokeWidth = 0.5;
			path.fillColor = getColor(index);
			path.selected = false;
		}

	}
	
	// Save the bottom left position of the path's bounding box:
	var pointNull = new paper.Point(offset_x*2, offset_y*2);

	ModelRenderer.prototype.draw_elements = function(elements) {

		minColor = 20;
		maxColor = -20;
		for ( var ele = 0; ele < elements.length; ele++) {
			var path = new paper.Path();
			var element;
			for ( var nodeId = 0; nodeId < elements[ele].length; nodeId++) {
				element = elements[ele][nodeId];
				minColor = Math.min(element.deltaArea, minColor);
				maxColor = Math.max(element.deltaArea, maxColor);
				path.fillColor = getColor(element.deltaAreaColor);
				var point = new paper.Point(element.x * factorX + offset_x
						+ element.x_displacement * this.factorDisplacement,
						element.y * factorY + element.y_displacement
								* this.factorDisplacement + offset_y);
				
				path.add(point);
			
				if (10.0 < Math.abs(element.x_force) && element.x_fixed) {
					this.drawVector(point, point.add(new paper.Point(
							element.x_force * this.factorForce, 0)), true,
							(element.x_force > 0.0));
				}

				if (10.0 < Math.abs(element.y_force) && element.y_fixed) {
					this.drawVector(point, point.add(new paper.Point(0,
							element.y_force * this.factorForce)), false,
							(element.y_force > 0.0));
				}
				this.drawFixed(point, element.y_fixed, element.x_fixed);
			}
			path.closed = true;
			path.strokeWidth = 0.5;
			path.strokeColor = '#0a0a0a';
			path.selected = false;	
			if (this.rotate) {
				path.rotate(90, pointNull);	
			}
		}

		for ( var ele = 0; ele < elements.length; ele++) {
			var path = new paper.Path();
			for ( var nodeId = 0; nodeId < elements[ele].length; nodeId++) {
				var element = elements[ele][nodeId];
				var point = new paper.Point(element.x * factorX + offset_x
						+ element.x_displacement * this.factorDisplacement,
						element.y * factorY + element.y_displacement
								* this.factorDisplacement + offset_y);

				if (10.0 < Math.abs(element.x_force) && element.x_fixed) {
					this.drawVector(point, point.add(new paper.Point(
							element.x_force * this.factorForce, 0)), true,
							(element.x_force > 0.0));
				}

				if (10.0 < Math.abs(element.y_force) && element.y_fixed) {
					this.drawVector(point, point.add(new paper.Point(0,
							element.y_force * this.factorForce)), false,
							(element.y_force > 0.0));
				}
				this.drawFixed(point, element.y_fixed, element.x_fixed)
			}
			if (this.rotate) {
				path.rotate(90, pointNull);	
			}
	}

		if (minColor < maxColor && this.display_scale) {
			draw_scala();
		}
	}

	ModelRenderer.prototype.drawVector = function(vectorStart, vectorEnd,
			horizontal, positive) {
		var arrow = new paper.Path();
		arrow.strokeWidth = 0.75;
		arrow.strokeColor = '#FF0000';
		arrow.add(vectorStart);
		arrow.add(vectorEnd);
		if (this.rotate) {
			arrow.rotate(90, pointNull);	
		}

		var length = 5;
		var head = new paper.Path();
		head.strokeWidth = 0.75;
		head.strokeColor = '#FF0000';
		head.add(vectorEnd);
		if (horizontal && !positive) {
			head.add(vectorEnd.add(new paper.Point(length, -length)));
			head.add(vectorEnd);
			head.add(vectorEnd.add(new paper.Point(length, length)));
		} else if (horizontal && positive) {
			head.add(vectorEnd.add(new paper.Point(-length, -length)));
			head.add(vectorEnd);
			head.add(vectorEnd.add(new paper.Point(-length, length)));
		} else if (!horizontal && positive) {
			head.add(vectorEnd.add(new paper.Point(length, -length)));
			head.add(vectorEnd);
			head.add(vectorEnd.add(new paper.Point(-length, -length)));
		} else if (!horizontal && !positive) {
			head.add(vectorEnd.add(new paper.Point(-length, length)));
			head.add(vectorEnd);
			head.add(vectorEnd.add(new paper.Point(length, length)));
		}
		if (this.rotate) {
			head.rotate(90, pointNull);	
		}
	}

	ModelRenderer.prototype.drawFixed = function(vectorEnd, horizontal,
			vertical) {
		var length = 10;
		if (horizontal) {
			var head = new paper.Path();
			head.strokeWidth = 0.75;
			head.strokeColor = '#FFFFFF';
			head.add(vectorEnd);
			head.add(vectorEnd.add(new paper.Point(length * 0.75, -length)));
			head.add(vectorEnd.add(new paper.Point(-length * 0.75, -length)));
			head.add(vectorEnd);
			if (this.rotate) {
				head.rotate(90, pointNull);	
			}
		}

		if (vertical) {
			var head = new paper.Path();
			head.strokeWidth = 0.75;
			head.strokeColor = '#FFFFFF';
			head.add(vectorEnd);
			head.add(vectorEnd.add(new paper.Point(-length, -length * 0.75)));
			head.add(vectorEnd.add(new paper.Point(-length, length * 0.75)));
			head.add(vectorEnd);
			if (this.rotate) {
				head.rotate(90, pointNull);	
			}
		}
	}

}
