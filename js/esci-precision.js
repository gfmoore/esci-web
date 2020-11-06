/*
Program       esci-precision.js
Author        Gordon Moore
Date          20 August 2020
Description   The JavaScript code for esci-precision
Licence       GNU General Public LIcence Version 3, 29 June 2007
*/

// #region Version history
/*
0.0.1   Initial version
0.0.2   21 Oct 2020 #2 Some development
0.0.3   21 Oct 2020 #2 More development and trying to figure out calcs!!! :(
0.0.4   22 Oct 2020 #2 More investigation into formulae, in development.
0.0.5   23 Oct 2020 #2 Mostly developed except for distribution. Closed.
0.0.6   23 Oct 2020 #3 First stab at moe distribution curve.
0.0.7   26 Oct 2020 #3 Implement the other curves. Need to shade.
0.0.8   26 Oct 2020 #3 Shade added

0.1.0   26 Oct 2020 Basic dev finished, now start tweaking and checking.
0.1.1   27 Oct 2020 #7 Made sliders work as required and fixed inconsistency.
0.1.2   27 Oct 2020 #6 Changed assurance calcs (paired) - using weird df calcs.
0.1.3   27 Oct 2020 #6 Changed calcs (Independent Groups) - as per Excel calcs
0.1.4   28 Oct 2020 #6 Added a missed maximum to dt for Paired assurance calcs, Added temp radio button for type of calc
0.1.5   28 Oct 2020 #6 Added iteration calcs for average, not assurance
0.1.6   28 Oct 2020 #6 Added iteration for assurance and fixed error in paired average.
0.1.7   28 Oct 2020 #6 Added sledgehammer code - so slow to start now.
0.1.8   29 Oct 2020 #6 Refined iteration code and commented out Excel and Sledgehammer code
0.1.9   29 Oct 2020 #3 Draw MoE curve without offset and redraw horizontal axis.
0.1.10  2  Nov 2020 #3 Added vertical axis and label
0.1.11  2  Nov 2020 #6 Removed restriction on minimum N = 3, seems ok
0.1.12  2  Nov 2020 #8 Tooltips added 
0.1.13  3  Nov 2020 #9 Fix figure legend position
0.1.14  3  Nov 2020 #8 Tooltips edited
0.1.15  3  Nov 2020 #10 Display of N now depends on curve
0.1.16  3  Nov 2020 #3  Temporary display of 99th percentile
0.1.17  3  Nov 2020     Display of Target MoE to 3dp (missed that!)
0.1.18  4  Nov 2020 #11 Display N values on average curve with assurance selected
0.1.19  4  Nov 2020 #12 Added gridlines option
0.1.20  5  Nov 2020 #11 Positioning and color of N adjusted for assurance.
0.1.21  5  Nov 2020 #12 Grid lines initially on and tooltip change
0.1.22  6  Nov 2020 #12 Change text in panel3/4

*/
//#endregion 

let version = '0.1.21';
let test = true;

'use strict';
$(function() {
  console.log('jQuery here!');  //just to make sure everything is working

  //#region for variable definitions (just allows code folding)
  let tooltipson              = false;                                        //toggle the tooltips on or off

  let tab                     = 'Unpaired';                                   //what tab?

  const display               = document.querySelector('#display');           //display of pdf area
  let svgD;

  let margin                  = {top: 0, right: 30, bottom: 0, left: 70};     //margins for  display area
  let width;                                                                  //the true width of thedisplay area in pixels
  let heightD;   
  let rwidth;                                                                 //the width returned by resize
  let rheight;                                                                //the height returned by resize

  let xAxis, yAxis;

  let x;
  let y;

  let Nline = [];
  let NlineAss = [];

  let alphaud = 0.05;  //significance level
  let alphapd = 0.05;
  let gamma = 0.99;    //assurance level of 0.01 but used with right tail for jStat.chisquared.inv 
 
  let N;
  let maxN;
  let Nt;

  let df;

  let fmoemax = 2.005;  
  let fmoeinc = 0.005;


  let $targetmoeslider                 = $('#targetmoeslider');
  const $targetmoenudgebackward        = $('#targetmoenudgebackward');
  const $targetmoenudgeforward         = $('#targetmoenudgeforward');

  let targetmoe = 0.4;
  let sliderinuse = false;

  let targetmoeslidertop;
  let targetmoesliderleft;
  let targetmoesliderwidth;

  let pauseId;
  let repeatId;
  let delay = 50;
  let pause = 500;


  //tab 1 panel 1
  const $ciud = $('#ciud');


  //tab 1 panel 2

  const $ncurveudavg = $('#ncurveudavg');
  let ncurveudavg = true;

  const $ncurveudass = $('#ncurveudass');
  let ncurveudass = false;

  //tab 1 panel 3
  const $displayvaluesud = $('#displayvaluesud');
  let displayvaluesud = false;
  const $displaygridlinesud = $('#displaygridlinesud');
  let displaygridlinesud = true;

  //tab 1 panel 4
  let $truncatedisplayudslider = $('#truncatedisplayudslider');
  let truncatedisplayud = 0.25;
  let $truncatedisplayudval = $('#truncatedisplayudval');
  $truncatedisplayudval.val(0.25.toFixed(2));
  let $truncatedisplayudnudgebackward = $('#truncatedisplayudnudgebackward');
  $truncatedisplayudnudgeforward = $('#truncatedisplayudnudgeforward');

  //tab 1 panel 5 CI
  const $CIsectionud = $('#CIsectionud');
  const $CIud = $('#CIud');
 

  //tab 2 panel 1
  const $cipd = $('#cipd');

  //tab 2 panel 2
  let $correlationrhoslider = $('#correlationrhoslider');
  let correlationrho = 0.7;
  $correlationrhoval = $('#correlationrhoval');
  $correlationrhoval.val(correlationrho.toFixed(2));
  $correlationrhonudgebackward = $('#correlationrhonudgebackward');
  $correlationrhonudgeforward  = $('#correlationrhonudgeforward');

  //tab 2 panel 3
  const $ncurvepdavg = $('#ncurvepdavg');
  let ncurvepdavg = true;

  const $ncurvepdass = $('#ncurvepdass');
  let ncurvepdass = false;
  const $displaygridlinespd = $('#displaygridlinespd');
  let displaygridlinespd = true;

  //tab 2 panel 4

  const $displayvaluespd = $('#displayvaluespd');
  displayvaluespd = false;

  //tab 2 panel 5
  let $truncatedisplaypdslider = $('#truncatedisplaypdslider');
  let truncatedisplaypd = 0.25;
  $truncatedisplaypdval = $('#truncatedisplaypdval');
  $truncatedisplaypdval.val(0.25.toFixed(2));
  $truncatedisplaypdnudgebackward = $('#truncatedisplaypdnudgebackward');
  $truncatedisplaypdnudgeforward = $('#truncatedisplaypdnudgeforward');

  //tab 2 panel 6 CI
  const $CIsectionpd = $('#CIsectionpd');
  const $CIpd = $('#CIpd');
   
  let calctype = 'iterate';

  let sledgeunpairerdavg = [];
  let sledgeunpairerdass = [];
  let sledgepairerdavg = [];
  let sledgepairerdass= [];

  //#endregion

  //breadcrumbs
  $('#homecrumb').on('click', function() {
    window.location.href = "https://www.esci.thenewstatistics.com/";
  })

  initialise();

  function initialise() {
    if (test) {
      $displayvaluesud.prop('checked', true);
      displayvaluesud = true;

      $displayvaluespd.prop('checked', true);
      displayvaluespd = true;

      $CIsectionud.hide();
      $CIsectionpd.hide();

    }

    //tab switching
    $('#smarttab').smartTab({
      selected: 0, // Initial selected tab, 0 = first tab
      theme: 'round', // theme for the tab, related css need to include for other than default theme
      orientation: 'horizontal', // Nav menu orientation. horizontal/vertical
      justified: true, // Nav menu justification. true/false
      autoAdjustHeight: true, // Automatically adjust content height
      backButtonSupport: true, // Enable the back button support
      enableURLhash: true, // Enable selection of the tab based on url hash
      transition: {
          animation: 'slide-horizontal', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
          speed: '400', // Transion animation speed
          //easing:'' // Transition animation easing. Not supported without a jQuery easing plugin
      },
      autoProgress: { // Auto navigate tabs on interval
          enabled: false, // Enable/Disable Auto navigation
          interval: 3500, // Auto navigate Interval (used only if "autoProgress" is set to true)
          stopOnFocus: true, // Stop auto navigation on focus and resume on outfocus
      },
      keyboardSettings: {
          keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
          keyLeft: [37], // Left key code
          keyRight: [39] // Right key code
      }
    });

    //goto Unpaired tab
    //$('#smarttab').smartTab("goToTab", 0);

    setTooltips();

    //get initial values for height/width
    rwidth  = $('html').outerWidth(true)  - $('#leftpanel').outerWidth(true);
    rheight = $('#display').outerHeight(true);

    width   = rwidth - margin.left - margin.right;  
    heightD = rheight - margin.top - margin.bottom;

    //do this once?
    //set a reference to the displaypdf area
    d3.selectAll('svg > *').remove();  //remove all elements under svgD
    $('svg').remove();                 //remove the all svg elements from the DOM

    //d3 code for drawing lines
    line = d3.line() 
    .x(function(d, i) { return x(d.fmoe); })
    .y(function(d, i) { return y(d.N); });

    //pdf display
    svgD = d3.select('#display').append('svg').attr('width', '100%').attr('height', '100%');

    $ciud.text(0.4);
    $cipd.text(0.4);

    setupSliders();
    clear();

  }

  //set everything to a default state.
  function clear() {

    if (tab === 'Unpaired') {}
    if (tab === 'Paired') {}

    // #region position sliders
    //reposition target moe slider on resize
    targetmoetop = 0;
    targetmoeleft = margin.left;
    targetmoewidth = width - 50;

    //position the d slider title
    $('#targetmoetitle').css({
      position:'absolute',
      top: targetmoetop,
      left: 10
    })
    
    //position the target slider
    $('#targetmoesliderdiv').css({
      position:'absolute',
      top: targetmoetop,
      left: targetmoeleft,
      width: targetmoewidth
    });

    //position the nudege bars
    $targetmoenudgebackward.css({
      position:'absolute',
      top: targetmoetop,
      left: targetmoeleft+targetmoewidth+10,
    })
    $targetmoenudgeforward.css({
      position:'absolute',
      top: targetmoetop,
      left: targetmoeleft+targetmoewidth+30,
    })    
    // #endregion

    //sort out target moe and relation to truncate display when switching between tabs
    if (tab === 'Unpaired') {
      if (targetmoe < truncatedisplayud) {
        targetmoe = truncatedisplayud;
        updatetargetmoeslider();
      }
    }

    if (tab === 'Paired') {
      if (targetmoe < truncatedisplaypd) {
        targetmoe = truncatedisplaypd;
        updatetargetmoeslider();
      }      
    }

    drawFeatures();
  }
  
  function drawFeatures() {
    drawNline();
    drawTargetMoEBlob();
    //drawTargetMoELine();  //placed in drawMoECurve as I need to be able to draw over it with N label
    drawMoECurve();
  }

  //Switch tabs
  $("#smarttab").on("showTab", function(e, anchorObject, tabIndex) {
    if (tabIndex === 0) {
      tab = 'Unpaired';
      
    }
    if (tabIndex === 1) {
      tab = 'Paired';
    }

    clear();
  });

  function resize() {

    rwidth  = $('html').outerWidth(true)  - $('#leftpanel').outerWidth(true);
    rheight = $('#main').outerHeight(true);

    width   = rwidth - margin.left - margin.right;  
    heightD = rheight - margin.top - margin.bottom;

    clear();
  }

  function setupSliders() {
    $('#targetmoeslider').ionRangeSlider({
      skin: 'big',
      grid: true,
      grid_num: 5,
      type: 'single',
      min: 0.0,
      max: 2.0,
      from: 0.4,
      step: 0.005,
      prettify: prettify3,
      //on slider handles change
      onChange: function (data) {
        targetmoe = data.from;
        if (targetmoe < 0.05) {
          targetmoe = 0.05;
          $targetmoeslider.update({ from: targetmoe });
        }
        sliderinuse = true;  //don't update dslider in redrawdisplay()
        redrawDisplay();
      }
    })
    $targetmoeslider = $('#targetmoeslider').data("ionRangeSlider");

    $('#truncatedisplayudslider').ionRangeSlider({
      skin: 'big',
      grid: true,
      grid_num: 4,
      type: 'single',
      min: 0.05,
      max: 0.3,
      from: 0.25,
      step: 0.05,
      prettify: prettify2,
      //on slider handles change
      onChange: function (data) {
        truncatedisplayud = data.from;
        if (truncatedisplayud < 0.05) {
          truncatedisplayud = 0.05;
          $truncatedisplayudslider.update({ from: truncatedisplayud });
        }
        sliderinuse = true;  //don't update slider in redrawDisplay()
        redrawDisplay();
      }
    })
    $truncatedisplayudslider = $('#truncatedisplayudslider').data("ionRangeSlider");

    $('#truncatedisplaypdslider').ionRangeSlider({
      skin: 'big',
      grid: true,
      grid_num: 4,
      type: 'single',
      min: 0.05,
      max: 0.3,
      from: 0.25,
      step: 0.05,
      prettify: prettify2,
      //on slider handles change
      onChange: function (data) {
        truncatedisplaypd = data.from;
        if (truncatedisplaypd < 0.05) {
          truncatedisplaypd = 0.05;
          $truncatedisplaypdslider.update({ from: truncatedisplaypd });
        }
        sliderinuse = true;  //don't update slider
        redrawDisplay();
      }
    })
    $truncatedisplaypdslider = $('#truncatedisplaypdslider').data("ionRangeSlider");

    $('#correlationrhoslider').ionRangeSlider({
      skin: 'big',
      grid: true,
      grid_num: 4,
      type: 'single',
      min: 0,
      max: 1.0,
      from: 0.7,
      step: 0.005,
      prettify: prettify2,
      //on slider handles change
      onChange: function (data) {
        correlationrho = data.from;
        if (correlationrho >= 0.99) {
          correlationrho = 0.99;
          $correlationrhoslider.update({ from: correlationrho });
        }
        sliderinuse = true;  //don't update slider  in redrawDisplay()
        redrawDisplay();
      }
    })
    $correlationrhoslider = $('#correlationrhoslider').data("ionRangeSlider");


    function prettify0(n) {
      return n.toFixed(0);
    }
  
    function prettify1(n) {
      return n.toFixed(1);
    }
  
    function prettify2(n) {
      return n.toFixed(2);
    }
  
    function prettify3(n) {
      return n.toFixed(3);
    }

  }

  function updatetargetmoeslider() {
    if (targetmoe < 0.05) targetmoe = 0.05;
    if (targetmoe > 2.0) targetmoe = 2.0;
    $targetmoeslider.update({from: targetmoe});
    $ciud.text(targetmoe.toFixed(3));
    $cipd.text(targetmoe.toFixed(3));
  }

  function redrawDisplay() {

    if (!sliderinuse) updatetargetmoeslider();
    sliderinuse = false;
    $ciud.text(targetmoe.toFixed(3));
    $cipd.text(targetmoe.toFixed(3));

    $truncatedisplayudval.val(truncatedisplayud.toFixed(2));    
    $truncatedisplaypdval.val(truncatedisplaypd.toFixed(2));
    $correlationrhoval.val(correlationrho.toFixed(2));

    if (tab === 'Unpaired') {
      if (targetmoe < truncatedisplayud) {
        targetmoe = truncatedisplayud;
        updatetargetmoeslider();
      }
    }

    if (tab === 'Paired') {
      if (targetmoe < truncatedisplaypd) {
        targetmoe = truncatedisplaypd;
        updatetargetmoeslider();
      }
    }

    drawNline();
    drawTargetMoEBlob();

    drawMoECurve();
  }

  function setupAxes() {

    //get maximum values of data points array
    if (tab === 'Unpaired') {
      if (ncurveudass) {
        maxN = d3.max(NlineAss, function(d) { return +d.N;} );
      }
      else {
        maxN = d3.max(Nline, function(d) { return +d.N;} );
      }
    }
    if (tab === 'Paired') {
      if (ncurvepdass) {
        maxN = d3.max(NlineAss, function(d) { return +d.N;} );
      }
      else {
        maxN = d3.max(Nline, function(d) { return +d.N;} );
      }
    }
    if (maxN < 200) maxN = 10 * Math.ceil(maxN/10);
    if (maxN > 200 && maxN < 1000) maxN = 100 * Math.ceil(maxN/100); //now round up to nearest 100
    if (maxN >= 1000) maxN = 1000 * Math.ceil(maxN/1000); //now round up to nearest 100

    //clear axes
    d3.selectAll('.leftaxis').remove();
    d3.selectAll('.leftaxisminorticks').remove();
    d3.selectAll('.leftaxistext').remove();

    d3.selectAll('.bottomaxis').remove();
    d3.selectAll('.bottomaxisminorticks').remove();
    d3.selectAll('.bottomaxistext').remove();

    d3.selectAll('.headertext').remove();

    d3.selectAll('.key').remove();

    d3.selectAll('.gridlines').remove();

    width   = rwidth - margin.left - margin.right;  
    heightD = $('#display').outerHeight(true) - margin.top - margin.bottom;

    x = d3.scaleLinear().domain([0, 2.0]).range([margin.left, width]);
    y = d3.scaleLinear().domain([0, maxN]).range([heightD-50, 60]);  


    //bottom horizontal axis
    xAxis = d3.axisBottom(x);   //.tickSizeOuter(0);  //tickSizeOuter gets rid of the start and end ticks
    svgD.append('g').attr('class', 'bottomaxis').style("font", "1.8rem sans-serif").attr( 'transform', `translate(0, ${heightD-50})` ).call(xAxis);

    //left vertical axis
    yAxis = d3.axisLeft(y);   //.tickSizeOuter(0);  //tickSizeOuter gets rid of the start and end ticks
    svgD.append('g').attr('class', 'leftaxis').style("font", "1.8rem sans-serif").attr( 'transform', `translate(${margin.left}, 0)` ).call(yAxis);

    //add some text labels
    svgD.append('text').text('N').attr('class', 'bottomaxistext').attr('x', 10 ).attr('y', heightD/2).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
    svgD.append('text').text('MoE of 95% CI, in population standard deviation units').attr('class', 'leftaxistext').attr('x', width/4 ).attr('y', heightD-10).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.4rem').style('font-style', 'italic');
    
    //add header labels
    if (tab === 'Unpaired') {
    svgD.append('text').text('Two groups:').attr('class', 'headertext').attr('x', 10 ).attr('y', 20).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem');
    svgD.append('text').text('N').attr('class', 'headertext').attr('x', 130 ).attr('y', 20).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
    svgD.append('text').text('of each group, for desired precision').attr('class', 'headertext').attr('x', 150 ).attr('y', 20).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem');
    }
    else {
      svgD.append('text').text('Paired data:').attr('class', 'headertext').attr('x', 10 ).attr('y', 20).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem');
      svgD.append('text').text('N').attr('class', 'headertext').attr('x', 130 ).attr('y', 20).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
      svgD.append('text').text('is the number of pairs, for desired precision').attr('class', 'headertext').attr('x', 150 ).attr('y', 20).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem');  
    }

    //add additional ticks for x scale
    //the minor ticks
    let interval = d3.ticks(0, 1.5, 16);  //gets an array of where it is putting tick marks

    let i;
    let minortick;
    let minortickmark;

    //half way ticks
    for (i = 1; i < interval.length; i += 1) {
      minortick = (interval[i] - interval[i-1]);
      for (let ticks = 1; ticks <= 16; ticks += 1) {
        minortickmark = interval[i-1] + (minortick * ticks);
        if (minortickmark > 0 && minortickmark < 1.5) svgD.append('line').attr('class', 'bottomaxis').attr('x1', x(minortickmark)).attr('y1', 0).attr('x2', x(minortickmark) ).attr('y2', 10).attr('stroke', 'black').attr('stroke-width', 1).attr( 'transform', `translate(0, ${heightD-50})` );
      }
    }

    //minor ticks
    // for (i=1; i < interval.length; i += 1) {
    //   minortick = (interval[i] - interval[i-1]) / 10;
    //   for (let ticks = 1; ticks <= 10; ticks += 1) {
    //     minortickmark = interval[i-1] + (minortick * ticks);
    //     if (minortickmark > -3 && minortickmark < 3) {
    //          svgS.append('line').attr('class', 'xaxis').attr('x1', x(minortickmark)).attr('y1', 0).attr('x2', x(minortickmark) ).attr('y2', 5).attr('stroke', 'black').attr('stroke-width', 1).attr( 'transform', `translate(0, ${heightD})` );
    //          svgS.append('line').attr('class', 'yaxis').attr('x1', 0).attr('y1', y(minortickmark)).attr('x2', 5 ).attr('y2', y(minortickmark)).attr('stroke', 'black').attr('stroke-width', 1).attr( 'transform', `translate(0, ${heightD})` );
    //      }
    //   }
    // }


    //draw grid lines
    //let yinterval = d3.ticks(0, maxN, 16);  //gets an array of where it is putting tick marks
    const yAxisTickValues = yAxis.scale().ticks()

    if (tab === 'Unpaired' && displaygridlinesud) {
      for (let xi = 0; xi <= 2.1; xi += 0.1) {
        svgD.append('line').attr('class', 'gridlines').attr('x1', x(xi) ).attr('y1', y(0) ).attr('x2', x(xi) ).attr('y2', y(maxN) ).attr('stroke', '#e5e4e2').attr('stroke-width', '1');   //e5e4e2 = platinum
      }
      for (yi = 0; yi < yAxisTickValues.length; yi += 1) {
        svgD.append('line').attr('class', 'gridlines').attr('x1', x(0) ).attr('y1', y(yAxisTickValues[yi]) ).attr('x2', x(2) ).attr('y2', y(yAxisTickValues[yi]) ).attr('stroke', '#e5e4e2').attr('stroke-width', '1');
      }
    }

    if (tab === 'Paired' && displaygridlinespd) {
      for (let xi = 0; xi <= 2.1; xi += 0.1) {
        svgD.append('line').attr('class', 'gridlines').attr('x1', x(xi) ).attr('y1', y(0) ).attr('x2', x(xi) ).attr('y2', y(maxN) ).attr('stroke', '#e5e4e2').attr('stroke-width', '1');
      }
      for (let yi = 0; yi < yAxisTickValues.length; yi += 1) {
        svgD.append('line').attr('class', 'gridlines').attr('x1', x(0) ).attr('y1', y(yAxisTickValues[yi]) ).attr('x2', x(2) ).attr('y2', y(yAxisTickValues[yi]) ).attr('stroke', '#e5e4e2').attr('stroke-width', '1');
      }
    }
    

    //display key
    let poslegend = width-420;
    let legendbreak = false;
    if (width < 650) {
      poslegend = width - 260;
      legendbreak = true;
    }

    //with average
    if ( (tab === 'Unpaired' && ncurveudavg) || (tab === 'Paired' && ncurvepdavg) ) {
      svgD.append('circle').attr('class', 'key').attr('cx', poslegend - 20).attr('cy', 145).attr('r', '5').attr('fill', 'black').attr('font-size', '1.4rem').style('font-style', 'italic');
      svgD.append('line').attr('class', 'key').attr('x1', poslegend - 40 ).attr('y1', 145).attr('x2', poslegend + 0 ).attr('y2', 145).attr('stroke', 'black').attr('stroke-width', '3');
      svgD.append('text').text('N,').attr('class', 'key').attr('x', poslegend +10).attr('y', 150).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
      if (!legendbreak) {
        svgD.append('text').text('for average MoE no more than target MoE').attr('class', 'key').attr('x', poslegend + 40).attr('y', 150).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
      }
      else {
        svgD.append('text').text('for average MoE no more').attr('class', 'key').attr('x', poslegend + 40).attr('y', 150).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
        svgD.append('text').text(' than target MoE').attr('class', 'key').attr('x', poslegend + 40).attr('y', 180).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
      }
    }

    //with assurance
    if ( (tab === 'Unpaired' && ncurveudass) || (tab === 'Paired' && ncurvepdass) ) {
      svgD.append('circle').attr('class', 'key').attr('cx', poslegend - 20).attr('cy', 120).attr('r', '5').attr('fill', 'red').attr('font-size', '1.4rem').style('font-style', 'italic');
      svgD.append('line').attr('class', 'key').attr('x1', poslegend - 40 ).attr('y1', 120).attr('x2', poslegend + 0 ).attr('y2', 120).attr('stroke', 'red').attr('stroke-width', '3');
      svgD.append('text').text('N,').attr('class', 'key').attr('x', poslegend +10).attr('y', 125).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
      svgD.append('text').text('with assurance').attr('class', 'key').attr('x', poslegend + 40).attr('y', 125).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');

      // //average with assurance
      svgD.append('circle').attr('class', 'key').attr('cx', poslegend - 20 ).attr('cy', 145).attr('r', '5').attr('fill', 'lightgray').attr('font-size', '1.4rem').style('font-style', 'italic');
      svgD.append('line').attr('class', 'key').attr('x1', poslegend - 40 ).attr('y1', 145).attr('x2', poslegend + 0 ).attr('y2', 145).attr('stroke', 'lightgray').attr('stroke-width', '3');
      svgD.append('text').text('N,').attr('class', 'key').attr('x', poslegend + 10).attr('y', 150).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
      if (!legendbreak) {
        svgD.append('text').text('for average MoE no more than target MoE').attr('class', 'key').attr('x', poslegend + 40).attr('y', 150).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
      }
      else {
        svgD.append('text').text('for average MoE no more').attr('class', 'key').attr('x', poslegend + 40).attr('y', 150).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
        svgD.append('text').text(' than target MoE').attr('class', 'key').attr('x', poslegend + 40).attr('y', 180).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');

      }
    }

    // //MoE distribution
    if (!legendbreak) {
      svgD.append('line').attr('class', 'key').attr('x1', poslegend - 40 ).attr('y1', 170).attr('x2', poslegend + 0 ).attr('y2', 170).attr('stroke', '#993300').attr('stroke-width', '3');
      svgD.append('text').text('MoE distribution').attr('class', 'key').attr('x', poslegend + 10).attr('y', 175).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
    }
    else {
      svgD.append('line').attr('class', 'key').attr('x1', poslegend - 40 ).attr('y1', 200).attr('x2', poslegend + 0 ).attr('y2', 200).attr('stroke', '#993300').attr('stroke-width', '3');
      svgD.append('text').text('MoE distribution').attr('class', 'key').attr('x', poslegend + 10).attr('y', 205).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.8rem').style('font-style', 'italic');
    }
    



  }

  function drawNline() {
    let cv; //critical value

    Nline = [];
    NlineAss = [];


    d3.selectAll('.Nline').remove();
    d3.selectAll('.NlineAss').remove();

    d3.selectAll('.Nlinetext').remove();
    d3.selectAll('.Nlinetextbox').remove();

    d3.selectAll('.NlinetextAss').remove();

    alphaud = parseFloat($CIud.val());
    alphapd = parseFloat($CIpd.val());

    if (calctype === 'excel') calcWithExcel();
    if (calctype === 'iterate') calcWithIterate();
    if (calctype === 'sledgehammer') calcWithSledgehammer();

    //now display the line(s)
    setupAxes();  //have to call this  as will need to redisplay vertical axis as maxN changes

    if (tab === 'Unpaired') {
      if (ncurveudavg) {  //if average
        //the z line
        //svgD.append('path').attr('class', 'Nline').attr('d', line(Nlinez)).attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none');
        svgD.append('path').attr('class', 'Nline').attr('d', line(Nline)).attr('stroke', 'black').attr('stroke-width', 2).attr('fill', 'none');
      }
      if (ncurveudass) {  //if assurance
        svgD.append('path').attr('class', 'Nline').attr('d', line(Nline)).attr('stroke', 'lightgray').attr('stroke-width', 2).attr('fill', 'none');
        svgD.append('path').attr('class', 'NlineAss').attr('d', line(NlineAss)).attr('stroke', 'red').attr('stroke-width', 2).attr('fill', 'none');
      }
    }

    if (tab === 'Paired') {
      if (ncurvepdavg) {  //if average
        svgD.append('path').attr('class', 'Nline').attr('d', line(Nline)).attr('stroke', 'black').attr('stroke-width', 2).attr('fill', 'none');
      }
      if (ncurvepdass) {  //if assurance
        svgD.append('path').attr('class', 'Nline').attr('d', line(Nline)).attr('stroke', 'lightgray').attr('stroke-width', 2).attr('fill', 'none');
        svgD.append('path').attr('class', 'NlineAss').attr('d', line(NlineAss)).attr('stroke', 'red').attr('stroke-width', 2).attr('fill', 'none');
      }
    }


    //Now decide whether to display N values
    if (tab === 'Unpaired' && displayvaluesud) {
      $.each(Nline, function(key, value) {
        //only plot blobs at 0.05 intervals
        if (parseInt(1000 * value.fmoe) % 50 === 0) {
          svgD.append('circle').attr('class', 'Nlinetext').attr('cx', x(value.fmoe)).attr('cy', y(value.N)).attr('r', 4).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'black');  
          //don't draw if intersection with targetmoe as already drawn in bold
          if (Math.abs(targetmoe -value.fmoe) > 0.01) {
            //draw a blank box
            svgD.append('rect').attr('class', 'Nlinetextbox').attr('x', x(value.fmoe) - 10 ).attr('y', y(value.N) + 6 ).attr('width', 20 ).attr('height', 16 ).attr('stroke', 0).attr('fill', 'white');
            svgD.append('text').text(value.N).attr('class', 'Nlinetext').attr('x', x(value.fmoe) - 10 ).attr('y', y(value.N) + 20 ).attr('text-anchor', 'start').attr('fill', 'black');
          }
        }

      })

      //make grey
      if (ncurveudass) {
        d3.selectAll('.Nline').attr('stroke', 'lightgray');   
        d3.selectAll('.Nlinetext').attr('stroke', 'lightgray').attr('fill', 'lightgray');        
      }

      if (displayvaluesud) {
        $.each(NlineAss, function(key, value) {
          //only plot blobs at 0.05 intervals
          if (parseInt(1000 * value.fmoe) % 50 === 0) {
            svgD.append('circle').attr('class', 'NlinetextAss').attr('cx', x(value.fmoe)).attr('cy', y(value.N)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'red');  
            //don't draw if intersection with targetmoe as already drawn in bold
            if (Math.abs(targetmoe -value.fmoe) > 0.01) svgD.append('text').text(value.N).attr('class', 'NlinetextAss').attr('x', x(value.fmoe) + 5 ).attr('y', y(value.N) - 7 ).attr('text-anchor', 'start').attr('fill', 'red');
          }
        })
      }
    }

    if (tab === 'Paired' && displayvaluespd) {
      $.each(Nline, function(key, value) {
        //only plot blobs at 0.05 intervals
        if (parseInt(1000 * value.fmoe) % 50 === 0) {
          svgD.append('circle').attr('class', 'Nlinetext').attr('cx', x(value.fmoe)).attr('cy', y(value.N)).attr('r', 4).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'black');  
          //don't draw if intersection with targetmoe as already drawn in bold
          if (Math.abs(targetmoe -value.fmoe) > 0.01) {
            //draw a blank box
            svgD.append('rect').attr('class', 'Nlinetextbox').attr('x', x(value.fmoe) - 10 ).attr('y', y(value.N) + 6 ).attr('width', 20 ).attr('height', 16 ).attr('stroke', 0).attr('fill', 'white');
            svgD.append('text').text(value.N).attr('class', 'Nlinetext').attr('x', x(value.fmoe) - 10 ).attr('y', y(value.N) + 20 ).attr('text-anchor', 'start').attr('fill', 'black');
          }
        }
      })

      //make grey
      if (ncurvepdass) {
        d3.selectAll('.Nline').attr('stroke', 'lightgray');   
        d3.selectAll('.Nlinetext').attr('stroke', 'lightgray').attr('fill', 'lightgray');        
      }      

      if (displayvaluespd) {
        $.each(NlineAss, function(key, value) {
          //only plot blobs at 0.05 intervals
          if (parseInt(1000 * value.fmoe) % 50 === 0) {
            svgD.append('circle').attr('class', 'NlinetextAss').attr('cx', x(value.fmoe)).attr('cy', y(value.N)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'red');  
            //don't draw if intersection with targetmoe as already drawn in bold
            if (Math.abs(targetmoe - value.fmoe) > 0.01) svgD.append('text').text(value.N).attr('class', 'NlinetextAss').attr('x', x(value.fmoe) + 5 ).attr('y', y(value.N) - 7 ).attr('text-anchor', 'start').attr('fill', 'red');
          }
        })
      }
    }

  }


  function calcWithIterate() {
    let f;
    cv = Math.abs(jStat.normal.inv( alphaud/2, 0, 1));  //1.96

    if (tab === 'Unpaired') {
      //average
      for (let fmoe = truncatedisplayud; fmoe < fmoemax; fmoe += fmoeinc) {

        //Nt = Math.max(Math.ceil(2 * (cv/fmoe)**2), 3);  //this is N0
        Nt = Math.ceil(2 * (cv/fmoe)**2);
        while (true) {
          f = Math.abs(jStat.studentt.inv( alphaud/2, 2*Nt-2 )) / Math.sqrt(Nt/2);
          if (f <= fmoe) break;
          Nt += 1;
        }

        Nline.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: Nt } );   
      }

      //assurance
      if (ncurveudass) {
        for (let fmoe = truncatedisplayud; fmoe < fmoemax; fmoe += fmoeinc) {
    
          // Nt = Math.max(Math.ceil(2 * (cv/fmoe)**2), 3);
          Nt = Math.ceil(2 * (cv/fmoe)**2);
          while (true) {
            f = Math.abs( jStat.studentt.inv( alphaud/2, 2*Nt - 2 ) ) / (Math.sqrt( Nt * (Nt - 1) / ( jStat.chisquare.inv(gamma, 2*Nt - 2))  )) ;
            if (f <= fmoe) break;
            Nt += 1;
          }
 
          NlineAss.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: Nt} );   
        }
      }
    }

    if (tab === 'Paired') {
      //average
      for (let fmoe = truncatedisplaypd; fmoe < fmoemax; fmoe += fmoeinc) {

        // Nt = Math.max(Math.ceil(2*(1 - correlationrho) * (cv/fmoe)**2), 3);
        Nt = Math.ceil(2*(1 - correlationrho) * (cv/fmoe)**2);
        while (true) {
          f = Math.abs(jStat.studentt.inv( alphapd/2, Nt-1 )) / Math.sqrt(Nt/(2 * (1 - correlationrho)));
          if (f <= fmoe) break;
          Nt += 1;
        }

        Nline.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: Nt } );   
      }

      //assurance
      if (ncurvepdass) {
        for (let fmoe = truncatedisplaypd; fmoe < fmoemax; fmoe += fmoeinc) {

          // Nt = Math.max(Math.ceil(2 * (1 - correlationrho) * (cv/fmoe)**2), 3);
          Nt = Math.ceil(2 * (1 - correlationrho) * (cv/fmoe)**2);
          while (true) {
            f = Math.abs( jStat.studentt.inv( alphapd/2, Nt - 1 ) ) / (Math.sqrt( Nt * (Nt - 1) / ( 2*(1-correlationrho) * jStat.chisquare.inv(gamma, Nt - 1)) ));
            if (f <= fmoe) break;
            Nt += 1;
          }

          NlineAss.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: Nt } );    
        }
      }
    }

  }

  function drawTargetMoELine() {
    d3.selectAll('.targetmoeline').remove();
    d3.selectAll('.targetmoelinetext').remove();

    //draw vertical line and label
    svgD.append('line').attr('class', 'targetmoeline').attr('x1', x(targetmoe)).attr('y1', y(0)).attr('x2', x(targetmoe)).attr('y2', y(maxN)).attr('stroke', 'firebrick').attr('stroke-width', 3).attr('fill', 'none');
    svgD.append('text').text('Target MoE').attr('class', 'targetmoelinetext').attr('x', x(targetmoe) - 40 ).attr('y', y(maxN)-20).attr('text-anchor', 'start').attr('fill', 'firebrick').attr('font-size', '1.8rem');
  }

  function drawTargetMoEBlob() {

    let Nass, Navg;

    d3.selectAll('.targetmoelineblob').remove();
    d3.selectAll('.targetmoelineblobtext').remove();

  
    //find the N for that fmoe value from the Nline data array of objects (probably a functional way, but hey this works)
    if (tab === 'Unpaired' && ncurveudavg) {
      for (let i = 0; i < Nline.length; i += 1) {
        if (Math.abs(targetmoe - Nline[i].fmoe) < 0.001) {
          Navg = Nline[i].N;
          break;
        }
      }
    }

    if (tab === 'Unpaired' && ncurveudass) {
      for (let i = 0; i < NlineAss.length; i += 1) {
        if (Math.abs(targetmoe - NlineAss[i].fmoe) < 0.001) {
          Nass = NlineAss[i].N;
          Navg = Nline[i].N;
          break;
        }
      }
    }

    if (tab === 'Paired' && ncurvepdavg) {
      for (let i = 0; i < Nline.length; i += 1) {
        if (Math.abs(targetmoe - Nline[i].fmoe) < 0.001) {
          Navg = Nline[i].N;
          break;
        }
      }
    }

    if (tab === 'Paired' && ncurvepdass) {
      for (let i = 0; i < NlineAss.length; i += 1) {
        if (Math.abs(targetmoe - NlineAss[i].fmoe) < 0.001) {
          Nass = NlineAss[i].N;
          Navg = Nline[i].N;
          break;
        }
      }
    }

    //Now add a blob and value at intersection    
    if (tab === 'Unpaired' && ncurveudavg) {
      svgD.append('circle').attr('class', 'targetmoelineblob').attr('cx', x(targetmoe)).attr('cy', y(Navg)).attr('r', 4).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'black');  
      svgD.append('rect').attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe)+5).attr('y', y(Navg)-21 ).attr('width', 35 ).attr('height', 17 ).attr('stroke', 0).attr('fill', 'white');
      svgD.append('text').text(Navg).attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe) + 5 ).attr('y', y(Navg) - 9 ).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.6rem').attr('font-weight', 'bold');
    }

    if (tab === 'Unpaired' && ncurveudass) {
      svgD.append('circle').attr('class', 'targetmoelineblob').attr('cx', x(targetmoe)).attr('cy', y(Nass)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'red');  
      svgD.append('rect').attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe)+5).attr('y', y(Nass)-21 ).attr('width', 35 ).attr('height', 17 ).attr('stroke', 0).attr('fill', 'white');
      svgD.append('text').text(Nass).attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe) + 5 ).attr('y', y(Nass) - 9 ).attr('text-anchor', 'start').attr('fill', 'red').attr('font-size', '1.6rem').attr('font-weight', 'bold');

      svgD.append('circle').attr('class', 'targetmoelineblob').attr('cx', x(targetmoe)).attr('cy', y(Navg)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'lightgray');  
      svgD.append('rect').attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe)-34).attr('y', y(Navg) + 2 ).attr('width', 32 ).attr('height', 19 ).attr('stroke', 0).attr('fill', 'white');
      svgD.append('text').text(Navg).attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe) -33 ).attr('y', y(Navg) + 17 ).attr('text-anchor', 'start').attr('fill', 'silver').attr('font-size', '1.6rem').attr('font-weight', 'bold');
    }

    if (tab === 'Paired' && ncurvepdavg) {
      svgD.append('circle').attr('class', 'targetmoelineblob').attr('cx', x(targetmoe)).attr('cy', y(Navg)).attr('r', 4).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'black');  
      svgD.append('rect').attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe)+5).attr('y', y(Navg)-21 ).attr('width', 35 ).attr('height', 17 ).attr('stroke', 0).attr('fill', 'white');
      svgD.append('text').text(Navg).attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe) + 5 ).attr('y', y(Navg) - 9 ).attr('text-anchor', 'start').attr('fill', 'black').attr('font-size', '1.6rem').attr('font-weight', 'bold');
    }

    if (tab === 'Paired' && ncurvepdass) {
      svgD.append('circle').attr('class', 'targetmoelineblob').attr('cx', x(targetmoe)).attr('cy', y(Nass)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'red');  
      svgD.append('rect').attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe)+5).attr('y', y(Nass)-21 ).attr('width', 35 ).attr('height', 19 ).attr('stroke', 0).attr('fill', 'white');
      svgD.append('text').text(Nass).attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe) + 5 ).attr('y', y(Nass) - 9 ).attr('text-anchor', 'start').attr('fill', 'red').attr('font-size', '1.6rem').attr('font-weight', 'bold');

      svgD.append('circle').attr('class', 'targetmoelineblob').attr('cx', x(targetmoe)).attr('cy', y(Navg)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'lightgray');  
      svgD.append('rect').attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe)-34).attr('y', y(Navg) + 2 ).attr('width', 32 ).attr('height', 17 ).attr('stroke', 0).attr('fill', 'white');
      svgD.append('text').text(Navg).attr('class', 'targetmoelineblobtext').attr('x', x(targetmoe) -33 ).attr('y', y(Navg) + 17 ).attr('text-anchor', 'start').attr('fill', 'silver').attr('font-size', '1.6rem').attr('font-weight', 'bold');
    }

    //draw a blob and N value at assuranceintersection
    // if (ncurveudass || ncurvepdass) {
    //       //draw a blob and N value at intersection

    //   if (tab === 'Unpaired' && ncurveudass) {
    //     svgD.append('circle').attr('class', 'targetmoelineblobAss').attr('cx', x(targetmoe)).attr('cy', y(n)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'red');  
    //     svgD.append('text').text(n).attr('class', 'targetmoelineblobtextAss').attr('x', x(targetmoe) + 10 ).attr('y', y(n) - 7 ).attr('text-anchor', 'start').attr('fill', 'red').attr('font-weight', 'bold');
    //   }

    //   if (tab === 'Paired' && ncurvepdass) {
    //     svgD.append('circle').attr('class', 'targetmoelineblobAss').attr('cx', x(targetmoe)).attr('cy', y(n)).attr('r', 4).attr('stroke', 'red').attr('stroke-width', 1).attr('fill', 'red');  
    //     svgD.append('text').text(n).attr('class', 'targetmoelineblobtextAss').attr('x', x(targetmoe) + 10 ).attr('y', y(n) - 7 ).attr('text-anchor', 'start').attr('fill', 'red').attr('font-weight', 'bold');
    //   }

    // }

  }

  function drawMoECurve() {

    d3.selectAll('.moecurve').remove();

    let moedist = [];
    let f;
    let fgamma;
    let f2; //(^2/() in Excel)
    //let n;
    //let df;
    let Rcum;

    n=0;
    //get n for fmoe
    if (tab === 'Unpaired') {
      if (ncurveudavg) {
        for (let i = 0; i < Nline.length; i += 1) {
          if (Math.abs(targetmoe - Nline[i].fmoe) < 0.001) {
            N = Nline[i].N;
            break;
          }
        }    
      }

      if (ncurveudass) {
        for (let i = 0; i < NlineAss.length; i += 1) {
          if (Math.abs(targetmoe - NlineAss[i].fmoe) < 0.001) {
            N = NlineAss[i].N;
            break;
          }
        }    
      }

    }
    if (tab === 'Paired') {
      if (ncurvepdavg) {
        for (let i = 0; i < Nline.length; i += 1) {
          if (Math.abs(targetmoe - Nline[i].fmoe) < 0.001) {
            N = Nline[i].N;
            break;
          }
        }    
      }

      if (ncurvepdass) {
        for (let i = 0; i < NlineAss.length; i += 1) {
          if (Math.abs(targetmoe - NlineAss[i].fmoe) < 0.001) {
            N = NlineAss[i].N;
            break;
          }
        }
  
      }
    }

    for (let fmoe = 0; fmoe < fmoemax; fmoe += fmoeinc) {

      if (tab === 'Unpaired') {
        df = 2*N - 2;
        f = Math.sqrt( 2 / N) * Math.abs( jStat.studentt.inv( alphaud/2, df));
      }

      if (tab === 'Paired') {
        df = N - 1;
        f = Math.sqrt( 2 * (1 - correlationrho) / N) * Math.abs( jStat.studentt.inv( alphapd/2, df));
      }

      f2 = (fmoe * fmoe) / (f * f / df);
      Rcum = 1 - jStat.chisquare.cdf(f2, df);

      moedist.push( { fmoe: parseFloat(fmoe.toFixed(3)), Rcum: Rcum, ord: 0, N: 0})
    }
    

    //now scan and obtain the ordinate value, make a note of the max value and where ord > 0 for drawing axis
    let ord;
    let notzero = 0;
    let maxmoe = 0;
    let maxord = 0;
    for (let i = 1; i < moedist.length - 1; i += 1) {
      ord = (moedist[i-1].Rcum - moedist[i+1].Rcum) / (2 * fmoeinc);
      moedist[i].ord = ord;
      moedist[i].N = Math.abs(1 * ord);  //in case I wanted to scale it
      if (notzero === 0 && ord > 0.01) notzero = moedist[i].fmoe; //note where ord > 0
      if (ord > maxmoe) maxmoe = ord; 
      if (ord > maxord) maxord = ord;
    }

    // a position for drawing the label, :sigh
    let halfwayx = 0; 
    let halfwayy = 0;
    for (let i = 1; i < moedist.length - 1; i += 1) {
      if (moedist[i].ord > maxmoe/2) {
        halfwayx = moedist[i].fmoe;
        break;
      }
    }
    halfwayx -= 0.03;   //0.07 is to left of curve
    halfwayy = maxord/2;


    //draw curve and shade
     svgD.append('path').attr('class', 'moecurve').attr('d', line(moedist)).attr('stroke', '#993300').attr('stroke-width', 2).attr('fill', '#FFCC99');

     //drawMoE line here
     drawTargetMoELine();

    //draw a vertical and N
    //just work out position of label
    let labelh = maxmoe/2;
    if (labelh < 3) labelh = 3;

    svgD.append('line').attr('class', 'moecurve').attr('x1', x(notzero)).attr('y1', y(0)).attr('x2', x(notzero)).attr('y2', y(maxmoe)-20).attr('stroke', '#993300').attr('stroke-width', 1).attr('fill', 'none');
    if (N < 100) svgD.append('rect').attr('class', 'moecurve').attr('x', x(halfwayx)).attr('y', y(halfwayy)-16 ).attr('width', 30 ).attr('height', 18 ).attr('stroke', 0).attr('fill', 'white');
    if (N >= 100) svgD.append('rect').attr('class', 'moecurve').attr('x', x(halfwayx)).attr('y', y(halfwayy)-16 ).attr('width', 36 ).attr('height', 18 ).attr('stroke', 0).attr('fill', 'white');
    svgD.append('text').text(N).attr('class', 'moecurve').attr('x', x(halfwayx)).attr('y', y(halfwayy)).attr('text-anchor', 'start').attr('fill', '#993300').attr('font-size', '1.8rem').attr('font-weight', 'bold');

     //redraw bottom horizotal axis
     svgD.append('g').attr('class', 'bottomaxis').style("font", "1.8rem sans-serif").attr( 'transform', `translate(0, ${heightD-50})` ).call(xAxis);


     //temp 99th percentile values
    //get Rcum value
    // let rcum991 = 0;
    // let rcum992 = 0;
    // let moe991 = 0;
    // let moe992 = 0;
    // for (let i = 1; i < moedist.length - 1; i += 1) {
    //   if (moedist[i].Rcum <= 0.01) {
    //     moe991 = moedist[i-1].fmoe;
    //     rcum991 = moedist[i-1].Rcum;
    //     moe992 = moedist[i].fmoe;
    //     rcum992 = moedist[i].Rcum;
    //     break;
    //   } 
    // }
    // //console.log(moe991 + ' - ' + moe992);
    // $('#moea').text(moe991.toFixed(3));
    // $('#rcuma').text(rcum991.toFixed(6));
    // $('#moeb').text(moe992.toFixed(3));
    // $('#rcumb').text(rcum992.toFixed(6));

  }



  /*---------------------------------------------Tab 1 Panel 2 N Curves radio button-------------------*/

  $ncurveudavg.on('change', function() {
    ncurveudavg = true;
    ncurveudass = false;

    drawFeatures()
  })

  $ncurveudass.on('change', function() {
    ncurveudavg = false;
    ncurveudass = true;

    drawFeatures()
  })

  /*---------------------------------------------Tab 1 Panel 3 Display Values checkbox-------------------*/

  $displayvaluesud.on('change', function() {
    displayvaluesud = $displayvaluesud.is(':checked');
    
    drawFeatures()
  })

  $displaygridlinesud.on('change', function() {
    displaygridlinesud = $displaygridlinesud.is(':checked');

    drawFeatures();
  })

  /*---------------------------------------------Tab 1 Panel 4 Truncate MoE----------------------------*/

  /*-------------------------------------------- Tab 1 Panel 5 CIs-------------------------------------*/

  $CIud.on('change', function() {
    alphaud = parseFloat($CIud.val()); 

    drawFeatures()
  })

  /*---------------------------------------------Tab 2 Panel 1 Target MoE------------------------------*/

  /*---------------------------------------------Tab 2 Panel 2 N Curves radio button-------------------*/

  $ncurvepdavg.on('change', function() {
    ncurvepdavg = true;
    ncurvepdass = false;

    drawFeatures()
  })

  $ncurvepdass.on('change', function() {
    ncurvepdavg = false;
    ncurvepdass = true;

    drawFeatures()
  })



  /*---------------------------------------------Tab 2 Panel 4 Display Values checkbox-------------------*/

  $displayvaluespd.on('change', function() {
    displayvaluespd = $displayvaluespd.is(':checked');

    drawFeatures();
  })

  $displaygridlinespd.on('change', function() {
    displaygridlinespd = $displaygridlinespd.is(':checked');

    drawFeatures();
  })

  /*---------------------------------------------Tab 2 Panel 5 Truncate MoE----------------------------*/

 /*--------------------------------------------- Tab 2 Panel 6 CIs-------------------------------------*/

 $CIpd.on('change', function() {
  alphapd = parseFloat($CIpd.val()); 

  drawFeatures()
})

  // #region  -----------------------------------Nudge bars ------------------------------------------------

  /*---------------------------------------------Target MoE nudge bars ----------------------------------------------*/

  //Target MoE nudge backwards
  $targetmoenudgebackward.on('mousedown', function() {
    targetmoenudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        targetmoenudgebackward();
      }, delay );
    }, pause)  
  })

  $targetmoenudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function targetmoenudgebackward() {
    targetmoe -= 0.005;
    if (targetmoe < 0.05) targetmoe = 0.05;
    sliderinuse = true;
    updatetargetmoeslider()
    redrawDisplay();
  }
  
  //Target MoE nudge forwards
  $targetmoenudgeforward.on('mousedown', function() {
    targetmoenudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        targetmoenudgeforward();
      }, delay );
    }, pause)
  })

  $targetmoenudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function targetmoenudgeforward() {
    targetmoe += 0.005;
    if (targetmoe > 2.0) targetmoe = 2.0;
    sliderinuse = true;
    updatetargetmoeslider()
    redrawDisplay();
  }

  /*----------------------------------------truncate display ud nudge bars-----------*/

  //changes to the trucated display unpaired data
  $truncatedisplayudval.on('change', function() {
    if ( isNaN($truncatedisplayudval.val()) ) {
      $truncatedisplayudval.val(truncatedisplayud.toFixed(2));
      return;
    };
    truncatedisplayud = parseFloat($truncatedisplayudval.val()).toFixed(2);
    if (truncatedisplayud < 0.05) {
      truncatedisplayud = 0.05;
    }
    if (truncatedisplayud > 0.3) {
      truncatedisplayud = 0.3;
    }
    $truncatedisplayudval.val(truncatedisplayud.toFixed(2));
    updatetruncatedisplayud();
  })

  $truncatedisplayudnudgebackward.on('mousedown', function() {
    truncatedisplayudnudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        truncatedisplayudnudgebackward();
      }, delay );
    }, pause)
  })

  $truncatedisplayudnudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function truncatedisplayudnudgebackward() {
    truncatedisplayud -= 0.05;
    if (truncatedisplayud < 0.05) truncatedisplayud = 0.05;
    $truncatedisplayudval.val(truncatedisplayud.toFixed(2));
    updatetruncatedisplayud();
  }

  $truncatedisplayudnudgeforward.on('mousedown', function() {
    truncatedisplayudnudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        truncatedisplayudnudgeforward();
      }, delay );
    }, pause)
  })

  $truncatedisplayudnudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function truncatedisplayudnudgeforward() {
    truncatedisplayud += 0.05;
    if (truncatedisplayud > 0.3) truncatedisplayud = 0.3;
    $truncatedisplayudval.val(truncatedisplayud.toFixed(2));
    updatetruncatedisplayud();
  }

  function updatetruncatedisplayud() {
    $truncatedisplayudslider.update({
      from: truncatedisplayud
    })
    
    redrawDisplay();
  }

  /*----------------------------------------truncate display pd nudge bars-----------*/
  //changes to the trucated display unpaired data
  $truncatedisplaypdval.on('change', function() {
    if ( isNaN($truncatedisplaypdval.val()) ) {
      $truncatedisplaypdval.val(truncatedisplaypd.toFixed(2));
      return;
    };
    truncatedisplaypd = parseFloat($truncatedisplaypdval.val()).toFixed(2);
    if (truncatedisplaypd < 0.05) {
      truncatedisplaypd = 0.05;
    }
    if (truncatedisplaypd > 0.3) {
      truncatedisplaypd = 0.3;
    }
    $truncatedisplaypdval.val(truncatedisplaypd.toFixed(2));
    updatetruncatedisplaypd();
  })

  $truncatedisplaypdnudgebackward.on('mousedown', function() {
    truncatedisplaypdnudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        truncatedisplaypdnudgebackward();
      }, delay );
    }, pause)
  })

  $truncatedisplaypdnudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function truncatedisplaypdnudgebackward() {
    truncatedisplaypd -= 0.05;
    if (truncatedisplaypd < 0.05) truncatedisplaypd = 0.05;
    $truncatedisplaypdval.val(truncatedisplaypd.toFixed(1));
    updatetruncatedisplaypd();
  }

  $truncatedisplaypdnudgeforward.on('mousedown', function() {
    truncatedisplaypdnudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        truncatedisplaypdnudgeforward();
      }, delay );
    }, pause)
  })

  $truncatedisplaypdnudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function truncatedisplaypdnudgeforward() {
    truncatedisplaypd += 0.05;
    if (truncatedisplaypd > 0.3) truncatedisplaypd = 0.3;
    $truncatedisplaypdval.val(truncatedisplaypd.toFixed(2));
    updatetruncatedisplaypd();
  }

  function updatetruncatedisplaypd() {
    $truncatedisplaypdslider.update({
      from: truncatedisplaypd
    })

    redrawDisplay();
  }


  /*----------------------------------------correlation rho nudge bars-----------*/
  //changes to the correlation rho unpaired data
  $correlationrhoval.on('change', function() {
    if ( isNaN($correlationrhoval.val()) ) {
      $correlationrhoval.val(correlationrhopd.toFixed(2));
      return;
    };
    correlationrho = parseFloat($correlationrhoval.val()).toFixed(2);
    if (correlationrho < 0) {
      correlationrho = 0;
    }
    if (correlationrho > 0.99) {
      correlationrho = 0.99;
    }
    $correlationrhoval.val(correlationrho.toFixed(2));
    updatecorrelationrho();
  })

  $correlationrhonudgebackward.on('mousedown', function() {
    correlationrhonudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        correlationrhonudgebackward();
      }, delay );
    }, pause)
  })

  $correlationrhonudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function correlationrhonudgebackward() {
    correlationrho -= 0.01;
    if (correlationrho < 0 ) correlationrho = 0;
    $correlationrhoval.val(correlationrho.toFixed(2));
    updatecorrelationrho();
  }

  $correlationrhonudgeforward.on('mousedown', function() {
    correlationrhonudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        correlationrhonudgeforward();
      }, delay );
    }, pause)
  })

  $correlationrhonudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function correlationrhonudgeforward() {
    correlationrho += 0.01;
    if (correlationrho > 0.99) correlationrho = 0.99;
    $correlationrhoval.val(correlationrho.toFixed(2));
    updatecorrelationrho();
  }

  function updatecorrelationrho() {
    $correlationrhoslider.update({
      from: correlationrho
    })
    redrawDisplay();
  }

  //#endregion

  /*---------------------------------------------Tooltips on or off-------------------------------------- */

  function setTooltips() {
    Tipped.setDefaultSkin('esci');

    //heading section
    Tipped.create('#logo',          'Version: '+version,                              { skin: 'red', size: 'versionsize', behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
  
    Tipped.create('#tooltipsonoff', 'Tips on/off, default is off!',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.headingtip',    'https://thenewstatistics.com',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.hometip',       'Click to return to esci Home',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });


    Tipped.create('.tab1tip',     'Two Independent Groups Design, each group of size <em>N</em>', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.tab2tip',     'Paired Design, with group of size <em>N</em>', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.targettip',  'Use large slider below figure to choose a value for target MoE', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#ciud',        'Value of target MoE, marked by position of cursor', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#cipd',        'Value of target MoE, marked by position of cursor', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });


    Tipped.create('.ncurvestip', 'Curves show the relation between <em>N</em> and target MoE', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.ncaveragetip', 'Black curve shows how <em>N</em> varies with target MoE on average', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.ncassurancetip', 'Red curve shows how <em>N</em> varies with target MoE with 99% assurance (grey curve: on average)', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.dispvalsheadertip', 'Turn features on or off', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.dispvalstip', 'Turn on or off the display of <em>N</em> values at each point on displayed curve(s)', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.dispgridlinestip', 'Turn on or off the display of grid lines', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    
    Tipped.create('.truncatetip', 'Use slider to choose where to truncate the left end of curve(s)', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.truncateslidertip', 'Select a value between 0.05 and 0.30', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.truncatevaltip', 'Left-truncate curve(s) at this value', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });


    Tipped.create('.correltip',       'Use slider to set population correlation ρ', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.correllabeltip',  'Use slider to set population correlation ρ', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.correlslidertip', 'Set ρ between .00 and .99', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.correlvaltip', 'ρ', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

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


  /*----------------------------------------------------------footer----------------------------------------*/
 
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


//#region remove at some point.
// function calcWithExcel() {
//   return;
//   //create datasets Nline, NlineAss //get N,    note fmoe is the f that Prof. Cumming uses in book
//   if (tab === 'Unpaired') {
//     //average
//     for (let fmoe = truncatedisplayud; fmoe < fmoemax; fmoe += fmoeinc) {
    
//       cv = Math.abs(jStat.normal.inv( alphaud/2, 0, 1));  //1.96
//       Nz = Math.ceil(2 * (cv/fmoe)**2);
//       if (Nz < 3) Nz = 3; //minimum N allowed is 3

//       df = 2*Nz-2;
//       cv = Math.abs(jStat.studentt.inv( alphapd/2, df ));
//       Nt =  Math.ceil(2 * (cv/fmoe)**2);

//       //now iterate  8 more times
//       for (let i = 2; i <= 9; i += 1) {
//         df =Math.max( Math.min(2*Math.ceil(Nt)-2, df+2 ), df-2 );

//         cv = Math.abs(jStat.studentt.inv( alphaud/2, df ));
//         Nt = Math.ceil(2 * (cv/fmoe)**2);
//         if (N < 3) N = 3;

//         //get local max min for oscillating values
//         if (i % 2 === 0) dfeven = df;  //get even, odd values of Nt
//         else             dfodd  = df;
//       }

//       if (dfeven > dfodd) dfmax = dfeven; else dfmax = dfodd; //which one is larger
//       if (dfmax < 2) dfmax = 2;
//       dfmax = (dfmax + 2) / 2;

//       Nline.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: dfmax } );   
//     }

//     //assurance
//     if (ncurveudass) {
//       for (let fmoe = truncatedisplayud; fmoe < fmoemax; fmoe += fmoeinc) {

//         cv = Math.abs(jStat.normal.inv( alphaud/2, 0, 1));  //1.96
//         Nz = 2 * (cv/fmoe)**2;

//         //first iteration - nt1 in spreadsheet
//         df = 2 * Math.ceil( Nz * jStat.chisquare.inv(gamma, Math.floor(Nz)) / Math.floor(Nz) - 1);  //bit concerned whether this should be floor?
//         cv = Math.abs(jStat.studentt.inv( alphaud/2, df )); 
//         Nt = 2 * (cv/fmoe)**2 * ( Math.abs(jStat.chisquare.inv(gamma, df)) ) / df;
//         if (Nt < 3) Nt = 3;

//         for (let i = 2; i <= 9; i += 1) {
//           df = Math.min( 2 * Math.ceil(Nt)-2, df+2);

//           cv = Math.abs(jStat.studentt.inv( alphaud/2, df )); 
//           Nt = 2 * (cv/fmoe)**2 * ( Math.abs(jStat.chisquare.inv(gamma, df)) ) / df;
//           if (Nt < 3) Nt = 3;

//         //get local max min for oscillating values
//         if (i % 2 === 0) dfeven = df;  //get even, odd values of Nt
//         else             dfodd  = df;            
//         }

//         if (dfeven > dfodd) dfmax = dfeven; else dfmax = dfodd; //which one is larger
//         if (dfmax < 2) dfmax = 2;   
//         dfmax = Math.ceil((dfmax + 2) / 2);

//         NlineAss.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: dfmax} )    
//       }
//     }
//   }

//   if (tab === 'Paired') {
//     //average
//     for (let fmoe = truncatedisplaypd; fmoe < fmoemax; fmoe += fmoeinc) {
//       cv = Math.abs(jStat.normal.inv( alphapd/2, 0, 1));  //1.96
//       Nz = Math.ceil(2 * (1 - correlationrho) * (cv/fmoe)**2); 
//       if (Nz < 3) Nz = 3; //minimum N allowed is 3

//       df = Nz-1;
//       cv = Math.abs(jStat.studentt.inv( alphapd/2, df ));
//       Nt =  Math.ceil(2 * (1 - correlationrho) * (cv/fmoe)**2);

//       //iterate for df2 and Nt2 etc
//       for (let i = 2; i <= 9; i += 1) {
//         df = Math.max(Math.min(Nt-1, df+1), df-1);  //I hate this, it seems a real kludge

//         cv = Math.abs(jStat.studentt.inv( alphapd/2, df ));
//         Nt =  Math.ceil(2 * (1 - correlationrho) * (cv/fmoe)**2);

//         //get local max min for oscillating values
//         if (i % 2 === 0) dfeven = df;  //get even, odd values of Nt
//         else             dfodd  = df;
//       }

//       if (dfeven > dfodd) dfmax = dfeven; else dfmax = dfodd; //which one is larger
//       if (dfmax < 2) dfmax = 2;
      
//       Nline.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: dfmax+1 } );   

//     }

//     //assurance
//     if (ncurvepdass) {

//       //test
//       //truncatedisplaypd = 1.4;
//       //correlationrho = 0.9;

//       for (let fmoe = truncatedisplaypd; fmoe < fmoemax; fmoe += fmoeinc) {
//         cv = Math.abs(jStat.normal.inv( alphapd/2, 0, 1));  //1.96
//         Nz = Math.ceil(2*(1 - correlationrho) * (cv/fmoe)**2);
//         if (Nz < 3) Nz = 3; //minimum N allowed is 3

//         //first iteration - nt1 in spreadsheet
//         df = Math.ceil( Math.abs( jStat.chisquare.inv(gamma, Nz) ) - 1 );
//         cv = Math.abs(jStat.studentt.inv( alphapd/2, df )); 
//         Nt = Math.ceil(2*(1 - correlationrho) * (cv/fmoe) * (cv/fmoe) * ( Math.abs(jStat.chisquare.inv(gamma, df)) ) / df );
//         if (Nt < 3) Nt = 3;

//         //iterate for df2 and Nt2 etc        
//         for (let i = 2; i <= 9; i += 1) {

//           df = Math.min(Math.ceil(Nt)-1, df+1);

//           cv = Math.abs(jStat.studentt.inv( alphapd/2, df )); 
//           Nt = Math.ceil(2*(1 - correlationrho) * (cv/fmoe) * (cv/fmoe) * ( Math.abs(jStat.chisquare.inv(gamma, df)) ) / df);
//           if (Nt < 3) Nt = 3;

//           //get local max min for oscillating values
//           if (i % 2 === 0) dfeven = df;  //get even, odd values of Nt
//           else             dfodd  = df;
//         }

//         if (dfeven > dfodd) dfmax = dfeven; else dfmax = dfodd; //which one is larger
//         if (dfmax < 2) dfmax = 2;

//         NlineAss.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: dfmax+1 } )    
//       }
//     }
//   }

// }


// function calcWithSledgehammer() {
//   cv = Math.abs(jStat.normal.inv( alphaud/2, 0, 1));  //1.96

//   if (tab === 'Unpaired') {
//     //average
//     for (let fmoe = truncatedisplayud; fmoe < fmoemax; fmoe += fmoeinc) {

//       fmoe = parseFloat(fmoe.toFixed(5));
//       correlationrho = parseFloat(correlationrho.toFixed(3));
//       Nt = searchfunpairedavg(correlationrho, fmoe);  

//       Nline.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: Nt } );   
//     }

//     //assurance
//     if (ncurveudass) {
//       for (let fmoe = truncatedisplayud; fmoe < fmoemax; fmoe += fmoeinc) {

//         fmoe = parseFloat(fmoe.toFixed(5));
//         correlationrho = parseFloat(correlationrho.toFixed(3));
//         Nt = searchfunpairedass(correlationrho, fmoe);  

//         NlineAss.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: Nt} )    
//       }
//     }
//   }

//   if (tab === 'Paired') {
//     //average
//     for (let fmoe = truncatedisplaypd; fmoe < fmoemax; fmoe += fmoeinc) {

//       fmoe = parseFloat(fmoe.toFixed(5));
//       correlationrho = parseFloat(correlationrho.toFixed(3));
//       Nt = searchfpairedavg(correlationrho, fmoe);  

//       Nline.push( { fmoe: parseFloat(fmoe.toFixed(3)), N: Nt } );   

//     }

//     //assurance
//     if (ncurvepdass) {
//       for (let fmoe = truncatedisplaypd; fmoe < fmoemax; fmoe += fmoeinc) {

//         fmoe = parseFloat(fmoe.toFixed(5));
//         correlationrho = parseFloat(correlationrho.toFixed(3));
        
//         Nt = searchfpairedass(correlationrho, fmoe);  

//         NlineAss.push( { fmoe: fmoe, N: Nt } )    
//       }
//     }
//   }

// }

// function searchfunpairedavg(rho, f) {

//   let i;
//   for (i=0; i<sledgeunpairedavg.length; i++) {
//     if (sledgeunpairedavg[i].rho === rho) {
//       if (sledgeunpairedavg[i].f < f) {
//         break;
//       }
//     }
//   }
//   if ( i === sledgeunpairedavg.length ) return 3;  //couldn't find one
//   if (i === 0) return 3; //the first entry can't have a previous rho
//   if (sledgeunpairedavg[i].rho !== rho) return 3;  //went back beyond current rho
//   return sledgeunpairedavg[i].N;
// }

// function searchfunpairedass(rho, f) {

//   let i;
//   for (i=0; i<sledgeunpairedass.length; i++) {
//     if (sledgeunpairedass[i].rho === rho) {
//       if (sledgeunpairedass[i].f < f) {
//         break;
//       }
//     }
//   }
//   if ( i === sledgeunpairedass.length ) return 3;  //couldn't find one
//   if (i === 0) return 3; //the first entry can't have a previous rho
//   if (sledgeunpairedass[i].rho !== rho) return 3;  //went back beyond current rho
//   return sledgeunpairedass[i].N;
// }

// function searchfpairedavg(rho, f) {
//   // o = sledge.find(obj => obj.rho === rho && Math.abs(obj.f - f) < 0.001);
//   // if (o == null) return 3; //lg(`rho -->  ${rho}  f --> ${f}`);
//   // else return o.N;

//   let i;
//   for (i=0; i<sledgepairedavg.length; i++) {
//     if (sledgepairedavg[i].rho === rho) {
//       if (sledgepairedavg[i].f < f) {
//         break;
//       }
//     }
//   }
//   if ( i === sledgepairedavg.length ) return 3;  //couldn't find one
//   if (i === 0) return 3; //the first entry can't have a previous rho
//   if (sledgepairedavg[i].rho !== rho) return 3;  //went back beyond current rho
//   return sledgepairedavg[i].N;
// }

// function searchfpairedass(rho, f) {

//   let i;
//   for (i=0; i<sledgepairedass.length; i++) {
//     if (sledgepairedass[i].rho === rho) {
//       if (sledgepairedass[i].f < f) {
//         break;
//       }
//     }
//   }
//   if ( i === sledgepairedass.length ) return 3;  //couldn't find one
//   if (i === 0) return 3; //the first entry can't have a previous rho
//   if (sledgepairedass[i].rho !== rho) return 3;  //went back beyond current rho
//   return sledgepairedass[i].N;
// }

// function setupSledgehammer() {
// return;
//   sledgeunpairedavg = [];
//   sledgeunpairedass = [];
//   sledgepairedavg = [];
//   sledgepairedass = [];

//   //Unpaired average
//   for (let rho = 0; rho < 1; rho += 0.01) {
//     for (let N = 3; N <= 3300; N += 1 ) {
//       f = Math.abs( jStat.studentt.inv( alphapd/2, 2*N-2 )) / Math.sqrt( N / 2 );
      
//       sledgeunpairedavg.push( { rho: parseFloat(rho.toFixed(2)), N: N, f: parseFloat(f.toFixed(6)) } );
//     }
//   }

//   //Unpaired assurance
//   for (let rho = 0; rho < 1; rho += 0.01) {
//     for (let N = 3; N <= 3300; N += 1 ) {
//       f = Math.abs( jStat.studentt.inv( alphaud/2, 2*N - 2 ) ) / (Math.sqrt( N * (N - 1) / ( jStat.chisquare.inv(gamma, 2*N - 2))  )) ;

//       sledgeunpairedass.push( { rho: parseFloat(rho.toFixed(2)), N: N, f: parseFloat(f.toFixed(6)) } );
//     }
//   }


//   //Paired average
//   for (let rho = 0; rho < 1; rho += 0.01) {
//     for (let N = 3; N <= 3300; N += 1 ) {
//       f = Math.abs( jStat.studentt.inv( alphapd/2, N-1 )) / Math.sqrt( N / (2*(1-rho)) );
      
//       sledgepairedavg.push( { rho: parseFloat(rho.toFixed(2)), N: N, f: parseFloat(f.toFixed(6)) } );
//     }
//   }

//   //Paired assurance
//   for (let rho = 0; rho < 1; rho += 0.01) {
//     for (let N = 3; N <= 3300; N += 1 ) {
//       f = Math.abs( jStat.studentt.inv( alphapd/2, N-1 )) / Math.sqrt( N * (N-1) / (2*(1-rho) * jStat.chisquare.inv(gamma, N-1)) );
      
//       sledgepairedass.push( { rho: parseFloat(rho.toFixed(2)), N: N, f: parseFloat(f.toFixed(6)) } );
//     }
//   }


// }



  //test radio buttons
  // $('input[type=radio][name=calctype').change(function() {
  //   if (this.value === 'excel') {
  //     calctype = 'excel';
  //   }
  //   if (this.value === 'iterate') {
  //     calctype = 'iterate';
  //   }
  //   if (this.value === 'sledgehammer') {
  //     calctype = 'sledgehammer';
  //   }

  //   drawFeatures()
  // })

  //#endregion