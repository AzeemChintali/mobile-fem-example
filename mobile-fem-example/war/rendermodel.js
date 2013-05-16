/**
 * Copyright (C) 2012-2013, Markus Sprunck
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: -
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. - Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. - The name of its contributor may be used to endorse
 * or promote products derived from this software without specific prior written
 * permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * 
 * 
 */

function ModelRenderer() {

	var offset_x = 200;
	var offset_y = 150;
	var delta = 0.15;

	this.pointNull = new paper.Point(offset_x * 1.5, offset_y * 1.5);

	var offset_x_scala = 20;
	var offset_y_scala = 160;

	var scala_size_x = 20;
	var scala_size_y = 160;

	this.factorForce = 0.04;
	this.factorDisplacement = 1100;

	this.beta = 0.0;
	this.gamma = 0.0;

	this.rotate = false;

	this.display_scale = true;

	this.orientation = 'normal portrait';

	this.minColor = 20;
	this.maxColor = -20;

	function getColor(mean) {
		mean = -2.0 * mean;
		red = Math.sin(mean + 2) * 127 + 128;
		green = Math.sin(mean + 1) * 127 + 128;
		blue = Math.sin(mean + 4) * 127 + 128;
		return '#' + toHex(red) + toHex(green) + toHex(blue);
	}

	function toHex(n) {
		return "0123456789ABCDEF".charAt((n - n % 16) / 16)
				+ "0123456789ABCDEF".charAt(n % 16);
	}

	ModelRenderer.prototype.draw_scala_color = function() {
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
			path.strokeWidth = 0.5;
			path.fillColor = getColor(index);
			path.selected = false;
		}
	}

	ModelRenderer.prototype.draw_scala_text = function() {
		x = offset_x_scala + scala_size_x * 1.2;
		for ( var index = -1.0; index < 1.0; index += delta) {
			var point = new paper.Point(x, offset_y_scala
					+ (-index + delta / 2) * scala_size_y);
			var text = new paper.PointText(point);
			text.content = ' '
					+ Math
							.round(1000 * (this.minColor + (this.maxColor - this.minColor)
									* index / 2)) / 1000.0 + ' mm';
			text.fontSize = 11;
			text.justification = 'left';
			text.fillColor = 'white';
		}
	}

	ModelRenderer.prototype.draw_elements = function(elements) {

		this.minColor = 100;
		this.maxColor = -100;

		for ( var ele = elements.length - 1; ele >= 0; ele--) {
			var path = new paper.Path();
			path.strokeWidth = 0.5;
			path.strokeColor = '#0a0a0a';
			path.selected = false;

			var deltaArea = elements[ele][0].deltaArea;
			this.minColor = Math.min(deltaArea, this.minColor);
			this.maxColor = Math.max(deltaArea, this.maxColor);
			path.fillColor = getColor(deltaArea);

			for ( var nodeId = 0; nodeId < 3; nodeId++) {
				element = elements[ele][nodeId];

				var point = new paper.Point(element.x + offset_x + element.x_d
						* this.factorDisplacement, element.y + element.y_d
						* this.factorDisplacement + offset_y);

				path.add(point);

				if (element.x_fixed) {
					this.drawFixedVertical(point);
					if (30.0 < Math.abs(element.x_force)) {
						this.drawVector(point, point.add(new paper.Point(
								element.x_force * this.factorForce, 0)), true,
								(element.x_force > 0.0));
					}
				}

				if (element.y_fixed) {
					this.drawFixedHorizontal(point);
					if (30.0 < Math.abs(element.y_force)) {
						this.drawVector(point, point.add(new paper.Point(0,
								element.y_force * this.factorForce)), false,
								(element.y_force > 0.0));
					}
				}
			}

			if (this.rotate) {
				path.rotate(90, this.pointNull);
			}
		}

		if (this.display_scale) {
			this.draw_scala_color();
			this.draw_scala_text();
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
			arrow.rotate(90, this.pointNull);
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
			head.rotate(90, this.pointNull);
		}
	}

	ModelRenderer.prototype.drawFixedVertical = function(vectorEnd) {
		var length = 10;
		var head = new paper.Path();
		head.strokeWidth = 0.75;
		head.strokeColor = '#FFFFFF';
		head.add(vectorEnd);
		head.add(vectorEnd.add(new paper.Point(-length, -length * 0.75)));
		head.add(vectorEnd.add(new paper.Point(-length, length * 0.75)));
		head.add(vectorEnd);
		if (this.rotate) {
			head.rotate(90, this.pointNull);
		}
	}

	ModelRenderer.prototype.drawFixedHorizontal = function(vectorEnd) {
		var length = 10;
		var head = new paper.Path();
		head.strokeWidth = 0.75;
		head.strokeColor = '#FFFFFF';
		head.add(vectorEnd);
		head.add(vectorEnd.add(new paper.Point(length * 0.75, -length)));
		head.add(vectorEnd.add(new paper.Point(-length * 0.75, -length)));
		head.add(vectorEnd);
		if (this.rotate) {
			head.rotate(90, this.pointNull);
		}
	}

}
