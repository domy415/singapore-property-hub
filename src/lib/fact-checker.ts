import fs from 'fs';
import path from 'path';

export interface FactCheckResult {
  accuracy_score: number;
  verified_facts: Array<{
    claim: string;
    status: 'verified' | 'unverified' | 'incorrect';
    source?: string;
  }>;
  issues: string[];
  recommendations: string[];
}

export async function factCheckCondoData(condoData: any): Promise<FactCheckResult> {
  const issues: string[] = [];
  const verified_facts: any[] = [];
  
  // Check for placeholder/generic data
  if (condoData.rating && typeof condoData.rating === 'number' && !condoData.ratingSource) {
    issues.push(`Rating ${condoData.rating} has no source - appears arbitrary`);
  }
  
  if (!condoData.dataSource) {
    issues.push('No data source citation provided');
  }
  
  if (!condoData.lastUpdated) {
    issues.push('No last updated date - data freshness unknown');
  }
  
  // Check for required fields
  const requiredFields = ['tenure', 'totalUnits', 'developer', 'currentPSF'];
  for (const field of requiredFields) {
    if (!condoData[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  }
  
  // Check for old arbitrary ratings (numbers without sources)
  if (typeof condoData.rating === 'number') {
    issues.push('Numerical rating without review source - likely arbitrary');
  }
  
  // Verify essential condo data
  if (condoData.soldPercentage === undefined) {
    issues.push('Missing sales percentage data');
  }
  
  // Check for data consistency
  if (condoData.priceMin && condoData.priceMax && condoData.priceMin > condoData.priceMax) {
    issues.push('Price range inconsistent: minimum price exceeds maximum price');
  }
  
  // Calculate accuracy score
  const accuracy_score = Math.max(0, 100 - (issues.length * 10));
  
  return {
    accuracy_score,
    verified_facts,
    issues,
    recommendations: issues.length > 0 ? ['Update with verified data from URA/PropertyGuru'] : []
  };
}

export async function enforceFactChecking(filePath: string): Promise<boolean> {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for common red flags
  const redFlags = [
    /arbitrary/i,
    /placeholder/i,
    /TODO/i,
    /FIXME/i,
    /fake data/i,
    /rating:\s*[\d.]+,?\s*$/m  // Numerical ratings without sources
  ];
  
  for (const flag of redFlags) {
    if (flag.test(content)) {
      console.error(`Found potential placeholder data in ${filePath}`);
      return false;
    }
  }
  
  return true;
}

export function validateCondoDataStructure(condoData: any): string[] {
  const errors: string[] = [];
  
  // Required fields for fact-checking compliance
  const requiredFields = [
    'dataSource',
    'lastUpdated', 
    'currentPSF',
    'soldPercentage',
    'tenure',
    'totalUnits',
    'developer'
  ];
  
  for (const field of requiredFields) {
    if (!condoData[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check rating format
  if (condoData.rating && typeof condoData.rating === 'number') {
    errors.push('Rating should be string "Pending actual reviews" instead of arbitrary number');
  }
  
  return errors;
}