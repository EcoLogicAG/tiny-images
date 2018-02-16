tinymce.PluginManager.add('ecoimages', function (editor, url) {
  // Add a button that opens a window
  editor.addButton('eco-images', {
    text: 'EcoImages',
    icon: 'image',
    onclick: new Dialog(editor).open
  });

  // Adds a menu item to the tools menu
  editor.addMenuItem('eco-images', {
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


  function createHtml() {

    var imageList = editor.getParam('image_list', false);

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'mce-eco-panel-content');
    for (var imageIndex = 0; imageIndex < imageList.length; imageIndex++) {
      var title = imageList[imageIndex].title;
      var imageDiv = document.createElement('div');
      imageDiv.setAttribute('class', 'mce-eco-image-cell');
      var image = document.createElement('img');
      var imageTitle = document.createElement('p');
      imageTitle.innerHTML = title;
      image.setAttribute('src', imageList[imageIndex].value);
      image.setAttribute('class', 'mce-eco-image');
      image.setAttribute('data-id', title.split(' ').join('-'));
      imageDiv.appendChild(image);
      imageDiv.appendChild(imageTitle);
      contentDiv.appendChild(imageDiv);
    }
    return contentDiv.outerHTML;
  }

  function Dialog(editor) {
    function open() {
      var win = editor.windowManager.open({
        title: 'EcoImages',
        autoScroll: true,
        width: 700,
        height: 500,
        body: [
          {
            type: 'container', html: createHtml()
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

  return {
    getMetadata: function () {
      return {
        title: "EcoImages",
        url: "http://www.ecologic.ch"
      };
    }
  };
});
