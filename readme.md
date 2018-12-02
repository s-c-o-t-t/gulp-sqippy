# gulp-sqippy

Gulpified [sqip](https://www.npmjs.com/package/sqip) that allows full customization of sqip's existing options, and adds a few more. It creates a new SVG file in the stream, named the same as the source (with ".svg" extension, of course).

`sqip` seems to be a work in progress, but it's a cool package that creates SVG impressions of pixel images. Find the right balance between the mode, blur and primitives count, and you get a nice, small LQIP (low quality image placeholder). The default options below make a good placeholder image, but you could make it even smaller by reducing the primitives.

## The (optional) options are:

-   **primitives** - number of primitives a.k.a. the shapes that make up the image (integer, default is 20)
-   **blur** - blur factor (numeric, default is 10)
-   **mode** - mode code (defined below, default is 5)
-   **prependName** - text to prepend to the front of the new SVG filename (string)
-   **appendName** - text to append to the end of the new SVG filename (string)
-   **includeSource** - also pass the source image file through in the stream (boolean, default is false)

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
