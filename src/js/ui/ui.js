var $ = require('jquery');
//var interact = require('interactjs');
var GS      = require('./partials/globalSettings.js');
var SLIDER  = require('./partials/slider.js');

/*MODULE EXPORT*/
module.exports = function( ) {

    var data = {
        story:{
            pagesCount:1,
            title:'AMP story builder',
            publisher:'Diwanee Serbia',
            publisherLogoSrc:'src/logo.jpg',
            posterPortraitSrc:'src/posterPortrait.jpg',
            ads:false
        },

        pages:{
            page1:{
                id:1,

                background:{
                    toolForEdit:"editBcg",
                    src:"/assets/img/placeholder.jpg",
                },

                //item on canvas
                title:{
                    toolForEdit:"editText", //tool used to edit this item
                    text:'Dummy Title', //label - text of item
                    //css of item
                    css:{
                        color:"#ff0000",
                        font:"Arial Black",
                        size:"32",
                        weight:'400',
                        decoration: "none",
                        align:'left',
                        x:'30',
                        y:'50',
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
                        decoration: "none",
                        align:'left',
                        x:'30',
                        y:'300',
                    }
                }
            }
        },

        slider:{
            count:0,
            currentSlide:0,
        }
    };
    //cashing vars
    let ui                   = $(".b-ui"),
        uiMain               = ui.find(".b-ui__main"),
        toolsList            = ui.find(".b-ui__tools"),
        uiBtns               = ui.find(".c-ui-btn"),
        editBackgroundTool   = ui.find(".b-ui__tool__edit-bcg"),
        editTextTool         = ui.find(".b-ui__tool__edit-text"),
        backgroundThumbs     = ui.find(".b-ui__tool__edit-bcg__item"),
        leftSlide            = ui.find(".c-canvas--center"),
        centerSlide          = ui.find(".c-canvas--center"),
        rightSlide           = ui.find(".c-canvas--center");

    //states
    //manage state of local app
    let state = {
        tools:{
            editBcg:{
                src:"/assets/img/placeholder.jpg",
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

        SLIDER.addSlide(uiMain, data);//generate first empty slideshow - canvas

        let dragableItem = $('.dragableText');
        dragableItem.click(clickTextOnCanvassListener);

        //generate general settings tool tab
        GS.generateGlobalSettings( ui, data.story)

    }

    function handleChangeBackgroundImage(){
      //when user selecets image appay it to canvas
        let self = $(this);

        let target   = $('.c-canvas--center .c-canvas__bcg-img'),
            pageName  = target.attr("data-page"),
            propName  = target.attr("data-name"),
            payload   = { data:data.pages[pageName][propName], pageName, propName };

        console.log(payload);

        if( !self.hasClass('selected') ) {
            //if image is not selecetd
            $(".b-ui__tool__edit-bcg .selected").removeClass('selected');
            self.addClass('selected');
            let canvasBackground  = ui.find(".c-canvas--center .c-canvas__bcg-img img");
            canvasBackground.attr('src', self.attr("data-src") );
            setToolState(payload);
            data.pages[pageName][propName].src = self.attr("data-src");//set new bcg img src
            console.log(state);
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

    function showSelectedEditTool( event ){
      event.stopPropagation();
      //triger when clicking on tools icons
        let self = $(this),
            toolToActivate  = $(`.b-ui__tool__${self.attr("data-toolclass")}`),
            canvas          = $('.b-ui__main__inner.canvas'),
            canvasBcg       = $('.b-ui__main__inner.reposition-background');

            console.log(self.data('toolclass'));

            // if(self.data('toolclass') == 'edit-bcg'){
            //     //Show edit background if background icon is cliked in menu
            //     canvas.hide( 250, function(){
            //         canvasBcg.show( 250 );
            //     });
            // }else{
            //     //Hide edit background if background icon is NOT cliked in menu
            //     canvasBcg.hide( 250, function(){
            //         canvas.show( 250 );
            //     });
            // }

            if(self.data('toolclass') != 'edit-text'){
                //if menu icon is NOT edit text - deselect all text on canvas
                $('.c-canvas--center .selected').removeClass('selected');
            }

            if(!self.hasClass('selected')){
                //if cliced icon in menu is not selected
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

    function updateFontBold( event ){
     //Update font weight when slider is clicked
        console.log('FontWeight updated');
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeWeight  = $(`#${pageName} .${propName}`),
            newWeight = event.target.checked ?'700' :'400';

        itemToChangeWeight.css( {'font-weight': `${newWeight}`} );

        //set fontWeight in global data obj
        data.pages[pageName][propName].css.weight = newWeight;
        console.log("New font weight is: " +   data.pages[pageName][propName].css.weight );
    }
    function updateFontItalic( event ){
     //Update font Italic style when slider is clicked
        console.log('FontItalic updated');
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeItalic  = $(`#${pageName} .${propName}`),
            newItalicVal = event.target.checked ?'italic' :'normal';

        itemToChangeItalic.css( {'font-style': `${newItalicVal}`} );

        //set fontWeight in global data obj
        data.pages[pageName][propName].css.style = newItalicVal;
        console.log("New font style is: " +   data.pages[pageName][propName].css.style );
    }
    function updateFontUnderline( event ){
     //Update font Underline style when slider is clicked
        console.log('Font Underline updated');
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeUnderline  = $(`#${pageName} .${propName}`),
            newUnderlineVal = event.target.checked ?'underline' :'none';

        itemToChangeUnderline.css( {'text-decoration': `${newUnderlineVal}`} );

        //set fontWeight in global data obj
        data.pages[pageName][propName].css.decoration = newUnderlineVal;
        console.log("New font style is: " +   data.pages[pageName][propName].css.decoration );
    }
    function updateTextCenter( event ){
     //Update font Underline style when slider is clicked
        console.log('Font Alignment updated');
        let pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChange  = $(`#${pageName} .${propName}`),
            newAlignVal = event.target.checked ?'center' :'left';

        itemToChange.css( {'text-align': `${newAlignVal}`} );

        //set fontWeight in global data obj
        data.pages[pageName][propName].css.align = newAlignVal;
        console.log("New text alignment is: " +   data.pages[pageName][propName].css.align );
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
          input.val((parseInt(input.val())));
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
        let css = payload.data.css,
            isBold = css.weight == '400' ?'' : 'checked',
            isItalic = css.style == 'normal' ?'' :'checked',
            isUnderline = css.decoration == 'none' ?'' :'checked',
            isCenter = css.align == 'left' ?'' :'checked';
        $('.b-ui__tool .b-ui__tool__edit-text__inner')
        .empty()
        .append(
            //USE LATER INSIDE to set font weight
            //${css.weight}
            `
              <div class="b-ui__tool__edit-text__item family">
                  <span class='icon'>Aa</span>
                  <div class='list'>
                    <span class='selected'>${css.font}</span>
                    <ul>
                        <li data-font='Arial'> Arial </li>
                        <li data-font='Arial Black'> Arial Black</li>
                        <li data-font='Helvetica'> Helvetica </li>
                        <li data-font='Times'> Times </li>
                        <li data-font='Verdana'> Verdana </li>
                        <li data-font='Georgia'> Georgia </li>
                        <li data-font='Palatino'> Palatino </li>
                        <li data-font='Bookman'> Bookman </li>
                    </ul>
                  </div>
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
              <div class="b-ui__tool__edit-text__item add-remove">
                    <div class='item'>
                        <span class='btn'>+</span>
                        <span class='label'>Add Label</span>
                    </div>
                    <div class='item'>
                        <span class='btn'>-</span>
                        <span class='label'>Delete Label</div>
                    </div>
              </div>
              <div class="b-ui__tool__edit-text__item label">
                  <textarea rows="10">${payload.data.text}</textarea>
              </div>
              <div class="b-ui__tool__edit-text__item switches">
                  <label class="c-switch" for='bold'>
                    <input type="checkbox" id='bold' ${isBold}>
                    <span class="slider round"></span>
                    <span class='c-switch__title'>Bold</span>
                  </label>
                  <label class="c-switch" for='italic'>
                    <input type="checkbox" id='italic' ${isItalic}>
                    <span class="slider round"></span>
                    <span class='c-switch__title'>Italic</span>
                  </label>
                  <label class="c-switch" for='underline'>
                    <input type="checkbox" id='underline' ${isUnderline}>
                    <span class="slider round"></span>
                    <span class='c-switch__title'>Underline</span>
                  </label>
                  <label class="c-switch" for='center'>
                    <input type="checkbox" id='center' ${isCenter}>
                    <span class="slider round"></span>
                    <span class='c-switch__title'>Center</span>
                  </label>
              </div>
            `
        );
        let colorPicker     = $(".b-ui__tool__edit-text__item.color input"),
            fontSize        = $(".b-ui__tool__edit-text__item.size input"),
            label           = $(".b-ui__tool__edit-text__item.label textarea"),
            bold            = $(".b-ui__tool__edit-text__item.switches #bold"),
            italic          = $(".b-ui__tool__edit-text__item.switches #italic"),
            underline       = $(".b-ui__tool__edit-text__item.switches #underline"),
            center          = $(".b-ui__tool__edit-text__item.switches #center"),
            fontSelected    = $(".b-ui__tool__edit-text__item.family .selected"),
            fontList        = $(".b-ui__tool__edit-text__item.family .list ul"),
            fontListItem    = fontList.find('li');
        colorPicker.on('change', function(){
            let color = getPickedColor();
            updateTextColor(color);
            $('.b-ui__tool__edit-text__item.color .text').text(color);
        })

        fontSize.on('keyup', updateFontSize);
        label.on('keyup', updateTextLabel);
        bold.on('click', updateFontBold);
        italic.on('click', updateFontItalic);
        underline.on('click', updateFontUnderline);
        center.on('click', updateTextCenter);
        fontSelected.on('click', function(){
            fontList.slideToggle()
        });
        fontListItem.on('click', function(){
            let item = $(this),
                newFontName = item.data('font'),
                pageName = state.tools.editText.pageName,
                propName = state.tools.editText.propName,
                itemToChangeFontFamily = $(`#${pageName} .${propName}`);
            console.log(newFontName);

            itemToChangeFontFamily.css( {'font-family': `${newFontName}`} );//apply css
            data.pages[pageName][propName].css.font = newFontName;//update global data
            fontList.slideUp(200);//hide menu
            fontSelected.text(newFontName); //change selected font text
        })
    }

    function getJSON(){
      //get JSON from GLOBAL data obj
      console.log(JSON.stringify(data))
    }

    function isTextInEditMode( payload ){
      //check if
      //element interacted with on canvas is already displayed in edit Tools box
      let toolState = state.tools.editText,
          textTool = $(".b-ui__tool__edit-text"),
          isTextToolActive = $('.c-ui-btn--edit-text').hasClass('selected');

          console.log(toolState);

        if( toolState.pageName == payload.pageName && toolState.propName == payload.propName && isTextToolActive ){
          return true
        }
        return false
    }

    function deselectAllTextOnCanvas( event ){
        event.stopPropagation();
        $('.c-canvas--center .selected').removeClass('selected');
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

    function clickTextOnCanvassListener (event) {
        event.stopPropagation();
        console.log('klik');

      //when user click text on canvas
         //let target    = event.target;
         let target   = $(this),
             pageName  = target.attr("data-page"),
             propName  = target.attr("data-name"),
             payload   = { data:data.pages[pageName][propName], pageName, propName };
        console.log({"isTextToolActive":isTextInEditMode( payload )});
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

    function dragTextStartListener (event) {
      //when text drag on canvas STARTS
         let target    = event.target,
             pageName  = target.getAttribute("data-page"),
             propName  = target.getAttribute("data-name"),
             payload   = { data:data.pages[pageName][propName], pageName, propName };

        console.log(target.classList[0]);
         generateAndShowEditTextTool( payload );
         selectItem($('.c-canvas--center .'+target.classList[0]));

         //match icon in tools menu with draged element
         if(!$(".c-ui-btn--edit-text").hasClass('selected')){
             $('.b-ui__menu .c-ui-btn.selected').removeClass("selected");
             //add white color on icon
             $(".c-ui-btn--edit-text").addClass("selected");
         }

    }
    function dragTextEndListener (event) {
      //when text drag on canvas STARTS
         let target    = event.target,
             pageName  = target.getAttribute("data-page"),
             propName  = target.getAttribute("data-name"),
             payload   = { data:data.pages[pageName][propName], pageName, propName };

        data.pages[pageName][propName].css.x = target.getAttribute('data-x');
        data.pages[pageName][propName].css.y = target.getAttribute('data-y');
        console.log('DRAG END');
        console.log('X: ',target.getAttribute('data-x'));
        console.log('Y: ',target.getAttribute('data-y'));
    }

    function dragTextMoveListener (event) {
      console.log(event.target.getAttribute('data-x'));
      var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;


      // translate the element
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    function bindInteractJS(){
        interact('.dragableText')
        .draggable({
           restrict: {
             restriction: "parent",
             endOnly: true,
             elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
           },
           onmove: dragTextMoveListener,
           onstart: dragTextStartListener,
           onend: dragTextEndListener
       })
       //
       //  interact('.dragableImg')
       //  .draggable({
       //     restrict: {
       //       restriction: "parent",
       //       endOnly: true,
       //       elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
       //     },
       //     //onmove: dragTextMoveListener,
       //    // onstart: dragTextStartListener,
       //     //onend: dragTextEndListener
       // })
        console.log('bind interactJS');
    }

    function unbindInteractJS(){
       interact('.dragableText').unset();
       console.log('unbind interactJS');
    }

    //FUNCTION IVOCATIONS
    init();
    backgroundThumbs.click( handleChangeBackgroundImage );
    uiBtns.click( showSelectedEditTool );
    uiMain.click(deselectAllTextOnCanvas);//desecelt text on canvas
    $('.get-json').click(getJSON);
    $('.b-ui__tool__edit-layout__add-remove .item').click( function(){
        console.log('NEW SLIDE');
        //unbindInteractJS();
        //$('.dragableText').off(clickTextOnCanvassListener);
        SLIDER.addSlide(uiMain, data);
        $('.dragableText').click(clickTextOnCanvassListener);
        //bindInteractJS();
    });
    $('.control.left').click(function(){
        //unbindInteractJS()
        console.log('PREV SLIDE');
        SLIDER.prevSlide(uiMain, data);
        $('.dragableText').click(clickTextOnCanvassListener);
        //bindInteractJS();
    });
    $('.control.right').click(function(){
        //unbindInteractJS()
        console.log('Next SLIDE');
        SLIDER.nextSlide(uiMain, data);
        $('.dragableText').click(clickTextOnCanvassListener);
        //bindInteractJS();
    });
    bindInteractJS('.dragableText');
};
