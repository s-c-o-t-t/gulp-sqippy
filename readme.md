# gulp-sqippy

_Note: for now, this is me testing out NPM packages... so I'd skip until v1.0.0_

Gulpified [sqip](https://www.npmjs.com/package/sqip) which allows full customization of sqip's available options, plus a few more. Creates a new SVG file in the stream, named same as the source (with ".svg" extension, of course).

## The options are:

-   **primitives** - number of primitives (default 20)
-   **blur** - blur factor (default 10)
-   **mode** - mode code (default 5)
-   **prependName** - prepend to new file's name
-   **appendName** - append to new file's name

### Mode specifies the base shape for primitives. The mode codes are:

-   0 - combo
-   1 - triangle
-   2 - rectangle
-   3 - ellipse
-   4 - circle
-   5 - rotated rectangle
-   6 - beziers
-   7 - rotated ellipse
-   8 - polygon

## Example:

```
const sqippy = require("gulp-sqippy");

gulp.task("make-bg-placeholders", function() {
    return gulp
        .src("backgrounds/*.+(png|jpg|jpeg|gif)")
        .pipe(
            sqippy({
                primitives: 12,
                blur: 6,
                prependName: "placeholder-",
            })
        )
        .pipe(gulp.dest("backgrounds"));
});
```
