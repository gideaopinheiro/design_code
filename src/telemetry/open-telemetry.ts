import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  // ATTR_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';

const getInstrumentations = () => {
  const nestjsInstrumentation = new NestInstrumentation();
  const nodeInstrumentations = getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-nestjs-core': { enabled: true },
    '@opentelemetry/instrumentation-http': {
      enabled: true,
    },
    '@opentelemetry/instrumentation-winston': { enabled: true },
    '@opentelemetry/instrumentation-net': { enabled: true },
    '@opentelemetry/instrumentation-express': { enabled: true },
    '@opentelemetry/instrumentation-dns': { enabled: true },

    // Disable irrelevant instrumentations.
    '@opentelemetry/instrumentation-ioredis': { enabled: false },
    '@opentelemetry/instrumentation-aws-sdk': { enabled: false },
    '@opentelemetry/instrumentation-aws-lambda': { enabled: false },
    '@opentelemetry/instrumentation-bunyan': { enabled: false },
    '@opentelemetry/instrumentation-connect': { enabled: false },
    '@opentelemetry/instrumentation-cucumber': { enabled: false },
    '@opentelemetry/instrumentation-dataloader': { enabled: false },
    '@opentelemetry/instrumentation-fastify': { enabled: false },
    '@opentelemetry/instrumentation-fs': { enabled: false },
    '@opentelemetry/instrumentation-generic-pool': { enabled: false },
    '@opentelemetry/instrumentation-graphql': { enabled: false },
    '@opentelemetry/instrumentation-grpc': { enabled: false },
    '@opentelemetry/instrumentation-hapi': { enabled: false },
    '@opentelemetry/instrumentation-kafkajs': { enabled: false },
    '@opentelemetry/instrumentation-knex': { enabled: false },
    '@opentelemetry/instrumentation-koa': { enabled: false },
    '@opentelemetry/instrumentation-lru-memoizer': { enabled: false },
    '@opentelemetry/instrumentation-memcached': { enabled: false },
    '@opentelemetry/instrumentation-mongodb': { enabled: false },
    '@opentelemetry/instrumentation-mysql': { enabled: false },
    '@opentelemetry/instrumentation-mysql2': { enabled: false },
    '@opentelemetry/instrumentation-pg': { enabled: false },
    '@opentelemetry/instrumentation-pino': { enabled: false },
    '@opentelemetry/instrumentation-redis': { enabled: false },
    '@opentelemetry/instrumentation-redis-4': { enabled: false },
    '@opentelemetry/instrumentation-restify': { enabled: false },
    '@opentelemetry/instrumentation-router': { enabled: false },
    '@opentelemetry/instrumentation-socket.io': { enabled: false },
    '@opentelemetry/instrumentation-tedious': { enabled: false },
    '@opentelemetry/instrumentation-undici': { enabled: false },
  });

  return [nestjsInstrumentation, ...nodeInstrumentations];
};

const buildOpentelemetrySDK = () => {
  return new NodeSDK({
    serviceName: 'design_code',
    resource: new Resource({
      [ATTR_SERVICE_NAME]: 'Design Code',
      [ATTR_SERVICE_VERSION]: '1.0', // recomendado usar pela doc do bugsnag
      // [ATTR_DEPLOYMENT_ENVIRONMENT]: 'production', // // recomendado usar pela doc do bugsnag
    }),
    textMapPropagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
      ],
    }),
    traceExporter: new OTLPTraceExporter({
      url: 'http://otel-collector:4318/v1/traces',
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: 'http://otel-collector:4318/v1/metrics',
      }),
    }),
    instrumentations: [getInstrumentations()],
  });
};

const registerGracefulShutdownHandler = ({
  sdk,
  event,
}: {
  sdk: NodeSDK;
  event: 'SIGTERM' | 'SIGINT';
}): void => {
  process.on(event, async () => {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        level: 'info',
        timestamp: new Date().toISOString(),
        message: `Shutdown OpenTelemetry on ${event}`,
      }),
    );

    // Flush traces and metrics to the API before shutdown.
    await sdk.shutdown();
  });
};

export const instrumentTelemetry = () => {
  const sdk = buildOpentelemetrySDK();

  sdk.start();

  registerGracefulShutdownHandler({ sdk, event: 'SIGTERM' });
  registerGracefulShutdownHandler({ sdk, event: 'SIGINT' });
};
