import json
import sys
from jobspy import scrape_jobs
from thefuzz import fuzz

def search_jobs(query, platform="linkedin", location="Remote", distance=25, job_type="fulltime", results_wanted=40):
    """
    Integrates JobSpy to scrape jobs from LinkedIn, Indeed, Glassdoor, and ZipRecruiter.
    """
    try:
        site_name = [platform] if platform in ["indeed", "linkedin", "zip_recruiter", "glassdoor"] else ["linkedin"]
        
        print(f"Scraping {site_name} for '{query}' in '{location}'", file=sys.stderr)

        jobs = scrape_jobs(
            site_name=site_name,
            search_term=query,
            location=location,
            distance=distance,
            job_type=job_type,
            results_wanted=results_wanted,
            hours_old=72,
            description_format="markdown",
            linkedin_fetch_description=True,
        )
        
        if jobs.empty:
            print(f"No jobs found for query: {query}", file=sys.stderr)
            return []

        # Convert pandas DataFrame to list of dictionaries
        jobs_list = jobs.to_dict(orient='records')
        
        # Clean up NaN values and calculate match score
        for job in jobs_list:
            # Handle NaN values for JSON serialization
            for key, value in job.items():
                if isinstance(value, float) and (value != value): # check for NaN
                    job[key] = None
                elif hasattr(value, 'isoformat') and callable(getattr(value, 'isoformat')): # handle timestamps
                    job[key] = value.isoformat()
            
            # Calculate match score based on title and company
            title = str(job.get('title') or "").lower()
            company = str(job.get('company') or "").lower()
            search_query = query.lower()
            
            # Perfect match if query is exactly in title
            if search_query in title:
                score = 100
            else:
                # Fuzzy match score
                score = fuzz.partial_ratio(search_query, title)
                # Add a small bonus for company match if any
                if company and search_query in company:
                    score += 10
            
            job['match_score'] = score

        # Sort jobs by match score descending
        jobs_list.sort(key=lambda x: x.get('match_score', 0), reverse=True)

        return jobs_list
    except Exception as e:
        print(f"Error scraping jobs: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    if len(sys.argv) > 3:
        query = sys.argv[1]
        platform = sys.argv[2]
        location = sys.argv[3]
        results = search_jobs(query, platform=platform, location=location)
        print(json.dumps(results))
    elif len(sys.argv) > 2:
        query = sys.argv[1]
        platform = sys.argv[2]
        results = search_jobs(query, platform=platform)
        print(json.dumps(results))
    elif len(sys.argv) > 1:
        query = sys.argv[1]
        results = search_jobs(query)
        print(json.dumps(results))
    else:
        print(json.dumps([]))
