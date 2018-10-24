var $ = require('jquery');

/*MODULE EXPORT*/
module.exports = {
    generateGlobalSettings( parentSelector, gsData ){
        console.log(parentSelector, gsData);
        let adsChecked = gsData.ads ?'checked' :'';
        parentSelector.find('.b-ui__tool .b-ui__tool__edit-general__inner').append(
            `
            <div class='b-ui__tool__edit-general__info'>
                <div class="b-ui__tool b-ui__tool__edit-general__item">
                    <span>title</span>
                    <input type="text" value="${gsData.title}" data-prop='title'>
                  </div>
                  <div class="b-ui__tool b-ui__tool__edit-general__item">
                    <span>publisher</span>
                    <input type="text" value="${gsData.publisher}" data-prop='publisher'>
                  </div>
                  <div class="b-ui__tool b-ui__tool__edit-general__item">
                    <span>publisher-logo-source</span>
                    <input type="text" value="${gsData.publisherLogoSrc}" data-prop='publisherLogoSrc'>
                  </div>
                  <div class="b-ui__tool b-ui__tool__edit-general__item">
                    <span>poster-portrait-source</span>
                    <input type="text" value="${gsData.posterPortraitSrc}" data-prop='posterPortraitSrc'>
                  </div>
            </div>
            <div class='b-ui__tool__edit-general__ads'>
                <div class="b-ui__tool b-ui__tool__edit-general__item-ads">
                    <label class="c-switch" for='ads'>
                      <input type="checkbox" id='ads' ${adsChecked}>
                      <span class="slider round"></span>
                      <span class='c-switch__title'>Ads</span>
                    </label>
                </div>
            </div>
             <!-- <button class='get-json'>Generate JSON</button> -->
            `
          );

        let input = $('.b-ui__tool__edit-general__info input'),
            ads   = $('#ads');

        //key up listener
        input.on('change', function(event){
            var item = $(this),
                prop = item.data('prop');
            gsData[prop] = item.val();
            console.log(gsData);
        });

        ads.on('click',function(event){
            gsData.ads = event.target.checked;
        });
    }
}
