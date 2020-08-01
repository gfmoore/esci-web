/*
Program       esci-web.js
Author        Gordon Moore
Date          14 July 2020
Description   The JavaScript code for esci-web
Licence       GNU General Public LIcence Version 3, 29 June 2007
*/

// #region Version history
/*
0.0.1         Initial version
0.1.0         2020-07-25 The first attempt
0.1.1         2020-07-31 Replaced cdn links with direct links to libraries for portability and resilience 
0.1.2         2020-07-31 Footer link text changed
0.1.3         2020-08-01 Menu links changed to new subdomains

*/
//#endregion 

let version = '0.1.3';

// 'use strict';
$(function() {
  console.log('jQuery here!');  //just to make sure everything is working

  //#region for variable definitions (just allows code folding)
  let tooltipson = false;

  //cache dom elements
  const $mainmenu = $('#mainmenu');
  const $menus = $('.menus');
  const $bookimage = $('#bookimage');

  const $menuitems = $('.menuitems');
  const $menuitem1 = $('#menuitem1');
  const $menuitem2 = $('#menuitem2');
  const $menuitem3 = $('#menuitem3');

  //#endregion


  setTooltips();

  initialise();

  function initialise() {
    $menuitems.hide();

  }

  function resize() {

  }

  $menus.on('mouseenter', function() {
    $bookimage.fadeOut(100);

    lg($(this).prop('id'));
    if ($(this).prop('id') === 'menu1') {
      $menuitem1.fadeIn(500);
    }
    if ($(this).prop('id') === 'menu2') {
      $menuitem2.fadeIn(500);
    }
    if ($(this).prop('id') === 'menu3') {
      $menuitem3.fadeIn(500);
    }
  })

  $menus.on('mouseleave', function() {
     $menuitems.fadeOut(200);
  })

  $mainmenu.on('mouseleave', function() {
    $bookimage.fadeIn(500);
  })

  $('#menu1').on('click', function() {
    window.location.href = 'https://www.esci-dances.thenewstatistics.com/';
  })

  $('#menu2').on('click', function() {
    window.location.href = 'https://www.esci-distributions.thenewstatistics.com/';
  })


  /*---------------------------------------------------Tool tips on or off----------------------------------------*/

  function setTooltips() {
    Tipped.setDefaultSkin('esci');

    //heading section
    Tipped.create('#logo', 'Version: '+version, { skin: 'red', size: 'xlarge' });
    Tipped.create('#tooltipsonoff', 'Allow tooltips on or off, default is off!', { skin: 'esci', size: 'xlarge', showDelay: 750 });

    Tipped.create('#mainheading', 'From The New Statistics: ', { skin: 'esci', size: 'xlarge', showDelay: 750 });
    Tipped.create('#subheading', 'https://thenewstatistics.com', { skin: 'esci', size: 'xlarge', showDelay: 750 });

    Tipped.create('#menu1', 'This page takes you to where you can investigate and experiement with sampling from a distribution. It includes the dance of the means and the dance of the p values.', { skin: 'esci', size: 'xlarge', showDelay: 750 });
    Tipped.create('#menu2', 'This page takes you to where you can investigate the normal and Student t distribution.', { skin: 'esci', size: 'xlarge', showDelay: 750 });
    Tipped.create('#menu3', 'This page goes nowhere...yet :)', { skin: 'esci', size: 'xlarge', showDelay: 750 });
    // Tipped.create('#', '', { skin: 'esci', size: 'xlarge', showDelay: 750 });
    // Tipped.create('#', '', { skin: 'esci', size: 'xlarge', showDelay: 750 });

    // Tipped.create('#', '', { skin: 'esci', size: 'xlarge', showDelay: 750 });


    //footer
    Tipped.create('#footerlink', 'Return to the New Statistics website. ', { skin: 'esci', size: 'xlarge', showDelay: 750 });

    Tipped.disable('[data-tooltip]');
  }

  $('#tooltipsonoff').on('click', function() {
    if (tooltipson) {
      tooltipson = false;
      $('#tooltipsonoff').css('background-color', 'lightgrey');
    }
    else {
      tooltipson = true;
      $('#tooltipsonoff').css('background-color', 'lightgreen');
      Tipped.enable('[data-tooltip]');
    }
  })

  /*----------------------------------------------------------footer-------------------------------------------------------*/

  $('#footer').on('click', function() {
    window.location.href = "https://thenewstatistics.com/";
  })

  /*---------------------------------------------------------  resize event -----------------------------------------------*/
  
  $(window).bind('resize', function(e){
    window.resizeEvt;
    $(window).resize(function(){
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function(){
          resize();
        }, 500);
    });
  });

  //helper function for testing
  function lg(s) {
    console.log(s);
  }  

})

