import chalk from "chalk";

const FRAME_ATTRIBUTES = [
  "abs_path",
  "filename",
  "function",
  "lineno",
  "colno",
  "pre_context",
  "context_line",
  "post_context",
];

const ADDITIONAL_FRAMES_ATTRIBUTE = ["module", "in_app"];

export function diff(event) {
  let eventValid = true;

  for (const [exceptionIndex, exception] of event.exception.values.entries()) {
    console.log(`\nException ${exceptionIndex}`);
    let exceptionValid = true;

    for (const [frameIndex, frame] of exception.stacktrace.frames.entries()) {
      if (!frame.data?.smcache_frame) {
        console.log(chalk.yellow("  ⚠ Frame not processed by SourceMapCache (data.smcache_frame missing)"));
        continue;
      }

      const oldFrame = frame;
      const newFrame = frame.data.smcache_frame;

      const invalidAttrs = [];

      for (const attr of [...FRAME_ATTRIBUTES, ...ADDITIONAL_FRAMES_ATTRIBUTE]) {
        const oldValue = Array.isArray(oldFrame[attr]) ? oldFrame[attr].join("\n") : oldFrame[attr];
        const newValue = Array.isArray(newFrame[attr]) ? newFrame[attr].join("\n") : newFrame[attr];

        if (oldValue !== newValue) {
          invalidAttrs.push(attr);
          exceptionValid = false;
          eventValid = false;
        }
      }

      if (invalidAttrs.length === 0) {
        console.log(chalk.green(`  ✔ Frame ${frameIndex}`));
        continue;
      }

      console.log(chalk.red(`  ✖ Frame ${frameIndex}`));

      for (const attr of invalidAttrs) {
        const oldValue = Array.isArray(oldFrame[attr]) ? oldFrame[attr].join("\n") : oldFrame[attr];
        const newValue = Array.isArray(newFrame[attr]) ? newFrame[attr].join("\n") : newFrame[attr];
        console.log(chalk.red(`    ✖ ${attr}`));
        console.log(chalk.red(`      old: ${oldValue}`));
        console.log(chalk.red(`      new: ${newValue}`));
      }
    }

    if (exceptionValid) {
      console.log(chalk.green(`✔ Exception ${exceptionIndex}`));
    } else {
      console.log(chalk.red(`✖ Exception ${exceptionIndex}`));
    }
  }

  if (eventValid) {
    console.log(chalk.green(`\n✔ Event ${event.event_id}\n`));
  } else {
    console.log(chalk.red(`\n✖ Event ${event.event_id}\n`));
  }
}
