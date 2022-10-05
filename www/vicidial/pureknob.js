/*
 * pure-knob
 *
 * Canvas-based JavaScript UI element implementing touch,
 * keyboard, mouse and scroll wheel support.
 *
 * Copyright 2018 Andre Plötze
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

/*
 * Custom user interface elements for pure knob.
 */
function PureKnob() {
	
	/*
	 * Creates a bar graph element.
	 */
	this.createBarGraph = function(width, height) {
		var heightString = height.toString();
		var widthString = width.toString();
		var canvas = document.createElement('canvas');
		var div = document.createElement('div');
		div.style.display = 'inline-block';
		div.style.height = heightString + 'px';
		div.style.position = 'relative';
		div.style.textAlign = 'center';
		div.style.width = widthString + 'px';
		div.appendChild(canvas);
		
		/*
		 * The bar graph object.
		 */
		var graph = {
			'_canvas': canvas,
			'_div': div,
			'_height': height,
			'_width': width,
			
			/*
			 * Properties of this bar graph.
			 */
			'_properties': {
				'colorBG': '#181818',
				'colorFG': '#ff8800',
				'colorMarkers': '#888888',
				'markerStart': 0,
				'markerEnd': 100,
				'markerStep': 20,
				'trackWidth': 0.5,
				'valMin': 0,
				'valMax': 100,
				'valPeaks': [],
				'val': 0
			},
			
			/*
			 * Returns the peak values for this bar graph.
			 */
			'getPeaks': function() {
				var properties = this._properties;
				var peaks = properties.valPeaks;
				var numPeaks = peaks.length;
				var peaksCopy = [];
				
				/*
				 * Iterate over the peak values and copy them.
				 */
				for (var i = 0; i < numPeaks; i++) {
					var peak = peaks[i];
					peaksCopy.push(peak);
				}
				
				return peaksCopy;
			},
			
			/*
			 * Returns the value of a property of this bar graph.
			 */
			'getProperty': function(key) {
				var properties = this._properties;
				var value = properties[key];
				return value;
			},
			
			/*
			 * Returns the current value of the bar graph.
			 */
			'getValue': function() {
				var properties = this._properties;
				var value = properties.val;
				return value;
			},
			
			/*
			 * Return the DOM node representing this bar graph.
			 */
			'node': function() {
				var div = this._div;
				return div;
			},
			
			/*
			 * Redraw the bar graph on the canvas.
			 */
			'redraw': function() {
				this.resize();
				var properties = this._properties;
				var colorTrack = properties.colorBG;
				var colorFilling = properties.colorFG;
				var colorMarkers = properties.colorMarkers;
				var markerStart = properties.markerStart;
				var markerEnd = properties.markerEnd;
				var markerStep = properties.markerStep;
				var trackWidth = properties.trackWidth;
				var valMin = properties.valMin;
				var valMax = properties.valMax;
				var peaks = properties.valPeaks;
				var value = properties.val;
				var height = this._height;
				var width = this._width;
				var lineWidth = Math.round(trackWidth * height);
				var halfWidth = 0.5 * lineWidth;
				var centerY = 0.5 * height;
				var lineTop = centerY - halfWidth;
				var lineBottom = centerY + halfWidth;
				var relativeValue = (value - valMin) / (valMax - valMin);
				var fillingEnd = width * relativeValue;
				var numPeaks = peaks.length;
				var canvas = this._canvas;
				var ctx = canvas.getContext('2d');
				
				/*
				 * Clear the canvas.
				 */
				ctx.clearRect(0, 0, width, height);
				
				/*
				 * Check if markers should be drawn.
				 */
				if ((markerStart !== null) & (markerEnd !== null) & (markerStep !== null) & (markerStep !== 0)) {
					
					/*
					 * Draw the markers.
					 */
					for (var v = markerStart; v <= markerEnd; v += markerStep) {
						var relativePos = (v - valMin) / (valMax - valMin);
						var pos = Math.round(width * relativePos);
						ctx.beginPath();
						ctx.moveTo(pos, 0);
						ctx.lineTo(pos, height);
						ctx.lineCap = 'butt';
						ctx.lineWidth = '2';
						ctx.strokeStyle = colorMarkers;
						ctx.stroke();
					}
					
				}
				
				/*
				 * Draw the track.
				 */
				ctx.beginPath();
				ctx.rect(0, lineTop, width, lineWidth);
				ctx.fillStyle = colorTrack;
				ctx.fill();
				
				/*
				 * Draw the filling.
				 */
				ctx.beginPath();
				ctx.rect(0, lineTop, fillingEnd, lineWidth);
				ctx.fillStyle = colorFilling;
				ctx.fill();
				
				/*
				 * Draw the peaks.
				 */
				for (var i = 0; i < numPeaks; i++) {
					var peak = peaks[i];
					var relativePeak = (peak - valMin) / (valMax - valMin);
					var pos = Math.round(width * relativePeak);
					ctx.beginPath();
					ctx.moveTo(pos, lineTop);
					ctx.lineTo(pos, lineBottom);
					ctx.lineCap = 'butt';
					ctx.lineWidth = '2';
					ctx.strokeStyle = colorFilling;
					ctx.stroke();
				}
				
			},
			
			/*
			 * This is called as the canvas or the surrounding DIV is resized.
			 */
			'resize': function() {
				var canvas = this._canvas;
				canvas.style.height = '100%';
				canvas.style.width = '100%';
				canvas.height = this._height;
				canvas.width = this._width;
			},
			
			/*
			 * Sets the peak values of this bar graph.
			 */
			'setPeaks': function(peaks) {
				var properties = this._properties;
				var peaksCopy = [];
				var numPeaks = peaks.length;
				
				/*
				 * Iterate over the peak values and append them to the array.
				 */
				for (var i = 0; i < numPeaks; i++) {
					var peak = peaks[i];
					peaksCopy.push(peak);
				}
				
				this.setProperty('valPeaks', peaksCopy);
			},
			
			/*
			 * Sets the value of a property of this bar graph.
			 */
			'setProperty': function(key, value) {
				this._properties[key] = value;
				this.redraw();
			},
			
			/*
			 * Sets the value of this bar graph.
			 */
			'setValue': function(value) {
				var properties = this._properties;
				var valMin = properties.valMin;
				var valMax = properties.valMax;
				
				/*
				 * Clamp the actual value into the [valMin; valMax] range.
				 */
				if (value < valMin)
					value = valMin;
				else if (value > valMax)
					value = valMax;
				
				// value = Math.round(value);
				// alert("Hi: "+value);
				this.setProperty('val', value);
			}
			
		};
		
		/*
		 * This is called when the size of the canvas changes.
		 */
		var resizeListener = function(e) {
			graph.redraw();
		};
		
		canvas.addEventListener('resize', resizeListener);
		return graph;
	}
	
	/*
	 * Creates a knob element.
	 */
	this.createKnob = function(width, height, value_type) {
		var heightString = height.toString();
		var widthString = width.toString();
		// var widthString = width.toString();
		var smaller = width < height ? width : height;
		var fontSize = 0.2 * smaller;
		var fontSizeString = fontSize.toString();
		var canvas = document.createElement('canvas');
		var div = document.createElement('div');
		div.style.display = 'inline-block';
		div.style.height = heightString + 'px';
		div.style.position = 'relative';
		div.style.textAlign = 'center';
		div.style.width = widthString + 'px';
		div.appendChild(canvas);
		var input = document.createElement('input');
		input.style.appearance = 'textfield';
		input.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		input.style.border = 'none';
		input.style.color = '#ff8800';
		input.style.fontFamily = 'sans-serif';
		input.style.fontSize = fontSizeString + 'px';
		input.style.height = heightString + 'px';
		input.style.margin = 'auto';
		input.style.padding = '0px';
		input.style.textAlign = 'center';
		input.style.width = widthString + 'px';
		var inputMode = document.createAttribute('inputmode');
		inputMode.value = 'numeric';
		input.setAttributeNode(inputMode);
		var inputDiv = document.createElement('div');
		inputDiv.style.bottom = '0px';
		inputDiv.style.display = 'none';
		inputDiv.style.left = '0px';
		inputDiv.style.position = 'absolute';
		inputDiv.style.right = '0px';
		inputDiv.style.top = '0px';
		inputDiv.appendChild(input);
		div.appendChild(inputDiv);
		
		/*
		 * The knob object.
		 */
		var knob = {
			'_canvas': canvas,
			'_div': div,
			'_height': height,
			'_input': input,
			'_inputDiv': inputDiv,
			'_listeners': [],
			'_mousebutton': false,
			'_previousVal': 0,
			'_timeout': null,
			'_timeoutDoubleTap': null,
			'_touchCount': 0,
			'_width': width,
			
			/*
			 * Notify listeners about value changes.
			 */
			'_notifyUpdate': function() {
				var properties = this._properties;
				var value = properties.val;
				var listeners = this._listeners;
				var numListeners = listeners.length;
				
				/*
				 * Call all listeners.
				 */
				for (var i = 0; i < numListeners; i++) {
					var listener = listeners[i];
					
					/*
					 * Call listener, if it exists.
					 */
					if (listener !== null)
						listener(this, value);
					
				}
				
			},
			
			/*
			 * Properties of this knob.
			 */
			'_properties': {
				'angleEnd': 2.0 * Math.PI,
				'angleOffset': -0.5 * Math.PI,
				'angleStart': 0,
				'colorBG': '#181818',
				'colorFG': '#ff8800',
				'needle': false,
				'readonly': true,
				'trackWidth': 0.4,
				'valMin': 0,
				'valMax': 100,
				'val': 0
			},
			
			/*
			 * Abort value change, restoring the previous value.
			 */
			'abort': function() {
				var previousValue = this._previousVal;
				var properties = this._properties;
				properties.val = previousValue;
				this.redraw();
			},
			
			/*
			 * Adds an event listener.
			 */
			'addListener': function(listener) {
				var listeners = this._listeners;
				listeners.push(listener);
			},
			
			/*
			 * Commit value, indicating that it is no longer temporary.
			 */
			'commit': function() {
				var properties = this._properties;
				var value = properties.val;
				this._previousVal = value;
				this.redraw();
				this._notifyUpdate();
			},
			
			/*
			 * Returns the value of a property of this knob.
			 */
			'getProperty': function(key) {
				var properties = this._properties;
				var value = properties[key];
				return value;
			},
			
			/*
			 * Returns the current value of the knob.
			 */
			'getValue': function() {
				var properties = this._properties;
				var value = properties.val;
				return value;
			},
			
			/*
			 * Return the DOM node representing this knob.
			 */
			'node': function() {
				var div = this._div;
				return div;
			},
			
			/*
			 * Redraw the knob on the canvas.
			 */
			'redraw': function() {
				this.resize();
				var properties = this._properties;
				var needle = properties.needle;
				var angleStart = properties.angleStart;
				var angleOffset = properties.angleOffset;
				var angleEnd = properties.angleEnd;
				var actualStart = angleStart + angleOffset;
				var actualEnd = angleEnd + angleOffset;
				var value = properties.val;
				if (value_type=="percent" || value_type=="float") {
					var value2=Math.floor(value*10)/10;
					var valueStr = value2.toString();
					if (value_type=="percent") {
						valueStr+="%";
					}
					value = Math.round(value);
				} else {
					value = Math.round(value);
					var valueStr = value.toString();
				}
				var valMin = properties.valMin;
				var valMax = properties.valMax;
				var relValue = (value - valMin) / (valMax - valMin);
				var relAngle = relValue * (angleEnd - angleStart);
				var angleVal = actualStart + relAngle;
				var colorTrack = properties.colorBG;
				var colorFilling = properties.colorFG;
				var trackWidth = properties.trackWidth;
				var height = this._height;
				var width = this._width;
				var smaller = width < height ? width : height;
				var centerX = 0.5 * width;
				var centerY = 0.5 * height;
				var radius = 0.4 * smaller;
				var lineWidth = Math.round(trackWidth * radius);
				var fontSize = 0.2 * smaller;
				var fontSizeString = fontSize.toString();
				var canvas = this._canvas;
				var ctx = canvas.getContext('2d');
				
				/*
				 * Clear the canvas.
				 */
				ctx.clearRect(0, 0, width, height);
				
				/*
				 * Draw the track.
				 */
				ctx.beginPath();
				ctx.arc(centerX, centerY, radius, actualStart, actualEnd);
				ctx.lineCap = 'butt';
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = colorTrack;
				ctx.stroke();
				
				/*
				 * Draw the filling.
				 */
				ctx.beginPath();
				
				/*
				 * Check if we're in needle mode.
				 */
				if (needle)
					ctx.arc(centerX, centerY, radius, angleVal - 0.1, angleVal + 0.1);
				else
					ctx.arc(centerX, centerY, radius, actualStart, angleVal);
				
				ctx.lineCap = 'butt';
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = colorFilling;
				ctx.stroke();
				
				/*
				 * Draw the number.
				 */
				ctx.font = fontSizeString + 'px sans-serif';
				ctx.fillStyle = colorFilling;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(valueStr, centerX, centerY);
				
				/*
				 * Set the color of the input element.
				 */
				var elemInput = this._input;
				elemInput.style.color = colorFilling;
			},
			
			/*
			 * This is called as the canvas or the surrounding DIV is resized.
			 */
			'resize': function() {
				var canvas = this._canvas;
				canvas.style.height = '100%';
				canvas.style.width = '100%';
				canvas.height = this._height;
				canvas.width = this._width;
			},
			
			/*
			 * Sets the value of a property of this knob.
			 */
			'setProperty': function(key, value) {
				this._properties[key] = value;
				this.redraw();
			},
			
			/*
			 * Sets the value of this knob.
			 */
			'setValue': function(value) {
				this.setValueFloating(value);
				this.commit();
			},

			/*
			 * Sets floating (temporary) value of this knob.
			 */
			'setValueFloating': function(value) {
				var properties = this._properties;
				var valMin = properties.valMin;
				var valMax = properties.valMax;
				
				/*
				 * Clamp the actual value into the [valMin; valMax] range.
				 */
				if (value < valMin)
					value = valMin;
				else if (value > valMax)
					value = valMax;
				
				// value = Math.round(value);
				// alert("Byes: "+value);

				this.setProperty('val', value);
			}
			
		};
		
		/*
		 * Convert mouse event to value.
		 */
		var mouseEventToValue = function(e, properties) {
			var canvas = e.target;
			var width = canvas.scrollWidth;
			var height = canvas.scrollHeight;
			var centerX = 0.5 * width;
			var centerY = 0.5 * height;
			var x = e.offsetX;
			var y = e.offsetY;
			var relX = x - centerX;
			var relY = y - centerY;
			var angleStart = properties.angleStart;
			var angleEnd = properties.angleEnd;
			var angleDiff = angleEnd - angleStart;
			var angle = Math.atan2(relX, -relY) - angleStart;
			var twoPi = 2.0 * Math.PI;
			
			/*
			 * Make negative angles positive.
			 */
			if (angle < 0) {
				
				if (angleDiff >= twoPi)
					angle += twoPi;
				else
					angle = 0;
				
			}

			var valMin = properties.valMin;
			var valMax = properties.valMax;
			var value = ((angle / angleDiff) * (valMax - valMin)) + valMin;
			
			/*
			 * Clamp values into valid interval.
			 */
			if (value < valMin)
				value = valMin;
			else if (value > valMax)
				value = valMax;
			
			return value;
		};
		
		/*
		 * Convert touch event to value.
		 */
		var touchEventToValue = function(e, properties) {
			var canvas = e.target;
			var rect = canvas.getBoundingClientRect();
			var offsetX = rect.left;
			var offsetY = rect.top;
			var width = canvas.scrollWidth;
			var height = canvas.scrollHeight;
			var centerX = 0.5 * width;
			var centerY = 0.5 * height;
			var touches = e.targetTouches;
			var touch = null;
			
			/*
			 * If there are touches, extract the first one.
			 */
			if (touches.length > 0)
				touch = touches.item(0);
			
			var x = 0.0;
			var y = 0.0;
			
			/*
			 * If a touch was extracted, calculate coordinates relative to
			 * the element position.
			 */
			if (touch !== null) {
				var touchX = touch.pageX;
				x = touchX - offsetX;
				var touchY = touch.pageY;
				y = touchY - offsetY;
			}
			
			var relX = x - centerX;
			var relY = y - centerY;
			var angleStart = properties.angleStart;
			var angleEnd = properties.angleEnd;
			var angleDiff = angleEnd - angleStart;
			var angle = Math.atan2(relX, -relY) - angleStart;
			var twoPi = 2.0 * Math.PI;
			
			/*
			 * Make negative angles positive.
			 */
			if (angle < 0) {
				
				if (angleDiff >= twoPi)
					angle += twoPi;
				else
					angle = 0;
				
			}

			var valMin = properties.valMin;
			var valMax = properties.valMax;
			var value = ((angle / angleDiff) * (valMax - valMin)) + valMin;
			
			/*
			 * Clamp values into valid interval.
			 */
			if (value < valMin)
				value = valMin;
			else if (value > valMax)
				value = valMax;
			
			return value;
		};
		
		/*
		 * Show input element on double click.
		 */
		var doubleClickListener = function(e) {
			var properties = knob._properties;
			var readonly = properties.readonly;
		
			/*
			 * If knob is not read-only, display input element.
			 */
			if (!readonly) {
				e.preventDefault();
				var inputDiv = knob._inputDiv;
				inputDiv.style.display = 'block';
				var inputElem = knob._input;
				inputElem.focus();
				knob.redraw();
			}
			
		};
			
		/*
		 * This is called when the mouse button is depressed.
		 */
		var mouseDownListener = function(e) {
			var btn = e.buttons;
			
			/*
			 * It is a left-click.
			 */
			if (btn === 1) {
				var properties = knob._properties;
				var readonly = properties.readonly;
			
				/*
				 * If knob is not read-only, process mouse event.
				 */
				if (!readonly) {
					e.preventDefault();
					var val = mouseEventToValue(e, properties);
					knob.setValueFloating(val);
				}
			
				knob._mousebutton = true;
			}
			
			/*
			 * It is a middle click.
			 */
			if (btn === 4) {
				var properties = knob._properties;
				var readonly = properties.readonly;
			
				/*
				 * If knob is not read-only, display input element.
				 */
				if (!readonly) {
					e.preventDefault();
					var inputDiv = knob._inputDiv;
					inputDiv.style.display = 'block';
					var inputElem = knob._input;
					inputElem.focus();
					knob.redraw();
				}
				
			}
			
		};
		
		/*
		 * This is called when the mouse cursor is moved.
		 */
		var mouseMoveListener = function(e) {
			var btn = knob._mousebutton;
			
			/*
			 * Only process event, if mouse button is depressed.
			 */
			if (btn) {
				var properties = knob._properties;
				var readonly = properties.readonly;
			
				/*
				 * If knob is not read-only, process mouse event.
				 */
				if (!readonly) {
					e.preventDefault();
					var val = mouseEventToValue(e, properties);
					knob.setValueFloating(val);
				}
				
			}
			
		};
		
		/*
		 * This is called when the mouse button is released.
		 */
		var mouseUpListener = function(e) {
			var btn = knob._mousebutton;
			
			/*
			 * Only process event, if mouse button was depressed.
			 */
			if (btn) {
				var properties = knob._properties;
				var readonly = properties.readonly;
			
				/*
				 * If knob is not read only, process mouse event.
				 */
				if (!readonly) {
					e.preventDefault();
					var val = mouseEventToValue(e, properties);
					knob.setValue(val);
				}
				
			}
			
			knob._mousebutton = false;
		};
		
		/*
		 * This is called when the drag action is canceled.
		 */
		var mouseCancelListener = function(e) {
			var btn = knob._mousebutton;
			
			/*
			 * Abort action if mouse button was depressed.
			 */
			if (btn) {
				knob.abort();
				knob._mousebutton = false;
			}
			
		};
		
		/*
		 * This is called when a user touches the element.
		 */
		var touchStartListener = function(e) {
			var properties = knob._properties;
			var readonly = properties.readonly;
		
			/*
			 * If knob is not read-only, process touch event.
			 */
			if (!readonly) {
				var touches = e.touches;
				var numTouches = touches.length;
				var singleTouch = (numTouches == 1);
				
				/*
				 * Only process single touches, not multi-touch
				 * gestures.
				 */
				if (singleTouch) {
					knob._mousebutton = true;
					
					/*
					 * If this is the first touch, bind double tap
					 * interval.
					 */
					if (knob._touchCount == 0) {
						
						/*
						 * This is executed when the double tap
						 * interval times out.
						 */
						var f = function() {
							
							/*
							 * If control was tapped exactly
							 * twice, enable on-screen keyboard.
							 */
							if (knob._touchCount == 2) {
								var properties = knob._properties;
								var readonly = properties.readonly;
							
								/*
								 * If knob is not read-only,
								 * display input element.
								 */
								if (!readonly) {
									e.preventDefault();
									var inputDiv = knob._inputDiv;
									inputDiv.style.display = 'block';
									var inputElem = knob._input;
									inputElem.focus();
									knob.redraw();
								}
								
							}
							
							knob._touchCount = 0;
						};
						
						var timeout = knob._timeoutDoubleTap;
						window.clearTimeout(timeout);
						timeout = window.setTimeout(f, 500);
						knob._timeoutDoubleTap = timeout;
					}
					
					knob._touchCount++;
					var val = touchEventToValue(e, properties);
					knob.setValueFloating(val);
				}
				
			}
			
		};
		
		/*
		 * This is called when a user moves a finger on the element.
		 */
		var touchMoveListener = function(e) {
			var btn = knob._mousebutton;
			
			/*
			 * Only process event, if mouse button is depressed.
			 */
			if (btn) {
				var properties = knob._properties;
				var readonly = properties.readonly;
			
				/*
				 * If knob is not read-only, process touch event.
				 */
				if (!readonly) {
					var touches = e.touches;
					var numTouches = touches.length;
					var singleTouch = (numTouches == 1);
					
					/*
					 * Only process single touches, not multi-touch
					 * gestures.
					 */
					if (singleTouch) {
						e.preventDefault();
						var val = touchEventToValue(e, properties);
						knob.setValueFloating(val);
					}
					
				}
				
			}
			
		};
		
		/*
		 * This is called when a user lifts a finger off the element.
		 */
		var touchEndListener = function(e) {
			var btn = knob._mousebutton;
			
			/*
			 * Only process event, if mouse button was depressed.
			 */
			if (btn) {
				var properties = knob._properties;
				var readonly = properties.readonly;
			
				/*
				 * If knob is not read only, process touch event.
				 */
				if (!readonly) {					
					var touches = e.touches;
					var numTouches = touches.length;
					var singleTouch = (numTouches == 1);
					
					/*
					 * Only process single touches, not multi-touch
					 * gestures.
					 */
					if (singleTouch) {
						e.preventDefault();
						knob._mousebutton = false;
						knob.commit();
					}
					
				}
				
			}
			
			knob._mousebutton = false;
		};
		
		/*
		 * This is called when a user cancels a touch action.
		 */
		var touchCancelListener = function(e) {
			var btn = knob._mousebutton;
			
			/*
			 * Abort action if mouse button was depressed.
			 */
			if (btn) {
				knob.abort();
				knob._touchCount = 0;
				var timeout = knob._timeoutDoubleTap;
				window.clearTimeout(timeout);
			}
			
			knob._mousebutton = false;
		};
		
		/*
		 * This is called when the size of the canvas changes.
		 */
		var resizeListener = function(e) {
			knob.redraw();
		};
		
		/*
		 * This is called when the mouse wheel is moved.
		 */
		var scrollListener = function(e) {
			var readonly = knob.getProperty('readonly');
			
			/*
			 * If knob is not read only, process mouse wheel event.
			 */
			if (!readonly) {
				e.preventDefault();
				var delta = e.deltaY;
				var direction = delta > 0 ? 1 : (delta < 0 ? -1 : 0);
				var val = knob.getValue();
				val += direction;
				knob.setValueFloating(val);
				
				/*
				 * Perform delayed commit.
				 */
				var commit = function() {
					knob.commit();
				};
				
				var timeout = knob._timeout;
				window.clearTimeout(timeout);
				timeout = window.setTimeout(commit, 250);
				knob._timeout = timeout;
			}
			
		};
		
		/*
		 * This is called when the user presses a key on the keyboard.
		 */
		var keyPressListener = function(e) {
			var kc = e.keyCode;
			
			/*
			 * Hide input element when user presses enter or escape.
			 */
			if ((kc === 13) || (kc === 27)) {
				var inputDiv = knob._inputDiv;
				inputDiv.style.display = 'none';
				var input = e.target;
				
				/*
				 * Only evaluate value when user pressed enter.
				 */
				if (kc === 13) {
					var value = input.value;
					var val = parseInt(value);
					var valid = isFinite(val);
					
					/*
					 * Check if input is a valid number.
					 */
					if (valid)
						knob.setValue(val);
					
				}
				
				input.value = '';
			}
			
		};
		
		canvas.addEventListener('dblclick', doubleClickListener);
		canvas.addEventListener('mousedown', mouseDownListener);
		canvas.addEventListener('mouseleave', mouseCancelListener);
		canvas.addEventListener('mousemove', mouseMoveListener);
		canvas.addEventListener('mouseup', mouseUpListener);
		canvas.addEventListener('resize', resizeListener);
		canvas.addEventListener('touchstart', touchStartListener);
		canvas.addEventListener('touchmove', touchMoveListener);
		canvas.addEventListener('touchend', touchEndListener);
		canvas.addEventListener('touchcancel', touchCancelListener);
		canvas.addEventListener('wheel', scrollListener);
		input.addEventListener('keypress', keyPressListener);
		return knob;
	};
	
}

var pureknob = new PureKnob();

