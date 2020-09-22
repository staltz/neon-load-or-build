# neon-load-or-build

> Build tool and bindings loader for [Neon Bindings](neon-bindings.com/) that supports prebuilds.

```
npm install neon-load-or-build
```

Heavily inspired on and based on [node-gyp-build](https://github.com/prebuild/node-gyp-build).

## Usage

`neon-load-or-build` as a the CLI works similar to `neon build` except that it will check if a build or prebuild is present before rebuilding your project.

It's main intended use is as an npm install script and bindings loader for native modules that bundle prebuilds (inspired by [`prebuildify`](https://github.com/prebuild/prebuildify)).

First add `neon-load-or-build` as an install script to your native neon-bindings project

```js
{
  ...
  "scripts": {
    "install": "neon-load-or-build"
  }
}
```

Then in your neon module's `lib/index.js`, instead of using the default `require('../native)`, use `node-load-or-build` to load your binding.

``` js
module.exports = require('neon-load-or-build')(__dirname + '/..')
```

If you do these two things and bundle prebuilds, your Neon module will work for most platforms without having to compile on install time AND will work in both node and electron without the need to recompile between usage.

Users can override `neon-load-or-build` and force compiling by doing `npm install --build-from-source`.

Prebuilds will be attempted loaded from `MODULE_PATH/prebuilds/...` and then next `EXEC_PATH/prebuilds/...`.

## Supported prebuild names

If so desired you can bundle more specific flavors, for example `musl` builds to support Alpine, or targeting a numbered ARM architecture version.

These prebuilds can be bundled in addition to generic prebuilds; `neon-load-or-build` will try to find the most specific flavor first. Prebuild filenames are composed of _tags_. The runtime tag takes precedence, as does an `abi` tag over `napi`. For more details on tags, please see [`prebuildify`][prebuildify].

Values for the `libc` and `armv` tags are auto-detected but can be overridden through the `LIBC` and `ARM_VERSION` environment variables, respectively.

## License

MIT
