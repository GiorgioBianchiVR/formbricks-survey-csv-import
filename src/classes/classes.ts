import { InputType, QuestionType, RatingRange, RatingScale, ShuffleOptions, SurveyStatus, SurveyType } from "../enums/enums";

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

export class Rating {
    public ratingRange: RatingRange = RatingRange.FIVE;
    public ratingScale: RatingScale = RatingScale.NUMBER;
}

export class ColumnNames {
    public idColumnName: string = 'q_id';
    public sectionColumnName: string = 'Sezione';
    public headlineColumnName: string = 'Testo_Migliorato';
    public typeColumnName: string = 'Tipo_Domanda';
    public optionsColumnName: string = 'Opzioni_Risposta';
    public requiredColumnName: string = 'Obbligatoria';
}