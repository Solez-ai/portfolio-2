# Revision Research Notes

## Falschen

Source: https://falschen-z.vercel.app/

The official site identifies **Team Fälschen** as a two-person research team focused on robotics, physics, and AI. It describes the team as building systems that connect the physical world, human signals, and intelligent machines. The public team listing identifies **Samin Yeasar** as **Co-Founder** and notes that he co-founded MentorMind. The visible mark is a monochrome, technical emblem with the `F`-like symbol and the Fälschen wordmark.

## GitHub Activity

Source: https://api.github.com/users/Solez-ai/events/public?per_page=100

The public events endpoint returned recent activity for the `Solez-ai` account, with recorded event timestamps in August 2026. The client-side portfolio can use this open endpoint to render a small current activity rail; it does not provide the authenticated annual contribution graph. To maintain a meaningful visual history, the site will aggregate the public events available from the endpoint by day and represent the last available activity period as a Bauhaus matrix. A clear label will distinguish this as public activity rather than claiming a full private contribution graph.

## Full-Year Contributions Endpoint

Source: https://github-contributions-api.jogruber.de/v4/Solez-ai?y=last

The supplied endpoint returned a `total.lastYear` value of `741` and a dated `contributions` array with `date`, `count`, and `level` fields for `Solez-ai`. The portfolio will use this source for a full 52-week contribution matrix, replacing the earlier short public-event window while keeping an explicit attribution to the endpoint and a failure state if the public service is unavailable.
