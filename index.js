//if(require.main === module) { var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, }); }


//rolling min max in probably fast javascript, if you treat javascript as c it is fast as c, i.e. no object arrays
/*

This is the algorithm from http://stackoverflow.com/a/12195098/466363:

        at every step:

          if (!Deque.Empty) and (Deque.Head.Index <= CurrentIndex - T) then 
             Deque.ExtractHead;
          //Head is too old, it is leaving the window

          while (!Deque.Empty) and (Deque.Tail.Value > CurrentValue) do
             Deque.ExtractTail;
          //remove elements that have no chance to become minimum in the window

          Deque.AddTail(CurrentValue, CurrentIndex); 
          CurrentMin = Deque.Head.Value
          //Head value is minimum in the current window
          
  
*/
// https://gist.github.com/shimondoodkin/f274d6e17c66a8b72779
 
function RollingMin(WindowSize)// generator
{
    var DequeIndex=[],DequeValue=[],CurrentIndex=0,T=WindowSize;
    function atEveryStepDo(CurrentValue)
    {
      if ( DequeIndex.length!==0 && DequeIndex[0] <= CurrentIndex - T ) 
      {
         DequeIndex.shift();
         DequeValue.shift();
      }
      //Head is too old, it is leaving the window
 
      while ( DequeValue.length!==0 && DequeValue[DequeValue.length-1] > CurrentValue )
      {
         DequeIndex.pop();
         DequeValue.pop();
      }
      //remove elements that have no chance to become minimum in the window
 
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 
      CurrentIndex++;
      return DequeValue[0] //Head value is minimum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);CurrentIndex=0;};
    return atEveryStepDo;
}

function RollingMax(WindowSize)// generator
{
    var DequeIndex=[],DequeValue=[],CurrentIndex=0,T=WindowSize;
    function atEveryStepDo(CurrentValue)
    {
      if ( DequeIndex.length!==0 && DequeIndex[0] <= CurrentIndex - T ) 
      {
         DequeIndex.shift();
         DequeValue.shift();
      }
      //Head is too old, it is leaving the window
 
      while ( DequeValue.length!==0 && DequeValue[DequeValue.length-1] < CurrentValue )
      {
         DequeIndex.pop();
         DequeValue.pop();
      }
      //remove elements that have no chance to become maxbimum in the window
 
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 
      CurrentIndex++;
      return DequeValue[0] //Head value is maximum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);CurrentIndex=0;};
    return atEveryStepDo;
}


function RollingAvg(WindowSize)// generator
{
    var DequeValue=[],T=WindowSize,Sum=0;
    function atEveryStepDo(CurrentValue)
    {
      if ( DequeValue.length >= T ) 
      {
         Sum-=DequeValue.shift();
      }
      //Head is too old, it is leaving the window
 
      DequeValue.push(CurrentValue); 
      Sum+=CurrentValue;
      return Sum/DequeValue.length //Head value is maximum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(WindowSize){Sum=0;DequeValue.splice(0,DequeValue.length);};
    return atEveryStepDo;
}
 

function RollingMinIndex(WindowSize)// generator
{
    var DequeIndex=[],DequeValue=[],T=WindowSize;
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      while ( DequeIndex.length!==0 && DequeIndex[0] <= CurrentIndex - T ) 
      {
         DequeIndex.shift();
         DequeValue.shift();
      }
      //Head is too old, it is leaving the window
 
      while ( DequeValue.length!==0 && DequeValue[DequeValue.length-1] > CurrentValue )
      {
         DequeIndex.pop();
         DequeValue.pop();
      }
      //remove elements that have no chance to become minimum in the window
 
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 
      return DequeValue[0] //Head value is minimum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);};
    return atEveryStepDo;
}

function RollingMaxIndex(WindowSize)// generator
{
    var DequeIndex=[],DequeValue=[],T=WindowSize;
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      while ( DequeIndex.length!==0 && DequeIndex[0] <= CurrentIndex - T ) 
      {
         DequeIndex.shift();
         DequeValue.shift();
      }
      //Head is too old, it is leaving the window
 
      while ( DequeValue.length!==0 && DequeValue[DequeValue.length-1] < CurrentValue )
      {
         DequeIndex.pop();
         DequeValue.pop();
      }
      //remove elements that have no chance to become maxbimum in the window
 
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 
      return DequeValue[0] //Head value is maximum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);};
    return atEveryStepDo;
}

function RollingAvgIndex(WindowSize)// generator
{
    var DequeIndex=[],DequeValue=[],T=WindowSize,Sum=0;
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      while ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) && DequeIndex[0]!=CurrentIndex)  // do not remove current index so you will be able to make an avarage to not devide by zero, because current-current =zero assumes raising order in the index and window size of at last two
      {
         DequeIndex.shift();
         Sum-=DequeValue.shift();
      }
      
      //Head is too old, it is leaving the window
      
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 

      Sum+=CurrentValue;

      return Sum/DequeValue.length //Head value is minimum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);Sum=0;};
    return atEveryStepDo;
}

function RollingSumPerIndex(WindowSize,UsualIndexSkipBetweenOccations)// generator
{
    var DequeIndex=[],DequeValue=[],T=WindowSize,Sum=0,PrevIndex=false,U=UsualIndexSkipBetweenOccations;
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      while ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) && DequeIndex[0]!=CurrentIndex)  // do not remove current index so you will be able to make an avarage to not devide by zero, because current-current =zero assumes raising order in the index and window size of at last two
      {
         PrevIndex=DequeIndex.shift();
         Sum-=DequeValue.shift();
      }
      if(PrevIndex===false)PrevIndex=CurrentIndex-U;
      
      //Head is too old, it is leaving the window
      
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 

      Sum+=CurrentValue;
      var Div=CurrentIndex-PrevIndex;

      if(Div==0)Div=U;
      return Sum/Div //Head value is minimum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.setUsualIndexSkipBetweenOccations=function(UsualIndexSkipBetweenOccations){U=UsualIndexSkipBetweenOccations};
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);Sum=0;PrevIndex=false;};
    return atEveryStepDo;
}

function Delay(WindowSize,UndefinedValue)
{
    var DequeValue=[],T=WindowSize,U=UndefinedValue;
    function atEveryStepDo(CurrentValue)
    {
      DequeValue.push(CurrentValue); 
      if( DequeValue.length== T ) 
      {
        return  DequeValue.shift();
      }
      return U;
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.setUndefinedValue=function(WindowSize){U=UndefinedValue};
    atEveryStepDo.reset=function(WindowSize){DequeValue.splice(0,DequeValue.length);};
    return atEveryStepDo;
}

function DelayIndex(WindowSize,UsualIndexSkipBetweenOccations,UndefinedValue)// generator, expects some high frequency of time inserts because if there will be a delay or no inserts it will stop working;
{
    var DequeIndex=[],DequeValue=[],T=WindowSize,PrevIndex=false,PrevValue=UndefinedValue,U=UsualIndexSkipBetweenOccations;
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 
      if(PrevIndex===false)PrevIndex=CurrentIndex-U;

      while ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) )  
      {
         PrevIndex=DequeIndex.shift();
         PrevValue=DequeValue.shift();
      }
      return PrevValue;
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.setUsualIndexSkipBetweenOccations=function(UsualIndexSkipBetweenOccations){U=UsualIndexSkipBetweenOccations};
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);PrevIndex=false;PrevValue=UndefinedValue};
    return atEveryStepDo;
}

//example1: // you can compose all sorts of functions like this, this is a simple one
/*
var Stats=require('efficient-rolling-stats');
//useful: 
// var stats=Stats.AllStats(101,50,15,0.25,7.5) // sample for 15 minutes and usually the input is every 15 seconds so the first input will be more or less not outlier,delay the timed input by 7.5 minutes
//for testing:
var stats=Stats.AllStats(11,5,1,0.25,0.5) // sample for 15 minutes and usually the input is every 15 seconds so the first input will be more or less not outlier,delay the timed input by 7.5 minutes
setInterval(function(){stats(Math.random()*100,new Date().getTime()/60000)},1500) // input in minutes,  than also the configuratin arguments can be in minutes
stats(Math.random()*100,new Date().getTime()/60000)
*/    
function AllStats(size,delay,timesize,usualtime,timedelay)
{
    var min=RollingMin(size)
   ,max=RollingMax(size)
   ,avg=RollingAvg(size)
   ,avgtime=RollingAvg(size)
   ,stdev=RollingAvg(size)
   ,zavg=RollingAvg(size)
   ,tmin=RollingMinIndex(timesize)
   ,tmax=RollingMaxIndex(timesize)
   ,tavg=RollingAvgIndex(timesize)
   ,tzavg=RollingAvgIndex(timesize)
   ,tstdev=RollingAvgIndex(timesize)
   ,tsum=RollingSumPerIndex(timesize,usualtime)// once in two seconds a value
   ,value_delay=Delay(delay) // because i can't move the indicators forewared but i can move the number backwards so it will match with the lagging indicators
   ,tvalue_delay=DelayIndex(timedelay,usualtime)
   ,index_delay=Delay(delay) // add the coresponding index to the delaied value, the other option is not to dalay anything and offset it the presentation
   ,tindex_delay=DelayIndex(timedelay,usualtime)
   ,prev=false
   ,count=0
   ,tcount=0;
   
    function stats(n,t)
    {
     var o={}
     

     o.min=min(n)
     o.max=max(n)
     o.avg=avg(n)
     
     o.stdev=Math.sqrt(stdev(Math.pow(n-o.avg,2)))
     o.z=o.stdev==0?0:(n-o.avg)/o.stdev
     o.zavg=zavg(o.z)
     
     o.tmin=tmin(n,t)
     o.tmax=tmax(n,t)
     o.tavg=tavg(n,t)
     o.tsum=tsum(n,t)
     o.tstdev=Math.sqrt(tstdev(Math.pow(n-o.tavg,2),t))
     o.tz=o.tstdev==0?0:(n-o.tavg)/o.tstdev
     o.tzavg=tzavg(o.tz,t)
     
     if(prev===false) prev=t-usualtime;     var delta=t-prev; prev=t;     o.avgtime=avgtime(delta) // to have result in minutes
	 
	 o.count=count;count++;// it is good ide to have count to skip the initial
	 o.tcount=tcount;tcount+=delta;
	 
     o.value_delay=value_delay(n);
     o.tvalue_delay=tvalue_delay(n,t);
     o.index_delay=index_delay(t);
     o.tindex_delay=tindex_delay(t,t);
       
     return o;
    }
    stats.reset=function()
    { // copy paste list from above regexp replace: search "=.+" replace with: ".reset\(\)" , replace the "," with "  " - 2 spaces.
     min.reset()
     max.reset()
     avg.reset()
     avgtime.reset()
     stdev.reset()
     zavg.reset()
     tmin.reset()
     tmax.reset()
     tavg.reset()
     tzavg.reset()
     tstdev.reset()
     tsum.reset()
     value_delay.reset()
     tvalue_delay.reset()
	 index_delay.reset()
     tindex_delay.reset()
     prev=false;
	 count=0;
    }
    return stats;
}

//example2:

function SimpleStats(size,delay)
{
    var min=RollingMin(size)
   ,max=RollingMax(size)
   ,avg=RollingAvg(size)
   ,min_delay=Delay(delay)
   ,max_delay=Delay(delay)
   ,avg_delay=Delay(delay)

    function stats(n)
    {
     var o={}
     
     o.min=min(n)
     o.max=max(n)
     o.avg=avg(n)
     
     o.min_delay=min_delay(o.min)
     o.max_delay=max_delay(o.max)
     o.avg_delay=avg_delay(o.avg)
       
     return o;
    }
    
    stats.reset=function()
    {
     min.reset();
     max.reset();
     avg.reset();
     min_delay.reset();
     max_delay.reset();
     avg_delay.reset();
    }
    return stats;
}

//example3: 
function SimpleStatsNoDelay(size)
{
    var min=RollingMin(size)
   ,max=RollingMax(size)
   ,avg=RollingAvg(size)
 

    function stats(n)
    {
     var o={}
     
     o.min=min(n)
     o.max=max(n)
     o.avg=avg(n)

     return o;
    }
    stats.reset=function()
    {
     min.reset();
     max.reset();
     avg.reset();
    }
    return stats;
}

exports.RollingMin=RollingMin;
exports.RollingMax=RollingMax;
exports.RollingAvg=RollingAvg;
exports.RollingMinIndex=RollingMinIndex;
exports.RollingMaxIndex=RollingMaxIndex;
exports.RollingAvgIndex=RollingAvgIndex;
exports.RollingSumPerIndex=RollingSumPerIndex;
exports.Delay=Delay;
exports.DelayIndex=DelayIndex;
exports.AllStats=AllStats;
exports.SimpleStats=SimpleStats;
exports.SimpleStatsNoDelay=SimpleStatsNoDelay;
