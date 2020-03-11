# Deployment Experimentation

I wanted to learn more about advanced deployment methods, in particular, automated canary analysis.

But for it to be remotely effective, I need to introduce some random errors to simulate bugs in code, or some random latency to simulate a modification to code to increase latency, to have something that might be worth rejecting.

The main idea is have a very simple REST API.
Should have
- a health endpoint that returns 200
- a homepage that returns a coloured screen with the hostname, so we can see some change in request servers
- an endpoint that returns a random latent wait
- an endpoint that returns a 200 response only a certain percentage of the time.

This randomness will be done based on environment variables.

Then the testing phase will just have requests sent 