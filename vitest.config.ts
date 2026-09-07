import { defineConfig } from 'vitest/config';
import path from 'node:path';
export default defineConfig({test:{environment:'jsdom',pool:'threads',maxWorkers:1,minWorkers:1},resolve:{alias:{'@':path.resolve(__dirname)}}});
