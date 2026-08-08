declare module 'maath/random/dist/maath-random.esm' {
  export function inSphere(array: Float32Array | Float64Array, options?: { radius?: number }): Float32Array;
  export function inBox(array: Float32Array | Float64Array, options?: { sides?: number | [number, number, number] }): Float32Array;
  
  const random: {
    inSphere: typeof inSphere;
    inBox: typeof inBox;
    [key: string]: unknown;
  };
  
  export default random;
}