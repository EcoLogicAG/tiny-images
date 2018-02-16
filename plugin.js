tinymce.PluginManager.add('image', function (editor, url) {

  var getImageList = function (editor) {
    return editor.getParam('image_list', false);
  };

  var createImageList = function (editor, callback) {
    var imageList = ecoMapping.getImageList(editor);
    if (typeof imageList === 'string') {
      XHR.send({
        url: imageList,
        success: function (text) {
          callback(JSON.parse(text));
        }
      });
    } else if (typeof imageList === 'function') {
      imageList(callback);
    } else {
      callback(imageList);
    }
  };

  var createHtml = function (imageList) {
    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'mce-eco-panel-content');
    for (var imageIndex = 0; imageIndex < imageList.length; imageIndex++) {
      var title = imageList[imageIndex].text;
      console.log(imageList[imageIndex]);
      var imageDiv = document.createElement('div');
      imageDiv.setAttribute('class', 'mce-eco-image-cell');
      var image = document.createElement('img');
      var imageTitle = document.createElement('p');
      imageTitle.setAttribute('class', 'mce-eco-image-title');
      imageTitle.innerHTML = title;
      image.setAttribute('src', imageList[imageIndex].value);
      image.setAttribute('class', 'mce-eco-image');
      image.setAttribute('data-id', title.split(' ').join('-'));
      imageDiv.appendChild(image);
      imageDiv.appendChild(imageTitle);
      contentDiv.appendChild(imageDiv);
    }
    return contentDiv.outerHTML;
  };

  var register = function (editor) {
    // Add a button that opens a window
    editor.addButton('image', {
      text: '',
      icon: 'image',
      onclick: new Dialog(editor).open
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('image', {
      text: 'EcoImages',
      context: 'insert',
      onclick: new Dialog(editor).open
    });

    // Include Plugin Css
    editor.on('init', function () {
      var cssLink = editor.dom.create('link', {
        rel: 'stylesheet',
        href: url + '/styles.css'
      });
      document.getElementsByTagName('head')[0].appendChild(cssLink);
    });
  };

  var ecoMapping = {
    getImageList: getImageList,
    createImageList: createImageList,
    createHtml: createHtml,
    register: register
  };

  function Dialog(editor) {

    function open() {
      ecoMapping.createImageList(editor, showDialog);
    }

    function showDialog(imageList) {
      var win = editor.windowManager.open({
        title: 'Images',
        autoScroll: false,
        width: 900,
        height: 500,
        body: [
          {
            type: 'container', html: ecoMapping.createHtml(imageList)
          }
        ],
        buttons: [{
          text: 'Close',
          onClick: 'close'
        }]
      });

      var imageDivs = document.querySelectorAll('.mce-eco-image');
      for (var i = 0; i < imageDivs.length; i++) {
        imageDivs[i].addEventListener('click', function () {
          var image = document.createElement('img');
          image.setAttribute('src', this.getAttribute('src'));
          editor.insertContent(image.outerHTML);
          win.close();
        });
      }
    }

    return {open: open}
  }

  register(editor);

  return {
    getMetadata: function () {
      return {
        title: "EcoImages",
        url: "http://www.ecologic.ch"
      };
    }
  };
});
