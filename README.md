# Timing With

Log function
## Usage

```ts
import {timingLogWith} from 'timing-with'

await timingLogWith('hello', ()=>sleep(1000))
// [1s] hello

const logger =  timingLogWith('world')

await logger(()=>sleep(800))
// [800ms] world

await logger(()=>sleep(700))
// [700ms] world

```