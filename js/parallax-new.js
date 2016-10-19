var ParallaxManager, ParallaxPart;

ParallaxPart = (function() {
    function ParallaxPart(el) {
        this.el = el;
        this.speed = parseFloat(this.el.getAttribute('data-parallax-speed'));
        // console.log(this.speed);
        this.maxScroll = parseInt(this.el.getAttribute('data-max-scroll'));
        //  console.log(this.maxScroll);
    }

    ParallaxPart.prototype.update = function(scrollY, i) {
        if (scrollY > this.maxScroll) {
            return;
        }
        var offset = -(scrollY * this.speed);
        window.offset = offset;
        // console.log('here');
        if (i == 0) {
            window.offset0 = offset;
        } else if (i == 1) {
            window.offset1 = offset;
        } else if (i == 2) {
            window.offset2 = offset;
        } else if (i == 3) {
            window.offset3 = offset;
        } else if (i == 4) {
            window.offset4 = offset;
        } else if (i == 5) {
            window.offset5 = offset;
        } else if (i == 6) {
            window.offset6 = offset;
        }
        this.setYTransform(offset);
    };

    ParallaxPart.prototype.setYTransform = function(val) {
        //console.log("HIIII");
        //console.log(val);
        //console.log(sObj1);
        // console.log(window.ele1);
        // console.log("offset: " + offset);
        window.sObj1.css(window.ele1, 'transform', 'translate3d(' + window.Xx1 + ',' + window.offset1 + 'px ,0)');
        window.sObj2.css(window.ele2, 'transform', 'translate3d(' + window.Xx2 + ',' + window.offset2 + 'px ,0)');
        window.sObj3.css(window.ele3, 'transform', 'translate3d(' + window.Xx3 + ',' + window.offset3 + 'px ,0)');
        window.sObj4.css(window.ele4, 'transform', 'translate3d(' + window.Xx4 + ',' + window.offset4 + 'px ,0)');
        window.sObj5.css(window.ele5, 'transform', 'translate3d(' + window.Xx5 + ' ,' + window.offset5 + 'px ,0)');
        window.sObj6.css(window.ele6, 'transform', 'translate3d(' + window.Xx6 + ' ,' + window.offset6 + 'px ,0)');
        // this.el.style.webkitTransform = "translate3d(0, " + val + "px, 0)";
        // this.el.style.MozTransform = "translate3d(0, " + val + "px, 0)";
        // this.el.style.OTransform = "translate3d(0, " + val + "px, 0)";
        // this.el.style.transform = "translate3d(0, " + val + "px, 0)";
        // this.el.style.msTransform = "translateY(" + val + "px)";
        // requestAnimationFrame(Sobj.onAnimationFrame());
    };

    return ParallaxPart;

})();

ParallaxManager = (function() {
    ParallaxManager.prototype.parts = [];

    function ParallaxManager(elements) {
        if (Array.isArray(elements) && elements.length) {
            this.elements = elements;
            //console.log(elements);
        }
        // console.log(elements);
        //console.log(typeof elements);
        // console.log(document.querySelectorAll(elements));

        if (typeof elements === 'object' && elements.item) {
            this.elements = Array.prototype.slice.call(elements);
        } else if (typeof elements === 'string') {
            this.elements = document.querySelectorAll(elements);
            if (this.elements.length === 0) {
                throw new Error("Parallax: No elements found");
            }
            this.elements = Array.prototype.slice.call(this.elements);
        } else {
            throw new Error("Parallax: Element variable is not a querySelector string, Array, or NodeList");
        }
        for (var i in this.elements) {
            // console.log(this.elements);
            // console.log(i);
            this.parts.push(new ParallaxPart(this.elements[i]));
        }
        window.addEventListener("scroll", this.onScroll.bind(this));
    }

    ParallaxManager.prototype.onScroll = function() {
        window.requestAnimationFrame(this.scrollHandler.bind(this));
    };

    ParallaxManager.prototype.scrollHandler = function() {
        var scrollY = Math.max(window.pageYOffset, 0);
        for (var i in this.parts) {
            //console.log(this.parts);
            //console.log(i);
            this.parts[i].update(scrollY, i);
            //window.offset
        }
    };

    return ParallaxManager;

})();


(function(window, document, undefined) {

    // Strict Mode
    'use strict';

    // Constants
    var NAME = 'Parallax';
    var MAGIC_NUMBER = 30;
    var DEFAULTS = {
        relativeInput: false,
        clipRelativeInput: true,
        calibrationThreshold: 100,
        calibrationDelay: 500,
        supportDelay: 500,
        calibrateX: false,
        calibrateY: false,
        invertX: true,
        invertY: true,
        limitX: false,
        limitY: false,
        scalarX: 10.0,
        scalarY: 10.0,
        frictionX: 0.1,
        frictionY: 0.1,
        originX: 0.5,
        originY: 0.5
    };

    function Parallax(element, options) {

        // DOM Context
        this.element = element;
        this.layers = element.getElementsByClassName('layer');

        // Data Extraction
        var data = {
            calibrateX: this.data(this.element, 'calibrate-x'),
            calibrateY: this.data(this.element, 'calibrate-y'),
            invertX: this.data(this.element, 'invert-x'),
            invertY: this.data(this.element, 'invert-y'),
            limitX: this.data(this.element, 'limit-x'),
            limitY: this.data(this.element, 'limit-y'),
            scalarX: this.data(this.element, 'scalar-x'),
            scalarY: this.data(this.element, 'scalar-y'),
            frictionX: this.data(this.element, 'friction-x'),
            frictionY: this.data(this.element, 'friction-y'),
            originX: this.data(this.element, 'origin-x'),
            originY: this.data(this.element, 'origin-y')
        };

        // Delete Null Data Values
        for (var key in data) {
            if (data[key] === null) delete data[key];
        }

        // Compose Settings Object
        this.extend(this, DEFAULTS, options, data);

        // States
        this.calibrationTimer = null;
        this.calibrationFlag = true;
        this.enabled = false;
        this.depths = [];
        this.raf = null;

        // Element Bounds
        this.bounds = null;
        this.ex = 0;
        this.ey = 0;
        this.ew = 0;
        this.eh = 0;

        // Element Center
        this.ecx = 0;
        this.ecy = 0;

        // Element Range
        this.erx = 0;
        this.ery = 0;

        // Calibration
        this.cx = 0;
        this.cy = 0;

        // Input
        this.ix = 0;
        this.iy = 0;

        // Motion
        this.mx = 0;
        this.my = 0;

        // Velocity
        this.vx = 0;
        this.vy = 0;

        // Callbacks
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
        this.onOrientationTimer = this.onOrientationTimer.bind(this);
        this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        // Initialise
        this.initialise();
    }

    Parallax.prototype.extend = function() {
        if (arguments.length > 1) {
            var master = arguments[0];
            for (var i = 1, l = arguments.length; i < l; i++) {
                var object = arguments[i];
                for (var key in object) {
                    master[key] = object[key];
                }
            }
        }
    };

    Parallax.prototype.data = function(element, name) {
        return this.deserialize(element.getAttribute('data-' + name));
    };

    Parallax.prototype.deserialize = function(value) {
        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        } else if (value === 'null') {
            return null;
        } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return parseFloat(value);
        } else {
            return value;
        }
    };

    Parallax.prototype.camelCase = function(value) {
        return value.replace(/-+(.)?/g, function(match, character) {
            return character ? character.toUpperCase() : '';
        });
    };

    Parallax.prototype.transformSupport = function(value) {
        var element = document.createElement('div');
        var propertySupport = false;
        var propertyValue = null;
        var featureSupport = false;
        var cssProperty = null;
        var jsProperty = null;
        for (var i = 0, l = this.vendors.length; i < l; i++) {
            if (this.vendors[i] !== null) {
                cssProperty = this.vendors[i][0] + 'transform';
                jsProperty = this.vendors[i][1] + 'Transform';
            } else {
                cssProperty = 'transform';
                jsProperty = 'transform';
            }
            if (element.style[jsProperty] !== undefined) {
                propertySupport = true;
                break;
            }
        }
        switch (value) {
            case '2D':
                featureSupport = propertySupport;
                break;
            case '3D':
                if (propertySupport) {
                    var body = document.body || document.createElement('body');
                    var documentElement = document.documentElement;
                    var documentOverflow = documentElement.style.overflow;
                    if (!document.body) {
                        documentElement.style.overflow = 'hidden';
                        documentElement.appendChild(body);
                        body.style.overflow = 'hidden';
                        body.style.background = '';
                    }
                    body.appendChild(element);
                    element.style[jsProperty] = 'translate3d(1px,1px,1px)';
                    propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
                    featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== 'none';
                    documentElement.style.overflow = documentOverflow;
                    body.removeChild(element);
                }
                break;
        }
        return featureSupport;
    };

    Parallax.prototype.ww = null;
    Parallax.prototype.wh = null;
    Parallax.prototype.wcx = null;
    Parallax.prototype.wcy = null;
    Parallax.prototype.wrx = null;
    Parallax.prototype.wry = null;
    Parallax.prototype.portrait = null;
    Parallax.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
    Parallax.prototype.vendors = [null, ['-webkit-', 'webkit'],
        ['-moz-', 'Moz'],
        ['-o-', 'O'],
        ['-ms-', 'ms']
    ];
    Parallax.prototype.motionSupport = !!window.DeviceMotionEvent;
    Parallax.prototype.orientationSupport = !!window.DeviceOrientationEvent;
    Parallax.prototype.orientationStatus = 0;
    Parallax.prototype.propertyCache = {};

    Parallax.prototype.initialise = function() {

        if (Parallax.prototype.transform2DSupport === undefined) {
            Parallax.prototype.transform2DSupport = Parallax.prototype.transformSupport('2D');
            Parallax.prototype.transform3DSupport = Parallax.prototype.transformSupport('3D');
        }

        // Configure Context Styles
        //if (this.transform3DSupport) this.accelerate(this.element);
        //var style = window.getComputedStyle(this.element);
        // if (style.getPropertyValue('position') === 'static') {
        //    this.element.style.position = 'relative';
        // }

        // Setup
        this.updateLayers();
        this.updateDimensions();
        this.enable();
        this.queueCalibration(this.calibrationDelay);
    };

    Parallax.prototype.updateLayers = function() {

        // Cache Layer Elements
        this.layers = this.element.getElementsByClassName('layer');
        this.depths = [];

        // Configure Layer Styles
        for (var i = 0, l = this.layers.length; i < l; i++) {
            var layer = this.layers[i];
            // if (this.transform3DSupport) this.accelerate(layer);
            layer.style.position = i ? 'absolute' : 'relative';
            layer.style.display = 'block';
            // layer.style.left = 0;
            //layer.style.top = 0;

            // Cache Layer Depth
            this.depths.push(this.data(layer, 'depth') || 0);
        }
    };

    Parallax.prototype.updateDimensions = function() {
        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
        //  console.log("inner width: " + this.wh);
        this.wcx = this.ww * this.originX;
        this.wcy = this.wh * this.originY;
        this.wrx = Math.max(this.wcx, this.ww - this.wcx);
        this.wry = Math.max(this.wcy, this.wh - this.wcy);
    };

    Parallax.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect();
        // console.log("bounds: " + this.bounds);
        this.ex = this.bounds.left;
        this.ey = this.bounds.top;
        this.ew = this.bounds.width;
        this.eh = this.bounds.height;
        //console.log(this.eh);
        this.ecx = this.ew * this.originX;
        this.ecy = this.eh * this.originY;
        this.erx = Math.max(this.ecx, this.ew - this.ecx);
        this.ery = Math.max(this.ecy, this.eh - this.ecy);
    };

    Parallax.prototype.queueCalibration = function(delay) {
        clearTimeout(this.calibrationTimer);
        this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
    };

    Parallax.prototype.enable = function() {
        //console.log("was enabled");
        if (!this.enabled) {
            this.enabled = true;
            if (this.orientationSupport) {
                this.portrait = null;
                window.addEventListener('deviceorientation', this.onDeviceOrientation);
                setTimeout(this.onOrientationTimer, this.supportDelay);
            } else {
                this.cx = 0;
                this.cy = 0;
                this.portrait = false;
                window.addEventListener('mousemove', this.onMouseMove);
            }
            window.addEventListener('resize', this.onWindowResize);
            this.raf = requestAnimationFrame(this.onAnimationFrame);
        }
    };

    Parallax.prototype.disable = function() {
        // console.log("was disabled");
        if (this.enabled) {
            this.enabled = false;
            if (this.orientationSupport) {
                window.removeEventListener('deviceorientation', this.onDeviceOrientation);
            } else {
                window.removeEventListener('mousemove', this.onMouseMove);
            }
            window.removeEventListener('resize', this.onWindowResize);
            // cancelAnimationFrame(this.raf);
        }
    };

    Parallax.prototype.calibrate = function(x, y) {
        this.calibrateX = x === undefined ? this.calibrateX : x;
        this.calibrateY = y === undefined ? this.calibrateY : y;
    };

    Parallax.prototype.invert = function(x, y) {
        this.invertX = x === undefined ? this.invertX : x;
        this.invertY = y === undefined ? this.invertY : y;
    };

    Parallax.prototype.friction = function(x, y) {
        this.frictionX = x === undefined ? this.frictionX : x;
        this.frictionY = y === undefined ? this.frictionY : y;
    };

    Parallax.prototype.scalar = function(x, y) {
        this.scalarX = x === undefined ? this.scalarX : x;
        this.scalarY = y === undefined ? this.scalarY : y;
    };

    Parallax.prototype.limit = function(x, y) {
        this.limitX = x === undefined ? this.limitX : x;
        this.limitY = y === undefined ? this.limitY : y;
    };

    Parallax.prototype.origin = function(x, y) {
        this.originX = x === undefined ? this.originX : x;
        this.originY = y === undefined ? this.originY : y;
    };

    Parallax.prototype.clamp = function(value, min, max) {
        value = Math.max(value, min);
        value = Math.min(value, max);
        return value;
    };

    Parallax.prototype.css = function(element, property, value) {
        var jsProperty = this.propertyCache[property];
        if (!jsProperty) {
            for (var i = 0, l = this.vendors.length; i < l; i++) {
                if (this.vendors[i] !== null) {
                    jsProperty = this.camelCase(this.vendors[i][1] + '-' + property);
                } else {
                    jsProperty = property;
                }
                if (element.style[jsProperty] !== undefined) {
                    this.propertyCache[property] = jsProperty;
                    break;
                }
            }
        }
        element.style[jsProperty] = value;
    };

    Parallax.prototype.accelerate = function(element) {
        //  console.log("tried to accelerate");
        //this.css(element, 'transform', 'translate3d(10px,0,0)');
        //this.css(element, 'transform-style', 'preserve-3d');
        //this.css(element, 'backface-visibility', 'hidden');
    };

    Parallax.prototype.setPosition = function(element, x, y) {
        // console.log("set Pos");
        x += 'px';
        y += 'px';
        // console.log(element.classList[1]);
        // console.log(typeof element.classList[1])
        // console.log(element.classList[1] === 'layer-1');
        // console.log(window.offset0);
        // console.log(window.offset1);
        // console.log(this.transform3DSupport);
        if (element.classList[1] == 'layer-1') {
            if (this.transform3DSupport) {
                window.sObj1 = this;
                window.ele1 = element;
                window.Xx1 = x;
                this.css(element, 'transform', 'translate3d(' + x + ',' + window.offset1 + 'px ,0)');
            } else if (this.transform2DSupport) {
                this.css(element, 'transform', 'translate(' + x + ',' + window.offset1 + ')');
            } else {
                element.style.left = x;
                element.style.top = window.offset1;
            }
        } else if (element.classList[1] == 'layer-2') {
            window.sObj2 = this;
            window.ele2 = element;
            window.Xx2 = x;
            if (this.transform3DSupport) {
                // console.log(window.offset2);
                this.css(element, 'transform', 'translate3d(' + x + ',' + window.offset2 + 'px ,0)');
            } else if (this.transform2DSupport) {
                this.css(element, 'transform', 'translate(' + x + ',' + window.offset2 + ')');
            } else {
                element.style.left = x;
                element.style.top = window.offset2;
            }
        } else if (element.classList[1] == 'layer-3') {
            window.sObj3 = this;
            window.ele3 = element;
            window.Xx3 = x;
            if (this.transform3DSupport) {
                this.css(element, 'transform', 'translate3d(' + x + ', ' + window.offset3 + 'px ,0)');
            } else if (this.transform2DSupport) {
                this.css(element, 'transform', 'translate(' + x + ',' + window.offset3 + ')');
            } else {
                element.style.left = x;
                element.style.top = window.offset3;
            }
        } else if (element.classList[1] == 'layer-4') {
            window.sObj4 = this;
            window.ele4 = element;
            window.Xx4 = x;
            if (this.transform3DSupport) {
                this.css(element, 'transform', 'translate3d(' + x + ',' + window.offset4 + 'px ,0)');
            } else if (this.transform2DSupport) {
                this.css(element, 'transform', 'translate(' + x + ',' + window.offset4 + ')');
            } else {
                element.style.left = x;
                element.style.top = window.offset4;
            }
        } else if (element.classList[1] == 'layer-5') {
            window.sObj5 = this;
            window.ele5 = element;
            window.Xx5 = x;
            if (this.transform3DSupport) {
                this.css(element, 'transform', 'translate3d(' + x + ',' + window.offset5 + 'px ,0)');
            } else if (this.transform2DSupport) {
                this.css(element, 'transform', 'translate(' + x + ',' + window.offset5 + ')');
            } else {
                element.style.left = x;
                element.style.top = window.offset5;
            }
        } else if (element.classList[1] == 'layer-6') {
            window.sObj6 = this;
            window.ele6 = element;
            window.Xx6 = x;
            if (this.transform3DSupport) {
                this.css(element, 'transform', 'translate3d(' + x + ',' + window.offset6 + 'px ,0)');
            } else if (this.transform2DSupport) {
                this.css(element, 'transform', 'translate(' + x + ',' + window.offset6 + ')');
            } else {
                element.style.left = x;
                element.style.top = window.offset6;
            }
        }
    };

    Parallax.prototype.onOrientationTimer = function() {
        //console.log("orientation timer?");
        if (this.orientationSupport && this.orientationStatus === 0) {
            this.disable();
            this.orientationSupport = false;
            this.enable();
        }
    };

    Parallax.prototype.onCalibrationTimer = function() {
        this.calibrationFlag = true;
    };

    Parallax.prototype.onWindowResize = function() {
        this.updateDimensions();
    };

    Parallax.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var dx = this.ix - this.cx;
        var dy = this.iy - this.cy;
        if ((Math.abs(dx) > this.calibrationThreshold) || (Math.abs(dy) > this.calibrationThreshold)) {
            this.queueCalibration(0);
        }
        if (this.portrait) {
            this.mx = this.calibrateX ? dy : this.iy;
            this.my = this.calibrateY ? dx : this.ix;
        } else {
            this.mx = this.calibrateX ? dx : this.ix;
            this.my = this.calibrateY ? dy : this.iy;
        }
        this.mx *= this.ew * (this.scalarX / 100);
        this.my *= this.eh * (this.scalarY / 100);
        if (!isNaN(parseFloat(this.limitX))) {
            this.mx = this.clamp(this.mx, -this.limitX, this.limitX);
        }
        if (!isNaN(parseFloat(this.limitY))) {
            this.my = this.clamp(this.my, -this.limitY, this.limitY);
        }
        this.vx += (this.mx - this.vx) * this.frictionX;
        this.vy += (this.my - this.vy) * this.frictionY;
        for (var i = 0, l = this.layers.length; i < l; i++) {
            var layer = this.layers[i];
            var depth = this.depths[i];
            var xOffset = this.vx * depth * (this.invertX ? -1 : 1);
            var yOffset = this.vy * depth * (this.invertY ? -1 : 1);
            this.setPosition(layer, xOffset, yOffset);
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame);
    };

    Parallax.prototype.onDeviceOrientation = function(event) {
        //console.log("device or?");
        // Validate environment and event properties.
        if (!this.desktop && event.beta !== null && event.gamma !== null) {

            // Set orientation status.
            this.orientationStatus = 1;

            // Extract Rotation
            var x = (event.beta || 0) / MAGIC_NUMBER; //  -90 :: 90
            var y = (event.gamma || 0) / MAGIC_NUMBER; // -180 :: 180

            // Detect Orientation Change
            var portrait = this.wh > this.ww;
            if (this.portrait !== portrait) {
                this.portrait = portrait;
                this.calibrationFlag = true;
            }

            // Set Calibration
            if (this.calibrationFlag) {
                this.calibrationFlag = false;
                this.cx = x;
                this.cy = y;
            }

            // Set Input
            this.ix = x;
            this.iy = y;
        }
    };

    Parallax.prototype.onMouseMove = function(event) {
        //console.log("mouse moved");
        // console.log(this.orientationSupport);
        // console.log(this.relativeInput);
        // Cache mouse coordinates.
        var clientX = event.clientX;
        var clientY = event.clientY;

        // Calculate Mouse Input
        if (!this.orientationSupport && this.relativeInput) {

            // Clip mouse coordinates inside element bounds.
            if (this.clipRelativeInput) {
                clientX = Math.max(clientX, this.ex);
                clientX = Math.min(clientX, this.ex + this.ew);
                clientY = Math.max(clientY, this.ey);
                clientY = Math.min(clientY, this.ey + this.eh);
            }

            // Calculate input relative to the element.
            this.ix = (clientX - this.ex - this.ecx) / this.erx;
            this.iy = (clientY - this.ey - this.ecy) / this.ery;

        } else {

            // Calculate input relative to the window.
            this.ix = (clientX - this.wcx) / this.wrx;
            this.iy = (clientY - this.wcy) / this.wry;
        }
    };

    // Expose Parallax
    window[NAME] = Parallax;

})(window, document);

;
(function() {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        // window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    //console.log(requestAnimationFrame);
    //console.log("req Ani Fra");
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

}());

new ParallaxManager('.parallax-layer');