# Chartsy

![chartsy in action](chartsy.png)

Chartsy is a modern web app for building music charts. It's built with Go, HTMX, \_hyperscript, and TailwindCSS, among others.

## Build

You'll need:

- Go >= v1.20
- npm >= v9
- sqlite >= v3

```console
# Frontend only stuff
npm install
npm run build

# Create and seed db
sqlite3 chartsy.db < ./internal/models/testdata/setup.sql
sqlite3 chartsy.db < ./internal/models/testdata/mockup.sql
sqlite3 chartsy.db < ./internal/models/testdata/newchart.sql

# Server
go build -o ./cmd/web # this needs CGO enabled
```

Finally, you just run it with

```console
env LASTFM_KEY=<your key goes here> ./web -env prod -addr ":4000" # this last flag is optional
```

## Developing

If you're willing to contribute or just want to hack around, the setup process is
the same, but you can just run it like

```console
env LASTFM_KEY=<your key goes here> ./web
```

This will open a server with live reloading enabled on the templates. If you also wish
to have the same on the `.go` files, you can use [air](https://github.com/cosmtrek/air)
like

```console
env LASTFM_KEY=<your key goes here> air
```
