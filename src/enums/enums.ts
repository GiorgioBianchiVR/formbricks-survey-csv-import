export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    URL = 'url',
    NUMBER = 'number',
    PHONE = 'phone'
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