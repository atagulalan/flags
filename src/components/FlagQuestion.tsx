import { Question } from '@/types';
import { MultipleChoice } from './MultipleChoice';
import { TypeAnswer } from './TypeAnswer';
import { SelectFlag } from './SelectFlag';

interface FlagQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  feedback: 'correct' | 'incorrect' | null;
  onNext: () => void;
  flagSize?: 'small' | 'medium' | 'large';
}

export const FlagQuestion = ({ question, onSubmit, feedback, onNext, flagSize = 'medium' }: FlagQuestionProps) => {
  switch (question.mode) {
    case 'multiple-choice':
      return (
        <MultipleChoice
          question={question}
          onSubmit={onSubmit}
          feedback={feedback}
          flagSize={flagSize}
        />
      );
    case 'type-answer':
      return (
        <TypeAnswer
          question={question}
          onSubmit={onSubmit}
          feedback={feedback}
          onNext={onNext}
          flagSize={flagSize}
        />
      );
    case 'select-flag':
      return (
        <SelectFlag
          question={question}
          onSubmit={onSubmit}
          feedback={feedback}
          flagSize={flagSize}
        />
      );
    default:
      return null;
  }
};

