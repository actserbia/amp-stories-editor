webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ----- Main app file

// ----- Path to main SCSS file
var css = __webpack_require__(2);

// ----- Require modules here
var ui = __webpack_require__(4);

// ----- Call modules here
ui();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(0);
//var interact = require('interactjs');
var GS = __webpack_require__(5);
var SLIDER = __webpack_require__(6);

/*MODULE EXPORT*/
module.exports = function () {

    var data = {
        story: {
            pagesCount: 1,
            title: 'AMP story builder',
            publisher: 'Diwnaee Serbia',
            publisherLogoSrc: 'src/logo.jpg',
            posterPortraitSrc: 'src/posterPortrait.jpg'
        },

        pages: {
            page1: {
                id: 1,

                background: {
                    toolForEdit: "editBcg",
                    src: "/assets/img/placeholder.jpg"
                },

                //item on canvas
                title: {
                    toolForEdit: "editText", //tool used to edit this item
                    text: 'Dummy Title', //label - text of item
                    //css of item
                    css: {
                        color: "#ff0000",
                        font: "Impact",
                        size: "32",
                        weight: '400'
                    }
                },

                description: {
                    toolForEdit: "editText",
                    text: 'Dummy Description text, type here your content.',
                    css: {
                        color: "#ffffff",
                        font: "Helvetica",
                        size: "24",
                        weight: '400'
                    }
                }
            }
        },

        slider: {
            count: 0,
            currentSlide: 0
        }
    };
    //cashing vars
    var ui = $(".b-ui"),
        uiMain = ui.find(".b-ui__main"),
        toolsList = ui.find(".b-ui__tools"),
        uiBtns = ui.find(".c-ui-btn"),
        editBackgroundTool = ui.find(".b-ui__tool__edit-bcg"),
        editTextTool = ui.find(".b-ui__tool__edit-text"),
        backgroundThumbs = ui.find(".b-ui__tool__edit-bcg__item"),
        leftSlide = ui.find(".c-canvas--center"),
        centerSlide = ui.find(".c-canvas--center"),
        rightSlide = ui.find(".c-canvas--center");

    //states
    //manage state of local app
    var state = {
        tools: {
            editBcg: {
                src: "/assets/img/placeholder.jpg",
                pageName: 'page1',
                propName: 'background'
            },
            editText: {
                pageName: 'page1',
                propName: ''
            }
        }
    };

    //FUNCTION DEFINITIONS
    //called on inital load
    function init() {
        var page = data.pages.page1,
            titleCss = page.title.css,
            descriptionCss = page.description.css;

        SLIDER.addSlide(uiMain, data); //generate first empty slideshow - canvas

        var dragableItem = $('.dragableText');
        dragableItem.click(clickTextOnCanvassListener);

        //generate general settings tool tab
        GS.generateGlobalSettings(ui, data.story);
    }

    function generateInlineCss(obj) {
        //@obj - data.pages.page1.title.css
        //pass css obj and generate string of inline params
        return 'color:' + obj.color + ';\n         font-family:' + obj.font + ';\n         font-size:' + obj.size + 'px;\n         font-weight:' + obj.weight + ';';
    }

    function handleChangeBackgroundImage() {
        //when user selecets image appay it to canvas
        var self = $(this);

        var target = $('.c-canvas--center .c-canvas__bcg-img'),
            pageName = target.attr("data-page"),
            propName = target.attr("data-name"),
            payload = { data: data.pages[pageName][propName], pageName: pageName, propName: propName };

        console.log(payload);

        if (!self.hasClass('selected')) {
            //if image is not selecetd
            $(".b-ui__tool__edit-bcg .selected").removeClass('selected');
            self.addClass('selected');
            var canvasBackground = ui.find(".c-canvas--center .c-canvas__bcg-img img");
            canvasBackground.attr('src', self.attr("data-src"));
            setToolState(payload);
            data.pages[pageName][propName].src = self.attr("data-src"); //set new bcg img src
            console.log(state);
        }
    }

    function getPickedColor() {
        //returns color selected in color picker
        var colorPicker = $(".b-ui__tool__edit-text__item.color input");
        if (colorPicker) {
            return colorPicker.val();
        }
    }

    function handleTextColorChange() {
        var color = getPickedColor();
        //updateEditTextHTML();
        //updateStylesInCanvas();
    }

    function hideActiveTool() {
        //hides currently active tool in TOOLS panel
        toolsList.find(".active").removeClass("active");
    }

    function showSelectedEditTool(event) {
        event.stopPropagation();
        //triger when clicking on tools icons
        var self = $(this),
            toolToActivate = $('.b-ui__tool__' + self.attr("data-toolclass"));

        console.log(self.data('toolclass'));

        if (self.data('toolclass') != 'edit-text') {
            //if menu icon is NOT edit text - deselect all text on canvas
            $('.c-canvas--center .selected').removeClass('selected');
        }

        if (!self.hasClass('selected')) {
            //if cliced icon in menu is not selected
            $('.b-ui__menu .c-ui-btn.selected').removeClass("selected");
            //add white color on icon
            self.addClass("selected");
        }
        //if tool is not active
        if (!toolToActivate.hasClass('active')) {
            //hide current active tool
            hideActiveTool();
            //show selected tool
            toolToActivate.addClass('active');
        }
    }

    function setToolState(payload) {
        // payload model
        // payload   = { data:data.pages[pageName][propName], pageName, propName };
        var data = payload.data;
        state.tools[data.toolForEdit].pageName = payload.pageName;
        state.tools[data.toolForEdit].propName = payload.propName;
        console.log('STATE UPDATED');
        console.log(state.tools[data.toolForEdit]);
    }

    function updateTextColor(color) {
        //updatae Color of selected text
        var pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeColor = $('#' + pageName + ' .' + propName);
        itemToChangeColor.css({ color: color });

        //set color in global data obj
        data.pages[pageName][propName].css.color = color;
        console.log("New color is " + data.pages[pageName][propName].css.color);
    }

    function updateFontSize(event) {
        //Update font size with arrows and by typeing
        console.log('FontSize update');
        var pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeFontSIze = $('#' + pageName + ' .' + propName),
            input = $('.b-ui__tool__edit-text__item.size input'),
            newFontSize = void 0;

        //up-arrow (regular and num-pad)
        if (event.which == 38 || event.which == 104) {
            //make sure to use `parseInt()` so you can numerically add to the value rather than concocting a longer string
            input.val(parseInt(input.val()) + 1);
            newFontSize = input.val();

            //set new values
            itemToChangeFontSIze.css({ 'fontSize': newFontSize + 'px' });
            //set fontsize in global data obj
            data.pages[pageName][propName].css.size = newFontSize;
            console.log("New font size is: " + data.pages[pageName][propName].css.size);
            //down-arrow (regular and num-pad)
        } else if (event.which == 40 || event.which == 98) {
            input.val(parseInt(input.val()) - 1);
            newFontSize = input.val();
            itemToChangeFontSIze.css({ 'fontSize': newFontSize + 'px' });
            //set fontsize in global data obj
            data.pages[pageName][propName].css.size = newFontSize;
            console.log("New font size is: " + data.pages[pageName][propName].css.size);
            //Enter key
        } else if (event.which == 13) {
            input.val(parseInt(input.val()));
            newFontSize = input.val();
            itemToChangeFontSIze.css({ 'fontSize': newFontSize + 'px' });
            //set fontsize in global data obj
            data.pages[pageName][propName].css.size = newFontSize;
            console.log("New font size is: " + data.pages[pageName][propName].css.size);
        }
    }

    function updateTextLabel(event) {
        //update text
        console.log('Text update');
        var pageName = state.tools.editText.pageName,
            propName = state.tools.editText.propName,
            itemToChangeText = $('#' + pageName + ' .' + propName),
            textArea = $('.b-ui__tool__edit-text__item.label textarea');

        console.log(textArea.val());

        //set new values
        itemToChangeText.text(textArea.val());
        //set new text value in global data obj
        data.pages[pageName][propName].text = textArea.val();
        console.log("New Text is: " + data.pages[pageName][propName].text);
    }

    function generateEditTxtHTML(payload) {
        var css = payload.data.css;
        $('.b-ui__tool .b-ui__tool__edit-text__inner').empty().append(
        //USE LATER INSIDE to set font weight
        //${css.weight}
        '\n              <div class="b-ui__tool__edit-text__item family">\n                  <span class=\'icon\'>Aa</span><span class=\'text\'>' + css.font + '</span>\n              </div>\n              <div class="b-ui__tool__edit-text__item size">\n                  <input class=\'font-size\' type="text" value="' + css.size + '">\n                  <span class=\'text\'>Font Size</span>\n              </div>\n              <div class="b-ui__tool__edit-text__item color">\n                  <span class=\'icon\'>\n                      <input type="color" name="favcolor" value="' + css.color + '">\n                  </span>\n                  <span class=\'text\'>' + css.color + '</span>\n              </div>\n              <div class="b-ui__tool__edit-text__item add-remove">\n                    <div class=\'item\'>\n                        <span class=\'btn\'>+</span>\n                        <span class=\'label\'>Add Label</span>\n                    </div>\n                    <div class=\'item\'>\n                        <span class=\'btn\'>-</span>\n                        <span class=\'label\'>Delete Label</div>\n                    </div>\n              </div>\n              <div class="b-ui__tool__edit-text__item label">\n                  <textarea rows="10">' + payload.data.text + '</textarea>\n              </div>\n              <div class="b-ui__tool__edit-text__item switches">\n                  <label class="c-switch">\n                    <input type="checkbox" checked>\n                    <span class="slider round"></span>\n                    <span class=\'c-switch__title\'>Bold</span>\n                  </label>\n                  <label class="c-switch">\n                    <input type="checkbox">\n                    <span class="slider round"></span>\n                    <span class=\'c-switch__title\'>Italic</span>\n                  </label>\n                  <label class="c-switch">\n                    <input type="checkbox">\n                    <span class="slider round"></span>\n                    <span class=\'c-switch__title\'>Underline</span>\n                  </label>\n              </div>\n            ');
        var colorPicker = $(".b-ui__tool__edit-text__item.color input"),
            fontSize = $(".b-ui__tool__edit-text__item.size input"),
            label = $(".b-ui__tool__edit-text__item.label textarea");
        colorPicker.on('change', function () {
            var color = getPickedColor();
            updateTextColor(color);
            $('.b-ui__tool__edit-text__item.color .text').text(color);
        });

        fontSize.on('keyup', updateFontSize);
        label.on('keyup', updateTextLabel);
    }

    function getJSON() {
        //get JSON from GLOBAL data obj
        console.log(JSON.stringify(data));
    }

    function isTextInEditMode(payload) {
        //check if
        //element interacted with on canvas is already displayed in edit Tools box
        var toolState = state.tools.editText,
            textTool = $(".b-ui__tool__edit-text"),
            isTextToolActive = $('.c-ui-btn--edit-text').hasClass('selected');

        console.log(toolState);

        if (toolState.pageName == payload.pageName && toolState.propName == payload.propName && isTextToolActive) {
            return true;
        }
        return false;
    }

    function deselectAllTextOnCanvas(event) {
        event.stopPropagation();
        $('.c-canvas--center .selected').removeClass('selected');
    }

    function generateAndShowEditTextTool(payload) {
        // payload model
        // payload   = { data:data.pages[pageName][propName], pageName, propName };
        console.log('text tool called');
        console.log(payload);
        var toolState = state.tools.editText,
            textTool = $(".b-ui__tool__edit-text");

        if (textTool.hasClass('active')) {
            //if text tool is active in tools panel
            if (isTextInEditMode(payload)) {
                //if interacted text is displayed in tools panel
                console.log('ALREADY ACTIVE - RETURN');
                return;
            } else {
                //if interact element is not on display
                setToolState(payload);
                generateEditTxtHTML(payload);
            }
        } else {
            hideActiveTool();
            setToolState(payload);
            generateEditTxtHTML(payload);
            textTool.addClass('active');
            //fill with settings for draged text
        }
    }

    function selectItem(item) {
        //display styles( border box ) on selecetd item on canvas
        if (!item.hasClass('selected')) {
            //if item is not selecetd
            $('.c-canvas--center').find('.dragableText.selected').removeClass('selected');
            item.addClass('selected');
        } else {
            //if item is selecetd
        }
    }

    function clickTextOnCanvassListener(event) {
        event.stopPropagation();
        console.log('klik');

        //when user click text on canvas
        //let target    = event.target;
        var target = $(this),
            pageName = target.attr("data-page"),
            propName = target.attr("data-name"),
            payload = { data: data.pages[pageName][propName], pageName: pageName, propName: propName };
        console.log({ "isTextToolActive": isTextInEditMode(payload) });
        if (!isTextInEditMode(payload)) {
            generateAndShowEditTextTool(payload);
            selectItem(target);
            //match icon in tools menu with draged element
            if (!$(".c-ui-btn--edit-text").hasClass('selected')) {
                $('.b-ui__menu .c-ui-btn.selected').removeClass("selected");
                //add white color on icon
                $(".c-ui-btn--edit-text").addClass("selected");
            }
        }
    }

    function dragTextStartListener(event) {
        //when text drag on canvas STARTS
        var target = event.target,
            pageName = target.getAttribute("data-page"),
            propName = target.getAttribute("data-name"),
            payload = { data: data.pages[pageName][propName], pageName: pageName, propName: propName };

        console.log(target.classList[0]);
        generateAndShowEditTextTool(payload);
        selectItem($('.c-canvas--center .' + target.classList[0]));

        //match icon in tools menu with draged element
        if (!$(".c-ui-btn--edit-text").hasClass('selected')) {
            $('.b-ui__menu .c-ui-btn.selected').removeClass("selected");
            //add white color on icon
            $(".c-ui-btn--edit-text").addClass("selected");
        }
    }

    function dragTextMoveListener(event) {
        var target = event.target,

        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    function bindInteractJS() {
        interact('.dragableText').draggable({
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            onmove: dragTextMoveListener,
            onstart: dragTextStartListener

        });
        console.log('bind interactJS');
    }

    function unbindInteractJS() {
        interact('.dragableText').unset();
        console.log('unbind interactJS');
    }

    //FUNCTION IVOCATIONS
    init();
    backgroundThumbs.click(handleChangeBackgroundImage);
    uiBtns.click(showSelectedEditTool);
    uiMain.click(deselectAllTextOnCanvas); //desecelt text on canvas
    $('.get-json').click(getJSON);
    $('.b-ui__tool__edit-layout__add-remove .item').click(function () {
        console.log('NEW SLIDE');
        unbindInteractJS();
        //$('.dragableText').off(clickTextOnCanvassListener);
        SLIDER.addSlide(uiMain, data);
        $('.dragableText').click(clickTextOnCanvassListener);
        bindInteractJS();
    });
    $('.control.left').click(function () {
        unbindInteractJS();
        console.log('PREV SLIDE');
        SLIDER.prevSlide(uiMain, data);
        $('.dragableText').click(clickTextOnCanvassListener);
        bindInteractJS();
    });
    $('.control.right').click(function () {
        unbindInteractJS();
        console.log('Next SLIDE');
        SLIDER.nextSlide(uiMain, data);
        $('.dragableText').click(clickTextOnCanvassListener);
        bindInteractJS();
    });
    bindInteractJS('.dragableText');
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(0);

/*MODULE EXPORT*/
module.exports = {
    generateGlobalSettings: function generateGlobalSettings(parentSelector, gsData) {
        console.log(parentSelector, gsData);
        parentSelector.find('.b-ui__tool .b-ui__tool__edit-general__inner').append('\n            <div class=\'b-ui__tool__edit-general__info\'>\n                <div class="b-ui__tool b-ui__tool__edit-general__item">\n                    <span>title</span>\n                    <input type="text" value="' + gsData.title + '">\n                  </div>\n                  <div class="b-ui__tool b-ui__tool__edit-general__item">\n                    <span>publisher</span>\n                    <input type="text" value="' + gsData.publisher + '">\n                  </div>\n                  <div class="b-ui__tool b-ui__tool__edit-general__item">\n                    <span>publisher-logo-source</span>\n                    <input type="text" value="' + gsData.publisherLogoSrc + '">\n                  </div>\n                  <div class="b-ui__tool b-ui__tool__edit-general__item">\n                    <span>poster-portrait-source</span>\n                    <input type="text" value="' + gsData.posterPortraitSrc + '">\n                  </div>\n            </div>\n            <div class=\'b-ui__tool__edit-general__ads\'>\n                <div class="b-ui__tool b-ui__tool__edit-general__item-ads">\n                    <label class="c-switch">\n                      <input type="checkbox">\n                      <span class="slider round"></span>\n                      <span class=\'c-switch__title\'>Ads</span>\n                    </label>\n                </div>\n            </div>\n             <!-- <button class=\'get-json\'>Generate JSON</button> -->\n            ');
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $ = __webpack_require__(0);

function generateInlineCss(obj) {
    //@obj - data.pages.page1.title.css
    //pass css obj and generate string of inline params
    return "color:" + obj.color + ";\n     font-family:" + obj.font + ";\n     font-size:" + obj.size + "px;\n     font-weight:" + obj.weight + ";";
}

function generateSlide(pageObj, inCenter) {
    //@params pageObj - page obj in GLOBAL data that represent slide
    //@params isCenter - if slider is in center display (this slider is interactive)
    console.log({ pageObj: pageObj, inCenter: inCenter });
    var dragableClass = inCenter ? "dragableText" : ""; //class for drag and drop

    return " <div class=\"\" id='page" + pageObj.id + "'>\n        <div class=\"c-canvas__bcg-img\" data-page=\"page" + pageObj.id + "\" data-name=\"background\">\n            <img src=\"" + pageObj.background.src + "\" alt=\"\">\n        </div>\n        <div class=\"c-canvas__title " + dragableClass + "\" data-page=\"page" + pageObj.id + "\" data-name=\"title\">\n            <h1\n            class=\"title\"\n            style=\"" + generateInlineCss(pageObj.title.css) + "\"\n            >" + pageObj.title.text + "</h1>\n        </div>\n        <div class=\"c-canvas__description " + dragableClass + "\" data-page=\"page" + pageObj.id + "\" data-name=\"description\">\n            <p\n            class=\"description\"\n            style=\"" + generateInlineCss(pageObj.description.css) + "\"\n            >" + pageObj.description.text + "</p>\n        </div>\n    </div>";
}

//FOR EXPORT ONLY
module.exports = {
    addSlide: function addSlide(parentSelector, data) {
        //ads new slide - amp-story-page
        //@param parentSelector - wrapper(parent) of 3 slides(.c-canvas)
        //@param data - global data object

        var sliderData = data.slider,
            leftSlide = parentSelector.find(".c-canvas--left"),
            centerSlide = parentSelector.find(".c-canvas--center"),
            rightSlide = parentSelector.find(".c-canvas--right"),
            slideshow = $(".b-slider"),
            slideshowDots = slideshow.find('.b-slider__dots'),
            slideshowCount = slideshow.find('.b-slider__current-num span');

        //console.log(typeof sliderData.count);
        //console.log(typeof sliderData.currentSlide);

        sliderData.count++; //increment num of slides
        sliderData.currentSlide++; //increase current slide by 1
        //console.log(sliderData.count);

        //clone current slide to left position


        //add new slide to GLOBAL data obj
        var newSlide = {
            id: sliderData.count,
            background: {
                toolForEdit: "editBcg",
                src: "assets/img/placeholder.jpg"
            },
            //item on canvas
            title: {
                toolForEdit: "editText", //tool used to edit this item
                text: 'Dummy Title', //label - text of item
                //css of item
                css: {
                    color: "#ff0000",
                    font: "Monospace",
                    size: "32",
                    weight: '400'
                }
            },
            description: {
                toolForEdit: "editText",
                text: 'Dummy Description text, type here your content.',
                css: {
                    color: "#ffffff",
                    font: "Helvetica",
                    size: "24",
                    weight: '400'
                }
            }
        };

        //add new page to GLOBAL data
        data.pages["page" + sliderData.count] = newSlide;

        //add new slide in center slider
        centerSlide.empty().append(generateSlide(newSlide, true));

        //add previously center slide to the left
        if (sliderData.count > 1) {
            leftSlide.empty().append(generateSlide(data.pages["page" + (sliderData.currentSlide - 1)], false));
        }

        //empty last slide, since we are on last at CENTER
        rightSlide.empty();

        //add dot
        slideshowDots.find('.current').removeClass('current');
        slideshowDots.append("<span class='dot current'></span>");

        //increase curent slide display number
        slideshowCount.text(sliderData.count);

        console.log(data);
    },
    prevSlide: function prevSlide(parentSelector, data) {
        //slides to prev
        //@param parentSelector - wrapper(parent) of 3 slides(.c-canvas)
        //@param data - global data object

        var sliderData = data.slider,
            leftSlide = parentSelector.find(".c-canvas--left"),
            centerSlide = parentSelector.find(".c-canvas--center"),
            rightSlide = parentSelector.find(".c-canvas--right"),
            slideshow = $(".b-slider"),
            slideshowDots = slideshow.find('.b-slider__dots'),
            slideshowCount = slideshow.find('.b-slider__current-num span');

        console.log(sliderData.currentSlide);

        if (sliderData.currentSlide == 1) {
            //if on first slide exit - no prev slides
            console.log('YOU ARE ON FIRST SLIDE');
            return;
        }

        //move central slider to right
        rightSlide.empty().append(generateSlide(data.pages["page" + sliderData.currentSlide], false));

        sliderData.currentSlide--; //decrease current slide by 1

        //add central slide, which was on left
        centerSlide.empty().append(generateSlide(data.pages["page" + sliderData.currentSlide], true));

        if (sliderData.currentSlide > 1) {
            leftSlide.empty().append(generateSlide(data.pages["page" + (sliderData.currentSlide - 1)], false));
        } else {
            leftSlide.empty();
        }

        //add dot
        slideshowDots.find('.current').removeClass('current').prev().addClass('current');

        //increase curent slide display number
        slideshowCount.text(sliderData.currentSlide);
    },
    nextSlide: function nextSlide(parentSelector, data) {
        //slides to next
        //@param parentSelector - wrapper(parent) of 3 slides(.c-canvas)
        //@param data - global data object

        var sliderData = data.slider,
            leftSlide = parentSelector.find(".c-canvas--left"),
            centerSlide = parentSelector.find(".c-canvas--center"),
            rightSlide = parentSelector.find(".c-canvas--right"),
            slideshow = $(".b-slider"),
            slideshowDots = slideshow.find('.b-slider__dots'),
            slideshowCount = slideshow.find('.b-slider__current-num span');

        console.log(sliderData.currentSlide);

        if (sliderData.currentSlide == sliderData.count) {
            //if on last slide exit - no next slides
            console.log('YOU ARE ON LAST SLIDE');
            return;
        }

        //move central slider to left
        leftSlide.empty().append(generateSlide(data.pages["page" + sliderData.currentSlide], false));

        sliderData.currentSlide++; //increase current slide by 1

        //add central slide, which was on right
        centerSlide.empty().append(generateSlide(data.pages["page" + sliderData.currentSlide], true));

        if (sliderData.currentSlide < sliderData.count) {
            rightSlide.empty().append(generateSlide(data.pages["page" + (sliderData.currentSlide + 1)], false));
        } else {
            rightSlide.empty();
        }

        //add dot
        slideshowDots.find('.current').removeClass('current').next().addClass('current');

        //increase curent slide display number
        slideshowCount.text(sliderData.currentSlide);
    }
};

/***/ })
],[1]);