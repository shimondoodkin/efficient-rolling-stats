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

#### RollingxAvgPerIndex(WindowSize,UsualIndexSkipBetweenOccations)

 this function is calculates average rate.
 
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
 denerally you should write such function for your self to choose which stats you want

 returns `stats(number){ return result_object }` 
 
 `stats` has 
  * stats.reset()

    var Stats=require('efficient-rolling-stats');
	function SimpleStats(size,delay)
	{
		var min=Stats.RollingMin(size)
	   ,max=Stats.RollingMax(size)
	   ,avg=Stats.RollingAvg(size)
	   ,min_delay=Stats.Delay(delay)
	   ,max_delay=Stats.Delay(delay)
	   ,avg_delay=Stats.Delay(delay)
        
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

#### SimpleStatsNoDelay(WindowSize)

 anoher simple example function combines multiple stats together without delays

 returns ```stats(number){ return result_object }```


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

 this example compains many possibilities

 returns ```stats(number,index){ return result_object }```


        var Stats=require('efficient-rolling-stats');
        function AllStats(size,delay,timesize,usualtime,timedelay)
        {
            var min=Stats.RollingMin(size)
           ,max=Stats.RollingMax(size)
           ,avg=Stats.RollingAvg(size)
           ,avgtime=Stats.RollingAvg(size)
           ,tmin=Stats.RollingMinIndex(size)
           ,tmax=Stats.RollingMaxIndex(size)
           ,wavg=Stats.RollingxAvgPerIndex(timesize,usualtime)// once in two seconds a value
           ,min_delay=Stats.Delay(delay)
           ,max_delay=Stats.Delay(delay)
           ,avg_delay=Stats.Delay(delay)
           ,avgtime_delay=Stats.Delay(delay)
           ,tmin_delay=Stats.Delay(delay)
           ,tmax_delay=Stats.Delay(delay)
           ,wavg_delay=Stats.DelayIndex(timedelay,usualtime)
           
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



### simple code

        var Stats=require('efficient-rolling-stats');
        
        var stats=Stats.AllStats(101,50,15*60000,0.25*60000,7.5*60000)
        stats(Math.random()*100,new Date().getTime())
        
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
     