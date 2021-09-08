var stageWidth = 680;
var stageHeight = 450;

var stage = new Konva.Stage({
  container: 'container',
  width: stageWidth,
  height: stageHeight,


});

var layer = new Konva.Layer();

stage.add(layer);

var inputText = document.getElementById('tx');

var group1 = new Konva.Group({

});
layer.add(group1);

var back = new Konva.Rect({
  width: stage.width(),
  height: stage.height(),
  fill: 'rgba(200, 200, 200)',
});

layer.add(back);
group1.add(back);



function dw(url, opa = 0.5) {


  var imageObj = new Image();

  imageObj.onload = function () {
    var image2 = new Konva.Image({
      x: stage.width() / 2 - 200 / 2,
      y: stage.height() / 2 - 137 / 2,
      image: imageObj,
      width: back.width() / 3,
      height: back.height() / 3,
      draggable: true,
      opacity: opa,
    });

    //***enable disable tr in layer */
    onEnable = true;
    image2.on('dblclick dbltap', function () {

      if (onEnable) {
        tr.visible(false);
        //text.off();

        onEnable = false;
      }
      else {
        tr.visible(true);
        onEnable = true;

      };

    });



    document.getElementById("vol").oninput = function () {

      vol = document.getElementById('vol').value / 100;
      image2.opacity(vol);

      layer.draw();


    };
    //draw editable nodes in text
    var tr = new Konva.Transformer({
      nodes: [image2],
      keepRatio: true,
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }
        return newBox;
      },
    });
    layer.add(tr);
    layer.add(image2);
    //fix bug in line
    tr.forceUpdate();


  };



  imageObj.src = url;



};


///*creating the background image reference from back */
function bg() {

  var imageObj = new Image();
  imageObj.onload = function () {
    var bg = new Konva.Image({
      x: 0, //stage.width()/2,
      y: 0, // stage.height/2,
      image: imageObj,
      width: back.width(),
      height: back.height(),
      visible: true,
      id: 'bg'
    });

    // add the shape to the layer
    layer.add(bg);
    layer.batchDraw();
    group1.add(bg);
  };
  return imageObj;
}

bg().src = 'assets/fastoup.jpg';

//**checkbox validation to show background image or black background */
function actveBg() {
  // Get the checkbox
  var checkBox = document.getElementById("loadimgbg");
  //get bg from id
  var shape = stage.find('#bg')[0];

  // If the checkbox is checked, display the black bg
  if (checkBox.checked == true){
    
    shape.show();
    layer.batchDraw();
   
  } else {
  
    shape.hide();
    layer.batchDraw();
  }
}



//load image from file in background
const fileSelector = document.getElementById('loadimg');
fileSelector.addEventListener('change', (event) => {

  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    bg().src = event.target.result;
  };

  reader.readAsDataURL(file);


});

//load new image
//load image from file in background
const fileSelector2 = document.getElementById('loadimg2');
fileSelector2.addEventListener('change', (event) => {

  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    console.log("era para carregar");
    dw(event.target.result);
  };

  reader.readAsDataURL(file);


});


//**creting text for our meme xD */
function texto(id, alpha = 1) {

  var inputText = document.getElementById(id);

  var text = new Konva.Text({
    x: 10,
    y: 10,
    fontSize: 30,
    text: inputText.value,
    fill: '#ffffff',
    fontFamily: 'Impact',
    align: 'center',
    stroke: '#4d4d4d',
    strokeWidth: 1.9,
    draggable: true,
    opacity: alpha,
    name: id,

  });
  layer.add(text);


  var MIN_WIDTH = 30;

  var tr = new Konva.Transformer({
    nodes: [text],
    padding: 5,
    name:id,
    // enable only side anchors
    //enabledAnchors: ['middle-left', 'middle-right','top-center','bottom-center'],
    // limit transformer size
    boundBoxFunc: (oldBox, newBox) => {
      if (newBox.width < MIN_WIDTH) {
        return oldBox;
      }
      return newBox;
    },
  });


  layer.add(tr);
  layer.draw();

  text.on('transform', () => {
    // with enabled anchors we can only change scaleX
    // so we don't need to reset height
    // just width

    text.moveToTop();
    text.setAttrs({
      width: Math.max(text.width() * text.scaleX(), MIN_WIDTH),
      fontSize: Math.max(text.fontSize() * text.scaleY(), 5),
      scaleX: 1,
      scaleY: 1,

    });
  });

  //***enable disable tr in layer */
  onEnable = true;
  text.on('dblclick dbltap', function () {

    if (onEnable) {
      tr.visible(false);
      //text.off();

      onEnable = false;
    }
    else {
      tr.visible(true);
      onEnable = true;

    };

  });


  //****event press keyup to edit */
  inputText.addEventListener('keyup', function () {
    tex = inputText.value;
    text.text(tex.toUpperCase());
    layer.draw();
  },
  );

 
  text.on('click tap', () => {
    // hide text node and transformer:
    text.hide();
    tr.hide();

    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    var textPosition = text.absolutePosition();

    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: stage.container().offsetLeft + textPosition.x,
      y: stage.container().offsetTop + textPosition.y,
    };

    // create textarea and style it
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = text.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = text.width() - text.padding() * 2 + 'px';
    textarea.style.height =
      text.height() - text.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = text.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = text.lineHeight();
    textarea.style.fontFamily = text.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = text.align();
    textarea.style.color = text.fill();
    rotation = text.rotation();
    var transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(text.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();

    function removeTextarea() {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
      text.show();
      tr.show();
      tr.forceUpdate();
    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = text.placeholder.length * text.fontSize();
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      var isEdge =
        document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        text.text(textarea.value.toUpperCase());
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener('keydown', function (e) {
      scale = text.getAbsoluteScale().x;
      setTextareaWidth(text.width() * scale);
      textarea.style.height = 'auto';
      textarea.style.height =
        textarea.scrollHeight + text.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        text.text(textarea.value);
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  });

}

var fristText = texto('tx');



function fitStageIntoParentContainer() {
  var container = document.querySelector('#stage-parent');

  // now we need to fit stage into parent
  var containerWidth = container.offsetWidth;
  // to do this we need to scale the stage
  var scale = containerWidth / stageWidth;

  stage.width(stageWidth * scale);
  stage.height(stageHeight * scale);
  stage.scale({ x: scale, y: scale });
  stage.draw();

}

fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);



//**list of news text from input adicionar texto */
SecundaryText = [];
SecundaryInputText = [];


//*****for dowload*******/////
function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


//*****creating html element input *
function newInputText() {

  node = document.getElementById('newText');
  node.insertAdjacentHTML('afterend', '<br><input type="text" name="text1" value="VOU CRIAR UM MEME MANEIRO." class="text' + SecundaryText.length + '" id="text' + SecundaryText.length + '">\
   <button class="text' + SecundaryText.length + '"  onclick="newInputText()">Novo texto</button> <button class="text' + SecundaryText.length + '" onclick="removeText('+ 'text' + SecundaryText.length + ')">Remover</button>\
  ');

  //***push to list of input and text */
  SecundaryInputText.push('text' + (SecundaryInputText.length));

  SecundaryText.push(texto(SecundaryInputText[SecundaryInputText.length - 1]));

}

function removeText(valor) {
  const shape = layer.find('.'+valor.id);
  
 
  shape.destroy();
  layer.draw();
  
  const elements = document.getElementsByClassName(valor.id);

  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }
}



//for modal popup aftar download
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("save");



// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  var shapes = stage.find('Transformer');
  shapes.forEach(function (shape) {
    shape.destroy();
    layer.draw();
    
  });

  modal.style.display = "block";

  var dataURL = stage.toDataURL({ pixelRatio: 3 });
  var w = window.open('about:blank');
  let image = new Image();
  image.src = dataURL;
  setTimeout(function(){
    w.document.write(image.outerHTML);
  }, 0);
  downloadURI(dataURL, 'memegenerator.png');
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

