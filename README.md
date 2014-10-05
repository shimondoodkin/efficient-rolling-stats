javascript efficient -rolling-stats
========================

rolling/running statistics in javascript




===RollingMin(WindowSize)===

 returns ```function atEveryStep(number){ return result }```
 
 atEveryStep usualy has:
 
 * ```atEveryStep.setWindowSize(WindowSize)``
 * ```atEveryStep.reset()``
 

===RollingMax(WindowSize)===

 returns ```function atEveryStep(number){ return result }```
 
===RollingAvg(WindowSize)===

 returns ```function atEveryStep(number){ return result }```
 
===RollingMinIndex(WindowSize)===

 returns ```function atEveryStep(number,index){ return result }```
 
 the index argument can be not continious like time in seconds or miliseconds
 to have minimum of last 5 minutes for example,
 or it can be 1 for increasing by 1 integers.
 index expected to be an increasing number.

===RollingMaxIndex(WindowSize)===

 returns ```function atEveryStep(number,index){ return result }```
 
 the index argument can be not continious like time in seconds or miliseconds

===RollingxAvgPerIndex(WindowSize,UsualIndexSkipBetweenOccations)===

 this function is calculates average rate.
 
 if index is in miliseconds and you average frame size than it calculates rolling frames per millisecond
 input index can be a float number in terms of seconds to have frames per second
 and or in minutes to have per minute result.
 at the first time this function uses UsualIndexSkipBetweenOccations as sum devisor to calculate avarage.
 it does it by substructing from first time UsualIndexSkipBetweenOccations and calculating the delta
 so it is UsualIndexSkipBetweenOccations at the first time, and all times until window size is reached
 the input should be quite timely otherwise the result is delayed too much i think. 
 maybe functions like this should be bound to a clock and work with event emiter. but i implemented it anyways.
 
 returns ```function atEveryStep(number,index){ return result }```
 
 the index argument can be not continious like time in seconds or miliseconds
 
 also atEveryStep has:
 
 * ```atEveryStep.setUsualIndexSkipBetweenOccations(UsualIndexSkipBetweenOccations)``

===Delay(WindowSize)===

 this function delayes the input by window size

 returns ```function atEveryStep(number){ return result }```
 
===DelayIndex(WindowSize,UsualIndexSkipBetweenOccations)===

 this function delayes the input by window size, using index
 this function is similar to ```RollingxAvgPerIndex``` function
 the input should be quite timely otherwise the result is delayed too much i think.
 
 returns ```function atEveryStep(number,index){ return result }```
 
 the index argument can be not continious like time in seconds or miliseconds
 
 also atEveryStep has:
 
 * ```atEveryStep.setUsualIndexSkipBetweenOccations(UsualIndexSkipBetweenOccations)``

====Examples====

===SimpleStats(WindowSize,Delay)===

  this is a simple example function of how to combine multiple stats together with delays
  denerally you should write such function for your self to choose which stats you want

 returns ```stats(number){ return result }```
 
 ```stats``` has 
  * ```stats.reset()``
  
===SimpleStatsNoDelay(WindowSize)===

  anoher simple example function combines multiple stats together without delays

 returns ```stats(number){ return result }```
 
===AllStats(WindowSize,Delay,TimeWindowSize,UsualTimeSkip,TimeDelay)===

  this example compains many possibilities

 returns ```stats(number,index){ return result_object }```
 
===simple code===

    var stats=AllStats(101,50,15*60000,0.25*60000,7.5*60000)
    stats(Math.random()*100,new Date().getTime())

    simple examples:
     
    min=RollingMin(4);// use generator configure window size to be 4

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
 