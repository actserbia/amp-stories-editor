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
                        color:"#ffffff;",
                        font:"Impact",
                        size:"32",
                        weight:'400'
                    }
                },

                description:{
                    toolForEdit:"editText",
                    text:'Dummy Description text, type here your content.',
                    css:{
                        color:"#ffffff;",
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
                    style="${generateInlineCss(titleCss)}"
                    >${page.title.text}</h1>
                </div>
                <div class="c-canvas__description dragableText" data-page="page${page.id}" data-name="description">
                    <p
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

    function hideActiveTool(){
        toolsList.find(".active").removeClass("active");
    }

    function showSelectedEditTool( ){
        let self = $(this),
            toolToActivate  = $(`.b-ui__tool__${self.attr("data-toolClass")}`);
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

    }

    function generateAndShowEditTextTool( payload ){
        console.log('text tool called');
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
                generateEditTxtHtml();
            }
        }else{
            hideActiveTool();
            setToolState(payload);
            generateEditTxtHtml();
            textTool.addClass('active');
            //fill with settings for draged text
        }

        function generateEditTxtHtml(){
            //local function to generate inner html of editText Tool
            $('.b-ui__tool .b-ui__tool__edit-text__inner')
            .empty()
            .append(
                ` <p>Title:${payload.data.text}</p>
                  <p>Color:${css.color}</p>
                  <p>Font-family:${css.font}</p>
                  <p>Font-Size:${css.size}</p>
                  <p>Font-Weight:${css.weight}</p>
                `
            )
        }
    }

    function dragTextStartListener (event) {
         let target    = event.target,
             pageName  = target.getAttribute("data-page"),
             propName  = target.getAttribute("data-name"),
             payload   = { data:data.pages[pageName][propName], pageName, propName };
         console.log(payload);
         generateAndShowEditTextTool( payload )
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
