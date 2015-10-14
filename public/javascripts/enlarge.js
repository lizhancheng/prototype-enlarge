// prototype
	Element.observe(window, 'load', function(){
		var wheel = 'mousewheel', flag, i = 2;
		Element.on(document.body, 'click', function(event){
			if(event.target.className === 'tolarge' || event.srcElement.className === 'tolarge'){
				var node = event.target || event.srcElement;
				if($$('.overlay').length > 0){
					$$('.large')[0].src = node.src;
					return;
				}
				var cover = document.createElement('div');
				cover.addClassName('overlay');
				document.body.appendChild(cover);
				var img = new Image();
				img.src = node.src;
				cover.appendChild(img);
				img.addClassName('large');
				if(Prototype.Browser.IE){
					flag = setInterval(function(){
						i += 2;
						cover.style.filter = "alpha(opacity=" + i + ")";
						img.style.filter = "alpha(opacity=" + i + ")";
						if(i === 80){
							img.style.filter = "alpha(opacity=100)";
							clearInterval(flag);
						}
					}, 100);
					center(img);
				}else {
					requestAnimationFrame(function(){
						cover.setStyle('opacity:1.1');
						img.setStyle('transform: translate(-50%, -50%) scale(1, 1);');
					});
				}
				var bottom = document.createElement('div').addClassName('bottom');
				var collection = $$('.tolarge'), len = collection.length, fragment = document.createDocumentFragment();
				for(var j = 0;j < len;j ++){
					fragment.appendChild(collection[j].clone());
				}
				bottom.appendChild(fragment);
				$$('.overlay')[0].appendChild(bottom);
			}

		});
		Element.observe(document.body, 'click', function(event){
			if(event.target.className == 'overlay' || event.target.className == 'large' || event.srcElement.className === 'overlay' || event.srcElement.className === 'large'){
				if(Prototype.Browser.IE){
					document.body.removeChild($$('.overlay')[0]);
				}else if(Prototype.Browser.Gecko){
					$$('.large')[0].setStyle('animation: fold 1s ease-in');
					setTimeout(function(){
						document.body.removeChild($$('.overlay')[0]);
					}, 1000);
				}else {
					$$('.large')[0].setStyle('animation: fold 1s ease-in');
				}
			}
		});
		if(Prototype.Browser.Gecko) {
			wheel = 'DOMMouseScroll';
		}
		Element.observe(document, wheel, function(event){
			if(event.target.className == 'overlay' || event.target.className == 'large'){
				zoom(event);
			}else if(event.target.parentNode === $$('.bottom')[0]){
				moveBottom(event);
			}
		});
		Element.observe(document, 'webkitAnimationEnd', function(event){
			if(event.target.className == 'overlay' || event.target.className == 'large'){
				document.body.removeChild($$('.overlay')[0]);
			}
		});
		Element.observe(document, 'keypress', function(event){
			zoom(event);
		});

		function center(img){
			var width = (-img.getWidth() / 2) + 'px', height = (-img.getHeight() / 2) + 'px';
			img.setStyle('margin-left: ' + width + ';margin-top: ' + height);
			i = 2;
		}

		function zoom(event){
			if($$('.large').length !== 0) {
				if(Prototype.Browser.IE) {
					var img = $$('.large')[0];
					if(event.wheelDelta > 0 || event.keyCode === 43){
						img.setStyle('width: ' + (img.getWidth() * 1.1) + 'px;height: ' + (img.getHeight() * 1.1) + 'px');
					}else if(event.wheelDelta < 0 || event.keyCode === 45){
						img.setStyle('width: ' + (img.getWidth() / 1.1) + 'px;height: ' + (img.getHeight() / 1.1) + 'px');
					}
					center(img);
				}else {
					var cssstr = $$('.large')[0].getStyle('transform');
						var posValue = parseFloat(cssstr.slice(cssstr.search(/scale/) + 6));
						var finalValue;
						if(event.deltaY < 0 || event.detail < 0 || event.wheelDelta > 0 || event.keyCode === 43 || event.charCode === 43){
							finalValue = posValue + 0.1;
							$$('.large')[0].setStyle('transform: translate(-50%, -50%) scale(' + finalValue + ', ' + finalValue + ');');
						}else if(event.deltaY > 0 || event.detail > 0 || event.wheelDelta < 0 || event.keyCode === 45 || event.charCode === 45){
							finalValue = posValue - 0.1;
							$$('.large')[0].setStyle('transform: translate(-50%, -50%) scale(' + finalValue + ', ' + finalValue + ');');
						}
				}
			}
		}

		function moveBottom(event){
			if(event.deltaY < 0 || event.detail < 0 || event.wheelDelta > 0){
				$$('.bottom')[0].scrollLeft -= 20;
			}else if(event.deltaY > 0 || event.detail > 0 || event.wheelDelta < 0){
				$$('.bottom')[0].scrollLeft += 20;
			}
		}
	});