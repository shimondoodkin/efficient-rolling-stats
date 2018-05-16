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
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);CurrentIndex=0;};
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
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);CurrentIndex=0;};
    return atEveryStepDo;
}


function RollingAvg(WindowSize)// generator
{
    var DequeValue=[],T=WindowSize,Sum=0,prev;
    function atEveryStepDo(CurrentValue)
    {
      if ( DequeValue.length >= T ) 
      {
         Sum-=DequeValue.shift();
      }
      //Head is too old, it is leaving the window
      if(CurrentValue||CurrentValue===0) //don't break the sum on junk
      {
      DequeValue.push(CurrentValue); 
      Sum+=CurrentValue;
      }
	  else return prev;
      return prev=(DequeValue.length==0?0:Sum/DequeValue.length) //Head value is maximum in the current window
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(){Sum=0;DequeValue.splice(0,DequeValue.length);};
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
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);};
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
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);};
    return atEveryStepDo;
}

function RollingAvgIndex(WindowSize)// generator
{
    var DequeIndex=[],DequeValue=[],T=WindowSize,Sum=0;
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      while ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) )
      {
         DequeIndex.shift();
         Sum-=DequeValue.shift();
      }
      
      //Head is too old, it is leaving the window
      if(CurrentValue||CurrentValue===0)
	  {
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 

      Sum+=CurrentValue;
	  }
  	  else return prev;
      return prev=(DequeValue.length==0?0:Sum/DequeValue.length) //Head value is maximum in the current window

    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);Sum=0;};
    return atEveryStepDo;
}




//simple binary sorted array
//add item: array.splice(sortedIndex(array, value),0,value);
//remove item: var x=sortedIndex(array, value); if(array[x]==value)array.splice(x,1);
function sortedIndex(array, value) {
 var low = 0,
  high = array.length;

 while (low < high) {
  var mid = low + high >>> 1;
  if (array[mid] < value) low = mid + 1;
  else high = mid;
 }
 return low;
}
 

// a simple idea to make an efficient algorithm for median
// is not to realy on old index to remove values, 
// but add by value and remove by value, and keep values in order,
// anyway it won't remove more values than inserted.
//
// complexity: log(n) add, log(n) remove, performance= 2*log(n)
function RollingMedian(WindowSize)// generator , RollingMedian(WindowSize,DivideEven)
{
    var DequeValue=[], T=WindowSize, SortedValues=[], LsortedIndex=sortedIndex;
	var prevmedian,findcenter=null,Sum=0,Sum2=0,Sum3=0,Sum4=0,findmoments=null//,DevideE=!!DivideEven; 
    function atEveryStepDo(CurrentValue)
    {
      if ( DequeValue.length >= T ) 
      {
	     //Head is too old, it is leaving the window
         var value=DequeValue.shift();
		 
	      var v=value,
          vv=v*v,
		  vvv=vv*v,
		  vvvv=vvv*v;
		  
		 Sum-=v;
		 Sum2-=vv;
		 Sum3-=vvv;
		 Sum4-=vvvv;
		 
	     var x=LsortedIndex(SortedValues, value); if(SortedValues[x]==value)SortedValues.splice(x,1);
      }
	  
	  if(CurrentValue||CurrentValue===0)
	  {
      DequeValue.push(CurrentValue); 
	  SortedValues.splice(LsortedIndex(SortedValues, CurrentValue),0,CurrentValue);
	  
	  findcenter=null;
	  findmoments=null;


	  var v=CurrentValue,
          vv=v*v,
		  vvv=vv*v,
		  vvvv=vvv*v;
	  
	  
	  Sum+=v;
	  Sum2+=vv;
	  Sum3+=vvv;
	  Sum4+=vvvv;
	  }
	  else
	  return prevmedian;
	  if(SortedValues.length ==0)return prevmedian;
	  
	  if(SortedValues.length & 1) // if even
 	   return prevmedian=SortedValues[((SortedValues.length-1)>>> 1)] // index=((SortedValues.length -1 for devide by two))/2)+1 add one back -1 for 0 based index, >>> 1 is faster devide by two by bit shifting
	  else
	  {
	   //if odd
	   var half=(SortedValues.length>>> 1)-1;// index = (SortedValues.length>>> 1) -1 for zero based index
	   //if(DevideE)
	    return prevmedian=(SortedValues[half]+SortedValues[half+1])/2; // correct implementation
	   //else    return SortedValues[half]; //i don't care,same same for my usage
	  }
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};

	//atEveryStepDo.setDivideEven=function(DivideEven){DevideE=DivideEven};

    atEveryStepDo.reset=function(){
       DequeValue.splice(0,DequeValue.length);
       SortedValues.splice(0,SortedValues.length);findcenter=null;Sum=0;Sum2=0;Sum3=0;Sum4=0;findmoments=null;
	};
	
	atEveryStepDo.avg=function(){   return Sum/DequeValue.length };
	atEveryStepDo.sum=function(){   return Sum };
	
	atEveryStepDo.min=function(){   return SortedValues[0] };

	atEveryStepDo.q1=function(){

	  if(SortedValues.length==1)return SortedValues[0] 
	  if(SortedValues.length==2)return SortedValues[0]*0.75+SortedValues[1]*0.25
	  if(SortedValues.length==3)return SortedValues[0]*0.5+SortedValues[1]*0.5
	  
	  if((SortedValues.length-1)%4==0)
	  {
	   var n=(SortedValues.length-1)>>2
	   return   SortedValues[n-1  ]*0.25+SortedValues[n    ]*0.75 
	   //return SortedValues[n+0-1]*0.25+SortedValues[n+1-1]*0.75 
	  }
	  
	  if((SortedValues.length-3)%4==0)
	  {
	   var n=(SortedValues.length-3)>>2
	   return   SortedValues[n    ]*0.75+SortedValues[n+1  ]*0.25 
	   //return SortedValues[n+1-1]*0.75+SortedValues[n+2-1]*0.25 
	  }
	};
	
	
	atEveryStepDo.moments_avg=function() //m1 - not useful
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.average;
	}
	
	atEveryStepDo.variance=function()//m2
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.variance;
	}
	
	atEveryStepDo.standardDeviation=function() //sqrt(m2)
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.standardDeviation;
	}
	
	atEveryStepDo.skew=function() // using m2 , m3
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.skew;
	}
	
	atEveryStepDo.kurtosis=function() // using m2, m3 ,m4
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.kurtosis;
	}
	
	atEveryStepDo.exkurtosis=function() // using kurtosis - 3
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.exkurtosis;
	}
	
	
	atEveryStepDo.moments=function()
	{
		var o={};
		if(this.c>0)
		{
			//e(x), e(x*x), e(x*x*x), and e(x*x*x*x)
			var c=DequeValue.length,
			ex = Sum/c,
			exx = Sum2/c,
			exxx = Sum3/c,
			exxxx = Sum4/c,
			//central moments:
			m1 = ex,
			m2 = Sum2/c - ex;
			m3 = exxx - 3*exx*ex + 2 *ex*ex*ex;
			m4 = exxxx - 3*exxx*ex + 6*exx*ex*ex - -3*ex*ex*ex*ex ;
			o.average = m1;
			o.variance = m2;
			o.standardDeviation= Math.pow(o.variance,.5);
			if(c>2){
				//http://www.amstat.org/publications/jse/v19n2/doane.pdf
				//http://en.wikipedia.org/wiki/Skewness
				o.skew = Math.pow(c*(c-1),.5)/(c-2) * m3 / Math.pow(m2,1.5);
			}
			if(m2>0){
				//http://en.wikipedia.org/wiki/Kurtosis
				o.exkurtosis = m4 / m2 / m2 - 3
				o.kurtosis = m4 / m2 / m2 
			}
		}
		return o;
	}
	
	
	atEveryStepDo.median=function(){   return prevmedian }; //q2
	
	atEveryStepDo.q3=function(){
 	  if(SortedValues.length==1)return SortedValues[0]
	  if(SortedValues.length==2)return SortedValues[0]*0.25+SortedValues[1]*0.75
	  if(SortedValues.length==3)return SortedValues[1]*0.5+SortedValues[2]*0.5
	  
	  if((SortedValues.length-1)%4==0)
	  {
	   var n3=((SortedValues.length-1)>>2)*3
	   return   SortedValues[n3    ]*0.75+SortedValues[n3+1  ]*0.25 
	   //return SortedValues[n3+1-1]*0.75+SortedValues[n3+2-1]*0.25 
	  }
	  
	  if((SortedValues.length-3)%4==0)
	  {
	   var n3=((SortedValues.length-3)>>2)*3
	   return   SortedValues[n3+1  ]*0.25+SortedValues[n3+2  ]*0.75 
	   //return SortedValues[n3+2-1]*0.25+SortedValues[n3+3-1]*0.75 
	  }
	};
	
	atEveryStepDo.max=function(){   return SortedValues[SortedValues.length-1] };
	atEveryStepDo.center=function(){   return (SortedValues[0]+SortedValues[SortedValues.length-1])/2 };
	
	//atEveryStepDo.nabovecenter=function(){
	// if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	// return SortedValues.length-findcenter-1;
	//}
	//atEveryStepDo.nbelowcenter=function(){
	// if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	// return findcenter-1;
	//}
	
	//http://books.google.co.il/books?id=4HrJs2o9C5YC&pg=PA32&lpg=PA32&dq=q3+q2+q2+q1+skewness&source=bl&ots=eD24ehhNoz&sig=xxhMOFVL5JngB5JPi5WieIRTCaI&hl=en&sa=X&ei=xfVQVIPzFOLnywPM9YLIAw&ved=0CEoQ6AEwBw#v=onepage&q=Q.D.&f=false
	
	atEveryStepDo.medianskew=function(){ //medianskew=(max - median)-(median - min)
     return  (SortedValues[SortedValues.length-1]-prevmedian)-(prevmedian-SortedValues[0]);
	}
	
	atEveryStepDo.medianskew_bowleys_coef=function(){ //medianskew=(max - median)-(median - min)
     return  ((SortedValues[SortedValues.length-1]-prevmedian)*(prevmedian-SortedValues[0]))/(SortedValues[SortedValues.length-1]-SortedValues[0]);
	}
	
	atEveryStepDo.mediankurt=function(){ //q.d=quartile deviatin=(q3-q1)/2, mediankurt=q.d/(p90 - p10), mediankurt=((q3-q1)/2	)/(p90 - p10) 	
	 var p90=Math.round((SortedValues.length-1)*0.9);
	 var p10=Math.round((SortedValues.length-1)*0.1);
     return  ((SortedValues[SortedValues.length-1]-prevmedian)*(prevmedian-SortedValues[0]))/(SortedValues[p90]-SortedValues[p10]);
	}
	
	atEveryStepDo.pabovecenter=function(){
	 if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	 return (SortedValues.length-1-findcenter)/(SortedValues.length-1);
	}
	atEveryStepDo.pbelowcenter=function(){
	 if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	 return findcenter/(SortedValues.length-1);
	}
	
    return atEveryStepDo;
}

function RollingMedianIndex(WindowSize)// generator
{
    var DequeValue=[], DequeIndex=[], T=WindowSize, SortedValues=[], LsortedIndex=sortedIndex;
	var prevmedian,findcenter=null,Sum=0,Sum2=0,Sum3=0,Sum4=0,findmoments=null//,DevideE=!!DivideEven; 
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      while ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) )  
      {
	     //Head is too old, it is leaving the window
         var index=DequeIndex.shift();
		 var value=DequeValue.shift();
		 
	      var v=value,
          vv=v*v,
		  vvv=vv*v,
		  vvvv=vvv*v;
		  
		 Sum-=v;
		 Sum2-=vv;
		 Sum3-=vvv;
		 Sum4-=vvvv;
		 
	     var x=LsortedIndex(SortedValues, value); if(SortedValues[x]==value)SortedValues.splice(x,1);
      }
	  
	  
	  if(CurrentValue||CurrentValue===0)
	  {
      DequeIndex.push(CurrentIndex); 
      DequeValue.push(CurrentValue); 
	  SortedValues.splice(LsortedIndex(SortedValues, CurrentValue),0,CurrentValue);
	  
	  findcenter=null;
	  findmoments=null;


	  var v=CurrentValue,
          vv=v*v,
		  vvv=vv*v,
		  vvvv=vvv*v;
	  
	  
	  Sum+=v;
	  Sum2+=vv;
	  Sum3+=vvv;
	  Sum4+=vvvv;
	  }
	  else
	  return prevmedian;
	  if(SortedValues.length ==0)return prevmedian;
	  
	  if(SortedValues.length & 1) // if even
 	   return prevmedian=SortedValues[((SortedValues.length-1)>>> 1)] // index=((SortedValues.length -1 for devide by two))/2)+1 add one back -1 for 0 based index, >>> 1 is faster devide by two by bit shifting
	  else
	  {
	   //if odd
	   var half=(SortedValues.length>>> 1)-1;// index = (SortedValues.length>>> 1) -1 for zero based index
	   //if(DevideE)
	    return prevmedian=(SortedValues[half]+SortedValues[half+1])/2; // correct implementation
	   //else    return SortedValues[half]; //i don't care,same same for my usage
	  }
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};

	//atEveryStepDo.setDivideEven=function(DivideEven){DevideE=DivideEven};

    atEveryStepDo.reset=function(){
       DequeValue.splice(0,DequeValue.length);DequeIndex.splice(0,DequeIndex.length);
       SortedValues.splice(0,SortedValues.length);findcenter=null;Sum=0;Sum2=0;Sum3=0;Sum4=0;findmoments=null;
	};
	
	atEveryStepDo.avg=function(){   return Sum/DequeValue.length };
	atEveryStepDo.sum=function(){   return Sum };
	
	atEveryStepDo.min=function(){   return SortedValues[0] };

	atEveryStepDo.q1=function(){

	  if(SortedValues.length==1)return SortedValues[0] 
	  if(SortedValues.length==2)return SortedValues[0]*0.75+SortedValues[1]*0.25
	  if(SortedValues.length==3)return SortedValues[0]*0.5+SortedValues[1]*0.5
	  
	  if((SortedValues.length-1)%4==0)
	  {
	   var n=(SortedValues.length-1)>>2
	   return   SortedValues[n-1  ]*0.25+SortedValues[n    ]*0.75 
	   //return SortedValues[n+0-1]*0.25+SortedValues[n+1-1]*0.75 
	  }
	  
	  if((SortedValues.length-3)%4==0)
	  {
	   var n=(SortedValues.length-3)>>2
	   return   SortedValues[n    ]*0.75+SortedValues[n+1  ]*0.25 
	   //return SortedValues[n+1-1]*0.75+SortedValues[n+2-1]*0.25 
	  }
	};
	
	
	atEveryStepDo.moments_avg=function() //m1 - not useful
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.average;
	}
	
	atEveryStepDo.variance=function()//m2
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.variance;
	}
	
	atEveryStepDo.standardDeviation=function() //sqrt(m2)
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.standardDeviation;
	}
	
	atEveryStepDo.skew=function() // using m2 , m3
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.skew;
	}
	
	atEveryStepDo.kurtosis=function() // using m2, m3 ,m4
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.kurtosis;
	}
	
	atEveryStepDo.exkurtosis=function() // using kurtosis - 3
	{
	  if(findmoments===null) findmoments=atEveryStepDo.moments();
	  return findmoments.exkurtosis;
	}
	
	
	atEveryStepDo.moments=function()
	{
		var o={};
		if(this.c>0)
		{
			//e(x), e(x*x), e(x*x*x), and e(x*x*x*x)
			var c=DequeValue.length,
			ex = Sum/c,
			exx = Sum2/c,
			exxx = Sum3/c,
			exxxx = Sum4/c,
			//central moments:
			m1 = ex,
			m2 = Sum2/c - ex;
			m3 = exxx - 3*exx*ex + 2 *ex*ex*ex;
			m4 = exxxx - 3*exxx*ex + 6*exx*ex*ex - -3*ex*ex*ex*ex ;
			o.average = m1;
			o.variance = m2;
			o.standardDeviation= Math.pow(o.variance,.5);
			if(c>2){
				//http://www.amstat.org/publications/jse/v19n2/doane.pdf
				//http://en.wikipedia.org/wiki/Skewness
				o.skew = Math.pow(c*(c-1),.5)/(c-2) * m3 / Math.pow(m2,1.5);
			}
			if(m2>0){
				//http://en.wikipedia.org/wiki/Kurtosis
				o.exkurtosis = m4 / m2 / m2 - 3
				o.kurtosis = m4 / m2 / m2 
			}
		}
		return o;
	}
	
	
	atEveryStepDo.median=function(){   return prevmedian }; //q2
	
	atEveryStepDo.q3=function(){
 	  if(SortedValues.length==1)return SortedValues[0]
	  if(SortedValues.length==2)return SortedValues[0]*0.25+SortedValues[1]*0.75
	  if(SortedValues.length==3)return SortedValues[1]*0.5+SortedValues[2]*0.5
	  
	  if((SortedValues.length-1)%4==0)
	  {
	   var n3=((SortedValues.length-1)>>2)*3
	   return   SortedValues[n3    ]*0.75+SortedValues[n3+1  ]*0.25 
	   //return SortedValues[n3+1-1]*0.75+SortedValues[n3+2-1]*0.25 
	  }
	  
	  if((SortedValues.length-3)%4==0)
	  {
	   var n3=((SortedValues.length-3)>>2)*3
	   return   SortedValues[n3+1  ]*0.25+SortedValues[n3+2  ]*0.75 
	   //return SortedValues[n3+2-1]*0.25+SortedValues[n3+3-1]*0.75 
	  }
	};
	
	atEveryStepDo.max=function(){   return SortedValues[SortedValues.length-1] };
	atEveryStepDo.center=function(){   return (SortedValues[0]+SortedValues[SortedValues.length-1])/2 };
	
	//atEveryStepDo.nabovecenter=function(){
	// if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	// return SortedValues.length-findcenter-1;
	//}
	//atEveryStepDo.nbelowcenter=function(){
	// if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	// return findcenter-1;
	//}
	
	//http://books.google.co.il/books?id=4HrJs2o9C5YC&pg=PA32&lpg=PA32&dq=q3+q2+q2+q1+skewness&source=bl&ots=eD24ehhNoz&sig=xxhMOFVL5JngB5JPi5WieIRTCaI&hl=en&sa=X&ei=xfVQVIPzFOLnywPM9YLIAw&ved=0CEoQ6AEwBw#v=onepage&q=Q.D.&f=false
	
	atEveryStepDo.medianskew=function(){ //medianskew=(max - median)-(median - min)
     return  (SortedValues[SortedValues.length-1]-prevmedian)-(prevmedian-SortedValues[0]);
	}
	
	atEveryStepDo.medianskew_bowleys_coef=function(){ //medianskew=(max - median)-(median - min)
     return  ((SortedValues[SortedValues.length-1]-prevmedian)*(prevmedian-SortedValues[0]))/(SortedValues[SortedValues.length-1]-SortedValues[0]);
	}
	
	atEveryStepDo.mediankurt=function(){ //q.d=quartile deviatin=(q3-q1)/2, mediankurt=q.d/(p90 - p10), mediankurt=((q3-q1)/2	)/(p90 - p10) 	
	 var p90=Math.round((SortedValues.length-1)*0.9);
	 var p10=Math.round((SortedValues.length-1)*0.1);
     return  ((SortedValues[SortedValues.length-1]-prevmedian)*(prevmedian-SortedValues[0]))/(SortedValues[p90]-SortedValues[p10]);
	}
	
	atEveryStepDo.pabovecenter=function(){
	 if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	 return (SortedValues.length-1-findcenter)/(SortedValues.length-1);
	}
	atEveryStepDo.pbelowcenter=function(){
	 if(findcenter===null) findcenter=LsortedIndex(SortedValues, (SortedValues[0]+SortedValues[SortedValues.length-1])/2 );
	 return findcenter/(SortedValues.length-1);
	}
	
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
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);Sum=0;PrevIndex=false;};
    return atEveryStepDo;
}

function Delay(WindowSize,UndefinedValue)
{
    var DequeValue=[],T=WindowSize,U=UndefinedValue;
    function atEveryStepDo(CurrentValue)
    {
      var ret=U;
      if( DequeValue.length== T ) 
      {
          ret=DequeValue.shift();
      }
      DequeValue.push(CurrentValue); 
      return ret;
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.setUndefinedValue=function(WindowSize){U=UndefinedValue};
    atEveryStepDo.reset=function(WindowSize){DequeValue.splice(0,DequeValue.length);};
    return atEveryStepDo;
}
function HideFirst(WindowSize,UndefinedValue)
{
    var DequeValue=1,T=WindowSize+1,U=UndefinedValue;
    function atEveryStepDo(CurrentValue)
    {
      if( DequeValue== T ) 
      {
        return  CurrentValue;
      }
      DequeValue++;
      return U;
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize+1};
    atEveryStepDo.setUndefinedValue=function(WindowSize){U=UndefinedValue};
    atEveryStepDo.reset=function(){DequeValue=0;};
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
      //take first to fall off and throw away the rest
      if ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) )  
      {
         PrevIndex=DequeIndex.shift();
         PrevValue=DequeValue.shift();
         while ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) )  
         {
           DequeIndex.shift();
           DequeValue.shift();
         }
      }
      return PrevValue;
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.setUsualIndexSkipBetweenOccations=function(UsualIndexSkipBetweenOccations){U=UsualIndexSkipBetweenOccations};
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequeValue.splice(0,DequeValue.length);PrevIndex=false;PrevValue=UndefinedValue};
    return atEveryStepDo;
}


function PositiveLately(WindowSize)
{
    var T=WindowSize,PositiveCount=-1;
    function atEveryStepDo(CurrentValue)
    {
      //if(CurrentValue<0)PositiveCount=-1; // should not reset on negative
	  if(CurrentValue>0)PositiveCount=0;// should reset each time
	  if(PositiveCount>=0)PositiveCount++;
	  if(PositiveCount>WindowSize)PositiveCount=-1;
      return PositiveCount>0;
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(){PositiveCount=-1};
    return atEveryStepDo;
}

function PositiveLatelyIndex(WindowSize)// generator, expects some high frequency of time inserts because if there will be a delay or no inserts it will stop working;
{
    var T=WindowSize,PrevIndex=false,PositiveCount=-1;
    function atEveryStepDo(CurrentValue,CurrentIndex)
    {
      //if(CurrentValue<0)PositiveCount=-1;
	  if(CurrentValue>0){PrevIndex=CurrentIndex;PositiveCount=0;}// should reset each time
	  if(PositiveCount>=0)PositiveCount++;
	  if( PrevIndex!=false && (PrevIndex <= CurrentIndex - T) ) PositiveCount=-1;
      return PositiveCount>0;
    }
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(){PrevIndex=false;PositiveCount=-1};
    return atEveryStepDo;
}


// choosing PreRoundingMultiplier, if PreRoundingMultiplier=30 than bins will be like = 0.1,0.2,0.3 .  can be 100 for 0.01 bins,  can be  1000 for 0.001 bins
//

// this histogram do not remove anything just accamulates all, until you do hist.reset()
function Histogram(PreRoundingMultiplier)// generator
{
    var RD=PreRoundingMultiplier,hist= new Map();;
    function atEveryStepDo(CurrentPosition,CurrentAmount=1)
    {
      //Head is too old, it is leaving the window
	  
	  var CurrentPositionRound=parseFloat((  Math.round( CurrentPosition*RD )/RD  ).toFixed(12));
	  	  
	  if(hist.has(CurrentPositionRound))
	    hist.set( CurrentPositionRound, parseFloat((  hist.get(CurrentPositionRound)+CurrentAmount  ).toFixed(12)) ); 
	  else
	    hist.set( CurrentPositionRound, CurrentAmount );
	  
      return hist 
    }
	atEveryStepDo.hist=hist;
    atEveryStepDo.reset=function(){ hist.clear() };
    return atEveryStepDo;
}

function RollingHistogram(WindowSize,PreRoundingMultiplier)// generator
{
    var DequePosition=[],DequeAmount=[],T=WindowSize,RD=PreRoundingMultiplier,hist= new Map();;
    function atEveryStepDo(CurrentPosition,CurrentAmount=1)
    {
      if ( DequePosition.length >= T ) 
      {
        var prevpos=DequePosition.shift();
        var prevamount=DequeAmount.shift();
		
		var newamount=parseFloat((   hist.get(prevpos)-prevamount   ).toFixed(12));
        if(newamount!==0)
			hist.set(prevpos , newamount); 
		else
			hist.delete(prevpos);
      }
      //Head is too old, it is leaving the window
	  
	  var CurrentPositionRound=parseFloat((  Math.round( CurrentPosition*RD )/RD  ).toFixed(12));
	  
	  DequePosition.push(CurrentPositionRound);
	  DequeAmount.push(CurrentAmount);
	  
	  if(hist.has(CurrentPositionRound))
	    hist.set( CurrentPositionRound, parseFloat((  hist.get(CurrentPositionRound)+CurrentAmount  ).toFixed(12)) ); 
	  else
	    hist.set( CurrentPositionRound, CurrentAmount );
	  
      return hist 
    }
	atEveryStepDo.hist=hist;
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(){Sum=0;DequePosition.splice(0,DequePosition.length);};
    return atEveryStepDo;
}

function RollingHistogramIndex(WindowSize,PreRoundingMultiplier)// generator
{
    var DequeIndex=[],DequePosition=[],DequeAmount=[],T=WindowSize,RD=PreRoundingMultiplier,hist= new Map();
    function atEveryStepDo(CurrentPosition,CurrentIndex,CurrentAmount=1)
    {
	  if( (!CurrentAmount&&CurrentAmount!==0) || (!CurrentPosition&&CurrentPosition!==0) ) return hist;
      while ( DequeIndex.length!==0 && (DequeIndex[0] <= CurrentIndex - T) )
      {
            DequeIndex.shift();
        var prevpos=DequePosition.shift();
        var prevamount=DequeAmount.shift();
		
		if(!prevpos && prevpos!==0)console.log('nana1',{prevamount,prevpos})
		if(!prevamount && prevamount!==0)console.log('nana2',{prevamount,prevpos})
			
		if(hist.has(prevpos))
		{
			var newamount=parseFloat((   (hist.get(prevpos))-prevamount   ).toFixed(12));
			if(!newamount && newamount!==0)console.log('nana3',{newamount,	prevamount,prevpos})

			if(newamount!==0)
				hist.set(prevpos , newamount); 
			else
				hist.delete(prevpos);
		}
      }
      
      //Head is too old, it is leaving the window
      
	  var CurrentPositionRound=parseFloat((  Math.round( CurrentPosition*RD )/RD  ).toFixed(12));
	  
	  DequePosition.push(CurrentPositionRound);
	  DequeAmount.push(CurrentAmount);
	  DequeIndex.push(CurrentIndex);
	  
	  if(hist.has(CurrentPositionRound))
	  {
		let newamount=parseFloat((  hist.get(CurrentPositionRound)+CurrentAmount  ).toFixed(12))
	    hist.set( CurrentPositionRound, newamount   ); 
	  }
	  else
	    hist.set( CurrentPositionRound, CurrentAmount );
	  
      return hist 
    }
	atEveryStepDo.hist=hist;
    atEveryStepDo.setWindowSize=function(WindowSize){T=WindowSize};
    atEveryStepDo.reset=function(){DequeIndex.splice(0,DequeIndex.length);DequePosition.splice(0,DequePosition.length);Sum=0;};
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


var Stats=exports;
function AllStats(size,delay,timesize,usualtime,timedelay)
{
   var list=[],add=function(v) { list.push(v); return v; };

    var avgtime    = add(  Stats.RollingAvg(size)    )
   ,stdev          = add(  Stats.RollingAvg(size)    )
   ,zavg           = add(  Stats.RollingAvg(size)    )
   ,median         = add(  Stats.RollingMedian(size) )
   ,mstdev         = add(  Stats.RollingAvg(size)    )
   ,mzavg          = add(  Stats.RollingAvg(size)    )
   ,tzavg          = add(  Stats.RollingAvgIndex(timesize)    )
   ,tstdev         = add(  Stats.RollingAvgIndex(timesize)    )
   ,tmedian        = add(  Stats.RollingMedianIndex(timesize) )
   ,tmzavg         = add(  Stats.RollingAvgIndex(timesize)    )
   ,tmstdev        = add(  Stats.RollingAvgIndex(timesize)    )
   ,tsum           = add(  Stats.RollingSumPerIndex(timesize,usualtime)  ) // may be its called momentum or speed
   ,value_delay    = add(  Stats.Delay(delay)                            ) // because i can't move the indicators forewared but i can move the number backwards so it will match with the lagging indicators
   ,tvalue_delay   = add(  Stats.DelayIndex(timedelay,usualtime)         )
   ,index_delay    = add(  Stats.Delay(delay)                            ) // add the coresponding index to the delaied value, the other option is not to dalay anything and offset it the presentation
   ,tindex_delay   = add(  Stats.DelayIndex(timedelay,usualtime)         )
   ,prev=false
   ,count=0
   ,tcount=0;
   
    function stats(n,t)
    {
     var o={};
     
     o.median=median(n)
     o.min=median.min()
     o.max=median.max()
	 //q0 is min
     o.q1=median.q1()
	 //q2 is median
	 o.q3=median.q3()
	 //q4 is max
     o.avg=median.avg()
     
     o.stdev=Math.sqrt(stdev(Math.pow(n-o.avg,2)))
     o.z=o.stdev==0?0:(n-o.avg)/o.stdev
     o.zavg=zavg(o.z)
     
     o.mstdev=Math.sqrt(mstdev(Math.pow(n-o.median,2)))
     o.mz=o.mstdev==0?0: 0.6745 *(n-o.median)/o.mstdev // mz> 3.5 = outlier http://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm , http://stackoverflow.com/questions/22354094/pythonic-way-of-detecting-outliers-in-one-dimensional-observation-data, http://www.itl.nist.gov/div898/handbook/index.htm , idea from: https://www.npmjs.org/package/stats-analysis , It is possible to Calculate, median absolute deviation, Outlier Detection (using Iglewicz and Hoaglin's method) MADz>3.5, Outlier Filter / Removal
     o.mzavg=mzavg(o.mz)
     
     o.tmedian=tmedian(n,t)
     o.tmin=tmedian.min()
     o.tmax=tmedian.max()
	 o.tavg=tmedian.avg()
     o.tcenter=tmedian.center()
	 //q0 is min
     o.tq1=tmedian.q1()
	 //q2 is median
	 o.tq3=tmedian.q3()
	 //q4 is max
     o.tsum=tsum(n,t)
	 
     o.tstdev=Math.sqrt(tstdev(Math.pow(n-o.tavg,2),t))
     o.tz=o.tstdev==0?0:(n-o.tavg)/o.tstdev
     o.tzavg=tzavg(o.tz,t)
     
	 o.tmstdev=Math.sqrt(tmstdev(Math.pow(n-o.tmedian,2),t))
     o.tmz=o.tmstdev==0?0: 0.6745*(n-o.tmedian)/o.tmstdev // tmz> 3.5 = outlier 
     o.tmzavg=tmzavg(o.tmz,t) 
     
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
    {
     for(var i=0;i<list.length;i++){list[i].reset()};
     prev=false;
	 count=0;
    }
    return stats;
}

//example2:

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

//example3: 
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

exports.RollingMin=RollingMin;
exports.RollingMax=RollingMax;
exports.RollingAvg=RollingAvg;
exports.RollingMedian=RollingMedian;
exports.RollingMinIndex=RollingMinIndex;
exports.RollingMaxIndex=RollingMaxIndex;
exports.RollingAvgIndex=RollingAvgIndex;
exports.RollingMedianIndex=RollingMedianIndex;
exports.RollingSumPerIndex=RollingSumPerIndex;

exports.Delay=Delay;
exports.DelayIndex=DelayIndex;

exports.AllStats=AllStats;
exports.SimpleStats=SimpleStats;
exports.SimpleStatsNoDelay=SimpleStatsNoDelay;

exports.PositiveLately=PositiveLately;
exports.PositiveLatelyIndex=PositiveLatelyIndex;
 
exports.Histogram=Histogram;
exports.RollingHistogram=RollingHistogram;
exports.RollingHistogramIndex=RollingHistogramIndex;
exports.HideFirst=HideFirst;
