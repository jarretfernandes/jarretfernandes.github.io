(function() {
    
	// data variables
	const backgroundColor = "#eee";
	const ruledLineColor = "#0f0";
	const ruledLineSpacing = 100;
	const canvasMargin = 50;
	const canvasWidth = 400;
	const canvasHeight = 400;
	const drawingLineWidth = 5;
	const ruledLineWidth = 1;
	var listPartition = [];
	var errorSound = document.getElementById('errorSound');
	
	class Partition {
		constructor(top, bottom) {
			this.top = top;
			this.bottom = bottom;
		}
	}

	function isWithinValidPartition(cursorY, partition) {
		return (cursorY > partition.top && cursorY < partition.bottom);
	}

	function playErrorSound() {
		errorSound.play();
	}
	
	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

    function createCanvas(parent, width, height) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width;
        canvas.node.height = height;
        parent.appendChild(canvas.node);
        return canvas;
    }

    function init(container, backgroundColor, ruledLineColor) {
		var drawingLineColor = getRandomColor();
        var canvas = createCanvas(container, canvasWidth, canvasHeight);
		var isDrawing = false;
        var ctx = canvas.context;
		ctx.lineWidth = drawingLineWidth;
		var tries = 0;
        
        ctx.setBackground = function(backgroundColor) {
        	ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        };
        ctx.setBackground(backgroundColor);
        
        ctx.drawLines = function(spacing) {
        		ctx.strokeStyle = ruledLineColor;
				ctx.lineWidth = ruledLineWidth;
				var lastPartitionY;
        		for (var j = canvasMargin, k = 0; j < canvasHeight; j += spacing - ruledLineWidth, k++) {
					ctx.moveTo(0, j);
        			ctx.lineTo(canvasWidth, j);
        			ctx.stroke();
					if(k != 0) {
						listPartition.push(new Partition(lastPartitionY + ruledLineWidth, j));
						lastPartitionY = j;
					} else {
						lastPartitionY = j;
					}
      			}
				ctx.lineWidth = drawingLineWidth;
        };
        ctx.drawLines(ruledLineSpacing);
		
		ctx.getCurrentCoordinates = function(e, context) {
			var x = e.pageX - context.offsetLeft;
            var y = e.pageY - context.offsetTop;
			return {x: x, y: y};
		};
		
		canvas.node.onmousedown = function(e) {
			ctx.strokeStyle = getRandomColor();
			var pos = ctx.getCurrentCoordinates(e, this);
			console.log(tries);
			if(tries != -1 && isWithinValidPartition(pos.y, listPartition[tries])) {
				isDrawing = true;
				ctx.beginPath();
				ctx.moveTo(pos.x, pos.y);
				return false;
			}
			
		};

		canvas.node.onmousemove = function(e) {
			var pos = ctx.getCurrentCoordinates(e, this);
			coord.innerHTML = '(' + pos.x + ',' + pos.y + ')';
			if (tries != -1 && isDrawing) {
				if(isWithinValidPartition(pos.y, listPartition[tries])) {
					ctx.lineTo(pos.x, pos.y);
					ctx.stroke();
				} else {
					isDrawing = false;
					playErrorSound();
				}
			}
		};

		canvas.node.onmouseup = function(e) {
			isDrawing = false;
			tries = (tries != -1 && tries < listPartition.length - 1) ? tries + 1 : -1;
		};
		
    }
	
	
    var container = document.getElementById('canvas');
    var coord = document.getElementById('coord');
    init(container, backgroundColor, ruledLineColor);
	

})();
