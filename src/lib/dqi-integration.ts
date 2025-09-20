export function dqiToTenScale(dqiScore: number): number {
  // Convert 0-100 to 0-10 scale
  return Math.round((dqiScore / 10) * 10) / 10;
}

export function dqiToStars(dqiScore: number): number {
  // Keep existing for star display (0-5 scale)
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
  const tenScale = dqiToTenScale(score);
  const grade = getDQIGrade(score);
  const stars = dqiToStars(score);
  return `${tenScale}/10 (${grade}) - ${stars} stars`;
}