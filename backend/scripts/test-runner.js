#!/usr/bin/env node

/**
 * Test Runner Script
 * UF3/UF4 Curriculum Project
 * Comprehensive test execution and reporting
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Print colored console output
 */
function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printHeader(title) {
  const border = '='.repeat(60);
  colorLog(`\n${border}`, 'cyan');
  colorLog(`🧪 ${title}`, 'cyan');
  colorLog(`${border}`, 'cyan');
}

/**
 * Run command and return promise
 */
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Check if test files exist
 */
function checkTestFiles() {
  const testDirs = [
    'src/utils/__tests__',
    'src/middlewares/__tests__',
    'src/controllers/__tests__',
    'src/routes/__tests__'
  ];

  const missingDirs = [];
  const testFiles = [];

  testDirs.forEach(dir => {
    const fullPath = join(projectRoot, dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.test.js') || file.endsWith('.integration.test.js'));
      testFiles.push(...files.map(file => `${dir}/${file}`));
    } else {
      missingDirs.push(dir);
    }
  });

  return { testFiles, missingDirs };
}

/**
 * Run linting
 */
async function runLinting() {
  printHeader('Code Linting');
  
  try {
    colorLog('Running ESLint...', 'yellow');
    await runCommand('npm', ['run', 'lint']);
    colorLog('✅ Linting passed!', 'green');
    return true;
  } catch (error) {
    colorLog('❌ Linting failed!', 'red');
    colorLog('Run "npm run lint:fix" to auto-fix issues', 'yellow');
    return false;
  }
}

/**
 * Run unit tests
 */
async function runUnitTests() {
  printHeader('Unit Tests');
  
  try {
    colorLog('Running unit tests...', 'yellow');
    await runCommand('npm', ['run', 'test:unit']);
    colorLog('✅ Unit tests passed!', 'green');
    return true;
  } catch (error) {
    colorLog('❌ Unit tests failed!', 'red');
    return false;
  }
}

/**
 * Run integration tests
 */
async function runIntegrationTests() {
  printHeader('Integration Tests');
  
  try {
    colorLog('Running integration tests...', 'yellow');
    await runCommand('npm', ['run', 'test:integration']);
    colorLog('✅ Integration tests passed!', 'green');
    return true;
  } catch (error) {
    colorLog('❌ Integration tests failed!', 'red');
    return false;
  }
}

/**
 * Run all tests with coverage
 */
async function runTestsWithCoverage() {
  printHeader('Test Coverage Report');
  
  try {
    colorLog('Running all tests with coverage...', 'yellow');
    await runCommand('npm', ['run', 'test:coverage']);
    colorLog('✅ Coverage report generated!', 'green');
    colorLog('📊 Open coverage/lcov-report/index.html to view detailed report', 'blue');
    return true;
  } catch (error) {
    colorLog('❌ Coverage generation failed!', 'red');
    return false;
  }
}

/**
 * Display test summary
 */
function displayTestSummary() {
  const { testFiles, missingDirs } = checkTestFiles();
  
  printHeader('Test Suite Summary');
  
  colorLog(`📁 Test Files Found: ${testFiles.length}`, 'blue');
  testFiles.forEach(file => {
    colorLog(`   • ${file}`, 'cyan');
  });

  if (missingDirs.length > 0) {
    colorLog(`\n⚠️  Missing Test Directories: ${missingDirs.length}`, 'yellow');
    missingDirs.forEach(dir => {
      colorLog(`   • ${dir}`, 'yellow');
    });
  }

  // Check for Jest config
  const jestConfigPath = join(projectRoot, 'jest.config.js');
  if (fs.existsSync(jestConfigPath)) {
    colorLog('\n✅ Jest configuration found', 'green');
  } else {
    colorLog('\n❌ Jest configuration missing', 'red');
  }

  // Check for test setup
  const testSetupPath = join(projectRoot, 'src/test/setup.js');
  if (fs.existsSync(testSetupPath)) {
    colorLog('✅ Test setup file found', 'green');
  } else {
    colorLog('❌ Test setup file missing', 'red');
  }
}

/**
 * Main test runner function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  colorLog('🚀 Fitness Tracker Backend - Test Runner', 'bright');
  colorLog('UF3/UF4 Curriculum Project\n', 'magenta');

  try {
    switch (command) {
      case 'summary':
        displayTestSummary();
        break;

      case 'lint':
        await runLinting();
        break;

      case 'unit':
        await runUnitTests();
        break;

      case 'integration':
        await runIntegrationTests();
        break;

      case 'coverage':
        await runTestsWithCoverage();
        break;

      case 'all':
      default:
        displayTestSummary();
        
        const lintPassed = await runLinting();
        if (!lintPassed) {
          process.exit(1);
        }

        const unitPassed = await runUnitTests();
        const integrationPassed = await runIntegrationTests();
        
        if (unitPassed && integrationPassed) {
          await runTestsWithCoverage();
          
          printHeader('🎉 All Tests Completed Successfully!');
          colorLog('✅ Linting: PASSED', 'green');
          colorLog('✅ Unit Tests: PASSED', 'green');
          colorLog('✅ Integration Tests: PASSED', 'green');
          colorLog('✅ Coverage Report: GENERATED', 'green');
          
          colorLog('\n📊 Next Steps:', 'blue');
          colorLog('• Review coverage report: coverage/lcov-report/index.html', 'cyan');
          colorLog('• Check for any TODO items in test files', 'cyan');
          colorLog('• Consider adding more edge case tests', 'cyan');
          
        } else {
          printHeader('❌ Test Suite Failed');
          colorLog(`✅ Linting: ${lintPassed ? 'PASSED' : 'FAILED'}`, lintPassed ? 'green' : 'red');
          colorLog(`${unitPassed ? '✅' : '❌'} Unit Tests: ${unitPassed ? 'PASSED' : 'FAILED'}`, unitPassed ? 'green' : 'red');
          colorLog(`${integrationPassed ? '✅' : '❌'} Integration Tests: ${integrationPassed ? 'PASSED' : 'FAILED'}`, integrationPassed ? 'green' : 'red');
          process.exit(1);
        }
        break;

      case 'help':
        printHeader('Test Runner Commands');
        colorLog('npm run test-runner [command]', 'yellow');
        colorLog('');
        colorLog('Commands:', 'blue');
        colorLog('  all         Run all tests (default)', 'cyan');
        colorLog('  summary     Show test suite summary', 'cyan');
        colorLog('  lint        Run code linting only', 'cyan');
        colorLog('  unit        Run unit tests only', 'cyan');
        colorLog('  integration Run integration tests only', 'cyan');
        colorLog('  coverage    Run tests with coverage', 'cyan');
        colorLog('  help        Show this help message', 'cyan');
        break;

      default:
        colorLog(`❌ Unknown command: ${command}`, 'red');
        colorLog('Run "npm run test-runner help" for available commands', 'yellow');
        process.exit(1);
    }

  } catch (error) {
    colorLog(`\n❌ Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the test runner
main().catch(error => {
  colorLog(`\n💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
