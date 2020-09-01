function init_index() {

  init_index_swiper();
  init_resources_chat();

  initWorks();

  initQA();

  initJbtn();

  initVideoBtn();
}

function init_index_swiper() {
  var mySwiper = new Swiper('.swiper-container-index', {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.sp-index',
    },

    on: {
      slideChangeTransitionStart: function () {
        /* do something */
        // console.log(this.activeIndex);
        const el = $(this.slides[this.activeIndex]);
        TweenMax.set(el.find('.ani-item'), {
          autoAlpha: 0,
          y: 70
        })
        TweenMax.staggerTo(el.find('.ani-item'), .6, {
          delay: 0.5,
          autoAlpha: 1,
          y: 0
        }, .1)
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: '.sb-next-index',
      prevEl: '.sb-prev-index',
    },

  })
}

function init_resources_chat() {
  $('.popBtn').click(function () {
    var t = $(this);
    const id = t.attr('data-id');

  });

  $('.popBtn').mouseover(function () {
    var t = $(this);
    const id = +t.attr('data-id') + 1;
    $('#resources').find('.c-' + id).addClass('active');
    console.log(id);
  });

  $('.popBtn').mouseleave(function () {
    var t = $(this);
    const id = +t.attr('data-id') + 1;
    $('#resources').find('.c-' + id).removeClass('active');
    console.log(id);

  });

}

function initWorks() {

  let innerSliderArr = [];




  $('.swiper-container-inner').each((index, el) => {
    const silder = `.sc-${index}`;

    const pp = new Swiper(silder, {
      loop: true,
      speed: 800,
      pagination: {
        el: silder + ' .swiper-pagination',
      },

      on: {
        slideChangeTransitionStart: function () {

        },
      },

      // Navigation arrows
      navigation: {
        nextEl: silder + ' .swiper-button-next',
        prevEl: silder + ' .swiper-button-prev',
      },

    })

    innerSliderArr.push(pp);
  })


  const outerSlider = new Swiper('.swiper-container-outer', {
    // loop: true,
    speed: 800,
    // pagination: {
    //   el: silder +' .swiper-pagination',
    // },
    // direction: 'vertical',
    // direction: 'vertical',
    allowTouchMove: false,
    on: {
      slideChangeTransitionStart: function () {

      },
    },

    // Navigation arrows
    // navigation: {
    //   nextEl: silder +' .swiper-button-next',
    //   prevEl: silder +' .swiper-button-prev',
    // },

  })

  $('#works .sliderBtns .sliderBtn').click(function () {
    var t = $(this);
    console.log(t.index());
    outerSlider.slideTo(t.index());

    t.addClass('active').siblings('.sliderBtn').removeClass('active');
  });


}


function initQA() {
  $(".qaBox").click(function () {
    var t = $(this);
    t.toggleClass('active')
    const innerHeight = (!t.hasClass('active')) ? 0 : t.find('.a-content').height();
    console.log(innerHeight);
    t.find('.aBox').css('height', innerHeight + 'px')


    // t.siblings('.qaBox').removeClass('active').find('.aBox').css('height','0px')
  });
}


function initJbtn() {
  $('.jBtn').click(function () {
    var t = $(this);
    const top = $(t.attr('data-id')).offset().top - 60;
    ChungTool.pageScrollAni(top);
  });
}

function initVideoBtn() {
  $('.videoBtn').click(function () {
    var t = $(this);
    const vid = t.attr('data-vid');
    ChungTool.addYouTube($('#videoPop .videoWrap'), vid);
  });
}