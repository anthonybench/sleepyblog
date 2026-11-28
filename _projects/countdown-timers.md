---
name: countdown-timers
tagline: A self-hostable wall of countdown timers, driven by one YAML file.
status: active
year: 2026
order: 4
featured: false
tech: [typescript, react, docker, nginx]
install: docker run -p 7070:80 sleepyboy/countdown-timers
links:
    - display_text: GitHub
      url: https://github.com/anthonybench/countdown-timers
    - display_text: Docker Hub
      url: https://hub.docker.com/r/sleepyboy/countdown-timers
    - display_text: sleepy-countdown (npm)
      url: https://www.npmjs.com/package/sleepy-countdown
media:
    [
        "https://raw.githubusercontent.com/anthonybench/countdown-timers/main/docs/assets/grid-dark.png",
        "https://raw.githubusercontent.com/anthonybench/countdown-timers/main/docs/assets/grid-light.png",
    ]
---

## Motivation

The next deploy, a lease renewal, a birthday, a vacation: some dates deserve to be on a
wall. `countdown-timers` is a tiny static web app for a home server that shows them as a
grid of countdown cards, all described in a single `countdown_timers.yml`.

The container reads that file when the page loads, so you edit it on the host and
refresh. No rebuild, no restart, no database, no admin page.

## Highlights

- **One file to configure**: a title and a list of timers, each with a target date
  and an optional style, resolution, and end message
- **Bad config fails loudly**: the page tells you exactly which timer is wrong instead
  of showing an empty grid
- **Tiny and offline**: a ~22 MB nginx image with its font built in. No CDN calls, no
  telemetry, and it runs fine on an air-gapped network.
- **Light and dark themes**, with your choice remembered
- **Runs on x86 and ARM**, so a Raspberry Pi works too

The timer cards are [`sleepy-countdown`](https://www.npmjs.com/package/sleepy-countdown),
a React component I published separately, so you can drop the same timers into your own
app.

## Quick start

```sh
# grab the sample config, then run it
curl -O https://raw.githubusercontent.com/anthonybench/countdown-timers/main/countdown_timers.yml

docker run -d --name countdown-timers -p 7070:80 \
  -v "$(pwd)/countdown_timers.yml:/usr/share/nginx/html/countdown_timers.yml:ro" \
  --restart unless-stopped \
  sleepyboy/countdown-timers:latest
```

Open <http://localhost:7070>, edit `countdown_timers.yml`, and refresh.

```yaml
title: Countdown Timers
timers:
    - title: New Year 2027
      target: "2027-01-01T00:00:00"
      type: modern # modern | classic | minimal
      resolution: second # day | hour | minute | second
      end_message: Happy New Year!
```
