import fs from 'fs';
import path from 'path';

export interface AppConfig {
    baseUrl: string;
    environmentId: string;
    csvSeparator: string;
    optionsSeparator: string;
    csvPath: string;
}

export class Survey {
    public environmentId: string = '';
    public welcomeCard?: WelcomeCard;
    public name: string;
    public status: SurveyStatus = SurveyStatus.DRAFT;
    public questions: Question[];
    public type: SurveyType = SurveyType.LINK;
}

export class Question {
    public id: string;
    public headline: DefaultText = new DefaultText();
    public placeholder?: DefaultText = new DefaultText();
    public inputType: InputType = InputType.TEXT;
    public rating?: RatingRange;
    public shuffleOption: ShuffleOptions = ShuffleOptions.NONE;
    public required: boolean = true;
    public type : QuestionType = QuestionType.OPEN_TEXT;
    public choices?: Choice[];
    public rows?: Choice[];
    public columns?: Choice[];
}

export class Choice {
    public id: string = 'default_id';
    public label: DefaultText = new DefaultText();
}

export class DefaultText { 
    public default: string = '';
}

export class WelcomeCard {
    enabled: boolean= true;
    fileUrl?: string;
    headline: DefaultText = new DefaultText();
    html: DefaultText = new DefaultText();
    showResponseCount: boolean = false;
    timeToFinish: boolean = false;
}

export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    URL = 'url',
    NUMBER = 'number',
    PHONE = 'phone'
}

export class Rating {
    public ratingRange: RatingRange = RatingRange.FIVE;
    public ratingScale: RatingScale = RatingScale.NUMBER;
}

export enum RatingRange {
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    TEN = '10'
}

export enum RatingScale {
    NUMBER = 'number',
    SMILEY = 'smiley',
    STAR = 'star'
}

export enum ShuffleOptions {
    NONE = 'none',
    ALL = 'all',
    EXCEPT_LAST = 'exceptLast'
}
export enum QuestionType {
    ADDRESS = 'address',
    CTA = 'cta',
    CONSENT = 'consent',
    DATE = 'date',
    FILE_UPLOAD = 'fileUpload',
    MATRIX = 'matrix',
    MULTIPLE_CHOICE_MULTI = 'multipleChoiceMulti',
    MULTIPLE_CHOICE_SINGLE = 'multipleChoiceSingle',
    NPS = 'nps',
    OPEN_TEXT = 'openText',
    PICTURE_SELECTION = 'pictureSelection',
    RATING = 'rating',
    CAL = 'cal',
    RANKING = 'ranking',
    CONTACT_INFO = 'contactInfo'
}

export enum SurveyStatus {
    DRAFT = 'draft',
    IN_PROGRESS = 'inProgress',
    PAUSED = 'paused',
    COMPLETED = 'completed'
}
export enum SurveyType {
    LINK = 'link',
    APP = 'app'
}

export function loadConfig(configPath: string = 'config.json'): AppConfig {
    const fullPath = path.resolve(process.cwd(), configPath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Configuration file not found at ${fullPath}`);
    }
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed as AppConfig;
}