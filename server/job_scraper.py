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
