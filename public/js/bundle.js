(function () {
	"use strict";
		angular.module('dataconfig', []);
		angular.module('config', [ 'ngMaterial']);
		angular.module('services', []);
		angular.module('directives', []);
		angular.module('homeCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('movieTvCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('castCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('spotlightCtrl', ['ui.bootstrap', 'ngAnimate']);
		angular.module('adminCtrl', ['ui.bootstrap', 'ngAnimate']);
		/**/
    angular.module('WeDBApp', ['ngMaterial','ngAnimate', 'ui.router', 'dataconfig', 'config', 'services', 'directives', 'homeCtrl', 'movieTvCtrl', 'castCtrl','spotlightCtrl', 'adminCtrl']);

})();

(function(){
   "use strict";

    angular.module('directives').directive('backImg', ['$window', function($window) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {
          var url = attrs.backImg;
          element.css({'background-image': 'url(' + url +')'});
        }
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('directives').directive('randomMotion', ['$timeout', function($timeout) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {
          //console.log("Start Motion");
          // Randomly Set Postion & Velocity
          var maxVelocity = 100;
          var posX = Math.min(0, Math.max(20, (Math.random() * 0)));
          var posY = Math.min(0, Math.max(20, (Math.random() * 10)));
          var velX = (Math.random() * maxVelocity);
          var velY = (Math.random() * maxVelocity);
          var timestamp = null;

          var parentContainer = element[0].offsetParent;

          // Move Object
          (function tick() {
            var now = new Date().getTime();
            var borderX = parentContainer.clientWidth *.20;
            var borderY = parentContainer.clientHeight *.20;

            var maxX = parentContainer.clientWidth - borderX;
            var maxY = parentContainer.clientHeight - borderY;

            var elapsed = (timestamp || now) - now;
            timestamp = now;
            posX += elapsed * velX / 1000;
            posY += elapsed * velY / 1000;

            if (posX > maxX) {
                posX = 2 * maxX - posX;
                velX *= -1;
            }
            if (posX < 10) {
                posX = 10;
                velX *= -1;
            }
            if (posY > maxY) {
                posY = 2 * maxY - posY;
                velY *= -1;
            }
            if (posY < 10) {
                posY = 10;
                velY *= -1;
            }
            element.css({ "top": posY, "left": posX });
            // Set Position to $element top and left
            // Loop to Move object
            $timeout(tick, 30);
          })();
        }
      }
    }]);

})();


angular.module('directives')
  .directive('scrollTo', ['ScrollTo', function(ScrollTo){
    return {
      restrict : "AC",
      compile : function(){

        return function(scope, element, attr) {
          element.bind("click", function(event){
            ScrollTo.idOrName(attr.scrollTo, attr.offset);
          });
        };
      }
    };
  }])
  .service('ScrollTo', ['$window', 'ngScrollToOptions', function($window, ngScrollToOptions) {
    this.idOrName = function (idOrName, offset, focus) {//find element with the given id or name and scroll to the first element it finds
        var document = $window.document;

        if(!idOrName) {//move to top if idOrName is not provided
          $window.scrollTo(0, 0);
        }

        if(focus === undefined) { //set default action to focus element
            focus = true;
        }

        //check if an element can be found with id attribute
        var el = document.getElementById(idOrName);
        if(!el) {//check if an element can be found with name attribute if there is no such id
          el = document.getElementsByName(idOrName);

          if(el && el.length)
            el = el[0];
          else
            el = null;
        }

        if(el) { //if an element is found, scroll to the element
          if (focus) {
              el.focus();
          }

          ngScrollToOptions.handler(el, offset);
        }
        //otherwise, ignore
      }

  }])
  .provider("ngScrollToOptions", function() {
    this.options = {
      handler : function(el, offset) {
        if (offset) {
          var top = $(el).offset().top - offset;
          window.scrollTo(0, top);
        }
        else {
          el.scrollIntoView();
        }
      }
    };
    this.$get = function() {
      return this.options;
    };
    this.extend = function(options) {
      this.options = angular.extend(this.options, options);
    };
  });



//angular.module("myApp", ["ngScrollTo"]);

!function(){function t(t){for(;t>o;)t-=o;for(;0>t;)t+=o;return t}function n(t,n,e,r,a,i){if(0>=a||0>=r)return 0;var u=t.concat().sort(d3.ascending),o=r-u.length*n+(i?n:0),s=[],c=0,d=0;return d3.range(u.length).forEach(function(t){d=(o-e*t)/(a-=u[t-1]||0),c+=u[t]*d<=e?1:0,s.push(d)}),s[c]}function e(t,e,r,a,i){var u=a,o=d3.sum(t),s=n(t,e,r,i-a,o,!1),c=t.map(function(t){var n=s*t,a=(r>n?r:n)/2;return u+=2*a+e,{c:u-a,v:n,w:a,value:t,percent:t/(o||1)}});return c}function r(t){function n(t,n){return[t*Math.cos(n),t*Math.sin(n)]}var e=n(t[0],t[2]),r=n(t[0],t[3]),a=n(t[1],t[2]),i=n(t[1],t[3]);return["M",e,"A",t[0],t[0],"0",t[3]-t[2]>s?1:0,"1",r,"L",i,"A",t[1],t[1],"0",t[3]-t[2]>s?1:0,"0",a,"z"].join(" ")}function a(t,n,e,r,a,i){function u(t,n,e){return"A"+t+","+t+" 0 "+ +(e>s)+",1 "+n}function c(t,n){return[t*Math.cos(n),t*Math.sin(n)]}function d(t,n,e,r){e+=n>e?o:0;var a=e-n,i=1-(a>s?o-a:a)/s;i=Math.pow(i,5);var u=(e+n)/2-(e-n>s?s:0);return"Q"+i*r*Math.cos(u)+","+i*r*Math.sin(u)+" "+t}var f=c(t,n),l=c(t,e),g=c(r,a),p=c(r,i);return"M"+f+u(t,l,e-n)+(n==a&&e==i?d(f,n,e,r):d(g,e,a,r)+u(r,p,i-a)+d(f,n,i,t))+"Z"}function i(t,n){ret=[];for(var e=n;e>n-t;e--)ret.push(0>e?e+t:e);return ret}var u={version:"1.1.0"},o=2*Math.PI,s=Math.PI,c=Math.PI/2;u.bP=function(){function t(i){y=i,i.each(function(){var i=d3.select(this),u=t.bars(),o=i.selectAll(".subBars").data(u.subBars).enter().append("g").attr("transform",function(t){return"translate("+t.x+","+t.y+")"}).attr("class","subBars").append("rect").attr("x",n).attr("y",e).attr("width",r).attr("height",a);"undefined"!=typeof h&&o.style("fill",function(t){return h(t)});var s=i.selectAll(".edges").data(u.edges).enter().append("path").attr("class","edges").attr("d",function(t){return t.path}).style("fill-opacity",t.edgeOpacity());"undefined"!=typeof h&&s.style("fill",function(t){return h(t)}),i.selectAll(".mainBars").data(u.mainBars).enter().append("g").attr("transform",function(t){return"translate("+t.x+","+t.y+")"}).attr("class","mainBars").append("rect").attr("x",n).attr("y",e).attr("width",r).attr("height",a).style("fill-opacity",0).on("mouseover",t.mouseover).on("mouseout",t.mouseout)})}function n(t){return-t.width}function e(t){return-t.height}function r(t){return 2*t.width}function a(t){return 2*t.height}var i,u,o,s,c,d,f,l,g,p,h,y,m,v,A,x,k;return t.data=function(n){return arguments.length?(p=n,t):p},t.fill=function(n){return arguments.length?(h=n,t):h},t.keyPrimary=function(n){return arguments.length?(i=n,t):"undefined"!=typeof i?i:function(t){return t[0]}},t.sortPrimary=function(n){return arguments.length?(A=n,t):"undefined"!=typeof A?A:d3.ascending},t.keySecondary=function(n){return arguments.length?(u=n,t):"undefined"!=typeof u?u:function(t){return t[1]}},t.sortSecondary=function(n){return arguments.length?(x=n,t):"undefined"!=typeof x?x:d3.ascending},t.value=function(n){return arguments.length?(o=n,t):"undefined"!=typeof o?o:function(t){return t[2]}},t.width=function(n){return arguments.length?(s=n,t):"undefined"!=typeof s?s:400},t.height=function(n){return arguments.length?(c=n,t):"undefined"!=typeof c?c:600},t.barSize=function(n){return arguments.length?(f=n,t):"undefined"!=typeof f?f:35},t.min=function(n){return arguments.length?(l=n,t):"undefined"!=typeof l?l:0},t.orient=function(n){return arguments.length?(d=n,t):"undefined"!=typeof d?d:"vertical"},t.pad=function(n){return arguments.length?(g=n,t):"undefined"!=typeof g?g:0},t.duration=function(n){return arguments.length?(v=n,t):"undefined"!=typeof v?v:500},t.edgeOpacity=function(n){return arguments.length?(m=n,t):"undefined"!=typeof m?m:.4},t.edgeMode=function(n){return arguments.length?(k=n,t):"undefined"!=typeof k?k:"curved"},t.bars=function(n){function e(t,e){return"undefined"==typeof n||n.part===e||d[n.part](t)===n.key}function r(){var n=t.min()/2;s.primary.forEach(function(t){t.height<n&&(t.height=n)}),s.secondary.forEach(function(t){t.height<n&&(t.height=n)})}function a(n){function r(r){return e(r,n)?t.value()(r):0}var a=d3.nest().key("primary"==n?t.keyPrimary():t.keySecondary()).sortKeys("primary"==n?t.sortPrimary():t.sortSecondary()).rollup(function(t){return d3.sum(t,r)}).entries(t.data()),i=o(a,t.pad(),t.min(),0,"vertical"==f?t.height():t.width()),u=t.barSize();a.forEach(function(e,r){s[n].push({x:"horizontal"==f?(i[r].s+i[r].e)/2:"primary"==n?u/2:t.width()-u/2,y:"vertical"==f?(i[r].s+i[r].e)/2:"primary"==n?u/2:t.height()-u/2,height:"vertical"==f?(i[r].e-i[r].s)/2:u/2,width:"horizontal"==f?(i[r].e-i[r].s)/2:u/2,part:n,key:e.key,value:e.value,percent:i[r].p})})}function i(n){function r(r){return e(r,n)?t.value()(r):0}var a=d3.map(s[n],function(t){return t.key}),i=d3.nest().key("primary"==n?t.keyPrimary():t.keySecondary()).sortKeys("primary"==n?t.sortPrimary():t.sortSecondary()).key("secondary"==n?t.keyPrimary():t.keySecondary()).sortKeys("secondary"==n?t.sortPrimary():t.sortSecondary()).rollup(function(t){return d3.sum(t,r)}).entries(t.data());i.forEach(function(e){var r=a.get(e.key),i=o(e.values,0,0,"vertical"==f?r.y-r.height:r.x-r.width,"vertical"==f?r.y+r.height:r.x+r.width),u=t.barSize();e.values.forEach(function(a,o){c[n].push({x:"vertical"==f?"primary"==n?u/2:t.width()-u/2:(i[o].s+i[o].e)/2,y:"horizontal"==f?"primary"==n?u/2:t.height()-u/2:(i[o].s+i[o].e)/2,height:("vertical"==f?i[o].e-i[o].s:u)/2,width:("horizontal"==f?i[o].e-i[o].s:u)/2,part:n,primary:"primary"==n?e.key:a.key,secondary:"primary"==n?a.key:e.key,value:a.value,percent:i[o].p*r.percent,index:"primary"==n?e.key+"|"+a.key:a.key+"|"+e.key})})})}function u(){function n(t,n,e,r,i,u,o,s){if("straight"==a)return["M",t,",",n,"L",e,",",r,"L",i,",",u,"L",o,",",s,"z"].join("");var c=(t+e)/2,d=(i+o)/2;return["M",t,",",n,"C",c,",",n," ",c,",",r,",",e,",",r,"L",i,",",u,"C",d,",",u," ",d,",",s,",",o,",",s,"z"].join("")}function e(t,n,e,r,i,u,o,s){if("straight"==a)return["M",t,",",n,"L",e,",",r,"L",i,",",u,"L",o,",",s,"z"].join("");var c=(n+r)/2,d=(u+s)/2;return["M",t,",",n,"C",t,",",c," ",e,",",c,",",e,",",r,"L",i,",",u,"C",i,",",d," ",o,",",d,",",o,",",s,"z"].join("")}var r=d3.map(c.secondary,function(t){return t.index}),a=t.edgeMode();return c.primary.map(function(t){var a=r.get(t.index);return{path:"vertical"===f?n(t.x+t.width,t.y+t.height,a.x-a.width,a.y+a.height,a.x-a.width,a.y-a.height,t.x+t.width,t.y-t.height):e(t.x-t.width,t.y+t.height,a.x-a.width,a.y-a.height,a.x+a.width,a.y-a.height,t.x+t.width,t.y+t.height),primary:t.primary,secondary:t.secondary,value:t.value,percent:t.percent}})}function o(t,n,e,r,a){var i=e/(a-r-2*t.length*n),u=0,o=0,s=d3.sum(t,function(t){return t.value});t.forEach(function(t){t.value<i*s&&(u+=1,o+=t.value)});var c=1e-5>s?0:(a-r-2*t.length*n-u*e)/(s-o),d=r,f=[];return t.forEach(function(t){var r=t.value*c;f.push({s:d+n+(e>r?.5*(e-r):0),e:d+n+(e>r?.5*(e+r):r),p:1e-5>s?0:t.value/s}),d+=2*n+(e>r?e:r)}),f}var s={primary:[],secondary:[]},c={primary:[],secondary:[]},d={primary:t.keyPrimary(),secondary:t.keySecondary()},f=t.orient();return a("primary"),a("secondary"),i("primary"),i("secondary"),r(),{mainBars:s.primary.concat(s.secondary),subBars:c.primary.concat(c.secondary),edges:u()}},t.mouseover=function(i){var u=t.bars(i);y.selectAll(".mainBars").filter(function(t){return t.part===i.part&&t.key===i.key}).select("rect").style("stroke-opacity",1),y.selectAll(".subBars").data(u.subBars).transition().duration(t.duration()).attr("transform",function(t){return"translate("+t.x+","+t.y+")"}).select("rect").attr("x",n).attr("y",e).attr("width",r).attr("height",a);var o=y.selectAll(".edges").data(u.edges);o.filter(function(t){return t[i.part]===i.key}).transition().duration(t.duration()).style("fill-opacity",t.edgeOpacity()).attr("d",function(t){return t.path}),o.filter(function(t){return t[i.part]!==i.key}).transition().duration(t.duration()).style("fill-opacity",0).attr("d",function(t){return t.path}),y.selectAll(".mainBars").data(u.mainBars).transition().duration(t.duration()).attr("transform",function(t){return"translate("+t.x+","+t.y+")"}).select("rect").attr("x",n).attr("y",e).attr("width",r).attr("height",a)},t.mouseout=function(i){var u=t.bars();y.selectAll(".mainBars").filter(function(t){return t.part===i.part&&t.key===i.key}).select("rect").style("stroke-opacity",0),y.selectAll(".subBars").data(u.subBars).transition().duration(t.duration()).attr("transform",function(t){return"translate("+t.x+","+t.y+")"}).select("rect").attr("x",n).attr("y",e).attr("width",r).attr("height",a),y.selectAll(".edges").data(u.edges).transition().duration(t.duration()).style("fill-opacity",t.edgeOpacity()).attr("d",function(t){return t.path}),y.selectAll(".mainBars").data(u.mainBars).transition().duration(t.duration()).attr("transform",function(t){return"translate("+t.x+","+t.y+")"}).select("rect").attr("x",n).attr("y",e).attr("width",r).attr("height",a)},t},u.gg=function(){function t(n){g=n,n.each(function(){var n=d3.select(this),e=t.scale(),r=t.minorTickStart(),a=t.minorTickEnd(),i=t.majorTickStart(),u=t.majorTickEnd(),o=t.ticks(),c=t.majorTicks(),d=t.labelLocation(),f=t.outerRadius();n.append("circle").attr("r",f).style("fill","url(#vizgg3"+p+")").attr("class","face"),n.append("circle").attr("r",t.innerRadius()).style("fill","url(#vizgg2"+p+")").style("filter","url(#vizgg5"+p+")").attr("class","innerFace");var l=n.append("g");l.selectAll("line").data(o).enter().append("line").attr("class",function(t){return c(t)?"majorTicks":"minorTicks"}).attr("x1",function(t){return f*(c(t)?i:r)*Math.cos(e(t))}).attr("y1",function(t){return f*(c(t)?i:r)*Math.sin(e(t))}).attr("x2",function(t){return f*(c(t)?u:a)*Math.cos(e(t))}).attr("y2",function(t){return f*(c(t)?u:a)*Math.sin(e(t))}),n.selectAll("text").data(o.filter(c)).enter().append("text").attr("class","label").attr("x",function(t){return f*d*Math.cos(e(t))}).attr("y",function(t){return f*d*Math.sin(e(t))}).attr("dy",3).text(function(t){return t});var g=t.outerRadius()/b.outerRadius,h=180*t.scale()(t.value())/s+90;n.append("g").attr("transform","translate(1,1)").selectAll(".needleshadow").data([0]).enter().append("g").attr("transform","rotate("+h+")").attr("class","needleshadow").append("path").attr("d",["m 0",-130*g,5*g,175*g,-10*g,"0,z"].join(",")).style("filter","url(#vizgg6"+p+")"),n.selectAll(".needle").data([0]).enter().append("g").attr("transform","rotate("+h+")").attr("class","needle").append("polygon").attr("points",[-.5*g,-130*g,.5*g,-130*g,5*g,45*g,-5*g,45*g].join(",")).style("fill","url(#vizgg4"+p+")")})}var n,e,r,a,i,o,c,d,f,l,g,p,h,y,m,v,A,x,k,b={innerRadius:20,outerRadius:150,angleOffset:.7,startAngle:-1.5*s,endAngle:.5*s,minorTickStart:.9,minorTickEnd:.95,majorTickStart:.82,majorTickEnd:.95,needleColor:"#de2c2c",innerFaceColor:"#999999",faceColor:"#666666",domain:[0,100],duration:500,ease:"cubicInOut",ticks:d3.range(0,101,2),majorTicks:function(t){return t%10===0},labelLocation:.7};return t.scale=function(){return d3.scale.linear().domain(t.domain()).range([b.startAngle+t.angleOffset(),b.endAngle-t.angleOffset()])},t.innerRadius=function(e){return arguments.length?(n=e,t):"undefined"!=typeof n?n:b.innerRadius},t.outerRadius=function(n){return arguments.length?(e=n,t):"undefined"!=typeof e?e:b.outerRadius},t.angleOffset=function(n){return arguments.length?(d=n,t):"undefined"!=typeof d?d:b.angleOffset},t.labelLocation=function(n){return arguments.length?(k=n,t):"undefined"!=typeof k?k:b.labelLocation},t.ticks=function(n){return arguments.length?(h=n,t):"undefined"!=typeof h?h:b.ticks},t.majorTicks=function(n){return arguments.length?(y=n,t):"undefined"!=typeof y?y:b.majorTicks},t.minorTickStart=function(n){return arguments.length?(m=n,t):"undefined"!=typeof m?m:b.minorTickStart},t.minorTickEnd=function(n){return arguments.length?(v=n,t):"undefined"!=typeof v?v:b.minorTickEnd},t.majorTickStart=function(n){return arguments.length?(A=n,t):"undefined"!=typeof A?A:b.majorTickStart},t.majorTickEnd=function(n){return arguments.length?(x=n,t):"undefined"!=typeof x?x:b.majorTickEnd},t.needleColor=function(n){return arguments.length?(r=n,t):"undefined"!=typeof r?r:b.needleColor},t.innerFaceColor=function(n){return arguments.length?(a=n,t):"undefined"!=typeof a?a:b.innerFaceColor},t.faceColor=function(n){return arguments.length?(i=n,t):"undefined"!=typeof i?i:b.faceColor},t.domain=function(n){return arguments.length?(o=n,t):"undefined"!=typeof o?o:b.domain},t.duration=function(n){return arguments.length?(f=n,t):"undefined"!=typeof f?f:b.duration},t.ease=function(n){return arguments.length?(l=n,t):"undefined"!=typeof l?l:b.ease},t.value=function(n){return arguments.length?(c=n,t):"undefined"!=typeof c?c:.5*(b.domain[0]+b.domain[1])},t.defs=function(n,e){var r=n.append("defs");p=e;var a=t.needleColor(),i=t.innerFaceColor(),o=t.faceColor(),s=u.defs(r).lG().id("vizgg1"+e).sel();u.defs(s).stop().offset("0").stopColor(a),u.defs(s).stop().offset("1").stopColor(d3.rgb(a).darker(1));var c=u.defs(r).rG().id("vizgg2"+e).fx("35%").fy("65%").r("65%").spreadMethod("pad").sel();u.defs(c).stop().offset("0").stopColor(i),u.defs(c).stop().offset("1").stopColor(d3.rgb(i).darker(2));var d=u.defs(r).rG().id("vizgg3"+e).fx("35%").fy("65%").r("65%").spreadMethod("pad").sel();u.defs(d).stop().offset("0").stopColor(o),u.defs(d).stop().offset("1").stopColor(d3.rgb(o).darker(2)),u.defs(r).lG().id("vizgg4"+e).gradientUnits("userSpaceOnUse").y1("80").x1("-10").y2("80").x2("10").xlink("#vizgg1"+e);var f=u.defs(r).filter().id("vizgg5"+e).sel();u.defs(f).feFlood().result("flood").floodColor("rgb(0,0,0)").floodOpacity("0.6"),u.defs(f).feComposite().result("composite1").operator("in").in2("SourceGraphic")["in"]("flood"),u.defs(f).feGaussianBlur().result("blur").stdDeviation("2")["in"]("composite1"),u.defs(f).feOffset().result("offset").dy("2").dx("2"),u.defs(f).feComposite().result("composite2").operator("over").in2("offset")["in"]("SourceGraphic");var l=u.defs(r).filter().x("-0.3").y("-0.3").height("1.8").width("1.8").id("vizgg6"+e).sel();u.defs(l).feGaussianBlur().stdDeviation("2")},t.setNeedle=function(n){function e(t,n){return d3.interpolateString("rotate("+t+")","rotate("+n+")")}var r=180*t.scale()(n)/s+90,a=180*t.scale()(t.value())/s+90,i=t.ease();g.selectAll(".needle").data([n]).transition().duration(t.duration()).attrTween("transform",function(t){return e(a,r)}).ease(i),g.selectAll(".needleshadow").data([n]).transition().duration(t.duration()).attrTween("transform",function(t){return e(a,r)}).ease(i).each("end",function(){angle=n}),t.value(n)},t},u.ch=function(){function u(t){function n(t){return r([B,O,t.startAngle,t.endAngle])}function e(t){return a(B,t.startAngle,t.endAngle,B,t.endStartAngle,t.endEndAngle)}p=t,k||f(),t.each(function(){var t=d3.select(this),r=t.selectAll(".groups").data(x).enter().append("g").attr("class","groups").on("mouseover",u.mouseover).on("mouseout",u.mouseout),a=r.append("text").attr("class","label"),i=(1+u.labelPadding())*u.outerRadius(),s=u.valueFormat();a.filter(function(t){return"g"==t.type}).attr("x",function(t){return i*Math.cos(d(t))}).attr("y",function(t){return i*Math.sin(d(t))}).text(function(t){return t.source+" ("+s(t.value)+")"}).style("text-anchor",function(t){var n=d(t);return c>n||n>o-c?"start":"end"}).each(function(t){this._current=t}),r.append("path").style("fill",function(t){return y(t.source)}).style("stroke",function(t){return y(t.source)}).attr("d",n).each(function(t){this._current=t}).filter(function(t){return"g"==t.type}),t.append("g").attr("class","chords").selectAll(".chord").data(k).enter().append("g").attr("class","chord").append("path").each(function(t){this._current=t}).attr("d",e).style("fill",function(t){return y(t.target)}).style("opacity",u.chordOpacity()).style("stroke",function(t){return y(t.target)}).style("display",function(t){return t.display?"inline":"none"})})}function s(t){function n(t,n){return r([B,O,t.startAngle,t.endAngle])}function e(t){return a(B,t.startAngle,t.endAngle,B,t.endStartAngle,t.endEndAngle)}function i(t){var n=d3.interpolate(this._current,t);return this._current=n(0),function(t){return e(n(t))}}function s(t){var e=d3.interpolate(this._current,t);return this._current=e(0),function(t){return n(e(t),t)}}function f(t){var n=d3.interpolate(this._current,t);return this._current=n(0),function(t){return h*Math.cos(d(n(t)))}}function l(t){var n=d3.interpolate(this._current,t);return this._current=n(0),function(t){return h*Math.sin(d(n(t)))}}var g=p.selectAll(".groups").data(t?b:u.groups()),h=(1+u.labelPadding())*u.outerRadius(),y=u.valueFormat();g.select("path").transition().duration(L).attrTween("d",s),g.select(".label").filter(function(t){return"g"==t.type}).transition().duration(L).attrTween("x",f).attrTween("y",l).text(function(t){return t.source+" ("+y(t.value)+")"}).style("text-anchor",function(t){var n=d(t);return c>n||n>o-c?"start":"end"});var m=u.chordOpacity();p.select(".chords").selectAll(".chord").data(t?w:u.chords()).select("path").transition().duration(L).attrTween("d",i).style("opacity",function(t){return t.display?m:0})}function d(n){return t((n.startAngle+n.endAngle)/2)}function f(){m=[],h.forEach(function(t){-1==m.indexOf(E(t))&&m.push(E(t)),-1==m.indexOf(M(t))&&m.push(M(t))}),m=m.sort(T),v={},A={},m.forEach(function(t){v[t]={},A[t]={},m.forEach(function(n){v[t][n]=0,A[t][n]=!1})}),h.forEach(function(t){var n=E(t),e=M(t);v[n][e]+=S(t),A[n][e]=!0}),x=[],m.forEach(function(t,n){x.push({source:t,type:"gs",value:0,skipPad:!0,index:n}),x.push({source:t,type:"g",value:d3.sum(m,function(n){return v[t][n]}),skipPad:!1,index:n})}),g(x,z,R,void 0,P),k=[],x.filter(function(t){return"g"==t.type}).forEach(function(t,n){var r=i(m.length,n),a=e(r.map(function(n){return v[t.source][m[n]]}),0,0,t.startAngle,t.endAngle);r.forEach(function(e,r){var i=a[r];k.push({startAngle:i.c-i.v/2,endAngle:i.c+i.v/2,value:i.value,source:t.source,target:m[e],type:"c",display:A[t.source][m[e]],index:n,subindex:e,indexsubindex:n+"-"+e})})});var t=d3.map(k,function(t){return t.indexsubindex});k.forEach(function(n){if(n.subindex==n.index)return n.endStartAngle=n.startAngle,void(n.endEndAngle=n.startAngle);var e=t.get(n.subindex+"-"+n.index);n.endStartAngle=e.startAngle,n.endEndAngle=e.startAngle}),F=!1}function l(t){function n(t){return t.endAngle+t.startAngle}var r=x.filter(function(n){return n.source==t&&"g"==n.type})[0];b=[],m.forEach(function(n,e){b.push({source:n,startAngle:r.startAngle,endAngle:r.endAngle,padAngle:r.padAngle,percent:r.percent,type:"gs",value:n==t?v[n][n]:0,skipPad:n==t&&A[n][n]?!1:!0,index:e}),n==t?b.push({source:n,startAngle:r.startAngle,endAngle:r.endAngle,padAngle:r.padAngle,percent:r.percent,type:"g",value:r.value,skipPad:!1,index:e}):b.push({source:n,type:"g",value:v[t][n],skipPad:!1,index:e})}),g(b,z,R,t,P);var a=n(r);x.forEach(function(t,e){var r=b[e],i=n(t)<a;r.startAngle-=i?o:0,r.endAngle-=i?o:0}),w=[],b.filter(function(t){return"g"==t.type}).forEach(function(n,r){var a=i(m.length,r),u=a.map(function(e){var r=m[e];return n.source==t?v[n.source][r]:r==t?v[r][n.source]:0}),o=e(u,0,0,n.startAngle,n.endAngle);a.forEach(function(e,a){var i=o[a];w.push({startAngle:i.c-i.v/2,endAngle:i.c+i.v/2,value:i.value,source:n.source,target:m[e],type:"c",display:n.source===t,index:r,subindex:e,indexsubindex:r+"-"+e})})});var u=d3.map(w.map(function(t){return{startAngle:t.startAngle,endAngle:t.endAngle,indexsubindex:t.indexsubindex}}),function(t){return t.indexsubindex}),s=d3.map(b.filter(function(t){return"gs"==t.type}),function(t){return t.source});w.forEach(function(n){if(n.subindex==n.index){var e=s.get(n.source);return n.endStartAngle=e.startAngle,void(n.endEndAngle=e.endAngle)}var r=u.get(n.subindex+"-"+n.index);n.endStartAngle=r.startAngle,n.endEndAngle=r.endAngle,n.source!==t&&(n.startAngle=n.endAngle,n.endEndAngle=n.endStartAngle)})}function g(t,e,r,a,i){var u=void 0!==a,o=0;if(u){for(var s=!1;o<t.length;o++)if(t[o].source==a&&"g"==t[o].type){s=!0;break}s||console.log("The fixed source '"+a+"' is not a valid key")}var c=d3.range(t.length);u&&(c=c.slice(o).concat(c.slice(0,o)));var d=t.filter(function(t){return!(u&&t.source===a&&"g"==t.type||t.skipPad)}).map(function(t){return t.value}),f=2*Math.PI-(u?t[o].endAngle-t[o].startAngle+2*e:0),l=u?t[o].endAngle+e:i,g=d3.sum(d),p=n(d,e,r,0>=f?0:f,g,u?!0:!1);c.slice(u?1:0).forEach(function(n){var a=p*t[n].value,i=(r>a?r-a:0)/2;t[n].startAngle=l,t[n].endAngle=l+a,t[n].padAngle=i,t[n].percent=t[n].value/(g||1),l+=a+i+(t[n].skipPad?0:e)})}var p,h,y,m,v,A,x,k,b,w,E=function(t){return t[0]},M=function(t){return t[1]},S=function(t){return t[2]},C=function(t){return t},T=d3.ascending,z=.03,P=0,B=180,O=200,j=.7,G=.02,R=0,L=500,F=!0;return u.data=function(t){return arguments.length?(h=t,F=!0,u):h},u.fill=function(t){return arguments.length?(y=t,u):y},u.duration=function(t){return arguments.length?(L=t,u):L},u.chordOpacity=function(t){return arguments.length?(j=t,u):j},u.innerRadius=function(t){return arguments.length?(B=t,F=!0,u):B},u.outerRadius=function(t){return arguments.length?(O=t,F=!0,u):O},u.source=function(t){return arguments.length?(E=t,F=!0,u):E},u.target=function(t){return arguments.length?(M=t,F=!0,u):M},u.value=function(t){return arguments.length?(S=t,F=!0,u):S},u.padding=function(t){return arguments.length?(z=t,F=!0,u):z},u.labelPadding=function(t){return arguments.length?(G=t,u):G},u.sort=function(t){return arguments.length?(T=t,F=!0,u):T},u.startAngle=function(t){return arguments.length?(P=t,F=!0,u):P},u.chords=function(){return F&&f(),k},u.groups=function(){return F&&f(),x},u.valueFormat=function(t){return arguments.length?(C=t,u):C},u.mouseover=function(t){l(t.source),s(1)},u.mouseout=function(t){s(0)},u},u.defs=function(t){var n={},e=t;return n.sel=function(){return e},n.lG=function(){return e=e.append("linearGradient"),n},n.rG=function(){return e=e.append("radialGradient"),n},n.stop=function(){return e=e.append("stop"),n},n.filter=function(){return e=e.append("filter"),n},n.feFlood=function(){return e=e.append("feFlood"),n},n.feComposite=function(){return e=e.append("feComposite"),n},n.feOffset=function(){return e=e.append("feOffset"),n},n.feGaussianBlur=function(){return e=e.append("feGaussianBlur"),n},n.result=function(t){return e=e.attr("result",t),n},n.floodColor=function(t){return e=e.attr("flood-color",t),n},n.floodOpacity=function(t){return e=e.attr("flood-opacity",t),n},n.stdDeviation=function(t){return e=e.attr("stdDeviation",t),n},n.operator=function(t){return e=e.attr("operator",t),n},n.height=function(t){return e=e.attr("height",t),n},n.width=function(t){return e=e.attr("width",t),n},n["in"]=function(t){return e=e.attr("in",t),n},n.in2=function(t){return e=e.attr("in2",t),n},n.id=function(t){return e=e.attr("id",t),n},n.fx=function(t){return e=e.attr("fx",t),n},n.fy=function(t){return e=e.attr("fy",t),n},n.dx=function(t){return e=e.attr("dx",t),n},n.dy=function(t){return e=e.attr("dy",t),n},n.x1=function(t){return e=e.attr("x1",t),n},n.y1=function(t){return e=e.attr("y1",t),n},n.x2=function(t){return e=e.attr("x2",t),n},n.y2=function(t){return e=e.attr("y2",t),n},n.x=function(t){return e=e.attr("x",t),n},n.y=function(t){return e=e.attr("y",t),n},n.r=function(t){return e=e.attr("r",t),n},n.spreadMethod=function(t){return e=e.attr("spreadMethod",t),n},n.gradientUnits=function(t){return e=e.attr("gradientUnits",t),n},n.xlink=function(t){return e=e.attr("xlink:href",t),n},n.offset=function(t){return e=e.attr("offset",t),n},n.stopColor=function(t){return e=e.attr("stop-color",t),n},n.path=function(){return e=e.append("path"),n},n.d=function(t){return e=e.attr("d",t),n},n},this.viz=u}();

(function(){
   "use strict";

    angular.module('adminCtrl').controller('AdminController', ['$state','weInfo','$sce', function($state, weInfo, $sce){
      var vm = this;
      vm.title = "Home";

      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":10, "display":[]};
      vm.allResults = [];

      vm.dataDisplay= {};

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        vm.dataDisplay = item;
        clearSearch();
        toggleSearch("close");
      }

      function clearSearch() {
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.all(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.results.slice(0, vm.displayResults.max);
          });
        }
      }

      function toggleSearch(control){
        if(control == "open")
        { vm.searchOpen = true; }
        else if(control == "close")
        { vm.searchOpen = false; }
        else if(control == "toggle")
        { vm.searchOpen = !vm.searchOpen; }

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('castCtrl').controller('CastController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "cast";
      vm.homeImg = "imgs/siteart/Cast&Crew3.jpg";
      /*Movie Ctrl*/
      var id1 = $stateParams.id1;
      var id2 = $stateParams.id2;
      var id3 = $stateParams.id3;

      vm.selectedCast = {"id":-1,"details":{}, "credits":{}, "suggestions":{}, "display":false, "infoview":"details"};
      vm.comparisonCast = [];
      vm.resultsCast = {};
      vm.resultsCast.visuals = {};
      vm.resultsCast.visuals.view = false;

      if(id1 != undefined && (id2 == undefined && id3 == undefined)){
        displayDetails(id1);
      }

      /*Set Now Playing*/
      vm.extraContent = {"cast":{}};

      weInfo.search.cast.popular(1, function(results){
        vm.extraContent.cast = results;
      });

      /*Functions*/
      vm.clearDetails = clearDetails;
      vm.displayDetails = displayDetails;
      vm.getAdditionalSelectedInfo = getAdditionalSelectedInfo;
      vm.addCheck = addCheck;
      vm.addItem = addItem;
      vm.compareObjects = compareObjects;
      vm.displayResultsCheck = displayResultsCheck;
      vm.isResultsViewed = isResultsViewed;
      vm.toggleResultViews = toggleResultViews;
      vm.clearCompare = clearCompare;
      vm.removeCast = removeCast;

      function getAge(dateString, deathString){
        var today = (deathString == undefined || deathString == "" ? new Date() : new Date(deathString));
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))  {
            age--;
        }
        return age;
      }

      function removeCast(id){
        var removePos = -1;
        for(var i=0; i < vm.comparisonCast.length; i++){
          if(id == vm.comparisonCast[i].id){
            removePos = i;
            break;
          }
        }
        if(removePos > -1) {vm.comparisonCast.splice(removePos,1);}
      }

      function clearCompare(){
        vm.comparisonCast = [];
        vm.resultsCast = {};
        vm.resultsCast.visuals = {};
        vm.resultsCast.visuals.view = false;
      }
      function toggleResultViews(id){
        var pos = -1;
        for(var i =0; i < vm.resultsCast.viewIds.length; i++){
          if(vm.resultsCast.viewIds[i] == id){
            pos = i;
          }
        }
        if((pos < 0) && (vm.resultsCast.viewIds.length < 3)) { vm.resultsCast.viewIds.push(id); }
        else if((pos >= 0) && (vm.resultsCast.viewIds.length > 1)){ vm.resultsCast.viewIds.splice(pos, 1); }
        else { alert("You must keep atleast one Cast or Crew member selected");}
        // Set Visuals
        setVisuals();
      }

      function isResultsViewed(id) {
        for(var i =0; i < vm.resultsCast.viewIds.length; i++){
          if(vm.resultsCast.viewIds[i] == id){
            return true;
          }
        }
        return false;
      }

      function setVisuals() {
        // Cast & Crew
        vm.resultsCast.visuals.movieATv = [];
        for(var i=0; i < vm.resultsCast.results.movieATv.length; i++) {
          if(displayResultsCheck(vm.resultsCast.results.movieATv[i].CCIDS)){  vm.resultsCast.visuals.movieATv.push(vm.resultsCast.results.movieATv[i]); }
        }
        var colorArrayCast = randomColor({ count: vm.resultsCast.visuals.movieATv.length + 1, luminosity: 'bright', format: 'rgb'});
        for(var i=0; i < vm.resultsCast.visuals.movieATv.length; i++) { vm.resultsCast.visuals.movieATv[i].color = colorArrayCast[i]; }

        vm.resultsCast.visuals.view = true;
      }

      function displayResultsCheck(ids){
        var inAll = true;
        for(var i =0; i < vm.resultsCast.viewIds.length; i++){
          var idActive = false;
          for(var j =0; j < ids.length; j++){
            if(ids[j] == vm.resultsCast.viewIds[i]){idActive = true;  break; }
          }
          if(idActive == false) { inAll = false;  break; }
        }
        return inAll;
      }

      function compareObjects() {
        weInfo.compare.cast(vm.comparisonCast, function(res){
          vm.resultsCast.results = res;
          // Set View Ids
          vm.resultsCast.viewIds = [];
          for(var i=0; i < res.castcrew.length; i++){
            vm.resultsCast.viewIds.push(res.castcrew[i].id);
          }
          // Set Visuals
          setVisuals();
        });
      }

      function addItem(item) {
        if(addCheck(item.id)) {
          var tmpCast = {};
          tmpCast.id = item.id;
          tmpCast.details = item.details;
          tmpCast.credits = item.credits;
          //tmpCast.suggestions = item.suggestions;

          vm.comparisonCast.push(tmpCast);
          clearDetails();

          // If Compare has already been run re run with new item
          if(vm.resultsCast.visuals.view){
            compareObjects();
          }
        }
      }
      function addCheck(id){
        if(vm.comparisonCast.length >= 3){ return false;}

        for(var i=0; i < vm.comparisonCast.length; i++){
          if(vm.comparisonCast[i].id == id) {  return false;  }
        }
        return true;
      }

      function getAdditionalSelectedInfo(type){
        if(Object.keys(vm.selectedCast[type]).length == 0) {
          if(type == 'credits') {
            weInfo.search.cast[type](vm.selectedCast.id, function(results){
              vm.selectedCast[type] = results;
              vm.selectedCast.infoview = type
            });
          }
        }
        else {
          vm.selectedCast.infoview = type
        }
      }

      function displayDetails(id){
        weInfo.search.cast.byId(id, function(results){
          vm.selectedCast.id = id;
          vm.selectedCast.details = results;
          vm.selectedCast.details.age = getAge(results.birthday, results.deathday);
          vm.selectedCast.credits = {};
          vm.selectedCast.infoview = 'details';
          vm.selectedCast.display = (results != null);

          weInfo.search.cast.images(id, function(results2){
            if(results2 != null && results2.profiles.length > 0){
              vm.selectedCast.images = "http://image.tmdb.org/t/p/w500"+ results2.profiles[results2.profiles.length-1].file_path;
            }
            else {
              vm.selectedCast.images = "http://image.tmdb.org/t/p/w500"+vm.homeImg;
            }
          });
        });
      }

      function clearDetails(){
        vm.selectedCast.display = false;
        vm.selectedCast.id = -1;
        vm.selectedCast.details = {};
        vm.selectedCast.credits = {};
        vm.selectedCast.infoview = 'details';
      }
      /*Header*/
      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":15, "display":[]};
      vm.allResults = [];

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        displayDetails(item.id);
        clearSearch();
        toggleSearch("close");
      }

      function clearSearch() {
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.cast.byName(query, function(results){
            vm.allResults = results.results;
            vm.displayResults.display = vm.allResults.slice(0, vm.displayResults.max);
          });
        }
      }

      function toggleSearch(control){
        if(control == "open") { vm.searchOpen = true; }
        else if(control == "close") { vm.searchOpen = false; }
        else if(control == "toggle") { vm.searchOpen = !vm.searchOpen; }

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('homeCtrl').controller('HomeController', ['$state','weInfo','$sce', function($state, weInfo, $sce){
      var vm = this;
      vm.title = "Home";

      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":10, "display":[]};
      vm.allResults = [];

      vm.homeImg = "imgs/siteart/Home6.jpg";
      vm.pageCards = [
        {"title": "movie & tv", "class":"movie_tv", "icon":"fa-film", "img":"imgs/siteart/Home7.jpg", "loc":"app.movie_tv","text":"Get details on Movie's and Television shows both new and old.  Also use our comparison machine to find out which cast & crew members have appeared on programs together."},
        {"title": "cast & crew", "class":"cast", "icon":"fa-users", "img":"imgs/siteart/Cast&Crew3.jpg", "loc":"app.cast", "text":"Get information on cast & crew member's content credits.  As well as get the programs that cast & crew have worked on together using our comparision machine."},
        {"title": "spotlight", "class":"spotlight", "icon":"fa-lightbulb-o", "img":"imgs/siteart/Spotlight1.jpg", "loc":"app.spotlight", "text":"Put a spotlight on a movie or tv show by finding out the connections between the cast of your spotlight."}
      ];

      vm.latestBlog = weInfo.blogs.latest();
      // Get Blog info
      vm.blogs = {"all": weInfo.blogs.all(), "displayID":0, "displayObj":{}, "displayFlg":false};
      
      if(vm.blogs.all.length > 0){
        weInfo.blogs.displayData(vm.blogs.all[vm.blogs.displayID].displayIds, function(res){
            vm.blogs.all[vm.blogs.displayID].displayData = res;
            var object = vm.blogs.all[vm.blogs.displayID].displayData[0];
            vm.blogs.displayObj.type = object.info.media_type;
            vm.blogs.displayObj.id = object.info.id;
            vm.blogs.displayObj.img = (object.info.media_type == 'movie' || object.info.media_type == 'tv'? object.info.poster_path : object.info.profile_path);
        });
      }

      /**/
      vm.changeBlogImg = changeBlogImg;
      vm.isBlogImgSelected = isBlogImgSelected;
      vm.selectBlogImg = selectBlogImg;

      function selectBlogImg(obj){
        if(obj.type == 'movie' || obj.type == 'tv')
        {$state.go('app.movie_tv',{id1: obj.id +"-"+obj.type});}
        else if(obj.type == 'person')
        {$state.go('app.cast',{id1: obj.id});}
      }

      function isBlogImgSelected(info){
        return (vm.blogs.displayObj.id == info.id);
      }

      function changeBlogImg(info){
        vm.blogs.displayObj.type = info.media_type;
        vm.blogs.displayObj.id = info.id;
        if(info.media_type == 'person'){
          vm.blogs.displayObj.img = info.profile_path;
        }
        else {
          vm.blogs.displayObj.img = info.poster_path;
        }
      }

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        if(type == 'movie' || type == 'tv')
        {$state.go('app.movie_tv',{id1: item.id +"-"+item.media_type});}
        else if(type == 'cast')
        {$state.go('app.cast',{id1: item.id});}
      }

      function clearSearch() {
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.all(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.results.slice(0, vm.displayResults.max);
          });
        }
      }

      function toggleSearch(control){
        if(control == "open")
        { vm.searchOpen = true; }
        else if(control == "close")
        { vm.searchOpen = false; }
        else if(control == "toggle")
        { vm.searchOpen = !vm.searchOpen; }

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('movieTvCtrl').controller('MovieTvController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "movietv";
      vm.homeImg = "imgs/siteart/Home7.jpg";
      /*Movie Ctrl*/
      var id1 = $stateParams.id1;
      var id2 = $stateParams.id2;
      var id3 = $stateParams.id3;

      vm.selectedMovieTv = {"id":-1,"details":{}, "credits":{}, "suggestions":{}, "display":false, "infoview":"details"};
      vm.comparisonMoviesTv = [];
      vm.resultsMovieTv = {};
      vm.resultsMovieTv.visuals = {};
      vm.resultsMovieTv.visuals.view = false;

      if(id1 != undefined && (id2 == undefined && id3 == undefined)){
        var id1List = id1.split('-');
        displayDetails(id1List[0],id1List[1]);
      }
      /*else if(id1 != undefined && (id2 != undefined || id3 != undefined)){
        var id1List = id1.split('-');
        var id2List = (id2 != undefined ? id2.split('-') : []);
        var id3List = (id3 != undefined ? id3.split('-') : []);

        if(id2List.length  == 2){ }
        if(id3List.length  == 2){ }
      }*/
      /*Set Now Playing*/
      vm.extraContent = {"movies":{}, "tv":{}};

      weInfo.search.movies.nowPlaying(1, function(results){
        vm.extraContent.movies = results;
      });
      weInfo.search.tv.onAir(1, function(results){
        vm.extraContent.tv = results;
      });

      /*Functions*/
      vm.clearDetails = clearDetails;
      vm.displayDetails = displayDetails;
      vm.getAdditionalSelectedInfo = getAdditionalSelectedInfo;
      vm.addCheck = addCheck;
      vm.addItem = addItem;
      vm.compareObjects = compareObjects;
      vm.displayResultsCheck = displayResultsCheck;
      vm.isResultsViewed = isResultsViewed;
      vm.toggleResultViews = toggleResultViews;
      vm.clearCompare = clearCompare;
      vm.removeMovieTv = removeMovieTv;


      function removeMovieTv(id){
        var removePos = -1;
        for(var i=0; i < vm.comparisonMoviesTv.length; i++){
          if(id == vm.comparisonMoviesTv[i].id){
            removePos = i;
            break;
          }
        }
        if(removePos > -1) {vm.comparisonMoviesTv.splice(removePos,1);}
      }

      function clearCompare(){
        vm.comparisonMoviesTv = [];
        vm.resultsMovieTv = {};
        vm.resultsMovieTv.visuals = {};
        vm.resultsMovieTv.visuals.view = false;
      }
      function toggleResultViews(id){
        var pos = -1;
        for(var i =0; i < vm.resultsMovieTv.viewIds.length; i++){
          if(vm.resultsMovieTv.viewIds[i] == id){
            pos = i;
          }
        }
        if((pos < 0) && (vm.resultsMovieTv.viewIds.length < 3)) { vm.resultsMovieTv.viewIds.push(id); }
        else if((pos >= 0) && (vm.resultsMovieTv.viewIds.length > 1)){ vm.resultsMovieTv.viewIds.splice(pos, 1); }
        else { alert("You must keep atleast one Movie or Tv show selected");}
        // Set Visuals
        setVisuals();
      }

      function isResultsViewed(id) {
        for(var i =0; i < vm.resultsMovieTv.viewIds.length; i++){
          if(vm.resultsMovieTv.viewIds[i] == id){
            return true;
          }
        }
        return false;
      }

      function setVisuals() {
        // Cast & Crew
        vm.resultsMovieTv.visuals.castACrew = [];
        for(var i=0; i < vm.resultsMovieTv.results.castACrew.length; i++) {
          if(displayResultsCheck(vm.resultsMovieTv.results.castACrew[i].MTIDS)){  vm.resultsMovieTv.visuals.castACrew.push(vm.resultsMovieTv.results.castACrew[i]);    }
        }
        var colorArrayCast = randomColor({ count: vm.resultsMovieTv.visuals.castACrew.length + 1, luminosity: 'bright', format: 'rgb'});
        for(var i=0; i < vm.resultsMovieTv.visuals.castACrew.length; i++) { vm.resultsMovieTv.visuals.castACrew[i].color = colorArrayCast[i]; }

        vm.resultsMovieTv.visuals.view = true;
      }

      function displayResultsCheck(ids){
        var inAll = true;
        for(var i =0; i < vm.resultsMovieTv.viewIds.length; i++){
          var idActive = false;
          for(var j =0; j < ids.length; j++){
            if(ids[j] == vm.resultsMovieTv.viewIds[i]){idActive = true;  break; }
          }
          if(idActive == false) { inAll = false;  break; }
        }
        return inAll;
      }

      function compareObjects() {
        weInfo.compare.movieTv(vm.comparisonMoviesTv, function(res){
          vm.resultsMovieTv.results = res;
          // Set View Ids
          vm.resultsMovieTv.viewIds = [];
          for(var i=0; i < res.moviestv.length; i++){
            vm.resultsMovieTv.viewIds.push(res.moviestv[i].id);
          }
          // Set Visuals
          setVisuals();
        });
      }

      function addItem(item) {
        if(addCheck(item.id)) {
          var tmpMovieTv = {};
          tmpMovieTv.id = item.id;
          tmpMovieTv.details = item.details;
          tmpMovieTv.credits = item.credits;
          tmpMovieTv.suggestions = item.suggestions;

          vm.comparisonMoviesTv.push(tmpMovieTv);
          clearDetails();

          // If Compare has already been run re run with new item
          if(vm.resultsMovieTv.visuals.view){
            compareObjects();
          }
        }
      }
      function addCheck(id){
        if(vm.comparisonMoviesTv.length >= 3){ return false;}

        for(var i=0; i < vm.comparisonMoviesTv.length; i++){
          if(vm.comparisonMoviesTv[i].id == id) {  return false;  }
        }

        return true;
      }

      function getAdditionalSelectedInfo(type, media_type){
        if(Object.keys(vm.selectedMovieTv[type]).length == 0) {
          if(type == 'credits' || type == 'suggestions') {
            if(media_type == 'movie'){
              weInfo.search.movies[type](vm.selectedMovieTv.id, function(results){
                vm.selectedMovieTv[type] = results;
                vm.selectedMovieTv.infoview = type
              });
            }
            else if(media_type == 'tv'){
              weInfo.search.tv[type](vm.selectedMovieTv.id, function(results){
                vm.selectedMovieTv[type] = results;
                vm.selectedMovieTv.infoview = type
              });
            }
          }
        }
        else {
          vm.selectedMovieTv.infoview = type
        }
      }

      function displayDetails(id, type){
        if(type == "movie"){
          weInfo.search.movies.byId(id, function(results){
            vm.selectedMovieTv.id = id;
            vm.selectedMovieTv.details = results;
            vm.selectedMovieTv.details.type = type;
            vm.selectedMovieTv.credits = {};
            vm.selectedMovieTv.suggestions = {};
            vm.selectedMovieTv.infoview = 'details';
            vm.selectedMovieTv.display = (results != null);

            if(vm.selectedMovieTv.details != null && vm.selectedMovieTv.details.backdrop_path != null){
              vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+vm.selectedMovieTv.details.backdrop_path;
            }
            else {
              vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+vm.homeImg;
            }
          });
        }
        else if(type == "tv"){
          weInfo.search.tv.byId(id, function(results){
            vm.selectedMovieTv.id = id;
            vm.selectedMovieTv.details = results;
            vm.selectedMovieTv.details.type = type;
            vm.selectedMovieTv.credits = {};
            vm.selectedMovieTv.suggestions = {};
            vm.selectedMovieTv.infoview = 'details';
            vm.selectedMovieTv.display = (results != null);
            weInfo.search.tv.images(id, function(results){
              if(results != null && results.backdrops.length > 0){
                vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+results.backdrops[0].file_path;
              }
              else {
                vm.selectedMovieTv.images = "http://image.tmdb.org/t/p/w500"+vm.homeImg;
              }
            });
          });
        }
      }

      function clearDetails(){
        vm.selectedMovieTv.display = false;
        vm.selectedMovieTv.id = -1;
        vm.selectedMovieTv.details = {};
        vm.selectedMovieTv.credits = {};
        vm.selectedMovieTv.suggestions = {};
        vm.selectedMovieTv.infoview = 'details';
      }

      /*Header*/
      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":15, "display":[]};
      vm.allResults = [];

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        displayDetails(item.id, item.media_type);
        clearSearch();
        toggleSearch("close");
      }

      function clearSearch() {
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.movies_Tv.byName(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.slice(0, vm.displayResults.max);
          });
        }
      }

      function toggleSearch(control){
        if(control == "open") { vm.searchOpen = true; }
        else if(control == "close") { vm.searchOpen = false; }
        else if(control == "toggle") { vm.searchOpen = !vm.searchOpen; }

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('spotlightCtrl').controller('SpotlightController', ['$state','$stateParams','weInfo','$sce', function($state, $stateParams, weInfo, $sce){
      var vm = this;
      vm.title = "spotlight";
      vm.defaultImg = "imgs/siteart/Home7.jpg";
      /*Variables*/
      vm.spotlightObject = {};
      vm.spotlightObjects = [];
      vm.spotlightMax = 10;

      vm.defaultItem = {id: 337339, type: "movie"};

      if(vm.spotlightObject.id == undefined){
        displayDetails(vm.defaultItem.id,vm.defaultItem.type);
      }

      /*Spotlight Functions*/
      vm.spotlightSelected = spotlightSelected;
      vm.addItem = addItem;
      vm.displayDetails = displayDetails;

      function displayDetails(id, type){
        vm.spotlightObject = {};
        vm.spotlightObjects = [];
        if(type == "movie"){
          weInfo.search.movies.byId(id, function(results){
            vm.spotlightObject.id = id;
            vm.spotlightObject.details = results;
            vm.spotlightObject.details.type = type;
            vm.spotlightObject.credits = {};
            vm.spotlightObject.suggestions = {};
            vm.spotlightObject.infoview = 'details';
            vm.spotlightObject.display = (results != null);

            if(vm.spotlightObject.details != null && vm.spotlightObject.details.backdrop_path != null){
              vm.spotlightObject.images = "http://image.tmdb.org/t/p/w500"+vm.spotlightObject.details.backdrop_path;
            }
            else {
              vm.spotlightObject.images = "http://image.tmdb.org/t/p/w500"+vm.defaultImg;
            }
            addItem(vm.spotlightObject);
            spotlightSelected();
          });
        }
        else if(type == "tv"){
          weInfo.search.tv.byId(id, function(results){
            vm.spotlightObject.id = id;
            vm.spotlightObject.details = results;
            vm.spotlightObject.details.type = type;
            vm.spotlightObject.credits = {};
            vm.spotlightObject.suggestions = {};
            vm.spotlightObject.infoview = 'details';
            vm.spotlightObject.display = (results != null);

            if(vm.spotlightObject.details != null && vm.spotlightObject.details.backdrop_path != null){
              vm.spotlightObject.images = "http://image.tmdb.org/t/p/w500"+vm.spotlightObject.details.backdrop_path;
            }
            else {
              vm.spotlightObject.images = "http://image.tmdb.org/t/p/w500"+vm.defaultImg;
            }

            addItem(vm.spotlightObject);
            spotlightSelected();
          });
        }
      }

      function addItem(item) {
        var tmpObject = {};
        tmpObject.id = item.id;
        tmpObject.details = item.details;
        tmpObject.credits = item.credits;
        tmpObject.suggestions = item.suggestions;

        vm.spotlightObjects.push(tmpObject);
      }

      function spotlightSelected(){
        var itemid = 0;
        // get data
        weInfo.spotlight.getMovieTv(vm.spotlightObjects, vm.spotlightMax, function(res){
          // perform spotlight & transform results
          weInfo.spotlight.transformMovieTv(res, function(res2){
            // display results using vis.js
            // Display Cast Visuals
            vm.spotlightObject.creditsVisuals = res2.networkResults.nodes
            // Display Network Visuals
            NetworkVisuals(res2.networkResults);
            // Display Chord Visuals
            ChordVisuals(res2.chordResults);
          });
        });
      }

      // Visuals

      //Chord Visuals
      function ChordVisuals(vizData){
        function sort(a,b){ return d3.ascending(vizData.sortOrder.indexOf(a),vizData.sortOrder.indexOf(b)); }
        var calcWidth = document.getElementsByClassName("chord-container")[0].offsetWidth;
        var calcHeight = document.getElementsByClassName("chord-container")[0].offsetHeight;

        var chordRadius = (calcWidth < 500 ? 80 : 250);

        var ch = viz.ch().data(vizData.data)
          .padding(.01)
          .sort(sort)
          .innerRadius(chordRadius - 20)
	        .outerRadius(chordRadius)
	        .duration(1000)
	        .chordOpacity(0.3)
	        .labelPadding(.03)
          .fill(function(d){ return vizData.colors[d];});

        // remove old svg
        d3.select(".chord-container > svg").remove();
        // append new svg
        var svg = d3.select(".chord-container").append("svg");

        svg.append("g").attr("transform", "translate("+(calcWidth/2)+","+(calcHeight/2)+")").call(ch);

        d3.select(self.frameElement).style("height", (calcHeight/2)+"px").style("width", (calcWidth/2)+"px");
      }
      // Network Visuals
      function NetworkVisuals(vizData){
        var network = null;
        var container = document.getElementById('network-container');
        var data = {
          nodes: vizData.nodes,
          edges: vizData.edges
        };
        var options = {
          interaction: {
            keyboard: {
              enabled: false
            },
            zoomView: false
          },
          nodes: {
            borderWidth:4,
            size:30,
    	      color: {
                highlight: {
                  border:'#F19F4D',
                  background:'#F19F4D'
                }
              }
          },
          edges: {
            color: {
              inherit: 'both',
              highlight: '#F19F4D',
              opacity: 0.5
            },
            font: {
              align: 'middle',
              color: "#ffffff",
              strokeWidth:0
            },
            length: 500,
            labelHighlightBold: true,
            selectionWidth: function (width) {return width*10;},
            smooth: {
              type: 'cubicBezier',
              forceDirection : 'horizontal'
            }
          }
        };
        network = new vis.Network(container, data, options);
        network.on("click", function (params) {
          console.log(params);
          //getEdgesInfo();
        });
      }

      function getEdgesInfo(nodeid, edges, nodes){

      }

      /*Header*/
      vm.headerTemplate = "views/templates/_header.html";
      vm.searchOpen = false;
      vm.searchQuery = "";
      vm.displayResults = { "max":15, "display":[]};
      vm.allResults = [];

      /*Functions*/
      vm.toggleSearch = toggleSearch;
      vm.search = search;
      vm.clearSearch = clearSearch;
      vm.itemAction = itemAction;

      function itemAction(item, type) {
        displayDetails(item.id, item.media_type);

        clearSearch();
        toggleSearch("close");
      }

      function clearSearch() {
        vm.searchQuery = "";
        vm.allResults = [];
        vm.displayResults.display = [];
      }

      function search() {
        var query = vm.searchQuery;
        if(query.length > 1){
          weInfo.search.movies_Tv.byName(query, function(results){
            vm.allResults = results;
            vm.displayResults.display = vm.allResults.slice(0, vm.displayResults.max);
          });
        }
      }

      function toggleSearch(control){
        if(control == "open") { vm.searchOpen = true; }
        else if(control == "close") { vm.searchOpen = false; }
        else if(control == "toggle") { vm.searchOpen = !vm.searchOpen; }

        if(vm.searchOpen) {
          var navMain = $("#weNavbar");
          navMain.collapse('hide');
        }
      }

    }]);

})();

(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('weInfo', [ 'WEData', '$filter','movieServices', 'tvServices','castServices', function WEInfo(WEData, $filter, movieServices, tvServices,castServices){
      var blogs = WEData.siteData.blogs;
      /*Needed Function */
      function getAllMovieTvCredits(item, list, callback){
        var objectMT = list[item];
        if(Object.keys(objectMT.credits).length == 0){
          if(objectMT.details.type == 'movie'){
            movieServices.credits(objectMT.id, function(res) {
              list[item].credits = res;
              if((item-1) < 0) {
                callback(list);
              }
              else {
                getAllMovieTvCredits(item-1, list, callback);
              }
            });
          }
          else if(objectMT.details.type == 'tv'){
            tvServices.credits(objectMT.id, function(res) {
              list[item].credits = res;
              if((item-1) < 0) { callback(list); }
              else { getAllMovieTvCredits(item-1, list, callback);}
            });
          }
        }
        else {
          if((item-1) < 0) { callback(list); }
          else { getAllMovieTvCredits(item-1, list, callback);}
        }
      }

      function getAllCastCrewCredits(item, list, callback){
        var objectCC = list[item];
        if(Object.keys(objectCC.credits).length == 0){
          castServices.credits(objectCC.id, function(res) {
            list[item].credits = res;
            if((item-1) < 0) {
              callback(list);
            }
            else {
              getAllCastCrewCredits(item-1, list, callback);
            }
          });
        }
        else {
          if((item-1) < 0) { callback(list); }
          else { getAllCastCrewCredits(item-1, list, callback);}
        }
      }

      function getBlogDisplayData(item, list, callback){
        var object = list[item];
        movieServices.anyItem(object.title, function(res) {
          var objectInfo = $.grep(res.results, function(e){ return e.id == object.id});
          list[item].info = (objectInfo.length > 0 ? objectInfo[0] : null);
          if((item-1) < 0) {
            callback(list);
          }
          else {
            getBlogDisplayData(item-1, list, callback)
          }
        });
      }

      return {
        blogs: {
          all: function(){
            return blogs;
          },
          latest: function() {
            return blogs[blogs.length -1];
          },
          displayData: function(data, callback){
            getBlogDisplayData(data.length-1, data, function(res) {
              callback(res);
            });
          }
        },
        search: {
          all: function(query, callback) {
            movieServices.anyItem(query, function(res) { callback(res); } );
          },
          movies:  {
            byName: function(query, callback) {
              movieServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              movieServices.info(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              movieServices.credits(id, function(res) { callback(res); } );
            },
            suggestions: function(id, callback){
              movieServices.similar(id, function(res) { callback(res); } );
            },
            images: function(id, callback){
              movieServices.images(id, function(res) { callback(res); } );
            },
            nowPlaying: function(page, callback){
                movieServices.now_playing(page, function(res) { callback(res); } );
            }
          },
          tv: {
            byName: function(query, callback){
              tvServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              tvServices.info(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              tvServices.credits(id, function(res) { callback(res); } );
            },
            suggestions: function(id, callback){
              tvServices.similar(id, function(res) { callback(res); } );
            },
            images: function(id, callback){
              tvServices.images(id, function(res) { callback(res); } );
            },
            onAir: function(page, callback){
              tvServices.onAir(page, function(res) { callback(res); } );
            }
          },
          cast: {
            byName: function(query, callback){
              castServices.names(query, function(res) { callback(res); } );
            },
            byId: function(id, callback){
              castServices.details(id, function(res) { callback(res); } );
            },
            credits: function(id, callback){
              castServices.credits(id, function(res) { callback(res); } );
            },
            popular: function(page, callback){
              castServices.popular(page, function(res) { callback(res); } );
            },
            images: function(id, callback){
              castServices.images(id, function(res) { callback(res); } );
            }
          },
          movies_Tv: {
            byName: function(query, callback){
              movieServices.anyItem(query, function(res) {
                var combo = [];
                var results = res.results;
                for(var i =0; i < results.length; i++) {
                  if((results[i].media_type == "movie") || (results[i].media_type == "tv")){
                    combo.push(results[i]);
                  }
                }
                if(combo.length < 15) {
                  // Get 2nd page and add results to combo
                  movieServices.anyItemPage(query, 2, function(res2) {
                    var results2 = res2.results;
                    for(var i =0; i < results2.length; i++) {
                      if(((results2[i].media_type == "movie") || (results2[i].media_type == "tv")) && combo.length < 15){
                        combo.push(results2[i]);
                      }
                      if(combo.length == 15) { break;}
                    }
                    callback(combo);
                  });
                }
                else { callback(combo);}
              });
            }
          }
        },
        compare: {
          movieTv: function(compareList, callback){
            getAllMovieTvCredits(compareList.length-1, compareList, function(res){
              var tmpResults = {"moviestv":[], "cast":[], "crew":[], "castACrew":[]};

              for(var i=0; i < res.length; i++){
                tmpResults.moviestv.push({"id":res[i].id, "title":(res[i].details.type == 'movie'? res[i].details.title : res[i].details.name), "image_path":res[i].details.poster_path, "media_type":res[i].details.type});

                var castCrewList = res[i].credits.cast.concat(res[i].credits.crew);
                // Add Cast & Crew
                for(var j=0; j < castCrewList.length; j++){
                  var added = false;
                  for(var k=0; k < tmpResults.castACrew.length; k++){
                    if(castCrewList[j].id == tmpResults.castACrew[k].id) {
                      tmpResults.castACrew[k].MTIDS.push(res[i].id);
                      added = true;
                      break;
                    }
                  }
                  if(!added) {
                    var tmpCast = {"id":castCrewList[j].id, "name":castCrewList[j].name, "image_path":castCrewList[j].profile_path, "MTIDS":[res[i].id]};
                    tmpResults.castACrew.push(tmpCast);
                  }
                }

              }

              callback(tmpResults);
            });
          },
          cast: function(compareList, callback){
            getAllCastCrewCredits(compareList.length-1, compareList, function(res){
              var tmpResults = {"castcrew":[], "movieATv":[]};

              for(var i=0; i < res.length; i++){
                tmpResults.castcrew.push({"id":res[i].id, "name": res[i].details.name, "image_path":res[i].details.profile_path});

                var movieTvList = res[i].credits.cast.concat(res[i].credits.crew);
                // Add Cast & Crew
                for(var j=0; j < movieTvList.length; j++){
                  var added = false;
                  for(var k=0; k < tmpResults.movieATv.length; k++){
                    if(movieTvList[j].id == tmpResults.movieATv[k].id) {
                      tmpResults.movieATv[k].CCIDS.push(res[i].id);
                      added = true;
                      break;
                    }
                  }
                  if(!added) {
                    var tmpCast = {"id":movieTvList[j].id, "title":(movieTvList[j].media_type == 'movie' ? movieTvList[j].title : movieTvList[j].name), "image_path":movieTvList[j].poster_path, "CCIDS":[res[i].id]};
                    tmpResults.movieATv.push(tmpCast);
                  }
                }

              }

              callback(tmpResults);
            });
          }
        },
        spotlight: {
          getMovieTv: function(spotlightMovies, spotlightLength, callback){
            getAllMovieTvCredits(spotlightMovies.length-1, spotlightMovies, function(res){
              var tmpResults = {"info":{}, "castACrew":[], "connections":[]};

              var i = 0;
              tmpResults.info = {"id":res[i].id, "title":(res[i].details.type == 'movie'? res[i].details.title : res[i].details.name), "image_path":res[i].details.poster_path, "media_type":res[i].details.type};

              var castCrewList = res[i].credits.cast.concat(res[i].credits.crew);
              // Add Cast & Crew
              for(var j=0; j < castCrewList.length; j++){
                var castCheck = $.grep(tmpResults.castACrew, function(e){ return e.id == castCrewList[j].id});
                if(tmpResults.castACrew.length < spotlightLength && castCheck.length == 0) {
                  var tmpCast = {"id":castCrewList[j].id, "name":castCrewList[j].name, "image_path":castCrewList[j].profile_path, "credits":[]};
                  tmpResults.castACrew.push(tmpCast);
                }
              }

              // Get Cast Credits
              getAllCastCrewCredits(tmpResults.castACrew.length-1, tmpResults.castACrew, function(res){

                // Build connections List
                for(var k=0; k < tmpResults.castACrew.length; k++){
                  tmpResults.castACrew[k].fullcredits = tmpResults.castACrew[k].credits.cast.concat(tmpResults.castACrew[k].credits.crew);
                  for(var l=k+1; l < tmpResults.castACrew.length; l++){
                    tmpResults.castACrew[l].fullcredits = tmpResults.castACrew[l].credits.cast.concat(tmpResults.castACrew[l].credits.crew);
                    for(var m=0; m < tmpResults.castACrew[k].fullcredits.length; m++) {
                      var credit1 = tmpResults.castACrew[k].fullcredits[m];
                      var credit2List = tmpResults.castACrew[l].fullcredits;

                      var credit2Results = $.grep(credit2List, function(e){ return e.id == credit1.id});
                      if(credit2Results.length > 0 && credit2Results[0].id != spotlightMovies[0].id){
                        tmpResults.connections.push({"title":(credit1.media_type == 'movie' ? credit1.title : credit1.name), "id":credit1.id, "cast1":{"name":tmpResults.castACrew[k].name, "id":tmpResults.castACrew[k].id}, "cast2":{"name":tmpResults.castACrew[l].name, "id":tmpResults.castACrew[l].id}})
                      }
                    }
                  }
                }
                callback(tmpResults);
              });
            });
          },
          transformMovieTv: function(data, callback){
            var results = {"chordResults":{"sortOrder":[], "colors":{}, "data":[]}, "networkResults":{"nodes":[], "edges":[]}};
            var colorArrayCast = randomColor({ count: data.castACrew.length + 1, luminosity: 'bright', format: 'hex'});

            // transform Chord Results
            for(var i =0; i < data.castACrew.length; i++){
              results.chordResults.sortOrder.push(data.castACrew[i].name);
              results.chordResults.colors[data.castACrew[i].name] = colorArrayCast[i];
            }
            for(var i =0; i < data.connections.length; i++){
              var tmpConn = data.connections[i];
              var tmpData = [tmpConn.cast1.name, tmpConn.cast2.name, 1];
              var tmpData2 = [tmpConn.cast2.name, tmpConn.cast1.name, 1];

              results.chordResults.data.push(tmpData);
              results.chordResults.data.push(tmpData2);
            }

            // transform network Results
            for(var j =0; j < data.castACrew.length; j++){
              var tmpNode = {"id":data.castACrew[j].id, "shape":'circularImage',"image":(data.castACrew[j].image_path != null ? 'https://image.tmdb.org/t/p/w132_and_h132_bestv2'+data.castACrew[j].image_path : null), "label": data.castACrew[j].name, "color":{border:colorArrayCast[j]}, "font": { color:'#ffffff', strokeWidth: 2, strokeColor: colorArrayCast[j] }}
              results.networkResults.nodes.push(tmpNode);
            }
            for(var j =0; j < data.connections.length; j++){
              var tmpConn = data.connections[j];

              // Check if Connection exists
              var connectionCheck = $.grep(results.networkResults.edges, function(e){ return (((e.from == tmpConn.cast1.id) && (e.to == tmpConn.cast2.id)) || ((e.to == tmpConn.cast1.id) && (e.from == tmpConn.cast2.id)))});

              if(connectionCheck.length == 0){
                var tmpData = {"from":tmpConn.cast1.id, "to":tmpConn.cast2.id, "label":tmpConn.title};
                results.networkResults.edges.push(tmpData);
              }
            }
            callback(results);
          }
        }
      }
    }])
    .factory("WEData", ['$q', '$http', function($q, $http){
     function WeInfoData() {
       var vm = this;
       vm.siteData = {
         blogs: [{"title":"From The Wild To The West", "displayIds":[{"type":"movie", "id":258489, "title":"The Legend of Tarzan"},{"type":"person", "id":2231, "title":"Samuel L. Jackson"}, {"type":"person", "id":27319, "title":"Christoph Waltz"},{"type":"movie", "id":16869, "title":"Inglourious Basterds"}, {"type":"person", "id":287, "title":"Brad Pitt"}, {"type":"movie", "id":68718, "title":"Django Unchained"}, {"type":"person", "id":234352, "title":"Margot Robbie"}], "text":"Whose headed to purchase @legendoftarzan available on blu-Ray and DVD TODAY!!! We wanted to find a #wedbconnection and we found one with one of our all time favorite actors @samuelljackson and co-star #ChristophWaltz This will be third time the pair have joined eachother for a big screen production! First in 2009 when Sam narrated for the film #IngloriousBasterds starring #BradPitt then again when the both graced the screen in the unique #QuentinTarantino film #DjangoUnchained starring the multitalented @iamjamiefoxx to their most recent action film to hit theaters @legendoftarzan a definite must see starring another one of our favorite actresses @margotrobbie as Jane and #AlexanderSkarsgard as Tarzan! With his incredible range and amazingly diverse talents we can't wait to see what @samuelljackson will do next! #SamuelLJackson #ChristophWaltz #MargotRobbie #AlexanderSkarsgard #JamieFoxx #BradPitt #IngloriousBasterds #DjangoUnchained #LegendOfTarzan #wedbconnection"}]
       };
     }

     return new WeInfoData();
    }]);

})();

(function(){

  angular
    .module('config')
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
      .state('app', {
        url: "/",
        views: {
          'content':{
            templateUrl: 'views/home.html',
            controller: 'HomeController as sc'
          },
          'footer':{
            templateUrl: 'views/templates/_footer.html'
          }
        }
      })
      .state('app.movie_tv', {
        url: "movie_tv?id1&id2&id3",
        views: {
          'content@': {
            templateUrl: 'views/movie_tv.html',
            controller: 'MovieTvController as sc'
          }
        }
      })
      .state('app.cast', {
        url: "cast?id1&id2&id3",
        views: {
          'content@': {
            templateUrl: 'views/cast.html',
            controller: 'CastController as sc'
          }
        }
      })
      .state('app.spotlight', {
        url: "spotlight?id",
        views: {
          'content@': {
            templateUrl: 'views/spotlight.html',
            controller: 'SpotlightController as sc'
          }
        }
      })
      .state('app.admin', {
        url: "admin",
        views: {
          'content@': {
            templateUrl: 'views/admin.html',
            controller: 'AdminController as sc'
          }
        }
      })
      .state('app.construction', {
        url: "underconstruction",
        views: {
          'content@': {
            templateUrl: 'views/construction.html',
            controller: 'HomeController as sc'
          }
        }
      });



      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
    }]);


})();

(function(){
  'use strict';

  angular
    .module('config')
    .factory('api', function(){
      var baseurl = "https://api.themoviedb.org/3/";
      var apikey = "8af02f398b3ff990bab4f71c247c640a";

      return {
        any: {
          all: function(query){
            return baseurl + "search/multi?api_key="+apikey+"&query="+query;
          },
          page: function(query, page){
            return baseurl + "search/multi?page="+page+"&api_key="+apikey+"&query="+query;
          }
        },
         movie: {
             searchname: function(query){
                 return baseurl + "search/movie?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/movie?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getMovieCredits: function(id) {
                 return baseurl + "movie/"+id+"/credits?api_key="+apikey;
             },
             getMovieInfo: function(id) {
                 return baseurl + "movie/"+id+"?api_key="+apikey;
             },
             getSimilarMovies: function(id) {
               return baseurl + "movie/"+id+"/similar?api_key="+apikey;
             },
             getNowPlaying: function(page) {
               return baseurl + "movie/now_playing?page="+page+"&api_key="+apikey;
             },
             getPopular: function(page) {
               return baseurl + "movie/popular?page="+page+"&api_key="+apikey;
             },
             getImages: function(id){
               return baseurl + "movie/"+id+"/images?api_key="+apikey;
             }
         },
         cast: {
             searchname: function(query) {
                 return  baseurl + "search/person?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/person?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getCombinedCredits: function(id) {
                 return baseurl + "person/"+id+"/combined_credits?api_key="+apikey;
             },
             getCastDetails: function(id) {
                 return baseurl + "person/"+id+"?api_key="+apikey;
             },
             getPopular: function(page) {
                 return baseurl + "person/popular?page="+page+"&api_key="+apikey;
             },
             getImages: function(id){
               return baseurl + "person/"+id+"/images?api_key="+apikey;
             }
         },
         tv: {
             searchname: function(query){
                 return baseurl + "search/tv?api_key="+apikey+"&query="+query;
             },
             searchName_Page: function(query, page){
                 return baseurl + "search/tv?api_key="+apikey+"&page="+ page +"&query="+query;
             },
             getTvCredits: function(id) {
                 return baseurl + "tv/"+id+"/credits?api_key="+apikey;
             },
             getTvInfo: function(id) {
                 return baseurl + "tv/"+id+"?api_key="+apikey;
             },
             getSimilarTv: function(id) {
               return baseurl + "tv/"+id+"/similar?api_key="+apikey;
             },
             getImages: function(id) {
               return baseurl + "tv/"+id+"/images?api_key="+apikey;
             },
             getOnAir: function(page) {
               return baseurl + "tv/on_the_air?page="+page+"&api_key="+apikey;
             }
         }
      }
    });

})();

(function(){
   "use strict";

   angular.module('services')
    .service('castServices', ['$http','api', function CastService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.cast.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.cast.getCombinedCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        details: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.cast.getCastDetails($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        popular: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.cast.getPopular($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        images: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.cast.getImages($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();

(function(){
   "use strict";

   angular.module('services')
    .service('movieServices', ['$http','api', function MovieService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.movie.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getMovieCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getSimilarMovies($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        images: function($mid, callback){
          $http({
            method: 'GET',
            url: api.movie.getImages($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.movie.getMovieInfo($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        now_playing: function($pg,callback) {
          $http({
            method: 'GET',
            url: api.movie.getNowPlaying($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        anyItem: function($str, callback) {
          $http({
            method: 'GET',
            url: api.any.all($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        anyItemPage: function($str, $page, callback) {
          $http({
            method: 'GET',
            url: api.any.page($str, $page)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();

(function(){
   "use strict";

   angular.module('services')
    .service('tvServices', ['$http','api', function TvService($http, api) {
      return {
        names: function($str, callback){
          $http({
            method: 'GET',
            url: api.tv.searchname($str)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        credits: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getTvCredits($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        similar: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getSimilarTv($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        images: function($mid, callback){
          $http({
            method: 'GET',
            url: api.tv.getImages($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        info: function($mid, callback) {
          $http({
            method: 'GET',
            url: api.tv.getTvInfo($mid)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        },
        onAir: function($pg, callback) {
          $http({
            method: 'GET',
            url: api.tv.getOnAir($pg)
          }).success(function (response) {
            callback(response);
          }).error(function(response){
            callback(response);
          });
        }
      }
    }]);

})();
