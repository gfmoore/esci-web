/*
Program       esci-dance-r.js
Author        Gordon Moore
Date          3 September 2020
Description   The JavaScript code for esci-dance-r
Licence       GNU General Public Licence Version 3, 29 June 2007
*/

// #region Version history
/*
0.0.1   Initial version
0.0.2   09 Oct 2020 #2 Adjusted control panel as required
0.0.3   09 Oct 2020 #3 Speed control adjustment
0.0.4   09 Oct 2020 #4 Resize displays and font sizes positions
0.0.5   09 Oct 2020    Add background image of scatter population.
0.0.6   09 Oct 2020 #? Removed three lines from panel 10
0.0.7   10 Oct 2020 #4 Increase font-size for r on axes
0.0.8   10 Oct 2020 #2 Changed text to sample in panel 2
0.0.9   10 Oct 2020 #5 Change the calculation of sample and remove the fix.
0.0.10  12 Oct 2020 #2 Added pop on/off and re-arranged items in panel 10
0.0.11  12 Oct 2020 #5 Added in the dances code, but not yet aligned to spec
0.0.12  13 Oct 2020 #8 Clear button spec
0.0.13  13 Oct 2020 #6 Implemented spec as far as I can - no capture, no heap
0.0.14  13 Oct 2020 #9 First implementation of capture of rho
0.0.15  14 Oct 2020 Add test option for number of population points
0.0.16  14 Oct 2020 #11 Revised the spec actions
0.0.17  14 Oct 2020 #9 Sort out darker green for capture on

0.1.0   14 Oct 2020 #10 heap code completed. Functionality now complete (I hope).
0.1.1   15 Oct 2020 #7  Population display fixed.
0.1.2   15 Oct 2020 #11 Fixed population nudge bars generating sample.
0.1.3   15 Oct 2020 #9  Fixed bugs on change to ci and what to display
0.1.4   15 Oct 2020 #12 On resize just stop and clear
0.1.5   15 Oct 2020 #12 Code added to redisplay heap etc on resize
0.1.6   16 Oct 2020 #11 Rejigged code. For what should be seen or not on dance on/off.
0.1.7   16 Oct 2020 #14 Fixed disappearing x, y labels 
0.1.8   17 Oct 2020 #15 Added tips
0.1.9   18 Oct 2020 #15 Corrections to tips

1.0.0   19 Oct 2020 Version 1.0.0
*/
//#endregion 

let version = '1.0.0';

let testing = false;

'use strict';
$(function() {
  console.log('jQuery here!');  //just to make sure everything is working

  //#region for variable definitions (just allows code folding)
  let tooltipson              = false;                                        //toggle the tooltips on or off

  // right panels
  let svgS;
  let svgD;                                                                           //the svg reference to pdfdisplay
  const $displayS            = $('#displayS');
  const $displayD            = $('#displayD');

  let margin;     //margins for pdf display area

  let widthS;                                                                //the true width of the pdf display area in pixels
  let heightS;   

  let widthD;
  let heightD;

  let rwidth;                                                                 //the width returned by resize
  let rheight;                                                                //the height returned by resize

  let pauseId;
  let repeatId;
  let delay = 50;
  let pause = 500;

  let sliderinuse = false;

  
  let scatters = [];
  let xscatters = [];
  let yscatters = [];

  let backgroundN = 8000;
  let backgroundscatters = [];
  let xbscatters = [];
  let ybscatters = [];

  let scatterSize = 3;
  let dropSize = 4;

  let xs;
  let ys;

  let i;

  let blobId;
  let bloby;
  let dropGap = 15;

  let alpha;
  let lowerarm;
  let upperarm;

  let blobs = [];

  //dances
  let id = 0;
  let lightGreen = 'lawngreen';
  let darkGreen = '#00DF00';

  // Panel 1 N1
  
  let $N1slider;
  let N1 = 50;
  const $N1val = $('#N1val');
  $N1val.val(N1.toFixed(0));
  const $N1nudgebackward = $('#N1nudgebackward');
  const $N1nudgeforward = $('#N1nudgeforward');


  // Panel 2 r

  let $rslider;

  let rs = 0.5;                                                 //r slider
  let r = 0.5;                                                  //calculated r

  const $rval = $('#rval');
  $rval.val(r.toFixed(2).toString().replace('0.', '.'));

  const $calculatedr = $('#calculatedr');

  const $rnudgebackward = $('#rnudgebackward');
  const $rnudgeforward = $('#rnudgeforward');

  
  // Panel 3 Control Panel

  const $clear = $('#clear');                         //the clear button
  const $takeSample = $('#takesample');               //take one sample
  const $runFreely = $('#runfreely');                 //toggle for run freely
  let runFreely = false;                              //runfreely flag
  const $speed = $('#speed');                         //speed slider mS
  let speed;
  let triggerTakeSample;                              //for use in the start stop timer

  
  // Panel 4 Display features

  const $displaypopn = $('#displaypopn')
  let displaypopn = true;

  const $displayr = $('#displayr');
  let displayr = false;

  const $displayctm = $('#displayctm');
  let displayctm = false;

  const $displaymd = $('#displaymd');
  let displaymd = false;


  // Panel 5 Descriptive statstics

  const $labelx = $('#labelx');
  const $labely = $('#labely');
  const $statistics1 = $('#statistics1');
  const $statistics1show = $('#statistics1show');
  let statistics1show = false;

  const $m1 = $('#m1');
  const $m2 = $('#m2');
  const $s1 = $('#s1');
  const $s2 = $('#s2');

  
  // Panel 6 Display lines

  const $displaylines1 = $('#displaylines1');
  const $displaylines1show = $('#displaylines1show');
  let displaylines1show = false;

  const $corryx = $('#corryx');
  let corryx = false;

  const $corryxval = $('#corryxval');
  let corryxval;
  
  const $corrxy = $('#corrxy');
  let corrxy = false;

  const $corrxyval = $('#corrxyval');
  let corrxyval;

  const $corrlineslope = $('#corrlineslope');
  let corrlineslope = false;

  const $corrlineslopeval = $('#corrlineslopeval');
  let corrlineslopeval;

  let Mx = 0;
  let My = 0;
  let Sx = 0;
  let Sy = 0;

  let Sxx;
  let Sxy;
  let Syx;
  let Syy;

  //y on x
  let betayonx = 0;
  let alphayonx = 0;
  let yvalueyxA = 0;
  let yvalueyxB = 0;

  //x on y
  let betaxony = 0;
  let alphaxony = 0;
  let xvaluexyA = 0;
  let xvaluexyB = 0;

  //confidence line
  let betacl = 0;
  let alphacl = 0;
  let yvaluecl1 = 0;
  let yvaluecl2 = 0;

  let betaxonyinverse = 0;


  // Panel 7 Dance of r values

  const $danceonoff = $('#danceonoff');
  let danceon = false;


  // Panel 8 Latest sample

  const $latestsamplesection = $('#latestsamplesection');
  const $latestsample = $('#latestsample');
  
  // Panel 9 Confidence Intervals

  const $CIsection = $('#CIsection');
  
  const $displayCIs = $('#displayCIs');
  let displayCIs = false;
  
  const $ci = $('#CI');

  const $cifrom = $('#cifrom');
  const $cito   = $('#cito');
  

  // Panel 10 Capture section

  const $capturesection = $('#capturesection');

  const $displaylinetomarkrho = $('#displaylinetomarkrho');
  let displaylinetomarkrho = false;

  const $showcapture = $('#showcapture');
  let showcapture = false;

  const $showrheap = $('#showrheap');
  let showrheap = false;

  const $numbersamplestaken = $('#numbersamplestaken');

  const $percentCIcapture = $('#percentCIcapture');

  let sampletaken = false;  //to stop sample r being displayed when no sample taken
  let samplestaken = 0;     //count of samples taken

  let captured = 0;
  let percentCaptured = 0;

  let lastlowerarm;
  let lastupperarm;

  //heap stuff
  let doonce = true;
  let moveblob = true;

  let heap = [];
  let blobr;

  let rr;
  let capturedblob;

  //#endregion

  //breadcrumbs
  $('#homecrumb').on('click', function() {
    window.location.href = "https://www.esci.thenewstatistics.com/";
  })

  initialise();

  function initialise() {

    d3.selectAll('svg > *').remove();  //remove all elements under svg
    $('svg').remove();  

    //hide labels on Descriptive statistics
    $labelx.hide();
    $labely.hide();

    //hide dance panels
    $displayD.hide();
    $latestsamplesection.hide();
    $CIsection.hide();
    $capturesection.hide();

    //TESTING
    if (testing) {
      danceon = true;
      $danceonoff.prop("checked", true);

      //show dance panels
      $displayD.show();
      $latestsamplesection.show();
      $CIsection.show();
      $capturesection.show();

      //$displayCIs.prop('checked', true);
      //displayCIs = true;

      $displaypopn.prop('checked', false);
      displaypopn = false;

      $displaylinetomarkrho.prop('checked', true);
      displaylinetomarkrho = true;

      $showrheap.prop('checked', true);
      showrheap = true;

      speed = 0;
      $speed.val(0);
    }

    //set up an initial background scatters
    backgroundScatters();
    
    //get initial dimensions of #display div
    margin = {top: 15, right: 15, bottom: 0, left: 15};

    rheight = $('#main').outerHeight(true);
    rwidth  = $('html').outerWidth(true)  -  $('#leftpanel').outerWidth(true); 

    //setDisplaySize();
    setupSliders();
    //set displayed r of sample to - initially and on clear (done in clear)

    setTooltips();

    clear();

    $statistics1.hide();
    $statistics1show.prop('checked', false);

    $displaylines1.hide();
    $displaylines1show.prop('checked', false);


    //initial take a sample
    takeSample();
  }

  function setupSliders() {

    $('#N1slider').ionRangeSlider({
      skin: 'big',
      grid: true,
      grid_num: 6,
      type: 'single',
      min: 0,
      max: 300,
      from: 50,
      step: 1,
      prettify: prettify0,
      //on slider handles change
      onChange: function (data) {
        N1 = data.from;
        if (N1 < 4) N1 = 4;
        sliderinuse = true;  //don't update dslider in updateN1()
        updateN1();  //create scatter and update to
        $N1val.val(N1.toFixed(0));

      },
      onFinish: function(data) {
        updateN1();
      }
    })
    $N1slider = $('#N1slider').data("ionRangeSlider");

    $('#rslider').ionRangeSlider({
      skin: 'big',
      grid: true,
      grid_num: 4,
      type: 'single',
      min: -1,
      max: 1,
      from: 0.5,
      step: 0.01,
      prettify: prettify2,
      //on slider handles change
      onChange: function (data) {
        rs = data.from;
        sliderinuse = true;  //don't update dslider in updater()
        updater();
        $rval.val(rs.toFixed(2).toString().replace('0.', '.'));
        if (sampletaken) {
          $calculatedr.text(r.toFixed(2).toString().replace('0.', '.'));
          $latestsample.text(r.toFixed(2).toString().replace('0.', '.'));
        }
        else {
          //also clear samples from display (this might happen if N has changed)
          clearDance();
        }


      }
    })
    $rslider = $('#rslider').data("ionRangeSlider");

    function prettify0(n) {
      return n.toFixed(0);
    }
  
    function prettify1(n) {
      return n.toFixed(1).toString().replace('0.', '.');
    }
  
    function prettify2(n) {
      return n.toFixed(2).toString().replace('0.', '.');
    }
  
  }

  function updateN1() {
    if (!sliderinuse) $N1slider.update({ from: N1 })
    sliderinuse = false;

    if (danceon) {
      clear();
    }
    else {
      if (sampletaken) {
        createScatters();
        drawScatterGraph();
      }
      statistics();
      displayStatistics();
    }
    
  }

  function updater() {
    if (!sliderinuse) $rslider.update({ from: rs })
    sliderinuse = false;

    backgroundScatters();
    displayBackgroundScatters();

    if (danceon) {
      clear();
    }
    else {
      if (sampletaken) {
        createScatters();
        drawScatterGraph();
      }
      statistics();
      displayStatistics();
    }

    if (danceon && displaylinetomarkrho) drawrholine();
  }


  //set everything to a default state.
  function clear() {
    stop();

    Fhalt = false;
    sampletaken = false;

    setDisplaySize();
    setupAxes();    

    clearDance();  //also clears blobs and capture statistics

    emptyHeap();

    if (displaypopn) displayBackgroundScatters();

    if (danceon && displaylinetomarkrho) drawrholine();

    speed = parseInt($speed.val());

    $m1.text('-');
    $m2.text('-');
    $s1.text('-');
    $s2.text('-');

    $corryxval.text('-');
    $corrxyval.text('-');
    $corrlineslopeval.text('-'); 

    alpha = parseFloat($ci.val()); 

    $calculatedr.text('-');
    $latestsample.text('-');

    $cifrom.text('-');
    $cito.text('-');
    $numbersamplestaken.text(0);
    $percentCIcapture.text('-');

    //starting to be too many hacks in this code
    if (displayr) {
      svgS.append('text').text('r = ').attr('class', 'rtext').attr('x', 50).attr('y', y(2.8)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.5rem').style('font-weight', 'bold').style('font-style', 'italic');
      svgS.append('text').text('-').attr('class', 'rtext').attr('x', 80).attr('y', y(2.8)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.5rem').style('font-weight', 'bold');
    }

  }


  function resize() {
    setDisplaySize();
    setupAxes();

    displayBackgroundScatters();
    
    //don't recreate scatters here
    if (sampletaken) drawScatterGraph();
    statistics();
    displayStatistics();

    if (displaylinetomarkrho) {
      drawrholine();
    }
    else {
      removerholine();
    }

    redisplayDanceandHeap();
  }

  function setDisplaySize() {

    d3.selectAll('svg > *').remove();  //remove all elements under svg
    $('svg').remove();  

    rheight = $('#main').outerHeight(true);
    rwidth  = $('html').outerWidth(true)  - $('#leftpanel').outerWidth(true);

    if (danceon) {
      widthS   = (rwidth - margin.left - margin.right);  
      heightS  = (rheight - margin.top - margin.bottom)/2;

      widthD = widthS;

      if (heightS > widthS) {
        heightS = widthS;
      }
      else {
        widthS = heightS;
      }

      heightD = heightS;
      
      scatterSize = 1.5;
    }
    else {
      widthS   = (rwidth - margin.left - margin.right);  
      heightS  = (rheight - margin.top - margin.bottom);

      widthD   = rwidth - margin.left - margin.right;  
      heightD  = (rheight - margin.top - margin.bottom);

      //try to keep scatters grid square
      if (widthS > heightS) {
        widthS = heightS;
      }
      else {
        heightS = widthS;
      }

      scatterSize = 3;
    }

    //change #display scatters
    $displayS.css('width', widthS);
    $displayS.css('height', heightS);

    //add some margin to scatters display
    $displayS.css('margin-left', widthD/2 - widthS/2);

    //change #display dance
    $displayD.css('width', widthD);
    $displayD.css('height', heightD);

    svgS = d3.select('#displayS').append('svg').attr('width', '100%').attr('height', '100%');

    svgD = d3.select('#displayD').append('svg').attr('width', '100%').attr('height', '100%');

  }


  function setupAxes() {
    //clear axes
    d3.selectAll('.xaxis').remove();
    d3.selectAll('.yaxis').remove();
    d3.selectAll('.raxis').remove();
    d3.selectAll('.axistext').remove();

    x = d3.scaleLinear().domain([-3, 3]).range([35, widthS-25]);
    y = d3.scaleLinear().domain([-3, 3]).range([heightS-35, 10]);

    rx = d3.scaleLinear().domain([-1, 1]).range([20, widthD - 20]);
    ry = d3.scaleLinear().domain([0, 100]).range([20, heightD - 20]);

    let xAxis = d3.axisBottom(x).tickPadding([10]).ticks(7).tickFormat(d3.format('')); //.ticks(20); //.tickValues([]);
    svgS.append('g').attr('class', 'xaxis').style("font", "1.3rem sans-serif").style('padding-top', '0.5rem').attr( 'transform', `translate(0, ${heightS-35})` ).call(xAxis);

    let yAxis = d3.axisLeft(y).tickPadding([10]).ticks(7).tickFormat(d3.format('')); //.ticks(20); //.tickValues([]);
    svgS.append('g').attr('class', 'yaxis').style("font", "1.3rem sans-serif").attr( 'transform', `translate(${35}, 0)` ).call(yAxis);

    //r display
    let rAxisTop = d3.axisBottom(rx).tickPadding([10]).ticks(7).tickFormat(d3.format('')); //.ticks(20); //.tickValues([]);
    svgD.append('g').attr('class', 'raxis').style("font", "1.3rem sans-serif").attr( 'transform', `translate(${0}, ${heightD - 40})` ).call(rAxisTop);
    let rAxisBottom = d3.axisTop(rx).tickPadding([10]).ticks(7).tickFormat(d3.format('')); //.ticks(20); //.tickValues([]);
    svgD.append('g').attr('class', 'raxis').style("font", "1.3rem sans-serif").attr( 'transform', `translate(${0}, 45)` ).call(rAxisBottom);


    //add some axis labels
    svgS.append('text').text('X').attr('class', 'axistext').attr('x', x(0) + 10).attr('y', y(-3.0) + 30).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.4rem').style('font-weight', 'bold').style('font-style', 'italic');
    svgS.append('text').text('Y').attr('class', 'axistext').attr('x', x(-3.0) - 30).attr('y', y(0.0) - 10).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.4rem').style('font-weight', 'bold').style('font-style', 'italic');

    svgD.append('text').text('Correlation').attr('class', 'axistext').attr('x', rx(-1) - 15).attr('y', ry(0)-8 ).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.3rem').style('font-weight', 'bold');
    svgD.append('text').text('r').attr('class', 'axistext').attr('x', rx(0) - 20).attr('y', ry(0) - 5 ).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.7rem').style('font-weight', 'bold').style('font-style', 'italic');
    svgD.append('text').text('r').attr('class', 'axistext').attr('x', rx(0) - 20).attr('y', ry(100) + 15 ).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.7rem').style('font-weight', 'bold').style('font-style', 'italic');


    //add additional ticks for x scale
    //the minor ticks
    let interval = d3.ticks(-3, 3, 10);  //gets an array of where it is putting tick marks

    let i;
    let minortick;
    let minortickmark;

    //half way ticks
    for (i=1; i < interval.length; i += 1) {
      minortick = (interval[i] - interval[i-1]);
      for (let ticks = 1; ticks <= 10; ticks += 1) {
        minortickmark = interval[i-1] + (minortick * ticks);
        if (minortickmark > -3 && minortickmark < 3) svgS.append('line').attr('class', 'xaxis').attr('x1', x(minortickmark)).attr('y1', 0).attr('x2', x(minortickmark) ).attr('y2', 10).attr('stroke', 'black').attr('stroke-width', 1).attr( 'transform', `translate(0, ${heightD})` );
        if (minortickmark > -3 && minortickmark < 3) svgS.append('line').attr('class', 'yaxis').attr('x1', 0).attr('y1', y(minortickmark)).attr('x2', 10 ).attr('y2', y(minortickmark)).attr('stroke', 'black').attr('stroke-width', 1).attr( 'transform', `translate(0, ${heightD})` );

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

  }

  function takeSample() {
    sampletaken = true;

    createScatters();
    drawScatterGraph();
    statistics();
    displayStatistics();

    createDance();
    displayDance();

    if (danceon) {
      samplestaken += 1;
      $numbersamplestaken.text(samplestaken);

      //work out percent capturing rho
      //?? do we count capture if display CIs off???
      if (true) {
        if (lowerarm > rs) {

        }
        else if (upperarm < rs) {

        }
        else {
          captured += 1;
        }
        percentCaptured = captured/samplestaken * 100;

        //if (displayCIs) {
        if (showcapture) {
          $percentCIcapture.text(percentCaptured.toFixed(2));
        }
        else {
          $percentCIcapture.text('-');
        }
      }

    }
  }

  function createScatters() {

    scatters      = [];
    xscatters     = [];
    yscatters     = [];

    let coeff = Math.sqrt(1 - rs*rs);

    for (i = 0; i < N1; i += 1) {
      xs = jStat.normal.sample( 0, 1 );
      ys = jStat.normal.sample( 0, 1 );

      //adjust
      ys = (rs * xs) + (coeff * ys);

      xscatters.push(xs);
      yscatters.push(ys);
      scatters.push( {x: xs, y: ys} );
    }

    //now get corr coeff of sample
    r = jStat.corrcoeff( xscatters, yscatters );
  }

  function drawScatterGraph() {
    clearScatterGraph();
    d3.selectAll('.rtext').remove();
    d3.selectAll('.ctm').remove();
    d3.selectAll('.regression').remove();

    //display scatters
    for (i = 0; i < scatters.length; i += 1) {
      if      (scatters[i].x < -3)  svgS.append('circle').attr('class', 'scatters').attr('cx', x(-3.05)).attr('cy', y(scatters[i].y)).attr('r', scatterSize).attr('stroke', 'red').attr('stroke-width', 2).attr('fill', 'red');      
      else if (scatters[i].x > 3)   svgS.append('circle').attr('class', 'scatters').attr('cx', x(3.05)).attr('cy', y(scatters[i].y)).attr('r', scatterSize).attr('stroke', 'red').attr('stroke-width', 2).attr('fill', 'red'); 
      else if (scatters[i].y < -3)  svgS.append('circle').attr('class', 'scatters').attr('cx', x(scatters[i].x)).attr('cy', y(-3.05)).attr('r', scatterSize).attr('stroke', 'red').attr('stroke-width', 2).attr('fill', 'red'); 
      else if (scatters[i].y > 3)   svgS.append('circle').attr('class', 'scatters').attr('cx', x(scatters[i].x)).attr('cy', y(3.05)).attr('r', scatterSize).attr('stroke', 'red').attr('stroke-width', 2).attr('fill', 'red'); 
      else  /*normal*/              svgS.append('circle').attr('class', 'scatters').attr('cx', x(scatters[i].x)).attr('cy', y(scatters[i].y)).attr('r', scatterSize).attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'blue');
    }

    $numbersamplestaken.text(samplestaken);
  }

  function clearScatterGraph() {
    d3.selectAll('.scatters').remove();
  }

  function statistics() {

    Mx = jStat.mean(xscatters);
    Sx = jStat.stdev(xscatters, true);  

    My = jStat.mean(yscatters)
    Sy = jStat.stdev(yscatters, true)

    r = jStat.corrcoeff( xscatters, yscatters )

    //get Sxy, Sxx, Syy
    Sxx = 0;
    Syy = 0;
    Sxy = 0;
    Syx = 0;

    for (let i = 0; i < scatters.length; i += 1) {
      Sxy += (scatters[i].x - Mx) * (scatters[i].y - My);
      Sxx += (scatters[i].x - Mx) * (scatters[i].x - Mx);
      Syy += (scatters[i].y - My) * (scatters[i].y - My);
    }
    Syx = Sxy;
    
    //get gradients of y on x, x on y and correlation line
    betayonx = r * Sy/Sx;
    betaxony = r * Sx/Sy;
    betaxonyinverse = 1/betaxony;
    betacl    = Sy/Sx;
    if (r < 0) betacl = -betacl;

    //formula for y on x
    alphayonx = My - betayonx * Mx;
    yvalueyxA = alphayonx + betayonx * -3;
    yvalueyxB = alphayonx + betayonx * 3

    //formula for x on y
    alphaxony = Mx - betaxony * My;;
    xvaluexyA = alphaxony + betaxony * -3;
    xvaluexyB = alphaxony + betaxony * 3

    //formula for correlation line
    yvaluecl1 = (-3 * betacl) + (My - (betacl * Mx));
    yvaluecl2 = (3 * betacl)  + (My - (betacl * Mx));

  }

  function displayStatistics() {

    //display mean and sd values
    if (sampletaken) {
      $m1.text(Mx.toFixed(2).toString());
      $m2.text(My.toFixed(2).toString());
      $s1.text(Sx.toFixed(2).toString());
      $s2.text(Sy.toFixed(2).toString());
    }
    else {
      $m1.text('-');
      $m2.text('-');
      $s1.text('-');
      $s2.text('-');
    }

    //display calculated r from data  //check to see if NaN

    if (isNaN(r)) {
      $calculatedr.text('-');
      $latestsample.text('-');
    }
    else {
      if (sampletaken) {
        $calculatedr.text(r.toFixed(2).toString().replace('0.', '.'));
        $latestsample.text(r.toFixed(2).toString().replace('0.', '.'));
      }
    }
    //display calculated r on graph
    if(displayr) { 
      if (sampletaken) {
        svgS.append('text').text('r = ').attr('class', 'rtext').attr('x', 50).attr('y', y(2.8)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.5rem').style('font-weight', 'bold').style('font-style', 'italic');
        svgS.append('text').text(r.toFixed(2).toString().replace('0.', '.')).attr('class', 'rtext').attr('x', 80).attr('y', y(2.8)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.5rem').style('font-weight', 'bold');
      }
      else {
        svgS.append('text').text('r = ').attr('class', 'rtext').attr('x', 50).attr('y', y(2.8)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.5rem').style('font-weight', 'bold').style('font-style', 'italic');
        svgS.append('text').text('-').attr('class', 'rtext').attr('x', 80).attr('y', y(2.8)).attr('text-anchor', 'start').attr('fill', 'black').style('font-size', '1.5rem').style('font-weight', 'bold');
      }
    }

    //need to create a clipping rectangle
    let mask = svgS.append('defs').append('clipPath').attr('id', 'mask').append('rect').attr('x', x(-3)).attr('y', y(3)).attr('width', x(3) - x(-3)).attr('height', y(-3) - y(3));
    //show clip area -- 
    //svgS.append('rect').attr('class', 'test').attr('x', x(-3)).attr('y', y(3)).attr('width', x(3) - x(-3)).attr('height', y(-3) - y(3)).attr('stroke', 'black').attr('stroke-width', '0').attr('fill', 'rgb(255, 255, 0, 0.5)');

    //cross through means
    if (displayctm && sampletaken) {
      svgS.append('line').attr('class', 'ctm').attr('x1', x(Mx)).attr('y1', y(-3)).attr('x2', x(Mx) ).attr('y2', y(3)).attr('stroke', 'black').attr('stroke-width', 1).style('stroke-dasharray', ('3, 3'));
      svgS.append('line').attr('class', 'ctm').attr('x1', x(-3)).attr('y1', y(My)).attr('x2', x(3)).attr('y2', y(My)).attr('stroke', 'black').attr('stroke-width', 1).style('stroke-dasharray', ('3, 3'));
    }

    if (sampletaken) {
      $corryxval.text((betayonx).toFixed(2).toString().replace('0.', '.'));
      $corrxyval.text((betaxonyinverse).toFixed(2).toString().replace('0.', '.'));
      $corrlineslopeval.text((betacl).toFixed(2).toString().replace('0.', '.')); 
    }
    else {
      $corryxval.text('-');
      $corrxyval.text('-');
      $corrlineslopeval.text('-'); 
    }

    //corryx = true;
    if (sampletaken) {
      if (corryx) {
        svgS.append('line').attr('class', 'regression').attr('x1', x(-3)).attr('y1', y(yvalueyxA)).attr('x2', x(3) ).attr('y2', y(yvalueyxB)).attr('stroke', 'blue').attr('stroke-width', 1).attr('clip-path', 'url(#mask)');
      }

      //corrxy = true;
      if (corrxy) {
        svgS.append('line').attr('class', 'regression').attr('x1', x(xvaluexyA)).attr('y1', y(-3)).attr('x2', x(xvaluexyB) ).attr('y2', y(3)).attr('stroke', 'red').attr('stroke-width', 1).attr('clip-path', 'url(#mask)');
      }

      //corrlineslope = true;
      if (corrlineslope) {
        svgS.append('line').attr('class', 'regression').attr('x1', x(-3) ).attr('y1', y(yvaluecl1) ).attr('x2', x(3) ).attr('y2', y(yvaluecl2) ).attr('stroke', 'black').attr('stroke-width', 1).attr('clip-path', 'url(#mask)');
      }
    }
  }

  function backgroundScatters() {
    xbscatters = [];
    ybscatters = [];
    for (i = 0; i < backgroundN; i += 1) {
      xs = jStat.normal.sample( 0, 1 );
      ys = jStat.normal.sample( 0, 1 );
      xbscatters.push(xs);
      ybscatters.push(ys);
    }

    backgroundscatters = [];
    for (i = 0; i < backgroundN; i += 1) {
      xs = xbscatters[i]
      ys = (rs * xbscatters[i]) + (Math.sqrt(1 - rs*rs) * ybscatters[i]);
      backgroundscatters.push( {x: xs, y: ys} );
    }

  }

  function displayBackgroundScatters() {
    d3.selectAll('.backgroundscatters').remove();

    if (displaypopn) {
      for (i = 0; i < backgroundN; i += 1) {
        //if (backgroundscatters.length > 0) {  //might not have created them yet
          if      (backgroundscatters[i].x < -3)  svgS.append('circle').attr('class', 'backgroundscatters').attr('cx', x(-3.05)).attr('cy', y(backgroundscatters[i].y)).attr('r', scatterSize).attr('stroke', 'white').attr('stroke-width', 2).attr('fill', 'white');      
          else if (backgroundscatters[i].x > 3)   svgS.append('circle').attr('class', 'backgroundscatters').attr('cx', x(3.05)).attr('cy', y(backgroundscatters[i].y)).attr('r', scatterSize).attr('stroke', 'white').attr('stroke-width', 2).attr('fill', 'white'); 
          else if (backgroundscatters[i].y < -3)  svgS.append('circle').attr('class', 'backgroundscatters').attr('cx', x(backgroundscatters[i].x)).attr('cy', y(-3.05)).attr('r', scatterSize).attr('stroke', 'white').attr('stroke-width', 2).attr('fill', 'white'); 
          else if (backgroundscatters[i].y > 3)   svgS.append('circle').attr('class', 'backgroundscatters').attr('cx', x(backgroundscatters[i].x)).attr('cy', y(3.05)).attr('r', scatterSize).attr('stroke', 'white').attr('stroke-width', 2).attr('fill', 'white'); 
          else  /*normal*/              svgS.append('circle').attr('class', 'backgroundscatters').attr('cx', x(backgroundscatters[i].x)).attr('cy', y(backgroundscatters[i].y)).attr('r', scatterSize).attr('stroke', '#DEDEDE').attr('stroke-width', 1).attr('fill', 'white');
        //}
      }
    }
  }

  function createDance() {
    //move down previous blobs and wings if any
    d3.selectAll('.rsampleblob').each(function() {
      capturedblob = $(this).attr('captured');

      blobId = parseInt($(this).attr('id').substring(1));
      bloby = parseInt($(this).attr('cy'));
      blobx = $(this).attr('cx');
      rr = $(this).attr('rr');  //this is correlation r stored in blob, can't be r as that is radius

      //should I add to heap? If it is added to heap, then need to continue to next item. I'm sure this could be better structured!
      moveblob = true;
      if (showrheap) {        
        if ( addtoheap(blobId, blobx, rr, bloby, capturedblob) ) moveblob = false;
      }

      if (moveblob) {
        //now move items down 1 pixel at a time until done or goes past limit.  It's so fast though, you can't see the blob reach the bottom.
        for (let i = 0; i < dropGap; i += 1) {
          bloby += 1;
          if (bloby < heightD - 40) { //move the blob and wings
            d3.select('#leftwing'+blobId).attr('y1', bloby).attr('y2', bloby);
            d3.select('#rightwing'+blobId).attr('y1', bloby).attr('y2', bloby);
            $(this).attr('cy', bloby);
          }
          else { //remove the blob and wings
            d3.select('#leftwing'+blobId).remove();
            d3.select('#rightwing'+blobId).remove();
            $(this).remove();
            break; //out of for loop I hope
          }
        }
      }
    })

    //now deal with new sample
    calculateFisherrtozTransformation();  //provides lowerarm, upperarm 

    if (upperarm < rs || lowerarm > rs) {
      capturedblob = 'false';
    }
    else {
      capturedblob = 'true';
    }

    //display these values
    if (displayCIs) {
      $cifrom.text(lowerarm.toFixed(2));
      $cito.text(upperarm.toFixed(2));
    }
    else {
      $cifrom.text('-');
      $cito.text('-');
    }
    //just remember the last lowerarm, upperarm for use with displayCIs on off
    lastlowerarm = lowerarm;
    lastupperarm = upperarm;

    //create wings for current sample
    if (showcapture && capturedblob === 'false') {
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'leftwing' + id).attr('x1', rx(lowerarm)).attr('y1', 55).attr('x2', rx(r) ).attr('y2', 55).attr('lowerarm', lowerarm).attr('stroke', 'red').attr('stroke-width', 3).attr('visibility', 'hidden');
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'rightwing' + id).attr('x1', rx(r)).attr('y1', 55).attr('x2', rx(upperarm) ).attr('y2', 55).attr('upperarm', upperarm).attr('stroke', 'red').attr('stroke-width', 3).attr('visibility', 'hidden');
  
      svgD.append('circle').attr('class', 'rsampleblob').attr('id', 'r' + id).attr('rr', r).attr('cx', rx(r)).attr('cy', 55).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'red').attr('captured', capturedblob).attr('visibility', 'hidden');
    }
    else if (showcapture) {
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'leftwing' + id).attr('x1', rx(lowerarm)).attr('y1', 55).attr('x2', rx(r) ).attr('y2', 55).attr('lowerarm', lowerarm).attr('stroke', darkGreen).attr('stroke-width', 3).attr('visibility', 'hidden');
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'rightwing' + id).attr('x1', rx(r)).attr('y1', 55).attr('x2', rx(upperarm) ).attr('y2', 55).attr('upperarm', upperarm).attr('stroke', darkGreen).attr('stroke-width', 3).attr('visibility', 'hidden');
  
      svgD.append('circle').attr('class', 'rsampleblob').attr('id', 'r' + id).attr('rr', r).attr('cx', rx(r)).attr('cy', 55).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', darkGreen).attr('captured', capturedblob).attr('visibility', 'hidden');

    }
    else {
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'leftwing' + id).attr('x1', rx(lowerarm)).attr('y1', 55).attr('x2', rx(r) ).attr('y2', 55).attr('lowerarm', lowerarm).attr('stroke', lightGreen).attr('stroke-width', 3).attr('visibility', 'hidden');
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'rightwing' + id).attr('x1', rx(r)).attr('y1', 55).attr('x2', rx(upperarm) ).attr('y2', 55).attr('upperarm', upperarm).attr('stroke', lightGreen).attr('stroke-width', 3).attr('visibility', 'hidden');
  
      svgD.append('circle').attr('class', 'rsampleblob').attr('id', 'r' + id).attr('rr', r).attr('cx', rx(r)).attr('cy', 55).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', lightGreen).attr('captured', capturedblob).attr('visibility', 'hidden');
    }

    //add to blobs array - if resize we use this to redisplay dance and heap
    blobs.push(
      {
        id: id,
        r: r,
        lowerarm: lowerarm,
        upperarm: upperarm,
        capturedblob: capturedblob 
      }
    )

    id += 1;

  }


  function addtoheap(blobId, blobx, rr, bloby, capturedblob) {
    //now look at this blob, compare it with the heap array and decide if to add it or ignore
    
    let barh;
    let f;
    let xpos;
    let found;
    let colour = d3.select('#r'+blobId).attr('fill');

    //get integer position for blob in terms of buckets
    xpos = parseInt(blobx/(2*dropSize))

    //now scan through heap (array of objects) looking for an existing xpos and get current frequency
    f = 0;
    for (let posx = 0; posx < heap.length; posx += 1) {
      if (heap[posx].x === xpos) {
        f = heap[posx].f;
        break;
      }
    }

/**XXXXXXXXXXXXXXXXXXXXXXXXXXXX problem with some heights not registering at test??????????? */

    //how 'high' is the 'bar' at this point?
    barh = (heightD - 45) - ( (f+1) * 2 * dropSize );

    //if the blob is below the top of bar height
    if (bloby >= barh) {  
      //increase the frequency of the heap at that point      
      f += 1;

      found = false;
      for (let posx = 0; posx < heap.length; posx += 1) {
        if (heap[posx].x === xpos) {
          heap[posx].f += 1;
          found = true;
          break;
        }
      }
      if (!found) {
        heap.push({x: xpos, rr: rr, f: 1, captured: capturedblob, colour: colour});  //add a new entry to heap array
      }
      //add a heap blob, but checked against top of displayable area
      if (barh > 55) {
        //now color according to missed or captured
        svgD.append('circle').attr('class', 'rheap').attr('cx', (xpos * 2*dropSize) + dropSize).attr('cy', barh + 2*dropSize).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', colour).attr('captured', capturedblob);
      }

      //remove the drop blob and wings
      d3.select('#leftwing'+blobId).remove();
      d3.select('#rightwing'+blobId).remove();
      d3.select('#r'+blobId).remove();

      return true; //item added to heap and removed from dance
    }
    else {
      return false; //not added to heap
    }
  }

  function clearDance() {
    //clear all dances and heap
    d3.selectAll('.rsampleblob').remove();
    d3.selectAll('.rsamplewing').remove();
    d3.selectAll('.rheap').remove(); 

    blobs = [];
    id = 0;
    
    sampletaken = false;
    samplestaken = 0;
    captured     = 0;
    percentCaptured = 0;

    $numbersamplestaken.text(0);
    $percentCIcapture.text('-');

    $calculatedr.text('-'); 
    $latestsample.text('-');
  }


  function calculateFisherrtozTransformation() {

    let zr = 0.5 * Math.log( ( 1 + r ) / ( 1 - r ) );  //Math.log is the natural logarithm

    //let cv = jStat.studentt.inv( alpha/2, N1 - 1 );       //critical value
    let cv = Math.abs(jStat.normal.inv( alpha/2, 0, 1));    //critical value  e.g. 0.05 gives 1.96

    lowerarm = zr - ( cv * 1 / (Math.sqrt(N1 - 3)) );
    upperarm = zr + ( cv * 1 / (Math.sqrt(N1 - 3)) );

    //now transform back to r values

    lowerarm = (Math.exp( 2 * lowerarm) - 1 ) / (Math.exp( 2 * lowerarm) + 1 );
    upperarm = (Math.exp( 2 * upperarm) - 1 ) / (Math.exp( 2 * upperarm) + 1 );    

  }

  function displayDance() {
    //show wings and blob
    d3.selectAll('.rsampleblob').attr('visibility', 'visible');
    if (displayCIs) {
      d3.selectAll('.rsamplewing').attr('visibility', 'visible');
    }
    else {
      d3.selectAll('.rsamplewing').attr('visibility', 'hidden');
    }
  }

  function recolour() {

    //go through blobs and wings on the display
    d3.selectAll('.rsampleblob').each(function() {
      blobId = parseInt($(this).attr('id').substring(1));

      lowerarm = d3.select('#leftwing'+blobId).attr('lowerarm');
      upperarm = d3.select('#rightwing'+blobId).attr('upperarm');
      
      if (showcapture && (upperarm < rs || lowerarm > rs)) {
        $(this).attr('fill', 'red');
        d3.select('#leftwing'+blobId).attr('stroke', 'red');
        d3.select('#rightwing'+blobId).attr('stroke', 'red');
      }
      else if (showcapture) {
        $(this).attr('fill', darkGreen);
        d3.select('#leftwing'+blobId).attr('stroke', darkGreen);
        d3.select('#rightwing'+blobId).attr('stroke', darkGreen);      }      
      else {
        $(this).attr('fill', lightGreen);
        d3.select('#leftwing'+blobId).attr('stroke', lightGreen);
        d3.select('#rightwing'+blobId).attr('stroke', lightGreen);
      }

    })

    //now go through heap and colour as required
    d3.selectAll('.rheap').each(function() {
      capturedblob = $(this).attr('captured');
      if (showrheap) {
        if (showcapture) {
          if (capturedblob === 'false') {
            $(this).attr('fill', 'red');
          }
          else {
            $(this).attr('fill', darkGreen);
          }
        }
        else {
          $(this).attr('fill', lightGreen);
        }
      }
    })
  }

  function emptyHeap() {
    heap = [];
    d3.selectAll('.rheap').remove();
  }

  /*------------------------Re display dance and heap after a resize event-----------------------*/
  function redisplayDanceandHeap() { 
    if (!danceon) {
      return;
    }

    //clear all dances and heap
    d3.selectAll('.rsampleblob').remove();
    d3.selectAll('.rsamplewing').remove();
    d3.selectAll('.rheap').remove(); 

    heap = [];
    
    //go through blobs array which contains a history of all blobs
    for (let i = 0; i <= blobs.length-1; i += 1) {
      createDance2(blobs[i].r, blobs[i].id, blobs[i].lowerarm, blobs[i].upperarm, blobs[i].capturedblob);
      displayDance();
    }  
  }

  function createDance2(r, id, lowerarm, upperarm, samplecapturedblob) {

    //move down previous blobs and wings if any
    d3.selectAll('.rsampleblob').each(function() {
      capturedblob = $(this).attr('captured');

      blobId = parseInt($(this).attr('id').substring(1));
      bloby = parseInt($(this).attr('cy'));
      blobx = $(this).attr('cx');
      rr = $(this).attr('rr');  //this is correlation r stored in blob, can't be r as that is radius

      //should I add to heap? If it is added to heap, then need to continue to next item. I'm sure this could be better structured!
      moveblob = true;
      if (showrheap) {        
        if ( addtoheap2(blobId, blobx, rr, bloby, capturedblob) ) moveblob = false;
      }

      if (moveblob) {
        //now move items down 1 pixel at a time until done or goes past limit.  It's so fast though, you can't see the blob reach the bottom.
        for (let i = 0; i < dropGap; i += 1) {
          bloby += 1;
          if (bloby < heightD - 40) { //move the blob and wings
            d3.select('#leftwing'+blobId).attr('y1', bloby).attr('y2', bloby);
            d3.select('#rightwing'+blobId).attr('y1', bloby).attr('y2', bloby);
            $(this).attr('cy', bloby);
          }
          else { //remove the blob and wings
            d3.select('#leftwing'+blobId).remove();
            d3.select('#rightwing'+blobId).remove();
            $(this).remove();
            break; //out of for loop I hope
          }
        }
      }
    })

    //now deal with new sample

    //display these values
    if (displayCIs) {
      $cifrom.text(lowerarm.toFixed(2));
      $cito.text(upperarm.toFixed(2));
    }
    else {
      $cifrom.text('-');
      $cito.text('-');
    }
    //just remember the last lowerarm, upperarm for use with displayCIs on off
    lastlowerarm = lowerarm;
    lastupperarm = upperarm;

    //create wings for current sample
    if (showcapture && samplecapturedblob === 'false') {
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'leftwing' + id).attr('x1', rx(lowerarm)).attr('y1', 55).attr('x2', rx(r) ).attr('y2', 55).attr('lowerarm', lowerarm).attr('stroke', 'red').attr('stroke-width', 3).attr('visibility', 'hidden');
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'rightwing' + id).attr('x1', rx(r)).attr('y1', 55).attr('x2', rx(upperarm) ).attr('y2', 55).attr('upperarm', upperarm).attr('stroke', 'red').attr('stroke-width', 3).attr('visibility', 'hidden');

      svgD.append('circle').attr('class', 'rsampleblob').attr('id', 'r' + id).attr('rr', r).attr('cx', rx(r)).attr('cy', 55).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'red').attr('captured', samplecapturedblob).attr('visibility', 'hidden');
    }
    else if (showcapture) {
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'leftwing' + id).attr('x1', rx(lowerarm)).attr('y1', 55).attr('x2', rx(r) ).attr('y2', 55).attr('lowerarm', lowerarm).attr('stroke', darkGreen).attr('stroke-width', 3).attr('visibility', 'hidden');
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'rightwing' + id).attr('x1', rx(r)).attr('y1', 55).attr('x2', rx(upperarm) ).attr('y2', 55).attr('upperarm', upperarm).attr('stroke', darkGreen).attr('stroke-width', 3).attr('visibility', 'hidden');

      svgD.append('circle').attr('class', 'rsampleblob').attr('id', 'r' + id).attr('rr', r).attr('cx', rx(r)).attr('cy', 55).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', darkGreen).attr('captured', samplecapturedblob).attr('visibility', 'hidden');

    }
    else {
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'leftwing' + id).attr('x1', rx(lowerarm)).attr('y1', 55).attr('x2', rx(r) ).attr('y2', 55).attr('lowerarm', lowerarm).attr('stroke', lightGreen).attr('stroke-width', 3).attr('visibility', 'hidden');
      svgD.append('line').attr('class', 'rsamplewing').attr('id', 'rightwing' + id).attr('x1', rx(r)).attr('y1', 55).attr('x2', rx(upperarm) ).attr('y2', 55).attr('upperarm', upperarm).attr('stroke', lightGreen).attr('stroke-width', 3).attr('visibility', 'hidden');

      svgD.append('circle').attr('class', 'rsampleblob').attr('id', 'r' + id).attr('rr', r).attr('cx', rx(r)).attr('cy', 55).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', lightGreen).attr('captured', samplecapturedblob).attr('visibility', 'hidden');
    }
  }

  function addtoheap2(blobId, blobx, rr, bloby, capturedblob) {
    //now look at this blob, compare it with the heap array and decide if to add it or ignore
    
    let barh;
    let f;
    let xpos;
    let found;
    let colour = d3.select('#r'+blobId).attr('fill');

    //get integer position for blob in terms of buckets
    xpos = parseInt(blobx/(2*dropSize))

    //now scan through heap (array of objects) looking for an existing xpos and get current frequency
    f = 0;
    for (let posx = 0; posx < heap.length; posx += 1) {
      if (heap[posx].x === xpos) {
        f = heap[posx].f;
        break;
      }
    }

    //how 'high' is the 'bar' at this point?
    barh = (heightD - 45) - ( (f+1) * 2 * dropSize );

    //if the blob is below the top of bar height
    if (bloby >= barh) {  
      //increase the frequency of the heap at that point      
      f += 1;

      found = false;
      for (let posx = 0; posx < heap.length; posx += 1) {
        if (heap[posx].x === xpos) {
          heap[posx].f += 1;
          found = true;
          break;
        }
      }
      if (!found) {
        heap.push({x: xpos, rr: rr, f: 1, captured: capturedblob, colour: colour});  //add a new entry to heap array
      }
      //add a heap blob, but checked against top of displayable area
      if (barh > 55) {
        //now color according to missed or captured
        svgD.append('circle').attr('class', 'rheap').attr('cx', (xpos * 2*dropSize) + dropSize).attr('cy', barh + 2*dropSize).attr('r', dropSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', colour).attr('captured', capturedblob);
      }

      //remove the drop blob and wings
      d3.select('#leftwing'+blobId).remove();
      d3.select('#rightwing'+blobId).remove();
      d3.select('#r'+blobId).remove();

      return true; //item added to heap and removed from dance
    }
    else {
      return false; //not added to heap
    }
  }
  /*---------------------------------------------------------------------------------------------*/


  /*-------------------Panel 3 Controls ------------------*/

  //clear button
  $clear.on('click', function() {
    stop();
    clear();
  })

  //take one sample
  $takeSample.on('click', function() {
    if (runFreely) stop();
    if (Fhalt) clear();  //Fhalt reset in clear()

    takeSample();

  })

  //run freely
  $runFreely.on('click', function() {
    if (Fhalt) clear();  //Fhalt reset in clear()
    if (!runFreely) {
      start();
    }
    else {
      stop();
    }
  })

  function start() {
    runFreely = true;
    $runFreely.css('background-color', 'red');
    $runFreely.text('Stop');
    //now trigger the TakeSample code
    triggerTakeSample = setInterval(takeSample, speed);
  }

  function stop() {
    runFreely = false;
    $runFreely.css('background-color', 'rgb(148, 243, 148)');
    $runFreely.text('Run Stop');
    //now stop the triggering
    clearInterval(triggerTakeSample);
  }

  //if slider for speed changes
  $speed.on('change', function() {
    speed = parseInt( $('#speed').val() );
    if (runFreely) {
      clearInterval(triggerTakeSample);
      triggerTakeSample = setInterval(takeSample, speed);
    }
    else {
      //don't do anything
    }
  })


  /*---------------------Panel 4 Display Features-------------*/

  $displaypopn.on('change', function() {
    displaypopn = $displaypopn.is(':checked');
    
    displayBackgroundScatters();
    
    if (sampletaken) {
      drawScatterGraph();
    }

    statistics();
    displayStatistics();
  })

  $displayr.on('change', function() {
    displayr = $displayr.is(':checked');
    d3.selectAll('.rtext').remove();
    //dont recreate scatters
    if (sampletaken) {
      drawScatterGraph();
    }
    statistics();
    displayStatistics();
  })

  $displayctm.on('change', function() {
    displayctm = $displayctm.is(':checked');

    //don't recreate scatters
    if (sampletaken) {
      drawScatterGraph();
    }
    statistics();
    displayStatistics();
  })

  $displaymd.on('change', function() {
    displaymd = $displaymd.is(':checked');

    //don't recreate scatters
    drawScatterGraph();
    statistics();
    displayStatistics();
  })


  //------------------Panel 5 Descriptive statistics-----------------------

  $statistics1show.on('change', function() {
    statistics1show = $statistics1show.prop('checked');
    if (statistics1show) {
      $labelx.show();
      $labely.show();
      $statistics1.show();
    }
    else {
      $labelx.hide();
      $labely.hide();
      $statistics1.hide();
    }

  })


  //------------------Panel 6 Display lines--------------------------------

  $displaylines1show.on('change', function() {
    displaylines1show = $displaylines1show.prop('checked');
    if (displaylines1show) {
      $displaylines1.show();
    }
    else {
      $displaylines1.hide();
      $corryx.prop('checked', false);
      corryx = false;
      $corrxy.prop('checked', false);
      corrxy = false;
      $corrlineslope.prop('checked', false);
      corrlineslope = false;

      //don't recreate scatters
      if (sampletaken) {
        drawScatterGraph();
      }
      statistics();
      displayStatistics();      
    }
  })

  $corryx.on('change', function() {
    corryx = $corryx.is(':checked');

    //don't recreate scatters
    if (sampletaken) {
      drawScatterGraph();
    }
    statistics();
    displayStatistics();    
  })

  $corrxy.on('change', function() {
    corrxy = $corrxy.is(':checked');

    //don't recreate scatters
    if (sampletaken) {
      drawScatterGraph();
    }
    statistics();
    displayStatistics();    
  })

  $corrlineslope.on('change', function() {
    corrlineslope = $corrlineslope.is(':checked');

    //don't recreate scatters
    if (sampletaken) {
      drawScatterGraph();
    }
    statistics();
    displayStatistics();    
  })


  //--------------------Panel 7  Dance of the r values-------------------------

  //hide or show the dances panel  
  $danceonoff.on('change', function() {
    danceon = $danceonoff.is(':checked');

    clear();

    if (danceon) {
      $displayD.show();

      $latestsamplesection.show();
      $CIsection.show();
      $capturesection.show();   

    }
    else {

      $displayD.hide();

      $latestsamplesection.hide();
      $CIsection.hide();
      $capturesection.hide();

    }
  })
  

  //-------------------Panel 8 Latest Sample r


  //--------------------Panel 9 Confidence Intervals---------------------

  $displayCIs.on('change', function() {
    displayCIs = $displayCIs.is(':checked');
    displayDance();

    if (displayCIs && sampletaken) {
      $cifrom.text(lastlowerarm.toFixed(2));  //? are these still the latest?
      $cito.text(lastupperarm.toFixed(2));
    }
    else {
      $cifrom.text('-');
      $cito.text('-');
    }
  })

  //Select confidence interval % and alpha
  $ci.on('change', function() {
    alpha = parseFloat($ci.val()); 

    clear();

  });


  //--------------------Panel 10 Display of rho by CIs---------------------

  $displaylinetomarkrho.on('change', function() {
    displaylinetomarkrho = $displaylinetomarkrho.is(':checked');
    if (displaylinetomarkrho) {
      drawrholine();
    }
    else {
      removerholine();

      //turn off capture of rho
      $showcapture.prop('checked', false);
      showcapture = false;

      recolour();
    }

  })

  function drawrholine() {
    removerholine();
    svgD.append('line').attr('class', 'rholine').attr('x1', rx(rs)).attr('y1', 45).attr('x2', rx(rs) ).attr('y2', heightD-40).attr('stroke', 'blue').attr('stroke-width', 2);
    svgD.append('text').text('\u03C1').attr('class', 'rholine').attr('x', rx(rs)).attr('y', heightD - 10).attr('text-anchor', 'start').attr('fill', 'blue').style('font-size', '1.5rem').style('font-weight', 'bold').style('font-style', 'italic');
  }

  function removerholine() {
    d3.selectAll('.rholine').remove();
  }

  $showcapture.on('change', function() {
    if (!displaylinetomarkrho) {  //only if rho line on
      $showcapture.prop('checked', false);
      showcapture = false; 
      return;  
    }
    showcapture = $showcapture.is(':checked');

    if (showcapture) {
      $percentCIcapture.text(percentCaptured.toFixed(2));
    } 
    else {
      $percentCIcapture.text('-');
      //stop();
    }

    recolour();
  })

  $showrheap.on('change', function() {
    showrheap = $showrheap.is(':checked');
    stop();
    clear();

  })

/*-----------------------N1 nudge bars------------------------------------*/
  //#region nudge bars
  //changes to N1
  $N1val.on('change', function() {
    if ( isNaN($N1val.val()) ) {
      N1 = 4;
      $N1val.val(N1.toFixed(0));
      return;
    };
    N1 = parseFloat($N1val.val());
    if (N1 < 4) {
      N1 = 4;
    }
    if (N1 > 300) {
      N1 = 300;
    }
    $N1val.val(N1.toFixed(0));
    updateN1();
  })

  $N1nudgebackward.on('mousedown', function() {
    N1nudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        N1nudgebackward();
      }, delay );
    }, pause)
  })

  $N1nudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function N1nudgebackward() {
    N1 -= 1;
    if (N1 < 4) N1 = 4;
    $N1val.val(N1.toFixed(0));
    updateN1();
  }

  $N1nudgeforward.on('mousedown', function() {
    N1nudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        N1nudgeforward();
      }, delay );
    }, pause)
  })

  $N1nudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function N1nudgeforward() {
    N1 += 1;
    if (N1 > 300) N1 = 300;
    $N1val.val(N1.toFixed(0));
    updateN1();
  }

/*----------------------------------------r nudge bars-----------*/
  //changes to r
  $rval.on('change', function() {
    if ( isNaN($rval.val()) ) {
      rs = 0.5;
      $rval.val(rs.toFixed(2).toString().replace('0.', '.'));
      $calculatedr.text(r.toFixed(2).toString().replace('0.', '.'));
      $latestsample.text(r.toFixed(2).toString().replace('0.', '.'));
      return;
    };
    rs = parseFloat($rval.val());
    if (rs < -1) {
      rs = -1;
    }
    if (rs > 1) {
      rs = 1;
    }
    $rval.val(rs.toFixed(2).toString().replace('0.', '.'));
    $calculatedr.text(r.toFixed(2).toString().replace('0.', '.'));
    $latestsample.text(r.toFixed(2).toString().replace('0.', '.'));
    updater();

  })

  $rnudgebackward.on('mousedown', function() {
    rnudgebackward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        rnudgebackward();
      }, delay );
    }, pause)
  })

  $rnudgebackward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function rnudgebackward() {
    rs -= 0.01;
    if (rs < -1) rs = -1;
    $rval.val(rs.toFixed(2).toString().replace('0.', '.'));
    $calculatedr.text(r.toFixed(2).toString().replace('0.', '.'));
    $latestsample.text(r.toFixed(2).toString().replace('0.', '.'));
    updater();

  }

  $rnudgeforward.on('mousedown', function() {
    rnudgeforward();
    pauseId = setTimeout(function() {
      repeatId = setInterval ( function() {
        rnudgeforward();
      }, delay );
    }, pause)
  })

  $rnudgeforward.on('mouseup', function() {
    clearInterval(repeatId);
    clearTimeout(pauseId);
  })

  function rnudgeforward() {
    rs += 0.01;
    if (rs > 1) rs = 1;
    $rval.val(rs.toFixed(2).toString().replace('0.', '.'));
    $calculatedr.text(r.toFixed(2).toString().replace('0.', '.'));
    $latestsample.text(r.toFixed(2).toString().replace('0.', '.'));
    updater();

  }
//#endregion

  /*---------------------Tooltips on or off-------------------------------------- */

  function setTooltips() {
    Tipped.setDefaultSkin('esci');

    //heading section
    Tipped.create('#logo',          'Version: '+version,                                          { skin: 'red', size: 'versionsize', behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
  
    Tipped.create('#tooltipsonoff', 'Tips on/off, default is off!',                               { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.headingtip',    'https://thenewstatistics.com',                               { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.hometip',       'Click to return to esci Home',                               { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('#distributioncrumb', 'Take samples and see the variation in <em>r</em> from sample to sample', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#tab1text',          'Take samples and see the variation in <em>r</em> from sample to sample', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
  
    //Panel 1 N
    Tipped.create('#N1paneltip',        'Select sample size <em>N</em>, within 4 to 300',         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.N1slidertip',       'Select sample size <em>N</em>, within 4 to 300',         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.N1labeltip',        'Size of sample',                                         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    
    //Panel 2 Data set correlation
    Tipped.create('#rpaneltip',         'Use slider to set &rho;, the correlation in the bivariate normal population', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.rsliderpaneltip',   'Use slider to set &rho;, the correlation in the bivariate normal population',                                      { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.rholabeltip',       'Population correlation, &rho;',                          { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
       
    Tipped.create('#calculatedrdiv',    'Correlation <em>r</em> for displayed sample',            { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //Panel 3 Run controls section
    Tipped.create('#runcontrolsdiv',       'Buttons control sampling',                            { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#clear',                'Clear samples, ready for new run',                    { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#takesample',           'Take one independent random sample',                  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#runfreely',            'Start or stop sampling',                              { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#speed',                'Set sampling speed',                                  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    

    //Panel 4 Display
    Tipped.create('#displaytip',        'Choose what is displayed in the figure',                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.popntip',           'A huge sample to illustrate the bivariate normal population',  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.rtip',              '<em>r</em> for this sample',                             { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.ctmtip',            'Cross through mean of <em>X</em>, mean of <em>Y</em>',   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //Panel 5 Statistics
    Tipped.create('#descstatstip',      'Display mean and SD of <em>X</em> and <em>Y</em> for this sample',  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //Panel 6 Display lines
    Tipped.create('#displaylinestip', 'Choose lines to display',                                  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.yxtip', 'Linear regression of <em>Y</em> against <em>X</em>',                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.slopeyxtip', 'Gradient of this regression line',                              { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.xytip', 'Linear regression of <em>X</em> against <em>Y</em>',                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.slopexytip', 'Gradient of this regression line',                              { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.cltip', 'Line for <em>r</em> = 1.0, or -1.0',                                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.slopecltip', 'Gradient of this line is the geometric mean of the above two gradients, with appropriate sign', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //Panel 7 Dance of r values
    Tipped.create('.dancertip', 'Open lower display area to display the dance of the <em>r</em> values', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //Panel 8 Latest sample r
    Tipped.create('.latestsampletip', '<em>r</em> of latest sample',                              { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //Panel 9 Display CIs
    Tipped.create('.citip', 'Display CIs on <em>r</em> values',                                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.copcnttip', 'Use dropdown to select confidence level',                        { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#CIforr', 'CI on <em>r</em> for latest sample',                                { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //Panel 10 Capture
    Tipped.create('.displaylinetomarkrhotip', 'Display line to mark &rho;',                       { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.showcapturetip', 'Turn on colours to indicate capture, red CIs do not capture &rho;', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.showrheaptip', 'Display heap of <em>r</em> values',                           { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.nosamplestakentip', 'Total number of samples in the current run',              { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.percentCIcapturetip', 'Percent of CIs in current run that capture &rho;',     { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    
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

  //temp ability to change pop size.
  // $('#popsize').on('change', function() {
  //   backgroundN = parseInt($('#popsize').val());
  //   clear();
  // })

})

