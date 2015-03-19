/*
 This code implements empirical mode decomposition in C.
 Required paramters include:
 - order: the number of IMFs to return
 - iterations: the number of iterations per IMF
 - locality: in samples, the nearest two extrema may be
 If it is not specified, there is no limit (locality = 0).

 Typical use consists of calling emdCreate(), followed by
 emdDecompose(), and then using the struct's "imfs" field
 to retrieve the data. Call emdClear() to deallocate memory
 inside the struct.
*/
/*
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// MSVC needs "__inline" instead of "inline"
#if defined( _MSC_VER ) && !defined( __cplusplus )
# define inline __inline
#endif

#define cnew(type, size) ((type*) malloc((size) * sizeof(type)))
#define cdelete(ptr) free(ptr)
/*

typedef struct {
	int iterations, order, locality;
	int *minPoints, *maxPoints;
	float *min, *max, **imfs, *residue;
	int size, minSize, maxSize;
} emdData;

void emdSetup(emdData* emd, int order, int iterations, int locality);
void emdResize(emdData* emd, int size);
void emdCreate(emdData* emd, int size, int order, int iterations, int locality);
void emdClear(emdData* emd);
void emdDecompose(emdData* emd, const float* signal);
void emdMakeExtrema(emdData* emd, const float* curImf);
void emdInterpolate(emdData* emd, const float* in, float* out, int* points, int pointsSize);
void emdUpdateImf(emdData* emd, float* imf);
void emdMakeResidue(emdData* emd, const float* cur);
inline int mirrorIndex(int i, int size);

*/

//void emdSetup(emdData* emd, int order, int iterations, int locality) {
function emdSetup(emd, order,  iterations,  locality) {
	emd.iterations = iterations;
	emd.order = order;
	emd.locality = locality;
	emd.size = 0;
	emd.imfs = [];
	emd.residue = [];
	emd.minPoints = [];
	emd.maxPoints = [];
	emd.min = [];
	emd.max = [];
}

//void emdResize(emdData* emd, int size);
function emdResize(emd, size) { 
	//emdClear(emd);//seems not need to clear
	emd.size = size;
	
	//array resizes in javascript are not required;
	
	/*
	emd.imfs = new Array(emd.order);//cnew(float*, emd.order);
	for(var i = 0; i < emd.order; i++)
		emd.imfs[i] = new Array(size); //cnew(float, size);
	emd.residue = new Array(size); // cnew(float, size);
	emd.minPoints = new Array( Math.round(size / 2) ); //cnew(int, size / 2);
	emd.maxPoints = new Array( Math.round(size / 2) ); //cnew(int, size / 2);
	emd.min = new Array(size); //cnew(float, size);
	emd.max = new Array(size);  //cnew(float, size);
	*/
}

//void emdCreate(emdData* emd, int size, int order, int iterations, int locality);
function emdCreate(emd, size, order, iterations, locality) {
	emdSetup(emd, order, iterations, locality);
	emdResize(emd, size);
}

//void emdClear(emdData* emd);
function emdClear(emd) { 
	if(emd.imfs) {
		for(var i = 0; i < emd.order; i++)
			delete emd.imfs[i];
		delete emd.imfs;
		delete emd.minPoints;
		delete emd.maxPoints;
		delete emd.min;
		delete emd.max;
		delete emd.residue;
	}
}


//void emdDecompose(emdData* emd, const float* signal) {
function emdDecompose(emd, signal) {
	/*int*/ var i, j;
	emd.imfs[0]=signal.filter(function(){return true})//memcpy(emd.imfs[0], signal, emd.size * sizeof(float));
	emd.residue=signal.filter(function(){return true})//memcpy(emd.residue, signal, emd.size * sizeof(float));
	for(i = 0; i < emd.order - 1; i++) {
		/*float* */var curImf = emd.imfs[i];
		for(j = 0; j < emd.iterations; j++) {
			emdMakeExtrema(emd, curImf);
			if(emd.minSize < 4 || emd.maxSize < 4)
				break; // can't fit splines
			emdInterpolate(emd, curImf, emd.min, emd.minPoints, emd.minSize);
			emdInterpolate(emd, curImf, emd.max, emd.maxPoints, emd.maxSize);
			emdUpdateImf(emd, curImf);
		}
		emdMakeResidue(emd, curImf);
		emd.imfs[i + 1]=emd.residue;//memcpy(emd.imfs[i + 1], emd.residue, emd.size * sizeof(float));
	}
}

// Currently, extrema within (locality) of the boundaries are not allowed.
// A better algorithm might be to collect all the extrema, and then assume
// that extrema near the boundaries are valid, working toward the center.

//void emdMakeExtrema(emdData* emd, const float* curImf) {
function emdMakeExtrema(emd, curImf) {
	/*int*/ var i, lastMin = 0, lastMax = 0;
	emd.minSize = 0;
	emd.maxSize = 0;
	for(i = 1; i < emd.size - 1; i++) {
		if(curImf[i - 1] < curImf[i]) {
			if(curImf[i] > curImf[i + 1] && (i - lastMax) > emd.locality) {
				emd.maxPoints[emd.maxSize++] = i;
				lastMax = i;
			}
		} else {
			if(curImf[i] < curImf[i + 1] && (i - lastMin) > emd.locality) {
				emd.minPoints[emd.minSize++] = i;
				lastMin = i;
			}
		}
	}
}

//void emdInterpolate(emdData* emd, const float* in, float* out, int* points, int pointsSize) {
function emdInterpolate(emd, in1, out,  points,  pointsSize) {
	/*int*/   var size = emd.size;
	/*int*/   var i, j, i0, i1, i2, i3, start, end;
	/*float*/ var  a0, a1, a2, a3;
	/*float*/ var  y0, y1, y2, y3, muScale, mu;
	for(i = -1; i < pointsSize; i++) {
		i0 = points[mirrorIndex(i - 1, pointsSize)];
		i1 = points[mirrorIndex(i, pointsSize)];
		i2 = points[mirrorIndex(i + 1, pointsSize)];
		i3 = points[mirrorIndex(i + 2, pointsSize)];

		y0 = in1[i0];
		y1 = in1[i1];
		y2 = in1[i2];
		y3 = in1[i3];

		a0 = y3 - y2 - y0 + y1;
		a1 = y0 - y1 - a0;
		a2 = y2 - y0;
		a3 = y1;

		// left boundary
		if(i == -1) {
			start = 0;
			i1 = -i1;
		} else
			start = i1;

		// right boundary
		if(i == pointsSize - 1) {
			end = size;
			i2 = size + size - i2;
		} else
			end = i2;

		muScale = 1.0 / (i2 - i1);
		for(j = start; j < end; j++) {
			mu = (j - i1) * muScale;
			out[j] = ((a0 * mu + a1) * mu + a2) * mu + a3;
		}
	}
}

//void emdUpdateImf(emdData* emd, float* imf) {
function emdUpdateImf(emd, imf) {
	//int i;
	for(var i = 0; i < emd.size; i++)
		imf[i] -= (emd.min[i] + emd.max[i]) * .5;
}

//void emdMakeResidue(emdData* emd, const float* cur) {
function emdMakeResidue(emd,  cur) {
	//int i;
	for(var i = 0; i < emd.size; i++)
		emd.residue[i] -= cur[i];
}

//inline int mirrorIndex(int i, int size) {
function mirrorIndex(i, size) {
	if(i < size) {
		if(i < 0)
			return -i - 1;
		return i;
	}
	return (size - 1) + (size - i);
}