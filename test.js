var Stats=require('./index.js')

var min1=Stats.RollingMin(2);
if(min1(2)!=2) console.log(new Error('RollingMin error').stack);
else if(min1(1)!=1) console.log(new Error('RollingMin error').stack);
else if(min1(2)!=1) console.log(new Error('RollingMin error').stack);
else  console.log('RollingMin ok');


var max1=Stats.RollingMax(2);
if(max1(1)!=1) console.log(new Error('RollingMax error').stack);
else if(max1(2)!=2) console.log(new Error('RollingMax error').stack);
else if(max1(1)!=2) console.log(new Error('RollingMax error').stack);
else  console.log('RollingMax ok');

var avg1=Stats.RollingAvg(2);
if(avg1(1)!=1) console.log(new Error('RollingAvg error').stack);
else if(avg1(2)!=1.5) console.log(new Error('RollingAvg error').stack);
else  console.log('RollingAvg ok');

var median1=Stats.RollingMedian(3);
if(median1(1)!=1) console.log(new Error('RollingMedian error').stack);
else if(median1(2)!=1.5) console.log(new Error('RollingMedian error').stack);
else if(median1(3)!=2) console.log(new Error('RollingMedian error').stack);
else if(median1(4)!=3) console.log(new Error('RollingMedian error').stack);
else  console.log('RollingMedian ok');


console.log('');



var min1=Stats.RollingMinIndex(2);
if(min1(2,1)!=2) console.log(new Error('RollingMinIndex error').stack);
else if(min1(1,2)!=1) console.log(new Error('RollingMinIndex error').stack);
else if(min1(2,3)!=1) console.log(new Error('RollingMinIndex error').stack);
else  console.log('RollingMinIndex ok');


var max1=Stats.RollingMaxIndex(2);
if(max1(1,1)!=1) console.log(new Error('RollingMaxIndex error').stack);
else if(max1(2,2)!=2) console.log(new Error('RollingMaxIndex error').stack);
else if(max1(1,3)!=2) console.log(new Error('RollingMaxIndex error').stack);
else  console.log('RollingMaxIndex ok');

var avg1=Stats.RollingAvgIndex(2);
if(avg1(1,1)!=1) console.log(new Error('RollingAvgIndex error').stack);
else if(avg1(2,2)!=1.5) console.log(new Error('RollingAvgIndex error').stack);
else  console.log('RollingAvgIndex ok');


var median1=Stats.RollingMedianIndex(3); 
if(median1(1,1)!=1) console.log(new Error('RollingMedianIndex error').stack);
else if(median1(2,2)!=1.5) console.log(new Error('RollingMedianIndex error').stack);
else if(median1(3,3)!=2) console.log(new Error('RollingMedianIndex error').stack);
else if(median1(4,4)!=3) console.log(new Error('RollingMedianIndex error').stack);
else  console.log('RollingMedianIndex ok');

var sumper1=Stats.RollingSumPerIndex(2,1);
if(sumper1(1,1)!=1) console.log(new Error('RollingSumPerIndex error').stack);
else if(sumper1(1,2)!=1) console.log(new Error('RollingSumPerIndex error').stack);
else if(sumper1(1,3)!=1) console.log(new Error('RollingSumPerIndex error').stack);
else  console.log('RollingSumPerIndex ok');


console.log('');


var delay1=Stats.Delay(2);
if(delay1(1)!==undefined) console.log(new Error('Delay error').stack);
else if(delay1(2)!==undefined) console.log(new Error('Delay error').stack);
else if(delay1(3)!=1) console.log(new Error('Delay error').stack);
else if(delay1(4)!=2) console.log(new Error('Delay error').stack);
else  console.log('Delay ok');

var delay1=Stats.DelayIndex(2,1);
if(delay1(1,1)!==undefined) console.log(new Error('DelayIndex error').stack);
else if(delay1(2,2)!==undefined) console.log(new Error('DelayIndex error').stack);
else if(delay1(3,3)!=1) console.log(new Error('DelayIndex error').stack);
else if(delay1(4,4)!=2) console.log(new Error('DelayIndex error').stack);
else  console.log('DelayIndex ok');


var smooth=Stats.smooth6(3,3,3,3,3,3);


console.log(smooth(1,1));
console.log(smooth(2,2));
console.log(smooth(3,3));
console.log(smooth(4,4));
console.log(smooth(5,5));
console.log(smooth(4,6));
console.log(smooth(3,7));
console.log(smooth(2,8));
console.log(smooth(1,9));
console.log(smooth(0,10));
console.log(smooth(-1,11));
console.log(smooth(-2,12));
console.log(smooth(-3,13));
console.log(smooth(-4,14));
console.log(smooth(-5,15));
console.log(smooth(-6,16));
console.log(smooth(-7,17));
console.log(smooth(-8,18));
console.log(smooth(-9,19));
console.log(smooth(-10,20));
console.log(smooth(-11,21));
console.log(smooth(-12,22));
console.log(smooth(-13,23));

/*
exports.AllStats=AllStats;
exports.SimpleStats=SimpleStats;
exports.SimpleStatsNoDelay=SimpleStatsNoDelay;

exports.PositiveLately=PositiveLately;
exports.PositiveLatelyIndex=PositiveLatelyIndex;

exports.RollingHistogram=RollingHistogram;
exports.RollingHistogramIndex=RollingHistogramIndex;

exports.smooth3=smooth3;
exports.smooth6=smooth6;
*/