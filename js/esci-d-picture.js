/*
Program       esci-d-picture.js
Author        Gordon Moore
Date          11 August 2020
Description   The JavaScript code for esci-d-picture
Licence       GNU General Public Licence Version 3, 29 June 2007
*/

// #region Version history
/*
0.0.1   Initial version

0.2.0   2020-08-17  Version 2 
0.2.1   2020-08-17  Slight tweak to make areas of overlap meet up.
0.2.2   2020-08-19  #3 Tweaks to panel font sizes etc
0.2.3   2020-08-19  #4 Tweaks to overlap positions and viewability, including d line and value
0.2.4   2020-08-19  #5 bottom axis label now d
0.2.5   2020-08-19  #6 slider - tweak title and size
0.2.6   2020-08-20  #10 Tooltips

1.0.0  2020-09-03 Version 1.0.0

1.1.0  6 Nov 2020 Rationalised into one repository

*/
//#endregion 

let version = '1.1.0';

'use strict';
$(function() {
  console.log('jQuery here!');  //just to make sure everything is working

  //#region for variable definitions (just allows code folding)
  let tooltipson              = false;                                        //toggle the tooltips on or off

  const pdfdisplay            = document.querySelector('#pdfdisplay');        //display of pdf area

  let realHeight              = 100;                                          //the real world height for the pdf display area
  let margin                  = {top: 0, right: 10, bottom: 0, left: 70};     //margins for pdf display area
  let width;                                                                  //the true width of the pdf display area in pixels
  let heightP;   
  let rwidth;                                                                 //the width returned by resize
  let rheight;                                                                //the height returned by resize
  let xt, xb, y;                                                              //scale functions

  let showtopaxis             = false;
  let showbottomaxis          = false;

  let left;
  let right;
  let distWidth               = 4;                                            //number of sds each side of x bar

  let svgTopAxis;                                                             //svg reference to the top axis
  let svgBottomAxis;                                                          //svg reference to the bottom axis
  let svgP;   
                                                                              //the svg reference to pdfdisplay
  let controlpdf              = [];                                           //the array holding the normal distribution
  let experimentalpdf         = [];

  let xbarcontrol             = 0;
  let xbarexperimental        = 1;
  let sdcontrol               = 1;
  let sdexperimental          = 1;       

  let $xbarcontrolslider = $('#xbarcontrolslider');
  let $sdcontrolslider   = $('#sdcontrolslider');

  const $xbarcontrolnudgebackward         = $('#xbarcontrolnudgebackward');
  const $xbarcontrolnudgeforward          = $('#xbarcontrolnudgeforward');
  const $sdcontrolnudgebackward           = $('#sdcontrolnudgebackward');
  const $sdcontrolnudgeforward            = $('#sdcontrolnudgeforward');

  const $xbarcontrolval = $('#xbarcontrolval');
  const $sdcontrolval   = $('#sdcontrolval');


  let $xbarexperimentalslider = $('#xbarexperimentalslider');
  let $sdexperimentalslider   = $('#sdexperimentalslider');

  const $xbarexperimentalnudgebackward         = $('#xbarexperimentalnudgebackward');
  const $xbarexperimentalnudgeforward          = $('#xbarexperimentalnudgeforward');
  const $sdexperimentalnudgebackward           = $('#sdexperimentalnudgebackward');
  const $sdexperimentalnudgeforward            = $('#sdexperimentalnudgeforward');

  const $xbarexperimentalval = $('#xbarexperimentalval');
  const $sdexperimentalval   = $('#sdexperimentalval');

  let h;

  const $pdfdisplay            = $('#pdfdisplay');

  let $dslider                 = $('#dslider');;                                                             //reference to slider
  let cohensd = 0;

  const $dnudgebackward        = $('#dnudgebackward');
  const $dnudgeforward         = $('#dnudgeforward');

  let pauseId;
  let repeatId;
  let delay = 50;
  let pause = 500;

  let isDragxbar = false;
  let isDragsd   = false;

  const $shadeareaEaboveC = $('#shadeareaEaboveC');
  let shadeareaEaboveC = false;
  const $shadeareaCbelowE = $('#shadeareaCbelowE');
  let shadeareaCbelowE = false;
  const $shadeareaoverlap = $('#shadeareaoverlap');
  let shadeareaoverlap = false;

  let dsliderinuse = false;

  const $xbarexpval = $('#xbarexpval');
  const $sdexpval   = $('#sdexpval');

  const $showexperimentalsliderpanel = $('#showexperimentalsliderpanel');

  let prighttail;
  let plefttail;
  let middlearea;

  const $areaEaboveC = $('#areaEaboveC');
  const $areaCbelowE = $('#areaCbelowE');
  const $areaoverlap = $('#areaoverlap');

  let displace;

  let dslidertop;
  let dsliderleft;
  let dsliderwidth;

  const $psuperiority = $('#psuperiority');
  let psuperiority;
  const $nrequired = $('#nrequired');
  let nrequired;


  //api for getting width, height of element - only gets element, not entire DOM
  // https://www.digitalocean.com/comxbarcontrolnity/tutorials/js-resize-observer
  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      rwidth = entry.contentRect.width;
      //rHeight = entry.contentRect.height;  //doesn't work
      rheight = $('#pdfdisplay').outerHeight(true);
    });
  });

  //#endregion

  //breadcrumbs
  $('#homecrumb').on('click', function() {
    window.location.href = "https://www.esci.thenewstatistics.com/";
  })

  initialise();

  function initialise() {

    //hide experimental xbar and sd panel
    $('#xbarsdexperimental').hide();

    setTooltips();

    //get initial values for height/width
    rwidth  = $('#pdfdisplay').outerWidth(true);
    rheight = $('#pdfdisplay').outerHeight(true);

    //these are fixed so do I need to be responsive?
    heighttopaxis    = $('#topaxis').outerHeight(true);
    heightbottomaxis = $('#bottomaxis').outerHeight(true);

    d3.selectAll('svg > *').remove();  //remove all elements under svgP
    $('svg').remove();                 //remove the all svg elements from the DOM

    //axes
    //svgTopAxis    = d3.select('#topaxis').append('svg').attr('width', '100%').attr('height', '100%');
    svgBottomAxis = d3.select('#bottomaxis').append('svg').attr('width', '100%').attr('height', '100%');

    //pdf display
    svgP = d3.select('#pdfdisplay').append('svg').attr('width', '100%').attr('height', '100%');

    setupSliders();

    // $xbarcontrolval.val(xbarcontrol.toFixed(1));
    // $sdcontrolval.val(sdcontrol.toFixed(1));
    // $xbarexperimentalval.val(xbarexperimental.toFixed(1));
    // $sdexperimentalval.val(sdexperimental.toFixed(1));

    // $xbarexpval.text(xbarexperimental.toFixed(1));
    // $sdexpval.text(sdexperimental.toFixed(1));

    $shadeareaEaboveC.prop('checked', false);
    shadeareaEaboveC = false;
    $shadeareaCbelowE.prop('checked', false);
    shadeareaCbelowE = false;
    $shadeareaoverlap.prop('checked', false);
    shadeareaoverlap = false;

    calcCohensd();
    updatedslider();

    resize();

    clear();

  }

  function setupSliders() {
    // $('#xbarcontrolslider').ionRangeSlider({
    //   skin: 'big',
    //   type: 'single',
    //   min: 0,
    //   max: 200,
    //   from: xbarcontrol,
    //   step: 0.1,
    //   grid: true,
    //   grid_num: 4,
    //   prettify: prettify1,
    //   //on slider handles change
    //   onChange: function (data) {
    //     xbarcontrol = data.from;
    //     $xbarcontrolval.val(xbarcontrol.toFixed(1));
    //     redrawDisplay();
    //   }
    // })
    // $xbarcontrolslider = $('#xbarcontrolslider').data("ionRangeSlider");

    // $('#sdcontrolslider').ionRangeSlider({
    //   skin: 'big',
    //   type: 'single',
    //   min: 0,
    //   max: 50,
    //   from: sdcontrol, 
    //   step: 0.1,
    //   grid: true,
    //   grid_num: 5,
    //   prettify: prettify1,
    //   //on slider handles change
    //   onChange: function (data) {
    //     sdcontrol = data.from;
    //     if (sdcontrol < 1) {
    //       sdcontrol = 1;
    //       $sdcontrolslider.update({ from: sdcontrol });
    //     }
    //     $sdcontrolval.val(sdcontrol.toFixed(1));
    //     redrawDisplay();
    //   }
    // })
    // $sdcontrolslider = $('#sdcontrolslider').data("ionRangeSlider");

    // $('#xbarexperimentalslider').ionRangeSlider({
    //   skin: 'big',
    //   type: 'single',
    //   min: 0,
    //   max: 200,
    //   from: xbarexperimental,
    //   step: 0.1,
    //   grid: true,
    //   grid_num: 4,
    //   prettify: prettify1,
    //   //on slider handles change
    //   onChange: function (data) {
    //     xbarexperimental = data.from;
    //     $xbarexperimentalval.val(xbarexperimental.toFixed(1));
    //     redrawDisplay();
    //   }
    // })
    // $xbarexperimentalslider = $('#xbarexperimentalslider').data("ionRangeSlider");

    // $('#sdexperimentalslider').ionRangeSlider({
    //   skin: 'big',
    //   type: 'single',
    //   min: 0,
    //   max: 50,
    //   from: sdexperimental, 
    //   step: 0.1,
    //   grid: true,
    //   grid_num: 5,
    //   prettify: prettify1,
    //   //on slider handles change
    //   onChange: function (data) {
    //     sdexperimental = data.from;
    //     if (sdexperimental < 1) {
    //       sdexperimental = 1;
    //       $sdexperimentalslider.update({ from: sdexperimental });
    //     }
    //     $sdexperimentalval.val(sdexperimental.toFixed(1));
    //     redrawDisplay();
    //   }
    // })
    // $sdexperimentalslider = $('#sdexperimentalslider').data("ionRangeSlider");


    $('#dslider').ionRangeSlider({
      skin: 'big',
      grid: true,
      grid_num: 5,
      type: 'single',
      min: 0,
      max: 5,
      from: 0,
      step: 0.01,
      prettify: prettify2,
      //on slider handles change
      onChange: function (data) {
        cohensd = data.from;
        xbarexperimental = xbarcontrol + cohensd * sdexperimental;
        dsliderinuse = true;  //don't update dslider in redrawdisplay()
        redrawDisplay();
      }
    })
    $dslider = $('#dslider').data("ionRangeSlider");
  }

  function prettify0(n) {
    return n.toFixed(0);
  }

  function prettify1(n) {
    return n.toFixed(1);
  }

  function prettify2(n) {
    return n.toFixed(2);
  }

  function resize() {
    //have to watch out as the width and height do not always seem precise to pixels
    //browsers apparently do not expose true element width, height.
    //also have to think about box model. outerwidth(true) gets full width, not sure resizeObserver does.

    resizeObserver.observe(pdfdisplay);  //note doesn't get true outer width, height

    width   = rwidth - margin.left - margin.right;  
    heightP = rheight - margin.top - margin.bottom;

    dslidertop = 0;
    dsliderleft = 0.3 * width + margin.left - 35;
    dsliderwidth = 0.5 * width;
    //position the d slider title
    $('#cohensdtitle').css({
      position:'absolute',
      top: dslidertop,
      left: dsliderleft-92
    })
    
    //position the d slider
    $('#dsliderdiv').css({
      position:'absolute',
      top: dslidertop,
      left: dsliderleft,
      zIndex:5000,
      width: dsliderwidth
    });
    //position the nudege bars
    $dnudgebackward.css({
      position:'absolute',
      top: dslidertop,
      left: dsliderleft+dsliderwidth+15,
    })
    $dnudgeforward.css({
      position:'absolute',
      top: dslidertop,
      left: dsliderleft+dsliderwidth+40,
    })    

    clear();
  }

  //set everything to a default state.
  function clear() {
    setupAxes();  //removes and resets axes

    createControl();
    createExperimental();

    //draw labels on displaypdf
    //because this style matches the distributions style more than one after the other.
    svgP.selectAll('.pdflabels').remove();

    svgP.append('line').attr('class', 'pdflabels').attr('x1', 30).attr('y1', 30).attr('x2', 60).attr('y2', 30).attr('stroke', 'blue').attr('stroke-width', 4).attr('fill', 'none');
    svgP.append('text').text('Control (C)').attr('class', 'pdflabels').attr('x', 70).attr('y', 35).attr('text-anchor', 'start').attr('fill', 'blue').style('font-size', '1.7rem');
    svgP.append('line').attr('class', 'pdflabels').attr('x1', 30).attr('y1', 50).attr('x2', 60).attr('y2',50).attr('stroke', 'red').attr('stroke-width', 4).attr('fill', 'none');
    svgP.append('text').text('Experimental (E)').attr('class', 'pdflabels').attr('x', 70).attr('y', 55).attr('text-anchor', 'start').attr('fill', 'red').style('font-size', '1.7rem');


    drawControlPDF();
    drawExperimentalPDF();

    drawAreaProbabilities();
    displaystatistics();

    calcCohensd();
    drawCohensd();
  }

  /*-------------------------------------------Set up axes---------------------------------------------*/


  function setupAxes() {
    //the height is 0 - 100 in real world coords   I'm not sure resize is working for rheight
    heightP = $('#pdfdisplay').outerHeight(true) - margin.top - margin.bottom;
    y = d3.scaleLinear().domain([0, realHeight]).range([heightP, 0]);
  
    // showtopaxis = false;
    showbottomaxis = true;
    //setTopAxis();
    setBottomAxis();
    
  }
  
  // function setTopAxis() {
  //   //clear axes
  //   d3.selectAll('.topaxis').remove();
  //   d3.selectAll('.topaxisminorticks').remove();
  //   d3.selectAll('.topaxistext').remove();
  //   d3.selectAll('.topaxisunits').remove();


  //   width   = rwidth - margin.left - margin.right;  
    
  //   left  = xbarcontrol-distWidth*sdcontrol;
  //   right = xbarcontrol+distWidth*sdcontrol;

  //   xt = d3.scaleLinear().domain([left, right]).range([margin.left-2, width+4]);
    
  //   if (showtopaxis) {
  //     //top horizontal axis
  //     let xAxisA = d3.axisTop(xt).tickSizeOuter(0);  //tickSizeOuter gets rid of the start and end ticks
  //     svgTopAxis.append('g').attr('class', 'topaxis').style("font", "1.8rem sans-serif").attr( 'transform', 'translate(0, 42)' ).call(xAxisA);

  //     //add some text labels
  //     svgTopAxis.append('text').text('X').style('font-style', 'italic').attr('class', 'topaxistext').attr('x', width/2 - 20).attr('y', 16).attr('text-anchor', 'start').attr('fill', 'black');
  //     svgTopAxis.append('text').text(units).attr('class', 'topaxisunits').attr('x', width/2 - 70).attr('y', 70).attr('text-anchor', 'start').attr('fill', 'black');

  //     //add additional ticks
  //     //the minor ticks
  //     let interval = d3.ticks(left-sdcontrol, right+sigma, 10);  //gets an array of where it is putting tick marks

  //     let minortick;
  //     let minortickmark;
  //     for (let i=0; i < interval.length; i += 1) {
  //       minortick = (interval[i] - interval[i-1]) / 10;
  //       for (let ticks = 1; ticks <= 10; ticks += 1) {
  //         minortickmark = interval[i-1] + (minortick * ticks);
  //         if (minortickmark > left && minortickmark < right) svgTopAxis.append('line').attr('class', 'topaxisminorticks').attr('x1', xt(minortickmark)).attr('y1', 40).attr('x2', xt(minortickmark) ).attr('y2', 35).attr('stroke', 'black').attr('stroke-width', 1);
  //       }
  //     }

  //     //make larger middle tick
  //     let middle;
  //     for (let i = 0; i < interval.length; i += 1) {
  //       middle = (interval[i] + interval[i-1]) / 2;
  //       svgTopAxis.append('line').attr('class', 'topaxisminorticks').attr('x1', xt(middle)).attr('y1', 40).attr('x2', xt(middle) ).attr('y2', 30).attr('stroke', 'black').attr('stroke-width', 1);
  //     }
  //   }
  // }

  function setBottomAxis() {
    
    //the width is either -5 to +5 or 25 to 175 etc in real world coords
    //clear axes
    d3.selectAll('.bottomaxis').remove();
    d3.selectAll('.bottomaxisminorticks').remove();
    d3.selectAll('.bottomaxistext').remove();

    width   = rwidth - margin.left - margin.right;  
    
    // left  = xbarcontrol-distWidth*sdcontrol;
    // right = xbarcontrol+distWidth*sdcontrol;

    left = -3;
    right = 7;

    xb = d3.scaleLinear().domain([left, right]).range([margin.left-2, width+4]);

    if (showbottomaxis) {

      //bottom horizontal axis
      let xAxisB = d3.axisBottom(xb); //.ticks(20); //.tickValues([]);
      svgBottomAxis.append('g').attr('class', 'bottomaxis').style("font", "1.8rem sans-serif").attr( 'transform', 'translate(0, 0)' ).call(xAxisB);

      //add some text labels
      svgBottomAxis.append('text').text('d').attr('class', 'bottomaxistext').attr('x', width/2 + 10).attr('y', 40).attr('text-anchor', 'start').attr('fill', 'black').style('font-weight', 'bold').style('font-style', 'italic');

    //add additional ticks
      //the minor ticks
      let interval = d3.ticks(left, right, 10);  //gets an array of where it is putting tick marks

      let minortick;
      let minortickmark;
      for (let i=1; i < interval.length; i += 1) {
        minortick = (interval[i] - interval[i-1]) / 10;
        for (let ticks = 1; ticks <= 10; ticks += 1) {
          minortickmark = interval[i-1] + (minortick * ticks);
          if (minortickmark > left && minortickmark < right) svgBottomAxis.append('line').attr('class', 'bottomaxisminorticks').attr('x1', xb(minortickmark)).attr('y1', 0).attr('x2', xb(minortickmark) ).attr('y2', 5).attr('stroke', 'black').attr('stroke-width', 1);
        }
      }

      //make larger middle tick
      let middle;
      for (let i = 1; i < interval.length; i += 1) {
        middle = (interval[i] + interval[i-1]) / 2;
        svgBottomAxis.append('line').attr('class', 'bottomaxisminorticks').attr('x1', xb(middle)).attr('y1', 0).attr('x2', xb(middle) ).attr('y2', 10).attr('stroke', 'black').attr('stroke-width', 1);
      }
    }
  }

  /*------------------------------------do distributions------------------------------------*/

  function createControl() {
    controlpdf = [];

    // left  = xbarcontrol-distWidth*sdcontrol;
    // right = xbarcontrol+distWidth*sdcontrol;

    left = -3;
    right = 7;

    for (let x = left; x <= right; x += 0.005) {
      controlpdf.push({ x: x, y: jStat.normal.pdf(x, xbarcontrol, sdcontrol) })
    }

    //scale it to fit in with drawing area
    controlpdf.forEach(function(v) {
      v.y = scaleypdf(v.y);
    })
  }

  function createExperimental() {
    experimentalpdf = [];

    // left  = xbarcontrol-distWidth*sdcontrol;
    // right = xbarcontrol+distWidth*sdcontrol;

    left = -3;
    right = 7;

    for (let x = left; x <= right; x += 0.005) {
      experimentalpdf.push({ x: x, y: jStat.normal.pdf(x, xbarexperimental, sdexperimental) })
    }

    //scale it to fit in with drawing area
    experimentalpdf.forEach(function(v) {
      v.y = scaleypdf(v.y);
    })
  }

  function scaleypdf(y) {
    return y * 200;
  }

  function drawControlPDF() {
    removeControlPDF();

    //create a generator
    line = d3.line()
      .x(function(d, i) { return xb(d.x); })
      .y(function(d, i) { return y(d.y); });

    //display the curve
    svgP.append('path').attr('class', 'controlpdf static').attr('d', line(controlpdf)).attr('stroke', 'blue').attr('stroke-width', 3).attr('fill', 'none');

    //draw xbarline
    h = d3.max(controlpdf, function(d, i) { return d.y; });
    svgP.append('line').attr('class', 'controlpdf static').attr('x1', xb(xbarcontrol)).attr('y1', y(0)).attr('x2', xb(xbarcontrol)).attr('y2', y(h + 5)).attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none');
  }

  function removeControlPDF() {
    d3.selectAll('.controlpdf').remove();
  }

  function drawExperimentalPDF() {
    removeExperimentalPDF();

    //create a generator
    line = d3.line()
      .x(function(d, i) { return xb(d.x); })
      .y(function(d, i) { return y(d.y); });

    //display the curve
    svgP.append('path').attr('class', 'experimentalpdf draggable').attr('d', line(experimentalpdf)).attr('stroke', 'red').attr('stroke-width', 3).attr('fill', 'none');

    //draw xbarline
    h = d3.max(experimentalpdf, function(d, i) { return d.y; });
    svgP.append('line').attr('class', 'experimentalpdf draggable').attr('x1', xb(xbarexperimental)).attr('y1', y(0)).attr('x2', xb(xbarexperimental)).attr('y2', y(h + 5)).attr('stroke', 'red').attr('stroke-width', 2).attr('fill', 'none');
    
    //draw a circle for where SD is
    //svgP.append('circle').attr('class', 'experimentalpdf draggable').attr('cx', xb(xbarexperimental + sdexperimental)).attr('cy', y(1)).attr('r', 5).attr('stroke', 'red').attr('stroke-width',  1).attr('fill', 'none')

  }

  function removeExperimentalPDF() {
    d3.selectAll('.experimentalpdf').remove();
  }

  /*---------------------------------------------Interactive d----------------------------------------------*/

  function calcCohensd() {
    cohensd = (xbarexperimental - xbarcontrol) / sdcontrol;
  }

  function drawCohensd() {
    svgP.selectAll('.cohensd').remove();
    //svgP.append('text').text('\u03b4 = ' + cohensd.toFixed(2)).attr('class', 'cohensd').attr('x', xb( (xbarcontrol+xbarexperimental)/2 - 5)).attr('y', 100).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.7rem').style('font-weight', 'bold');
    svgP.append('text').text('d = ').attr('class', 'cohensd').attr('x', xb( (xbarcontrol+xbarexperimental)/2) -35).attr('y', y(h + 15)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.7rem').style('font-weight', 'bold').style('font-style', 'italic');
    svgP.append('text').text(cohensd.toFixed(2)).attr('class', 'cohensd').attr('x', xb( (xbarcontrol+xbarexperimental)/2)).attr('y', y(h + 15)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.7rem').style('font-weight', 'bold');

    svgP.append('line').attr('class', 'cohensd').attr('x1', xb(xbarcontrol)-2).attr('y1', y(h+10)+8).attr('x2',xb(xbarcontrol) + 2).attr('y2', y(h+10)-8).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none');
    svgP.append('line').attr('class', 'cohensd').attr('x1', xb(xbarexperimental) - 2).attr('y1', y(h+10)+8).attr('x2',xb(xbarexperimental) + 2).attr('y2', y(h+10)-8).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none');
    svgP.append('line').attr('class', 'cohensd').attr('x1', xb(xbarcontrol)).attr('y1', y(h + 10)).attr('x2',xb(xbarexperimental)).attr('y2', y(h + 10)).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none');
  }

  function updatedslider() {
    $dslider.update({from: cohensd});
  }

  /*--------------------------------------------Redraw the Display------------------------------------------*/

  function redrawDisplay() {
    setBottomAxis();
    createControl();
    drawControlPDF();
    createExperimental();
    drawExperimentalPDF();
    calcCohensd();
    drawCohensd();
    if (!dsliderinuse) updatedslider();
    dsliderinuse = false;

    $xbarexpval.text(xbarexperimental.toFixed(1));
    $sdexpval.text(sdexperimental.toFixed(1));

    drawAreaProbabilities();
    displaystatistics();
  }

  /*--------------------------------------------Display areas------------------------------------------*/

  $shadeareaEaboveC.on('change', function() {
    shadeareaEaboveC = $shadeareaEaboveC.is(':checked');
    if (shadeareaEaboveC) {
      displaystatistics();
    }
    else {
    }
    drawAreaProbabilities();
  })

  $shadeareaCbelowE.on('change', function() {
    shadeareaCbelowE = $shadeareaCbelowE.is(':checked');
    if (shadeareaCbelowE) {
      displaystatistics();
    }
    else {
    }
    drawAreaProbabilities();
  })  

  $shadeareaoverlap.on('change', function() {
    shadeareaoverlap = $shadeareaoverlap.is(':checked');
    if (shadeareaoverlap) {
      displaystatistics();
    }
    else {
    }
    drawAreaProbabilities();
  })

  function drawAreaProbabilities() {
    svgP.selectAll('.areaEaboveC').remove();
    svgP.selectAll('.areaCbelowE').remove();
    svgP.selectAll('.areaoverlap').remove();

    //calculate the area (probability)
    prighttail = 1 - jStat.normal.cdf(xbarcontrol, xbarexperimental, sdexperimental); 
    $areaEaboveC.text(prighttail.toFixed(4).toString().replace('0.', '.'));

    plefttail = jStat.normal.cdf(xbarexperimental, xbarcontrol, sdcontrol); 
    $areaCbelowE.text(plefttail.toFixed(4).toString().replace('0.', '.'));

    middle = (xbarcontrol + xbarexperimental) / 2;
    poverlap = 2 * (1 - jStat.normal.cdf(cohensd/2, 0, 1)); 
    $areaoverlap.text(poverlap.toFixed(4).toString().replace('0.', '.'));


    if (shadeareaEaboveC) {
      //fill the areas
      arearighttail = d3.area()
      .x(function(d) { return xb(d.x) })
      .y1(y(0))
      .y0(function(d) { if (d.x > xbarcontrol) return y(d.y); else return y(0); });

      svgP.append('path').attr('class', 'areaEaboveC').attr('d', arearighttail(experimentalpdf)).attr('fill', 'mistyrose');
      drawControlPDF();
      drawExperimentalPDF();
    }

    if (shadeareaCbelowE) {
      //fill the areas
      arealefttail = d3.area()
      .x(function(d) { return xb(d.x) })
      .y1(y(0))
      .y0(function(d) { if (d.x < xbarexperimental) return y(d.y); else return y(0); });

      svgP.append('path').attr('class', 'areaCbelowE').attr('d', arealefttail(controlpdf)).attr('fill', 'lightskyblue');
      drawControlPDF();
      drawExperimentalPDF();
    }

    //shade overlap area
    if (shadeareaoverlap || (shadeareaEaboveC && shadeareaCbelowE)) {
      middle = (xbarcontrol + xbarexperimental) / 2;
      areaoverlap = d3.area()
      .x(function(d) { return xb(d.x) })
      .y1(y(0))                                                                //just to make areas meet up
      .y0(function(d) { if (d.x > xbarcontrol - 5*sdcontrol && d.x <= middle + 0.01) return y(d.y); else return y(0); });

      svgP.append('path').attr('class', 'areaoverlap').attr('d', areaoverlap(experimentalpdf)).attr('fill', 'orchid'); // 'rgba(221,160,221,0.5'); //plum

      areaoverlap = d3.area()
      .x(function(d) { return xb(d.x) })
      .y1(y(0))
      .y0(function(d) { if (d.x >= middle && d.x < xbarexperimental + 5*sdexperimental) return y(d.y); else return y(0); });

      svgP.append('path').attr('class', 'areaoverlap').attr('d', areaoverlap(controlpdf)).attr('fill', 'orchid'); // 'rgba(221,160,221,0.5');

      drawControlPDF();
      drawExperimentalPDF();
    }

    //now draw probabilities on top of areas
    svgP.selectAll('.areaEaboveCvalues').remove();
    svgP.selectAll('.areaCbelowEvalues').remove();
    svgP.selectAll('.areaoverlapvalues').remove();

    if (shadeareaEaboveC) {
      svgP.append('rect').attr('class', 'areaEaboveCvalues').attr('x', xb(xbarexperimental + 1.3) ).attr('y', heightP-67).attr('width', 50).attr('height', 22).attr('fill', 'white').attr('stroke', 'none').attr('stroke-width', 1);
      svgP.append('text').text( prighttail.toFixed(4).toString().replace('0.', '.') ).attr('class', 'areaEaboveCvalues').attr('x', xb(xbarexperimental + 1.3) ).attr('y', heightP-50 ).attr('text-anchor', 'start').style("font", "1.7rem sans-serif").attr('fill', 'red');
    }

    if (shadeareaCbelowE) {
      svgP.append('rect').attr('class', 'areaCbelowEvalues').attr('x', xb(xbarcontrol - 1.85) ).attr('y', heightP-67).attr('width', 50).attr('height', 22).attr('fill', 'white').attr('stroke', 'none').attr('stroke-width', 1);
      svgP.append('text').text( plefttail.toFixed(4).toString().replace('0.', '.') ).attr('class', 'areaCbelowEvalues').attr('x', xb(xbarcontrol - 1.85) ).attr('y', heightP-50 ).attr('text-anchor', 'start').style("font", "1.7rem sans-serif").attr('fill', 'blue');
    }

    // if (shadeareaoverlap || (shadeareaEaboveC && shadeareaCbelowE) ) {
    if (shadeareaoverlap) {
      svgP.append('rect').attr('class', 'areaoverlapvalues').attr('x', xb(middle) - 25 ).attr('y', heightP-107).attr('width', 56).attr('height', 22).attr('fill', 'white').attr('stroke', 'none').attr('stroke-width', 1);
      svgP.append('text').text( poverlap.toFixed(4).toString().replace('0.', '.') ).attr('class', 'areaCbelowEvalues').attr('x', xb(middle) - 21 ).attr('y', heightP-90 ).attr('text-anchor', 'start').style("font", "1.7rem sans-serif").attr('fill', 'black');
    }

  }

  function displaystatistics() {
    psuperiority = jStat.normal.cdf(cohensd, 0, Math.sqrt(2));
    $psuperiority.text(psuperiority.toFixed(4).toString().replace('0.', '.'));

    nrequired = '-';
    if (cohensd !== 0) nrequired = Math.ceil(30.73 / (cohensd * cohensd));
    //if (nrequired > 10000) nrequired = '> 10,000';
    $nrequired.text(nrequired);
  }

  /*---------------------------------------------Drag experimental curve------------------------------------*/

  //not used, but leave in for now
  $pdfdisplay
    .mousedown(function(e) {
      //only if mouse on experimental cursor line
      let parentOffset = $(this).parent().offset();
      let relX = e.pageX - parentOffset.left;
      //let relY = e.pageY - parentOffset.top;
      let wr = right - left;
      let wp = xb(right) - xb(left);

      let currentX = (relX - xb(left)) * wr/wp + left;
      if (currentX > xbarexperimental - 2 && currentX < xbarexperimental + 2) {
        isDragxbar = true;
      }
      if (currentX > xbarexperimental + sdexperimental - 2 && currentX < xbarexperimental + sdexperimental + 2 ) {
        isDragsd = true;
      }
    })
    .mousemove(function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (isDragxbar) {
        // let parentOffset = $(this).parent().offset();
        // let relX = e.pageX - parentOffset.left;
        // let wr = right - left;
        // let wp = xb(right) - xb(left);

        // xbarexperimental = (relX - xb(left)) * wr/wp + left;

        // //if (xbarexperimental < xbarcontrol) xbarexperimental = xbarcontrol;
        // if (xbarexperimental < 0) xbarexperimental = 0;
        // if (xbarexperimental > right) xbarexperimental = right;

        // redrawDisplay();
        // updatedslider();
        // updatexbarexperimental();
        // $xbarexperimentalval.val(xbarexperimental.toFixed(1));
      }
      if (isDragsd) {
        // let parentOffset = $(this).parent().offset();
        // let relX = e.pageX - parentOffset.left;
        // let wr = right - left;
        // let wp = xb(right) - xb(left);

        // //xbarexperimental = (relX - xb(left)) * wr/wp + left;
        // sdexperimental = (relX - xb(left)) * wr/wp + left - xbarexperimental;

        // if (sdexperimental < 1) sdexperimental = 1;
        // //if (xbarexperimental > right) xbarexperimental = right;

        // updatedslider();
        // updatesdexperimental();
        // $sdexperimentalval.val(sdexperimental.toFixed(1));
        // calcCohensd();
        // drawCohensd();
      }
    })
    .mouseup(function(e) {
      isDragxbar = false;
      isDragsd = false;
      e.preventDefault();
      e.stopPropagation();
    })

    $('#bottomaxis').on('mousemove', function(e) {
      e.preventDefault();
    })

  /*---------------------------------------------Cohen d nudge bar ----------------------------------------------*/

  //cohen d  nudge backwards
  $dnudgebackward.on('mousedown', function() {
    dnudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        dnudgebackward();
      }, delay );
    }, pause)  
  })

  $dnudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function dnudgebackward() {
    cohensd -= 0.01;
    if (cohensd < 0) cohensd = 0;
    dsliderinuse = true;
    setdSlider();
    redrawDisplay();
  }
  
  //Cohen d nudge forwards
  $dnudgeforward.on('mousedown', function() {
    dnudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        dnudgeforward();
      }, delay );
    }, pause)
  })

  $dnudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function dnudgeforward() {
    cohensd += 0.01;
    if (cohensd > 5) cohensd = 5;
    dsliderinuse
    setdSlider();
    redrawDisplay();
  }

  function setdSlider() {
    updatedslider();
    xbarexperimental = xbarcontrol + cohensd * sdexperimental;
  }

/*-----------------------------------------xbar sd control sliders --------------------------------------*/
  
//changes to the xbar control, sd control textboxes
  $xbarcontrolval.on('change', function() {
    if ( isNaN($xbarcontrolval.val()) ) {
      $xbarcontrolval.val(xbarcontrol.toFixed(1));
      return;
    };
    xbarcontol = parseFloat($xbarcontolval.val()).toFixed(1);
    if (xbarcontol < 0) {
      xbarcontol = 0;
    }
    if (xbarcontol > 200) {
      xbarcontol = 200;
    }
    $xbarcontolval.val(xbarcontol.toFixed(1));
    updatexbarcontrol();
  })

  //xbar control nudge backwards
  $xbarcontrolnudgebackward.on('mousedown', function() {
    xbarcontrolnudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        xbarcontrolnudgebackward();
      }, delay );
    }, pause)
  })

  $xbarcontrolnudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function xbarcontrolnudgebackward() {
    xbarcontrol -= 0.1;
    if (xbarcontrol < 0) xbarcontrol = 0;
    $xbarcontrolval.val(xbarcontrol.toFixed(1));
    updatexbarcontrol();
  }

  //xbar nudge forward
  $xbarcontrolnudgeforward.on('mousedown', function() {
    xbarcontrolnudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        xbarcontrolnudgeforward();
      }, delay );
    }, pause)
  })

  $xbarcontrolnudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function xbarcontrolnudgeforward() {
    xbarcontrol += 0.1;
    if (xbarcontrol > 200) xbarcontrol = 200;
    $xbarcontrolval.val(xbarcontrol.toFixed(1));
    updatexbarcontrol();
  }

  function updatexbarcontrol() {
    $xbarcontrolslider.update({
      from: xbarcontrol
    })
    redrawDisplay();
  }


  $sdcontrolval.on('change', function() {
    if ( isNaN($sdcontrolval.val()) ) {
      $sdcontrolval.val(sdcontrol.toFixed(1));
      return;
    }
    sdcontrol = parseFloat($sdcontrolval.val()).toFixed(1);
    if (sdcontrol < 1) {
      sdcontrol = 1;
    }
    if (sdcontrol > 50) {
      sdcontrol = 50;
    }
    $sdcontrolval.val(sdcontrol.toFixed(1));
    updatesdcontrol();
  })

  //sdcontrol nudge backwards
  $sdcontrolnudgebackward.on('mousedown', function() {
    sdcontrolnudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        sdcontrolnudgebackward();
      }, delay );
    }, pause)
  })

  $sdcontrolnudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function sdcontrolnudgebackward() {
    sdcontrol -= 0.1;
    if (sdcontrol < 1) sdcontrol = 1;
    $sdcontrolval.val(sdcontrol.toFixed(1));
    updatesdcontrol();
  }

  //sdcontrol nudge forward
  $sdcontrolnudgeforward.on('mousedown', function() {
    sdcontrolnudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        sdcontrolnudgeforward();
      }, delay );
    }, pause)
  })

  $sdcontrolnudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function sdcontrolnudgeforward() {
    sdcontrol += 0.1;
    if (sdcontrol > 50) sdcontrol = 50;
    $sdcontrolval.val(sdcontrol.toFixed(1));
    updatesdcontrol();
  } 

  function updatesdcontrol() {
    $sdcontrolslider.update({
      from: sdcontrol
    })
    redrawDisplay();  
  }


/*-----------------------------------------xbar sd experimental sliders --------------------------------------*/

$showexperimentalsliderpanel.on('change', function() {
  showexperimentalsliderpanel = $showexperimentalsliderpanel.is(':checked');
  if (showexperimentalsliderpanel) {
    $('#xbarsdexperimental').show();
  }
  else {
    $('#xbarsdexperimental').hide();
  }
})


//changes to the xbar control, sd control textboxes
$xbarexperimentalval.on('change', function() {
  if ( isNaN($xbarexperimentalval.val()) ) {
    $xbarexperimentalval.val(xbarexperimental.toFixed(1));
    return;
  };
  xbarcontol = parseFloat($xbarcontolval.val()).toFixed(1);
  if (xbarcontol < 0) {
    xbarcontol = 0;
  }
  if (xbarcontol > 200) {
    xbarcontol = 200;
  }
  $xbarcontolval.val(xbarcontol.toFixed(1));
  updatexbarexperimental();
})

//xbar experimental nudge backwards
$xbarexperimentalnudgebackward.on('mousedown', function() {
  xbarexperimentalnudgebackward();
  pauseId = setTimeout(function() {
    repeatId = setInterval ( function() {
      xbarexperimentalnudgebackward();
    }, delay );
  }, pause)
})

$xbarexperimentalnudgebackward.on('mouseup', function() {
  clearInterval(repeatId);
  clearTimeout(pauseId);
})

function xbarexperimentalnudgebackward() {
  xbarexperimental -= 0.1;
  if (xbarexperimental < 0) xbarexperimental = 0;
  $xbarexperimentalval.val(xbarexperimental.toFixed(1));
  updatexbarexperimental();
}

//xbar nudge forward
$xbarexperimentalnudgeforward.on('mousedown', function() {
  xbarexperimentalnudgeforward();
  pauseId = setTimeout(function() {
    repeatId = setInterval ( function() {
      xbarexperimentalnudgeforward();
    }, delay );
  }, pause)
})

$xbarexperimentalnudgeforward.on('mouseup', function() {
  clearInterval(repeatId);
  clearTimeout(pauseId);
})

function xbarexperimentalnudgeforward() {
  xbarexperimental += 0.1;
  if (xbarexperimental > 200) xbarexperimental = 200;
  $xbarexperimentalval.val(xbarexperimental.toFixed(1));
  updatexbarexperimental();
}

function updatexbarexperimental() {
  $xbarexperimentalslider.update({
    from: xbarexperimental
  })
  redrawDisplay();
}


$sdexperimentalval.on('change', function() {
  if ( isNaN($sdexperimentalval.val()) ) {
    $sdexperimentalval.val(sdexperimental.toFixed(1));
    return;
  }
  sdexperimental = parseFloat($sdexperimentalval.val()).toFixed(1);
  if (sdexperimental < 1) {
    sdexperimental = 1;
  }
  if (sdexperimental > 50) {
    sdexperimental = 50;
  }
  $sdexperimentalval.val(sdexperimental.toFixed(1));
  updatesdexperimental();
})

//sdexperimental nudge backwards
$sdexperimentalnudgebackward.on('mousedown', function() {
  sdexperimentalnudgebackward();
  pauseId = setTimeout(function() {
    repeatId = setInterval ( function() {
      sdexperimentalnudgebackward();
    }, delay );
  }, pause)
})

$sdexperimentalnudgebackward.on('mouseup', function() {
  clearInterval(repeatId);
  clearTimeout(pauseId);
})

function sdexperimentalnudgebackward() {
  sdexperimental -= 0.1;
  if (sdexperimental < 1) sdexperimental = 1;
  $sdexperimentalval.val(sdexperimental.toFixed(1));
  updatesdexperimental();
}

//sdexperimental nudge forward
$sdexperimentalnudgeforward.on('mousedown', function() {
  sdexperimentalnudgeforward();
  pauseId = setTimeout(function() {
    repeatId = setInterval ( function() {
      sdexperimentalnudgeforward();
    }, delay );
  }, pause)
})

$sdexperimentalnudgeforward.on('mouseup', function() {
  clearInterval(repeatId);
  clearTimeout(pauseId);
})

function sdexperimentalnudgeforward() {
  sdexperimental += 0.1;
  if (sdexperimental > 50) sdexperimental = 50;
  $sdexperimentalval.val(sdexperimental.toFixed(1));
  updatesdexperimental();
} 

function updatesdexperimental() {
  $sdexperimentalslider.update({
    from: sdexperimental
  })
  redrawDisplay();  
}



  /*---------------------------------------------Tooltips on or off-------------------------------------- */

  function setTooltips() {
    Tipped.setDefaultSkin('esci');

    //heading section
    Tipped.create('#logo',          'Version: '+version,                              { skin: 'red', size: 'versionsize', behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
  
    Tipped.create('#tooltipsonoff', 'Tips on/off, default is off!',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.headingtip',    'https://thenewstatistics.com',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.hometip',       'Click to return to esci Home',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    
    Tipped.create('.areastip', 'See area values and control area shading', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.shadetip', 'Click to shade areas under curves', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.areaEaboveCtip', 'Shaded red', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.areaCbelowEtip', 'Shaded blue', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.areaoverlaptip', 'Shaded purple', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.psuperioritytip', 'Probability that a randomly chosen value from E is greater than a randomly chosen value from C', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.nrequiredtip', 'Two independent groups, each of size <em>N</em>, will give a 95% CI on the difference between the means with MoE = <em>d</em>/2. I.e. CI length = <em>d</em>. Calculated <em>N</em> is rounded up to the next integer.', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

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

