import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

console.log(`Average project percentage: ${formatProjectCoverage()}`);

// # functions #

function formatProjectCoverage(): string {
    const report = getCoverageReport();
    const percentage = calcProjectCoverageFrom(report);

    const MIN_TEST_COVERAGE = 95;
    if (percentage < MIN_TEST_COVERAGE) {
        throw new Error('Test coverage is under 100%');
    }

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
            .map((file) => extractCoverageDataFrom(file, report))
            .map((coverage) => mapToDetailed(coverage))
            .map((coverage) => calcAveragePercentageOf(coverage))
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
