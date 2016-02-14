/*!
 * jQuery ImgPos Plugin
 * Author: Riaz Laskar
 * Url : https://github.com/riazXrazor/razor.slider
 *
 */

;(function ( $, window, document, undefined ) {

    // To do list
    //1. try making in memory image and get real height
    //width of image from the rather then the element itself coz
    //css may affect the height n width;
    
    //2. try make a singletone patter as its new creating new object for each image 

    //3. try caching of canvas not make multipal canvas
    
    // defaults settings
    var pluginName = "imgpos",
        defaults = {
            posx:null,
            posy:null,
            height:null,
            width:null,
            originx:0,
            originy:0,
            posSize:false
         };

    // plugin constructor
    function ImgPos( element, options ) {

        var self = this;
        self.options = $.extend( {}, defaults, options) ;
        
        
        self.canvas = null;
        self.ctx = null;
        self.image = null;
        self.newPosSrc = null;
        
        self.$element = $(element);
        self.posx = self.$element.data('posx') || self.options.posx;
        self.posy = self.$element.data('posy') || self.options.posy;
        
        self.height =  self.$element.data('height') || self.options.height || self.$element.height();
        self.width =  self.$element.data('width') || self.options.width || self.$element.width();
        
        self.originx = (self.options.originx || self.$element.data('origin-x')) || 0;
        self.originy = (self.options.originy || self.$element.data('origin-y')) || 0;
        
        self.options.posSize = self.$element.data('pos-size') || self.options.posSize;
        
        self._defaults = defaults;
        self._name = pluginName;

       self.init();
    };

    // initilizes everything
    ImgPos.prototype.init = function(){
        var self = this;
        
        if(self.isPercent(self.posx))
        {
            self.posx = self.calValue(self.posx,'x');
        }
        
        if(self.isPercent(self.posy))
        {
            self.posy = self.calValue(self.posy,'y');
        }
        
        if(self.isPercent(self.width))
        {
            self.width = self.calValue(self.width,'x');
        }
        
        if(self.isPercent(self.height))
        {
            self.height = self.calValue(self.height,'y');
        }
        
        // created the canvas for image manupulation
        self.canvas = document.createElement('canvas');
        
        if(self.options.posSize)
        {
            self.canvas.height = self.height  ;
            self.canvas.width = self.width  ; 
        }
        else
        {
            self.canvas.height = self.$element.attr('height') || self.height || self.$element.height() ;
            self.canvas.width = self.$element.attr('width') || self.width || self.$element.width() ;
        }
        self.ctx = self.canvas.getContext('2d');
        self.initImage();
    };
    
    // initilize the image and generated cropped image once image is loaded
    ImgPos.prototype.initImage = function(){
        var self = this;
        self.image = new Image();
        // for cross domain images
        self.image.crossOrigin="anonymous";
        self.image.onload = function(){
            self.drawimage();
            self.getPosImage();
            self.setNewPos();
        }
        
         self.image.src = self.$element.attr('src');
    }
    
    // drows the image on canvas and crops it to specific dimentions and portion
    ImgPos.prototype.drawimage = function(){
        var self = this;
        
        self.ctx.drawImage(self.image,
                              self.posx,
                              self.posy,
                              self.width,
                              self.height,
                              self.originx,
                              self.originy,
                              self.width,
                              self.height
                             );

    }
    
    // values are in percentage calculated the apporiate value in pixel
    ImgPos.prototype.calValue = function(per,type){
        var self = this,v = per.toString().substr(0,per.toString().length-1);
        if(type === 'x')
            return (v/100)* self.$element.width();
        if(type === 'y')
            return (v/100)* self.$element.height();
    }
    
    // check if a value is on percentage
    ImgPos.prototype.isPercent = function(val){
        var p = val.toString().substr(val.toString().length-1,1);
        if(p === '%') return true;
        
        return false;
    }
    
    // generates the new cropped image data URL
    ImgPos.prototype.getPosImage = function(){
        var self = this;
       self.newPosSrc = self.canvas.toDataURL();
    }
    
    // sets the new generated dataurl in the image element
    ImgPos.prototype.setNewPos = function(){
        var self = this;
        self.$element.attr('src',self.newPosSrc);
    }
    
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new ImgPos( this, options ));
            }
        });
        
    };

   $(document).ready(function(){
       $('img').css('opacity',0);
      $('[data-img-pos="true"]').imgpos();
   }); 
    
    $(window).load(function() {  
     $('img').animate({'opacity':1},800);
    });
    
})( jQuery, window, document );