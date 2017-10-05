# Vue Dashboard

A simple Vue Dashboard running on Express (socket.io) with pluggable panels.

*Please note that this is an alpha*

## Requirements

Node 6+

## Installation

```
npm install
npm run panels
npm run build production
npm serve production
```

## Configuration

See `panels.example.json` for an example.

To install a panel, put it in `src/panels` and run `npm install && npm run panels`, then rebuild.

## Development

Uses *livereload* and *nodemon* in development mode, so you don't have to manually restart or refresh anything.

```
npm run build
npm run watch
npm serve
```

### Testing

```
npm run test
npm run eslint
npm run csslint
```

## License

MIT
