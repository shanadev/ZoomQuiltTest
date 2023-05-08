

$(document).ready(function() {



	window.onload = function()
	{
		// These are global vars
		
		var dotarray = new Array(0);
		var dotarraymax = 10000;
		
		var imgh = document.getElementById('TestQuilt02');
		var img0 = document.getElementById('TestQuilt03');
		var img1 = document.getElementById('TestQuilt01');
		var img2 = document.getElementById('TestQuilt02');
		var img3 = document.getElementById('TestQuilt03');
		var img4 = document.getElementById('TestQuilt01');
		var img5 = document.getElementById('TestQuilt02');
		var img6 = document.getElementById('TestQuilt03');
		var img7h = document.getElementById('TestQuilt01');
		var yessign = document.getElementById('YesSign');
		var firewindow = document.getElementById('FireWindow');
		//var windowfire = document.getElementById('WindowFire');
		var revState = false;
		var canvas = document.getElementById('zq');
		canvas.width = 640;
		canvas.height = 400;
		var ctx = canvas.getContext('2d');
		var speed = 1;
		var speedmax = 50;
		var friction = 0.98;
		var velocity = 0;
		var scrolldirection = 0;
		var aspect = 1.6;					// width / aspect = height
		var cxh = -320;
		var cx0 = -320;
		var cx1 = 0;							// current x
		var cx2 = 160;
		var cx3 = 240;
		var cx4 = 280;
		var cx5 = 300;
		var cx6 = 310;
		var cx7h = 315;
		//var cx8 = 318;
		//var cx9h = 320;
		var bottomimgnext = 1;
		var topimgnext = 2;
		
		var mousepos = 0;
		
		
		
	
		/*
		var updatemouse = function(d)
		{
			mousepos = mousepos + d;
			//$('#mousepos').html('');
			$('#mousepos').html(mousepos);
			//alert(d);
		};
		*/
	
		var handleScroll = function(inputevent){
			
			//alert ("scroll - delta:"+inputevent.deltaY);
			
			//var delta = inputevent.wheelDelta;
			var delta = inputevent.deltaY;
			if (delta > 0)
			{
				scrolldirection = speed;
			}
			else if (delta < 0)
			{
				scrolldirection = -speed;
			}
			else
			{
				scrolldirection = 0;
			}
			
			//updatemouse(delta);
		};
		
		//document.addEventListener('DOMMouseScroll',handleScroll,false);
		//document.addEventListener('mousewheel',handleScroll,false);
		document.body.addEventListener('wheel',handleScroll,false);
		
		var handleKey = function(e)
		{
			//alert("I'm here");
			var key = e.keyCode;
			switch (key)
			{
				case 38:
					scrolldirection = -speed;
					break;
				case 40:
					scrolldirection = speed;
					break;
				default:
					scrolldirection = 0;
					break;
			}
			
			//scrolldirection = 1;
		};
		
		try
		{
			if (document.body.addEventListener)
			{
				document.body.addEventListener("keydown",handleKey,false);
			}
			else if (document.attachEvent)
			{
				document.attachEvent("onkeydown",handleKey);
			}
			else
			{
				document.body.addEventListener("keydown",handleKey,false);
				//document.body.addEventListener("keypress",handleKey,false);
			}
		}
		catch(e)
		{
			alert (e);
		}

		var cmx;
		var cmy;
		var clickX;
		var clickY;
		var yestrigger = false;
		var firetrigger = false;

		// expecting input given 0,0 is top left of canvas
		var translatepoint = function (xval,sx,sy)
		{
			var centerX = canvas.width/2;
			var centerY = canvas.height/2;
			var relationToEdge;
			var slope = (centerY - sy) / (centerX - sx);
			var intercept = centerY - (slope * centerX);
			var newx;
			var newy;

			// based on quadrent
			if (sx < centerX) 
			{
				// top left or bottom left
				relationToEdge = sx / centerX;
				newx = ((centerX - xval) * relationToEdge) + xval;
			}
			else if (sx > centerX)
			{
				// top right or bottom right
				relationToEdge = (canvas.width - sx) / centerX;
				newx = (centerX + (centerX - xval)) - ((centerX - xval) * relationToEdge);
			}
			newy = slope * newx + intercept;
			
			return {
				newx: newx,
				newy: newy
			};
		};
		
		var translaterect = function (xval,sx,sy,sw,sh)
		{
			var newxy = translatepoint(xval,sx,sy);
			var newx = newxy.newx;
			var newy = newxy.newy;
			var newwxy = translatepoint(xval,sx+sw,sy);
			var neww = newwxy.newx - newx;
			var newhxy = translatepoint(xval,sx,sy+sh);
			var newh = newhxy.newy - newy;
			
			//var newh = tempy - newy;

			//var neww = tempx - newx;
			
			return {
				newx: newx,
				newy: newy,
				neww: neww,
				newh: newh
			};
		};

		var linksign = function (xval,refresh)
		{
			if (true)
			{
				// PROVIDE THESE
				var sax = 84;
				var say = 154;
				var sw = 75;
				var sh = 61;
				
				var newrect = translaterect(xval,sax,say,sw,sh);
				
				if (cmx > newrect.newx && cmx < (newrect.newx+newrect.neww) && cmy > newrect.newy && cmy < (newrect.newy+newrect.newh))
				{
					// show yes
					if (refresh) ctx.drawImage(yessign, newrect.newx, newrect.newy, newrect.neww, newrect.newh);
					yestrigger = true;
				}
				
			}
		};
		
		var putdot = function (xin, yin, color)
		{
			var rnd = {x:xin, y:yin, c:color};
			if (dotarray.length < dotarraymax) dotarray.push(rnd);
		};
		
		var IsImageOk = function (img) {
		    // During the onload event, IE correctly identifies any images that
		    // weren’t downloaded as not complete. Others should too. Gecko-based
		    // browsers act like NS4 in that they report this incorrectly.
		    if (!img.complete) {
		        return false;
		    }
		
		    // However, they do have two very useful properties: naturalWidth and
		    // naturalHeight. These give the true size of the image. If it failed
		    // to load, either of these should be zero.
		
		    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
		        return false;
		    }
		
		    // No other way of checking: assume it’s ok.
		    return true;
		};
				
		var linkwindow = function (xval,refresh)
		{
			// Provide
			var sax = 528;
			var say = 130;
			var sw = 61;
			var sh = 135;
			
			var newrect = translaterect(xval,sax,say,sw,sh);
						
			// test if mouse is in hot region
			var a = (newrect.neww / 2);
			var b = (newrect.newh / 2);
			var h = newrect.newx + a;
			var k = newrect.newy + b;
			
			//$('#debugwindow').html("a="+a+"<br/>b="+b+"<br/>h="+h+"<br/>k="+k);
			
			//var alive = true;
			//var counter = 0;
			//while (alive)
			//{
			//counter++;
			var rndx = Math.random() * 640;
			var rndy = Math.random() * 400;
			
			//if (((((cmx-h)^2)/(a^2))+(((cmy-k)^2)/(b^2)))<=1)
			//if (((cmx-h)^2 / a^2) + ((cmy-k)^2 / b^2) <= 1)
			if ( (Math.pow(cmx-h,2) / Math.pow(a,2)) + (Math.pow(cmy-k,2) / Math.pow(b,2)) <= 1 )
			{
				//putdot(rndx, rndy, "blue");
				// we have a hit, draw some stuff
				orgx = 398;
				orgy = 138;
				orgw = 195;
				orgh = 130;
				var outrect = translaterect(xval, orgx, orgy, orgw, orgh);
				//if (!(IsImageOk(firewindow))) alert("wah?");
				if (refresh) ctx.drawImage(firewindow, outrect.newx, outrect.newy, outrect.neww, outrect.newh);
//					ctx.drawImage(windowfire, yesx, yesy, yesw, yesh);
				
				firetrigger = true;
			}
			else
			{
				//putdot(rndx, rndy, "black");
			}
			/*
			ctx.beginPath();
			ctx.moveTo(h, k - b);
			ctx.bezierCurveTo(h + a, k - b, h + a, k + b, h, k + b);
			ctx.bezierCurveTo(h - a, k + b, h - a, k - b, h, k - b);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath();
			*/
		};

		var getMousePos = function(evt)
		{
			var rect = canvas.getBoundingClientRect();
			cmx = evt.clientX - rect.left;
			cmy = evt.clientY - rect.top;
		};
		
		canvas.addEventListener("mousemove", getMousePos, false);

		var getMouseClick = function(evt)
		{
			clickX = cmx;
			clickY = cmy;
			//alert ("I made it here. yestrigger = "+yestrigger);
			if (img0.id == "TestQuilt01") { linksign(cx0,false); linkwindow(cx0,false); }
			if (img1.id == "TestQuilt01") { linksign(cx1,false); linkwindow(cx1,false); }
			if (img2.id == "TestQuilt01") { linksign(cx2,false); linkwindow(cx2,false); }
			if (img3.id == "TestQuilt01") { linksign(cx3,false); linkwindow(cx3,false); }
			if (img4.id == "TestQuilt01") { linksign(cx4,false); linkwindow(cx4,false); }
			if (img5.id == "TestQuilt01") { linksign(cx5,false); linkwindow(cx5,false); }
			if (img6.id == "TestQuilt01") { linksign(cx6,false); linkwindow(cx6,false); }
			//alert ("I made it here. yestrigger = "+yestrigger);
			if (yestrigger) {
				window.open("http://www.heckfiremusic.com");
			}
			if (firetrigger) {
				alert("Clicked on fire");
			}
		};
		
		canvas.addEventListener("click", getMouseClick, false);

		
		var render = function ()
		{
			if (speed > speedmax) speed = speedmax;
			velocity += scrolldirection;
			//if (scrolldirection > 0) velocity++;
			//if (scrolldirection < 0) velocity--;
			scrolldirection = 0;
			
			velocity *= friction;
			if (Math.abs(velocity) < 2) velocity *= friction;
			if (Math.abs(velocity) < 1) velocity *= friction;
			
			
			if (Math.abs(velocity) < .1) velocity = 0;
			var xh = -320;

			var x1 = cx1 + velocity / ((cx1 / 160) + 1);

			if (x1 < 0)
			{
				// push down
				var veldiv = (((Math.abs(cx2) - 160) / 80) * 2) + 2;
				$('#debugpush').html("Push Down:"+topimgnext+" div:"+veldiv.toFixed(2));
				imgh = img0;
				img0 = img1;
				img1 = img2;
				img2 = img3;
				img3 = img4;
				img4 = img5;
				img5 = img6;
				img6 = img7h;
				switch (topimgnext)
				{
					case 1:
						img7h = document.getElementById('TestQuilt01');
						topimgnext = 2;
						bottomimgnext = 1; 
						break;
					case 2:
						img7h = document.getElementById('TestQuilt02');
						topimgnext = 3;
						bottomimgnext = 2;
						break;
					case 3:
						img7h = document.getElementById('TestQuilt03');
						topimgnext = 1;
						bottomimgnext = 3;
						break;
					default:
						alert ("You should never see this shit.");
				}
				x1 = cx2 + velocity / veldiv;
			}
			else if (x1 > 160)
			{
				// push up
				//var velmult = 320/cx0 - 1;
				$('#debugpush').html("Push Up:"+bottomimgnext+" mult:1");
				img7h = img6;
				img6 = img5;
				img5 = img4;
				img4 = img3;
				img3 = img2;
				img2 = img1;
				img1 = img0;
				img0 = imgh;
				switch (bottomimgnext)
				{
					case 1:
						imgh = document.getElementById('TestQuilt01');
						bottomimgnext = 3;
						topimgnext = 1;
						break;
					case 2:
						imgh = document.getElementById('TestQuilt02');
						bottomimgnext = 1;
						topimgnext = 2;
						break;
					case 3:
						imgh = document.getElementById('TestQuilt03');
						bottomimgnext = 2;
						topimgnext = 3;
						break;
					default:
						alert ("You should never see this fucking shit.");
				}
				x1 = cx0 + velocity;
			}
			
			
			
			/*
			var x0 = cx0 + velocity*2;
			var x1 = cx1 + velocity;
			var x2 = cx2 + velocity/2;
			var x3 = cx3 + velocity/4;
			var x4 = cx4>320?320:cx4+velocity/8;
			var x5 = cx5>320?320:cx5+velocity/16;
			var x6 = cx6>320?320:cx6+velocity/32;
			*/
			
			var x7h = 320;
			//var x8 = cx8 + velocity/128;
			//var x9h = cx9h;
			
			// get percentage of main graphic
			var perc = x1 / 160;
			
			var x0 = (320 * perc) - 320;
			var x2 = (80 * perc) + 160;
			var x3 = (40 * perc) + 240;
			var x4 = (20 * perc) + 280;
			var x5 = (10 * perc) + 300;
			var x6 = (5 * perc) + 310;
			
			/*
			if (x1 > 320) x1 = 320;
			if (x1 < -320) x1 = -320;
			if (x2 > 320) x2 = 320;
			if (x2 < -320) x2 = -320;
			*/
			
			//$('#mousepos').html(x1);
			
			
			/*
			
			ctx.drawimage(img0, x0, getyh(x0), getw(x0), getyh(getw(x0)));
			ctx.drawimage(img1, x1, getyh(x1), getw(x1), getyh(getw(x1)));
			ctx.drawimage(img2, x2, getyh(x2), getw(x2), getyh(getw(x2)));
			ctx.drawimage(img3, x3, getyh(x3), getw(x3), getyh(getw(x3)));
			ctx.drawimage(img4, x4, getyh(x4), getw(x4), getyh(getw(x4)));
			ctx.drawimage(img5, x5, getyh(x5), getw(x5), getyh(getw(x5)));
			ctx.drawimage(img6, x6, getyh(x6), getw(x6), getyh(getw(x6)));
			ctx.drawimage(img7, x7, getyh(x7), getw(x7), getyh(getw(x7)));
			ctx.drawimage(img8, x8, getyh(x8), getw(x8), getyh(getw(x8)));
			*/
			
			
			var drawl = function (imgin, xin)
			{
				var yout = xin / 1.6;
				var wout = Math.abs((xin - 320) * 2);
				var hout = wout / 1.6;
				ctx.drawImage(imgin, xin, yout, wout, hout);
				//alert(xin+"|"+yout+"|"+wout+"|"+hout);
			};
			
			

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			//ctx.fillStyle = "black";
			//ctx.fillRect(0, 0, canvas.width, canvas.height);
			drawl(img0, x0);
			drawl(img1, x1);
			drawl(img2, x2);
			drawl(img3, x3);
			drawl(img4, x4);
			drawl(img5, x5);
			drawl(img6, x6);
			if (img0.id == "TestQuilt01") { linksign(x0,true); linkwindow(x0,true); }
			if (img1.id == "TestQuilt01") { linksign(x1,true); linkwindow(x1,true); }
			if (img2.id == "TestQuilt01") { linksign(x2,true); linkwindow(x2,true); }
			if (img3.id == "TestQuilt01") { linksign(x3,true); linkwindow(x3,true); }
			if (img4.id == "TestQuilt01") { linksign(x4,true); linkwindow(x4,true); }
			if (img5.id == "TestQuilt01") { linksign(x5,true); linkwindow(x5,true); }
			if (img6.id == "TestQuilt01") { linksign(x6,true); linkwindow(x6,true); }
			//drawl(img7h, x7h);
			//drawl(img8, x8);

			$('#debugx').html("velocity:"+velocity.toFixed(2)+
				"<br />Mouse X,Y: "+cmx+","+cmy+
				"<br />yestrigger:"+yestrigger+
				"<br />firetrigger:"+firetrigger+
				"<br />xh:"+xh.toFixed(2)+
				"<br />x0:"+x0.toFixed(2)+
				"<br />x1:"+x1.toFixed(2)+
				"<br />x2:"+x2.toFixed(2)+
				"<br />x3:"+x3.toFixed(2)+
				"<br />x4:"+x4.toFixed(2)+
				"<br />x5:"+x5.toFixed(2)+
				"<br />x6:"+x6.toFixed(2)+
				"<br />x7h:"+x7h.toFixed(2));

			cxh = -320;
			cx0 = x0;
			cx1 = x1;
			cx2 = x2;
			cx3 = x3;
			cx4 = x4;
			cx5 = x5;
			cx6 = x6;
			cx7h = 320;
			//cx8 = x8;
			//cx9h = x9h;
			yestrigger = false;
			firetrigger = false;
			// Test ellipse tester
			
			/*
			for (i = 0; i < dotarray.length - 1 ; i++)
			{
				//alert(dotarray[i].c);
				ctx.fillStyle = dotarray[i].c;
				ctx.fillRect(dotarray[i].x, dotarray[i].y, 2, 2);
			}
			*/
			
			requestAnimationFrame(render);
		};
		
		
		var requestAnimationFrame =  
		        window.requestAnimationFrame ||
		        window.webkitRequestAnimationFrame ||
		        window.mozRequestAnimationFrame ||
		        window.msRequestAnimationFrame ||
		        window.oRequestAnimationFrame ||
		        function(callback) {
		          return setTimeout(callback, 1);
		        };		
		
		render();	

	};


		
	/*
	var mousepos = 0;
	
	
	var img = document.getElementById('TestQuilt01');
	var canvas = document.getElementById('zq');
	canvas.width = 640;
	canvas.height = 400;
	var ctx = canvas.getContext('2d');
	
	var callback = function(input) {
		if (!input) input = this;
		ctx.drawImage(input, 0, 0);
		ctx.drawImage(input, 50, 50);
	};
	
	if (img.complete)
	{
		callback(img);
	}
	else
	{
		img.onload = callback;
	}
	
	*/
});


