// src/constants/projectDetails.ts
// Project details constants for all projects

export const PROJECT_DETAILS = {
  'distributed-task-engine': {
    id: 'distributed-task-engine',
    title: 'Distributed Task Engine',
    tagline: 'Orchestrating 10M+ daily events across 40+ microservices at 99.99% uptime.',
    year: '2023',
    role: 'Lead Architect & Engineer',
    team: '6 Engineers',
    duration: '8 months',
    tags: ['Go', 'Kafka', 'Redis', 'Kubernetes', 'gRPC', 'PostgreSQL'],
    status: 'Production',
    github: null, // Enterprise project - no public code
    docUrl: '#', // Documentation link
    diagramUrl: '#', // Draw.io diagrams
    overview:
      'A high-throughput, horizontally scalable task orchestration platform built to replace a brittle monolith that was dropping 3% of tasks under peak load.',
    problem:
      'The legacy cron-based system was processing tasks sequentially, causing cascading failures when any single worker went down. With 50K tasks/hour becoming 500K tasks/hour over 18 months, the architecture was fundamentally broken.',
    solution:
      'Re-architected the entire pipeline around an event-driven model. Kafka became the durable backbone, Go workers consumed from partitioned topics with consumer-group offsets, Redis handled distributed state and pub/sub coordination, and Kubernetes HPA scaled workers automatically.',
    evidenceType: 'docs', // Documentation and diagrams only
    hasCaseStudy: true,
    screenshots: [
      { caption: 'Dashboard overview showing real-time task processing metrics', placeholder: 'Dashboard View' },
      { caption: 'Kafka consumer group monitoring with lag visualization', placeholder: 'Consumer Monitoring' },
      { caption: 'Kubernetes HPA configuration based on consumer lag', placeholder: 'Auto-scaling Config' },
      { caption: 'Distributed tracing view showing end-to-end request flow', placeholder: 'Request Tracing' },
    ],
    videoLinks: [
      { title: 'Project Demo', url: '#', description: 'Watch the full project walkthrough' },
      { title: 'Architecture Overview', url: '#', description: 'System design explanation' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Technical documentation' },
      { title: 'API Reference', url: '#', description: 'Complete API docs' },
      { title: 'Case Study', url: '#', description: 'Detailed analysis' },
    ],
    architecture: {
      description: 'Event-driven architecture with Kafka as the central event bus',
      components: [
        { name: 'API Gateway', role: 'Request ingress, rate limiting, routing' },
        { name: 'Kafka Cluster', role: 'Durable event bus, 7-day retention, 3× replication' },
        { name: 'Go Workers', role: 'Event consumers, goroutine-per-task processing' },
        { name: 'Redis Cluster', role: 'Distributed locks, LRU cache, pub/sub coordination' },
        { name: 'PostgreSQL', role: 'Task audit trail, 8-shard hash on task_id' },
        { name: 'Prometheus', role: 'Custom metrics: lag, throughput, DLQ depth' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'cmd/worker/', type: 'dir', description: 'Main worker entry point' },
        { name: 'internal/consumer/', type: 'dir', description: 'Kafka consumer implementation' },
        { name: 'internal/processor/', type: 'dir', description: 'Task processing logic' },
        { name: 'internal/storage/', type: 'dir', description: 'Redis & PostgreSQL clients' },
        { name: 'pkg/metrics/', type: 'dir', description: 'Prometheus metrics exporters' },
        { name: 'go.mod', type: 'file', description: 'Dependencies and module definition' },
      ],
      keyFiles: [
        { path: 'internal/consumer/group.go', description: 'Consumer group management with graceful shutdown' },
        { path: 'internal/processor/task.go', description: 'Core task processing with idempotency' },
        { path: 'pkg/metrics/exporter.go', description: 'Custom Prometheus metrics definition' },
      ],
    },
    timeline: [
      { phase: 'Discovery', duration: '2 wks', desc: 'Load analysis, failure mode mapping, stakeholder alignment on SLAs.' },
      { phase: 'Architecture', duration: '3 wks', desc: 'System design, ADRs written, tech spike on Kafka consumer group behavior.' },
      { phase: 'Core Build', duration: '10 wks', desc: 'Go workers, Kafka topology, Redis state layer, gRPC service mesh.' },
      { phase: 'Observability', duration: '3 wks', desc: 'Prometheus metrics, Grafana dashboards, distributed tracing via Jaeger.' },
      { phase: 'Migration', duration: '6 wks', desc: 'Dark-launch dual-write, traffic shadow, gradual 10→100% cutover.' },
      { phase: 'Hardening', duration: '4 wks', desc: 'Chaos engineering, runbook authoring, on-call training.' },
    ],
    learnings: [
      'Consumer lag is a better scaling signal than CPU — wire it to HPA from day one.',
      'Schema registries are not optional on a multi-team Kafka cluster.',
      'Idempotency keys on every task prevented duplicate processing during rebalances.',
      'Synthetic canaries that mimic real traffic caught 4 regressions before users saw them.',
    ],
    documentation: [
      {
        title: 'System Architecture',
        content: 'The system follows an event-driven architecture pattern. All task requests are published to Kafka topics, which are consumed by horizontally scalable Go workers. Redis provides distributed coordination for locks and caching, while PostgreSQL serves as the source of truth for audit trails.',
      },
      {
        title: 'Kafka Consumer Groups',
        content: 'Workers are organized into consumer groups with automatic partition assignment. Each partition is consumed by exactly one worker within a group, ensuring parallel processing while maintaining message ordering per partition. Consumer offsets are committed to Kafka to enable exactly-once processing semantics.',
      },
      {
        title: 'Auto-scaling Strategy',
        content: 'Kubernetes Horizontal Pod Autoscaler is configured to scale based on custom Prometheus metrics: consumer lag and messages per second. This ensures the system scales proactively based on actual workload rather than CPU utilization, preventing backlog buildup during traffic spikes.',
      },
    ],
  },
  'real-time-analytics': {
    id: 'real-time-analytics',
    title: 'Real-time Analytics',
    tagline: 'WebSocket-driven dashboard with live data visualization for 50K+ concurrent data streams.',
    year: '2023',
    role: 'Frontend Lead',
    team: '4 Engineers',
    duration: '6 months',
    tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'WebSocket'],
    status: 'Production',
    github: '#', // Available code
    docUrl: '#', // Documentation
    diagramUrl: '#', // Architecture diagrams
    overview:
      'A real-time analytics dashboard that processes and visualizes data from 50K+ concurrent streams with sub-100ms latency.',
    problem:
      'The existing analytics platform had 5+ second latency and could only handle 5K concurrent users. Real-time decision making was impossible due to stale data.',
    solution:
      'Implemented WebSocket-based real-time data streaming with React and D3.js for visualization. Node.js backend with connection pooling and optimized query patterns reduced latency to under 100ms.',
    evidenceType: 'mixed', // Both code and documentation
    hasCaseStudy: true,
    screenshots: [
      { caption: 'Real-time dashboard with live data streams', placeholder: 'Dashboard View' },
      { caption: 'Data visualization with D3.js charts', placeholder: 'Charts View' },
      { caption: 'WebSocket connection monitoring', placeholder: 'Connection Monitor' },
      { caption: 'Performance metrics dashboard', placeholder: 'Metrics View' },
    ],
    videoLinks: [
      { title: 'Live Demo', url: '#', description: 'See real-time data in action' },
      { title: 'Architecture Walkthrough', url: '#', description: 'System design explanation' },
    ],
    extraLinks: [
      { title: 'API Docs', url: '#', description: 'WebSocket API documentation' },
      { title: 'Performance Report', url: '#', description: 'Load testing results' },
      { title: 'Case Study', url: '#', description: 'Complete implementation analysis' },
    ],
    architecture: {
      description: 'Real-time streaming architecture with WebSocket and optimized data pipelines',
      components: [
        { name: 'React Frontend', role: 'Real-time UI with D3.js visualization' },
        { name: 'Node.js Backend', role: 'WebSocket server with connection pooling' },
        { name: 'PostgreSQL', role: 'Optimized queries with materialized views' },
        { name: 'Redis Cache', role: 'Hot data caching for sub-100ms response' },
        { name: 'D3.js', role: 'Interactive data visualization' },
        { name: 'WebSocket', role: 'Bidirectional real-time communication' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'src/components/', type: 'dir', description: 'React components and visualizations' },
        { name: 'src/hooks/', type: 'dir', description: 'Custom React hooks for WebSocket' },
        { name: 'server/websocket/', type: 'dir', description: 'WebSocket server implementation' },
        { name: 'server/queries/', type: 'dir', description: 'Optimized database queries' },
        { name: 'src/utils/', type: 'dir', description: 'Data processing utilities' },
        { name: 'package.json', type: 'file', description: 'Dependencies and scripts' },
      ],
      keyFiles: [
        { path: 'src/hooks/useWebSocket.ts', description: 'Custom WebSocket hook with reconnection logic' },
        { path: 'server/websocket/server.ts', description: 'WebSocket server with connection management' },
        { path: 'src/components/RealTimeChart.tsx', description: 'D3.js chart component with live updates' },
      ],
    },
    timeline: [
      { phase: 'Research', duration: '2 wks', desc: 'WebSocket protocols, D3.js evaluation, performance requirements' },
      { phase: 'Design', duration: '2 wks', desc: 'System architecture, UI/UX design, data flow diagrams' },
      { phase: 'Backend', duration: '8 wks', desc: 'WebSocket server, query optimization, caching layer' },
      { phase: 'Frontend', duration: '10 wks', desc: 'React components, D3.js visualizations, state management' },
      { phase: 'Testing', duration: '3 wks', desc: 'Load testing, performance optimization, bug fixes' },
      { phase: 'Deployment', duration: '2 wks', desc: 'Production deployment, monitoring setup, documentation' },
    ],
    learnings: [
      'WebSocket connection pooling is essential for handling 50K+ concurrent connections',
      'D3.js performance optimization requires careful data management and update strategies',
      'Materialized views in PostgreSQL can reduce query time by 90%',
      'Real-time systems need comprehensive monitoring and alerting from day one',
    ],
    documentation: [
      {
        title: 'WebSocket Architecture',
        content: 'The system uses a WebSocket-based architecture for real-time bidirectional communication. The Node.js server manages connection pools and handles reconnection logic automatically. React components use custom hooks to manage WebSocket lifecycle and data updates.',
      },
      {
        title: 'Data Visualization',
        content: 'D3.js is used for creating interactive, real-time data visualizations. Charts update automatically as new data arrives through WebSocket connections. Performance is optimized through efficient data diffing and selective DOM updates.',
      },
      {
        title: 'Performance Optimization',
        content: 'Multiple optimization strategies were implemented: Redis caching for hot data, materialized views in PostgreSQL, connection pooling, and efficient data serialization. These optimizations reduced latency from 5+ seconds to under 100ms.',
      },
    ],
  },
  'authshield-sdk': {
    id: 'authshield-sdk',
    title: 'AuthShield SDK',
    tagline: 'Zero-trust authentication SDK with biometric support and FIDO2 compliance.',
    year: '2024',
    role: 'Lead Developer',
    team: '3 Engineers',
    duration: '5 months',
    tags: ['TypeScript', 'OAuth', 'WebAuthn', 'FIDO2'],
    status: 'Open Source',
    github: '#', // Open source project
    docUrl: '#', // API documentation
    diagramUrl: null, // No diagrams needed
    overview:
      'A comprehensive authentication SDK that provides zero-trust security with biometric authentication and FIDO2 compliance.',
    problem:
      'Existing authentication solutions were either too complex to integrate or lacked modern security features like biometric auth and FIDO2 support.',
    solution:
      'Built a modular TypeScript SDK with OAuth 2.0, WebAuthn, and biometric authentication support. Clean API design with comprehensive documentation and examples.',
    evidenceType: 'code', // Full open source code
    hasCaseStudy: true,
    screenshots: [
      { caption: 'SDK integration example', placeholder: 'Integration View' },
      { caption: 'Biometric authentication flow', placeholder: 'Biometric Flow' },
      { caption: 'FIDO2 security demonstration', placeholder: 'Security Demo' },
      { caption: 'API documentation', placeholder: 'API Docs' },
    ],
    videoLinks: [
      { title: 'Quick Start Guide', url: '#', description: 'Get started in 5 minutes' },
      { title: 'Security Overview', url: '#', description: 'Security features explained' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Complete SDK documentation' },
      { title: 'Examples', url: '#', description: 'Code examples and tutorials' },
      { title: 'Security Audit', url: '#', description: 'Third-party security review' },
    ],
    architecture: {
      description: 'Modular SDK architecture with pluggable authentication methods',
      components: [
        { name: 'Core SDK', role: 'Main authentication orchestration' },
        { name: 'OAuth Module', role: 'OAuth 2.0 flow implementation' },
        { name: 'WebAuthn Module', role: 'FIDO2/WebAuthn support' },
        { name: 'Biometric Module', role: 'Biometric authentication' },
        { name: 'Session Manager', role: 'Secure session handling' },
        { name: 'Crypto Utils', role: 'Encryption and signing utilities' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'src/core/', type: 'dir', description: 'Core SDK functionality' },
        { name: 'src/modules/', type: 'dir', description: 'Pluggable authentication modules' },
        { name: 'src/utils/', type: 'dir', description: 'Cryptographic utilities' },
        { name: 'examples/', type: 'dir', description: 'Usage examples and demos' },
        { name: 'docs/', type: 'dir', description: 'API documentation' },
        { name: 'package.json', type: 'file', description: 'Package configuration' },
      ],
      keyFiles: [
        { path: 'src/core/AuthManager.ts', description: 'Main authentication manager class' },
        { path: 'src/modules/WebAuthn.ts', description: 'FIDO2/WebAuthn implementation' },
        { path: 'src/utils/crypto.ts', description: 'Cryptographic utility functions' },
      ],
    },
    timeline: [
      { phase: 'Research', duration: '2 wks', desc: 'OAuth 2.0, WebAuthn, biometric auth research' },
      { phase: 'Design', duration: '2 wks', desc: 'SDK architecture, API design, security requirements' },
      { phase: 'Core Development', duration: '8 wks', desc: 'Core SDK, OAuth module, session management' },
      { phase: 'Advanced Features', duration: '6 wks', desc: 'WebAuthn, biometric auth, crypto utilities' },
      { phase: 'Testing', duration: '3 wks', desc: 'Unit tests, integration tests, security audit' },
      { phase: 'Documentation', duration: '2 wks', desc: 'API docs, examples, tutorials' },
    ],
    learnings: [
      'Modular SDK design is crucial for supporting multiple authentication methods',
      'WebAuthn implementation requires careful attention to browser compatibility',
      'Security audits should be integrated early in the development process',
      'Comprehensive documentation is essential for developer adoption',
    ],
    documentation: [
      {
        title: 'SDK Architecture',
        content: 'The SDK follows a modular architecture with a core authentication manager and pluggable modules for different authentication methods. This design allows developers to use only the features they need while maintaining a consistent API.',
      },
      {
        title: 'Security Features',
        content: 'AuthShield implements multiple security features: zero-trust architecture, biometric authentication, FIDO2/WebAuthn support, secure session management, and comprehensive encryption. All cryptographic operations use industry-standard libraries.',
      },
      {
        title: 'Integration Guide',
        content: 'The SDK provides multiple integration options: React hooks, vanilla JavaScript, and TypeScript. Comprehensive examples show common use cases like login, registration, password reset, and multi-factor authentication.',
      },
    ],
  },
  'datapipe': {
    id: 'datapipe',
    title: 'DataPipe',
    tagline: 'Real-time ETL pipeline handling petabyte-scale data processing with backpressure control.',
    year: '2023',
    role: 'Data Engineer',
    team: '5 Engineers',
    duration: '7 months',
    tags: ['Python', 'Kafka', 'Airflow'],
    status: 'Production',
    github: '#',
    overview:
      'A real-time ETL pipeline designed to handle petabyte-scale data processing with intelligent backpressure control and fault tolerance.',
    problem:
      'The existing batch processing system had 6+ hour latency and couldn\'t handle real-time analytics requirements. Data backpressure caused cascading failures during peak loads.',
    solution:
      'Built a streaming ETL pipeline using Kafka for real-time data ingestion, Python workers for transformation, and Airflow for orchestration. Implemented backpressure control and circuit breakers to prevent system overload.',
    screenshots: [
      { caption: 'Pipeline monitoring dashboard', placeholder: 'Pipeline Dashboard' },
      { caption: 'Data flow visualization', placeholder: 'Data Flow' },
      { caption: 'Backpressure control metrics', placeholder: 'Backpressure Metrics' },
      { caption: 'Airflow DAG overview', placeholder: 'Airflow DAG' },
    ],
    videoLinks: [
      { title: 'Pipeline Demo', url: '#', description: 'See real-time data processing' },
      { title: 'Architecture Overview', url: '#', description: 'System design explanation' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Technical documentation' },
      { title: 'Monitoring Guide', url: '#', description: 'Operations guide' },
      { title: 'Case Study', url: '#', description: 'Implementation analysis' },
    ],
    architecture: {
      description: 'Streaming ETL architecture with backpressure control',
      components: [
        { name: 'Kafka Cluster', role: 'Real-time data ingestion and buffering' },
        { name: 'Python Workers', role: 'Data transformation and processing' },
        { name: 'Airflow', role: 'Pipeline orchestration and scheduling' },
        { name: 'Backpressure Controller', role: 'Flow control and rate limiting' },
        { name: 'Data Lake', role: 'Processed data storage' },
        { name: 'Monitoring Stack', role: 'Pipeline health and performance' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'src/processors/', type: 'dir', description: 'Data transformation logic' },
        { name: 'src/controllers/', type: 'dir', description: 'Backpressure control' },
        { name: 'dags/', type: 'dir', description: 'Airflow pipeline definitions' },
        { name: 'tests/', type: 'dir', description: 'Unit and integration tests' },
        { name: 'config/', type: 'dir', description: 'Pipeline configuration' },
        { name: 'requirements.txt', type: 'file', description: 'Python dependencies' },
      ],
      keyFiles: [
        { path: 'src/controllers/backpressure.py', description: 'Backpressure control implementation' },
        { path: 'src/processors/transform.py', description: 'Data transformation logic' },
        { path: 'dags/pipeline.py', description: 'Airflow pipeline definition' },
      ],
    },
    timeline: [
      { phase: 'Analysis', duration: '2 wks', desc: 'Data flow analysis, bottleneck identification, requirements gathering.' },
      { phase: 'Design', duration: '3 wks', desc: 'Pipeline architecture, backpressure strategy, technology selection.' },
      { phase: 'Core Pipeline', duration: '8 wks', desc: 'Kafka setup, Python workers, data transformation logic.' },
      { phase: 'Orchestration', duration: '4 wks', desc: 'Airflow integration, DAG development, scheduling.' },
      { phase: 'Testing', duration: '3 wks', desc: 'Load testing, backpressure validation, fault tolerance testing.' },
      { phase: 'Deployment', duration: '2 wks', desc: 'Production deployment, monitoring setup, documentation.' },
    ],
    learnings: [
      'Backpressure control is essential for preventing cascading failures in streaming systems',
      'Circuit breakers should be implemented at multiple levels for better fault tolerance',
      'Data quality checks should be integrated into the pipeline, not added as an afterthought',
      'Monitoring and alerting are critical for operating large-scale data pipelines',
    ],
    documentation: [
      {
        title: 'Pipeline Architecture',
        content: 'DataPipe follows a streaming ETL architecture pattern. Data is ingested through Kafka topics, processed by Python workers with backpressure control, and stored in a data lake. Airflow orchestrates the entire pipeline with configurable scheduling and dependencies.',
      },
      {
        title: 'Backpressure Control',
        content: 'The system implements intelligent backpressure control using a combination of rate limiting, queue monitoring, and adaptive processing. When backpressure is detected, the system automatically reduces ingestion rate and scales processing capacity.',
      },
      {
        title: 'Fault Tolerance',
        content: 'Multiple fault tolerance mechanisms are implemented: Kafka message durability, worker restart policies, checkpoint-based recovery, and circuit breakers. These ensure the pipeline can handle failures without data loss or extended downtime.',
      },
    ],
  },
  'clouddash': {
    id: 'clouddash',
    title: 'CloudDash',
    tagline: 'Infrastructure monitoring and alerting platform with anomaly detection.',
    year: '2023',
    role: 'Full Stack Developer',
    team: '4 Engineers',
    duration: '6 months',
    tags: ['React', 'AWS', 'Terraform'],
    status: 'Production',
    github: '#',
    overview:
      'A comprehensive infrastructure monitoring platform with real-time dashboards, intelligent alerting, and anomaly detection capabilities.',
    problem:
      'The team was using multiple monitoring tools with no unified view. Alert fatigue was high due to noisy notifications, and anomaly detection was non-existent.',
    solution:
      'Built a unified monitoring dashboard using React for the frontend, AWS CloudWatch for metrics collection, and custom anomaly detection algorithms. Terraform enabled infrastructure as code for easy deployment.',
    screenshots: [
      { caption: 'Main monitoring dashboard', placeholder: 'Dashboard View' },
      { caption: 'Anomaly detection alerts', placeholder: 'Anomaly Alerts' },
      { caption: 'Infrastructure topology', placeholder: 'Topology View' },
      { caption: 'Alert configuration', placeholder: 'Alert Config' },
    ],
    videoLinks: [
      { title: 'Platform Demo', url: '#', description: 'See monitoring in action' },
      { title: 'Alert Walkthrough', url: '#', description: 'Alert system explanation' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Complete platform docs' },
      { title: 'Terraform Modules', url: '#', description: 'Infrastructure code' },
      { title: 'Runbook', url: '#', description: 'Operations guide' },
    ],
    architecture: {
      description: 'Cloud-native monitoring architecture with anomaly detection',
      components: [
        { name: 'React Frontend', role: 'Real-time dashboards and visualizations' },
        { name: 'AWS CloudWatch', role: 'Metrics collection and storage' },
        { name: 'Anomaly Detection', role: 'ML-based anomaly identification' },
        { name: 'Alert Engine', role: 'Intelligent alerting and routing' },
        { name: 'Terraform', role: 'Infrastructure as code' },
        { name: 'Notification Service', role: 'Multi-channel alert delivery' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'src/components/', type: 'dir', description: 'React dashboard components' },
        { name: 'src/services/', type: 'dir', description: 'API and data services' },
        { name: 'terraform/', type: 'dir', description: 'Infrastructure definitions' },
        { name: 'lambda/', type: 'dir', description: 'AWS Lambda functions' },
        { name: 'src/utils/', type: 'dir', description: 'Utility functions' },
        { name: 'package.json', type: 'file', description: 'Frontend dependencies' },
      ],
      keyFiles: [
        { path: 'src/components/Dashboard.tsx', description: 'Main dashboard component' },
        { path: 'src/services/anomaly.ts', description: 'Anomaly detection service' },
        { path: 'terraform/main.tf', description: 'Infrastructure definition' },
      ],
    },
    timeline: [
      { phase: 'Research', duration: '2 wks', desc: 'Monitoring tools evaluation, requirements gathering, tech stack selection.' },
      { phase: 'Design', duration: '2 wks', desc: 'System architecture, UI/UX design, alert strategy definition.' },
      { phase: 'Frontend', duration: '8 wks', desc: 'React dashboards, data visualization, real-time updates.' },
      { phase: 'Backend', duration: '6 wks', desc: 'AWS integration, anomaly detection, alert engine.' },
      { phase: 'Infrastructure', duration: '3 wks', desc: 'Terraform modules, deployment automation, monitoring.' },
      { phase: 'Testing', duration: '2 wks', desc: 'Load testing, alert validation, user acceptance testing.' },
    ],
    learnings: [
      'Unified monitoring view significantly reduces alert fatigue',
      'Anomaly detection requires continuous tuning and feedback',
      'Infrastructure as code is essential for consistent deployments',
      'Real-time dashboards need efficient data aggregation strategies',
    ],
    documentation: [
      {
        title: 'Monitoring Architecture',
        content: 'CloudDash uses a cloud-native architecture with AWS CloudWatch as the metrics backbone. React frontends provide real-time visualization, while custom anomaly detection algorithms identify unusual patterns. Terraform manages all infrastructure as code.',
      },
      {
        title: 'Anomaly Detection',
        content: 'The anomaly detection system uses machine learning to identify unusual patterns in metrics data. It learns normal behavior over time and alerts on deviations. The system includes automatic threshold adjustment and noise reduction to minimize false positives.',
      },
      {
        title: 'Alert Management',
        content: 'Alerts are intelligently routed based on severity and impact. The system includes alert grouping, deduplication, and escalation policies. Multiple notification channels ensure critical alerts are never missed while reducing noise for minor issues.',
      },
    ],
  },
  'apiforge': {
    id: 'apiforge',
    title: 'APIForge',
    tagline: 'High-performance API gateway framework with circuit breaking and rate limiting.',
    year: '2024',
    role: 'Backend Developer',
    team: '3 Engineers',
    duration: '5 months',
    tags: ['Go', 'gRPC', 'Protobuf'],
    status: 'Open Source',
    github: '#',
    overview:
      'A high-performance API gateway framework designed for microservices with built-in circuit breaking, rate limiting, and observability.',
    problem:
      'Existing API gateways were either too heavy or lacked essential features like circuit breaking and fine-grained rate limiting. Custom solutions were difficult to maintain.',
    solution:
      'Built a lightweight yet powerful API gateway in Go with gRPC support. Implemented circuit breaking patterns, token bucket rate limiting, and comprehensive metrics collection.',
    screenshots: [
      { caption: 'Gateway configuration dashboard', placeholder: 'Config Dashboard' },
      { caption: 'Rate limiting metrics', placeholder: 'Rate Limiting' },
      { caption: 'Circuit breaker status', placeholder: 'Circuit Breaker' },
      { caption: 'Performance monitoring', placeholder: 'Performance' },
    ],
    videoLinks: [
      { title: 'Gateway Demo', url: '#', description: 'See API gateway in action' },
      { title: 'Configuration Guide', url: '#', description: 'Setup and configuration' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Complete documentation' },
      { title: 'Examples', url: '#', description: 'Usage examples' },
      { title: 'Benchmarks', url: '#', description: 'Performance benchmarks' },
    ],
    architecture: {
      description: 'High-performance gateway architecture with resilience patterns',
      components: [
        { name: 'Go Gateway', role: 'High-performance request routing' },
        { name: 'Circuit Breaker', role: 'Fault tolerance and fallback' },
        { name: 'Rate Limiter', role: 'Token bucket rate limiting' },
        { name: 'gRPC Proxy', role: 'Protocol translation and routing' },
        { name: 'Metrics Collector', role: 'Performance and usage metrics' },
        { name: 'Config Manager', role: 'Dynamic configuration management' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'cmd/gateway/', type: 'dir', description: 'Gateway entry point' },
        { name: 'internal/proxy/', type: 'dir', description: 'Request proxying logic' },
        { name: 'internal/circuit/', type: 'dir', description: 'Circuit breaker implementation' },
        { name: 'internal/ratelimit/', type: 'dir', description: 'Rate limiting logic' },
        { name: 'pkg/metrics/', type: 'dir', description: 'Metrics collection' },
        { name: 'go.mod', type: 'file', description: 'Go dependencies' },
      ],
      keyFiles: [
        { path: 'internal/proxy/proxy.go', description: 'Request proxying and routing' },
        { path: 'internal/circuit/breaker.go', description: 'Circuit breaker implementation' },
        { path: 'internal/ratelimit/tokenbucket.go', description: 'Token bucket rate limiter' },
      ],
    },
    timeline: [
      { phase: 'Research', duration: '2 wks', desc: 'API gateway patterns, circuit breaking algorithms, rate limiting strategies.' },
      { phase: 'Design', duration: '2 wks', desc: 'Gateway architecture, API design, configuration schema.' },
      { phase: 'Core Gateway', duration: '6 wks', desc: 'Request routing, gRPC support, proxy logic.' },
      { phase: 'Resilience', duration: '4 wks', desc: 'Circuit breaker, rate limiting, retry logic.' },
      { phase: 'Observability', duration: '2 wks', desc: 'Metrics collection, tracing, logging.' },
      { phase: 'Documentation', duration: '2 wks', desc: 'API documentation, examples, guides.' },
    ],
    learnings: [
      'Circuit breaking is essential for preventing cascading failures in microservices',
      'Token bucket rate limiting provides better control than fixed window approaches',
      'gRPC protocol translation requires careful handling of streaming semantics',
      'Comprehensive metrics are crucial for operating API gateways at scale',
    ],
    documentation: [
      {
        title: 'Gateway Architecture',
        content: 'APIForge is built as a high-performance gateway in Go, designed for microservices architectures. It supports both HTTP and gRPC protocols, with automatic protocol translation. The gateway is designed to be lightweight yet feature-rich.',
      },
      {
        title: 'Circuit Breaking',
        content: 'The circuit breaker implementation follows the standard pattern with closed, open, and half-open states. It tracks failure rates and automatically trips when thresholds are exceeded. The system includes configurable timeout and retry policies for graceful degradation.',
      },
      {
        title: 'Rate Limiting',
        content: 'Rate limiting uses a token bucket algorithm for smooth and fair throttling. The system supports multiple rate limit dimensions per endpoint, including global, per-client, and per-API limits. Rate limit state is distributed for horizontal scalability.',
      },
    ],
  },
  'mobiletrack': {
    id: 'mobiletrack',
    title: 'MobileTrack',
    tagline: 'Real-time GPS tracking with offline-first sync and sub-meter accuracy.',
    year: '2023',
    role: 'Mobile Developer',
    team: '4 Engineers',
    duration: '8 months',
    tags: ['React Native', 'Firebase', 'Maps API'],
    status: 'Production',
    github: '#',
    overview:
      'A real-time GPS tracking application with offline-first architecture, sub-meter accuracy, and efficient battery usage.',
    problem:
      'Existing tracking solutions drained battery quickly, had poor accuracy, and couldn\'t function offline. Users needed reliable tracking in all conditions.',
    solution:
      'Built a React Native app with intelligent GPS sampling, Firebase for real-time sync, and offline-first architecture. Implemented adaptive location strategies based on activity and battery level.',
    screenshots: [
      { caption: 'Real-time tracking map', placeholder: 'Tracking Map' },
      { caption: 'Location history timeline', placeholder: 'History Timeline' },
      { caption: 'Battery usage stats', placeholder: 'Battery Stats' },
      { caption: 'Offline sync status', placeholder: 'Sync Status' },
    ],
    videoLinks: [
      { title: 'App Demo', url: '#', description: 'See tracking in action' },
      { title: 'Offline Features', url: '#', description: 'Offline functionality demo' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Complete app documentation' },
      { title: 'API Reference', url: '#', description: 'Backend API docs' },
      { title: 'Privacy Policy', url: '#', description: 'Privacy and data handling' },
    ],
    architecture: {
      description: 'Offline-first mobile architecture with adaptive location tracking',
      components: [
        { name: 'React Native App', role: 'Cross-platform mobile application' },
        { name: 'Location Manager', role: 'Adaptive GPS sampling and filtering' },
        { name: 'Firebase Realtime DB', role: 'Real-time location sync' },
        { name: 'Offline Storage', role: 'Local data persistence' },
        { name: 'Maps Integration', role: 'Map visualization and routing' },
        { name: 'Battery Optimizer', role: 'Power-efficient tracking strategies' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'src/components/', type: 'dir', description: 'React Native components' },
        { name: 'src/services/', type: 'dir', description: 'Location and sync services' },
        { name: 'src/utils/', type: 'dir', description: 'Utility functions' },
        { name: 'android/', type: 'dir', description: 'Android native code' },
        { name: 'ios/', type: 'dir', description: 'iOS native code' },
        { name: 'package.json', type: 'file', description: 'Dependencies' },
      ],
      keyFiles: [
        { path: 'src/services/LocationManager.ts', description: 'Adaptive location tracking' },
        { path: 'src/services/SyncManager.ts', description: 'Offline sync logic' },
        { path: 'src/components/TrackingMap.tsx', description: 'Map visualization component' },
      ],
    },
    timeline: [
      { phase: 'Research', duration: '3 wks', desc: 'Location APIs, battery optimization, offline strategies.' },
      { phase: 'Design', duration: '2 wks', desc: 'App architecture, UI/UX design, data model.' },
      { phase: 'Core Features', duration: '10 wks', desc: 'Location tracking, map integration, real-time sync.' },
      { phase: 'Offline Support', duration: '4 wks', desc: 'Offline storage, sync conflict resolution, background tasks.' },
      { phase: 'Optimization', duration: '4 wks', desc: 'Battery optimization, accuracy improvements, performance tuning.' },
      { phase: 'Testing', duration: '3 wks', desc: 'Device testing, battery drain testing, field testing.' },
    ],
    learnings: [
      'Adaptive location sampling is crucial for battery efficiency',
      'Offline-first architecture requires careful conflict resolution',
      'Background location permissions need clear user communication',
      'Map rendering optimization is essential for smooth performance',
    ],
    documentation: [
      {
        title: 'App Architecture',
        content: 'MobileTrack uses an offline-first architecture with React Native for cross-platform support. Location data is tracked using adaptive GPS sampling strategies and synced to Firebase in real-time. Local storage ensures functionality during offline periods.',
      },
      {
        title: 'Location Tracking',
        content: 'The location manager implements adaptive sampling based on user activity, battery level, and accuracy requirements. It uses Kalman filtering for smooth trajectories and implements intelligent pause detection to reduce battery drain when stationary.',
      },
      {
        title: 'Offline Sync',
        content: 'Offline functionality is achieved through local storage and sync queues. Location data is stored locally when offline and automatically synced when connectivity is restored. The system handles sync conflicts using last-write-wins with user notification.',
      },
    ],
  },
  'chatscale': {
    id: 'chatscale',
    title: 'ChatScale',
    tagline: 'Scalable chat infrastructure handling 10K concurrent users with end-to-end encryption.',
    year: '2023',
    role: 'Backend Developer',
    team: '5 Engineers',
    duration: '7 months',
    tags: ['Node.js', 'WebSocket', 'Redis'],
    status: 'Production',
    github: '#',
    overview:
      'A scalable chat infrastructure supporting 10K+ concurrent users with real-time messaging, end-to-end encryption, and horizontal scalability.',
    problem:
      'Existing chat solutions couldn\'t handle the scale requirements. Message delivery was unreliable, and encryption was an afterthought rather than built-in.',
    solution:
      'Built a scalable chat backend using Node.js with WebSocket for real-time communication. Redis enabled horizontal scaling and message queuing. End-to-end encryption was implemented using the Signal protocol.',
    screenshots: [
      { caption: 'Chat interface', placeholder: 'Chat Interface' },
      { caption: 'Real-time message delivery', placeholder: 'Message Delivery' },
      { caption: 'Encryption status', placeholder: 'Encryption Status' },
      { caption: 'Performance metrics', placeholder: 'Performance Metrics' },
    ],
    videoLinks: [
      { title: 'Chat Demo', url: '#', description: 'See real-time messaging' },
      { title: 'Security Overview', url: '#', description: 'Encryption explanation' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Complete documentation' },
      { title: 'API Reference', url: '#', description: 'WebSocket API docs' },
      { title: 'Security Audit', url: '#', description: 'Security review' },
    ],
    architecture: {
      description: 'Scalable chat architecture with end-to-end encryption',
      components: [
        { name: 'Node.js Backend', role: 'WebSocket server and message routing' },
        { name: 'Redis Cluster', role: 'Pub/sub, session management, message queuing' },
        { name: 'Encryption Layer', role: 'End-to-end encryption using Signal protocol' },
        { name: 'Message Store', role: 'Persistent message storage' },
        { name: 'Presence System', role: 'User presence and online status' },
        { name: 'Load Balancer', role: 'WebSocket connection distribution' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'src/server/', type: 'dir', description: 'WebSocket server implementation' },
        { name: 'src/encryption/', type: 'dir', description: 'Encryption logic' },
        { name: 'src/handlers/', type: 'dir', description: 'Message handlers' },
        { name: 'src/storage/', type: 'dir', description: 'Database operations' },
        { name: 'tests/', type: 'dir', description: 'Unit and integration tests' },
        { name: 'package.json', type: 'file', description: 'Dependencies' },
      ],
      keyFiles: [
        { path: 'src/server/websocket.ts', description: 'WebSocket server implementation' },
        { path: 'src/encryption/signal.ts', description: 'Signal protocol implementation' },
        { path: 'src/handlers/message.ts', description: 'Message handling logic' },
      ],
    },
    timeline: [
      { phase: 'Research', duration: '2 wks', desc: 'WebSocket protocols, encryption libraries, scalability patterns.' },
      { phase: 'Design', duration: '3 wks', desc: 'System architecture, security design, data model.' },
      { phase: 'Core Backend', duration: '8 wks', desc: 'WebSocket server, message routing, Redis integration.' },
      { phase: 'Encryption', duration: '4 wks', desc: 'End-to-end encryption, key management, secure storage.' },
      { phase: 'Frontend', duration: '6 wks', desc: 'Chat interface, real-time updates, encryption UI.' },
      { phase: 'Testing', duration: '3 wks', desc: 'Load testing, security testing, user testing.' },
    ],
    learnings: [
      'Redis pub/sub is essential for scalable WebSocket architectures',
      'End-to-end encryption should be designed from the start, not added later',
      'Message ordering guarantees require careful design in distributed systems',
      'Presence systems need to handle network partitions gracefully',
    ],
    documentation: [
      {
        title: 'Chat Architecture',
        content: 'ChatScale uses a distributed architecture with Node.js WebSocket servers behind a load balancer. Redis enables pub/sub messaging for real-time communication across servers. The system is designed for horizontal scalability and can handle 10K+ concurrent connections.',
      },
      {
        title: 'Encryption',
        content: 'End-to-end encryption is implemented using the Signal protocol. Each conversation has unique encryption keys that are established between participants. Messages are encrypted on the sender\'s device and can only be decrypted by the intended recipients.',
      },
      {
        title: 'Scalability',
        content: 'The system scales horizontally through WebSocket connection distribution and Redis-backed message queuing. Connection state is stored in Redis for seamless failover. Message delivery guarantees are implemented through acknowledgments and retry logic.',
      },
    ],
  },
  'devmetrics': {
    id: 'devmetrics',
    title: 'DevMetrics',
    tagline: 'Developer productivity analytics surfacing DORA metrics and team velocity trends.',
    year: '2024',
    role: 'Full Stack Developer',
    team: '3 Engineers',
    duration: '5 months',
    tags: ['TypeScript', 'PostgreSQL', 'DORA'],
    status: 'Open Source',
    github: '#',
    overview:
      'A developer productivity analytics platform that surfaces DORA metrics, team velocity trends, and engineering efficiency insights.',
    problem:
      'Teams had no visibility into their engineering efficiency. DORA metrics were calculated manually, and there was no data-driven approach to process improvement.',
    solution:
      'Built an analytics platform that automatically calculates DORA metrics from Git and CI/CD data. Provides dashboards, trends, and actionable insights for engineering teams.',
    screenshots: [
      { caption: 'DORA metrics dashboard', placeholder: 'DORA Dashboard' },
      { caption: 'Team velocity trends', placeholder: 'Velocity Trends' },
      { caption: 'Deployment frequency analysis', placeholder: 'Deployment Analysis' },
      { caption: 'Change failure rate', placeholder: 'Failure Rate' },
    ],
    videoLinks: [
      { title: 'Platform Demo', url: '#', description: 'See analytics in action' },
      { title: 'DORA Metrics Guide', url: '#', description: 'DORA metrics explanation' },
    ],
    extraLinks: [
      { title: 'Documentation', url: '#', description: 'Complete documentation' },
      { title: 'Integration Guide', url: '#', description: 'Git and CI/CD integration' },
      { title: 'Best Practices', url: '#', description: 'Engineering efficiency guide' },
    ],
    architecture: {
      description: 'Analytics platform with automated DORA metrics calculation',
      components: [
        { name: 'Data Collector', role: 'Git and CI/CD data ingestion' },
        { name: 'Metrics Engine', role: 'DORA metrics calculation' },
        { name: 'PostgreSQL', role: 'Metrics storage and analysis' },
        { name: 'Dashboard', role: 'Visualization and insights' },
        { name: 'Alert System', role: 'Metric threshold alerts' },
        { name: 'Integration Layer', role: 'Git and CI/CD platform connectors' },
      ],
    },
    codeEvidence: {
      repoStructure: [
        { name: 'src/collectors/', type: 'dir', description: 'Data collectors for various platforms' },
        { name: 'src/metrics/', type: 'dir', description: 'DORA metrics calculation' },
        { name: 'src/dashboard/', type: 'dir', description: 'Dashboard components' },
        { name: 'src/integrations/', type: 'dir', description: 'Third-party integrations' },
        { name: 'migrations/', type: 'dir', description: 'Database migrations' },
        { name: 'package.json', type: 'file', description: 'Dependencies' },
      ],
      keyFiles: [
        { path: 'src/metrics/dora.ts', description: 'DORA metrics calculation logic' },
        { path: 'src/collectors/git.ts', description: 'Git data collector' },
        { path: 'src/dashboard/Dashboard.tsx', description: 'Main dashboard component' },
      ],
    },
    timeline: [
      { phase: 'Research', duration: '2 wks', desc: 'DORA metrics research, data sources analysis, requirements gathering.' },
      { phase: 'Design', duration: '2 wks', desc: 'System architecture, data model, dashboard design.' },
      { phase: 'Data Collection', duration: '6 wks', desc: 'Git and CI/CD integrations, data ingestion pipeline.' },
      { phase: 'Metrics Engine', duration: '4 wks', desc: 'DORA metrics calculation, trend analysis, aggregation.' },
      { phase: 'Dashboard', duration: '4 wks', desc: 'Visualization components, insights generation, alerts.' },
      { phase: 'Testing', duration: '2 wks', desc: 'Data validation, accuracy testing, user acceptance.' },
    ],
    learnings: [
      'Automated DORA metrics calculation requires careful data normalization',
      'Data quality from Git and CI/CD platforms varies significantly',
      'Trend analysis is more valuable than point-in-time metrics',
      'Actionable insights require context beyond raw metrics',
    ],
    documentation: [
      {
        title: 'Metrics Architecture',
        content: 'DevMetrics automatically collects data from Git repositories and CI/CD platforms. The metrics engine processes this data to calculate DORA metrics: deployment frequency, lead time for changes, time to restore service, and change failure rate. Results are stored in PostgreSQL for analysis and visualization.',
      },
      {
        title: 'DORA Metrics',
        content: 'The platform calculates all four DORA metrics automatically. Deployment frequency measures how often code is deployed. Lead time for changes tracks the time from commit to deployment. Time to restore service measures incident resolution time. Change failure rate tracks the percentage of deployments that cause failures.',
      },
      {
        title: 'Integrations',
        content: 'DevMetrics integrates with popular Git platforms (GitHub, GitLab, Bitbucket) and CI/CD systems (Jenkins, CircleCI, GitHub Actions). The integration layer normalizes data from different sources to ensure consistent metrics calculation across platforms.',
      },
    ],
  },
};