javascript efficient-rolling-stats
===================================

rolling/running statistics in javascript

    npm install efficient-rolling-stats 


#### RollingMin(WindowSize)

 returns `function atEveryStep(number){ return result }`
 
 atEveryStep usualy has:
 
 * `atEveryStep.setWindowSize(WindowSize)`
 * `atEveryStep.reset()`
 

#### RollingMax(WindowSize)

 returns `function atEveryStep(number){ return result }`
 
#### RollingAvg(WindowSize)

 returns `function atEveryStep(number){ return result }`
 
#### RollingMinIndex(WindowSize)

 returns `function atEveryStep(number,index){ return result }`
 
 the index argument can be not continious like time in seconds or miliseconds
 to have minimum of last 5 minutes for example,
 or it can be 1 for increasing by 1 integers.
 index expected to be an increasing number.

#### RollingMaxIndex(WindowSize)

 returns `function atEveryStep(number,index){ return result }`
 
 the index argument can be not continious like time in seconds or miliseconds

 
#### RollingAvgIndex(WindowSize)

 returns `function atEveryStep(number,index){ return result }`
 
 the index argument can be not continious like time in seconds or miliseconds

#### RollingSumPerIndex(WindowSize,UsualIndexSkipBetweenOccations)

 this function is calculates average rate: Sum/(LastIndex-FirstIndex)
 like in stocks total volume per minute in the last minute
 
 if index is in miliseconds and you average frame size than it calculates rolling frames per millisecond
 input index can be a float number in terms of seconds to have frames per second
 and or in minutes to have per minute result.
 at the first time this function uses UsualIndexSkipBetweenOccations as sum devisor to calculate avarage.
 it does it by substructing from first time UsualIndexSkipBetweenOccations and calculating the delta
 so it is UsualIndexSkipBetweenOccations at the first time, and all times until window size is reached
 the input should be quite timely otherwise the result is delayed too much i think. 
 maybe functions like this should be bound to a clock and work with event emiter. but i implemented it anyways.
 
 returns `function atEveryStep(number,index){ return result }`
 
 the index argument can be not continious like time in seconds or miliseconds
 
 also atEveryStep has:
 
 * `atEveryStep.setUsualIndexSkipBetweenOccations(UsualIndexSkipBetweenOccations)`

#### Delay(WindowSize)

 this function delayes the input by window size

 returns `function atEveryStep(number){ return result }`
 
#### DelayIndex(WindowSize,UsualIndexSkipBetweenOccations)

 this function delayes the input by window size, using index
 this function is similar to `RollingxAvgPerIndex` function
 the input should be quite timely otherwise the result is delayed too much i think.
 
 returns `function atEveryStep(number,index){ return result }`
 
 the index argument can be not continious like time in seconds or miliseconds
 
 also atEveryStep has:
 
 * `atEveryStep.setUsualIndexSkipBetweenOccations(UsualIndexSkipBetweenOccations)` 

### Example functions in Code

#### SimpleStats(WindowSize,Delay)
 
 this is a simple example function of how to combine multiple stats together with delays
 
 <u>generally you should write such function for your self to choose which stats you want</u>
 
 returns `stats(number){ return result_object }` 
 
 `stats` has: 
 * `stats.reset()`

    
function source:

```
    var Stats=require('efficient-rolling-stats');
    function SimpleStats(size,delay)
    {
       var min=Stats.RollingMin(size)
       ,max=Stats.RollingMax(size)
       ,avg=Stats.RollingAvg(size)
       ,value_delay=Stats.Delay(delay)
       
       function stats(n)
       {
         var o={}
         o.min=min(n)
         o.max=max(n)
         o.avg=avg(n)
         
         o.value_delay=value_delay(n)
         
         return o;
       }
       
       stats.reset=function()
       {
         min.reset();
         max.reset();
         avg.reset();
         
         value_delay.reset();
       }
       return stats;
    }
````

#### SimpleStatsNoDelay(WindowSize)

 anoher simple example function combines multiple stats together without delays

 returns ```stats(number){ return result_object }```

function source:

        var Stats=require('efficient-rolling-stats');
        function SimpleStatsNoDelay(size)
        {
            var min=Stats.RollingMin(size)
           ,max=Stats.RollingMax(size)
           ,avg=Stats.RollingAvg(size)
         
         
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

#### AllStats(WindowSize,Delay,TimeWindowSize,UsualTimeSkip,TimeDelay)

 this example contains many possibilities

 returns ```stats(number,index){ return result_object }```

 function source:
 
    var Stats=require('efficient-rolling-stats');
	function AllStats(size,delay,timesize,usualtime,timedelay)
	{
		var min=Stats.RollingMin(size)
	   ,max=Stats.RollingMax(size)
	   ,avg=Stats.RollingAvg(size)
	   ,avgtime=Stats.RollingAvg(size)
	   ,stdev=Stats.RollingAvg(size)
	   ,zavg=Stats.RollingAvg(size)
	   ,tmin=vRollingMinIndex(timesize)
	   ,tmax=Stats.RollingMaxIndex(timesize)
	   ,tavg=Stats.RollingAvgIndex(timesize)
	   ,tzavg=Stats.RollingAvgIndex(timesize)
	   ,tstdev=Stats.RollingAvgIndex(timesize)
	   ,tsum=Stats.RollingSumPerIndex(timesize,usualtime)// once in two seconds a value
	   ,value_delay=Stats.Delay(delay) // because i can't move the indicators forewared but i can move the number backwards so it will match with the lagging indicators
	   ,tvalue_delay=Stats.DelayIndex(timedelay,usualtime)
	   ,index_delay=Stats.Delay(delay) // add the coresponding index to the delaied value, the other option is not to dalay anything and offset it the presentation
	   ,tindex_delay=Stats.DelayIndex(timedelay,usualtime)
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



### simple code

        var Stats=require('efficient-rolling-stats');
        
		
		
        var Stats=require('efficient-rolling-stats');
		
		//useful: 
		// sample 101 points and delay them by 50 points 
		// sample for 15 minutes and usually the input is every 15 seconds so the first input will be more or less not outlier,delay the timed input by 7.5 minutes
		// var stats=Stats.AllStats(101,50,15,0.25,7.5) 
		//for testing:
		var stats=Stats.AllStats(11,5,1,0.25,0.5) // sample for 15 minutes and usually the input is every 15 seconds so the first input will be more or less not outlier,delay the timed input by 7.5 minutes
		
		setInterval(function(){stats(Math.random()*100,new Date().getTime()/60000)},1500) // input in minutes,  than also the configuratin arguments can be in minutes
		
		stats(Math.random()*100,new Date().getTime()/60000)
		stats(Math.random()*100,new Date().getTime()/60000)
		stats.reset();
        
        simple examples:
         
        min=Stats.RollingMin(4);// use generator configure window size to be 4
        
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
         
        max=Stats.RollingMax(4);// use generator
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
         
        mint=Stats.RollingMinIndex(4000);// min values of last 4 seconds
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
         
         
        var stats=Stats.AllStats(101,50,15*60000,0.25*60000,7.5*60000)
        stats(Math.random()*100,new Date().getTime())
        
        simple examples:
         
        min=Stats.RollingMin(4);// use generator
         
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
         
        max=Stats.RollingMax(4);// use generator
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
         
        mint=Stats.RollingMinIndex(4000);// min values of last 4 seconds
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
     