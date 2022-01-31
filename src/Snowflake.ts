export const DISCORD_EPOCH = new Date(2015, 0, 1);

/** A Twitter Snowflake, used to store unique IDs. */
export default class Snowflake {
  /**
   * Creates a Snowflake from a string or bigint.
   * @param id The snowflake ID to use.
   * @param epoch The epoch of the snowflake. Defaults to the Discord epoch (2015).
   */
  public constructor(
    id: string | bigint,
    public readonly epoch: Readonly<Date> = DISCORD_EPOCH
  ) {
    this.id = BigInt(id);
  }

  public readonly id: bigint;

  /** Gets the timestamp encoded in this snowflake */
  public getTime(): Date {
    // bits 22+
    return new Date(Number(this.id >> 22n) + this.epoch.getTime());
  }

  /** Gets the internal worker ID encoded in this snowflake */
  public getWorkerId(): number {
    // bits 17-21
    return Number((this.id >> 17n) & 0b11111n);
  }

  /** Gets the internal process ID encoded in this snowflake */
  public getProcessId(): number {
    // bits 12-16
    return Number((this.id >> 12n) & 0b11111n);
  }

  /** Gets the increment encoded in this snowflake */
  public getIncrement(): number {
    // bits 0-11
    return Number(this.id & 0b111111111111n);
  }

  /** Deserializes this snowflake into an object */
  public deserialize(): DeserializedSnowflake {
    return {
      time: this.getTime(),
      workerId: this.getWorkerId(),
      processId: this.getProcessId(),
      increment: this.getIncrement()
    };
  }

  public static serialize(
    snowflake: RecursiveReadonly<DeserializedSnowflake>,
    epoch: Readonly<Date> = DISCORD_EPOCH
  ): Snowflake {
    return new Snowflake(
      (BigInt(snowflake.time.getTime() - epoch.getTime()) << 22n) |
        ((BigInt(snowflake.workerId) & 0b11111n) << 17n) |
        ((BigInt(snowflake.processId) & 0b11111n) << 12n) |
        (BigInt(snowflake.increment) & 0b111111111111n),
      epoch
    );
  }
}

type RecursiveReadonly<T> = {
  readonly [P in keyof T]: T[P] extends
    | string
    | number
    | boolean
    | symbol
    | (() => unknown)
    ? T[P]
    : RecursiveReadonly<T[P]>;
};

export interface DeserializedSnowflake {
  time: Date;
  workerId: number;
  processId: number;
  increment: number;
}
