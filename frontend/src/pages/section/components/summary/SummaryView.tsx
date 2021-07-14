import { Score } from '@dto/response';
import { List, Card, Space } from 'antd';

export default function SummaryView(averageScore: Score) {
  return (
    <List grid={{ column: 4, gutter: 16 }}>
      <AverageScoreView field="Overall" score={averageScore.overallScore} />
      <AverageScoreView field="How easy it was" score={averageScore.easyness} />
      <AverageScoreView
        field="How much I learned"
        score={averageScore.learned}
      />
      <AverageScoreView
        field="How good teaching was"
        score={averageScore.teaching}
      />
    </List>
  );
}

const getBgColorByScore = (score: number) => {
  if (score >= 4.5) {
    return 'blue';
  }
  if (score >= 3.5) {
    return 'green';
  }
  if (score >= 2) {
    return 'yellow';
  }
  return 'red';
};

function AverageScoreView({ field, score }: { field: string; score: number }) {
  score = Math.round(score * 10) / 10;
  return (
    <Card size="small" title={field}>
      <Space
        style={{
          textAlign: 'center',
          margin: 'auto 0',
          backgroundColor: getBgColorByScore(score),
          color: 'white',
        }}
      >
        {score}
      </Space>
    </Card>
  );
}
