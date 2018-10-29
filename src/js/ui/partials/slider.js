var $ = require('jquery');


function generateInlineCss( obj ){
  //@obj - data.pages.page1.title.css
  //pass css obj and generate string of inline params
    return ( `color:${obj.color};
     font-family:${obj.font};
     font-size:${obj.size}px;
     font-weight:${obj.weight};
     font-style:${obj.style};
     text-align:${obj.align};
     text-decoration:${obj.decoration};`);
     // top:${obj.top};
     // left:${obj.left};
}

function updateEditBackgroundImage( background ){
    //update image in edit background mode
    //@params background - Obj - object with data of image,
    let editModeCanvas  = $(".c-canvas-bcg__img");

    //set img src on edit-background canvas
    editModeCanvas.find('img').attr('src', background.src );
    //apply img style and data-x
    editModeCanvas.attr('data-x', background.x);
    editModeCanvas.css('transform', `translate(${background.x}px)`);
}

function updateThumbnail( imgSrc ){
    //@params imgSrc - String - src to match data-src of thumnail
    //remove selected class on currently selected
    let thumbsList = $(".b-ui__tool__edit-bcg__images-list"),
        itemToSelect = thumbsList.find(`[data-src="${imgSrc}"]`);

    thumbsList.find('.selected').removeClass('selected');
    if( itemToSelect ) itemToSelect.addClass('selected');

    //add selected class on active thumb - match with slider
}

function generateSlide( pageObj, inCenter ){
    //@params pageObj - page obj in GLOBAL data that represent slide
    //@params isCenter - if slider is in center display (this slider is interactive)
    console.log({ pageObj, inCenter});
    let dragableClass = inCenter ? "dragableText" : "", //class for drag and drop
        multiplayer = inCenter ?1 :0.9//decrease px value for 10% is element is not on center canvas


    return (
    ` <div class="" id='page${pageObj.id}'>
        <div class="c-canvas__bcg-img" data-page="page${pageObj.id}" data-name="background">
            <img src="${pageObj.background.src}"
                 alt=""
                 style="transform: translate(${pageObj.background.x * multiplayer}px)"
            >
        </div>
        <div class="c-canvas__title ${dragableClass}"
             data-page="page${pageObj.id}"
             data-name="title"
             data-x=${pageObj.title.css.x}
             data-y=${pageObj.title.css.y}
             style="transform: translate(${pageObj.title.css.x * multiplayer}px,${pageObj.title.css.y * multiplayer}px)"
        >
            <h1
            class="title"
            style="${generateInlineCss(pageObj.title.css)}"
            >${pageObj.title.text}</h1>
        </div>
        <div class="c-canvas__description ${dragableClass}"
             data-page="page${pageObj.id}"
             data-name="description"
             data-x=${pageObj.description.css.x}
             data-y=${pageObj.description.css.y}
             style="transform: translate(${pageObj.description.css.x * multiplayer}px,${pageObj.description.css.y * multiplayer}px)"
        >
            <p
            class="description"
            style="${generateInlineCss(pageObj.description.css)}"
            >${pageObj.description.text}</p>
        </div>
    </div>`);
}

//FOR EXPORT ONLY
module.exports = {
    addSlide( parentSelector, data ){
        //ads new slide - amp-story-page
        //@param parentSelector - wrapper(parent) of 3 slides(.c-canvas)
        //@param data - global data object

        let sliderData    = data.slider,
        leftSlide         = parentSelector.find(".c-canvas--left"),
        centerSlide       = parentSelector.find(".c-canvas--center"),
        rightSlide        = parentSelector.find(".c-canvas--right"),
        slideshow         = $(".b-slider"),
        slideshowDots     = slideshow.find('.b-slider__dots'),
        slideshowCount    = slideshow.find('.b-slider__current-num span');

        //console.log(typeof sliderData.count);
        //console.log(typeof sliderData.currentSlide);

        sliderData.count++;//increment num of slides
        sliderData.currentSlide = sliderData.count; //set current slide
        //console.log(sliderData.count);

        // page object - will be added  to GLOBAL data
        let newSlide = {
            id:sliderData.count,
            background:{
                toolForEdit:"editBcg",
                src:"assets/img/placeholder.jpg",
                x:'0'
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
                    style: "normal",
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
                    style: "normal",
                    decoration: "none",
                    align:'left',
                    x:'30',
                    y:'300',
                }
            }
        };

        //add new page to GLOBAL data
        data.pages[`page${sliderData.count}`] = newSlide;

        //add new slide in center slider
        centerSlide.empty().append(
            generateSlide( newSlide, true )
        );

        //add previously center slide to the left if any
        if (sliderData.count > 1) {
            leftSlide.empty()
            .append(
                generateSlide( data.pages[`page${sliderData.currentSlide - 1}`], false )
            );
        }

        //empty last slide, since we are on last at CENTER
        rightSlide.empty();

        //add dot
        slideshowDots.find('.current').removeClass('current');
        slideshowDots.append(`<span class='dot current'></span>`);

        //change curent slide display number
        slideshowCount.text(sliderData.count);

        //sync edit background image with current slide
        updateEditBackgroundImage( data.pages[`page${sliderData.count}`].background );
        //sync thumbnails
        updateThumbnail( data.pages[`page${sliderData.currentSlide}`].background.src);

        console.log(data);
    },

    prevSlide( parentSelector, data ){
        //slides to prev
        //@param parentSelector - wrapper(parent) of 3 slides(.c-canvas)
        //@param data - global data object

        let sliderData    = data.slider,
        leftSlide         = parentSelector.find(".c-canvas--left"),
        centerSlide       = parentSelector.find(".c-canvas--center"),
        rightSlide        = parentSelector.find(".c-canvas--right"),
        slideshow         = $(".b-slider"),
        slideshowDots     = slideshow.find('.b-slider__dots'),
        slideshowCount    = slideshow.find('.b-slider__current-num span');

        console.log(sliderData.currentSlide)

        if( sliderData.currentSlide == 1 ){
            //if on first slide exit - no prev slides
            console.log('YOU ARE ON FIRST SLIDE');
            return
        }

        //move central slider to right
        rightSlide.empty()
        .append(
            generateSlide( data.pages[`page${sliderData.currentSlide}`], false )
        );

        sliderData.currentSlide--; //decrease current slide by 1

        //add central slide, which was on left
        centerSlide.empty()
        .append(
            generateSlide( data.pages[`page${sliderData.currentSlide}`], true )
        );

        if( sliderData.currentSlide > 1 ){
            leftSlide.empty()
            .append(
                generateSlide( data.pages[`page${sliderData.currentSlide - 1}`], false )
            );
        }else{
            leftSlide.empty()
        }

        //sync edit background image with current slide
        updateEditBackgroundImage( data.pages[`page${sliderData.currentSlide}`].background);
        //sync thumbnails
        updateThumbnail( data.pages[`page${sliderData.currentSlide}`].background.src);

        //add dot
        slideshowDots.find('.current').removeClass('current').prev().addClass('current');

        //increase curent slide display number
        slideshowCount.text(sliderData.currentSlide);

    },

    nextSlide( parentSelector, data ){
        //slides to next
        //@param parentSelector - wrapper(parent) of 3 slides(.c-canvas)
        //@param data - global data object

        let sliderData    = data.slider,
        leftSlide         = parentSelector.find(".c-canvas--left"),
        centerSlide       = parentSelector.find(".c-canvas--center"),
        rightSlide        = parentSelector.find(".c-canvas--right"),
        slideshow         = $(".b-slider"),
        slideshowDots     = slideshow.find('.b-slider__dots'),
        slideshowCount    = slideshow.find('.b-slider__current-num span');

        console.log(sliderData.currentSlide)

        if( sliderData.currentSlide == sliderData.count ){
            //if on last slide exit - no next slides
            console.log('YOU ARE ON LAST SLIDE');
            return
        }

        //move central slider to left
        leftSlide.empty()
        .append(
            generateSlide( data.pages[`page${sliderData.currentSlide}`], false )
        );

        sliderData.currentSlide++; //increase current slide by 1

        //add central slide, which was on right
        centerSlide.empty()
        .append(
            generateSlide( data.pages[`page${sliderData.currentSlide}`], true )
        );

        if( sliderData.currentSlide < sliderData.count ){
            rightSlide.empty()
            .append(
                generateSlide( data.pages[`page${sliderData.currentSlide + 1}`], false )
            );
        }else{
            rightSlide.empty()
        }

        //sync edit background image with current slide
        updateEditBackgroundImage( data.pages[`page${sliderData.currentSlide}`].background );
        //sync thumbnails
        updateThumbnail( data.pages[`page${sliderData.currentSlide}`].background.src);
        //add dot
        slideshowDots.find('.current').removeClass('current').next().addClass('current');

        //change curent slide display number
        slideshowCount.text(sliderData.currentSlide);


    }
}
