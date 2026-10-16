# The Codea original

These are the historical Lua components from GritUI 1.2.2, created in 2018. Comments and demo copy have been made English; behavior is retained for reference, including historical bugs. The untouched sources are available in the repository's 2018 commits.

The old filename `gSlide.lua` defines the `gSlider` class. `wiki.md` documents the old API. This code requires the Codea runtime and is not part of the React build.

| Codea | React |
| --- | --- |
| `gSmoothButton` | `SmoothButton` |
| `gCircleSwitch` | `CircleSwitch` |
| `gSlider` | `Slider` |
| `addNewTopAlert` / `gTopAlert` | `TopAlert` |
| `addNewPopAlert` / `gPopAlert` / `pop()` | `PopAlert` with controlled `open` state |

Codea draws components every frame and forwards touch events manually. React handles rendering and input through the DOM; CSS reproduces the original tween sequences. Do not run the legacy demo's update downloader as an installation method for the React package.
