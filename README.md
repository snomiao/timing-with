# Timing With

## Usage

```ts
import {timingLogWith} from 'timing-with'

await timingLogWith('hello', ()=>sleep(1000))
// [1s] hello
```