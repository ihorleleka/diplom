import BaseView from 'app/mvc/views/BaseView';

class QuoteAppView extends BaseView {

  constructor (...dependencies) {
    super(...dependencies);

    this.$backgroundQuoteImage = $('.background-quote-image');
  }

  setBackgroundImage (src) {
    let currentBackgroundImage = this.$backgroundQuoteImage.css('background-image');

    if (currentBackgroundImage !== 'none') {
      let currentRelativeBackgroundImageSrc =
        this.$backgroundQuoteImage.data('appliedBackgroundImageSrc');

      if (currentRelativeBackgroundImageSrc !== src) {
        this.$backgroundQuoteImage.animate(
          { opacity: 0 },
          { queue: true, easing: 'linear', duration: 500 }
        );

        setTimeout(() => {
          this.setBackgroundImageImmediate(src);
        }, 500);
      }
    } else {
      this.setBackgroundImageImmediate(src);
    }
  }

  setBackgroundImageImmediate (src) {
    this.$backgroundQuoteImage.data('appliedBackgroundImageSrc', src);

    this.$backgroundQuoteImage.css({
      backgroundImage: src
    });
    this.$backgroundQuoteImage.animate(
      { opacity: 1 },
      { queue: true, easing: 'linear', duration: 300 }
    );
  }

  setDefaultBackgroundImage () {
    let bgUrl = this.$backgroundQuoteImage.data('background');
    this.setBackgroundImage(bgUrl);
  }
}

export { QuoteAppView as default };
