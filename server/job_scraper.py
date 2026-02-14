import csv
from jobspy import scrape_jobs

def search_jobs(query, location="Remote", distance=25, job_type="fulltime", results_wanted=20):
    """
    Integrates JobSpy to scrape jobs from LinkedIn, Indeed, Glassdoor, and ZipRecruiter.
    """
    try:
        jobs = scrape_jobs(
            site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
            search_term=query,
            location=location,
            distance=distance,
            job_type=job_type,
            results_wanted=results_wanted,
            hours_old=72,
        )
        
        print(f"Found {len(jobs)} jobs for '{query}'")
        return jobs
    except Exception as e:
        print(f"Error scraping jobs: {e}")
        return None

if __name__ == "__main__":
    # Test run
    results = search_jobs("Product Designer")
    if results is not None:
        print(results.head())
