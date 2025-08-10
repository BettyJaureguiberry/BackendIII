import chalk from 'chalk';

export const logger = {
  info: (msg) => console.log(chalk.blue(`[INFO ${new Date().toISOString()}] ${msg}`)),
  success: (msg) => console.log(chalk.green(`[SUCCESS ${new Date().toISOString()}] ${msg}`)),
  warn: (msg) => console.warn(chalk.yellow(`[WARN ${new Date().toISOString()}] ${msg}`)),
  error: (msg) => console.error(chalk.red(`[ERROR ${new Date().toISOString()}] ${msg}`))
};
