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
0.1.16  2020-08-28  #5 Basic In development page added.
0.1.17  2020-08-28  #5 v2 of Basic In development message added.
0.1.18  2020-09-01  #5 Added correlation to disabled menu item.

1.0.0   2020-09-03  Version 1.0.0
1.0.1   2020-09-05  Release correlation beta
1.0.2   2020-09-06  Make the releases 1.0.0
1.0.3   17 Oct 2020 Add dance-r menu item
1.0.4   18 Oct 2020 Did tweaks to the menu image display to make smoother  
1.0.5   18 Oct 2020 Make images clickable
1.0.6   21 Oct 2020 Change menu links for www.thenewstatistics.com
1.0.7   6 Nov 2020 Consolidation of all programs into one github repository

1.1.0  6 Nov 2020 Rationalised into one repository

*/
//#endregion 

let version = '1.1.0';

// 'use strict';
$(function() {
  console.log('jQuery here!');  //just to make sure everything is working

  //#region for variable definitions (just allows code folding)
  let tooltipson = false;

  //cache dom elements
  const $mainmenu = $('#mainmenu');
  const $leftpanel = $('#leftpanel');
  const $rightpanel = $('#rightpanel');
  const $menus = $('.menus');
  const $bookimage = $('#bookimage');

  const $menu1 = $('#menu1');
  const $menu2 = $('#menu2');
  const $menu3 = $('#menu3');
  const $menu4 = $('#menu4');
  const $menu5 = $('#menu5');
  const $menu6 = $('#menu6');

  const $menuitems = $('.menuitems');
  const $menuitem1 = $('#menuitem1');
  const $menuitem2 = $('#menuitem2');
  const $menuitem3 = $('#menuitem3');
  const $menuitem4 = $('#menuitem4');
  const $menuitem5 = $('#menuitem5');
  const $menuitem6 = $('#menuitem6');

  //const $menuimage = $('.menuimage');

  let menubarvisible   = false;
  let menuimagevisible = false;

  //#endregion


  setTooltips();

  initialise();

  function initialise() {
    $menuitems.hide();
    $('#message').hide();
  }

  $menus.on('mouseenter', function() {
    $menus.css('background-color', 'lemonchiffon');
    $menuitems.fadeOut(0);
    if ($(this).prop('id') === 'menu1') {
      $menu1.css('background-color', 'lightgreen');
      $menuitem1.fadeIn(500);
      //$menuitem1.css('background-color', 'lightgreen');
    }
    if ($(this).prop('id') === 'menu2') {
      $menu2.css('background-color', 'lightgreen');
      $menuitem2.fadeIn(500);
      //$menuitem2.css('background-color', 'lightgreen');
    }
    if ($(this).prop('id') === 'menu3') {
      $menu3.css('background-color', 'lightgreen');
      $menuitem3.fadeIn(500);
      //$menuitem3.css('background-color', 'lightgreen');
    }
    if ($(this).prop('id') === 'menu4') {
      $menu4.css('background-color', 'lightgreen');
      $menuitem4.fadeIn(500);
      //$menuitem4.css('background-color', 'lightgreen');
    }
    if ($(this).prop('id') === 'menu5') {
      $menu5.css('background-color', 'lightgreen');
      $menuitem5.fadeIn(500);
      //$menuitem5.css('background-color', 'lightgreen');
    }
    if ($(this).prop('id') === 'menu6') {
      $menu6.css('background-color', 'lightgreen');
      $menuitem6.fadeIn(500);
      //$menuitem6.css('background-color', 'lightgreen');
    }
  })


  $menus.on('mouseleave', function() {  //leave the menubar
    menubarvisible = false;
  })


  //turn off menu images for these two cases

  $rightpanel.on('mouseenter', function() {
    $menuitems.fadeOut(0); 
  })

  $leftpanel.on('mouseleave', function() {
    $menuitems.fadeOut(0);
    $menus.css('background-color', 'lemonchiffon');
  })

  // $leftpanel.on('mousemove', function(e) {  //have to see if 400px works in all cases?
  //   if (e.pageX > 400) {
  //     $menuitems.fadeOut(0);
  //     $menus.css('background-color', 'lemonchiffon');
  //   } 
  // })



  //menu bar
  $('#menu1').on('click', function() {
    window.location.href = './esci-dances.html';
  })

  //image
  $('#dances').on('click', function() {
    window.location.href = './esci-dances.html';
  })

  $('#menu2').on('click', function() {
    window.location.href = './esci-distributions.html';
  })

  $('#distributions').on('click', function() {
    window.location.href = './esci-distributions.html';
  })

  $('#menu3').on('click', function() {
    window.location.href = './esci-d-picture.html';
  })

  $('#d-picture').on('click', function() {
    window.location.href = './esci-d-picture.html';
  })

  $('#menu4').on('click', function() {
    window.location.href = './esci-precision.html';
    //$('#message').show();
  })

  $('#precision').on('click', function() {
    window.location.href = './esci-precision.html';
    //$('#message').show();
  })

  $('#menu5').on('click', function() {
    window.location.href = './esci-correlation.html';
  })

  $('#correlation').on('click', function() {
    window.location.href = './esci-correlation.html';
  }) 

  $('#menu6').on('click', function() {
    window.location.href = './esci-dance-r.html';
  })

  $('#dance-r').on('click', function() {
    window.location.href = './esci-dance-r.html';
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
  
  $('#message').on('click', function() {
    $('#message').hide();
  })

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

