# @pcordjs/snowflake

@pcordjs/snowflake is a parser for Twitter Snowflakes, which are used by Discord as IDs.

## Why?

- TypeScript Support
- Full coverage of the Snowflake format
- Minimal dependencies

## Usage

### Deserialization

```ts
import Snowflake from '@pcordjs/snowflake';

const id = 937847820382261308n;
const snowflake = new Snowflake(id);

// Get the timestamp
snowflake.getDate();
// -> Date(2022-01-31T23:12:24.749Z)

// Get the internal worker ID
snowflake.getWorkerId();
// -> 1

// Get the internal process ID
snowflake.getProcessId();
// -> 5

// Get the increment
snowflake.getIncrement();
// -> 60

// Get all at once
snowflake.deserialize();
// -> { date, workerId, processId, increment }
```

### Serialization

```ts
import Snowflake from '@pcordjs/snowflake';

const snowflake = Snowflake.serialize({
  date: new Date('2022-01-31T23:12:24.749Z'),
  workerId: 1,
  processId: 5,
  increment: 60
});

snowflake.id;
// -> 937847820382261308n
```

### Using a custom epoch

```ts
import Snowflake from '@pcordjs/snowflake';

const customEpoch = new Date('2022-01-01T00:00:00.000Z');

const snowflake1 = new Snowflake(937847820382261308n, epoch);
const snowflake2 = Snowflake.serialize(
  {
    date: new Date('2022-01-31T23:12:24.749Z'),
    workerId: 1,
    processId: 5,
    increment: 60
  },
  epoch
);
```
