/*
Program       esci-web.js
Author        Gordon Moore
Date          14 July 2020
Description   The JavaScript code for esci-web
Licence       GNU General Public LIcence Version 3, 29 June 2007
*/

// #region Version history
/*
0.0.1   Initial version
0.1.0   2020-07-25 The first attempt
0.1.1   2020-07-31 Replaced cdn links with direct links to libraries for portability and resilience 
0.1.2   2020-07-31 Footer link text changed
0.1.3   2020-08-01 Menu links changed to new subdomains
0.1.4   2020-08-07  Just adjusted font size of menu items and allowed some padding on main image at right
0.1.5   2020-08-07  More slight adjustments to right panel
0.1.6   2020-08-15  Add d picture link
0.1.7   2020-08-17  Add d picture image
0.1.8   2020-08-22  Add precision and see r menu items
0.1.9   2020-08-24  #1 Make changes re specification
0.1.10  2020-08-25  #1 Added New Edition
0.1.11  2020-08-25  #? Split see r into 2 menu items
0.1.12  2020-08-26  #4 Tips added
0.1.13  2020-08-26  #3 Tweaks to words and colour
0.1.14  2020-08-27  #3 Tweaks to words and colour
0.1.15  2020-08-27  #4 Tooltip disable fix

*/
//#endregion 

let version = '0.1.15';

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
  const $menuitem4 = $('#menuitem4');
  const $menuitem5 = $('#menuitem5');
  const $menuitem6 = $('#menuitem6');

  //#endregion


  setTooltips();

  initialise();

  function initialise() {
    $menuitems.hide();
  }

  $menus.on('mouseenter', function() {
    //$bookimage.fadeOut(100);

    if ($(this).prop('id') === 'menu1') {
      $menuitem1.fadeIn(500);
    }
    if ($(this).prop('id') === 'menu2') {
      $menuitem2.fadeIn(500);
    }
    if ($(this).prop('id') === 'menu3') {
      $menuitem3.fadeIn(500);
    }
    if ($(this).prop('id') === 'menu4') {
      $menuitem4.fadeIn(500);
    }
    if ($(this).prop('id') === 'menu5') {
      $menuitem5.fadeIn(500);
    }
    if ($(this).prop('id') === 'menu6') {
      $menuitem6.fadeIn(500);
    }

  })

  $menus.on('mouseleave', function() {
     $menuitems.fadeOut(0);
  })

  $mainmenu.on('mouseleave', function() {
    $bookimage.fadeIn(0);
  })

  $('#menu1').on('click', function() {
    window.location.href = 'https://www.esci-dances.thenewstatistics.com/';
  })

  $('#menu2').on('click', function() {
    window.location.href = 'https://www.esci-distributions.thenewstatistics.com/';
  })

  $('#menu3').on('click', function() {
    window.location.href = 'https://gfmoore.github.io/esci-d-picture/';
  })

  $('#menu4').on('click', function() {
    window.location.href = 'https://gfmoore.github.io/esci-precision/';
  })

  $('#menu5').on('click', function() {
    window.location.href = 'https://gfmoore.github.io/esci-correlation/';
  })

  $('#menu6').on('click', function() {
    window.location.href = 'https://gfmoore.github.io/dance-r/';
  })


  /*---------------------------------------------------Tool tips on or off----------------------------------------*/

  function setTooltips() {
    Tipped.setDefaultSkin('esci');

    //heading section
    Tipped.create('#logo',          'Version: '+version,                              { skin: 'red', size: 'versionsize', behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
  
    Tipped.create('#tooltipsonoff', 'Tips on/off, default is off!',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.headingtip',    'https://thenewstatistics.com',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.hometip',       'Click to return to esci Home',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    
    Tipped.create('#menu1', 'Investigate sampling. See dance of the means, dance of the CIs, dance of the <em>p</em> values, and other goodies. ',  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#menu2', 'Investigate normal and Student <em>t</em> distributions. Find areas and critical values.',                             { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#menu3', "Investigate how values of Cohen's <em>d</em> relate to distributions and areas.",                                      { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#menu4', 'Find <em>N</em> required to achieve desired target precision.',                                                        { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#menu5', 'See a number of scatter plots for any chosen correlation <em>r</em>.',                                                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#menu6', 'Investigate sampling of correlation values. See scatter plots and dances.',                                            { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //spare
    // Tipped.create('. tip', '', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.disable('[data-tooltip]');
  }

  $('#tooltipsonoff').on('click', function() {
    if (tooltipson) {
      tooltipson = false;
      $('#tooltipsonoff').css('background-color', 'lightgrey');
      Tipped.disable('[data-tooltip]');
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
  
  // $(window).bind('resize', function(e){
  //   window.resizeEvt;
  //   $(window).resize(function(){
  //       clearTimeout(window.resizeEvt);
  //       window.resizeEvt = setTimeout(function(){
  //         resize();
  //       }, 500);
  //   });
  // });


  //helper function for testing
  function lg(s) {
    console.log(s);
  }  

})

