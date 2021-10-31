export function disableLogs() {
  console.log = () => { }
  console.warn = () => { }
  console.error = () => { }
}

// eslint-disable-next-line no-unused-expressions
if (process.env.NODE_ENV === "production") disableLogs()