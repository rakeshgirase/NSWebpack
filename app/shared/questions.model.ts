export interface IQuestion {
    number?: string;
    description: string;
    explanation?: string;
    options: Array<IOption>;
    skipped?: boolean;
    flagged?: boolean;
    show?: boolean;
    suggestionHint?: string;
}

export interface IOption {
    tag: string;
    description: string;
    correct: boolean;
    selected?: boolean;
    show?: boolean;
}

export interface ISetting {
    totalQuestionsQuick: number;
    totalQuestionsMock: number;
    totalTime: number;
}

export interface IState {
    questionWrapper?: IQuestion;
    questions: Array<IQuestion>;
    questionNumber: number;
    totalQuestions: number;
    mode?: string;
    time?: number;
}

export interface IMap {
    value: number;
    status: string;
}

export interface IResult {
    itemType?: string;
    date?: string;
    correct: number;
    wrong?: number;
    totalExams?: number;
    skipped?: number;
    total: number;
    percentage: string;
    pass?: boolean;
}

export interface IPracticeStats {
    attempted: Array<number>;
    correct: Array<number>;
}
