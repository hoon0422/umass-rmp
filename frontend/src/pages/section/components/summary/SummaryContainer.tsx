import { Rate, Score } from '@dto/response';
import SummaryView from './SummaryView';

export default function SummaryContainer({ rates }: { rates: Rate[] }) {
  const averageScore = rates.reduce(
    (acc, r) => ({
      overallScore: acc.overallScore + r.overallScore / rates.length,
      easyness: acc.easyness + r.easyness / rates.length,
      learned: acc.learned + r.learned / rates.length,
      teaching: acc.teaching + r.teaching / rates.length,
    }),
    {} as Score,
  );
  return <SummaryView {...averageScore} />;
}
