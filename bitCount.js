function bitCount(u) {
 // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
 const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111);
 return ((uCount + (uCount >> 3)) & 0o30707070707) % 63;
};
