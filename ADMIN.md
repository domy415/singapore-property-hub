# Admin Dashboard Documentation

## Overview
The Singapore Property Hub admin dashboard provides comprehensive lead management and analytics functionality.

## Access
- **URL**: `/admin`
- **Login**: `/admin/login`
- **Default Password**: `singapore-property-2025` (configurable via `ADMIN_PASSWORD` environment variable)

## Features

### 🔐 Authentication
- Password-protected access
- Session-based authentication with 24-hour expiration
- Rate limiting (5 attempts per 15 minutes)
- Automatic logout on session expiry

### 📊 Lead Statistics Dashboard
- **Total Leads**: Complete count of captured leads
- **Category Breakdown**: HOT/WARM/COLD lead distribution with percentages
- **Average Score**: Overall lead quality metric
- **Real-time Updates**: Statistics update with filtering

### 📋 Lead Management Table
**Features:**
- Sortable columns (Name, Email, Score, Date)
- Category filtering (HOT/WARM/COLD)
- Search functionality (Name, Email, Phone)
- Pagination (20 leads per page)
- Color-coded categories and scores

**Data Displayed:**
- Name & Property Journey
- Email Address
- Phone Number
- Lead Score (0-100)
- Category (HOT/WARM/COLD)
- Date Created

### 📥 CSV Export
- Export all leads or filtered results
- Includes all lead data fields
- Automatic filename with timestamp
- Date range filtering available

## Lead Scoring System

### Categories
- **HOT** (80+ points): High-intent leads, immediate follow-up
- **WARM** (50-79 points): Qualified leads, regular nurturing
- **COLD** (0-49 points): Early-stage leads, long-term nurturing

### Scoring Criteria
- **Property Journey** (40 points max):
  - "Actively viewing properties": 40 points
  - "Planning in next 3 months": 30 points  
  - "Researching options": 20 points
  - "Just browsing": 10 points

- **Budget** (25 points max):
  - "Above $2M": 25 points
  - "$1M - $2M": 20 points
  - "$500K - $1M": 15 points
  - "Below $500K": 10 points
  - "Not sure": 5 points

- **Financing** (20 points max):
  - "Pre-approved": 20 points
  - "Applying soon": 15 points
  - "Need guidance": 10 points
  - "Not ready": 5 points

- **Timeline** (15 points max):
  - "Within 1 month": 15 points
  - "1-3 months": 12 points
  - "3-6 months": 8 points
  - "6+ months": 5 points

## Security Features
- HTTP-only cookies for session management
- CSRF protection
- Rate limiting on login attempts
- Secure password validation
- Admin-only route protection

## Environment Configuration
```env
# Required for admin access
ADMIN_PASSWORD="your-secure-admin-password"
```

## API Endpoints

### Authentication
- `POST /api/admin/auth` - Login with password
- `GET /api/admin/auth` - Check authentication status
- `DELETE /api/admin/auth` - Logout

### Lead Management
- `GET /api/admin/leads` - Fetch leads with pagination and filtering
- `DELETE /api/admin/leads?id={leadId}` - Delete specific lead
- `GET /api/admin/leads/export` - Export leads to CSV

### Query Parameters for Lead Fetching
```
/api/admin/leads?
  page=1                    # Page number
  &limit=20                 # Items per page  
  &sortBy=createdAt         # Sort field (createdAt, score, name, email)
  &sortOrder=desc           # Sort direction (asc, desc)
  &category=HOT             # Filter by category (HOT/WARM/COLD)
  &search=john@email.com    # Search term
```

## Usage Examples

### Basic Admin Tasks
1. **View Dashboard**: Navigate to `/admin` and login
2. **Filter Hot Leads**: Select "HOT" from category filter
3. **Search Leads**: Enter name/email/phone in search box
4. **Export Data**: Click "Export CSV" button
5. **Sort by Score**: Click on "Score" column header

### Lead Analysis
- Monitor conversion rates by category percentages
- Track lead quality trends via average score
- Identify high-value leads with score sorting
- Analyze lead patterns with date filtering

## Performance
- Pagination for large lead lists
- Efficient database queries with indexing
- Real-time statistics calculation
- Optimized CSV export for large datasets

## Best Practices
1. **Regular Monitoring**: Check dashboard daily for new leads
2. **Quick Response**: Follow up on HOT leads within 24 hours  
3. **Data Export**: Weekly CSV exports for CRM integration
4. **Security**: Change default password in production
5. **Lead Scoring**: Review and adjust scoring criteria monthly

## Troubleshooting

### Common Issues
- **Can't Login**: Check password and rate limiting
- **No Leads Showing**: Verify database connection
- **Export Fails**: Check file permissions and disk space
- **Slow Loading**: Consider database indexing

### Error Messages
- `Authentication required`: Session expired, login again
- `Too many login attempts`: Wait 15 minutes or reset IP
- `Failed to fetch leads`: Database connectivity issue
- `Export failed`: Server or permission error

## Production Deployment
1. Set secure `ADMIN_PASSWORD` in environment
2. Enable HTTPS for secure authentication
3. Configure database with proper indexing
4. Set up monitoring for admin access logs
5. Implement backup strategy for lead data

## Development
- Admin routes are in `/app/admin/`
- Authentication logic in `/lib/admin-auth.ts`
- API endpoints in `/app/api/admin/`
- Styling uses Tailwind CSS classes