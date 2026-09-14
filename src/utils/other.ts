// Utility function to introduce a delay in asynchronous code
export async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
