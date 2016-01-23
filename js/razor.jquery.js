/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    
    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "razorslide",
        defaults = {
           autoplay : false,
           controls: true,
           indicators: true,
           speed:2000,
           autoplaySpeed:3000,
           easing:'easeOutQuad',
           controlRight:'&raquo;',
           controlLeft:'&laquo;',
           onSlide:null,
           onSlidePost:null
         };

    // The actual plugin constructor
    function Razorslide( element, options ) {
         this.options = $.extend( {}, defaults, options) ;
        
        this.$element = $(element);
        this.$element.addClass('razor-slider');
        this.$element.find('li').addClass('razor-item');
        
        this.$item = this.$element.find('.razor-item');
        this.$current = null;
        this.$slideHeight = this.$item.height();
        this.$slideWidth = this.$item.width();
        this.$slides = this.$item.length;
        this.$item.wrapAll('<div class="razor-item-wrapper" />');
        this.$itemWrapper = $('.razor-item-wrapper');
        this.$itemWrapperWidth = this.$slides * this.$slideWidth;
        
       
        
        this.$element.css({ width: this.$slideWidth, height: this.$slideHeight });
	
	    this.$itemWrapper.css({ width: this.$itemWrapperWidth, marginLeft: 0 });
        
        
        

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Razorslide.prototype = {

        init: function() {
            var self = this;
            
            self.$element.find('.razor-item').css({height:self.$slideHeight+'px',width:self.$slideWidth+'px'});
            
            self.$element.on('click','.razor-left-nav',function(){
                   self.slideLeft();
               });

            self.$element.on('click','.razor-right-nav',function(){
                   self.slideRight();
               });
            
            
            
            if(self.options.controls)
            {
               self.generateControls();
            }
            
            
            if(self.options.indicators)
            {
              self.generateIndicators();
              self.$element.on('click','.razor-indicator',function(){
              self.movetoSlide($(this).data('slide-to'));
            });
            }
            
            if(self.options.autoplay)
            {
              self.autoPlay();        
            }
           
            self.getActiveSlide();
            if(self.$current === null)
            {
                self.$element.find('.razor-item').first().addClass('active');
                self.getActiveSlide();
            }
            //self.setStartSlide();
            
        },

        slideLeft: function() {
            var self = this;
            var pos;
            
            if(typeof self.options.onSlide === 'function')
            {
                self.options.onSlide(self.$current,self.$element)
            }
            
            if(self.$current.index() === 0)
            {
               
              self.$current.removeClass('active')
              self.$element.find('.razor-item').last().addClass('active');
            }
            else
            {
                self.$current.removeClass('active').prev().addClass('active');
            }
            self.getActiveSlide();
            pos = self.$current.index() * self.$slideWidth;
            self.$itemWrapper.animate({
            marginLeft: - pos
        },self.options.speed,self.options.easing, function () {
                 
            if(typeof self.options.onSlidePost === 'function')
            {
                self.options.onSlide(self.$current,self.$element)
            }
             
        });
        },
        
        slideRight: function(){
            var self = this;
            var pos;
            if(typeof self.options.onSlide === 'function')
            {
                self.options.onSlide(self.$current,self.$element)
            }
            if(self.$current.index()+1 === self.$slides)
            {
               
              self.$current.removeClass('active')
              self.$element.find('.razor-item').first().addClass('active');
            }
            else
            {
                self.$current.removeClass('active').next().addClass('active');
            }
            self.getActiveSlide();
            pos = self.$current.index() * self.$slideWidth;
            self.$itemWrapper.animate({
            marginLeft: - pos
        },self.options.speed,self.options.easing, function () {

            if(typeof self.options.onSlidePost === 'function')
            {
                self.options.onSlide(self.$current,self.$element)
            }
        });
        },
        
     autoPlay:function(){
            var self = this;
            setInterval(function () {
                self.slideRight();
            }, self.options.autoplaySpeed);
        },
     generateControls:function(){
         var self = this;
         self.$element.append('<a href="#" class="razor-right-nav">'+self.options.controlRight+'</a><a href="#" class="razor-left-nav">'+self.options.controlLeft+'</a>');
     },
     generateIndicators:function(){
         var self = this,html = $('<ul />').addClass('razor-indicator-wrapper');
         
         self.$item.each(function(index,element){
             $('<li />').addClass('razor-indicator').text(index).attr('data-slide-to',index).appendTo(html);
         });
         
         self.$element.append(html);
     },
    getActiveSlide:function(){
        var self = this;
        var current;
        self.$element.find('.razor-item').each(function(){
            if($(this).hasClass('active'))
            {
                self.$current = $(this);
               
            }
        });
         self.setIndicator();
    },
    setStartSlide:function(){
       var self = this;
        var current;
        self.$element.find('.razor-item').each(function(){
            if($(this).hasClass('active'))
            {
                $(this).prependTo(self.$itemWrapper);
            }
        });
    },
    setIndicator : function(){
        var self = this;
        if(self.$current)
        $('.razor-indicator').removeClass('razor-indicator-active').eq(self.$current.index()).addClass('razor-indicator-active');
    },
    
    movetoSlide : function(index){
        var self = this;
        var pos;
        pos = index * self.$slideWidth;
        self.$element.find('.razor-item').removeClass('active')
        self.$element.find('.razor-item').eq(index).addClass('active');
        self.getActiveSlide();
        self.$itemWrapper.animate({
        marginLeft: -pos
        }, self.options.speed, function () {

        });
    }
                                               
    };

/* ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ======================================================== */

$.easing['jswing'] = $.easing['swing'];

$.extend( $.easing,
{
	// t: current time, b: begInnIng value, c: change In value, d: duration
	
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
    
    
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Razorslide( this, options ));
            }
        });
        
    };

})( jQuery, window, document );