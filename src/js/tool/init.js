function init_base() {
  const INIT_VIEWPORT = true;
  const VIEWPORT_WIDTH = 600;


  /////////////////////////////////////////////
  //        更改 meta 上的 viewport           //
  /////////////////////////////////////////////

  if (INIT_VIEWPORT) {
    const sUserAgent = navigator.userAgent.toLowerCase();
    const bIsAndroid = sUserAgent.match(/android/i) == "android";
    const viewport = document.querySelector("meta[name=viewport]");

    if (bIsAndroid) {
      const deviceWidth = screen.width;
      const getTargetDensitydpi = VIEWPORT_WIDTH / deviceWidth * window.devicePixelRatio * 160;
      const targetDensitydpi = `target-densitydpi=${getTargetDensitydpi}, width=${VIEWPORT_WIDTH}, user-scalable=no`;

      viewport.setAttribute('content', targetDensitydpi);
    } else {
      viewport.setAttribute('content', `width=${VIEWPORT_WIDTH} user-scalable=0`);

    }
  }



  /////////////////////////////////////////////
  //              fastclick                  //
  /////////////////////////////////////////////
  
  FastClick.attach(document.body);

}



