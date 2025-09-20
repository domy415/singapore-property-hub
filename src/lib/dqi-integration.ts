export function dqiToStars(dqiScore: number): number {
  return Math.round((dqiScore / 20) * 10) / 10;
}

export function getDQIGrade(dqiScore: number): string {
  if (dqiScore >= 85) return 'Excellent';
  if (dqiScore >= 70) return 'Good';
  if (dqiScore >= 55) return 'Average';
  if (dqiScore >= 40) return 'Below Average';
  return 'Poor';
}

export function formatDQIScore(score: number): string {
  const grade = getDQIGrade(score);
  const stars = dqiToStars(score);
  return `${stars}/5 stars (DQI: ${score}/100 - ${grade})`;
}