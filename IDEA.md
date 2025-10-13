🌀 Concord
The simplest way to manage and version your Docker containers.
🧭 Overview

Concord is a web-based container manager that redefines simplicity.
Each service can have one running version — while older versions stay stopped, ready, and instantly switchable.

Instead of complex orchestration layers or YAML-heavy systems, Concord gives you a clean web interface to:

View all services and their versions

Start, stop, and switch between versions

Keep older containers as ready backups

Roll back instantly — with a single click

No CLI commands. No Kubernetes. No confusion.
Just a clear, visual way to control your containers.

⚙️ How It Works

Every image tag represents a versioned container of a service.

When you switch versions through Concord:

The current container for that service stops automatically.

The chosen version starts immediately.

All older containers remain stopped but available, ready for rollback.

Concord automatically ensures only one instance per service is ever running.
This design keeps your system clean, predictable, and rollback-ready at all times.

🌿 The Philosophy

Concord is built on the belief that:

Container management should be as intuitive as clicking a button.

Modern orchestration tools often bury simplicity under layers of abstraction — configuration files, clusters, and pipelines.
Concord strips that all away and restores what matters most: clarity and control.

Its guiding principles:

Simplicity over complexity — Manage containers without orchestration overhead.

Predictability — Know exactly what’s running, and why.

Reversibility — Every change can be undone instantly.

Harmony — Containers, versions, and services stay in sync.

💻 Features

🌐 Web Interface — Clean and responsive dashboard for full control.

🧱 Version Management — Each image tag is a version you can switch between.

🔁 Instant Rollback — Older versions stay ready for immediate reactivation.

🛑 Single Active Instance — One running container per service. Always.

⚡ Zero Setup Overhead — Runs as a lightweight web application, no cluster or daemon needed.

🗂️ Simple Overview — View all services, their running version, and stopped versions at a glance.

🧩 Ideal Use Cases

Concord is perfect for:

Developers managing multiple service versions locally

Small teams deploying self-hosted services

Organizations that value fast rollback and manual control

CI/CD environments that prefer transparency over automation

🌈 The Concord Way

“Every service runs in harmony — one active, others ready.”

That’s the heart of Concord.
No orchestration fatigue. No invisible background processes.
Just a clear, human-scale approach to versioned container management.

🚀 Future Vision

Concord’s roadmap focuses on keeping things simple while expanding its capabilities:

Built-in health checks for version switching

Persistent configuration (services.json or database-backed)

Access control and authentication

Optional container cleanup policies

API for automation and integration

Every feature must pass the Concord Principle Test:

Does it make container management simpler, not harder?