# rs-opentrace

[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react.svg?style=for-the-badge)](https://www.npmjs.com/package/@raunow/rs-opentrace)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/react.svg?style=for-the-badge)](https://www.npmjs.com/package/@raunow/rs-opentrace)

In order to make it easier to swap Tracing library, I decided to write a dependency wrapper that allowed us to change the dependency easily without having to changes hundreds of lines of code.

Lo and behold, the project was a bit too ambitious at the time because I only knew Jaeger at the time.
Later I learned for more about Call backs in TS which was utilised by fx. Zipkin.js.

The entire lib should probably be entirely rewritten if it should ever be used.
