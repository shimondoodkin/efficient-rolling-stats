if(require.main === module) { var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, }); }


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

function RollingxAvgPerIndex(WindowSize,UsualIndexSkipBetweenOccations)// generator
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

function DelayIndex(WindowSize,UsualIndexSkipBetweenOccations)// generator, expects some high frequency of time inserts because if there will be a delay or no inserts it will stop working;
{
    var DequeIndex=[],DequeValue=[],T=WindowSize,PrevIndex=false,U=UsualIndexSkipBetweenOccations;
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
    atEveryStepDo.reset=function(WindowSize){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);PrevIndex=false;};
    return atEveryStepDo;
}

//example1: // you can compose all sorts of functions like this, this is a simple one

function AllStats(size,delay,timesize,usualtime,timedelay)
{
    var min=RollingMin(size)
   ,max=RollingMax(size)
   ,avg=RollingAvg(size)
   ,avgtime=RollingAvg(size)
   ,tmin=RollingMinIndex(size)
   ,tmax=RollingMaxIndex(size)
   ,wavg=RollingxAvgPerIndex(timesize,usualtime)// once in two seconds a value
   ,min_delay=Delay(delay)
   ,max_delay=Delay(delay)
   ,avg_delay=Delay(delay)
   ,avgtime_delay=Delay(delay)
   ,tmin_delay=Delay(delay)
   ,tmax_delay=Delay(delay)
   ,wavg_delay=DelayIndex(timedelay,usualtime)
   
   var prev=false;

    function stats(n,t)
    {
     var o={}
     
     o.min=min(n)
     o.max=max(n)
     o.avg=avg(n)
     
     o.tmin=tmin(n)
     o.tmax=tmax(n)
     o.wavg=wavg(n,t)
     
     if(prev===false) var prev=t-usualtime
     var delta=t-prev;
     o.avgtime=avgtime(delta)
     
     o.min_delay=min_delay(o.min)
     o.max_delay=max_delay(o.max)
     o.avg_delay=avg_delay(o.avg)
     o.avgtime_delay=avgtime_delay(o.avgtime)

     o.tmin_delay=tmin_delay(o.tmin)
     o.tmax_delay=tmax_delay(o.tmax)
     o.wavg_delay=wavg_delay(o.wavg)
       
     return o;
    }
    stats.reset=function()
    {
     min.reset();
     max.reset();
     avg.reset();
     avgtime.reset();
     tmin.reset();
     tmax.reset();
     wavg.reset();
     min_delay.reset();
     max_delay.reset();
     avg_delay.reset();
     avgtime_delay.reset();
     tmin_delay.reset();
     tmax_delay.reset();
     wavg_delay.reset();
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

module.RollingMin=RollingMin;
module.RollingMax=RollingMax;
module.RollingAvg=RollingAvg;
module.RollingMinIndex=RollingMinIndex;
module.RollingMaxIndex=RollingMaxIndex;
module.RollingxAvgPerIndex=RollingxAvgPerIndex;
module.Delay=Delay;
module.DelayIndex=DelayIndex;
module.AllStats=AllStats;
module.SimpleStats=SimpleStats;
module.SimpleStatsNoDelay=SimpleStatsNoDelay;

/*
example:

var stats=AllStats(101,50,15*60000,0.25*60000,7.5*60000)
stats(Math.random()*100,new Date().getTime())

simple examples:
 
min=RollingMin(4);// use generator
 
> min(3)
3
> min(3)
3
> min(3)
3
> min(2)
2
> min(4)
2
> min(4)
2
> min(4)
2
> min(4)
4
>
 
max=RollingMax(4);// use generator
 max(1)
1
> max(1)
1
> max(3)
3
> max(2)
3
> max(2)
3
> max(2)
3
> max(2)
2
>
 
mint=RollingMinIndex(4000);// min values of last 4 seconds
> mint(3,new Date().getTime()+   0);
3
> mint(4,new Date().getTime()+1000);
3
> mint(3,new Date().getTime()+2000);
3
> mint(5,new Date().getTime()+5000);
3
> mint(6,new Date().getTime()+10000);
5
> mint(7,new Date().getTime()+20000);
6
> mint(8,new Date().getTime()+30000);
7
 
 
*/


/*
function running_stats(items,time)
{
    var length_items=items
    var length_time=time;
    
    this.queue_items=[],this.sum_items=0;
    this.queue_items_min=[],this.sum_items=0;
    
    var queue_time=[],sum_items=0;
    var queue_time=[],sum_items=0;
    
    this.items_add=function (a)
    {
     this.queue_items.push(a)
     this.sum_items+=a;
     while(this.queue_items.length>length_items)
      this.sum_items-=this.queue_items.shift();
    }

    this.items_avg=function ()
    {
     if(this.queue_items.length==0) return 0;
     return this.sum_items/this.queue_items.length;
    }
    
    this.items_sum =function ()
    {
     return this.sum_items;
    }
   return this;
}

if(require.main === module) global.running_stats=running_stats
else module.exports=running_stats;


if(require.main === module) 
{
 global.stats=new running_stats(5,5)
 global.stats.items_add(7)
 global.stats.items_add(5)
 global.stats.items_add(2)
 console.log( global.stats.items_avg() )
}

*/