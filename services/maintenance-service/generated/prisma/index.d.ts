
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model MaintenanceRequest
 * 
 */
export type MaintenanceRequest = $Result.DefaultSelection<Prisma.$MaintenanceRequestPayload>
/**
 * Model MaintenanceHistory
 * 
 */
export type MaintenanceHistory = $Result.DefaultSelection<Prisma.$MaintenanceHistoryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MaintenanceType: {
  REPAIR: 'REPAIR',
  PREVENTIVE: 'PREVENTIVE',
  INSPECTION: 'INSPECTION',
  EMERGENCY: 'EMERGENCY',
  RENOVATION: 'RENOVATION'
};

export type MaintenanceType = (typeof MaintenanceType)[keyof typeof MaintenanceType]


export const MaintenanceStatus: {
  REQUESTED: 'REQUESTED',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export type MaintenanceStatus = (typeof MaintenanceStatus)[keyof typeof MaintenanceStatus]


export const PriorityLevel: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

export type PriorityLevel = (typeof PriorityLevel)[keyof typeof PriorityLevel]

}

export type MaintenanceType = $Enums.MaintenanceType

export const MaintenanceType: typeof $Enums.MaintenanceType

export type MaintenanceStatus = $Enums.MaintenanceStatus

export const MaintenanceStatus: typeof $Enums.MaintenanceStatus

export type PriorityLevel = $Enums.PriorityLevel

export const PriorityLevel: typeof $Enums.PriorityLevel

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more MaintenanceRequests
 * const maintenanceRequests = await prisma.maintenanceRequest.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more MaintenanceRequests
   * const maintenanceRequests = await prisma.maintenanceRequest.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.maintenanceRequest`: Exposes CRUD operations for the **MaintenanceRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceRequests
    * const maintenanceRequests = await prisma.maintenanceRequest.findMany()
    * ```
    */
  get maintenanceRequest(): Prisma.MaintenanceRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maintenanceHistory`: Exposes CRUD operations for the **MaintenanceHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceHistories
    * const maintenanceHistories = await prisma.maintenanceHistory.findMany()
    * ```
    */
  get maintenanceHistory(): Prisma.MaintenanceHistoryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    MaintenanceRequest: 'MaintenanceRequest',
    MaintenanceHistory: 'MaintenanceHistory'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "maintenanceRequest" | "maintenanceHistory"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      MaintenanceRequest: {
        payload: Prisma.$MaintenanceRequestPayload<ExtArgs>
        fields: Prisma.MaintenanceRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>
          }
          findFirst: {
            args: Prisma.MaintenanceRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>
          }
          findMany: {
            args: Prisma.MaintenanceRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>[]
          }
          create: {
            args: Prisma.MaintenanceRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>
          }
          createMany: {
            args: Prisma.MaintenanceRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>[]
          }
          delete: {
            args: Prisma.MaintenanceRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>
          }
          update: {
            args: Prisma.MaintenanceRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaintenanceRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>[]
          }
          upsert: {
            args: Prisma.MaintenanceRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceRequestPayload>
          }
          aggregate: {
            args: Prisma.MaintenanceRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceRequest>
          }
          groupBy: {
            args: Prisma.MaintenanceRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceRequestCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceRequestCountAggregateOutputType> | number
          }
        }
      }
      MaintenanceHistory: {
        payload: Prisma.$MaintenanceHistoryPayload<ExtArgs>
        fields: Prisma.MaintenanceHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>
          }
          findFirst: {
            args: Prisma.MaintenanceHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>
          }
          findMany: {
            args: Prisma.MaintenanceHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>[]
          }
          create: {
            args: Prisma.MaintenanceHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>
          }
          createMany: {
            args: Prisma.MaintenanceHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>[]
          }
          delete: {
            args: Prisma.MaintenanceHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>
          }
          update: {
            args: Prisma.MaintenanceHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaintenanceHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>[]
          }
          upsert: {
            args: Prisma.MaintenanceHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceHistoryPayload>
          }
          aggregate: {
            args: Prisma.MaintenanceHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceHistory>
          }
          groupBy: {
            args: Prisma.MaintenanceHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceHistoryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    maintenanceRequest?: MaintenanceRequestOmit
    maintenanceHistory?: MaintenanceHistoryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MaintenanceRequestCountOutputType
   */

  export type MaintenanceRequestCountOutputType = {
    history: number
  }

  export type MaintenanceRequestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    history?: boolean | MaintenanceRequestCountOutputTypeCountHistoryArgs
  }

  // Custom InputTypes
  /**
   * MaintenanceRequestCountOutputType without action
   */
  export type MaintenanceRequestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequestCountOutputType
     */
    select?: MaintenanceRequestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MaintenanceRequestCountOutputType without action
   */
  export type MaintenanceRequestCountOutputTypeCountHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceHistoryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model MaintenanceRequest
   */

  export type AggregateMaintenanceRequest = {
    _count: MaintenanceRequestCountAggregateOutputType | null
    _min: MaintenanceRequestMinAggregateOutputType | null
    _max: MaintenanceRequestMaxAggregateOutputType | null
  }

  export type MaintenanceRequestMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    propertyId: string | null
    unitId: string | null
    description: string | null
    type: $Enums.MaintenanceType | null
    priority: $Enums.PriorityLevel | null
    status: $Enums.MaintenanceStatus | null
    requestedAt: Date | null
    scheduledFor: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MaintenanceRequestMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    propertyId: string | null
    unitId: string | null
    description: string | null
    type: $Enums.MaintenanceType | null
    priority: $Enums.PriorityLevel | null
    status: $Enums.MaintenanceStatus | null
    requestedAt: Date | null
    scheduledFor: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MaintenanceRequestCountAggregateOutputType = {
    id: number
    tenantId: number
    propertyId: number
    unitId: number
    description: number
    type: number
    priority: number
    status: number
    requestedAt: number
    scheduledFor: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MaintenanceRequestMinAggregateInputType = {
    id?: true
    tenantId?: true
    propertyId?: true
    unitId?: true
    description?: true
    type?: true
    priority?: true
    status?: true
    requestedAt?: true
    scheduledFor?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MaintenanceRequestMaxAggregateInputType = {
    id?: true
    tenantId?: true
    propertyId?: true
    unitId?: true
    description?: true
    type?: true
    priority?: true
    status?: true
    requestedAt?: true
    scheduledFor?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MaintenanceRequestCountAggregateInputType = {
    id?: true
    tenantId?: true
    propertyId?: true
    unitId?: true
    description?: true
    type?: true
    priority?: true
    status?: true
    requestedAt?: true
    scheduledFor?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MaintenanceRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceRequest to aggregate.
     */
    where?: MaintenanceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceRequests to fetch.
     */
    orderBy?: MaintenanceRequestOrderByWithRelationInput | MaintenanceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceRequests
    **/
    _count?: true | MaintenanceRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceRequestMaxAggregateInputType
  }

  export type GetMaintenanceRequestAggregateType<T extends MaintenanceRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceRequest[P]>
      : GetScalarType<T[P], AggregateMaintenanceRequest[P]>
  }




  export type MaintenanceRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceRequestWhereInput
    orderBy?: MaintenanceRequestOrderByWithAggregationInput | MaintenanceRequestOrderByWithAggregationInput[]
    by: MaintenanceRequestScalarFieldEnum[] | MaintenanceRequestScalarFieldEnum
    having?: MaintenanceRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceRequestCountAggregateInputType | true
    _min?: MaintenanceRequestMinAggregateInputType
    _max?: MaintenanceRequestMaxAggregateInputType
  }

  export type MaintenanceRequestGroupByOutputType = {
    id: string
    tenantId: string
    propertyId: string
    unitId: string | null
    description: string
    type: $Enums.MaintenanceType
    priority: $Enums.PriorityLevel
    status: $Enums.MaintenanceStatus
    requestedAt: Date
    scheduledFor: Date | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: MaintenanceRequestCountAggregateOutputType | null
    _min: MaintenanceRequestMinAggregateOutputType | null
    _max: MaintenanceRequestMaxAggregateOutputType | null
  }

  type GetMaintenanceRequestGroupByPayload<T extends MaintenanceRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceRequestGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceRequestGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    propertyId?: boolean
    unitId?: boolean
    description?: boolean
    type?: boolean
    priority?: boolean
    status?: boolean
    requestedAt?: boolean
    scheduledFor?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    history?: boolean | MaintenanceRequest$historyArgs<ExtArgs>
    _count?: boolean | MaintenanceRequestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceRequest"]>

  export type MaintenanceRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    propertyId?: boolean
    unitId?: boolean
    description?: boolean
    type?: boolean
    priority?: boolean
    status?: boolean
    requestedAt?: boolean
    scheduledFor?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["maintenanceRequest"]>

  export type MaintenanceRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    propertyId?: boolean
    unitId?: boolean
    description?: boolean
    type?: boolean
    priority?: boolean
    status?: boolean
    requestedAt?: boolean
    scheduledFor?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["maintenanceRequest"]>

  export type MaintenanceRequestSelectScalar = {
    id?: boolean
    tenantId?: boolean
    propertyId?: boolean
    unitId?: boolean
    description?: boolean
    type?: boolean
    priority?: boolean
    status?: boolean
    requestedAt?: boolean
    scheduledFor?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MaintenanceRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "propertyId" | "unitId" | "description" | "type" | "priority" | "status" | "requestedAt" | "scheduledFor" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["maintenanceRequest"]>
  export type MaintenanceRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    history?: boolean | MaintenanceRequest$historyArgs<ExtArgs>
    _count?: boolean | MaintenanceRequestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MaintenanceRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MaintenanceRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MaintenanceRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceRequest"
    objects: {
      history: Prisma.$MaintenanceHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      propertyId: string
      unitId: string | null
      description: string
      type: $Enums.MaintenanceType
      priority: $Enums.PriorityLevel
      status: $Enums.MaintenanceStatus
      requestedAt: Date
      scheduledFor: Date | null
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["maintenanceRequest"]>
    composites: {}
  }

  type MaintenanceRequestGetPayload<S extends boolean | null | undefined | MaintenanceRequestDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceRequestPayload, S>

  type MaintenanceRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaintenanceRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaintenanceRequestCountAggregateInputType | true
    }

  export interface MaintenanceRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceRequest'], meta: { name: 'MaintenanceRequest' } }
    /**
     * Find zero or one MaintenanceRequest that matches the filter.
     * @param {MaintenanceRequestFindUniqueArgs} args - Arguments to find a MaintenanceRequest
     * @example
     * // Get one MaintenanceRequest
     * const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceRequestFindUniqueArgs>(args: SelectSubset<T, MaintenanceRequestFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaintenanceRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceRequestFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceRequest
     * @example
     * // Get one MaintenanceRequest
     * const maintenanceRequest = await prisma.maintenanceRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceRequestFindFirstArgs} args - Arguments to find a MaintenanceRequest
     * @example
     * // Get one MaintenanceRequest
     * const maintenanceRequest = await prisma.maintenanceRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceRequestFindFirstArgs>(args?: SelectSubset<T, MaintenanceRequestFindFirstArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceRequestFindFirstOrThrowArgs} args - Arguments to find a MaintenanceRequest
     * @example
     * // Get one MaintenanceRequest
     * const maintenanceRequest = await prisma.maintenanceRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaintenanceRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceRequests
     * const maintenanceRequests = await prisma.maintenanceRequest.findMany()
     * 
     * // Get first 10 MaintenanceRequests
     * const maintenanceRequests = await prisma.maintenanceRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceRequestWithIdOnly = await prisma.maintenanceRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceRequestFindManyArgs>(args?: SelectSubset<T, MaintenanceRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaintenanceRequest.
     * @param {MaintenanceRequestCreateArgs} args - Arguments to create a MaintenanceRequest.
     * @example
     * // Create one MaintenanceRequest
     * const MaintenanceRequest = await prisma.maintenanceRequest.create({
     *   data: {
     *     // ... data to create a MaintenanceRequest
     *   }
     * })
     * 
     */
    create<T extends MaintenanceRequestCreateArgs>(args: SelectSubset<T, MaintenanceRequestCreateArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaintenanceRequests.
     * @param {MaintenanceRequestCreateManyArgs} args - Arguments to create many MaintenanceRequests.
     * @example
     * // Create many MaintenanceRequests
     * const maintenanceRequest = await prisma.maintenanceRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceRequestCreateManyArgs>(args?: SelectSubset<T, MaintenanceRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaintenanceRequests and returns the data saved in the database.
     * @param {MaintenanceRequestCreateManyAndReturnArgs} args - Arguments to create many MaintenanceRequests.
     * @example
     * // Create many MaintenanceRequests
     * const maintenanceRequest = await prisma.maintenanceRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaintenanceRequests and only return the `id`
     * const maintenanceRequestWithIdOnly = await prisma.maintenanceRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MaintenanceRequest.
     * @param {MaintenanceRequestDeleteArgs} args - Arguments to delete one MaintenanceRequest.
     * @example
     * // Delete one MaintenanceRequest
     * const MaintenanceRequest = await prisma.maintenanceRequest.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceRequest
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceRequestDeleteArgs>(args: SelectSubset<T, MaintenanceRequestDeleteArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaintenanceRequest.
     * @param {MaintenanceRequestUpdateArgs} args - Arguments to update one MaintenanceRequest.
     * @example
     * // Update one MaintenanceRequest
     * const maintenanceRequest = await prisma.maintenanceRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceRequestUpdateArgs>(args: SelectSubset<T, MaintenanceRequestUpdateArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaintenanceRequests.
     * @param {MaintenanceRequestDeleteManyArgs} args - Arguments to filter MaintenanceRequests to delete.
     * @example
     * // Delete a few MaintenanceRequests
     * const { count } = await prisma.maintenanceRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceRequestDeleteManyArgs>(args?: SelectSubset<T, MaintenanceRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceRequests
     * const maintenanceRequest = await prisma.maintenanceRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceRequestUpdateManyArgs>(args: SelectSubset<T, MaintenanceRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceRequests and returns the data updated in the database.
     * @param {MaintenanceRequestUpdateManyAndReturnArgs} args - Arguments to update many MaintenanceRequests.
     * @example
     * // Update many MaintenanceRequests
     * const maintenanceRequest = await prisma.maintenanceRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MaintenanceRequests and only return the `id`
     * const maintenanceRequestWithIdOnly = await prisma.maintenanceRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaintenanceRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, MaintenanceRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MaintenanceRequest.
     * @param {MaintenanceRequestUpsertArgs} args - Arguments to update or create a MaintenanceRequest.
     * @example
     * // Update or create a MaintenanceRequest
     * const maintenanceRequest = await prisma.maintenanceRequest.upsert({
     *   create: {
     *     // ... data to create a MaintenanceRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceRequest we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceRequestUpsertArgs>(args: SelectSubset<T, MaintenanceRequestUpsertArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaintenanceRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceRequestCountArgs} args - Arguments to filter MaintenanceRequests to count.
     * @example
     * // Count the number of MaintenanceRequests
     * const count = await prisma.maintenanceRequest.count({
     *   where: {
     *     // ... the filter for the MaintenanceRequests we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceRequestCountArgs>(
      args?: Subset<T, MaintenanceRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaintenanceRequestAggregateArgs>(args: Subset<T, MaintenanceRequestAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceRequestAggregateType<T>>

    /**
     * Group by MaintenanceRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaintenanceRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceRequestGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaintenanceRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceRequest model
   */
  readonly fields: MaintenanceRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    history<T extends MaintenanceRequest$historyArgs<ExtArgs> = {}>(args?: Subset<T, MaintenanceRequest$historyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MaintenanceRequest model
   */
  interface MaintenanceRequestFieldRefs {
    readonly id: FieldRef<"MaintenanceRequest", 'String'>
    readonly tenantId: FieldRef<"MaintenanceRequest", 'String'>
    readonly propertyId: FieldRef<"MaintenanceRequest", 'String'>
    readonly unitId: FieldRef<"MaintenanceRequest", 'String'>
    readonly description: FieldRef<"MaintenanceRequest", 'String'>
    readonly type: FieldRef<"MaintenanceRequest", 'MaintenanceType'>
    readonly priority: FieldRef<"MaintenanceRequest", 'PriorityLevel'>
    readonly status: FieldRef<"MaintenanceRequest", 'MaintenanceStatus'>
    readonly requestedAt: FieldRef<"MaintenanceRequest", 'DateTime'>
    readonly scheduledFor: FieldRef<"MaintenanceRequest", 'DateTime'>
    readonly completedAt: FieldRef<"MaintenanceRequest", 'DateTime'>
    readonly createdAt: FieldRef<"MaintenanceRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"MaintenanceRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceRequest findUnique
   */
  export type MaintenanceRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceRequest to fetch.
     */
    where: MaintenanceRequestWhereUniqueInput
  }

  /**
   * MaintenanceRequest findUniqueOrThrow
   */
  export type MaintenanceRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceRequest to fetch.
     */
    where: MaintenanceRequestWhereUniqueInput
  }

  /**
   * MaintenanceRequest findFirst
   */
  export type MaintenanceRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceRequest to fetch.
     */
    where?: MaintenanceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceRequests to fetch.
     */
    orderBy?: MaintenanceRequestOrderByWithRelationInput | MaintenanceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceRequests.
     */
    cursor?: MaintenanceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceRequests.
     */
    distinct?: MaintenanceRequestScalarFieldEnum | MaintenanceRequestScalarFieldEnum[]
  }

  /**
   * MaintenanceRequest findFirstOrThrow
   */
  export type MaintenanceRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceRequest to fetch.
     */
    where?: MaintenanceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceRequests to fetch.
     */
    orderBy?: MaintenanceRequestOrderByWithRelationInput | MaintenanceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceRequests.
     */
    cursor?: MaintenanceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceRequests.
     */
    distinct?: MaintenanceRequestScalarFieldEnum | MaintenanceRequestScalarFieldEnum[]
  }

  /**
   * MaintenanceRequest findMany
   */
  export type MaintenanceRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceRequests to fetch.
     */
    where?: MaintenanceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceRequests to fetch.
     */
    orderBy?: MaintenanceRequestOrderByWithRelationInput | MaintenanceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceRequests.
     */
    cursor?: MaintenanceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceRequests.
     */
    distinct?: MaintenanceRequestScalarFieldEnum | MaintenanceRequestScalarFieldEnum[]
  }

  /**
   * MaintenanceRequest create
   */
  export type MaintenanceRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceRequest.
     */
    data: XOR<MaintenanceRequestCreateInput, MaintenanceRequestUncheckedCreateInput>
  }

  /**
   * MaintenanceRequest createMany
   */
  export type MaintenanceRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceRequests.
     */
    data: MaintenanceRequestCreateManyInput | MaintenanceRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceRequest createManyAndReturn
   */
  export type MaintenanceRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * The data used to create many MaintenanceRequests.
     */
    data: MaintenanceRequestCreateManyInput | MaintenanceRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceRequest update
   */
  export type MaintenanceRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceRequest.
     */
    data: XOR<MaintenanceRequestUpdateInput, MaintenanceRequestUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceRequest to update.
     */
    where: MaintenanceRequestWhereUniqueInput
  }

  /**
   * MaintenanceRequest updateMany
   */
  export type MaintenanceRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceRequests.
     */
    data: XOR<MaintenanceRequestUpdateManyMutationInput, MaintenanceRequestUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceRequests to update
     */
    where?: MaintenanceRequestWhereInput
    /**
     * Limit how many MaintenanceRequests to update.
     */
    limit?: number
  }

  /**
   * MaintenanceRequest updateManyAndReturn
   */
  export type MaintenanceRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * The data used to update MaintenanceRequests.
     */
    data: XOR<MaintenanceRequestUpdateManyMutationInput, MaintenanceRequestUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceRequests to update
     */
    where?: MaintenanceRequestWhereInput
    /**
     * Limit how many MaintenanceRequests to update.
     */
    limit?: number
  }

  /**
   * MaintenanceRequest upsert
   */
  export type MaintenanceRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceRequest to update in case it exists.
     */
    where: MaintenanceRequestWhereUniqueInput
    /**
     * In case the MaintenanceRequest found by the `where` argument doesn't exist, create a new MaintenanceRequest with this data.
     */
    create: XOR<MaintenanceRequestCreateInput, MaintenanceRequestUncheckedCreateInput>
    /**
     * In case the MaintenanceRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceRequestUpdateInput, MaintenanceRequestUncheckedUpdateInput>
  }

  /**
   * MaintenanceRequest delete
   */
  export type MaintenanceRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
    /**
     * Filter which MaintenanceRequest to delete.
     */
    where: MaintenanceRequestWhereUniqueInput
  }

  /**
   * MaintenanceRequest deleteMany
   */
  export type MaintenanceRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceRequests to delete
     */
    where?: MaintenanceRequestWhereInput
    /**
     * Limit how many MaintenanceRequests to delete.
     */
    limit?: number
  }

  /**
   * MaintenanceRequest.history
   */
  export type MaintenanceRequest$historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    where?: MaintenanceHistoryWhereInput
    orderBy?: MaintenanceHistoryOrderByWithRelationInput | MaintenanceHistoryOrderByWithRelationInput[]
    cursor?: MaintenanceHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MaintenanceHistoryScalarFieldEnum | MaintenanceHistoryScalarFieldEnum[]
  }

  /**
   * MaintenanceRequest without action
   */
  export type MaintenanceRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceRequest
     */
    select?: MaintenanceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceRequest
     */
    omit?: MaintenanceRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceRequestInclude<ExtArgs> | null
  }


  /**
   * Model MaintenanceHistory
   */

  export type AggregateMaintenanceHistory = {
    _count: MaintenanceHistoryCountAggregateOutputType | null
    _min: MaintenanceHistoryMinAggregateOutputType | null
    _max: MaintenanceHistoryMaxAggregateOutputType | null
  }

  export type MaintenanceHistoryMinAggregateOutputType = {
    id: string | null
    requestId: string | null
    action: string | null
    performedBy: string | null
    performedAt: Date | null
    notes: string | null
  }

  export type MaintenanceHistoryMaxAggregateOutputType = {
    id: string | null
    requestId: string | null
    action: string | null
    performedBy: string | null
    performedAt: Date | null
    notes: string | null
  }

  export type MaintenanceHistoryCountAggregateOutputType = {
    id: number
    requestId: number
    action: number
    performedBy: number
    performedAt: number
    notes: number
    _all: number
  }


  export type MaintenanceHistoryMinAggregateInputType = {
    id?: true
    requestId?: true
    action?: true
    performedBy?: true
    performedAt?: true
    notes?: true
  }

  export type MaintenanceHistoryMaxAggregateInputType = {
    id?: true
    requestId?: true
    action?: true
    performedBy?: true
    performedAt?: true
    notes?: true
  }

  export type MaintenanceHistoryCountAggregateInputType = {
    id?: true
    requestId?: true
    action?: true
    performedBy?: true
    performedAt?: true
    notes?: true
    _all?: true
  }

  export type MaintenanceHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceHistory to aggregate.
     */
    where?: MaintenanceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceHistories to fetch.
     */
    orderBy?: MaintenanceHistoryOrderByWithRelationInput | MaintenanceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceHistories
    **/
    _count?: true | MaintenanceHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceHistoryMaxAggregateInputType
  }

  export type GetMaintenanceHistoryAggregateType<T extends MaintenanceHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceHistory[P]>
      : GetScalarType<T[P], AggregateMaintenanceHistory[P]>
  }




  export type MaintenanceHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceHistoryWhereInput
    orderBy?: MaintenanceHistoryOrderByWithAggregationInput | MaintenanceHistoryOrderByWithAggregationInput[]
    by: MaintenanceHistoryScalarFieldEnum[] | MaintenanceHistoryScalarFieldEnum
    having?: MaintenanceHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceHistoryCountAggregateInputType | true
    _min?: MaintenanceHistoryMinAggregateInputType
    _max?: MaintenanceHistoryMaxAggregateInputType
  }

  export type MaintenanceHistoryGroupByOutputType = {
    id: string
    requestId: string
    action: string
    performedBy: string
    performedAt: Date
    notes: string | null
    _count: MaintenanceHistoryCountAggregateOutputType | null
    _min: MaintenanceHistoryMinAggregateOutputType | null
    _max: MaintenanceHistoryMaxAggregateOutputType | null
  }

  type GetMaintenanceHistoryGroupByPayload<T extends MaintenanceHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceHistoryGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    action?: boolean
    performedBy?: boolean
    performedAt?: boolean
    notes?: boolean
    request?: boolean | MaintenanceRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceHistory"]>

  export type MaintenanceHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    action?: boolean
    performedBy?: boolean
    performedAt?: boolean
    notes?: boolean
    request?: boolean | MaintenanceRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceHistory"]>

  export type MaintenanceHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestId?: boolean
    action?: boolean
    performedBy?: boolean
    performedAt?: boolean
    notes?: boolean
    request?: boolean | MaintenanceRequestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceHistory"]>

  export type MaintenanceHistorySelectScalar = {
    id?: boolean
    requestId?: boolean
    action?: boolean
    performedBy?: boolean
    performedAt?: boolean
    notes?: boolean
  }

  export type MaintenanceHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestId" | "action" | "performedBy" | "performedAt" | "notes", ExtArgs["result"]["maintenanceHistory"]>
  export type MaintenanceHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | MaintenanceRequestDefaultArgs<ExtArgs>
  }
  export type MaintenanceHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | MaintenanceRequestDefaultArgs<ExtArgs>
  }
  export type MaintenanceHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    request?: boolean | MaintenanceRequestDefaultArgs<ExtArgs>
  }

  export type $MaintenanceHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceHistory"
    objects: {
      request: Prisma.$MaintenanceRequestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestId: string
      action: string
      performedBy: string
      performedAt: Date
      notes: string | null
    }, ExtArgs["result"]["maintenanceHistory"]>
    composites: {}
  }

  type MaintenanceHistoryGetPayload<S extends boolean | null | undefined | MaintenanceHistoryDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceHistoryPayload, S>

  type MaintenanceHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaintenanceHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaintenanceHistoryCountAggregateInputType | true
    }

  export interface MaintenanceHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceHistory'], meta: { name: 'MaintenanceHistory' } }
    /**
     * Find zero or one MaintenanceHistory that matches the filter.
     * @param {MaintenanceHistoryFindUniqueArgs} args - Arguments to find a MaintenanceHistory
     * @example
     * // Get one MaintenanceHistory
     * const maintenanceHistory = await prisma.maintenanceHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceHistoryFindUniqueArgs>(args: SelectSubset<T, MaintenanceHistoryFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaintenanceHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceHistoryFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceHistory
     * @example
     * // Get one MaintenanceHistory
     * const maintenanceHistory = await prisma.maintenanceHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceHistoryFindFirstArgs} args - Arguments to find a MaintenanceHistory
     * @example
     * // Get one MaintenanceHistory
     * const maintenanceHistory = await prisma.maintenanceHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceHistoryFindFirstArgs>(args?: SelectSubset<T, MaintenanceHistoryFindFirstArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceHistoryFindFirstOrThrowArgs} args - Arguments to find a MaintenanceHistory
     * @example
     * // Get one MaintenanceHistory
     * const maintenanceHistory = await prisma.maintenanceHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaintenanceHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceHistories
     * const maintenanceHistories = await prisma.maintenanceHistory.findMany()
     * 
     * // Get first 10 MaintenanceHistories
     * const maintenanceHistories = await prisma.maintenanceHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceHistoryWithIdOnly = await prisma.maintenanceHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceHistoryFindManyArgs>(args?: SelectSubset<T, MaintenanceHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaintenanceHistory.
     * @param {MaintenanceHistoryCreateArgs} args - Arguments to create a MaintenanceHistory.
     * @example
     * // Create one MaintenanceHistory
     * const MaintenanceHistory = await prisma.maintenanceHistory.create({
     *   data: {
     *     // ... data to create a MaintenanceHistory
     *   }
     * })
     * 
     */
    create<T extends MaintenanceHistoryCreateArgs>(args: SelectSubset<T, MaintenanceHistoryCreateArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaintenanceHistories.
     * @param {MaintenanceHistoryCreateManyArgs} args - Arguments to create many MaintenanceHistories.
     * @example
     * // Create many MaintenanceHistories
     * const maintenanceHistory = await prisma.maintenanceHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceHistoryCreateManyArgs>(args?: SelectSubset<T, MaintenanceHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaintenanceHistories and returns the data saved in the database.
     * @param {MaintenanceHistoryCreateManyAndReturnArgs} args - Arguments to create many MaintenanceHistories.
     * @example
     * // Create many MaintenanceHistories
     * const maintenanceHistory = await prisma.maintenanceHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaintenanceHistories and only return the `id`
     * const maintenanceHistoryWithIdOnly = await prisma.maintenanceHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MaintenanceHistory.
     * @param {MaintenanceHistoryDeleteArgs} args - Arguments to delete one MaintenanceHistory.
     * @example
     * // Delete one MaintenanceHistory
     * const MaintenanceHistory = await prisma.maintenanceHistory.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceHistory
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceHistoryDeleteArgs>(args: SelectSubset<T, MaintenanceHistoryDeleteArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaintenanceHistory.
     * @param {MaintenanceHistoryUpdateArgs} args - Arguments to update one MaintenanceHistory.
     * @example
     * // Update one MaintenanceHistory
     * const maintenanceHistory = await prisma.maintenanceHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceHistoryUpdateArgs>(args: SelectSubset<T, MaintenanceHistoryUpdateArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaintenanceHistories.
     * @param {MaintenanceHistoryDeleteManyArgs} args - Arguments to filter MaintenanceHistories to delete.
     * @example
     * // Delete a few MaintenanceHistories
     * const { count } = await prisma.maintenanceHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceHistoryDeleteManyArgs>(args?: SelectSubset<T, MaintenanceHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceHistories
     * const maintenanceHistory = await prisma.maintenanceHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceHistoryUpdateManyArgs>(args: SelectSubset<T, MaintenanceHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceHistories and returns the data updated in the database.
     * @param {MaintenanceHistoryUpdateManyAndReturnArgs} args - Arguments to update many MaintenanceHistories.
     * @example
     * // Update many MaintenanceHistories
     * const maintenanceHistory = await prisma.maintenanceHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MaintenanceHistories and only return the `id`
     * const maintenanceHistoryWithIdOnly = await prisma.maintenanceHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaintenanceHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, MaintenanceHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MaintenanceHistory.
     * @param {MaintenanceHistoryUpsertArgs} args - Arguments to update or create a MaintenanceHistory.
     * @example
     * // Update or create a MaintenanceHistory
     * const maintenanceHistory = await prisma.maintenanceHistory.upsert({
     *   create: {
     *     // ... data to create a MaintenanceHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceHistory we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceHistoryUpsertArgs>(args: SelectSubset<T, MaintenanceHistoryUpsertArgs<ExtArgs>>): Prisma__MaintenanceHistoryClient<$Result.GetResult<Prisma.$MaintenanceHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaintenanceHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceHistoryCountArgs} args - Arguments to filter MaintenanceHistories to count.
     * @example
     * // Count the number of MaintenanceHistories
     * const count = await prisma.maintenanceHistory.count({
     *   where: {
     *     // ... the filter for the MaintenanceHistories we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceHistoryCountArgs>(
      args?: Subset<T, MaintenanceHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaintenanceHistoryAggregateArgs>(args: Subset<T, MaintenanceHistoryAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceHistoryAggregateType<T>>

    /**
     * Group by MaintenanceHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaintenanceHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceHistoryGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaintenanceHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceHistory model
   */
  readonly fields: MaintenanceHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    request<T extends MaintenanceRequestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MaintenanceRequestDefaultArgs<ExtArgs>>): Prisma__MaintenanceRequestClient<$Result.GetResult<Prisma.$MaintenanceRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MaintenanceHistory model
   */
  interface MaintenanceHistoryFieldRefs {
    readonly id: FieldRef<"MaintenanceHistory", 'String'>
    readonly requestId: FieldRef<"MaintenanceHistory", 'String'>
    readonly action: FieldRef<"MaintenanceHistory", 'String'>
    readonly performedBy: FieldRef<"MaintenanceHistory", 'String'>
    readonly performedAt: FieldRef<"MaintenanceHistory", 'DateTime'>
    readonly notes: FieldRef<"MaintenanceHistory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceHistory findUnique
   */
  export type MaintenanceHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceHistory to fetch.
     */
    where: MaintenanceHistoryWhereUniqueInput
  }

  /**
   * MaintenanceHistory findUniqueOrThrow
   */
  export type MaintenanceHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceHistory to fetch.
     */
    where: MaintenanceHistoryWhereUniqueInput
  }

  /**
   * MaintenanceHistory findFirst
   */
  export type MaintenanceHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceHistory to fetch.
     */
    where?: MaintenanceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceHistories to fetch.
     */
    orderBy?: MaintenanceHistoryOrderByWithRelationInput | MaintenanceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceHistories.
     */
    cursor?: MaintenanceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceHistories.
     */
    distinct?: MaintenanceHistoryScalarFieldEnum | MaintenanceHistoryScalarFieldEnum[]
  }

  /**
   * MaintenanceHistory findFirstOrThrow
   */
  export type MaintenanceHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceHistory to fetch.
     */
    where?: MaintenanceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceHistories to fetch.
     */
    orderBy?: MaintenanceHistoryOrderByWithRelationInput | MaintenanceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceHistories.
     */
    cursor?: MaintenanceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceHistories.
     */
    distinct?: MaintenanceHistoryScalarFieldEnum | MaintenanceHistoryScalarFieldEnum[]
  }

  /**
   * MaintenanceHistory findMany
   */
  export type MaintenanceHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceHistories to fetch.
     */
    where?: MaintenanceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceHistories to fetch.
     */
    orderBy?: MaintenanceHistoryOrderByWithRelationInput | MaintenanceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceHistories.
     */
    cursor?: MaintenanceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceHistories.
     */
    distinct?: MaintenanceHistoryScalarFieldEnum | MaintenanceHistoryScalarFieldEnum[]
  }

  /**
   * MaintenanceHistory create
   */
  export type MaintenanceHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceHistory.
     */
    data: XOR<MaintenanceHistoryCreateInput, MaintenanceHistoryUncheckedCreateInput>
  }

  /**
   * MaintenanceHistory createMany
   */
  export type MaintenanceHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceHistories.
     */
    data: MaintenanceHistoryCreateManyInput | MaintenanceHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceHistory createManyAndReturn
   */
  export type MaintenanceHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many MaintenanceHistories.
     */
    data: MaintenanceHistoryCreateManyInput | MaintenanceHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MaintenanceHistory update
   */
  export type MaintenanceHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceHistory.
     */
    data: XOR<MaintenanceHistoryUpdateInput, MaintenanceHistoryUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceHistory to update.
     */
    where: MaintenanceHistoryWhereUniqueInput
  }

  /**
   * MaintenanceHistory updateMany
   */
  export type MaintenanceHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceHistories.
     */
    data: XOR<MaintenanceHistoryUpdateManyMutationInput, MaintenanceHistoryUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceHistories to update
     */
    where?: MaintenanceHistoryWhereInput
    /**
     * Limit how many MaintenanceHistories to update.
     */
    limit?: number
  }

  /**
   * MaintenanceHistory updateManyAndReturn
   */
  export type MaintenanceHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * The data used to update MaintenanceHistories.
     */
    data: XOR<MaintenanceHistoryUpdateManyMutationInput, MaintenanceHistoryUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceHistories to update
     */
    where?: MaintenanceHistoryWhereInput
    /**
     * Limit how many MaintenanceHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MaintenanceHistory upsert
   */
  export type MaintenanceHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceHistory to update in case it exists.
     */
    where: MaintenanceHistoryWhereUniqueInput
    /**
     * In case the MaintenanceHistory found by the `where` argument doesn't exist, create a new MaintenanceHistory with this data.
     */
    create: XOR<MaintenanceHistoryCreateInput, MaintenanceHistoryUncheckedCreateInput>
    /**
     * In case the MaintenanceHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceHistoryUpdateInput, MaintenanceHistoryUncheckedUpdateInput>
  }

  /**
   * MaintenanceHistory delete
   */
  export type MaintenanceHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
    /**
     * Filter which MaintenanceHistory to delete.
     */
    where: MaintenanceHistoryWhereUniqueInput
  }

  /**
   * MaintenanceHistory deleteMany
   */
  export type MaintenanceHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceHistories to delete
     */
    where?: MaintenanceHistoryWhereInput
    /**
     * Limit how many MaintenanceHistories to delete.
     */
    limit?: number
  }

  /**
   * MaintenanceHistory without action
   */
  export type MaintenanceHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceHistory
     */
    select?: MaintenanceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceHistory
     */
    omit?: MaintenanceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceHistoryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MaintenanceRequestScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    propertyId: 'propertyId',
    unitId: 'unitId',
    description: 'description',
    type: 'type',
    priority: 'priority',
    status: 'status',
    requestedAt: 'requestedAt',
    scheduledFor: 'scheduledFor',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MaintenanceRequestScalarFieldEnum = (typeof MaintenanceRequestScalarFieldEnum)[keyof typeof MaintenanceRequestScalarFieldEnum]


  export const MaintenanceHistoryScalarFieldEnum: {
    id: 'id',
    requestId: 'requestId',
    action: 'action',
    performedBy: 'performedBy',
    performedAt: 'performedAt',
    notes: 'notes'
  };

  export type MaintenanceHistoryScalarFieldEnum = (typeof MaintenanceHistoryScalarFieldEnum)[keyof typeof MaintenanceHistoryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'MaintenanceType'
   */
  export type EnumMaintenanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceType'>
    


  /**
   * Reference to a field of type 'MaintenanceType[]'
   */
  export type ListEnumMaintenanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceType[]'>
    


  /**
   * Reference to a field of type 'PriorityLevel'
   */
  export type EnumPriorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorityLevel'>
    


  /**
   * Reference to a field of type 'PriorityLevel[]'
   */
  export type ListEnumPriorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorityLevel[]'>
    


  /**
   * Reference to a field of type 'MaintenanceStatus'
   */
  export type EnumMaintenanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceStatus'>
    


  /**
   * Reference to a field of type 'MaintenanceStatus[]'
   */
  export type ListEnumMaintenanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type MaintenanceRequestWhereInput = {
    AND?: MaintenanceRequestWhereInput | MaintenanceRequestWhereInput[]
    OR?: MaintenanceRequestWhereInput[]
    NOT?: MaintenanceRequestWhereInput | MaintenanceRequestWhereInput[]
    id?: StringFilter<"MaintenanceRequest"> | string
    tenantId?: StringFilter<"MaintenanceRequest"> | string
    propertyId?: StringFilter<"MaintenanceRequest"> | string
    unitId?: StringNullableFilter<"MaintenanceRequest"> | string | null
    description?: StringFilter<"MaintenanceRequest"> | string
    type?: EnumMaintenanceTypeFilter<"MaintenanceRequest"> | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFilter<"MaintenanceRequest"> | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFilter<"MaintenanceRequest"> | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFilter<"MaintenanceRequest"> | Date | string
    scheduledFor?: DateTimeNullableFilter<"MaintenanceRequest"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"MaintenanceRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"MaintenanceRequest"> | Date | string
    updatedAt?: DateTimeFilter<"MaintenanceRequest"> | Date | string
    history?: MaintenanceHistoryListRelationFilter
  }

  export type MaintenanceRequestOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    propertyId?: SortOrder
    unitId?: SortOrderInput | SortOrder
    description?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    scheduledFor?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    history?: MaintenanceHistoryOrderByRelationAggregateInput
  }

  export type MaintenanceRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaintenanceRequestWhereInput | MaintenanceRequestWhereInput[]
    OR?: MaintenanceRequestWhereInput[]
    NOT?: MaintenanceRequestWhereInput | MaintenanceRequestWhereInput[]
    tenantId?: StringFilter<"MaintenanceRequest"> | string
    propertyId?: StringFilter<"MaintenanceRequest"> | string
    unitId?: StringNullableFilter<"MaintenanceRequest"> | string | null
    description?: StringFilter<"MaintenanceRequest"> | string
    type?: EnumMaintenanceTypeFilter<"MaintenanceRequest"> | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFilter<"MaintenanceRequest"> | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFilter<"MaintenanceRequest"> | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFilter<"MaintenanceRequest"> | Date | string
    scheduledFor?: DateTimeNullableFilter<"MaintenanceRequest"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"MaintenanceRequest"> | Date | string | null
    createdAt?: DateTimeFilter<"MaintenanceRequest"> | Date | string
    updatedAt?: DateTimeFilter<"MaintenanceRequest"> | Date | string
    history?: MaintenanceHistoryListRelationFilter
  }, "id">

  export type MaintenanceRequestOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    propertyId?: SortOrder
    unitId?: SortOrderInput | SortOrder
    description?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    scheduledFor?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MaintenanceRequestCountOrderByAggregateInput
    _max?: MaintenanceRequestMaxOrderByAggregateInput
    _min?: MaintenanceRequestMinOrderByAggregateInput
  }

  export type MaintenanceRequestScalarWhereWithAggregatesInput = {
    AND?: MaintenanceRequestScalarWhereWithAggregatesInput | MaintenanceRequestScalarWhereWithAggregatesInput[]
    OR?: MaintenanceRequestScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceRequestScalarWhereWithAggregatesInput | MaintenanceRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaintenanceRequest"> | string
    tenantId?: StringWithAggregatesFilter<"MaintenanceRequest"> | string
    propertyId?: StringWithAggregatesFilter<"MaintenanceRequest"> | string
    unitId?: StringNullableWithAggregatesFilter<"MaintenanceRequest"> | string | null
    description?: StringWithAggregatesFilter<"MaintenanceRequest"> | string
    type?: EnumMaintenanceTypeWithAggregatesFilter<"MaintenanceRequest"> | $Enums.MaintenanceType
    priority?: EnumPriorityLevelWithAggregatesFilter<"MaintenanceRequest"> | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusWithAggregatesFilter<"MaintenanceRequest"> | $Enums.MaintenanceStatus
    requestedAt?: DateTimeWithAggregatesFilter<"MaintenanceRequest"> | Date | string
    scheduledFor?: DateTimeNullableWithAggregatesFilter<"MaintenanceRequest"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"MaintenanceRequest"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MaintenanceRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MaintenanceRequest"> | Date | string
  }

  export type MaintenanceHistoryWhereInput = {
    AND?: MaintenanceHistoryWhereInput | MaintenanceHistoryWhereInput[]
    OR?: MaintenanceHistoryWhereInput[]
    NOT?: MaintenanceHistoryWhereInput | MaintenanceHistoryWhereInput[]
    id?: StringFilter<"MaintenanceHistory"> | string
    requestId?: StringFilter<"MaintenanceHistory"> | string
    action?: StringFilter<"MaintenanceHistory"> | string
    performedBy?: StringFilter<"MaintenanceHistory"> | string
    performedAt?: DateTimeFilter<"MaintenanceHistory"> | Date | string
    notes?: StringNullableFilter<"MaintenanceHistory"> | string | null
    request?: XOR<MaintenanceRequestScalarRelationFilter, MaintenanceRequestWhereInput>
  }

  export type MaintenanceHistoryOrderByWithRelationInput = {
    id?: SortOrder
    requestId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    notes?: SortOrderInput | SortOrder
    request?: MaintenanceRequestOrderByWithRelationInput
  }

  export type MaintenanceHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaintenanceHistoryWhereInput | MaintenanceHistoryWhereInput[]
    OR?: MaintenanceHistoryWhereInput[]
    NOT?: MaintenanceHistoryWhereInput | MaintenanceHistoryWhereInput[]
    requestId?: StringFilter<"MaintenanceHistory"> | string
    action?: StringFilter<"MaintenanceHistory"> | string
    performedBy?: StringFilter<"MaintenanceHistory"> | string
    performedAt?: DateTimeFilter<"MaintenanceHistory"> | Date | string
    notes?: StringNullableFilter<"MaintenanceHistory"> | string | null
    request?: XOR<MaintenanceRequestScalarRelationFilter, MaintenanceRequestWhereInput>
  }, "id">

  export type MaintenanceHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    requestId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: MaintenanceHistoryCountOrderByAggregateInput
    _max?: MaintenanceHistoryMaxOrderByAggregateInput
    _min?: MaintenanceHistoryMinOrderByAggregateInput
  }

  export type MaintenanceHistoryScalarWhereWithAggregatesInput = {
    AND?: MaintenanceHistoryScalarWhereWithAggregatesInput | MaintenanceHistoryScalarWhereWithAggregatesInput[]
    OR?: MaintenanceHistoryScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceHistoryScalarWhereWithAggregatesInput | MaintenanceHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaintenanceHistory"> | string
    requestId?: StringWithAggregatesFilter<"MaintenanceHistory"> | string
    action?: StringWithAggregatesFilter<"MaintenanceHistory"> | string
    performedBy?: StringWithAggregatesFilter<"MaintenanceHistory"> | string
    performedAt?: DateTimeWithAggregatesFilter<"MaintenanceHistory"> | Date | string
    notes?: StringNullableWithAggregatesFilter<"MaintenanceHistory"> | string | null
  }

  export type MaintenanceRequestCreateInput = {
    id?: string
    tenantId: string
    propertyId: string
    unitId?: string | null
    description: string
    type: $Enums.MaintenanceType
    priority: $Enums.PriorityLevel
    status: $Enums.MaintenanceStatus
    requestedAt?: Date | string
    scheduledFor?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    history?: MaintenanceHistoryCreateNestedManyWithoutRequestInput
  }

  export type MaintenanceRequestUncheckedCreateInput = {
    id?: string
    tenantId: string
    propertyId: string
    unitId?: string | null
    description: string
    type: $Enums.MaintenanceType
    priority: $Enums.PriorityLevel
    status: $Enums.MaintenanceStatus
    requestedAt?: Date | string
    scheduledFor?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    history?: MaintenanceHistoryUncheckedCreateNestedManyWithoutRequestInput
  }

  export type MaintenanceRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    history?: MaintenanceHistoryUpdateManyWithoutRequestNestedInput
  }

  export type MaintenanceRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    history?: MaintenanceHistoryUncheckedUpdateManyWithoutRequestNestedInput
  }

  export type MaintenanceRequestCreateManyInput = {
    id?: string
    tenantId: string
    propertyId: string
    unitId?: string | null
    description: string
    type: $Enums.MaintenanceType
    priority: $Enums.PriorityLevel
    status: $Enums.MaintenanceStatus
    requestedAt?: Date | string
    scheduledFor?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceHistoryCreateInput = {
    id?: string
    action: string
    performedBy: string
    performedAt?: Date | string
    notes?: string | null
    request: MaintenanceRequestCreateNestedOneWithoutHistoryInput
  }

  export type MaintenanceHistoryUncheckedCreateInput = {
    id?: string
    requestId: string
    action: string
    performedBy: string
    performedAt?: Date | string
    notes?: string | null
  }

  export type MaintenanceHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    performedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    request?: MaintenanceRequestUpdateOneRequiredWithoutHistoryNestedInput
  }

  export type MaintenanceHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    performedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceHistoryCreateManyInput = {
    id?: string
    requestId: string
    action: string
    performedBy: string
    performedAt?: Date | string
    notes?: string | null
  }

  export type MaintenanceHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    performedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    performedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumMaintenanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeFilter<$PrismaModel> | $Enums.MaintenanceType
  }

  export type EnumPriorityLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelFilter<$PrismaModel> | $Enums.PriorityLevel
  }

  export type EnumMaintenanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusFilter<$PrismaModel> | $Enums.MaintenanceStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type MaintenanceHistoryListRelationFilter = {
    every?: MaintenanceHistoryWhereInput
    some?: MaintenanceHistoryWhereInput
    none?: MaintenanceHistoryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MaintenanceHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MaintenanceRequestCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    propertyId?: SortOrder
    unitId?: SortOrder
    description?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    scheduledFor?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaintenanceRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    propertyId?: SortOrder
    unitId?: SortOrder
    description?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    scheduledFor?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaintenanceRequestMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    propertyId?: SortOrder
    unitId?: SortOrder
    description?: SortOrder
    type?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    scheduledFor?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumMaintenanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
  }

  export type EnumPriorityLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelWithAggregatesFilter<$PrismaModel> | $Enums.PriorityLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityLevelFilter<$PrismaModel>
    _max?: NestedEnumPriorityLevelFilter<$PrismaModel>
  }

  export type EnumMaintenanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MaintenanceRequestScalarRelationFilter = {
    is?: MaintenanceRequestWhereInput
    isNot?: MaintenanceRequestWhereInput
  }

  export type MaintenanceHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    notes?: SortOrder
  }

  export type MaintenanceHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    notes?: SortOrder
  }

  export type MaintenanceHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    requestId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    performedAt?: SortOrder
    notes?: SortOrder
  }

  export type MaintenanceHistoryCreateNestedManyWithoutRequestInput = {
    create?: XOR<MaintenanceHistoryCreateWithoutRequestInput, MaintenanceHistoryUncheckedCreateWithoutRequestInput> | MaintenanceHistoryCreateWithoutRequestInput[] | MaintenanceHistoryUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MaintenanceHistoryCreateOrConnectWithoutRequestInput | MaintenanceHistoryCreateOrConnectWithoutRequestInput[]
    createMany?: MaintenanceHistoryCreateManyRequestInputEnvelope
    connect?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
  }

  export type MaintenanceHistoryUncheckedCreateNestedManyWithoutRequestInput = {
    create?: XOR<MaintenanceHistoryCreateWithoutRequestInput, MaintenanceHistoryUncheckedCreateWithoutRequestInput> | MaintenanceHistoryCreateWithoutRequestInput[] | MaintenanceHistoryUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MaintenanceHistoryCreateOrConnectWithoutRequestInput | MaintenanceHistoryCreateOrConnectWithoutRequestInput[]
    createMany?: MaintenanceHistoryCreateManyRequestInputEnvelope
    connect?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumMaintenanceTypeFieldUpdateOperationsInput = {
    set?: $Enums.MaintenanceType
  }

  export type EnumPriorityLevelFieldUpdateOperationsInput = {
    set?: $Enums.PriorityLevel
  }

  export type EnumMaintenanceStatusFieldUpdateOperationsInput = {
    set?: $Enums.MaintenanceStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type MaintenanceHistoryUpdateManyWithoutRequestNestedInput = {
    create?: XOR<MaintenanceHistoryCreateWithoutRequestInput, MaintenanceHistoryUncheckedCreateWithoutRequestInput> | MaintenanceHistoryCreateWithoutRequestInput[] | MaintenanceHistoryUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MaintenanceHistoryCreateOrConnectWithoutRequestInput | MaintenanceHistoryCreateOrConnectWithoutRequestInput[]
    upsert?: MaintenanceHistoryUpsertWithWhereUniqueWithoutRequestInput | MaintenanceHistoryUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: MaintenanceHistoryCreateManyRequestInputEnvelope
    set?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    disconnect?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    delete?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    connect?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    update?: MaintenanceHistoryUpdateWithWhereUniqueWithoutRequestInput | MaintenanceHistoryUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: MaintenanceHistoryUpdateManyWithWhereWithoutRequestInput | MaintenanceHistoryUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: MaintenanceHistoryScalarWhereInput | MaintenanceHistoryScalarWhereInput[]
  }

  export type MaintenanceHistoryUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: XOR<MaintenanceHistoryCreateWithoutRequestInput, MaintenanceHistoryUncheckedCreateWithoutRequestInput> | MaintenanceHistoryCreateWithoutRequestInput[] | MaintenanceHistoryUncheckedCreateWithoutRequestInput[]
    connectOrCreate?: MaintenanceHistoryCreateOrConnectWithoutRequestInput | MaintenanceHistoryCreateOrConnectWithoutRequestInput[]
    upsert?: MaintenanceHistoryUpsertWithWhereUniqueWithoutRequestInput | MaintenanceHistoryUpsertWithWhereUniqueWithoutRequestInput[]
    createMany?: MaintenanceHistoryCreateManyRequestInputEnvelope
    set?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    disconnect?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    delete?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    connect?: MaintenanceHistoryWhereUniqueInput | MaintenanceHistoryWhereUniqueInput[]
    update?: MaintenanceHistoryUpdateWithWhereUniqueWithoutRequestInput | MaintenanceHistoryUpdateWithWhereUniqueWithoutRequestInput[]
    updateMany?: MaintenanceHistoryUpdateManyWithWhereWithoutRequestInput | MaintenanceHistoryUpdateManyWithWhereWithoutRequestInput[]
    deleteMany?: MaintenanceHistoryScalarWhereInput | MaintenanceHistoryScalarWhereInput[]
  }

  export type MaintenanceRequestCreateNestedOneWithoutHistoryInput = {
    create?: XOR<MaintenanceRequestCreateWithoutHistoryInput, MaintenanceRequestUncheckedCreateWithoutHistoryInput>
    connectOrCreate?: MaintenanceRequestCreateOrConnectWithoutHistoryInput
    connect?: MaintenanceRequestWhereUniqueInput
  }

  export type MaintenanceRequestUpdateOneRequiredWithoutHistoryNestedInput = {
    create?: XOR<MaintenanceRequestCreateWithoutHistoryInput, MaintenanceRequestUncheckedCreateWithoutHistoryInput>
    connectOrCreate?: MaintenanceRequestCreateOrConnectWithoutHistoryInput
    upsert?: MaintenanceRequestUpsertWithoutHistoryInput
    connect?: MaintenanceRequestWhereUniqueInput
    update?: XOR<XOR<MaintenanceRequestUpdateToOneWithWhereWithoutHistoryInput, MaintenanceRequestUpdateWithoutHistoryInput>, MaintenanceRequestUncheckedUpdateWithoutHistoryInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumMaintenanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeFilter<$PrismaModel> | $Enums.MaintenanceType
  }

  export type NestedEnumPriorityLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelFilter<$PrismaModel> | $Enums.PriorityLevel
  }

  export type NestedEnumMaintenanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusFilter<$PrismaModel> | $Enums.MaintenanceStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMaintenanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
  }

  export type NestedEnumPriorityLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelWithAggregatesFilter<$PrismaModel> | $Enums.PriorityLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityLevelFilter<$PrismaModel>
    _max?: NestedEnumPriorityLevelFilter<$PrismaModel>
  }

  export type NestedEnumMaintenanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MaintenanceHistoryCreateWithoutRequestInput = {
    id?: string
    action: string
    performedBy: string
    performedAt?: Date | string
    notes?: string | null
  }

  export type MaintenanceHistoryUncheckedCreateWithoutRequestInput = {
    id?: string
    action: string
    performedBy: string
    performedAt?: Date | string
    notes?: string | null
  }

  export type MaintenanceHistoryCreateOrConnectWithoutRequestInput = {
    where: MaintenanceHistoryWhereUniqueInput
    create: XOR<MaintenanceHistoryCreateWithoutRequestInput, MaintenanceHistoryUncheckedCreateWithoutRequestInput>
  }

  export type MaintenanceHistoryCreateManyRequestInputEnvelope = {
    data: MaintenanceHistoryCreateManyRequestInput | MaintenanceHistoryCreateManyRequestInput[]
    skipDuplicates?: boolean
  }

  export type MaintenanceHistoryUpsertWithWhereUniqueWithoutRequestInput = {
    where: MaintenanceHistoryWhereUniqueInput
    update: XOR<MaintenanceHistoryUpdateWithoutRequestInput, MaintenanceHistoryUncheckedUpdateWithoutRequestInput>
    create: XOR<MaintenanceHistoryCreateWithoutRequestInput, MaintenanceHistoryUncheckedCreateWithoutRequestInput>
  }

  export type MaintenanceHistoryUpdateWithWhereUniqueWithoutRequestInput = {
    where: MaintenanceHistoryWhereUniqueInput
    data: XOR<MaintenanceHistoryUpdateWithoutRequestInput, MaintenanceHistoryUncheckedUpdateWithoutRequestInput>
  }

  export type MaintenanceHistoryUpdateManyWithWhereWithoutRequestInput = {
    where: MaintenanceHistoryScalarWhereInput
    data: XOR<MaintenanceHistoryUpdateManyMutationInput, MaintenanceHistoryUncheckedUpdateManyWithoutRequestInput>
  }

  export type MaintenanceHistoryScalarWhereInput = {
    AND?: MaintenanceHistoryScalarWhereInput | MaintenanceHistoryScalarWhereInput[]
    OR?: MaintenanceHistoryScalarWhereInput[]
    NOT?: MaintenanceHistoryScalarWhereInput | MaintenanceHistoryScalarWhereInput[]
    id?: StringFilter<"MaintenanceHistory"> | string
    requestId?: StringFilter<"MaintenanceHistory"> | string
    action?: StringFilter<"MaintenanceHistory"> | string
    performedBy?: StringFilter<"MaintenanceHistory"> | string
    performedAt?: DateTimeFilter<"MaintenanceHistory"> | Date | string
    notes?: StringNullableFilter<"MaintenanceHistory"> | string | null
  }

  export type MaintenanceRequestCreateWithoutHistoryInput = {
    id?: string
    tenantId: string
    propertyId: string
    unitId?: string | null
    description: string
    type: $Enums.MaintenanceType
    priority: $Enums.PriorityLevel
    status: $Enums.MaintenanceStatus
    requestedAt?: Date | string
    scheduledFor?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceRequestUncheckedCreateWithoutHistoryInput = {
    id?: string
    tenantId: string
    propertyId: string
    unitId?: string | null
    description: string
    type: $Enums.MaintenanceType
    priority: $Enums.PriorityLevel
    status: $Enums.MaintenanceStatus
    requestedAt?: Date | string
    scheduledFor?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceRequestCreateOrConnectWithoutHistoryInput = {
    where: MaintenanceRequestWhereUniqueInput
    create: XOR<MaintenanceRequestCreateWithoutHistoryInput, MaintenanceRequestUncheckedCreateWithoutHistoryInput>
  }

  export type MaintenanceRequestUpsertWithoutHistoryInput = {
    update: XOR<MaintenanceRequestUpdateWithoutHistoryInput, MaintenanceRequestUncheckedUpdateWithoutHistoryInput>
    create: XOR<MaintenanceRequestCreateWithoutHistoryInput, MaintenanceRequestUncheckedCreateWithoutHistoryInput>
    where?: MaintenanceRequestWhereInput
  }

  export type MaintenanceRequestUpdateToOneWithWhereWithoutHistoryInput = {
    where?: MaintenanceRequestWhereInput
    data: XOR<MaintenanceRequestUpdateWithoutHistoryInput, MaintenanceRequestUncheckedUpdateWithoutHistoryInput>
  }

  export type MaintenanceRequestUpdateWithoutHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceRequestUncheckedUpdateWithoutHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    unitId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceHistoryCreateManyRequestInput = {
    id?: string
    action: string
    performedBy: string
    performedAt?: Date | string
    notes?: string | null
  }

  export type MaintenanceHistoryUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    performedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceHistoryUncheckedUpdateWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    performedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceHistoryUncheckedUpdateManyWithoutRequestInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    performedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}