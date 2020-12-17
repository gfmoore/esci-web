/*
Program       esci-dances.js
Author        Gordon Moore
Date          15 May 2020
Description   The JavaScript code for ESCI
Licence       GNU General Public LIcence Version 3, 29 June 2007
*/

// #region Version history
/*
0.1.0                 Initial version
0.2.0                 Refactored totally and uses D3.js rather than svgjs. Some jquery used to access the dom in dropping means.
Start using version history now to record changes and fixes
0.2.1     2020-05-18  Sort out sharp point on heap curve - fixed with curve interpolation .curveCardinal - others are available 
0.2.2     2020-05-18  Refix capture colouring and Capture % - couldn't fix how to color the sample red inside - yet
0.2.3     2020-05-18  Put samples taken figure next to captured as well. Also show display correctly.
0.2.4     2020-05-18  Fixed issue with captured% not displaying correctly NaN and no %sign.
0.2.5     2020-05-18  Now fixed issue with filling red or gree by adding a pmissed and smissed attribute to the smean svg circle
                        Also reduced the number of bubbles in the population and made same size as samples
0.2.6     2020-05-18  Fixed memory leak with heap being created all the time, and not calc curve, se lines unless checked
0.2.7     2020-05-19  Fix change in CI% not working on previous samples, recalc percentage captured -can only work on what is visible
0.2.8     2020-05-20  Remove sd lines in the drop area, add new checkboxes for the mean and capture of mu
0.2.9     2020-05-20  Add plus minus population moe line. Toggle a  version dialog box if logo clicked.
0.2.10    2020-05-20  Just made the display a bit smaller, especially the bottom of the dropping means window and allow vertical resize
0.2.11    2020-05-22  It was quite a job. Also needed to change plus minus moe if sample size changes. Refactored the display code, it was a mess. Sortd out capture rates again
0.2.12    2020-05-23  Add rectangle and skew distribution. Also just shifted the tick mark at 100 on the axes slightly left to make it visible
0.3.0
0.3.1     2020-05-29  Resize the display area, change some text sizes and change character names. Try to improve
                      responsiveness od display size, made means smaller and reduced gap.
0.3.2     2020-05-30  Add more samples to fill the curve, adjust the heap display
0.3.3     2020-06-06  Made changes to vertical placement of panels, changed css so that panels aren't
                      controlled by grid and rems (which didn't work). Added a font variable to css
                      Made changes to dropping means and show means buttons so that they "switch properly"
                      Re-factored the display of axes as a function - can now display of no pdf
                      Raised bottom axis, extended mu line and added mu text below axis
0.3.4     2020-06-08  Added SE lines according to population sigma, no heap se. Changes to wording on UI to match original ESCI
0.3.5     2020-06-16  Added extra values for N in dropdown, removed unprogrammed option for any CI% in UI, but added dditional CIs to dropdown
0.3.6     2020-06-17  Issue #3 para 3 Changed the version number div to appear on mouseover.             
0.3.7     2020-06-18  Reinstituted on('click', ) so tablets can dismiss the version number
0.3.8     2020-06-18  Sort out issues of means being too extreme <0 >99 and causing indexing issue. Temporary fix.
0.3.9     2020-06-20  Extreme means now do not join heap, but values do get added to stats
                      Looked at what is stored for a sample mean in relation to ssd. Currently NaN, but changed to 0, not sure if makes a difference, but at least consistent.
0.3.10    2020-06-20  Started preliminary work on tooltips
0.3.11    2020-06-21  Try to sort out skew distribution and touch/mouse to draw. Added a tooltips on off button
                      Can draw, adjust and fill, but haven't got a random sample yet from skew or custom, nor do stats
                      Also changed the auto scale. This means manually scaling the pdf[] values - probably better anyway.
0.3.12    2020-06-22  When popuation curve checked off unset fill random as well
0.3.13    2020-06-22  Not allow custom draw when population unchecked
0.3.14    2020-06-24  Redo and Improve filling the population bubbles. Populationbubbles now used to determine random sampling.
                      Also allow dropping means - todo calculate statistics properly.
0.3.15    2020-06-24  Turned off hover on logo for version number - not working properly
                      Going to try lognormal
0.3.16    2020-06-24  Sort our remembering mu sigma,  adjusted axis and mu line font sizes. 
                      Introduced sampling for custom, something not right about capture rate - Calculated the mean and sd from the popnbubbles array, not the pdf (innacurate). Remember old mean and sigma values when switching distribution
                      Need to clear the heap and graph when changing sigma known/unknown. Reset mean heap when heap checked off.
0.3.17    2020-06-25  lognormal skew (including negative skew) - Can't change mean or sd. Note variable in mean and sd as calculated from bubble array and so random.
0.3.18    2020-06-25  Fixed height plus minus moe line re-instated. 
0.3.19    2020-06-25  Sort out heap curve and check when visible or not.
0.3.20    2020-06-26  Update Curve SE value. Coloured dropping means red if missed popn mean - some slight issues as to where they lie on the heap - discretising a continuous variable!                   
                      Reviewed distribution filling for skew - half a day and can't get it perfect - it's the steep sides.
                      Good thing was that I tested the curve filling property of the centre points of my bubbles - looks good.
0.3.21    2020-06-27  Fixed a bug on fill had commented out w.
0.3.22    2020-06-27  Added favicon code to html
0.3.23    2020-06-27  Fixed some logic. Basically clearAll if Mean Heap turned off or capture of mu, 
0.3.24    2020-06-27  Did some refactoring on clearing and resetting routines.
0.3.25    2020-06-27  Renstate SEines - where did they go?
0.3.26    2020-06-30  Capture of mu to control visibility of mean and MoEs and display of Capture mu stats
0.3.27    2020-06-30  Change colour of heap to match dropping means.
0.3.28    2020-06-30  Let's sort out tablet and phone display. 
                      Also filled normal curve a bit more. 
                      Reset heap modified so that SE Lines cleared properly on Clear.
0.3.29    2020-06-30  The displayPDF section and the curve drawing don't scale. 
0.3.30    2020-07-01  So lots of work on scaling when resized, required sorting out fill population. 
                      Also added 8 conditions for coping with showMoE, capture mu, mu line.
0.3.31    2020-07-01  Implemented logic for issue #7 capture of mu. 
0.3.32    2020-07-03  Force population curve and SE Lines to draw over popn fill bubbles    
                      Changed colour of sd lines, sample stroke.
0.3.33    2020-07-03  Changed scaling factor on sampling distribution curve. Changed height of rectangle in relation to sigma. Note I limit height for small sigma.
                      Adjust checkboxes so that fill and SDlines not appear unless popn curve on.                   
0.3.34    2020-07-03  Issue #17 logic   
0.3.35    2020-07-06  Adjust heap distribution curve, remove fill when changing custom, use - instead of NaN
0.3.36    2020-07-06  Review the falling means to heap logic and check the "red" means fall to the right side. Made sure that no of bins was odd to allow centre bin around mean (50) - uhmm.
0.3.37    2020-07-07  Adjusted the height of normal.This involved qite a lot of re-scaling of normal and of skew. Skew sd now 15 rather than 20.
0.3.38    2020-07-07  Review population curve filling with bubbles. Found some logic control errors. Fill not correct yet
0.3.39    2020-07-08  Fixed bugs and played around with population bubbles quantity, settled for 20 x width for now.
0.3.40    2020-07-08  First stab at Panel 7 Capture of next mean
0.3.41    2020-07-09  Added link back to newstatistics (at bottom) and changed title to esci-web. Dance of the p-values!!!
0.3.42    2020-07-09  Oops forgot to check colours for dance of the p-values and added extra level.
0.3.43    2020-07-10  Various fixes/changes made.
0.3.44    2020-07-11  Fixed bug with sd lines not working when fill on - needed to recalculate mu sigma at different point
                      Other bug fixes
0.3.45    2020-07-11  CI#19 Change in mu, sigma when turning fill on/off for skew, made sure mu sigma displayed as int or to 2dp.
0.3.46    2020-07-11  CI#19 New algorithm for fill population curve (bubbles)
0.3.47    2020-07-11  CI#17 Single sample should now show MoE is CI on. Nit redo fill if no need.
0.3.48    2020-07-11  CI#17 Fixed update fill on change of mu or sigma
0.3.49    2020-07-12  CI#19 Drawing a custom curve too fast doesn't fill - not enough data points
                      Yet another algorithm!
0.3.50    2020-07-12  CI#19 Fixed rectangle fill bug with new fill algorithm
0.3.51    2020-07-12  CI#19 Fixed the fix - one day I might write code that works!
0.3.52    2020-07-12  CI#26 Turn of scroll bars for touchable display
0.3.53    2020-07-12  CI#17 Panel 5 aspects implemented
0.3.54    2020-07-12  CI#25 Increased number of points that makes up heappdf and removed d3 curve interpolation.  
0.3.55    2020-07-12  CI#21 Tried adjustment to select the heap bin for a mean as suggested by GC.
                      There is a slight difference in that occasionally a bin to the right will be selected.
0.3.56    2020-07-13  CI#15 Dance of means adjust intervals and text                     
0.3.57    2020-07-13  CI#17 Revert the Mean heap to Stop Clear Action
0.3.58    2020-07-13  CI#17 Added F flag so that on C alpha change, it stops, reclaculates MoEs, recalculates the heap and recolours.
0.3.59    2020-07-13  CI#17 Reinstate coloured heap when Capture of Mu checked regardless of showMoE. 
0.3.60    2020-07-13  CI#15 italic p, extra space, larger font, SCA on check off.
0.3.61    2020-07-14  CI$20 Added number capturing next mean div and logic
0.3.62    2020-07-14  CI$22 Yet another algorithm for curve filling - and I think it works?
0.3.63    2020-07-14  CI$22 Added more points to skew pdf, but slower, but can't see any fill poking through.
0.3.64    2020-07-15  CI$3  Used a tooltip library - Tipped - to enhance tooltips.
0.3.65    2020-07-17  CI#20 Added fix to magenta capture lines not disappearing at top. - They were looking for already captured mean, so don't display, but still count them.
0.3.66    2020-07-18  CI#15 P value enhancements. Strip out common css for use in future programs
0.3.67    2020-07-18  Dances#22 Tweak for Rectangular to reduce bubbles showing through
0.3.68    2020-07-19  CI#15 Fixed bugs in p values and added delay to popups. CI#22 Another go at Rectangular
0.3.69    2020-07-20  CI#15 Added more control to dance of p values check on. Added a volume control as well. (Seems to be a delay issue in playing sound too fast?)
0.3.70    2020-07-20  CI#22 Fixed bubbles above rectangle - spelling dwawit and drwaIt - doh

0.9.0 Beta  2020-07-22 Beta version
0.9.1       2020-07-23 Edited tooltips, added P value options
0.9.2       2020-07-23 Dances#15 New sound library - Howler - used.
0.9.3       2020-07-23 Tooltip font size increase slightly, looked far too small
0.9.4       2020-07-24 Dances #27 Fixed sizes and bold for axis labels, added Population, fixed rectangular fill - I hope
0.9.5       2020-07-24 Dances #3 Fixed error in tooltips, made tip font and space slightly larger
0.9.6       2020-07-24 Dances #15 Tweaks to p values.
0.9.7       2020-07-24 Dances #27 Added population density text
0.9.8       2020-07-26 Stopped duplicate of sounds for p-values
0.9.9       2020-07-31 Replaced cdn links with direct links to js libraries to make portable
0.9.10      2020-08-02 #28 Allow display of sample stats if showSampleMean and not dropSampleMeans.
0.9.11      2020-08-09 #29 Added breadcrumbs
0.9.12      2020-08-14 #30 Tweaks to display - left margin shifted in a bit etc. 
0.9.13      2020-08-18 #32 Fix to capture of mu exceeding 100% - in recolour() there was additional count?        
0.9.14      2020-08-19 #31 Fix to stop displaying any capture count when dropping means is off.
0.9.14      2020-08-19 #33 Changed breadcrumb to Dances
0.9.15      2020-08-19 #32 Tried again to fix capture count. Added flag to displaySampleAppearance() + clear captureArray[] in resetCaptureStats()
0.9.16      2020-08-19 #32 Dropping mean on or off stops and clear
0.9.17      2020-08-20 #34 Add tooltip to breadcrumbs Home
0.9.18      2020-08-21 #32 Revert changes to inset margin and scale, restore code for recolour
0.9.19      2020-08-24 #35 Dont allow mean heap if p values on + remove hyphen
0.9.20      2020-08-25 #37 Red panel numbers
*/
//#endregion 
/*

1.0.0       2020-09-03 Version 1.0.0

1.1.0  6 Nov 2020 Rationalised into one repository
1.1.1  6 Nov 2020 #6 Remove tip for header, subheader
1.1.2  17 Dec 2020 #15 Tweaks to tips 

*/
let version = '1.1.2';
 
'use strict';

//$(window).load(function () { //doesn't work anyway need to wait for everything to load, not just jquery, though I didn't experience any problems?
$(function() {
  console.log('jQuery here!');  //just to make sure everything is working

  // #region touchable
  //am I on a touchable device? If so probably mobile or touch laptop display for laptop - add a scroll bar
  let deviceType = (('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0)
  ) ? 'touchable' : 'nonTouchable';
 
  if (deviceType === 'touchable') {
    //add a scroll bar to left hand panel?
    //$('#leftpanel').css('overflow-y', 'scroll');
  }
  else {
  }
 
  //#endregion

  //#region for variable definitions (just allows code folding)
  let $muslider;                //muslider
  let $mu;                      //population mean textbox
  let mu = 50;                  //population mean
 
  let normalmu = mu;            //hold original mu sigma as other distriubtions may change them
  let rectmu   = mu;
  let skewmu   = NaN;
  let custommu = NaN

  let $sigmaslider;             //sigmaslider
  let $sigma;                   //population standard deviation textbox
  let sigma = 20;               //population standard deviation

  let normalsigma = sigma;
  let rectsigma   = sigma;
  let skewsigma   = NaN;
  let customsigma = NaN;

  let sepopn;                   //standard error using the population sigma

  let $normal;                  //normal ditribution selected or not
  let normal;
  let $rectangular;             //rectangular ditribution selected or not
  let rectangular;
  let $skew;                    //skew ditribution selected or not
  let skew;
  let $skewAmount;              //amount of skew dropdown list
  let skewAmount;               //amount of skew -1.0 to 1.0 in steps
  let $custom;                  //custom distribution selected or not
  let custom;             

  let $showPopulationCurve;     //Show population curve true or false
  let showPopulationCurve;

  let $showSDLines;             //Show the population sd lines (inc mean line)
  let showSDLines;
  
  let $fillPopulation;          //fill the population distribution with random sample - little bubbles
  let fillPopulation;
  let popnBubbles = [];         //Array for holding population bubbles
  let yb;                       //scale factor for bubbles;
  
  let $clear;                   //the clear button
  let $takeSample;              //take one sample
  let $runFreely;               //toggle for run freely
  let runFreely = false;        //runfreely flag
  let $speed;                   //speed slider mS
  let speed;
  let triggerTakeSample;        //for use in the start stop timer

  let $n;                       //sample size select element
  let n;                        //sample size
  let $N;                       //Number of samples taken span
  let $N2;                      //redisplay N at capture section
  let N = 0                     //Number of samples taken

  let $xbar;                    //Sample mean text span
  let xbar;                     //sample mean;
  let $ssd;                     //sample standard deviation span
  let ssd;                      //sample standard deviation (/(n-1))


  let $ci;                      //the Confidence Interval dropdown
  let alpha;                    //the significance level;  
  let pci = [];                 //the population confidence interval
  let sci = [];                 //the sample ci
  
  let $pmoe;                    //population margin of error span
  let pmoe;                     //population margin of error 
  let $smoe;                    //sample margin of error span
  let smoe;                     //sample margin of error

  let $showSamplePoints;        //show the sample item points - better word for this?
  let showSamplePoints          
  let $showSampleMeans;         //show the sample means
  let showSampleMeans;
  let $dropSampleMeans;         //show the means dropping down - the dance of the samplemeans
  let dropSampleMeans;

  let $showMoe;                 //checkbox for showing margin of error lines
  let showMoe;                  //variable for showing margin of error lines

  let $showPmoe;                //show the population margin of error
  let showPmoe = true;
  let $showSmoe;                //show the sample margin of error
  let showSmoe = false;

  let sampleMeanSize = 4; //5;       //the size of the sample mean blob
  let droppingMeanGap = 14; //18;     //gap between dropping means

  let missedTheMean;            //did the confidence interval capture the mean or miss it?

  let $showMeanHeap;            //show the mean heap
  let showMeanHeap;
  let $showSELines;             //show Standard Error lines
  let showSELines;
  let $showMeanHeapCurve;       //show the mean heap curve
  let showMeanHeapCurve;

  let heap = [];                //a frequency array of heap xbars (sample means)

  let $heapxbar;                //the mean of the heap span
  let heapxbar;                 //the mean of the heap
  let $heapse = 0;              //the standard error of the heap span
  let heapse = 0;               //the standard error of the heap
  let heapN = 0;                //count of items in heap;
  let $noInHeap;                //display the no of items in the heap.
  let heapMax = 0;              //calculate the height of the histogram of the sample mean curve for scaling purposes
  let heapCMax;                 //calculate max of hep curve (pdf)
  let xint;                     //integer version of heap xbar
  let heappdf = [];             //heap curve co-ordinates
  let m;                        //used to abbreviate heap count - 1
  let lineh;                    //line generator for heap curve

  let $captured;                //display the number captured
  let $capturedpercent = '0.0%';  //display the % captured
  let capturedP = 0             //The number captured for the population moe
  let capturedS = 0;            //The number captured for the sample moe


  let xmax;                     //actual width of viewing window - caters for all viewing sections
  let ymaxP;                    //actual height of viewing window for displayPDF
  let ymaxS;                    //actual height of viewing window for displaysample incl. heap


  let margin;                   //margins for viewport
  let width = 0;                //width of viewport after margins applied
  //let oldwidth = 0;             //width before resize;
  let heightP;                  //height of displayPDF viewport after margins applied
  let heightS;                  //height of displaysample viewport after margins applied

  let x;                        //function to scale x
  let yp;                       //function to scale y displaypdf
  let ys;                       //function to scale y displaysample

  let svgP;                     //the d3 reference to the DOM; where the svg drawing is done for the pdf section
  let svgS;                     //the d3 reference to displaysample

  let pdf = []                  //array that holds the data for the pdf
  let oldpdf = [];

  let line                      //the actual line generated for the pdf

  let samples = [];             //the array of samples
  let id = 0;                   //use as an id for all the samplemeans and elements I create
  let idnext = 0;               //for use in capture of next mean

  let ypos;                     //temp variable for y position of a sample mean
  let yposs;
  
  let meanid;                   //used to remove moe wings when at bottom

  
  let $showCaptureMuLine;       //Checkbox for showing the mu line in the dropping mean area
  let showCaptureMuLine;        //variable for mu line on or off

  let $captureOfMu;             //checkbox for capture of mu visible (i.e. mean is red)
  let captureOfMu;              //variable for showing mean is red;

  let $plusminusmoe;            //markers for population moe around mean (on sample drop dpwn area)
  let plusminusmoe;             //variable for $plusminusmoe

  let capturedArray = [];       //record all items as captured or not [{captured: true, xbar: xbar, sse: sse, pmoe: pmoe, smoe: smoe, alpha: alpha}]

  let dropLimit = 40;            //where the bottom axis is and fro detrmining when to "disappear" a dropping mean


  let mblob;                    //used for representing the smean svg blob in display
  let pwing;                    //used for representing the pmoe wings in display
  let swing;                    //used for representing the smoe wings in display
  let blobId;                   //used to get the id of a svg mean blob

  let bubbleX;
  let bubbleY;

  let $captureNextMean;         //The number capturing the next mean
  let captureNextMean;          //

  let xAxis;
  let xAxisB;

  let heapIndex;                //an index into the heap frequency table
  let heapIndexFreq;            //the frequency of the heap at the index

  let letDrop;                  //to control whether the samplemean can drop or be removed (and added to the heap)
  let hght = 0;                 //height of plus minus moe bars

  let tooltipText;              //text for the tooltip
  let $tooltipsonoff;           //tooltips on off button
  let tooltipsonoff = false;    //flag for tool tips

  let position;                 //hold the position of the cursor

  let custompdf = [];           //hold the values of the custom curve



  let changedDistribution = true; //to indicate if there was a change in distribution

  let xbardata = [];            //temp record of xbars for the heap to check of continuous calculations actually working

  let $curveHeapSE;             //the textbox for the heap curve SE value;

  let lightGreen = 'lawngreen';
  let darkGreen = '#00DF00';

  let pdfDisplayAreaHeight = 250;  //250 is just some number that seems to be reasonable for the pdf y height

  let rightclick = false;                   //mouse control
  let drawingPDF = false;                   //mouse control
  let oldxm, oldym, xm, ym, mdown = false;  //mouse control

  let oldxbar = 0;               //used for capture of next mean calculation
  let oldpmoe = 0;
  let oldsmoe = 0;

  let $noofnextmeans;             //number of next means div (one less than number of samples)
  let $nocapturingnextmean;       //capture of next mean panel
  let $pccapturingnextmean;
  let nocapturingnextmeanP = 0;
  let nocapturingnextmeanS = 0;


  let $pvalue;                    //show the pvalues dance
  let pvalue;

  let $pvaluesound;               //p-value sounds
  let pvaluesound;

  let volume = 0.1;               //volume for dance of the p values

  let z, t, pvz;                  //p-value calculations

  let audiolow;      
  let audiolowmiddle; 
  let audiomiddle;    
  let audiomiddlehigh;
  let audiohigh;       


  let nobuckets;                   //the accurate value for number of buckets as a decimal
  
  let Fhalt = false;                //used to Fhalt operation in Stop Clear Action now F flag

  let previousmeanexists;

  let mu0 = 50;
  let cohensd = 0;
  //#endregion

  //breadcrumbs
  $('#homecrumb').on('click', function() {
    window.location.href = "https://www.esci.thenewstatistics.com/";
  })

  initialise();

//TESTING
  //#region TESTING Set some checkboxes for when testing. 
    // $showMoe.prop('checked', true);
    // showMoe = true;

   // $showSDLines.prop('checked', true);  
    // showSDLines = true;
    // drawSDLines();

    // $speed.val(0);
    // speed = 0;

    // $('#samplesselected option[value=2]').prop('selected', true);
    // n = parseInt( $('#samplesselected option:selected').val() );

    // $captureNextMean.prop('checked', true);
    // captureNextMean = true;
    // $('#capturenextmeangrid').show();

    // $pvalue.prop('checked', true);
    // pvalue = true;
    // $('#pvaluesoundblock').show();
    // $('#pvaluehypothesisblock').show();

  //#endregion

  function initialise() {

    setTooltips();

    $('#mainheading').text('esci web'); //was D3
    $('#subheading').text('dances'); //was D3

    getInterfaceElements()     //get the jquery references to items on the user interface
    getInterfaceValues();      //get current values of all checkboxes, radio-buttons and text-boxes etc.

    //#region Initial setup of checkboxes
    $showPopulationCurve.prop('checked', true);
    showPopulationCurve = true;

    $fillPopulation.prop('checked', true);    
    fillPopulation = true;

    $showSamplePoints.prop('checked', true);
    showSamplePoints = true;

    $showSampleMeans.prop('checked', true);
    showSampleMeans = true;
    
    $dropSampleMeans.prop('checked', true);
    dropSampleMeans = true;

    $showMeanHeap.prop('checked', true);
    showMeanHeap = true;

    $showCaptureMuLine.prop('checked', true);
    showCaptureMuLine = true;


    $('#capturenextmeangrid').hide();
    $('#pvaluesoundblock').hide();
    $('#pvaluehypothesisblock').hide();

    //#endregion    

    setDisplay();              //set up initial display and items (which responds to screen resizes)

    //if (showPopulationCurve) drawPopulationCurve();  //includes call to drawPDF and fillPopnBubbles

    audiolow        = new Howl({src: ['./audio/wav/trom1.wav'],    preload: true});
    audiolowmiddle  = new Howl({src: ['./audio/wav/trom2.wav'],    preload: true});
    audiomiddle     = new Howl({src: ['./audio/wav/clarry1.wav'],  preload: true});
    audiomiddlehigh = new Howl({src: ['./audio/wav/clarry2.wav'],  preload: true});
    audiohigh       = new Howl({src: ['./audio/wav/trumpet1.wav'], preload: true});

    Howler.volume(volume);

  }

  function setDisplay() {//what to do if browser resize occurs or on start

    //responsive height
    let displaysectionht = $(window).height() -0;  //causes issues was 50
    let controlht = $('#leftpanel').height();
    if ( displaysectionht > controlht ) $('#displaysection').height(controlht);
    else $('#displaysection').height( displaysectionht -10);  


    // set the dimensions and margins of the pdf graph area
    //xmax  = $('#displaypdf').width();       //width of viewing window for displayPDF and displaysample
    //try this work around. It looks like $().width is not working properly on narrowing the browser, async problem?
    //oldwidth = width;
    xmax = window.innerWidth - $('#leftpanel').width() - 28;

    let sectionwidth = $('#displaysection').css('max-width');
    sectionwidth = sectionwidth.substring( 0, sectionwidth.indexOf( "px" ) );
    sectionwidth = parseInt(sectionwidth);

    if (xmax > sectionwidth) xmax = sectionwidth;
    ymaxP = $('#displaypdf').height(); //-50;      //height of viewing window

    ymaxS = $('#displaysection').height() - ymaxP;

    //what margin do we want - not used,but the "standard" way of doing things 
    margin = {top: 0, right: 0, bottom: 0, left: 5};  //pixels
    width = xmax - margin.left - margin.right;
    heightP = ymaxP - margin.top - margin.bottom;
    heightS = ymaxS - margin.top - margin.bottom;

    //set a reference to the displaypdf area
    d3.selectAll('svg > *').remove();  //remove all elements under svgP
    $('svg').remove();                 //remove the all svg elements from the DOM

    svgP = d3.select('#displaypdf')     //ref to displayPDF
            .append('svg')
            .attr('width', width).attr('height', heightP);    

    //set a reference to the displaysample area
    svgS = d3.select('#displaysample')  //ref to displaySample
            .append('svg')
            .attr('width', width).attr('height', heightS);  

    svgM = d3.select('#middlesection')
            .append('svg')
            .attr('width', width).attr('height', heightS);  

    //set up scales for displaypdf and displaysample
    x  = d3.scaleLinear().domain([ 0, 100 ]).range([5, width]);  //common to both viewports
    yp = d3.scaleLinear().domain([ 0, d3.max(pdf, function(d) { return d.y}) ]).range([heightP, 10]);

    ys = d3.scaleLinear().domain([ 0, 500 ]).range([0, heightS]);  //go from y = 500 at bottom to 0 at top, beacuse samplemeans increase as they drop!

    drawAxes();
    clearAll();
  }

  function drawAxes() {
    //setup axes at top and bottom
    xAxis = d3.axisTop(x);	
    xAxisB = d3.axisBottom(x);

    //display axes
    //top  //note style for both should be the same, but for the top it didn't look right
    svgP.append('g').attr('class', 'axisx').attr( 'transform', 'translate(0, 22)' ).style('font', '1.55rem sans-serif').style('font-weight', 'bold').call(xAxis);
    svgP.append('text').text('Population').attr('class', 'pdfdisplaytext').style('font', '2.0rem sans-serif').style('font-weight', 'bold').style('fill', 'blue').attr('x', 70).attr('y', 50);
    //svgP.append('text').text('X').attr('class', 'pdfdisplaytext').style('font', '1.8rem sans-serif').style('fill', 'black').attr('x', width/2 - 40).attr('y', 15).style('font-weight', 'bold').style('font-style', 'italic');
    svgP.append('text').text('X').attr('class', 'pdfdisplaytext').style('font', '1.8rem sans-serif').style('fill', 'black').attr('x', x(46)).attr('y', 15).style('font-weight', 'bold').style('font-style', 'italic');

    //display axis label 
    svgP.append('text').text('Probability density').attr('class', 'pdfdisplaytext').style('font', '1.4rem sans-serif').style('fill', 'black').attr('x', 17).attr('y', 150).attr('transform', 'rotate(-90 17 150)');


    //bottom
    svgS.append('g').attr('class', 'axisx').attr( 'transform', `translate(0, ${heightS - dropLimit} )` ).style('font', '1.5rem sans-serif').style('font-weight', 'bold').call(xAxisB);
    //svgS.append('text').text('X').attr('class', 'pdfdisplaytext').style('font', '1.8rem sans-serif').style('fill', 'black').attr('x', width/2 - 40).attr('y', heightS - 22).style('font-weight', 'bold').style('font-style', 'italic');
    svgS.append('text').text('X').attr('class', 'pdfdisplaytext').style('font', '1.8rem sans-serif').style('fill', 'black').attr('x', x(46)).attr('y', heightS - 22).style('font-weight', 'bold').style('font-style', 'italic');

    
    //just draw a vertical line    //svgP.append('g').attr('class', 'axis y').attr('transform', 'translate(10,20)').call(yAxis);
    svgP.append('line').attr('class', 'axisline').attr('x1', 5).attr('y1', 25).attr('x2', 5).attr('y2', heightP );

    //draw a horizontal line under the curve on the sample display section
    svgS.append('line').attr('class', 'horizline').attr('x1', 5).attr('y1', ys(0)).attr('x2', xmax-5).attr('y2', ys(0)). attr('stroke', 'gray').attr('stroke-width', '2');

    //adjust the 100 tick text 2px left. jQuery cannot access the svg contents. SVG DOM is different to HTML DOM Use set/getAttributeNS
    document.getElementsByClassName("tick")[10].children[0].setAttributeNS(null, 'transform', `translate(${-2},0)`);
    document.getElementsByClassName("tick")[21].children[0].setAttributeNS(null, 'transform', `translate(${-2},0)`);
    //move the text 5 pixels left
    document.getElementsByClassName("tick")[10].children[1].setAttributeNS(null, 'transform', `translate(${-15},0)`);
    document.getElementsByClassName("tick")[21].children[1].setAttributeNS(null, 'transform', `translate(${-15},0)`);
  }

  //clear button
  $clear.on('click', function() {
    stop();
    clearAll();
  })

  //clear everything.
  function clearAll() {
    Fhalt = false;

    //remove sample points from DOM
    d3.selectAll('.samplepoint').remove();
    
    resetSamples();
    resetCaptureStats();
    resetHeap();    

    if (custom) removeSDLines();  //because no pdf yet

    oldxbar = 0;
    oldpmoe = 0;
    oldsmoe = 0;

    clearCapturelines();
    resetNumberCapturingNextMean();
    clearpvalues();  
    displayCohend();

    drawPopulationCurve();  //includes redrawing of mean and sd lines and fill
  }


  /*---------------------------------------------Draw Population---------------------------------------*/
  //draw the population curve
  function drawPopulationCurve() {

    d3.selectAll('.pdf').remove();
    removePopnBubbles();
    
    if (showPopulationCurve) {
      if (normal)       drawNormalCurve();
      if (rectangular)  drawRectangularCurve();
      if (skew)         drawSkewCurve();
      if (custom)       drawCustomCurve();
    }
  }

  //remove the population curve
  function removePopulationCurve() {
    //removing population curve and remove sd lines as well and turn off the sd line checkboxove
    removePDF();
    removeSDLines();
    $showSDLines.prop('checked', false);
    showSDLines = false;
    $pmoe.text(0); //don't display population MoE
  }

  //create my probability density function pdf
  //how many points for the curve? As this will be used in creating bubbles and random samples except for normal where we have functions 
  function drawNormalCurve() {
    pdf = [];

    enableMuSigmaSliders();

    //reinstate original mu sigma only if coming from another distribution
    if (changedDistribution) {
      setMuSigmaSliderVal(normalmu, normalsigma);
      mu = normalmu;
      sigma = normalsigma;
    }

    //get the curve
    for (let x = 0; x < 100; x += 0.1) {
      pdf.push({ x: x, y: jStat.normal.pdf(x, mu, sigma) })
    }

    //scale it to fit in with drawing area
    let p = pdfDisplayAreaHeight; //shorthand :)
    let mh = d3.max(pdf, function(d) { return d.y});
    pdf.forEach(function(v) {
      if (sigma >= 20) {
        //0.02 is maxheight when sigma = 20
         v.y = v.y * p / 0.02 * 0.7;
      }    
      else {  //* some scale factor
        //0.08 is max height when sigma = 5
        v.y = (v.y * p / mh * 0.95) * (1.0877 - 0.0125 * sigma);
      }    

    })

    drawPDF();
  }

  function drawRectangularCurve() {
    let l, r, c, t;
    let rise = false;
    let fall = false;

    enableMuSigmaSliders();

    pdf = [];

    if (changedDistribution) {
      setMuSigmaSliderVal(rectmu, rectsigma);
      mu = rectmu;
      sigma = rectsigma;
    }

    l = mu-sigma * Math.sqrt(3);
    r = mu+sigma * Math.sqrt(3);

    c = 10 * heightP / sigma;
    if (c > heightP) c = heightP;
    c = c / heightP * pdfDisplayAreaHeight;



    for (let x = 0; x < 100; x += 0.1) { 

      if (x <= l) pdf.push( {x: x, y: 0} ); 

      if (x >= l && x <= r) {
        if (!rise) {
          pdf.push( {x: x-0.1, y: c} ); 
          rise = true;
        }
        pdf.push( {x: x, y: c} );
      }

      if (x >= r ) {
        if (!fall) {
          pdf.push( {x: x, y: c} );
          fall = true; 
        }
        pdf.push( {x: x, y: 0} );
      }
    }  


    drawPDF();
  }

  function drawSkewCurve() {
    pdf = [];

    disableMuSigmaSliders();

    skewAmount = parseFloat($skewAmount.val());

    if (changedDistribution) {
      setMuSigmaSliderVal(skewmu, skewsigma);
      mu = skewmu;
      sigma = skewsigma;
    }

    //lognormal version
    let k = Math.abs(skewAmount);
    for (let x = -5; x < 10; x += 0.002) {
      pdf.push( {x: x, y: jStat.lognormal.pdf(x, 0, k) } );
    }

    //scale it up
    pdf.forEach( v => {
      if (k === 0.1) {
        v.x = v.x*154.0 - 104;
        v.y = v.y * 45; 
      }
      if (k === 0.2) {
        v.x = v.x*76.0 - 27.0;
        v.y = v.y * 95; 
      }
      if (k === 0.3) {
        v.x = v.x*50.0 - 1.5;
        v.y = v.y * 145; 
      }
      if (k === 0.4) {
        v.x = v.x*38.0 + 10.0;
        v.y = v.y * 200; 
      }
      if (k === 0.5) {
        v.x = v.x*30.0 + 17.5;
        v.y = v.y * 260; 
      }
      if (k === 0.6) {
        v.x = v.x*25.0 + 22.0;
        v.y = v.y * 280; 
      }
      if (k === 0.7) {
        v.x = v.x*22.0 + 25.0;
        v.y = v.y * 310; 
      }
      if (k === 0.8) {
        v.x = v.x*20.0 + 27.0;
        v.y = v.y * 330; 
      }
      if (k === 0.9) {
        v.x = v.x*19.0 + 28.0;
        v.y = v.y * 350; 
      }
      if (k === 1.0) {
        v.x = v.x*15.5 +32.5;
        v.y = v.y * 370; 
      }

      //get the negative version, of course this reverses the array so largest x values at start, need to put back in order otherwise bubble won't work
      if (skewAmount < 0) {
        v.x = 100 - v.x;
      }
    })



    let temp = [];
    //think I'll remove any negative x values
    for (let i = pdf.length - 1; i >= 0; i--) {
      if (pdf[i].x < 1 || pdf[i].x > 100) {   //anything else is too small! If I use 0 it appears on the display
        pdf.splice(i, 1);
      }
      else {
        if (skewAmount < 0) {  //reverse the array if negative skew
          temp.push(pdf[i]);
        } 
      }
    }    
    if (skewAmount < 0) pdf = temp; 

    //need a random array of bubbles for calculating means and sds
    //calculateMuSigma();

    drawPDF();
  }

  
  function drawCustomCurve() {
    //#region draw the custom curve

    disableMuSigmaSliders();

    if (changedDistribution) {
      setMuSigmaSliderVal(custommu, customsigma);
      mu = custommu;
      sigma = customsigma;
    }

    //is there still a custompdf, if so copy the oldpdf to pdf
    if (custompdf.length !== 0) {
      pdf = [];
      oldpdf.forEach( function(v) {
        pdf.push({ x: v.x, y: v.y }); 
      })
      
    }
    else {
      pdf = [];
    }

    if (custompdf.length !== 0) drawPDF();
  }


  //if mousedown on displaypdf area and custom selected allow draw

  $('#displaypdf')
//MOUSEDOWN  
    .mousedown(function(e) {
      if (!custom) return;
      drawingPDF = true;
      e.preventDefault();
      //probably best to clear everything (from ClearAll)
      d3.selectAll('.samplepoint').remove();
    
      resetSamples();
      resetCaptureStats();
      resetHeap();   

      removePopnBubbles();
      removeSDLines();
      custommu = NaN;
      customsigma = NaN;
      setMuSigmaSliderVal(custommu, customsigma);

      if (!showPopulationCurve) return;  //can only draw custom curve if popuation checked
      if (!custom) return;               //and when custom selected
      custompdf = [];                   //record the pixels, will scale to pdf later
      oldpdf = [];
      d3.selectAll('.pdf').remove();
      if (event.which === 1) { //left click
        mdown = true;

        oldxm = e.pageX - $(this).offset().left;
        oldym = e.pageY - $(this).offset().top;

        custompdf.push({ x:oldxm , y: heightP }) //starting point, in pixels
        custompdf.push( {x: oldxm, y: oldym} ); //get first mouse point

        svgP.append('line').attr('class', 'custompdf')  //draw the first vertical line
        .attr('x1', oldxm).attr('y1', heightS).attr('x2', oldxm).attr('y2', oldym)
        .attr('stroke', 'red').attr('stroke-width', 2);
      }
      //right click
//RIGHT MOUSE
      if (e.which === 3) { 
        e.preventDefault();
        e.stopPropagation();
        d3.selectAll('.custompdf').remove();
        custompdf = [];
        oldpdf = [];
        removePopnBubbles();
        removeSDLines();
        rightclick = true;
        custommu = NaN;
        customsigma = NaN;
        setMuSigmaSliderVal(custommu, customsigma);
      }
    })
//MOUSE UP
    .mouseup(function(e) {
      //don't trigger this on right click
      if (rightclick) {
        rightclick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (!showPopulationCurve) return;
      if (!custom) return;
      mdown = false;
      
      custompdf.push({ x:oldxm , y:heightP }) //ending point
      d3.selectAll('.custompdf').remove();

      //need to scale the custompdf which is in pixels say, 0->width, heightP->0 to the pdf which is say 0->100 and 0->250
      //note might not be that many pixels in custom - will this be a problem?
      //note there are margins to take into account
      pdf = [];
      let p = pdfDisplayAreaHeight + 21; //just shorthand + adjustment
      custompdf.forEach( function(v) {
        pdf.push({ x: v.x * 100 / width - 0.5, y: p - v.y/heightP  * p}); 
        oldpdf.push({ x: v.x * 100 / width - 0.5, y: p - v.y/heightP * p}); //make a backup for redraw purposes if shape is changed (i.e. Normal, Rect, Skew)
      })
      
      //to do means and mu sigma etc create the bubbles array, but not display it unless fill population enabled
      if (custompdf.length !== 0) calculateMuSigma();  //this creates bubbles, but not draw them

      changedDistribution = true;
      drawCustomCurve();  //now draw it and get values from it

      drawingPDF = false;
    })
//MOUSE MOVE
  $('#displaypdf').mousemove(function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!custom) return;

    let y, m;
    
    //if mouse moving outide of displaypdf stop it selecting axis labels etc.

    if (custom && mdown) {

      xm = e.pageX - $(this).offset().left;
      if (xm < oldxm) xm = oldxm; //can't go backwards
      ym = e.pageY - $(this).offset().top;

      //draw lines between the points, but not let x go backwards
      svgP.append('line').attr('class', 'custompdf')
        .attr('x1', oldxm).attr('y1', oldym).attr('x2', xm).attr('y2', ym)
        .attr('stroke', 'red').attr('stroke-width', 2);

      //It is possible that the user draws so fast that there are only a few point in the pdf which causes issues in fill
      //population. So need to add additional points (interpolate) if difference between xm and oldxm is too big
      //I hope it keeps up

      if (xm >= oldxm) {//can't go backwards
        m = (ym-oldym)/(xm-oldxm);
        for (let x = oldxm; x < xm; x +=1 ) {
          //linearly interpolate between two points
          y = m * x + (oldym - (m * oldxm));
          custompdf.push( {x: x, y: y} );
        }
        oldxm = xm;  
        oldym = ym;
      }

      //if mouse goes outside population display area call mouseup  //note cannot manually position mouse
      if ((xm < 2) || (xm > width - 2) || (ym < 15) || (ym > heightP - 4)) {
        $('#displaypdf').trigger("mouseup");
      }
    }
  })

  //stop right click contextmenu firing wehn drawing custom pdf
  $('#displaypdf').bind("contextmenu",function(e){
    return false;
  });


  //prevent mouse moves selecting items
  $('#displaysection').on('mousedown', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!drawingPDF) return;
  })
  
  $('#displaysection').on('mousemove', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!drawingPDF) return;
    //if mouse goes outside displaypdf too fast then displaypdf mousemove doesn't catch it so put it here as well (hack)
    xm = e.pageX - $(this).offset().left;
    ym = e.pageY - $(this).offset().top;
    if ((xm < 2) || (xm > width) || (ym < 15) || (ym > heightP)) {
      $('#displaypdf').trigger("mouseup");
    }
  })

  //#endregion


  function calculateMuSigma() {

    if (popnBubbles.length === 0) return; 

    let s = 0, n = 0, s2 = 0;
    popnBubbles.forEach( v => {
      s += v.x;
      s2 += v.x * v.x;
      n += 1;
    })

    mu = s/n;
    sigma = Math.sqrt(s2/n - mu*mu);

    //display the values
    setMuSigmaSliderVal(mu, sigma);
  }

  function setMuSigmaSliderVal(mu, sigma) {
    if (isNaN(mu)) {
      $mu.val(' -');
      $muslider.val(0);
    }
    else {
      if (normal || rectangular) {
        $mu.val(mu.toFixed(0));
        $muslider.val(mu.toFixed(0));
      }
      if (skew || custom) {
        $mu.val(mu.toFixed(2));
        $muslider.val(mu.toFixed(2));
      }
    }

    if (isNaN(sigma)) {
      $sigma.val(' -');
      $sigmaslider.val(0);
    }
    else {
      if (normal || rectangular) {
        $sigma.val(sigma.toFixed(0));
        $sigmaslider.val(sigma.toFixed(0));
      }
      if (custom || skew) {
        $sigma.val(sigma.toFixed(2));
        $sigmaslider.val(sigma.toFixed(2));
      }
    }

  }

  function enableMuSigmaSliders() {
    $muslider.prop( "disabled", false );
    $mu.prop( "disabled", false );
    $sigmaslider.prop( "disabled", false );
    $sigma.prop( "disabled", false );
  }

  function disableMuSigmaSliders() {
    $muslider.prop( "disabled", true );
    $mu.prop( "disabled", true );
    $sigmaslider.prop( "disabled", true );
    $sigma.prop( "disabled", true );
  }


  function drawPDF() {

    ypp = d3.scaleLinear().domain([ 0, pdfDisplayAreaHeight ]).range([heightP, 20]);  //the 20 allows for the top axis

    //create a generator
    line = d3.line()
    .x(function(d, i) { return x(d.x); })
    .y(function(d, i) { return ypp(d.y); });


    //draw popn bubbles if checked
    if ((normal || rectangular) && fillPopulation) {
      if (changedDistribution) {
        fillPopnBubbles(); //fill the popnBubbles array
        //drawPopnBubbles();
        changedDistribution = false;
      }
      if (fillPopulation) drawPopnBubbles();
    }

    if (skew || custom) {
      //do I do a recalc?
      if (changedDistribution) {
        fillPopnBubbles();
        calculateMuSigma();
        changedDistribution = false;
      }
      if (fillPopulation) drawPopnBubbles();
    }

    //display the curve
    svgP.append('path')
      .attr('class', 'pdf')
      .attr('d', line(pdf))


    if (showSDLines) drawSDLines();  //only draw sd lines for custom if there is a pdf to draw
    else removeSDLines();   

    //when switching distributions especially on custom
    if (showCaptureMuLine) drawMuLine(); else removeMuLine();
    if (pvalue) drawMu0Line(); else removeMu0Line();
    if (plusminusmoe) drawPlusMinusMoe(); 

    //I know mu and sigma so I know pmoe
    pmoe = jStat.normal.inv( 1-alpha/2.0, 0, 1 ) * sigma/Math.sqrt(n);
    if (showPopulationCurve) $pmoe.text(pmoe.toFixed(2));
  }

  function removePDF() {
    d3.selectAll('.pdf').remove();
  }

  //draw the mean and sd lines
  function drawSDLines() {
    //remove sd lines first then redraw
    removeSDLines();

    //get the correct mu and sigma?


    //line styles in css eg style('stroke', 'gray').style('stroke-width', 2)
    svgP.append('line').attr('class', 'meanlines').attr('x1', x(mu)).attr('y1', 25).attr('x2', x(mu)).attr('y2', heightP -5);

    //sd lines
    svgP.append('line').attr('class', 'sdlines').attr('x1', x(mu-3*sigma)).attr('y1', 25).attr('x2', x(mu-3*sigma)).attr('y2', heightP -2);
    svgP.append('line').attr('class', 'sdlines').attr('x1', x(mu-2*sigma)).attr('y1', 25).attr('x2', x(mu-2*sigma)).attr('y2', heightP -2);
    svgP.append('line').attr('class', 'sdlines').attr('x1', x(mu-sigma)).attr('y1', 25).attr('x2', x(mu-sigma)).attr('y2', heightP -2);
    svgP.append('line').attr('class', 'sdlines').attr('x1', x(mu+sigma)).attr('y1', 25).attr('x2', x(mu+sigma)).attr('y2', heightP -2);
    svgP.append('line').attr('class', 'sdlines').attr('x1', x(mu+2*sigma)).attr('y1', 25).attr('x2', x(mu+2*sigma)).attr('y2', heightP -2);
    svgP.append('line').attr('class', 'sdlines').attr('x1', x(mu+3*sigma)).attr('y1', 25).attr('x2', x(mu+3*sigma)).attr('y2', heightP -2);
  }

  //remove the mean and sd lines
  function removeSDLines() {
    d3.selectAll('.meanlines').remove();
    d3.selectAll('.sdlines').remove();
  }

  function drawMuLine() {
    removeMuLine(); //remove any previous one
    if (!isNaN(mu)) {
      svgS.append('line').attr('class', 'muline').attr('x1', x(mu)).attr('y1', 25).attr('x2', x(mu)).attr('y2', heightS-dropLimit);  
      svgS.append('text').text('\u00B5').attr('class', 'mutext').attr('x', x(mu)-4).attr('y', heightS-6);
    }
  }

  function removeMuLine() {
    d3.selectAll('.muline').remove();
    d3.selectAll('.mutext').remove();
  }

  function drawMu0Line() {
    removeMu0Line(); //remove any previous one
    if (!isNaN(mu0)) {
      svgS.append('line').attr('class', 'mu0line').attr('x1', x(mu0)).attr('y1', 25).attr('x2', x(mu0)).attr('y2', heightS-dropLimit);  
      svgS.append('text').text('\u00B5'+'0').attr('class', 'mu0text').attr('x', x(mu0)-4).attr('y', heightS-6);
    }
  }

  function removeMu0Line() {
    d3.selectAll('.mu0line').remove();
    d3.selectAll('.mu0text').remove();
  }

 
  function fillPopnBubbles() {
    //fill the distribution curve with sample bubbles
    let ah;   
    let minxpdf, maxxpdf;
    let minypdf, maxypdf;
    let minx, maxx, miny, maxy;

    //create data points
    popnBubbles = [];

    if (normal || skew || custom) {
      minxpdf = d3.min(pdf, function(d) { return d.x });
      maxxpdf = d3.max(pdf, function(d) { return d.x });
      minypdf = d3.min(pdf, function(d) { return d.y });
      maxypdf = d3.max(pdf, function(d) { return d.y });
    }

    if (rectangular) {
      minxpdf = mu - sigma * Math.sqrt(3);
      maxxpdf = mu + sigma * Math.sqrt(3);

      minypdf = 0;
      //maxypdf = 10 * heightP / sigma; //why this?
      maxypdf = d3.max(pdf, function(d) { return d.y });
      if (maxypdf > pdfDisplayAreaHeight) maxypdf = pdfDisplayAreaHeight;
    }

    //create array of bubbles, not all may be drawn, but array will be used for random sampling (except for normal)
    for (let b = 0; b < width * 20; b += 1) {   //this many bubbles, depends on display width width * 1
      //get a random x between min and max x of pdf
      bubbleX = randbetween(minxpdf, maxxpdf);

      //scan through pdf looking for nearest x coordinate 
      if (true) { 
        ah = 0;
        for (let v = 0; v < pdf.length; v += 1) { 
          if (pdf[v].x > bubbleX) { //found one
            if (v !== 0) { 
              //linear interpolation
              minx = pdf[v-1].x;
              maxx = pdf[v].x;
              miny = pdf[v-1].y;
              maxy = pdf[v].y;
              ah = miny + (bubbleX - minx)/(maxx-minx) * (maxy - miny); //linear interpolation between two ordinates - best I can do?, splines least squares?
              break;
            }
          }
        }  
      }
    
      //pick a random n bewtween 0 and (~heightP in pdf coords, not pixels). If it is < ah then we have a bubble - its a probability! If the curve is close to the bottom there is less probability of filling it with a bubble, if it is higher then more probability!
      bubbleY = randbetween(0, pdfDisplayAreaHeight );

      if (bubbleY < ah) {  //less than curve height, should it be <= ?
        popnBubbles.push({ x: bubbleX, y: bubbleY });
      }
    }
  }

  function drawPopnBubbles() {
    let y = d3.scaleLinear().domain([ 0, pdfDisplayAreaHeight ]).range([heightP, 20]);
    let drawit = true;
    let s2 = (sampleMeanSize) * (sampleMeanSize); 
    let d2;
    let bx, by, px, py;
    let l = 0, r = 0;
    let recth = heightP;


    //find where pdf ceases to be 0 from left and where it is 0 to the right for the vertical lines.
    if (custom || rectangular) {
      for (let p = 0; p < pdf.length; p += 1) {  //start at left
        px = x(pdf[p].x);
        py = y(pdf[p].y);
        if (py < heightP - 5) {  //just make sure???
          l = px;
          break;
        }
      }
      for (let p = pdf.length - 1; p >= 0 ; p -= 1) {  //start at right
        px = x(pdf[p].x);
        py = y(pdf[p].y);
        if (py < heightP - 5) {
          r = px;
          recth = py; //should be the height of the rectangle (in pixels so from 0 at the top down)
          break;
        }
      }
    }      
    

    //Main routine - basic idea. For every bubble, go through the entire pdf looking to see if any coordinate is inside the bubble by ytahgoras' theorem
    //this could conceivably take a long long tiem,but is not!!! guaranteed to work!
    //Have to do it in pixels as using real just doesn't work.
    for (let b = 0; b < popnBubbles.length; b += 1) {
      drawit = true; // draw it unless we have reason not to

      bx = x(popnBubbles[b].x);
      by = y(popnBubbles[b].y);

      if (normal || skew || custom) {
        for (let p = 0; p < pdf.length; p += 1) {

          px = x(pdf[p].x);
          py = y(pdf[p].y);
          d2 = ((bx - px) * (bx - px)) + ((by - py) * (by - py));

          if (d2 <= s2) {  //inside bubble 
            drawit = false;
            break; //we're done
          } 
        }
        //break to here
      }

      //sort out left and right bubbles on either side of vertical. Tweak of 1 pixel
      if (custom || rectangular) {        
        if (bx < l + sampleMeanSize) drawit = false;
        if (bx > r - sampleMeanSize) drawit = false;
      }

      //extra check for rectangle as algorithm doesn't work for bubbles above line and I don't know why?
      if (drawit && rectangular) {
        if (by < recth+sampleMeanSize) {
          drawit = false;
        }
      }

      //draw the bubble
      if (drawit) {
        //bubbles
        if (fillPopulation) svgP.append('circle').attr('class', 'popnbubble').attr('cx', bx).attr('cy', by).attr('r', sampleMeanSize).attr('fill', 'lightyellow').attr('stroke','blue'). attr('stroke-width', 0.5).attr('visibility', 'visible');
        //dots for testing
        //if (fillPopulation) svgP.append('circle').attr('class', 'popnbubble').attr('cx', bx).attr('cy', by).attr('r', 0.5).attr('fill', 'blue').attr('stroke','blue'). attr('stroke-width', 0.5).attr('visibility', 'visible');
      }
      else {
        //ones not drawn for testing
        //if (fillPopulation) svgP.append('circle').attr('class', 'popnbubble').attr('cx', bx).attr('cy', by).attr('r', sampleMeanSize).attr('fill', 'white').attr('stroke','red'). attr('stroke-width', 0.5).attr('visibility', 'visible');
      }
    }
  }

  //remove population bubbles
  function removePopnBubbles() {
    d3.selectAll('.popnbubble').remove();
  }
  
  //random float between a, b
  function randbetween(a, b) {
    if (b < a) return a;
    return (Math.random() * (b - a) + a);
  }


  //------------------------------------------------Get Samples--------------------------------------*/
  let meanidx;

  //take a sample from the population
  function takeSample() {
    //note xbar is calculated in sampleStatistics and used for the sample mean and it's blob
    //need to use these for when I loop through each dropping mean blob
    let ixbar;  //integer version of xbar from dropping blob
    let fxbar;  //floating point version of xbar from dropping blob
    let fssd;   //floating point cersion of sdd from dropping blob (passed to addtoheap)
    let barHeight;

    //only allowed if dropping means is on issue #31
    if (dropSampleMeans) N += 1; //increase the number of times I take a sample

    //make sure I've got correct parameters from distribution
    mu = parseFloat($mu.val());
    sigma = parseFloat($sigma.val());

    //set the sample array to empty 
    samples = [];
    //get the number of samples to draw
    n = parseInt($('#samplesselected option:selected').val());

    if (normal) {
      //draw n samples
      for (let i = 0; i < n; i += 1) {
        //jStat.normal.sample( mu, sigma )
        samples.push( jStat.normal.sample(mu, sigma) );
      }
    }

    if (rectangular) {
      for (let i = 0; i < n; i += 1) {  //-1, + 1 just to get appearance right!
        samples.push( randbetween(mu - (sigma*Math.sqrt(3)), mu +  (sigma * Math.sqrt(3)) ));
      }      
    }

    if (skew) {
      for (let i = 0; i < n; i += 1) {
        //go through popnbubbles and pick a random sample. popnBubbles is a random array of datapoints for the distribution
        let r = parseInt(randbetween(0, popnBubbles.length - 1));
        samples.push(popnBubbles[r].x); 
      }

    }

    if (custom) {
      for (let i = 0; i < n; i += 1) {
        //go through popnbubbles and pick a random sample
        let r = parseInt(randbetween(0, popnBubbles.length - 1));
        samples.push(popnBubbles[r].x);  
      }
    }

    //calculate the statistics e.g. sample mean, sample sd, popn moe, sample moe
    sampleStatistics();

    //display the sample points. (remove any that exist then create anew)
    d3.selectAll('.samplepoint').remove();
    samples.forEach(sampleItem => {
      svgS.append('circle').attr('class', 'samplepoint').attr('cx', x(sampleItem)).attr('cy', '10').attr('r', sampleMeanSize);
    })

    //show the sample points
    if (showSamplePoints) {
      d3.selectAll('.samplepoint').attr('visibility', 'visible');
    }
    else {
      d3.selectAll('.samplepoint').attr('visibility', 'hidden');
    }

    //Now at this point I have to get the means to DANCE!!!. If droppingMeans true  - shift down the older samplemeans.
    if (dropSampleMeans) {
      $('.smean').each(function() { //get an array of all smean svg elements - circles
        
        meanid = $(this).attr('id').substring(5); 
        for (let i = 0; i < droppingMeanGap; i += 1) {  //for each sample mean that is dropping
          //tempted to put in a small delay here since can't see the sample mean hit the bottom axis as it's too fast

          ypos = parseInt($(this).attr('cy')) + 1; //move it 1 pixel at a time
          yposs = ypos - droppingMeanGap;

          letDrop = false;
          if (showMeanHeap) {  //if the mean heap is visible look at the sample mean. Compare it with the height of the heap  frequency at that point

            //get the sample mean and ssd from the dropping blob
            //ixbar = parseInt($(this).attr('xbar'));
            fxbar = parseFloat($(this).attr('xbar'));
            fssd = parseFloat($(this).attr('ssd'));

            //if xbar outside viewable area 0-100 then cannot add to heap display
            if ((fxbar < 0 || fxbar >= 100)) {
              //well even though we cannot see it, need to keep it dropping, so treat it as though no heap visible
              if (ypos <= heightS - dropLimit - sampleMeanSize) {
                letDrop = true;
              }
              else {
                letDrop = false;
              }              
            }
            else {
              //from add to heap routine the sample mean is inside the viewable area so check against the heap height
              heapIndex = parseInt( Math.floor(fxbar/100 * nobuckets )); //nobuckets might be a decimal
        
              //original
              // heapIndex = parseInt(ixbar/100 * heap.length);
              heapIndexFreq = heap[heapIndex].f;

              //this should be the height or position of top of bar at heapIndex
              barHeight = heightS - dropLimit - (heapIndexFreq * 2 * sampleMeanSize);

              //if height of samplemean is less than height of bar at that position let it drop otherwise disappear it
              if (ypos < barHeight ) {
                letDrop = true;
              }
              else {
                letDrop = false;
              }
            }
          }
          else {  //else no heap showing
            if (ypos <= heightS - dropLimit - sampleMeanSize) {
              letDrop = true;
            }
            else {
              letDrop = false;
            }            
          }

          //allow to hit the axis or top of heap before disappearing
          if (letDrop) {
            $(this).attr('cy', ypos);  //move it and moe wings and capture lines down 1 pixel
            d3.select('#pmoe'+meanid).attr('y1', ypos);  
            d3.select('#pmoe'+meanid).attr('y2', ypos); 
            d3.select('#smoe'+meanid).attr('y1', ypos);
            d3.select('#smoe'+meanid).attr('y2', ypos); 

            //move capture of next mean

            d3.select('#pcapture'+meanid).attr('y1', ypos);
            d3.select('#pcapture'+meanid).attr('y2', yposs); 

            d3.select('#scapture'+meanid).attr('y1', ypos);
            d3.select('#scapture'+meanid).attr('y2', yposs); 

            //move p-value
            d3.select('#pvaluez'+meanid).attr('y', ypos-6);
            d3.select('#pvtextz'+meanid).attr('y', ypos+4);

            d3.select('#pvaluet'+meanid).attr('y', ypos-6);
            d3.select('#pvtextt'+meanid).attr('y', ypos+4);

          }
          else {  // gone too far remove it and the moe wings and any capturelines
            let pmissed = $(this).attr('pmissed');  //for use in colouring the heap, text value 'true' 'false'
            let smissed = $(this).attr('smissed');

            d3.select('#smean'+meanid).remove(); 

            d3.select('#pmoe'+meanid).remove();  
            d3.select('#smoe'+meanid).remove();

            d3.select('#pcapture'+meanid).remove();  
            d3.select('#scapture'+meanid).remove();

            d3.select('#pvaluez'+meanid).remove();  
            d3.select('#pvtextz'+meanid).remove();
            d3.select('#pvaluez'+meanid).remove();  
            d3.select('#pvtextt'+meanid).remove();


            if (showMeanHeap) addToHeap(fxbar, fssd, pmissed, smissed); 
            break;  //no point in moving anymore
          }

        }
        //break to here

      })
    }
    //#28 remove dropping sample means but don't clear as in resetSamples
    else if (showSampleMeans) {
      resetSamples2();
    }
    else {
      //just hide or remove dropping means including old ones - I think removing makes more sense
      resetSamples();
      resetCaptureStats();
    }
    
    //create the new sample mean and moe wings svg items.
    ypos = 25; //initial position of mean  
    
    //update the capturedArray stats
    capturedArray.push(
      {
        id: id,
        xbar:  xbar,
        ssd:   ssd
      }
    );

    //add the population moe and sample moe wings then mean blob and hide them  x() is the scaling. Also add xbar and s
    svgS.append('line').attr('class', 'pmoe').attr('id', 'pmoe' + id).attr('x1', x(xbar-pmoe)).attr('y1', ypos).attr('x2', x(xbar+pmoe) ).attr('y2', ypos).attr('stroke', lightGreen).attr('visibility', 'hidden').attr('xbar', xbar).attr('sigma', sigma);
    svgS.append('line').attr('class', 'smoe').attr('id', 'smoe' + id).attr('x1', x(xbar-smoe)).attr('y1', ypos).attr('x2', x(xbar+smoe) ).attr('y2', ypos).attr('stroke', lightGreen).attr('visibility', 'hidden').attr('xbar', xbar).attr('ssd', ssd);;

    //add the blob on top  -- note the attr for xbar, with svg can add any attribute you want as long as it doesn't conflict. The 'missed' attribute will be used to try and fill the inside red when showPmoe showSmoe selected or back to green when mot selected
    svgS.append('circle').attr('class', 'smean').attr('id', 'smean' + id).attr('cx', x(xbar)).attr('cy', ypos).attr('r', sampleMeanSize).attr('fill', lightGreen).attr('visibility', 'hidden').attr('xbar', xbar).attr('xbar', xbar).attr('sigma', sigma).attr('ssd', ssd).attr('pmissed', 'false').attr('smissed', 'false');

    //capture of next mean. Shall I add a line
    //only if there are at least two samples
    if (N >= 2) {
      nocapturingnextmeanP += 1;
      nocapturingnextmeanS += 1;

      idnext = id - 1;  //the previous one is lower in the diagram
      //what if there is no previous mean because it's been captured?
      //can't draw line, but need to count it (otherwise pink lines get isolated at top)
      previousmeanexists = true;
      if ($('#smean' + idnext).length == 0) previousmeanexists = false;

      //I know the current xbar, but need the xbar and moe of the previous mean
      if ( oldxbar + oldpmoe < xbar ) {
        if (previousmeanexists) svgS.append('line').attr('class', 'pcaptureline').attr('id', 'pcapture' + +idnext).attr('x1', x(oldxbar + oldpmoe)).attr('y1', ypos + droppingMeanGap).attr('x2', x(xbar)).attr('y2', ypos).attr('visibility', 'hidden');
        nocapturingnextmeanP -= 1;
      }
      if ( oldxbar - oldpmoe > xbar ) {
        if (previousmeanexists) svgS.append('line').attr('class', 'pcaptureline').attr('id', 'pcapture' + +idnext).attr('x1', x(oldxbar - oldpmoe)).attr('y1', ypos + droppingMeanGap).attr('x2', x(xbar)).attr('y2', ypos).attr('visibility', 'hidden');
        nocapturingnextmeanP -= 1;
      }
      
      if ( oldxbar + oldsmoe < xbar ) {
        if (previousmeanexists) svgS.append('line').attr('class', 'scaptureline').attr('id', 'scapture' + +idnext).attr('x1', x(oldxbar + oldsmoe)).attr('y1', ypos + droppingMeanGap).attr('x2', x(xbar)).attr('y2', ypos).attr('visibility', 'hidden');
        nocapturingnextmeanS -= 1;
      }
      if ( oldxbar - oldsmoe > xbar ) {
        if (previousmeanexists) svgS.append('line').attr('class', 'scaptureline').attr('id', 'scapture' + +idnext).attr('x1', x(oldxbar - oldsmoe)).attr('y1', ypos + droppingMeanGap).attr('x2', x(xbar)).attr('y2', ypos).attr('visibility', 'hidden');
        nocapturingnextmeanS -= 1;
      }

      showCapturelines();
      displayCaptureOfNextMeanStats();
    }

    //add p-value rectangle
    calcpvalue();

    //create the svg for the p-values
    createpvalues();
    
    showpvalues();


    oldxbar = xbar;  //remember the current xbar
    oldpmoe = pmoe;
    oldsmoe = smoe;

    //just display the currently created sample appearance
    displaySampleAppearance(id, true); //increment captureP, captureS 

    //just display new captured stats
    displayCapturedRate();


    //increment the id value
    id += 1;
  }


  function displaySampleAppearanceAll() {
    //hide all wings
    d3.selectAll('.pmoe, .smoe').attr('visibility', 'hidden');

    //get all displayed mean blobs
    d3.selectAll('.smean').each(function() {
      //get the id
      blobId = parseInt($(this).attr('id').substring(5));
      displaySampleAppearance(blobId, false); //don't increment captureP captureS
    })
  }

  //decide what to display for dropping means blob and MoEs
  function displaySampleAppearance(id, increment) {
    //only increment captureP and captureS if called from Take a sample, other recalculate SampleMeanStatistics takes care of it

    if (!showSampleMeans) return;  //if checkbox for show sample means not checked don't display

    mblob = d3.select('#smean'+id);
    pwing = d3.select('#pmoe'+id);
    swing = d3.select('#smoe'+id);

    //work out CIs and whether missed or not
    pci = jStat.normalci( parseFloat(mblob.attr('xbar')), alpha, parseFloat(mblob.attr('sigma')), n );  //n is just the no of items in the sample, if that changes need to start counting again
    sci = jStat.tci( parseFloat(mblob.attr('xbar')), alpha, parseFloat(mblob.attr('ssd')), n);   
    
    //If the C has changed, i.e the alpha, then I need to update the moe wings
    pwing.attr( 'x1', x(pci[0]) );
    pwing.attr( 'x2', x(pci[1]) );
    swing.attr( 'x1', x(sci[0]) );
    swing.attr( 'x2', x(sci[1]) );

    //do the pmoe count
    missedTheMean = false;
    if (pci[0] > mu) missedTheMean = true;
    if (pci[1] < mu) missedTheMean = true;
    if (missedTheMean) {
      mblob.attr('pmissed', 'true');  //check whether these are needed with this refactoring, all needs recalcing anyway if CI changes
    }
    else {
      mblob.attr('pmissed', 'false'); 
      if (increment) capturedP += 1;
    }

    //smoe
    missedTheMean = false;
    if (sci[0] > mu) missedTheMean = true;
    if (sci[1] < mu) missedTheMean = true;
    if (missedTheMean) {
      mblob.attr('smissed', 'true');
    }
    else {
      mblob.attr('smissed', 'false');
      if (increment) capturedS += 1;
    }

    //now decide what to display; showPmoe and showSoe mutually exclusive
    //rewritten again.
    //0 0 0
    if (!showMoe && !captureOfMu && !showCaptureMuLine) {  //just show light green blobs
      mblob.attr('fill', lightGreen);
      pwing.attr('visibility', 'hidden');
      swing.attr('visibility', 'hidden');
      if (showSampleMeans) mblob.attr('visibility', 'visible');
    }

    //0 0 1
    if (!showMoe && !captureOfMu && showCaptureMuLine) {   //just show light green blobs
      mblob.attr('fill', lightGreen);
      pwing.attr('visibility', 'hidden');
      swing.attr('visibility', 'hidden');
      if (showSampleMeans) mblob.attr('visibility', 'visible');
    }

    //0 1 0
    if (!showMoe && captureOfMu && !showCaptureMuLine) {  //just show light green blobs
      mblob.attr('fill', lightGreen);
      pwing.attr('visibility', 'hidden');
      swing.attr('visibility', 'hidden');
      if (showSampleMeans) mblob.attr('visibility', 'visible');
    }

    //0 1 1 
    // if (!showMoe && captureOfMu && showCaptureMuLine) {   //show lightgreen blobs but no moe lines
    //   mblob.attr('fill', lightGreen);
    //   pwing.attr('visibility', 'hidden');
    //   swing.attr('visibility', 'hidden');
    //   if (showSampleMeans) mblob.attr('visibility', 'visible');
    // }    


    //0 1 1
    if (!showMoe && captureOfMu && showCaptureMuLine) {   //show dark green and red blobs and moes
      if (showPmoe) {
        if ( mblob.attr('pmissed') === 'true') {
          pwing.attr('stroke', 'red');
          mblob.attr('fill', 'red');
        }
        else {
          pwing.attr('stroke', darkGreen);
          mblob.attr('fill', darkGreen);
        }
        pwing.attr('visibility', 'hidden');
        mblob.attr('visibility', 'visible');
      }

      if (showSmoe) {
        if (mblob.attr('smissed') === 'true') {
          swing.attr('stroke', 'red');
          mblob.attr('fill', 'red');
        }
        else {
          swing.attr('stroke', darkGreen);
          mblob.attr('fill', darkGreen);
        }
        swing.attr('visibility', 'hidden');
        mblob.attr('visibility', 'visible');
      }
    }


    //1 0 0
    if (showMoe && !captureOfMu && !showCaptureMuLine) {    //show light green blobs and moe
      if (showPmoe) {
        if ( mblob.attr('pmissed') === 'true') {
          pwing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        else {
          pwing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        pwing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }

      if (showSmoe) {
        if (mblob.attr('smissed') === 'true') {
          swing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        else {
          swing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        swing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }
    }

    //1 0 1
    if (showMoe && !captureOfMu && showCaptureMuLine) {   //show light green blobs and moes
      if (showPmoe) {
        if ( mblob.attr('pmissed') === 'true') {
          pwing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        else {
          pwing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        pwing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }

      if (showSmoe) {
        if (mblob.attr('smissed') === 'true') {
          swing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        else {
          swing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        swing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }
    }

    //1 1 0
    if (showMoe && captureOfMu && !showCaptureMuLine) {   //show light green blobs and moes
      if (showPmoe) {
        if ( mblob.attr('pmissed') === 'true') {
          pwing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        else {
          pwing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        pwing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }

      if (showSmoe) {
        if (mblob.attr('smissed') === 'true') {
          swing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        else {
          swing.attr('stroke', lightGreen);
          mblob.attr('fill', lightGreen);
        }
        swing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }
    }

    //1 1 1
    if (showMoe && captureOfMu && showCaptureMuLine) {   //show dark green and red blobs and moes
      if (showPmoe) {
        if ( mblob.attr('pmissed') === 'true') {
          pwing.attr('stroke', 'red');
          mblob.attr('fill', 'red');
        }
        else {
          pwing.attr('stroke', darkGreen);
          mblob.attr('fill', darkGreen);
        }
        pwing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }

      if (showSmoe) {
        if (mblob.attr('smissed') === 'true') {
          swing.attr('stroke', 'red');
          mblob.attr('fill', 'red');
        }
        else {
          swing.attr('stroke', darkGreen);
          mblob.attr('fill', darkGreen);
        }
        swing.attr('visibility', 'visible');
        mblob.attr('visibility', 'visible');
      }
    }

  }

  //calculate statistics in samples[]
  function sampleStatistics() {
    //get stats from jStat
    //this should be okay for all types of distribution
    xbar  = jStat.mean(samples);
    ssd   = jStat.stdev(samples, true);  //true is supposed to give the sample sd

    //the mu and sigma for skew and custom are calculated from the popnbubbles array.

    //for display - calc length of each wing, i.e. the margin of error
    if (isNaN(ssd)) {  //if the ssd cannot be calculated, i.e. sample size N is 1
      ssd = 0;
      pci = jStat.normalci( xbar, alpha, sigma, n ); //e.g. for 95% CI alpha = 0.05
      sci = [0, 0];

      pmoe = jStat.normal.inv( 1-alpha/2.0, 0, 1 ) * sigma/Math.sqrt(n);
      //pmoe  = pci[1] - xbar;
      
      smoe  = 0;
    }
    else {
      pci = jStat.normalci( xbar, alpha, sigma, n ); //e.g. for 95% CI alpha = 0.05
      sci = jStat.tci( xbar, alpha, ssd, n);
      
      pmoe = jStat.normal.inv( 1-alpha/2.0, 0, 1 ) * sigma/Math.sqrt(n);
      //pmoe  = pci[1] - xbar; //this is not the same
      
      smoe  = sci[1] - xbar;
    }

    //display stats
    $N.text(N);
    if (!captureOfMu) $N2.text(N); else $N2.text(0);
    $xbar.text(xbar.toFixed(2));
    $ssd.text(ssd.toFixed(2));
    $pmoe.text(pmoe.toFixed(2));
    $smoe.text(smoe.toFixed(2));
  }

  //display the percentage captured
  function displayCapturedRate() {

    //only do this if CI on  Mu line on???  capture of mu on  and #31 dropping means on 
    if (showMoe && captureOfMu && showCaptureMuLine && dropSampleMeans) {
      //given that N is the number of samples
      $N.text(N);
      if (captureOfMu) $N2.text(N); else $N2.text(0);
      //should be able to use showPmoe only
      if ($showPmoe.is(':checked')) {
        //should recalculate the number of samples taken
        $captured.text(capturedP);
        if (N !== 0) $capturedpercent.text((capturedP/N *100).toFixed(1) + '%');
      }
      if ($showSmoe.is(':checked')) {
        $captured.text(capturedS);
        if (N !== 0) $capturedpercent.text((capturedS/N *100).toFixed(1) + '%');
      }
    }
    else {
      $N2.text(0);
      $captured.text(0);
      $capturedpercent.text('0.0%');
    }
  }

  //From change CI % - alpha, ,showPmoe, showSmoe, (showMoe), if change the CI % need to recalculate the same taken and missed to be what's displayed, as previous sample are removed.
  //variables to check change $N - the number of samples taken - should capturedArray.length()

  function recalculateSamplemeanStatistics() {
    //have a capturedArray so recalc the number captured from all samples
    capturedP = 0;
    capturedS = 0;
    capturedArray.forEach(s => {
      pci = jStat.normalci( s.xbar, alpha, sigma, n );  //n is just the no of items in the sample, if that changes need to start counting again
      sci = jStat.tci( s.xbar, alpha, s.ssd, n);      

      //do the pmoe count
      missedTheMean = false;
      if (pci[0] > mu) missedTheMean = true;
      if (pci[1] < mu) missedTheMean = true;
      if (missedTheMean) {

      }
      else {
        capturedP += 1;
      }

      //do the smoe count
      missedTheMean = false;
      if (sci[0] > mu) missedTheMean = true;
      if (sci[1] < mu) missedTheMean = true;
      if (missedTheMean) {

      }
      else {
        capturedS += 1;
      }
      
      displayCapturedRate();
    })
  }

  function showCapturelines() {
    hideCapturelines();  
    if (!captureNextMean) return;

    if (showPmoe && showMoe) {
      d3.selectAll('.pcaptureline').attr('visibility', 'visible');
      d3.selectAll('.scaptureline').attr('visibility', 'hidden');
    }
    if (showSmoe && showMoe) {
      d3.selectAll('.pcaptureline').attr('visibility', 'hidden');
      d3.selectAll('.scaptureline').attr('visibility', 'visible');
    }
  }

  function hideCapturelines() {
    d3.selectAll('.pcaptureline').attr('visibility', 'hidden');
    d3.selectAll('.scaptureline').attr('visibility', 'hidden');
  }

  function displayCaptureOfNextMeanStats() {
    if (captureNextMean && showMoe && showPmoe) {
      $noofnextmeans.text( N-1 );
      $nocapturingnextmean.text( parseInt(nocapturingnextmeanP) );
      $pccapturingnextmean.text( parseFloat(nocapturingnextmeanP / (N-1) * 100).toFixed(1) +'%');
    }
    if (showMoe && showSmoe) {
      $noofnextmeans.text( N-1 );
      $nocapturingnextmean.text( parseInt(nocapturingnextmeanS) );
      $pccapturingnextmean.text( parseFloat(nocapturingnextmeanS / (N-1) * 100).toFixed(1) +'%');
    }
  }

  
  function calcpvalue() {
    z = Math.abs((xbar-mu0)/(sigma/Math.sqrt(n)));
    t = Math.abs((xbar-mu0)/(ssd/Math.sqrt(n)));

    pvz = (1-jStat.normal.cdf(z, 0, 1)) * 2; //for 2-tailed
    pvt = (1-jStat.studentt.cdf(t, n-1)) * 2;
  }

  function createpvalues() {
    //pmoe
    if (pvz < 0.001) {
      svgS.append('rect').attr('class', 'pvaluez').attr('id', 'pvaluez' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'red').attr('visibility', 'hidden');
      svgS.append('text').text('   ***' + (pvz.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextz').attr('id', 'pvtextz' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showPmoe) audiohigh.play();
    }
    if (pvz >= 0.001 && pvz < 0.01) {
      svgS.append('rect').attr('class', 'pvaluez').attr('id', 'pvaluez' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'orange').attr('visibility', 'hidden');
      svgS.append('text').text('    **'+ (pvz.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextz').attr('id', 'pvtextz' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showPmoe) audiomiddlehigh.play();
    }
    if (pvz >= 0.01 && pvz < 0.05) {
      svgS.append('rect').attr('class', 'pvaluez').attr('id', 'pvaluez' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'lemonchiffon').attr('visibility', 'hidden');
      svgS.append('text').text('     *' + (pvz.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextz').attr('id', 'pvtextz' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showPmoe) audiomiddle.play();
    }
    if (pvz >= 0.05 && pvz < 0.1) {
      svgS.append('rect').attr('class', 'pvaluez').attr('id', 'pvaluez' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'lightskyblue').attr('visibility', 'hidden');
      svgS.append('text').text('     ?' + (pvz.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextz').attr('id', 'pvtextz' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showPmoe) audiolowmiddle.play();
    }
    if (pvz >= 0.1) {
      svgS.append('rect').attr('class', 'pvaluez').attr('id', 'pvaluez' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'blue').attr('visibility', 'hidden');
      svgS.append('text').text('      ' + (pvz.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextz').attr('id', 'pvtextz' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showPmoe) audiolow.play();
    }
   
    //smoe
    if (pvt < 0.001) {
      svgS.append('rect').attr('class', 'pvaluet').attr('id', 'pvaluet' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'red').attr('visibility', 'hidden');
      svgS.append('text').text('   ***' + (pvt.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextt').attr('id', 'pvtextt' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showSmoe) audiohigh.play();
    }
    if (pvt >= 0.001 && pvt < 0.01) {
      svgS.append('rect').attr('class', 'pvaluet').attr('id', 'pvaluet' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'orange').attr('visibility', 'hidden');
      svgS.append('text').text('    **'+ (pvt.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextt').attr('id', 'pvtextt' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showSmoe) audiomiddlehigh.play();
    }
    if (pvt >= 0.01 && pvt < 0.05) {
      svgS.append('rect').attr('class', 'pvaluet').attr('id', 'pvaluet' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'lemonchiffon').attr('visibility', 'hidden');
      svgS.append('text').text('     *' + (pvt.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextt').attr('id', 'pvtextt' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showSmoe) audiomiddle.play();
    }
    if (pvt >= 0.05 && pvt < 0.1) {
      svgS.append('rect').attr('class', 'pvaluet').attr('id', 'pvaluet' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'lightskyblue').attr('visibility', 'hidden');
      svgS.append('text').text('     ?' + (pvt.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextt').attr('id', 'pvtextt' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showSmoe) audiolowmiddle.play();
    }
    if (pvt >= 0.1) {
      svgS.append('rect').attr('class', 'pvaluet').attr('id', 'pvaluet' + +id).attr('x', x( 0 )).attr('y', ypos-6).attr('width', x( 3  )).attr('height', droppingMeanGap-2).attr('fill', 'blue').attr('visibility', 'hidden');
      svgS.append('text').text('      ' + (pvt.toFixed(3)).toString().replace('0.', '.')).attr('class', 'pvtextt').attr('id', 'pvtextt' + +id).attr('x', x( 2 )).attr('y', ypos+4).attr('text-anchor', 'start').style('font-weight', 'bold').attr('fill', 'black').attr('visibility', 'hidden');
      if (pvaluesound && showSmoe) audiolow.play();
    }

  }

  function displayCohend() {
    $('#hypothesismu0').text(mu0);

    cohensd = (mu - mu0)/sigma;
    $('#cohensd').text(cohensd.toFixed(2));
  }

  function clearCohend() {
    $('#hypothesismu0').text(mu0);
    $('#cohensd').text('0.0');
  }

  function showpvalues() {
    if (pvalue) {
      hidepvalues();
      if (showPmoe) {
        d3.selectAll('.pvaluez').attr('visibility', 'visible');
        d3.selectAll('.pvtextz').attr('visibility', 'visible');
      }
      if (showSmoe) {
        d3.selectAll('.pvaluet').attr('visibility', 'visible');
        d3.selectAll('.pvtextt').attr('visibility', 'visible');
      }
      displayCohend();
    }
  }

  function hidepvalues() {
    d3.selectAll('.pvaluez').attr('visibility', 'hidden');
    d3.selectAll('.pvtextz').attr('visibility', 'hidden');
    d3.selectAll('.pvaluet').attr('visibility', 'hidden');
    d3.selectAll('.pvtextt').attr('visibility', 'hidden');

    clearCohend()
  }

  function clearpvalues() {
    d3.selectAll('.pvaluez').remove();
    d3.selectAll('.pvtextz').remove();

    d3.selectAll('.pvaluet').remove();
    d3.selectAll('.pvtextt').remove();
    clearCohend()
  }

  /*------------------------------------------do the heap------------------------------------------*/
  //when sample mean gets far enough, add to the heap display   -- from takeSample()

  function addToHeap(fxbar, fssd, pmissed, smissed) {
    let hx, hy;
    let h;

    if (fxbar >= 0 && fxbar <= 100) {
      //increase the heap frequency. Remember that 50 is the middle bar
      xint = parseInt( Math.floor(fxbar/100 * nobuckets )); //nobuckets might be a decimal
      heap[xint].f += 1;

      //now draw a bubble at co-ords xint and heap(xint)
      //color code the drops and add attributes for when recoluring if C (alpha) changed later
      hx = (heap[xint].x * 2 * sampleMeanSize) + (sampleMeanSize  + 2);

      hy = heightS - (heap[xint].f * sampleMeanSize * 2) - dropLimit + 3;

    //   //0 1 1 showMoe captureofmu showcapturemuline
      if (captureOfMu && showCaptureMuLine) {
        if (showPmoe && pmissed === 'true') {
          svgS.append('circle').attr('class', 'heap').attr('cx', hx ).attr('cy', hy).attr('r', sampleMeanSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'red').attr('visibility', 'visible').attr('xbar', fxbar).attr('sigma', sigma).attr('ssd', fssd).attr('pmissed', pmissed).attr('smissed', smissed);
        }
        if (showPmoe && pmissed === 'false') {
          svgS.append('circle').attr('class', 'heap').attr('cx', hx ).attr('cy', hy).attr('r', sampleMeanSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', darkGreen).attr('visibility', 'visible').attr('xbar', fxbar).attr('sigma', sigma).attr('ssd', fssd).attr('pmissed', pmissed).attr('smissed', smissed);
        }
        if (showSmoe && smissed === 'true') {
          svgS.append('circle').attr('class', 'heap').attr('cx', hx ).attr('cy', hy).attr('r', sampleMeanSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'red').attr('visibility', 'visible').attr('xbar', fxbar).attr('sigma', sigma).attr('ssd', fssd).attr('pmissed', pmissed).attr('smissed', smissed);
        }
        if (showSmoe && smissed === 'false') {
          svgS.append('circle').attr('class', 'heap').attr('cx', hx ).attr('cy', hy).attr('r', sampleMeanSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', darkGreen).attr('visibility', 'visible').attr('xbar', fxbar).attr('sigma', sigma).attr('ssd', fssd).attr('pmissed', pmissed).attr('smissed', smissed);
        }
      }
      else {
        svgS.append('circle').attr('class', 'heap').attr('cx', hx ).attr('cy', hy).attr('r', sampleMeanSize).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', lightGreen).attr('visibility', 'visible').attr('xbar', fxbar).attr('sigma', sigma).attr('ssd', fssd).attr('pmissed', pmissed).attr('smissed', smissed);
      }
    }

    //must calculate heap stats even with non visible mean
    calculateHeapStatistics(xbar);  //this could be a slow downer! //do it continuously not as a recalc?

    drawSELines()       //dynamic and now fixed to population sd.
    drawMeanHeapCurve() // this will be dynamic as well
    if (showCaptureMuLine) drawMuLine();       //need to keep it on top
    if (pvalue) drawMu0Line();
    if (plusminusmoe) drawPlusMinusMoe();      //need to keep it on top
  }

  //recolour heap if CI checked and mu known unknown checked && showCaptureMuLine
  //also now if CI has been changed need to recalculate pmissed smissed with new alpha
  function recolourHeap() {
    let xbar, sigma, ssd, pmoe, smoe;
    let pmissed, smissed;
    
    //go through the heap.
    d3.selectAll('.heap').each( function(h) {
      xbar = parseFloat($(this).attr('xbar'));
      sigma = parseFloat($(this).attr('sigma'));
      ssd = parseFloat($(this).attr('ssd'));

      //work out CIs and whether missed or not
      pci = jStat.normalci( xbar, alpha, sigma, n );  //n is just the no of items in the sample, if that changes need to start counting again
      sci = jStat.tci( xbar, alpha, ssd, n );   

      //do the pmoe count
      pmissed = false;
      if (pci[0] > mu) pmissed = true;
      if (pci[1] < mu) pmissed = true;
      if (pmissed) {
        $(this).attr('pmissed', 'true');  //check whether these are needed with this refactoring, all needs recalcing anyway if CI changes
      }
      else {
        $(this).attr('pmissed', 'false'); 
      }

      //smoe
      smissed = false;
      if (sci[0] > mu) smissed = true;
      if (sci[1] < mu) smissed = true;
      if (smissed) {
        $(this).attr('smissed', 'true');
      }
      else {
        $(this).attr('smissed', 'false');
      }      


      //showMoe captureOfMu showCaptureMuLine conditions

      //1 1 1
      //0 1 1
      if (captureOfMu && showCaptureMuLine) {   //show dark green and red blobs and moes        
        if (showPmoe) {
          if (pmissed) {
            $(this).attr('fill', 'red');
          }
          else {
            $(this).attr('fill', darkGreen);
          }
        }
        if (showSmoe) {
          if (smissed) {
            $(this).attr('fill', 'red');
          }
          else {
            $(this).attr('fill', darkGreen);
          }
        }
      }
      else {  //000, 001, 010, 100, 101, 110
        $(this).attr('fill', lightGreen);
      }


    })
  }

  //get xbar and sse for heap
  function calculateHeapStatistics(fxbar) {
    //continuously update heap xbar and heap se
    //we will assume that the heapxbar and heapse start at 0 
    heapN += 1;
    m = heapN //for use in formula - a bit shorter

    heapxbar = ( (1 - 1/m) * heapxbar) + (1/m * fxbar);
  
    if (m > 1) heapse = Math.sqrt (  ( (1 - 1/(m-1)) * (heapse * heapse) ) + ( (m)/((m-1) * (m-1)) * (fxbar - heapxbar) * (fxbar - heapxbar)  )  ); 
    
    //display values
    $heapxbar.text(heapxbar.toFixed(2));
    $heapse.text(heapse.toFixed(2));
    $noInHeap.text(heapN);

  }  

  //not sure I actually need this, but hey leave it for now.
  function recalculateHeapStatistics() {

    let hpm = 0, hps = 0, hn = 0;
    heap.forEach( h => {
      hpm += h.x * h.f;
      hn  += h.f;
    })
    hpm = hpm/hn;

    heap.forEach( h => {
      hps += (h.x - hpm) * (h.x - hpm) * h.f;
    })
    hps = Math.sqrt( hps/(hn-1) );

    //display values
    if (showMeanHeap) {
      $heapxbar.text(heapxbar.toFixed(2));
      $heapse.text(heapse.toFixed(2));
      $noInHeap.text(heapN);
    }
  }


  //draw a normal curve to the heap
  function drawMeanHeapCurve() {
    //only do this if showMeanHeapCurve checked
    if (!showMeanHeapCurve) return; //simple way of dealing with it.

    d3.selectAll('.heapcurve').remove();
    //also gets re-created every time a sample is dropped

    //get max of the heap histogram i.e. the max frequency
    heapMax = Math.max(...heap.map(o => o.f), 0);

    //now create the points, 200 should be enough
    if (heapN > 1) {
      let curveSE = sigma/Math.sqrt(n);
      $curveHeapSE.text(curveSE.toFixed(2));
      heappdf = [];

      for (let k = 0; k < 100; k += 0.01) { 
         //heappdf.push( {x: k, y: jStat.normal.pdf(k, heapxbar, heapse) } );  
         heappdf.push( {x: k, y: jStat.normal.pdf( k, mu, curveSE ) } ); 
      }

      //get the max of the curve
      heapCMax = Math.max(...heappdf.map(o => o.y), 0);

      //now scale the heappdf by heapMax/heapCMax   sampleMeanSize is the radius of the bubbles scale by 1.2  
      heappdf = heappdf.map (o =>  ({ x: o.x, y: o.y * heapMax/heapCMax * sampleMeanSize * 1.75}) );  

      //create a generator
      lineh = d3.line()
                .x(function(d, i) { return x(d.x); })
                .y(function(d, i) { return heightS - d.y - 40; })
                //.curve(d3.curveCardinal);  //curve it more as too pointy
                //.curve(d3.curveBundle.beta(0.5));

      //display the curve
      svgS.append('path').attr('class', 'heapcurve').attr('d', lineh(heappdf)).attr('stroke', 'brown').attr('stroke-width', '2').attr('fill', 'none').attr('visibility', 'hidden');

      if (showMeanHeapCurve) {
        d3.selectAll('.heapcurve').attr('visibility', 'visible');
      }
      else {
        d3.selectAll('.heapcurve').attr('visibility', 'hidden');
      }

    }
  }

  function removeMeanHeapCurve() {
    d3.selectAll('.heapcurve').remove();
    $curveHeapSE.text(0);
  }

  //draw the standard error line
  function drawSELines() {
    if (!showSELines) return;

    //remove previous SE lines
    d3.selectAll('.selines').remove();

    //draw the se lines, remember x() is a scaling function from D3
    //get height of heap
    hght = 0;
    for (let h = 0; h < heap.length; h += 1) {
      if (heap[h].f > hght) hght = heap[h].f;
    }
    hght *= 2 * sampleMeanSize;

    let ya = heightS - dropLimit;
    let yb = heightS - hght - 50;

    //xbar
    svgS.append('line').attr('class', 'selines').attr('x1', x(mu)).attr('y1', ya).attr('x2', x(mu)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '2').attr('visibility', 'hidden');
    //se
    // svgS.append('line').attr('class', 'selines').attr('x1', x(heapxbar-3*heapse)).attr('y1', ya).attr('x2', x(heapxbar-3*heapse)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '1').attr('visibility', 'hidden');
    // svgS.append('line').attr('class', 'selines').attr('x1', x(heapxbar-2*heapse)).attr('y1', ya).attr('x2', x(heapxbar-2*heapse)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '1').attr('visibility', 'hidden');
    // svgS.append('line').attr('class', 'selines').attr('x1', x(heapxbar - heapse)).attr('y1', ya).attr('x2', x(heapxbar - heapse)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '1').attr('visibility', 'hidden');
    // svgS.append('line').attr('class', 'selines').attr('x1', x(heapxbar+1*heapse)).attr('y1', ya).attr('x2', x(heapxbar+1*heapse)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '1').attr('visibility', 'hidden');
    // svgS.append('line').attr('class', 'selines').attr('x1', x(heapxbar+2*heapse)).attr('y1', ya).attr('x2', x(heapxbar+2*heapse)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '1').attr('visibility', 'hidden');
    // svgS.append('line').attr('class', 'selines').attr('x1', x(heapxbar+3*heapse)).attr('y1', ya).attr('x2', x(heapxbar+3*heapse)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '1').attr('visibility', 'hidden');
    sepopn = sigma/Math.sqrt(n);
    svgS.append('line').attr('class', 'selines').attr('x1', x(mu-3*sepopn)).attr('y1', ya).attr('x2', x(mu-3*sepopn)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '2').attr('visibility', 'hidden');
    svgS.append('line').attr('class', 'selines').attr('x1', x(mu-2*sepopn)).attr('y1', ya).attr('x2', x(mu-2*sepopn)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '2').attr('visibility', 'hidden');
    svgS.append('line').attr('class', 'selines').attr('x1', x(mu - sepopn)).attr('y1', ya).attr('x2', x(mu - sepopn)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '2').attr('visibility', 'hidden');
    svgS.append('line').attr('class', 'selines').attr('x1', x(mu+1*sepopn)).attr('y1', ya).attr('x2', x(mu+1*sepopn)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '2').attr('visibility', 'hidden');
    svgS.append('line').attr('class', 'selines').attr('x1', x(mu+2*sepopn)).attr('y1', ya).attr('x2', x(mu+2*sepopn)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '2').attr('visibility', 'hidden');
    svgS.append('line').attr('class', 'selines').attr('x1', x(mu+3*sepopn)).attr('y1', ya).attr('x2', x(mu+3*sepopn)).attr('y2', yb).attr('stroke', 'orange').attr('stroke-width', '2').attr('visibility', 'hidden');

    if (showSELines) {
      d3.selectAll('.selines').attr('visibility', 'visible');
    }
    else {
      d3.selectAll('.selines').attr('visibility', 'hidden');
    }
  }

   //draw the +/- bars
  function drawPlusMinusMoe() {

    //make sure I've got correct parameters from distribution
    mu = parseFloat($mu.val());
    sigma = parseFloat($sigma.val());

    pci = jStat.normalci( mu, alpha, sigma, n );
    d3.selectAll('.plusminusmoe').remove();
    if (plusminusmoe) {

      let ya = heightS - dropLimit + 2;

      //draw bottom bar and moe lines  //note ys() doesn't reverse scale - used heightS - y()
      svgS.append('line').attr('class', 'plusminusmoe').attr('x1', x(pci[0])).attr('y1', ya).attr('x2', x(pci[1])).attr('y2', ya).attr('stroke', 'green').attr('stroke-width', '4').attr('visibility', 'visible');

      //fixed height version
      svgS.append('line').attr('class', 'plusminusmoe').attr('x1', x(pci[0])).attr('y1', ya).attr('x2', x(pci[0])).attr('y2', 25 ).attr('stroke', 'green').attr('stroke-width', '2').attr('visibility', 'visible');
      svgS.append('line').attr('class', 'plusminusmoe').attr('x1', x(pci[1])).attr('y1', ya).attr('x2', x(pci[1])).attr('y2', 25 ).attr('stroke', 'green').attr('stroke-width', '2').attr('visibility', 'visible');
    }
  }

  function removePlusMinusMoe() {
    d3.selectAll('.plusminusmoe').remove();
  }

  /*-------------------------------------------clear, show, hide UI values--------------------------*/

  function resetSamples() {
    //remove sample means and moes (blobs) from DOM
    d3.selectAll('.smean').remove();
    d3.selectAll('.pmoe').remove();
    d3.selectAll('.smoe').remove();

    id = 0;  //the id of the mean and moes for the svg element
    
    N = 0;   //the number of taken samples
    $N.text(0);
    $N2.text(0);

    $xbar.text(0);
    $ssd.text(0);
    $pmoe.text(0);
    $smoe.text(0);
  }

  function resetSamples2() {
    //this is almost resetSamples
    //remove sample means and moes (blobs) from DOM
    d3.selectAll('.smean').remove();
    d3.selectAll('.pmoe').remove();
    d3.selectAll('.smoe').remove();

    id = 0;  //the id of the mean and moes for the svg element

    N = 0;   //the number of taken samples
    $N.text(0);
    $N2.text(0);
  }

  function resetCaptureStats() {
    capturedArray = [];

    capturedP = 0;
    capturedS = 0;
    
    $captured.text('0');
    $capturedpercent.text('0.0%');
  }
  


  //create the bins for a histogram to hold frequency data for the heap
  function resetHeap() {
    let noOfBuckets;

    heapxbar = 0;      
    $heapxbar.text(0);
    
    heapse   = 0; 
    $heapse.text(0);

    heapN    = 0;
    $noInHeap.text(0);

    //create a frequency distribution where the number of buckets is dependent on the width of the display area and the size of the sample mean
    heap = [];
    xbardata = [];

    //reset the number of buckets in the heap
    //subtle issue here. I really need the middle bucket to correspond with 50. So I need an odd number of buckets
    //So check if noOfBuckets is odd, if not subtract 1 from it (or add 1?) 
    nobuckets = xmax / (2 * sampleMeanSize);  //this will be used in selecting the bin

    noOfBuckets = Math.round(nobuckets);
    if (noOfBuckets % 2 === 0) noOfBuckets -= 1;  

    for (let xx = 0; xx <= noOfBuckets; xx += 1) {  
      heap.push({x: xx, f: 0})
    }

    d3.selectAll('.heap').remove();
    drawSELines();
    d3.selectAll('.selines').remove();   //can this be in the drawSELines()??
    removeMeanHeapCurve();

  }

  function clearCapturelines() {
    d3.selectAll('.pcaptureline').remove();
    d3.selectAll('.scaptureline').remove();
  }

  function clearNumberCapturingNextMeanDisplay() {
    $noofnextmeans.text(0);
    $nocapturingnextmean.text(0);
    $pccapturingnextmean.text('0.0%');
  }

  function resetNumberCapturingNextMean() {
    nocapturingnextmeanP = 0;
    nocapturingnextmeanS = 0;
    pccapturingnextmean = 0;
    $noofnextmeans.text(0);
    $nocapturingnextmean.text(0);
    $pccapturingnextmean.text('0.0%');
  }


  /*-------------------------------------------elements and values---------------------------------*/

  //#region respond to all click and select events

  /*-----------------------------------------Panel 1 Population----------------- */
  //change in mu textbox
  $mu.on('change', function() {
    mu = parseFloat($mu.val());
    setMuSigmaSliderVal(mu, sigma);
    stop();
    setOldMu();
    changedDistribution = true;
    clearAll();
  })

  //mu slider
  $muslider.on('change', function() {
    mu = parseFloat($muslider.val());
    setMuSigmaSliderVal(mu, sigma);
    stop();
    setOldMu();
    changedDistribution = true;
    clearAll();
  })

  //change in sigma textbox
  $sigma.on('change', function() {
    sigma = parseFloat($sigma.val());
    setMuSigmaSliderVal(mu, sigma);
    stop();
    setOldSigma();
    changedDistribution = true;
    clearAll();
  })

  //sigma slider
  $sigmaslider.on('change', function() {
    sigma = parseFloat($sigmaslider.val());
    setMuSigmaSliderVal(mu, sigma);
    stop();
    setOldSigma();
    changedDistribution = true;
    clearAll();
  })

  function setOldMu() {
    if (normal)      normalmu    = mu;
    if (rectangular) rectmu      = mu;
    if (skew)        skewmu      = mu;
    if (custom)      custommu    = mu;
  }

  function setOldSigma() {
    if (normal)      normalsigma = sigma;
    if (rectangular) rectsigma   = sigma;
    if (skew)        skewsigma   = sigma;
    if (custom)      customsigma = sigma;
  }

  //normal radio button clicked
  $normal.on('change', function() {
    //check what it was on
    normal = $normal.is(':checked');
    rectangular = false;
    skew = false;
    custom = false;
    changedDistribution = true;

    if (normal) {
      stop();
      clearAll(); //calls drawpdf
    }
  })

  //rectangular
  $rectangular.on('change', function() {
    rectangular = $rectangular.is(':checked');
    normal = false;
    skew = false;
    custom = false;
    changedDistribution = true;

    if (rectangular) {
      clearAll() //calls drawpdf   
      stop();
    }
  })

  //skew
  $skew.on('change', function() {
    skew = $skew.is(':checked');
    normal = false;
    rectangular = false;
    custom = false;
    changedDistribution = true;

    if (skew) {
      stop(); 
      clearAll(); //calls drawpdf   
    }
  })

  //custom
  $custom.on('change', function() {
    custom = $custom.is(':checked');
    normal = false;
    rectangular = false;
    skew = false;
    changedDistribution = true;

    if (custom) {
      stop();
      clearAll(); //calls drawpdf
    }
  })

  //skew amount
  $skewAmount.on('change', function() {
    skewAmount = parseFloat($skewAmount.val());
    changedDistribution = true;
    if (skew) {
      stop();
      clearAll();
    }
    //drawPopulationCurve();
  })

  /*-----------------------------------------------Panel 2 Click to display ---------------*/

  //show population pdf curve
  $showPopulationCurve.on('change', function() {
    showPopulationCurve = $showPopulationCurve.is(':checked');
    if (showPopulationCurve) {
      drawPopulationCurve();
    } 
    else {
      removePopulationCurve();
      removePopnBubbles();
      $fillPopulation.prop('checked', false);
      fillPopulation = false;
    }
  })

  //show mu and sd lines
  $showSDLines.on('change', function() {
    if (!showPopulationCurve) {
      $showSDLines.prop('checked', false);
      return;
    }
    showSDLines = $showSDLines.is(':checked');
    if (showSDLines) drawSDLines(); else removeSDLines();
  })

  //fill the distribution with sample 'bubbles'
  $fillPopulation.on('change', function() {
    if (!showPopulationCurve) {
      $fillPopulation.prop('checked', false);
      return;
    }
    fillPopulation = $fillPopulation.is(':checked');
    if (fillPopulation) {
      // fillPopnBubbles();
      // if (skew || custom) calculateMuSigma();
      // drawPopnBubbles();
 

      //draw curves on top of bubbles. The draw bubbles is called in drawPDF
      if (showPopulationCurve) {
        //fillBubbles = false; //don't want drawPDF to call fillPopnBubbles again
        if (normal)       drawNormalCurve();
        if (rectangular)  drawRectangularCurve();
        if (skew)         drawSkewCurve();
        if (custom)       drawCustomCurve();
        //fillBubbles = true;
      }
      if (showSDLines) drawSDLines();
    } 
    else {
      removePopnBubbles();
    }
  })

  /*---------------------------------------------Panel 3 Controls   (Clear at top)-------------------*/
  //take one sample
  $takeSample.on('click', function() {
    if (runFreely) stop();
    if (Fhalt) clearAll();  //Fhalt reset in clear()
    takeSample();
  })

  //run freely
  $runFreely.on('click', function() {
    if (Fhalt) clearAll();  //Fhalt reset in clear()
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

  /*----------------------------------------------Panel 4 Samples ------------------------- */
  //size of sample
  $n.on('change', function() {
    n = parseInt( $('#samplesselected option:selected').val() );

    //clear everything
    stop();
    clearAll();

    //redisplay +/- moe if sample size changes
    if (plusminusmoe) {
      drawPlusMinusMoe();
    }

  })

  //show sample points
  $showSamplePoints.on('change', function() {
    showSamplePoints = $showSamplePoints.is(':checked');
    if (showSamplePoints) {
      d3.selectAll('.samplepoint').attr('visibility', 'visible');
    }
    else {
      d3.selectAll('.samplepoint').attr('visibility', 'hidden');           
    }
  })

  //show the sample means
  $showSampleMeans.on('change', function() {
    showSampleMeans = $showSampleMeans.is(':checked');
    if (showSampleMeans) {
      displaySampleAppearanceAll();
    }
    else {
      d3.selectAll('.smean').attr('visibility', 'hidden');
      //deselect dropping means as well
      $dropSampleMeans.prop('checked', false);
      dropSampleMeans = $dropSampleMeans.is(':checked');
      stop();
      clearAll();
    }

  })

  //allow means to drop
  $dropSampleMeans.on('change', function() {
    if (!showSampleMeans) {  //cant have drop means if sample mean not selected
      $dropSampleMeans.prop('checked', false);
      return;
    }
    dropSampleMeans = $dropSampleMeans.is(':checked');
    stop();
    clearAll();
    // if (dropSampleMeans) {
    //   resetSamples();
    //   resetCaptureStats();

    // }
    // else { //remove
    //   stop();
    //   clearAll();
    // }
  })

/*-------------------------------------------------Panel 5 Mean Heap ----------------------- */

  $showMeanHeap.on('change', function() {
    if (pvalue) {  //don't allow mean heap
      $showMeanHeap.prop('checked', false);
      return;
    }
    showMeanHeap = $showMeanHeap.is(':checked');
    clearAll();
    d3.selectAll('.selines').attr('visibility', 'visible');
    if (showMeanHeap) {
      //d3.selectAll('.heap').attr('visibility', 'visible');
      if (showSELines) drawSELines(); // draws them at initial height if checked (order important!)
    }
    else {
      d3.selectAll('.heap').attr('visibility', 'hidden');
      d3.selectAll('.selines').attr('visibility', 'hidden');
    }

  })

  //show sample distribution curve
  $showMeanHeapCurve.on('change', function() {
    if (!showMeanHeap) { //can only have a curve if there is a heap, if heap not checked there is no heap.
      $showMeanHeapCurve.prop('checked', false); 
      return;
    }

    showMeanHeapCurve = $showMeanHeapCurve.is(':checked');
    if (showMeanHeapCurve) {
      drawMeanHeapCurve();
    }
    else {
      removeMeanHeapCurve();
      //turn off SE Lines
      $showSELines.prop('checked', false);
      showSELines = false;
      d3.selectAll('.selines').remove();
    }
  })

  //show sample mean and sample error lines
  $showSELines.on('change', function() {
    if (!showMeanHeapCurve) {
      $showSELines.prop('checked', false); 
      return;
    }
    showSELines = $showSELines.is(':checked');
    if (showSELines) {
      //d3.selectAll('.selines').attr('visibility', 'visible');
      if (showMeanHeap) drawSELines();
    }
    else {
      d3.selectAll('.selines').remove();
    }
  })

  $plusminusmoe.on('change', function() {
    plusminusmoe = $plusminusmoe.is(':checked');
    if (plusminusmoe) {
      drawPlusMinusMoe();
    }
    else {
      removePlusMinusMoe();
    }
  })

/*-------------------------------------------------Panel 6 Confidence Intervals --------------*/
 
  //Select confidence interval % and alpha
  $ci.on('change', function() {
     
    stop();
    Fhalt = true;
    //clearAll();

    alpha = parseFloat($ci.val());   
    displaySampleAppearanceAll();
    recalculateSamplemeanStatistics();
    recolourHeap();

    // //I know mu and sigma so I know pmoe so redisplay it
    pmoe = jStat.normal.inv( 1-alpha/2.0, 0, 1 ) * sigma/Math.sqrt(n);
    if (showPopulationCurve) $pmoe.text(pmoe.toFixed(2));

    if (plusminusmoe) drawPlusMinusMoe();
    if (showSELines) drawSELines();

  })

  //show/hide the CI Moe bars?
  $showMoe.on('change', function() {
    showMoe = $showMoe.is(':checked');
    if (!showMoe) {
      //set capture of mu off
      //$captureOfMu.prop('checked', false);
      //captureOfMu = false;
      clearNumberCapturingNextMeanDisplay();
    }
    //clearAll();
    showCapturelines();
    displaySampleAppearanceAll();
    recalculateSamplemeanStatistics(); //which turns on display of captured stats
    recolourHeap();  

    if (captureNextMean) displayCaptureOfNextMeanStats();
  })

  //show moe wings for population
  $showPmoe.on('change', function() {
    showPmoe = $showPmoe.is(':checked');
    showSmoe = $showSmoe.is(':checked');
    showCapturelines();
    displayCaptureOfNextMeanStats();
    displaySampleAppearanceAll();
    recalculateSamplemeanStatistics();
    recolourHeap();
    if (showpvalues) showpvalues();
  })

  //show moe wings for sample
  $showSmoe.on('change', function() {
    showPmoe = $showPmoe.is(':checked');
    showSmoe = $showSmoe.is(':checked');
    showCapturelines();
    displayCaptureOfNextMeanStats();
    displaySampleAppearanceAll();
    recalculateSamplemeanStatistics();
    recolourHeap();

    if (showpvalues) showpvalues();
  })

/*------------------------------------------------Panel 7 Capture of mu-----------------*/

  //show mu line in dropping means area
  $showCaptureMuLine.on('change', function() {
    showCaptureMuLine = $showCaptureMuLine.is(':checked');
    if (showCaptureMuLine) {
      drawMuLine(); 
    }
    else {
      //set capture of mu off
      $captureOfMu.prop('checked', false);
      captureOfMu = false;
      removeMuLine();
    }
    displaySampleAppearanceAll();
    recalculateSamplemeanStatistics(); //which turns on or off display of captured stats
    recolourHeap();

  })

  //show the mean as not captured if known, uknown checked
  $captureOfMu.on('change', function() {
    captureOfMu = $captureOfMu.is(':checked');
    if (!showCaptureMuLine) {
      $captureOfMu.prop('checked', false);
      showCapturelines();
    }
    else {
      //clearAll();
      hideCapturelines();
      displaySampleAppearanceAll();
      recalculateSamplemeanStatistics(); //which turns on display of captured stats
      recolourHeap();
    }
  })

  /*----------------------------------------------Panel 8 Capture of next mean ---------------------*/
  
  //Number capturing next mean  
  $captureNextMean.on('change', function() {
    if (pvalue) {  //don't allow capture of next mean
      $captureNextMean.prop('checked', false);
      return;
    }
    captureNextMean = $captureNextMean.is(':checked');
    if (captureNextMean) {
      $('#capturenextmeangrid').show();
      //showCapturelines();
      stop();
      clearAll();
    }
    else {
      $('#capturenextmeangrid').hide();
      //hideCapturelines();
      stop();
      clearAll();
    }
  })

  /*----------------------------------------------Panel 9 Dance of the p-values -----------------------*/
  
  //show the p-values
  $pvalue.on('change', function() {
    if (captureNextMean) {  //don't allow capture of next mean
      $pvalue.prop('checked', false);
      return;
    }
    pvalue = $pvalue.is(':checked');
    if (pvalue) {
      mu = 60;
      setMuSigmaSliderVal(mu, sigma);
      stop();
      setOldMu();

      $normal.prop('checked', true);
      $rectangular.prop('checked', false);
      $skew.prop('checked', false);
      $custom.prop('checked', false);
      
      normal = true
      rectangular = false;
      skew = false;
      custom = false;
      changedDistribution = true;

      //make sure these are on
      $showPopulationCurve.prop('checked', true);
      showPopulationCurve = true;
  
      $fillPopulation.prop('checked', true);    
      fillPopulation = true;
      
      $showSDLines.prop('checked', 'true');
      showSDLines = true;

      $showSamplePoints.prop('checked', true);
      showSamplePoints = true;
  
      $showSampleMeans.prop('checked', true);
      showSampleMeans = true;
      
      $dropSampleMeans.prop('checked', true);
      dropSampleMeans = true;

      $showMeanHeap.prop('checked', false);
      showMeanHeap = false;

      $showMeanHeapCurve.prop('checked', false);
      showMeanHeap = false;

      $showSELines.prop('checked', false);
      showSELines = false;

      $plusminusmoe.prop('checked', false);
      plusminusmoe = false;
      removePlusMinusMoe();


      $ci.val('0.05');  //95% CI
      alpha = 0.05;

      $showMoe.prop('checked', true);
      showMoe = true;
      $showPmoe.prop('checked', true);
      showPmoe = true;
      showSmoe = false;

      $showCaptureMuLine.prop('checked', true);
      showCaptureMuLine = true;

      $captureOfMu.prop('checked', false);
      captureOfMu = false;

      $captureNextMean.prop('checked', false);
      $('#capturenextmeangrid').hide();
      captureNextMean = false;


      clearAll();

      n = 16;
      $('#samplesselected').val(n);

      $showMoe.prop('checked', 'true');
      showMoe = true;
      alpha = parseFloat($ci.val());
      // //I know mu and sigma so I know pmoe so redisplay it
      pmoe = jStat.normal.inv( 1-alpha/2.0, 0, 1 ) * sigma/Math.sqrt(n);
      if (showPopulationCurve) $pmoe.text(pmoe.toFixed(2));

      drawMu0Line();

      $('#pvaluesoundblock').show();
      $('#pvaluehypothesisblock').show();

      showpvalues();
      displayCohend();
    }
    else {
      $('#pvaluesoundblock').hide();
      $('#pvaluehypothesisblock').hide();

      mu = 50;
      setMuSigmaSliderVal(mu, sigma);
      stop();
      setOldMu();

      normal = true
      rectangular = false;
      skew = false;
      custom = false;
      changedDistribution = true;

      //make sure these are on
      $showPopulationCurve.prop('checked', true);
      showPopulationCurve = true;

      stop();
      clearAll();
 
      $plusminusmoe.prop('checked', false);
      plusminusmoe = false;
      removePlusMinusMoe();

      hidepvalues();
      $pvaluesound.prop('checked', false);
      pvaluesound = false;
      clearCohend()
    }
  })

  //p-value sound
  $pvaluesound.on('change', function() {
    pvaluesound = $pvaluesound.is(':checked');
  })

  $('#volslider').on('change', function() {
    volume = parseFloat($('#volslider').val()/100);
    Howler.volume(volume);
  })

  /*---------------------------------------------Footer ---------------------------------*/

  $('#footer').on('click', function() {
    window.location.href = "https://thenewstatistics.com/";
  })

  //#endregion

   //get values of all checkboxes, radio-buttons and text-boxes etc.
  function getInterfaceElements() {
    $muslider             = $('#muslider');
    $mu                   = $('#muvaluetext');
    $sigmaslider          = $('#sigmaslider');
    $sigma                = $('#sigmavaluetext');

    $normal               = $('#normal');
    $rectangular          = $('#rectangular');
    $skew                 = $('#skew');
    $skewAmount           = $('#skewvalue');
    $custom               = $('#custom');

    $showPopulationCurve  = $('#popn');
    $showSDLines          = $('#sdlines');
    $fillPopulation       = $('#fillpopn');

    $clear                = $('#clearsample');
    $takeSample           = $('#takesample');
    $runFreely            = $('#runfreely');
    $speed                = $('#speed');

    $n                    = $('#samplesselected');
    $N                    = $('#nosamplesx');
    $N2                   = $('#nosamplesy');

    $xbar                 = $('#samplemean');
    $ssd                  = $('#samplesd');
    $pmoe                 = $('#popnmoe');
    $smoe                 = $('#samplemoe');

    $showSamplePoints     = $('#datapoints')
    $showSampleMeans      = $('#samplemeans');
    $dropSampleMeans      = $('#droppingmeans');

    $ci                   = $('#CI');

    $showMoe              = $('#showmoe');
    $showPmoe             = $('#moepopn');
    $showSmoe             = $('#moesample');
    $captureOfMu          = $('#captureofmu');

    $captured             = $('#captured');
    $capturedpercent      = $('#capturedpercent');

    $showMeanHeap         = $('#meanheap');
    $showSELines          = $('#samplelines');
    $showMeanHeapCurve    = $('#samplecurve')

    $plusminusmoe         = $('#plusminusmoe');

    $heapxbar             = $('#xbarhp');
    $heapse               = $('#sehp');

    $curveHeapSE          = $('#curveheapse');

    $noInHeap             = $('#numberinheap');

    $showCaptureMuLine    = $('#capturemuline');

    $captureNextMean      = $('#capturenextmean');

    $noofnextmeans        = $('#noofnextmeans');
    $nocapturingnextmean  = $('#nocapturingnextmean');
    $pccapturingnextmean  = $('#pccapturingnextmean');

    $pvalue               = $('#pvalue');
    $pvaluesound          = $('#pvaluesound');

    $tooltipsonoff        = $('#tooltipsonoff');
  }

  //get the value or status of all ui interface elements (how many of these do I need at this place?)
  function getInterfaceValues() {
    mu                    = parseFloat($mu.val());
    sigma                 = parseFloat($sigma.val());

    normal                = $normal.is(':checked');
    rectangular           = $rectangular.is(':checked');
    skew                  = $skew.is(':checked');
    skewAmount            = $skewAmount.text();
    custom                = $custom.is(':checked');

    speed                 = parseInt($speed.val());

    showPopulationCurve   = $showPopulationCurve.is(':checked');
    showSDLines           = $showSDLines.is(':checked');
    fillPopulation        = $fillPopulation.is(':checked');

    n                     = parseInt($('#samplesselected option:selected').val());
    N                     = parseInt($N.text());

    xbar                  = parseFloat($xbar.text());  
    ssd                   = parseFloat($ssd.text()); 

    alpha                 = parseFloat($('#CI option:selected').val());

    showMoe               = $showMoe.is(':checked');
    pmoe                  = parseFloat($pmoe.text()); 
    smoe                  = parseFloat($smoe.text());  
    captureOfMu           = $captureOfMu.is(':checked');

    showSamplePoints      = $showSamplePoints.is(':checked');
    showSampleMeans       = $showSampleMeans.is(':checked');
    dropSampleMeans       = $dropSampleMeans.is(':checked');

    showPmoe              = $showPmoe.is(':checked');
    showSmoe              = $showSmoe.is(':checked');

    showMeanHeap          = $showMeanHeap.is(':checked');
    showSELines           = $showSELines.is(':checked');
    showMeanHeapCurve     = $showMeanHeapCurve.is(':checked');
    plusminusmoe          = $plusminusmoe.is(':checked');

    heapxbar              = parseFloat($heapxbar.text());
    heapse                = parseFloat($heapse.text());

    showCaptureMuLine     = $showCaptureMuLine.is(':checked');

    captureNextMean      = $captureNextMean.is('checked');

    pvalue               = $pvalue.is(':checked');
    pvaluesound          = $pvaluesound.is(':checked');

    //tooltipsonoff        = $tooltipsonoff.is('checked');

  }

  //not convinced this is the right way, but seems okay for now
  $(window).bind('resize', function(e){
    window.resizeEvt;
    $(window).resize(function(){
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function(){
          setDisplay();
        }, 500);
    });
  });

  //helper function for testing
  function lg(s) {
    console.log(s);
  }


/*---------------------------------------------------Tooltips-----------------------------------*/
  //tooltips
  //add a data-tooltip attribute to all tooltippable elements and then figure out which one was hovered over?
  //It's a first go and I don't like it!!! Still go the text at any rate.

  function setTooltips() {
    Tipped.setDefaultSkin('esci');

    Tipped.create('#logo', 'Version: '+version, { skin: 'red', size: 'versionsize', behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //heading section
    Tipped.create('#tooltipsonoff',        'Tips on/off, default is off!',                                  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });


    //Tipped.create('.headingtip',           'https://thenewstatistics.com ',                                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.hometip',               'Click to return to esci Home',                                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });


    //1. The population section
    Tipped.create('#populationdisplaydiv', 'The Population: Choose population parameters and shape',        { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.mutip',                'Mean. Use slider or type in value, min 0, max 100',             { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.sigmatip',             'SD Use slider or type in value',                                { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.skewtip',              'Use dropdown to select amount of skew',                         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.customtip',            'Click and drag from left to right to draw your own shape',      { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });


    //2. Click to display section
    Tipped.create('#displayoptionsdiv',    'Choose what’s displayed in upper panel',                        { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.popntip',              'Display the curve',                                             { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.sdlinestip',           'Display lines to mark &mu;, and SD units either side of &mu;',  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.fillpopntip',          'Display circles to mark some population data points',           { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //3. Run controls section
    Tipped.create('#runcontrolsdiv',       'Buttons control sampling',                                      { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#clearsample',          'Clear samples, ready for new run',                              { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#takesample',           'Take one independent random sample',                            { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#runfreely',            'Start or stop sampling',                                        { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#speed',                'Set sampling speed',                                            { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //4. Samples section
    Tipped.create('#samplelabel',          'Choose sample size, see number of samples in current run, see information about latest sample', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.ntip',                 'Use dropdown to select sample size',                            { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#nosamples',            'Number in current run',                                         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.musampletip',          'Mean of latest sample',                                         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.sdsampletip',          'SD of latest sample',                                           { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.moeptip',              'Calculated assuming &sigma; known',                             { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.moestip',              'Calculated using <em>s</em> of latest sample',                  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });


    Tipped.create('.datapointstip',        'Display dot plot of latest sample',                             { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.samplemeanstip',       'Display mean of latest sample',                                 { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.droppingmeanstip',     'Display dance of the means',                                    { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //5. Mean heap section
    Tipped.create('#heapsectionspan',      'Heap of sample means in the current run',                       { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.meanheaptip',          'Display heap',                                                  { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.samplecurvetip',       'Sampling distribution curve: Display the normal distribution that is the theoretically expected sampling distribution of means, in the long run, according to the central limit theorem. Curve is scaled vertically for approximate fit to current heap', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.samplelinestip',       'Display lines to mark &mu; and SE units either side of &mu;',   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.plusminusmoetip',      'Display stripe at bottom and vertical lines to mark this interval, which is the length of CIs when &sigma; is known', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.meanheapMtip',         'Mean of means in the heap  ',                                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.meanheapsetip',        'SD of means in the heap',                                       { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.curveheapsetip',       'SD of the sampling distribution curve',                         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.nomeansinheaptip',     'Number that have dropped down into the heap',                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //6. CI section
    Tipped.create('#confidenceintervalsdiv', 'CIs on sample means',                                         { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.cipcnttip',            'Use dropdown to select confidence level',                       { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.showmoetip',           'Display CIs on means',                                          { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('.moeknowntip',          'Assume &sigma; is known ',                                      { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.moeunknowntip',        'Assume &sigma; is not known',                                   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //7. Capture of mean
    Tipped.create('#captureofmupanel',     'Explore the capture of &mu; by CIs',                               { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.capturemulinetip',     'Display line to mark &mu;',                                     { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.capturemutip',         'Turn on colours to indicate capture, red CIs do not capture &mu;', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    
    
    Tipped.create('#numbercapturingdiv',   'Number of CIs in current run that capture &mu;',                { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#nosamplesydiv',        'Total number of samples in current run',                        { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#capturedpercentdiv',   'Percent of CIs in current run that capture &mu;',               { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    //8.Capture of next mean
    Tipped.create('.capturenextmeantip', 'Explore capture by CIs of the next mean, which is the mean just above a CI in the dance. When a CI does NOT capture, a pink diagonal line joins a limit of the CI up to the mean just above. Cannot have both \'Capture of next mean\' and \'Dance of the <em>p</em> values\' visible at once.', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('#numberofnextmeansdiv',        'Number of means available for capture, one less than number of samples in current run', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#numbercapturingnextmeandiv',  'Number of CIs that capture next mean in current run',    { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#percentcapturingnextmeandiv', 'Percent of CIs in current run that capture next mean',   { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    
    //9. p values
    Tipped.create('.danceptip',                   'Display dance of the <em>p</em> values. Cannot have both \'Capture of next mean\' and \'Dance of the <em>p</em> values\' visible at once.',                          { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.psound',                      'Turn on sounds, may need a slow sampling rate to hear every sound', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('.volumetip',                   'Set volume',                                             { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });

    Tipped.create('#nullhypothesislabel',         '&mu;0=50: Fixed null hypothesis value, marked by vertical line', { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    Tipped.create('#cohensdlabel',                "Cohen’s &delta;<x>: Population effect size in units of &sigma;, so &delta; = (&mu; – &mu;0) / &sigma; ", { skin: 'esci', size: 'xlarge', showDelay: 750, behavior: 'mouse', target: 'mouse', maxWidth: 250, hideOthers: true, hideOnClickOutside: true, hideAfter: 0 });
    

    //get all tooltips with a data-tooltip attribute
    Tipped.disable('[data-tooltip]');
  }

  $tooltipsonoff.on('click', function() {
    if (tooltipsonoff) {
      tooltipsonoff = false;
      $tooltipsonoff.css('background-color', 'lightgrey');
      Tipped.disable('[data-tooltip]');
    }
    else {
      tooltipsonoff = true;
      $tooltipsonoff.css('background-color', 'lightgreen');
      Tipped.enable('[data-tooltip]');

      Tipped.delegate('#subheading', {
        skin: 'blue'
      })
    }
  })


}) //end of jQuery
//}) //end of window.load

//ref for specific code samples.
//https://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed

//ref for continuously updating the mean and sd
//https://www.physicsforums.com/threads/updating-the-mean-and-sd-of-a-set-efficiently.526280/ https://www.physicsforums.com/threads/updating-the-mean-and-sd-of-a-set-efficiently.526280/ 