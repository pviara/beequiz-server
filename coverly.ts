import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

logProjectCoverage();

// # functions #

function logProjectCoverage(): string {
    const report = getCoverageReport();
    const percentage = calcProjectCoverageFrom(report);
    const fixedPercentage = percentage.toFixed(2);

    const MIN_TEST_COVERAGE = 95;
    if (percentage < MIN_TEST_COVERAGE) {
        const message = `Total project coverage percentage of ${fixedPercentage}% is less than minimum of ${MIN_TEST_COVERAGE}%`;
        error('Result', message);
        throw new Error(message);
    }

    log('Result', `Satisfying total project coverage of ${fixedPercentage}%`);
    return `${percentage.toFixed(2)}%`;
}

function getCoverageReport(): CoverageReport {
    const coverageDirectoryPath = path.join(__dirname, '../coverage');
    const coverageFilePath = `${coverageDirectoryPath}/coverage-final.json`;

    if (existsSync(coverageFilePath)) {
        const coverageFile = readFileSync(coverageFilePath, 'utf8');
        return JSON.parse(coverageFile);
    }

    throw new Error(
        `No coverage file could be found at path "${coverageFilePath}"`,
    );
}

function calcProjectCoverageFrom(report: CoverageReport): number {
    const files = Object.keys(report);
    return (
        files
            .map((file) => {
                log('Extracting coverage data from', file);
                return {
                    file,
                    coverage: extractCoverageDataFrom(file, report),
                };
            })
            .map(({ file, coverage }) => {
                log('Completing coverage data from', file);
                return {
                    file,
                    coverage: mapToDetailed(coverage),
                };
            })
            .map(({ file, coverage }) => {
                log('Calculating coverage percetage from', file);
                return calcAveragePercentageOf(coverage);
            })
            .reduce((sum, current) => sum + current, 0) / files.length
    );
}

function extractCoverageDataFrom(
    file: string,
    report: CoverageReport,
): ExtractedCoverageData {
    const coverage = report[file];
    return {
        statements: Object.values(coverage.s),
        branches: Object.values(coverage.b),
        functions: Object.values(coverage.f),
    };
}

function mapToDetailed(coverage: ExtractedCoverageData): DetailedCoverageData {
    const { statements, branches, functions } = coverage;

    const totalStatements = statements.length;
    const coveredStatements = statements.filter((s) => s > 0).length;

    const totalBranches = branches.length;
    const coveredBranches = branches.filter((b) => b > 0).length;

    const totalFunctions = functions.length;
    const coveredFunctions = functions.filter((f) => f > 0).length;

    return {
        statements: {
            total: totalStatements,
            coveragePercentage: calcPercentage(
                coveredStatements,
                totalStatements,
            ),
        },
        branches: {
            total: branches.length,
            coveragePercentage: calcPercentage(coveredBranches, totalBranches),
        },
        functions: {
            total: functions.length,
            coveragePercentage: calcPercentage(
                coveredFunctions,
                totalFunctions,
            ),
        },
    };
}

function calcPercentage(covered: number, total: number): number {
    return (covered / total || 1) * 100;
}

function calcAveragePercentageOf({
    statements,
    branches,
    functions,
}: DetailedCoverageData): number {
    return (
        (statements.coveragePercentage +
            branches.coveragePercentage +
            functions.coveragePercentage) /
        3
    );
}

function log(context: string, message: string): void {
    console.log(
        `> ${context ? `${context} ` : ''}\u001b[36m${message}\u001b[0m`,
    );
}

function error(context: string, message: string): void {
    console.log(
        `> ${context ? `${context} ` : ''}\u001b[31m${message}\u001b[0m`,
    );
}

// # types #

type CoverageReport = Record<FilePath, CoverageData>;

type FilePath = string;

type CoverageData = {
    statementMap: unknown;
    fnMap: unknown;
    branchMap: unknown;
    s: Record<string, number>;
    f: Record<string, number>;
    b: Record<string, number>;
};

type ExtractedCoverageData = {
    statements: number[];
    branches: number[];
    functions: number[];
};

type DetailedCoverageData = {
    statements: {
        total: number;
        coveragePercentage: number;
    };
    branches: {
        total: number;
        coveragePercentage: number;
    };
    functions: {
        total: number;
        coveragePercentage: number;
    };
};
