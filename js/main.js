 var Scratcher = (function() {
     'use strict'

     function index(arr, i) {
         return i < 0 ? arr[arr.length + i] : arr[i];
     }

     function range(arr, start, end) {
         return arr.slice(start, end + 1);
     }

     function bind() {
         var args = [].slice.call(arguments, 0),
             element = index(args, 0),
             events = range(args, 1, -2),
             handle = index(args, -1);
         for (var i = events.length; i--;) {
             element.addEventListener(events[i], handle);
         }
         return {
             destory: function() {
                 for (var i = events.length; i--;) {
                     element.removeEventListener(events[i], handle);
                 }
             }
         }
     }

     return function(obj, height, width, c1, c2, text) {
         function render() {
             tempCtx.drawImage(drawCanvas, 0, 0);
             tempCtx.save();
             tempCtx.globalCompositeOperation = 'source-atop';
             renderText(tempCtx);
             tempCtx.restore();
             renderFront(ctx);
             ctx.drawImage(tempCanvas, 0, 0);
         }
         var tw = Math.floor(Math.random() * (width - 120) + 1),
             th = Math.floor(Math.random() * (height - 30) + 1);

         function renderText(ctx) {
             ctx.save();
             ctx.fillStyle = "black";
             ctx.font = "bold 30px Helvetica";
             ctx.textBaseline = 'top';
             ctx.fillText(text, tw, th);
             ctx.restore();
         }

         function renderFront(ctx) {
             ctx.save();
             ctx.fillStyle = c1;
             ctx.fillRect(0, 0, width, height);
             ctx.restore();
         }

         function moveHandle(e) {
             e.preventDefault();
             if (mousedown) {
                 if (e.changedTouches) {
                     e = e.changedTouches[e.changedTouches.length - 1];
                 }
                 var x = (e.clientX + document.body.scrollLeft || e.pageX) - canvas.offsetLeft || 0,
                     y = (e.clientY + document.body.scrollTop || e.pageY) - canvas.offsetTop || 0;
                 if (lastPoint) {
                     drawCtx.beginPath();
                     drawCtx.moveTo(lastPoint.x, lastPoint.y);
                 }
                 drawCtx.lineTo(x, y);
                 drawCtx.stroke();
                 lastPoint = {
                     'x': x,
                     'y': y
                 };
                 var result = (function() {
                     var data = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height).data;
                     for (var i = 0, j = 0; i < data.length; i += 4) {
                         if (data[i + 3]) {
                             j++;
                         }
                     }
                     return j / (drawCanvas.width * drawCanvas.height);
                 })()
                 for (var i = eventList.length; i--;) {
                     switch (eventList[i].type) {
                         case 'change':
                             eventList[i].cb(result);
                             break;
                         default:
                     }
                 }
                 render();
             }
         }

         function downHandle(e) {
             e.preventDefault();
             mousedown = true;
             if (e.changedTouches) {
                 e = e.changedTouches[e.changedTouches.length - 1];
             }
             var x = (e.clientX + document.body.scrollLeft || e.pageX) - canvas.offsetLeft || 0,
                 y = (e.clientY + document.body.scrollTop || e.pageY) - canvas.offsetTop || 0;
             lastPoint = {
                 'x': x,
                 'y': y
             };
             render();
         }

         function upHandle(e) {
             e.preventDefault();
             mousedown = false;
             lastPoint = null;
             render();
         }

         var canvas = (function(obj) {
                 if (obj instanceof HTMLCanvasElement) {
                     return obj;
                 } else if (typeof obj === 'string' && document.querySelector(obj)) {
                     return document.querySelector(obj);
                 } else {
                     return document.createElement('canvas');
                 }
             })(obj),
             ctx = canvas.getContext('2d'),
             eventList = [],
             listener = [
                 bind(document, 'touchmove', 'mousemove', moveHandle),
                 bind(canvas, 'touchstart', 'mousedown', downHandle),
                 bind(document, 'touchend', 'mouseup', upHandle)
             ],
             drawCanvas = document.createElement('canvas'),
             tempCanvas = document.createElement('canvas'),
             drawCtx = drawCanvas.getContext('2d'),
             tempCtx = tempCanvas.getContext('2d'),
             mousedown = false,
             lastPoint = null,
             self = this;

         drawCanvas.height = tempCanvas.height = canvas.height = height;
         drawCanvas.width = tempCanvas.width = canvas.width = width;

         drawCtx.strokeStyle = c2;
         drawCtx.lineWidth = 30;
         drawCtx.lineCap = ctx.lineJoin = 'round';

         this.on = function(eventName, cb) {
             switch (eventName) {
                 case 'change':
                     eventList.push({
                         'type': 'change',
                         'cb': cb
                     })
                     break;
                 default:
                     throw new Error('Event' + eventName + ' does not exist.');
             }
         }

         this.canvas = canvas;
         render();
     }
 })()


 function init() {
     'use strict'
     var cheight = $("#canvas").height(),
         cwidth = $("#canvas").width(),
         frontColor = getRndom(colorArr),
         backColor,
         text = getRndom(textArr);
     colorArr.remove(frontColor);
     backColor = getRndom(colorArr);
     if (true) {
         var s = new Scratcher('#canvas', cheight, cwidth, frontColor, backColor, text);

         s.on('change', function(e) {
             $("#process i").text(Math.round(e * 10000) / 100);
         });
     };

     $("#text-area input").on('input propertychange', function() {
         if ($.trim($(this).val()) === text) {
                  swal({
                 title: "",
                 text: "你在擦除了" + $("#process i").text() + "%的区域后成功猜中!简直人才啊!",
                 type: "success",
                 showCancelButton: true,
                 confirmButtonColor: "#b8f1cc",
                 confirmButtonText: "分享到朋友圈",
                 cancelButtonText: "再来一次",
                 closeOnConfirm: false,
                 closeOnCancel: false
             }, function(isConfirm) {
                 if (isConfirm) {
                    console.log("hehe");
                    WeiXinShareBtn();
                 } else {
                     window.location.href = window.location.href;
                 }
             });
         };
     });
 }
 var colorArr = ["#cf8888", "#f0b631", "#aa5b71", "#ff8240", "#e37c5b", "#ffe543", "#ed9678", "#c17161", "#f9b747", "#fecf45", "#edbf2b", "#e29e4b", "#ca7497", "#e96a25", "#de772c", "#f28860", "#c39e9e", "#fe9778", "#fd7d36", "#f3d64e", "#e1622f", "#e7dac9", "#b8f1cc", "#b8f1ed", "#f1f1b8", "#f1ccb8", "#d9b8f1", "#f1b8e4", "#ff9b6a", "#dcff93", "#b7d28d", "#f2debd", "#f1ccb8", "#c86f67", "#cf8878", "#cb8e85", "#ae716e", "#ef5464", "#f55066", "#e27386", "#f16d7a"];
 var textArr = ["千军万马", "一生一世", "浮生若梦", "对酒当歌", "棋逢对手", "叶公好龙", "后会无期", "守株待兔", "凤凰于飞", "一生一世", "花好月圆", "世外桃源", "韬光养晦", "画蛇添足", "青梅竹马", "风花雪月", "滥竽充数", "没完没了", "总而言之", "欣欣向荣", "时光荏苒", "差强人意", "好好先生", "无懈可击", "袖手旁观", "群雄逐鹿", "血战到底", "唯我独尊", "买椟还珠", "龙马精神", "一见钟情", "喜闻乐见"];
 Array.prototype.remove = function(val) {
     var index = this.indexOf(val);
     if (index > -1) {
         this.splice(index, 1);
     }
 };

 function WeiXinShareBtn() {
     if (typeof WeixinJSBridge == "undefined") {
         alert(" 请先通过微信搜索 wow36kr 添加36氪为好友，通过微信分享文章 :) ");
     } else {
         WeixinJSBridge.invoke('shareTimeline', {
             "title": "36氪",
             "link": "http://www.36kr.com",
             "desc": " 关注互联网创业 ",
             "img_url": "http://www.36kr.com/assets/images/apple-touch-icon.png"
         });
     }
 }

 function getRndom(arr) {
     var ele = '';
     var a = parseInt(arr.length * Math.random());
     ele = arr[a];
     return ele;
 }
 $(document).ready(function() {
     init();
 });