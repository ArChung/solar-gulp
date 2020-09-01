function init_animation() {

  inView.offset(100);

  TweenMax.set('.ani-item', {
    alpha: 0,
    y: 80
  });

  TweenMax.set('.ani-item.ani-left', {
    x:80,
    y:0
  });

  TweenMax.set('.ani-item.ani-right', {
    alpha: 0,
    x: -80,
    y:0
  });

  inView('.ani-item').on('enter', (el) => {
    console.log(el);
    TweenMax.to(el, .8, {
      alpha: 1,
      y: 0,
      x:0
    });

  })

}