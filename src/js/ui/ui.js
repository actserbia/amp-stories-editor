var $ = require('jquery');
//var interact = require('interactjs');

/*MODULE EXPORT*/
module.exports = function( ) {
    var data = {
        stroy:{
            pagesCount:1,
            title:'',
            publisher:''
        },

        pages:{
            page1:{
                id:1,

                background:{
                    toolForEdit:"edit-bcg",
                    src:"img/placeholder.jpg",
                },

                title:{
                    toolForEdit:"editText",
                    text:'Dummy Title',
                    css:{
                        color:"#ff0000",
                        font:"Impact",
                        size:"32",
                        weight:'400'
                    }
                },

                description:{
                    toolForEdit:"editText",
                    text:'Dummy Description text, type here your content.',
                    css:{
                        color:"#ffffff",
                        font:"Helvetica",
                        size:"24",
                        weight:'400',
                    }
                }
            }
        }
    };
    //cashing vars
    let ui = $(".b-ui"),
        toolsList            = ui.find(".b-ui__tools"),
        uiBtns               = ui.find(".c-ui-btn"),
        editBackgroundTool   = ui.find(".b-ui__tool__edit-bcg"),
        editTextTool         = ui.find(".b-ui__tool__edit-text"),
        backgroundThumbs     = ui.find(".b-ui__tool__edit-bcg__item");

    //states
    let state = {
        tools:{
            edtiBcg:{
                //src:"img/placeholder.jpg",
                pageName:'page1',
                propName:'background',
            },
            editText:{
                pageName:'page1',
                propName:'',
            }
        }
    };
    //FUNCTION DEFINITIONS
    function init(){
        let page = data.pages.page1,
            titleCss = page.title.css,
            descriptionCss = page.description.css;

        ui.find(".c-canvas--center").append(
            ` <div class="" id='page${page.id}'>
                <div class="c-canvas__bcg-img">
                    <img src="${page.background.src}" alt="">
                </div>
                <div class="c-canvas__title dragableText" data-page="page${page.id}" data-name="title">
                    <h1
                    class="title"
                    style="${generateInlineCss(titleCss)}"
                    >${page.title.text}</h1>
                </div>
                <div class="c-canvas__description dragableText" data-page="page${page.id}" data-name="description">
                    <p
                    class="description"
                    style="${generateInlineCss(descriptionCss)}"
                    >${page.description.text}</p>
                </div>
            </div>`
        )
    }

    function generateInlineCss( obj ){
        return ( `color:${obj.color};
         font-family:${obj.font};
         font-size:${obj.size}px;
         font-weight:${obj.weight};`);
    }

    function handleChangeBackgroundImage(){
        let self = $(this);

        if( !self.hasClass('selected') ) {
            //if image is not selecetd
            $(".b-ui__tool__edit-bcg .selected").removeClass('selected');
            self.addClass('selected');
            let canvasBackground  = ui.find(".c-canvas--center .c-canvas__bcg-img img");
            canvasBackground.attr('src', self.attr("data-src") );
        }
    }

    function getPickedColor(){
        let colorPicker = $(".b-ui__tool__edit-text__item.color input");
        if( colorPicker ){
            return colorPicker.val();
        }
    }

    function handleTextColorChange(){
        let color = getPickedColor();
        //updateEditTextHTML();
        //updateStylesInCanvas();
    }


    function hideActiveTool(){
        toolsList.find(".active").removeClass("active");
    }

    function showSelectedEditTool( ){
        let self = $(this),
            toolToActivate  = $(`.b-ui__tool__${self.attr("data-toolClass")}`);

            if(!self.hasClass('selected')){
                $('.b-ui__menu .c-ui-btn.selected').removeClass("selected");
                //add white color on icon
                self.addClass("selected");
            }
            //if tool is not active
            if( !toolToActivate.hasClass('active') ){
                //hide current active tool
                hideActiveTool();
                //show selected tool
                toolToActivate.addClass('active');
            }
    }

    function setToolState(payload){
        let data = payload.data;
        state.tools[data.toolForEdit].pageName = payload.pageName;
        state.tools[data.toolForEdit].propName = payload.propName;
        console.log('STATE UPDATED');
        console.log(state.tools[data.toolForEdit]);
    }

    function updateTextColor( color ){
        //updatae Data
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeColor  = $(`#${pageName} .${propName}`);
        itemToChangeColor.css( {color:color} );

        //set color in global data obj
        data.pages[pageName][propName].css.color = color;
        console.log(data.pages);
    }

    function generateEditTxtHTML( payload ){
        let css = payload.data.css;
        $('.b-ui__tool .b-ui__tool__edit-text__inner')
        .empty()
        .append(
            //USE LETER INSIDE
            //${css.weight}
            `
              <div class="b-ui__tool__edit-text__item family">
                  <span class='icon'>Aa</span><span class='text'>${css.font}</span>
              </div>
              <div class="b-ui__tool__edit-text__item size">
                  <span class='icon'><span>48</span></span><span class='text'>${css.size}</span>
              </div>
              <div class="b-ui__tool__edit-text__item color">
                  <span class='icon'>
                      <input type="color" name="favcolor" value="${css.color}">
                  </span>
                  <span class='text'>${css.color}</span>
              </div>
              <div class="b-ui__tool__edit-text__item label">
                  <textarea rows="10" cols="40">${payload.data.text}</textarea>
              </div>
              <div class="b-ui__tool__edit-text__item-switches">
                  <label class="c-switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                    <span class='c-switch__title'>Regular</span>
                  </label>
              </div>
            `
        );
        let colorPicker = $(".b-ui__tool__edit-text__item.color input");
        colorPicker.on('change', function(){
            let color = getPickedColor();
            updateTextColor(color);
            $('.b-ui__tool__edit-text__item.color .text').text(color);
        })
    }

    function generateAndShowEditTextTool( payload ){
        console.log('text tool called');
        console.log(payload);
        let css = payload.data.css,
            toolState = state.tools.editText,
            textTool = $(".b-ui__tool__edit-text");

        if( textTool.hasClass('active') ){
            //if text tool is active in tools panel
            if( toolState.pageName == payload.pageName && toolState.propName == payload.propName ){
                //if interacted text is displayed in tools panel
                console.log('ALREADY ACTIVE - RETURN');
                return
            }else{
                //if interact element is not on display
                setToolState(payload);
                generateEditTxtHTML( payload );
            }
        }else{
            hideActiveTool();
            setToolState(payload);
            generateEditTxtHTML( payload );
            textTool.addClass('active');
            //fill with settings for draged text
        }
    }

    function dragTextStartListener (event) {
         let target    = event.target,
             pageName  = target.getAttribute("data-page"),
             propName  = target.getAttribute("data-name"),
             payload   = { data:data.pages[pageName][propName], pageName, propName };
         console.log(payload);
         console.log(getPickedColor());
         generateAndShowEditTextTool( payload )
         console.log(state);
    }

    function dragTextMoveListener (event) {
      var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;


      // translate the element
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    //FUNCTION IVOCATIONS
    init();
    backgroundThumbs.click( handleChangeBackgroundImage );
    uiBtns.click( showSelectedEditTool );

    interact('.dragableText')
    .draggable({
       restrict: {
         restriction: "parent",
         endOnly: true,
         elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
       },
       onmove: dragTextMoveListener,
       onstart: dragTextStartListener,

   })
};
