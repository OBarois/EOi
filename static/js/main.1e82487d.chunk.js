(this.webpackJsonpeoi=this.webpackJsonpeoi||[]).push([[0],{115:function(e,t,n){},130:function(e,t,n){},131:function(e,t,n){},135:function(e,t,n){},136:function(e,t,n){},137:function(e,t,n){},138:function(e,t,n){},139:function(e,t,n){},248:function(e,t,n){},249:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(101),o=n.n(c),i=(n(115),n(5)),s=n(7),l=(n(130),n(6)),u=(n(131),n(39)),b=n.n(u),d=n(102),g=n(19),j=n(4),f=n.n(j),h=n(28),m=n.n(h),O=f.a.Position,p=new(0,f.a.RenderableLayer)("Model");fetch("./data/sentinel1/s1.json").then((function(e){return e.json()})).then((function(e){p.addRenderable(new m.a.Model(e,{rotations:{x:0,y:0,z:0,headingAxis:[0,0,1],headingAdd:-90,headingMultiply:1},preRotations:{x:0,y:0,z:0},scale:5e5,translations:{x:-.1,y:-.1,z:0},ignoreLocalTransforms:!0},new O(51,14,1e5)))}));var v=p,w=[{service:"https://tiles.maps.eox.at/wms",layerNames:"s2cloudless-2018",title:"s2cloudless-2018",numLevels:19,format:"image/png",size:256,sector:f.a.Sector.FULL_SPHERE,levelZeroDelta:new f.a.Location(90,90)},{service:"https://tiles.esa.maps.eox.at/wms",layerNames:"s2cloudless-2018",title:"s2cloudless-2018 esa",numLevels:19,format:"image/png",size:256,sector:f.a.Sector.FULL_SPHERE,levelZeroDelta:new f.a.Location(90,90)},{service:"https://tiles.esa.maps.eox.at/wms",layerNames:"osm",title:"osm",numLevels:19,format:"image/png",size:256,sector:f.a.Sector.FULL_SPHERE,levelZeroDelta:new f.a.Location(90,90)},{service:"https://tiles.esa.maps.eox.at/wms",layerNames:"terrain-light",title:"terrain-light",numLevels:19,format:"image/png",size:256,sector:f.a.Sector.FULL_SPHERE,levelZeroDelta:new f.a.Location(90,90)},{service:"https://tiles.maps.eox.at/wms",layerNames:"terrain",title:"terrain",numLevels:19,format:"image/png",size:256,sector:f.a.Sector.FULL_SPHERE,levelZeroDelta:new f.a.Location(90,90)}],S=[{service:"https://tiles.maps.eox.at/wms",layerNames:"hydrography",title:"hydrography",numLevels:19,format:"image/png",size:256,sector:f.a.Sector.FULL_SPHERE,levelZeroDelta:new f.a.Location(90,90)},{service:"https://tiles.maps.eox.at/wms",layerNames:"overlay_bright",title:"overlay_bright",numLevels:19,format:"image/png",size:256,sector:f.a.Sector.FULL_SPHERE,levelZeroDelta:new f.a.Location(90,90)}];function y(e){var t=e.id,n=e.clon,r=e.clat,c=e.alt,o=e.starfield,s=e.atmosphere,u=e.background,j=e.overlay,h=e.names,O=e.satellites,p=e.dem,y=Object(a.useRef)(null),C=Object(a.useState)("3D"),x=Object(i.a)(C,2),T=(x[0],x[1]),M=Object(a.useState)(""),E=Object(i.a)(M,2),k=(E[0],E[1],Object(a.useState)([])),D=Object(i.a)(k,2),N=D[0],L=D[1],P=Object(a.useState)([]),_=Object(i.a)(P,2),R=(_[0],_[1],Object(a.useState)({latitude:r,longitude:n,altitude:c,aoi:"",pickedItems:[]})),F=Object(i.a)(R,2),A=F[0],U=F[1],B=Object(a.useRef)(p),H=Object(a.useRef)(0),z=Object(a.useRef)(0);Object(a.useRef)(0),Object(a.useRef)(0);function I(){var e=y.current,t=e.navigator.heading/-20;setTimeout((function n(){Math.abs(e.navigator.heading)>Math.abs(t)?(e.navigator.heading+=t,setTimeout(n,10)):e.navigator.heading=0,e.redraw()}),10)}function W(e){console.log("toggleAtmosphere: "+e),K("Atmosphere").enabled=null!=e?e:!K("Atmosphere").enabled,y.current.redraw()}function G(e){console.log("toggleModel: "+e),K("Model").enabled=null!=e?e:!K("Model").enabled,y.current.redraw()}function q(e){console.log("toggleStarfield: "+e),K("StarField").enabled=null!=e?e:!K("StarField").enabled,y.current.redraw()}function V(e){console.log("toggleNames: "+e),K("overlay_bright").enabled=null!=e?e:!K("overlay_bright").enabled,y.current.redraw()}function Y(e){y.current.layers[H.current].enabled=!1,H.current=null===e?H.current+1:(e-1)%w.length,console.log("Background Layer ["+(H.current+1)+"/"+w.length+"]: "+y.current.layers[H.current].displayName),y.current.layers[H.current].enabled=!0,y.current.redraw()}function J(e){console.log(e),y.current.layers[z.current+w.length].enabled=!1,z.current=null===e?z.current+1:(e-1)%S.length,console.log(z.current),y.current.layers[z.current+w.length].enabled=!0,y.current.redraw()}function Z(e){var t;console.log("Copernicus Dem: "+e),B.current?(console.log("Switching to NASA Dem"),t=new f.a.EarthElevationModel):(console.log("Switching to Copernicus Dem"),(t=new f.a.ElevationModel).addCoverage(new f.a.TiledElevationCoverage({coverageSector:f.a.Sector.FULL_SPHERE,resolution:.008333333333333,retrievalImageFormat:"image/tiff",minElevation:-11e3,maxElevation:8850,urlBuilder:new f.a.WcsTileUrlBuilder("https://dem.esa.maps.eox.at/elevation","copdem","2.0.1")}))),y.current.globe.elevationModel=t,y.current.redraw(),B.current=!B.current}function K(e){for(var t=0;t<y.current.layers.length;t++)if(y.current.layers[t].displayName===e)return y.current.layers[t];return null}function Q(e){return X.apply(this,arguments)}function X(){return(X=Object(d.a)(b.a.mark((function e(t){var n,a,r,c,o;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(108e5,n=0;n<y.current.layers.length;n++){if(y.current.layers[n].displayName.includes("Products:"))for(a=0;a<y.current.layers[n].renderables.length;a++)r=y.current.layers[n].renderables[a],0!=t?(c=new Date(r.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStartTime).getTime(),o=new Date(r.userProperties.earthObservation.acquisitionInformation[0].acquisitionParameter.acquisitionStopTime).getTime(),r.enabled=c<=t+54e5&&o>=t-54e5):r.enabled=!1;y.current.layers[n].displayName}case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(e,t,n){setTimeout((function(){y.current.goToAnimator.travelTime=1e3,y.current.goTo(new f.a.Position(e,t,n)),y.current.redraw()}),2e3)}var ee=function(){var e=y.current.navigator.lookAtLocation.longitude,t=y.current.navigator.lookAtLocation.latitude,n=y.current.navigator.range,a=n<2e6?function(){var e,t,n=y.current.viewport,a="";try{(e=y.current.pickTerrain(y.current.canvasCoordinates(n.x,n.y+n.height)).terrainObject().position).latitude=Math.round(1e4*e.latitude)/1e4,e.longitude=Math.round(1e4*e.longitude)/1e4}catch(r){e=null}try{(t=y.current.pickTerrain(y.current.canvasCoordinates(n.x+n.width,n.y)).terrainObject().position).latitude=Math.round(1e4*t.latitude)/1e4,t.longitude=Math.round(1e4*t.longitude)/1e4}catch(r){t=null}return null==e||null==t?a="":(e.longitude,e.latitude,t.longitude,t.latitude,a="POLYGON(("+e.longitude+" "+e.latitude+","+t.longitude+" "+e.latitude+","+t.longitude+" "+t.latitude+","+e.longitude+" "+t.latitude+","+e.longitude+" "+e.latitude+"))"),a}():"";U((function(r){return Object(l.a)(Object(l.a)({},r),{},{longitude:e,latitude:t,altitude:n,viewpolygon:a})}))},te=function(e){console.log("double click"),I()};return Object(a.useEffect)((function(){console.log("Creating the world...");var e=new f.a.ElevationModel;e.removeAllCoverages(),e.addCoverage(new f.a.TiledElevationCoverage({coverageSector:f.a.Sector.FULL_SPHERE,resolution:.008333333333333,retrievalImageFormat:"image/tiff",minElevation:-11e3,maxElevation:8850,urlBuilder:new f.a.WcsTileUrlBuilder("https://dem.esa.maps.eox.at/elevation","copdem","2.0.1")})),y.current=new f.a.WorldWindow(t),y.current.redrawCallbacks.push(ee),f.a.BasicWorldWindowController.prototype.applyLimits=function(){y.current.navigator.range=f.a.WWMath.clamp(y.current.navigator.range,2e3,3e8)};var a=new f.a.ClickRecognizer(y.current,te);a.numberOfClicks=2,a.maxClickInterval=200,y.current.worldWindowController.clickDownRecognizer.recognizeSimultaneouslyWith(a);var i=new f.a.TapRecognizer(y.current,te);i.numberOfTaps=2,i.name="double tap",y.current.worldWindowController.tapDownRecognizer.recognizeSimultaneouslyWith(i),f.a.configuration.baseUrl=f.a.configuration.baseUrl.slice(0,-3);for(var l=new m.a.StarFieldLayer,u=new f.a.AtmosphereLayer("images/BlackMarble_2016_01deg.jpg"),b=new f.a.RenderableLayer("Quicklooks"),d=[{layer:l,enabled:o},{layer:u,enabled:s},{layer:b,enabled:!0},{layer:v,enabled:O}],g=0;g<w.length;g++){var j=new f.a.WmsLayer(w[g],"");j.enabled=!1,y.current.addLayer(j,"")}for(var h=0;h<S.length;h++){var p=new f.a.WmsLayer(S[h],"");p.enabled=!1,y.current.addLayer(p,"")}for(var C=0;C<d.length;C++)d[C].layer.enabled=d[C].enabled,y.current.addLayer(d[C].layer);console.log(y.current.layers),l.time=new Date,u.time=new Date,$(r,n,c),y.current.redraw(),y.current.deepPicking=!0}),[]),Object(a.useEffect)((function(){Y(u)}),[u]),Object(a.useEffect)((function(){J(j)}),[j]),Object(a.useEffect)((function(){V(h)}),[h]),Object(a.useEffect)((function(){W(s)}),[s]),Object(a.useEffect)((function(){q(o)}),[o]),Object(a.useEffect)((function(){G(O)}),[O]),Object(a.useEffect)((function(){Z(p)}),[p]),{ewwstate:A,moveTo:$,removeGeojson:function(){for(var e=0;e<N.length;e++)y.current.removeLayer(N[e]);L((function(e){return[]})),y.current.redraw()},addGeojson:function(e,t){var n=new f.a.RenderableLayer("Products: "+e.properties.updated+Math.ceil(1e4*Math.random()));y.current.addLayer(n),new f.a.GeoJSONParser(e).load((function(){console.log(n),L((function(e){return[].concat(Object(g.a)(e),[n])})),Q(t),y.current.redraw()}),(function(e,t){var n={};n.userProperties=t;var a=new f.a.PlacemarkAttributes(null);return a.imageScale=10,a.imageColor=new f.a.Color(0,1,1,.2),a.labelAttributes.offset=new f.a.Offset(f.a.OFFSET_FRACTION,5,f.a.OFFSET_FRACTION,5),e.isPointType()||e.isMultiPointType()?n.attributes=new f.a.PlacemarkAttributes(a):e.isLineStringType()||e.isMultiLineStringType()?(n.attributes.drawOutline=!0,n.attributes.outlineColor=new f.a.Color(.1*n.attributes.interiorColor.red,.3*n.attributes.interiorColor.green,.7*n.attributes.interiorColor.blue,1),n.attributes.outlineWidth=1):(e.isPolygonType()||e.isMultiPolygonType())&&(n.attributes=new f.a.ShapeAttributes(null),n.attributes.interiorColor=new f.a.Color(1,0,0,.2),n.attributes.outlineColor=new f.a.Color(1,0,0,.3),n.highlightAttributes=new f.a.ShapeAttributes(n.attributes),n.highlightAttributes.outlineColor=new f.a.Color(1,0,0,.4),n.highlightAttributes.interiorColor=new f.a.Color(1,0,0,0)),n}),n)},addWMS:function(){},toggleStarfield:q,toggleAtmosphere:W,setTime:function(e){K("StarField").time=K("Atmosphere").time=new Date(e),Q(e),y.current.redraw()},toggleProjection:function(){T((function(e){console.log("prevProjection: "+e);var t=["3D","Equirectangular","Mercator"],n=(t.indexOf(e)+1)%t.length;switch(console.log("newProjection: "+t[n]),t[n]){case"3D":y.current.globe.projection=new f.a.ProjectionWgs84;break;case"Equirectangular":y.current.globe.projection=new f.a.ProjectionEquirectangular;break;case"Mercator":y.current.globe.projection=new f.a.ProjectionMercator;break;case"North Polar":y.current.globe.projection=new f.a.ProjectionPolarEquidistant("North");break;case"South Polar":y.current.globe.projection=new f.a.ProjectionPolarEquidistant("South");break;default:y.current.globe.projection=new f.a.ProjectionWgs84}return y.current.redraw(),t[n]}))},toggleNames:V,toggleModel:G,toggleBg:Y,toggleOv:J,toggleDem:Z,northUp:I}}var C=n(8),x=n(3);var T=function(e){var t=e.id,n=e.alt,a=Object(s.useGlobal)("mapSettings"),r=Object(i.a)(a,2),c=r[0],o=r[1],u=Object(s.useGlobal)("position"),b=Object(i.a)(u,2),d=b[0],g=(b[1],Object(s.useGlobal)("viewDate")),j=Object(i.a)(g,2),f=j[0],h=(j[1],Object(s.useGlobal)("satellites")),m=Object(i.a)(h,2),O=m[0],p=m[1],v=Object(s.useState)(c),w=Object(i.a)(v,2),S=w[0],T=w[1],M=Object(s.useState)(O),E=Object(i.a)(M,2),k=E[0],D=E[1],N=y({id:t,clat:d.clat,clon:d.clon,alt:n,starfield:c.starfield,atmosphere:c.atmosphere,background:c.background,overlay:c.overlay,satellites:O,names:c.names,dem:c.dem}),L=(N.ewwstate,N.moveTo,N.addGeojson,N.removeGeojson),P=(N.addWMS,N.toggleProjection),_=(N.toggleOv,N.toggleModel,N.setTime),R=(N.toggleDem,N.northUp);return Object(C.a)("p",P),Object(C.a)("c",L),Object(C.a)("u",R),Object(C.a)("b",(function(){return T((function(e){return Object(l.a)(Object(l.a)({},e),{},{background:e.background+1})}))})),Object(C.a)("m",(function(){return D((function(e){return!e}))})),Object(C.a)("d",(function(){return T((function(e){return Object(l.a)(Object(l.a)({},e),{},{dem:!e.dem})}))})),Object(C.a)("o",(function(){return T((function(e){return Object(l.a)(Object(l.a)({},e),{},{overlay:e.overlay+1})}))})),Object(C.a)("a",(function(){return T((function(e){return Object(l.a)(Object(l.a)({},e),{},{atmosphere:!e.atmosphere})}))})),Object(C.a)("s",(function(){return T((function(e){return Object(l.a)(Object(l.a)({},e),{},{starfield:!e.starfield})}))})),Object(C.a)("n",(function(){return T((function(e){return Object(l.a)(Object(l.a)({},e),{},{names:!e.names})}))})),Object(s.useEffect)((function(){_(f.getTime())}),[f]),Object(s.useEffect)((function(){o(S)}),[S]),Object(s.useEffect)((function(){T(c)}),[c]),Object(s.useEffect)((function(){p(k)}),[k]),Object(s.useEffect)((function(){D(O)}),[O]),Object(x.jsx)("canvas",{id:t,style:{background:"black",position:"fixed",left:0,width:"100%",height:"100%"}})},M=n(23),E=n.n(M);n(135);var k=function(e){var t=e.date,n=e.highlight;return e.animated,Object(x.jsxs)("div",{className:"LabelContainer",children:[Object(x.jsx)("hi",{className:"year"===n?"Highlighted":"",children:t.getUTCFullYear()}),"-",Object(x.jsx)("hi",{className:"month"===n?"Highlighted":"",children:E()(t,"UTC:mmm").toUpperCase()}),"-",Object(x.jsx)("hi",{className:"day"===n?"Highlighted":"",children:E()(t,"UTC:dd")}),"\xa0/\xa0",Object(x.jsx)("hi",{className:"hour"===n?"Highlighted":"",children:E()(t,"UTC:HH")}),":",Object(x.jsx)("hi",{className:"minute"===n?"Highlighted":"",children:E()(t,"UTC:MM")}),":",Object(x.jsx)("hi",{className:"second"===n?"Highlighted":"",children:E()(t,"UTC:ss")})]})};function D(e){var t=e.autoStart,n=e.initdate,r=Object(a.useState)(n),c=Object(i.a)(r,2),o=c[0],s=c[1],l=Object(a.useRef)(),u=Object(a.useRef)(),b=Object(a.useRef)();b.current=200;var d=Object(a.useRef)(),g=Object(a.useRef)(),j=Object(a.useRef)();function f(){console.log("start clock"),u.current||(u.current=b.current),l.current||(g.current=setInterval((function(){d.current+=u.current,s(new Date(d.current))}),b.current)),l.current=!0}return Object(a.useEffect)((function(){console.log("init start useclock "+n.toJSON()),d.current=n.getTime()}),[n]),Object(a.useEffect)((function(){console.log("render useclock"),d.current=(new Date).getTime(),t&&f()}),[t]),{date:o,playing:l,togglePause:function(){l.current?function(){console.log("stop clock"),j.current&&clearTimeout(j.current);g.current&&clearInterval(g.current);l.current=!1}():f()},reset:function(){d.current=(new Date).getTime(),s(new Date(d.current))},increaseSpeed:function(){u.current=u.current>0?u.current*=2:u.current/=2,Math.abs(u.current)<b.current&&(u.current=b.current),console.log("step: "+u.current)},decreaseSpeed:function(){u.current=u.current>0?u.current/=2:u.current*=2,Math.abs(u.current)<b.current&&(u.current=-1*b.current),console.log("step: "+u.current)},forceDate:function(e){console.log("forcedate useclock: "+e.toJSON()),d.current=e.getTime()}}}n(136);var N=function(e){var t=e.startdate,n=e.onDateChange,r=D({autoStart:!1,initdate:t}),c=r.date,o=r.togglePause,s=r.reset,l=r.increaseSpeed,u=r.decreaseSpeed;Object(C.a)("t",o),Object(C.a)("r",(function(){s()})),Object(C.a)(".",l),Object(C.a)(",",u),Object(a.useEffect)((function(){n(c)}),[c]);var b=Object(a.useState)(),d=Object(i.a)(b,2),g=d[0],j=d[1];return Object(x.jsx)("div",{className:"DateController",onClick:function(){var e=Date.now();g&&e-g<400?s():(j(e),o())}})},L=n(11),P=n(40),_=n(103);n(74);var R=function(e){var t=e.date,n=e.zoomfactor,r=e.step,c=Object(a.useRef)(),o=Object(a.useState)(1),s=Object(i.a)(o,2),l=s[0],u=(s[1],Object(a.useState)(!1)),b=Object(i.a)(u,2),d=(b[0],b[1],Object(a.useState)("")),g=Object(i.a)(d,2),j=g[0],f=g[1];return Object(a.useEffect)((function(){return function(){}})),Object(a.useLayoutEffect)((function(){f(function(e,t){if(c.current){for(var n,a,r,o,i=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],s=0,u=0,b=0,d=0,g=0,j=0,f=[],h=0;h<c.current.offsetHeight;h+=1){var m=new Date((h-c.current.offsetHeight/2)*t+e.getTime());switch(n=m.getUTCDate(),a=m.getUTCMonth(),r=m.getUTCHours(),o=m.getUTCFullYear(),s=m.getUTCMinutes(),!0){case t<2e3:s!==j&&(0!==s||0!==r?f.push({class:"HourTic",pos:h,label:O(r,2)+":"+O(s,2)}):0===s&&0===r&&(f.push({class:"DayTic_h",pos:h,label:O(n,2)}),f.push({class:"MonthTic_h2",pos:h,label:i[a]})));break;case t<4e4:s!==j&&(0===s&&0==r||s%10!==0?0===s&&0===r&&(f.push({class:"DayTic_h",pos:h,label:O(n,2)}),f.push({class:"MonthTic_h2",pos:h,label:i[a]})):f.push({class:"HourTic",pos:h,label:O(r,2)+":"+O(s,2)}));break;case t<18e4:r!==g&&(0!==r?f.push({class:"HourTic",pos:h,label:O(r,2)+":00"}):(f.push({class:"DayTic_h",pos:h,label:O(n,2)}),f.push({class:"MonthTic_h2",pos:h,label:i[a]})));break;case t<42e4:r!==g&&(0!==r&&r%3===0?f.push({class:"HourTic",pos:h,label:O(r,2)+":00"}):0===r&&(f.push({class:"DayTic_h",pos:h,label:O(n,2)}),f.push({class:"MonthTic_h2",pos:h,label:i[a]})));break;case t<42e5:n!==u&&(1!==n?f.push({class:"DayTic",pos:h,label:n}):(f.push({class:"MonthTic_h",pos:h,label:i[a]}),0===a&&f.push({class:"YearTic_h2",pos:h,label:o})));break;case t<288e5:n!==u&&(1!==n&&30!==n&&n%5===0?f.push({class:"DayTic",pos:h,label:n}):1==n&&(f.push({class:"MonthTic_h",pos:h,label:i[a]}),0===a&&f.push({class:"YearTic_h2",pos:h,label:o})));break;case t<1728e5:a!==b&&(0!==a?f.push({class:"MonthTic",pos:h,label:i[a]}):(f.push({class:"MonthTic_h",pos:h,label:i[a]}),f.push({class:"YearTic_h2",pos:h,label:o})));break;case t<3456e5:a!==b&&(0!==a&&11!==a&&a%3===0?f.push({class:"MonthTic",pos:h,label:i[a]}):0==a&&(f.push({class:"MonthTic_h",pos:h,label:i[a]}),f.push({class:"YearTic_h2",pos:h,label:o})));break;case t<7776e6:o!==d&&(0!==a?f.push({class:"MonthTic",pos:h,label:i[a]}):f.push({class:"YearTic",pos:h,label:o}))}u=n,d=o,b=a,g=r,j=s}return f.map((function(e){return Object(x.jsx)(L.a.div,{className:e.class,style:{top:e.pos,opacity:l},children:e.label},e.class+e.pos)}))}function O(e,t){for(var n=""+e;n.length<t;)n="0"+n;return n}}(t,n))}),[n,t]),Object(a.useEffect)((function(){console.log("step changed to: "+r)}),[r]),Object(x.jsx)(L.a.div,{ref:c,className:"DateSelectorScale",children:j})};var F=function(e){var t=e.startdate,n=e.onDateChange,r=e.onFinalDateChange,c=e.onStepChange,o=1296e6,s=36e5,u=Object(a.useRef)(),b=Object(a.useRef)(),d=Object(a.useRef)();b.current||(b.current=s),d.current||(d.current=0);var g=Object(a.useState)(t),j=Object(i.a)(g,2),f=j[0],h=j[1],m=Object(a.useState)(t),O=Object(i.a)(m,2),p=O[0],v=O[1],w=Object(a.useState)(!1),S=Object(i.a)(w,2),y=S[0],C=S[1],T=Object(a.useState)(6e4),M=Object(i.a)(T,2),E=M[0],k=M[1],D=Object(a.useState)("hour"),N=Object(i.a)(D,2),F=N[0],A=N[1],U=Object(a.useState)(s),B=Object(i.a)(U,2),H=B[0],z=B[1];b.current||(b.current=s);var I=Object(a.useRef)(),W=Object(a.useRef)(),G=function(){var e=Date.now();I.current&&e-I.current<300&&!y?W.current=!0:(I.current=e,W.current=!1)},q=Object(L.b)((function(){return{posxy_drag:[0,0]}})),V=Object(i.a)(q,2),Y=V[0].posxy_drag,J=V[1],Z=Object(L.b)((function(){return{xy2:[0,0]}})),K=Object(i.a)(Z,2),Q=K[0].xy2,X=K[1],$=Object(L.b)((function(){return{posy_wheel:0}})),ee=Object(i.a)($,2),te=ee[0].posy_wheel,ne=ee[1],ae=Object(P.a)({onDragEnd:function(){b.current=H},onWheel:function(e){e.delta;var t=e.first,a=e.down,c=(e.direction,e.velocity,e.xy,e.movement),o=e.memo,i=void 0===o?te.getValue():o;return ne({posy_wheel:c[1]+d.current,immediate:!1,config:{},onFrame:function(){if(!t){var e=new Date(p.getTime()+Math.ceil(c[1]*H/E)*E);h(e),n(e)}d.current=te.getValue()},onRest:function(){if(!a){C(!1);var e=new Date(p.getTime()+Math.ceil(te.getValue()*H/E)*E);r(e),v(e),d.current=0}}}),i},onDrag:function(e){e.event;var t,a=e.active,c=e.first,i=e.down,s=(e.touches,e.delta),l=e.velocity,u=e.direction,b=e.shiftKey,g=(e.xy,e.movement),j=e.temp,m=void 0===j?{lastzoom:H,lastdelta:[0,0],currentzoom:H}:j;return c&&(C(!0),G(),v(f),d.current=0),W.current||b?((t=m.currentzoom+m.currentzoom/50*s[1]*-1)<1e3&&(t=1e3),t>o&&(t=o),z(t),m.currentzoom=t,m.lastdelta=s,i||C(!1),m):(l=Math.abs(l)<.2?0:l,J({posxy_drag:g,immediate:a,config:{velocity:Object(_.scale)(u,l),decay:!0},onFrame:function(){if(!c){var e=new Date(p.getTime()-Math.ceil(Y.getValue()[1]*H/E)*E);h(e),n(e)}},onRest:function(){if(!i){C(!1);var e=new Date(p.getTime()-Math.ceil(Y.getValue()[1]*H/E)*E);r(e),v(e)}}}),m)}},{reset:!0,drag:{useTouch:!0}});return Object(a.useEffect)((function(){y||function(e){if(!y){var t=[0,(p.getTime()-e.getTime())/H];X({xy2:t,immediate:!1,config:{reset:!0,config:{duration:200}},onFrame:function(){var e=new Date(p.getTime()-Q.getValue()[1]*H);h(e),n(e)},onRest:function(){var e=new Date(p.getTime()-Q.getValue()[1]*H);Q.setValue([0,0]),h(e),v(e)}})}}(t)}),[t]),Object(a.useEffect)((function(){console.log("Selector active: "+y)}),[y]),Object(a.useEffect)((function(){c(F)}),[F]),Object(a.useEffect)((function(){switch(!0){case H>120426316:k(2592e6),A("month");break;case H>14544702:k(864e5),A("day");break;case H>735259:k(36e5),A("hour");break;case H>32274:k(6e4),A("minute");break;default:k(1e3),A("second")}}),[H]),Object(x.jsx)(L.a.div,{className:"DateSelector",ref:u,children:Object(x.jsxs)("div",{className:"Mask",children:[Object(x.jsx)("div",Object(l.a)(Object(l.a)({},ae()),{},{className:"touchMask",children:" "})),Object(x.jsx)(R,{className:"scale",date:f,zoomfactor:H,step:E}),Object(x.jsx)("div",{className:"TriangleContainer",children:Object(x.jsx)("svg",{height:"40",width:"20",className:"Triangle",children:Object(x.jsx)("polygon",{points:"20,5 20,35 12,20"})})})]})})};var A=function(e){var t=e.onDateChange,n=e.onFinalDateChange,r=e.animated,c=new Date,o=Object(a.useState)(c),s=Object(i.a)(o,2),l=s[0],u=s[1],b=Object(a.useState)(c),d=Object(i.a)(b,2),g=d[0],j=d[1],f=Object(a.useState)(c),h=Object(i.a)(f,2),m=h[0],O=h[1],p=Object(a.useState)(1),v=Object(i.a)(p,2),w=v[0],S=v[1];return Object(x.jsxs)("div",{children:[Object(x.jsx)(N,{startdate:g,onDateChange:function(e){u(e)}}),Object(x.jsx)(k,{date:m,animated:r,highlight:w}),Object(x.jsx)(F,{startdate:l,onDateChange:function(e){O(e),t(e)},onFinalDateChange:function(e){j(e),n(e)},onStepChange:function(e){console.log("handleSelectorStepChange"+e),S(e)}})]})},U=(n(137),n(104)),B=n(105);var H=function(e){var t=Object(a.useState)(!1),n=Object(i.a)(t,2),r=n[0],c=n[1],o=Object(L.b)((function(){return{mr:-300}})),s=Object(i.a)(o,2),u=s[0].mr,b=s[1],d=Object(P.a)({onDrag:function(e){var t=e.down,n=e.delta;e.vxvy[0]>1||!t&&n[0]>100?(b({mr:-300}),c(!0)):(b({mr:t?-Math.max(n[0],0):0}),c(!1))}});return Object(x.jsxs)(L.a.div,Object(l.a)(Object(l.a)({},d()),{},{style:{right:u,top:0},className:"ControlPanel",children:[Object(x.jsx)("div",{className:"PanelControl shadow",onClick:function(){return b(r?{mr:0}:{mr:-300})},children:Object(x.jsx)(U.Icon,{icon:B.a,width:"100%"})}),e.children]}))};n(138);var z=function(e){var t=e.initialmission,n=e.onMissionChange,r=Object(a.useState)(t),c=Object(i.a)(r,2),o=c[0],s=c[1];return Object(C.a)("1",(function(){s("S1")})),Object(C.a)("2",(function(){s("S2")})),Object(C.a)("3",(function(){s("S3")})),Object(C.a)("5",(function(){s("S5P")})),Object(C.a)("6",(function(){s("ENVISAT")})),Object(a.useEffect)((function(){console.log("Mission changed to: "+o),n(o)}),[o]),Object(x.jsxs)("div",{className:"MissionSelector",children:[Object(x.jsx)("div",{className:"S1"==o?"CircleButtonSelected":"CircleButton",children:Object(x.jsx)("img",{className:"MissionIcon",src:"./images/s1_black.png",alt:"",onClick:function(){return s("S1")}})}),Object(x.jsx)("div",{className:"S2"==o?"CircleButtonSelected":"CircleButton",children:Object(x.jsx)("img",{className:"MissionIcon",src:"./images/s2_black.png",alt:"",onClick:function(){return s("S2")}})}),Object(x.jsx)("div",{className:"S3"==o?"CircleButtonSelected":"CircleButton",children:Object(x.jsx)("img",{className:"MissionIcon",src:"./images/s3_black.png",alt:"",onClick:function(){return s("S3")}})}),Object(x.jsx)("div",{className:"S5P"==o?"CircleButtonSelected":"CircleButton",children:Object(x.jsx)("img",{className:"MissionIcon",src:"./images/s5p_black.png",alt:"",onClick:function(){return s("S5P")}})})]})};var I=function(){var e=Object(s.useGlobal)("mission"),t=Object(i.a)(e,2),n=t[0],a=t[1];return Object(x.jsx)(z,{initialmission:n,onMissionChange:a})};n(139);var W=function(e){var t=e.mapSettings,n=e.onMapSettingsChange,r=Object(a.useState)(t),c=Object(i.a)(r,2),o=c[0],s=c[1];return Object(a.useEffect)((function(){n(o)}),[o]),Object(a.useEffect)((function(){s(t)}),[t]),Object(x.jsxs)("div",{className:"MapSelector",children:[Object(x.jsx)("div",{className:t.atmosphere?"CircleButtonSelected":"CircleButton",children:Object(x.jsx)("img",{className:"MapIcon",draggable:"false",src:"./images/atmosphere.png",alt:"",onClick:function(){return s((function(e){return Object(l.a)(Object(l.a)({},e),{},{atmosphere:!e.atmosphere})}))}})}),Object(x.jsx)("div",{className:t.starfield?"CircleButtonSelected":"CircleButton",children:Object(x.jsx)("img",{className:"MapIcon",draggable:"false",src:"./images/starfield.png",alt:"",onClick:function(){return s((function(e){return Object(l.a)(Object(l.a)({},e),{},{starfield:!e.starfield})}))}})}),Object(x.jsx)("div",{className:t.names?"CircleButtonSelected":"CircleButton",children:Object(x.jsx)("img",{className:"MapIcon",draggable:"false",src:"./images/names.png",alt:"",onClick:function(){return s((function(e){return Object(l.a)(Object(l.a)({},e),{},{names:!e.names})}))}})}),Object(x.jsx)("div",{className:"CircleButton",children:Object(x.jsx)("img",{className:"MapIcon",draggable:"false",src:"./images/names.png",alt:"",onClick:function(){return s((function(e){return Object(l.a)(Object(l.a)({},e),{},{background:e.background+1})}))}})})]})};var G=function(){var e=Object(s.useGlobal)("mapSettings"),t=Object(i.a)(e,2),n=t[0],a=t[1];return Object(x.jsx)(W,{mapSettings:n,onMapSettingsChange:a})},q=n(110);n(248);var V=function(){var e=Object(s.useGlobal)("appColor"),t=Object(i.a)(e,2),n=t[0];return t[1],Object(x.jsx)("div",{className:"ColorSelector",children:Object(x.jsx)(q.a,{color:n,onChangeComplete:function(e){document.documentElement.style.setProperty("--color",e.hex)}})})},Y=n(66);var J=function(){var e=Object(s.useGlobal)("viewDate"),t=Object(i.a)(e,2),n=(t[0],t[1]);return Object(x.jsx)(A,{onDateChange:n,onFinalDateChange:n})};var Z=function(){var e=Object(Y.b)(),t=Object(s.useGlobal)("mission"),n=Object(i.a)(t,1)[0],r=Object(s.useGlobal)("mapSettings"),c=Object(i.a)(r,1)[0],o=Object(s.useGlobal)("appColor"),l=(Object(i.a)(o,1)[0],Object(a.useState)(!1)),u=Object(i.a)(l,2),b=u[0];return u[1],Object(C.a)("f",e.enter),Object(a.useEffect)((function(){console.log("fullScreen changed to: "+b)}),[b]),Object(a.useEffect)((function(){console.log("time to init earth"),console.log(c)}),[]),Object(x.jsx)("div",{className:"App",children:Object(x.jsxs)(Y.a,{handle:e,children:[Object(x.jsx)("div",{className:"Earth",children:Object(x.jsx)(T,{id:"globe"})}),Object(x.jsx)(J,{}),Object(x.jsxs)(H,{active:"true",children:[Object(x.jsx)("div",{class:"logo",children:Object(x.jsx)("img",{src:"./images/ESA_logo_2020_White.png",height:"40"})}),Object(x.jsx)("div",{children:Object(x.jsx)("img",{src:"./images/EOi_logo.png",height:"150"})}),Object(x.jsx)(I,{}),Object(x.jsx)(G,{}),Object(x.jsx)(V,{})]}),Object(x.jsx)("div",{className:"MissionLabel",children:n})]})})},K=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,251)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,c=t.getLCP,o=t.getTTFB;n(e),a(e),r(e),c(e),o(e)}))};console.log("init global: "+(new Date).getTime()),Object(s.setGlobal)({mission:"S1",satellites:!1,appColor:"#222222",position:{clon:"0.5",clat:"40"},viewDate:new Date,mapSettings:{atmosphere:!0,starfield:!0,names:!1,background:1,overlay:2,dem:!0}}),o.a.render(Object(x.jsx)(r.a.StrictMode,{children:Object(x.jsx)(Z,{})}),document.getElementById("root")),K()},74:function(e,t,n){}},[[249,1,2]]]);
//# sourceMappingURL=main.1e82487d.chunk.js.map