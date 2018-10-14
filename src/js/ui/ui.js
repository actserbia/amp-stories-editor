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

                //item on canvas
                title:{
                    toolForEdit:"editText", //tool used to edit this item
                    text:'Dummy Title', //label - text of item
                    //css of item
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
    //manage state of local app
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
    //called on inital load
    function init(){
        let page = data.pages.page1,
            titleCss = page.title.css,
            descriptionCss = page.description.css;

        //finds canvas - phone  and creates interacive html
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
          );
            let dragableItem = $('.dragableText');
            dragableItem.click(clickTextOnCanvassListener);

    }

    function generateInlineCss( obj ){
      //@obj - data.pages.page1.title.css
      //pass css obj and generate string of inline params
        return ( `color:${obj.color};
         font-family:${obj.font};
         font-size:${obj.size}px;
         font-weight:${obj.weight};`);
    }

    function handleChangeBackgroundImage(){
      //when user selecets image appay it to canvas
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
      //returns color selected in color picker
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
      //hides currently active tool in TOOLS panel
        toolsList.find(".active").removeClass("active");
    }

    function showSelectedEditTool( ){
      //triger when clicking on tools icons
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
      // payload model
      // payload   = { data:data.pages[pageName][propName], pageName, propName };
        let data = payload.data;
        state.tools[data.toolForEdit].pageName = payload.pageName;
        state.tools[data.toolForEdit].propName = payload.propName;
        console.log('STATE UPDATED');
        console.log(state.tools[data.toolForEdit]);
    }

    function updateTextColor( color ){
        //updatae Color of selected text
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeColor  = $(`#${pageName} .${propName}`);
        itemToChangeColor.css( {color:color} );

        //set color in global data obj
        data.pages[pageName][propName].css.color = color;
        console.log("New color is " +   data.pages[pageName][propName].css.color );
    }

    function updateFontSize( event ){
    //Update font size with arrows and by typeing
      console.log('FontSize update');
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeFontSIze  = $(`#${pageName} .${propName}`),
            input                 = $('.b-ui__tool__edit-text__item.size input'),
            newFontSize;

        //up-arrow (regular and num-pad)
        if (event.which == 38 || event.which == 104) {
            //make sure to use `parseInt()` so you can numerically add to the value rather than concocting a longer string
            input.val((parseInt(input.val()) + 1));
            newFontSize =  input.val();

            //set new values
            itemToChangeFontSIze.css( {'fontSize': `${newFontSize}px`} );
            //set fontsize in global data obj
            data.pages[pageName][propName].css.size = newFontSize;
            console.log("New font size is: " +   data.pages[pageName][propName].css.size );
        //down-arrow (regular and num-pad)
        } else if (event.which == 40 || event.which == 98) {
            input.val((parseInt(input.val()) - 1));
            newFontSize =  input.val();
            itemToChangeFontSIze.css( {'fontSize': `${newFontSize}px`} );
            //set fontsize in global data obj
            data.pages[pageName][propName].css.size = newFontSize;
            console.log("New font size is: " +   data.pages[pageName][propName].css.size );
        //Enter key
        }else if(event.which == 13) {
          input.val((parseInt(input.val()) - 1));
          newFontSize =  input.val();
          itemToChangeFontSIze.css( {'fontSize': `${newFontSize}px`} );
          //set fontsize in global data obj
          data.pages[pageName][propName].css.size = newFontSize;
          console.log("New font size is: " +   data.pages[pageName][propName].css.size );
       }

    }

    function updateTextLabel( event ){
      //update text
      console.log('Text update');
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeText      = $(`#${pageName} .${propName}`),
            textArea              = $('.b-ui__tool__edit-text__item.label textarea');

            console.log(textArea.val());

            //set new values
            itemToChangeText.text(textArea.val());
            //set new text value in global data obj
            data.pages[pageName][propName].text = textArea.val();
            console.log("New Text is: " +   data.pages[pageName][propName].text );
    }

    function generateEditTxtHTML( payload ){
        let css = payload.data.css;
        $('.b-ui__tool .b-ui__tool__edit-text__inner')
        .empty()
        .append(
            //USE LATER INSIDE to set font weight
            //${css.weight}
            `
              <div class="b-ui__tool__edit-text__item family">
                  <span class='icon'>Aa</span><span class='text'>${css.font}</span>
              </div>
              <div class="b-ui__tool__edit-text__item size">
                  <input class='font-size' type="text" value="${css.size}">
                  <span class='text'>Font Size</span>
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
        let colorPicker = $(".b-ui__tool__edit-text__item.color input"),
            fontSize    = $(".b-ui__tool__edit-text__item.size input"),
            label       = $(".b-ui__tool__edit-text__item.label textarea")
        colorPicker.on('change', function(){
            let color = getPickedColor();
            updateTextColor(color);
            $('.b-ui__tool__edit-text__item.color .text').text(color);
        })

        fontSize.on('keyup', updateFontSize);
        label.on('keyup', updateTextLabel);
    }

    function getJSON(){
      //get JSON from GLOBAL data obj
      console.log(JSON.stringify(data))
    }

    function isTextInEditMode( payload ){
      //check if
      //element interacted with on canvas is already displayed in edit Tools box
      let toolState = state.tools.editText,
          textTool = $(".b-ui__tool__edit-text");
        if( toolState.pageName == payload.pageName && toolState.propName == payload.propName ){
          return true
        }
        return false
    }

    function generateAndShowEditTextTool( payload ){
      // payload model
      // payload   = { data:data.pages[pageName][propName], pageName, propName };
        console.log('text tool called');
        console.log(payload);
        let toolState = state.tools.editText,
            textTool = $(".b-ui__tool__edit-text");

        if( textTool.hasClass('active') ){
            //if text tool is active in tools panel
            if(  isTextInEditMode( payload ) ){
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

    function selectItem( item ){
      //display styles( border box ) on selecetd item on canvas
      if( !item.hasClass('selected')){
        //if item is not selecetd
        $('.c-canvas--center').find('.dragableText.selected')
        .removeClass('selected');
        item.addClass('selected');
      }else{
        //if item is selecetd
      }
    }

    function dragTextStartListener (event) {
      //when text drag on canvas STARTS
         let target    = event.target,
             pageName  = target.getAttribute("data-page"),
             propName  = target.getAttribute("data-name"),
             payload   = { data:data.pages[pageName][propName], pageName, propName };

        console.log(target.classList[0]);
         generateAndShowEditTextTool( payload );
         selectItem($('.'+target.classList[0]));

         //match icon in tools menu with draged element
         if(!$(".c-ui-btn--edit-text").hasClass('selected')){
             $('.b-ui__menu .c-ui-btn.selected').removeClass("selected");
             //add white color on icon
             $(".c-ui-btn--edit-text").addClass("selected");
         }

    }
    function clickTextOnCanvassListener (event) {
      //when user click text on canvas
         //let target    = event.target;
         let target   = $(this),
             pageName  = target.attr("data-page"),
             propName  = target.attr("data-name"),
             payload   = { data:data.pages[pageName][propName], pageName, propName };
         if( !isTextInEditMode( payload ) ){
           generateAndShowEditTextTool( payload );
           selectItem( target );
           //match icon in tools menu with draged element
           if(!$(".c-ui-btn--edit-text").hasClass('selected')){
               $('.b-ui__menu .c-ui-btn.selected').removeClass("selected");
               //add white color on icon
               $(".c-ui-btn--edit-text").addClass("selected");
           }
         }
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
    $('.get-json').click(getJSON);

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
