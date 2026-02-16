import json
import sys
from jobspy import scrape_jobs

def search_jobs(query, platform="linkedin", location="Remote", distance=25, job_type="fulltime", results_wanted=40):
    """
    Integrates JobSpy to scrape jobs from LinkedIn, Indeed, Glassdoor, and ZipRecruiter.
    """
    try:
        site_name = [platform] if platform in ["indeed", "linkedin", "zip_recruiter", "glassdoor"] else ["linkedin"]
        
        jobs = scrape_jobs(
            site_name=site_name,
            search_term=query,
            location=location,
            distance=distance,
            job_type=job_type,
            results_wanted=results_wanted,
            hours_old=72,
            description_format="markdown",
            linkedin_fetch_description=True, # Fetch descriptions for LinkedIn
        )
        
        # Convert pandas DataFrame to list of dictionaries
        jobs_list = jobs.to_dict(orient='records')
        
        # Clean up NaN values for JSON serialization
        for job in jobs_list:
            for key, value in job.items():
                if isinstance(value, float) and (value != value): # check for NaN
                    job[key] = None
                elif hasattr(value, 'isoformat') and callable(getattr(value, 'isoformat')): # handle timestamps
                    job[key] = value.isoformat()

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
